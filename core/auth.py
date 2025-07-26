from datetime import datetime, timedelta
from hashlib import sha256
from fastapi.responses import RedirectResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from core.config import settings
from core.utils import get_current_session, get_default_role, random_string
from models.auth import Session, User
import requests
import jwt

async def get_user(session: Session | None, prop: str, profile: dict, db: AsyncSession):
    if session is not None:
        if getattr(session.user, prop) is not None:
            return None
        else:
            stmt = select(User).where(User.id == session.user_id)
            result = await db.execute(stmt)
            user = result.scalars().first()
            if user is None:
                return None

            setattr(user, prop, profile["id"])
            await db.commit()
            return user

    stmt = select(User).where(getattr(User, prop) == profile["id"])
    result = await db.execute(stmt)
    user = result.scalars().first()
    if user is not None:
        return user

    stmt = select(User).where(User.email == profile["email"])
    result = await db.execute(stmt)
    user = result.scalars().first()
    if user is not None:
        if getattr(user, prop) is None:
            setattr(user, prop, profile["id"])
            await db.commit()
        return user

    default_role = await get_default_role(db)
    user = User(
        email = profile["email"],
        name = profile["name"],
        role_id = default_role.id,
        **{prop: profile["id"]}
    )
    db.add(user)
    await db.commit()
    return user

async def authenticate(session_id: str | None, prop: str, profile: dict, db: AsyncSession):
    try:
        session = await get_current_session(session_id)
        user = await get_user(session, prop, profile, db)
        if user is None:
            return RedirectResponse(url=f"{settings.FRONTEND_ORIGIN}/?error_code=sww")
        
        id = random_string()
        if session_id is None:
            session = Session(
                id = sha256(id.encode()).hexdigest(),
                user_id = user.id,
                expires_at = datetime.now() + timedelta(seconds=settings.SESSION_LIFETIME_FULL)
            )
            db.add(session)
            await db.commit()

        response = RedirectResponse(url=settings.FRONTEND_ORIGIN)
        if session_id is None:
            response.set_cookie(key=settings.COOKIE_NAME, value=id, httponly=True, secure=False, samesite="lax", max_age=settings.SESSION_LIFETIME_FULL)
        return response
    except Exception:
        return RedirectResponse(url=f"{settings.FRONTEND_ORIGIN}/?error_code=sww")

async def githubize(code: str):
    try:
        response = requests.post(f"https://github.com/login/oauth/access_token?client_id={settings.GITHUB_CLIENT_ID}&client_secret={settings.GITHUB_CLIENT_SECRET}&code={code}", headers={"Accept": "application/json"})
        data = response.json()
        res2 = requests.get(f"https://api.github.com/user", headers={"Authorization": f"Bearer {data['access_token']}", "Accept": "application/json"})
        user = res2.json()
        res3 = requests.get(f"https://api.github.com/user/emails", headers={"Authorization": f"Bearer {data['access_token']}", "Accept": "application/json"})
        emails = res3.json()
        email = emails[0]["email"]

        if email is None:
            return None

        return {
            "provider": "github",
            "id": str(user["id"]),
            "email": email,
            "name": user["name"]
        }
    except Exception:
        return None

async def linkedinize(code: str):
    try:
        response = requests.post(f"https://www.linkedin.com/oauth/v2/accessToken", data={
            "client_id": settings.LINKEDIN_CLIENT_ID,
            "client_secret": settings.LINKEDIN_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": f"{settings.ORIGIN}/auth/linkedin/callback"
        }, headers={"Accept": "application/json"})
        data = response.json()
        data = jwt.decode(data["id_token"], options={"verify_signature": False})
        
        return {
            "provider": "linkedin",
            "id": data["sub"],
            "email": data["email"],
            "name": data["given_name"] if data["given_name"] is not None else data["name"]
        }
    except Exception:
        return None

async def googleize(code: str):
    try:
        response = requests.post(f"https://oauth2.googleapis.com/token", data={
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": f"{settings.ORIGIN}/auth/google/callback"
        }, headers={"Accept": "application/json"})
        data = response.json()

        access_token = data["access_token"]
        res2 = requests.get(f"https://www.googleapis.com/oauth2/v1/userinfo", headers={"Authorization": f"Bearer {access_token}"})
        user = res2.json()
        
        return {
            "provider": "google",
            "id": str(user["id"]),
            "email": user["email"],
            "name": user["given_name"] if user["given_name"] is not None else user["name"]
        }
    except Exception:
        return None