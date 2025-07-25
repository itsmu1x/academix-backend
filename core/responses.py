from fastapi.responses import ORJSONResponse
from core.utils import get_translation
from typing import Any

def success(message_key: str, data: Any = None, status_code: int = 200, lang: str = None):
    message = get_translation(message_key, lang)
    return ORJSONResponse(
        status_code=status_code,
        content={"message": message, "data": data}
    )
