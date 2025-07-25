from core.config import settings
from core.utils import get_current_session, get_default_role, random_string, get_language_from_request
from schemas.auth import LoginPayload, LoginResponse, RegisterResponse, UserPayload, UserResponse
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from core.db import AsyncSession, get_db
from core.responses import success
from models.auth import Session, User
from bcrypt import hashpw, checkpw, gensalt
from hashlib import sha256
from datetime import datetime, timedelta

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=RegisterResponse)
async def register(request: Request, payload: UserPayload, db: AsyncSession = Depends(get_db)):
    current = await get_current_session(request.cookies.get(settings.COOKIE_NAME))
    if current is not None:
        raise HTTPException(status_code=400, detail="already_logged_in")
    
    lang = get_language_from_request(request)
    result = await db.execute(select(User).where(User.email == payload.email))
    if result.scalar_one_or_none() is not None:
        raise HTTPException(status_code=400, detail="email_in_use")
    
    role = await get_default_role(db)
    user = User(
        name = payload.name,
        password = hashpw(payload.password.encode(), gensalt()).decode(),
        email = payload.email,
        role_id = role.id
    )
    db.add(user)
    await db.flush()

    id = random_string()
    session = Session(
        id = sha256(id.encode()).hexdigest(),
        user_id = user.id,
        expires_at = datetime.now() + timedelta(seconds=settings.SESSION_LIFETIME_FULL if payload.remember else settings.SESSION_LIFETIME_MINI)
    )
    db.add(session)
    await db.commit()

    response = success("user_created", UserResponse.model_validate(user).model_dump(), 201, lang)
    response.set_cookie(key=settings.COOKIE_NAME, value=id, httponly=True, secure=False, samesite="lax", max_age=settings.COOKIE_MAX_AGE)
    return response


@router.post("/login", response_model=LoginResponse)
async def login(request: Request, payload: LoginPayload, db: AsyncSession = Depends(get_db)):
    current = await get_current_session(request.cookies.get(settings.COOKIE_NAME))
    if current is not None:
        raise HTTPException(status_code=400, detail="already_logged_in")

    lang = get_language_from_request(request)
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=400, detail="invalid_credentials")
    
    if not checkpw(payload.password.encode(), user.password.encode()):
        raise HTTPException(status_code=400, detail="invalid_credentials")
    
    id = random_string()
    session = Session(
        id = sha256(id.encode()).hexdigest(),
        user_id = user.id,
        expires_at = datetime.now() + timedelta(seconds=settings.SESSION_LIFETIME_FULL if payload.remember else settings.SESSION_LIFETIME_MINI)
    )
    db.add(session)
    await db.commit()

    response = success("logged_in", UserResponse.model_validate(user).model_dump(), lang=lang)
    response.set_cookie(key=settings.COOKIE_NAME, value=id, httponly=True, secure=False, samesite="lax", max_age=settings.COOKIE_MAX_AGE)
    return response


@router.post("/logout")
async def logout(request: Request):
    lang = get_language_from_request(request)
    response = success("logged_out", lang=lang)
    response.delete_cookie(key=settings.COOKIE_NAME)
    return response

@router.get("/me", response_model=UserResponse)
async def me(request: Request, db: AsyncSession = Depends(get_db)):
    id = request.cookies.get(settings.COOKIE_NAME)
    session = await get_current_session(id)
    if session is None:
        raise HTTPException(status_code=401, detail="unauthorized")

    return session.user
