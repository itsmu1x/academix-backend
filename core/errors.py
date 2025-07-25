from fastapi.exceptions import HTTPException, RequestValidationError
from starlette.responses import JSONResponse
from fastapi.requests import Request
from core.utils import get_translation, get_language_from_request

async def http_exception_handler(request: Request, exc: HTTPException):
    lang = get_language_from_request(request)
    message = get_translation(exc.detail, lang) if isinstance(exc.detail, str) else str(exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": message}
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    lang = get_language_from_request(request)
    return JSONResponse(
        status_code=422,
        content={"message": get_translation("invalid_request_body", lang), "errors": exc.errors()}
    )