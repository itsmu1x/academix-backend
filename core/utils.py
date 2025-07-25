import secrets
import string
import os
import json

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from core.config import settings
from fastapi import HTTPException, Request

from core.db import asyncsession
from models.auth import Role, Session
from hashlib import sha256
from datetime import datetime

def random_string(length: int = 48) -> str:
    characters = string.ascii_letters + string.digits
    return "".join(secrets.choice(characters) for _ in range(length))

TRANSLATIONS = {}

def load_translations():
    global TRANSLATIONS
    base_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'translations')
    for lang in settings.SUPPORTED_LANGUAGES:
        path = os.path.join(base_path, f'{lang}.json')
        try:
            with open(path, 'r', encoding='utf-8') as f:
                TRANSLATIONS[lang] = json.load(f)
        except Exception:
            TRANSLATIONS[lang] = {}

def get_translation(key: str, lang: str) -> str:
    return TRANSLATIONS[lang].get(key) or key

def get_language_from_request(request: Request) -> str:
    language = request.headers.get('x-language')
    if language and language in settings.SUPPORTED_LANGUAGES:
        return language    
    return settings.DEFAULT_LANGUAGE

async def get_current_session(session_id: str | None):
    async with asyncsession() as db:
        if session_id is None:
            return None
        
        result = await db.execute(select(Session).options(joinedload(Session.user)).where(Session.id == sha256(session_id.encode()).hexdigest()))
        session = result.scalar_one_or_none()
        if session is None:
            return None

        if session.expires_at and session.expires_at < datetime.now():
            await db.delete(session)
            await db.commit()
            return None

        return session

async def get_default_role(db: AsyncSession):
    result = await db.execute(select(Role).where(Role.is_default == True))
    role = result.scalar_one_or_none()
    if role is None:
        raise HTTPException(status_code=500, detail="default_role_not_found")
    return role