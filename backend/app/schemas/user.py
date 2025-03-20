from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
  username: str
  email: EmailStr
  password: str
  is_instructor: Optional[bool] = False

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str