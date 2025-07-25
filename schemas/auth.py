from pydantic import BaseModel, Field, EmailStr
from datetime import datetime

from schemas.general import Response

class LoginPayload(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=64)
    remember: bool = Field(default=False)

class UserPayload(LoginPayload):
    name: str = Field(min_length=3, max_length=32)

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class RegisterResponse(Response):
    data: UserResponse

class LoginResponse(Response):
    data: UserResponse
