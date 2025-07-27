from fastapi import FastAPI
from fastapi.exceptions import HTTPException, RequestValidationError
from starlette.middleware.cors import CORSMiddleware
from core.config import settings
from contextlib import asynccontextmanager
from core.errors import validation_exception_handler, http_exception_handler
from routes.auth import router as auth_router
from routes.categories import router as categories_router
from core.utils import load_translations

@asynccontextmanager
async def lifespan(_app: FastAPI):
    load_translations()
    yield

app = FastAPI(lifespan=lifespan, redirect_slashes=False)
app.add_middleware(CORSMiddleware, allow_origins=settings.ORIGINS, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)

# ===== Router Registration =====

app.include_router(auth_router)
app.include_router(categories_router)