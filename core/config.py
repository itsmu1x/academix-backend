from pydantic_settings import BaseSettings

from core.permissions import make_permission

class Settings(BaseSettings):
    DATABASE_URL: str
    COOKIE_NAME: str = "__academix_session"
    COOKIE_MAX_AGE: int = 60*60*24*30
    SUPPORTED_LANGUAGES: list[str] = ["en", "ar"]
    DEFAULT_LANGUAGE: str = "en"
    SESSION_LIFETIME_MINI: int = 60*60*24*14
    SESSION_LIFETIME_FULL: int = 60*60*24*30
    ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    PERMISSIONS: dict[str, int] = {
        "perm1": make_permission(0),
        "perm2": make_permission(1),
        "perm3": make_permission(2)
    }

    class Config:
        env_file = ".env"

settings = Settings()