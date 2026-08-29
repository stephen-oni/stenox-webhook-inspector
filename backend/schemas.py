from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordSubmit(BaseModel):
    token: str
    new_password: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    profile_picture_url: Optional[str]
    endpoint_id: str
    class Config:
        from_attributes = True

class WebhookRequestResponse(BaseModel):
    id: int
    endpoint_id: str
    http_method: str
    headers: str
    body: str
    remote_ip: str
    created_at: datetime
    class Config:
        from_attributes = True