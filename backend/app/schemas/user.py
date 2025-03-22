from pydantic import BaseModel, EmailStr, validator, model_validator
from typing import Optional
import re

class UserCreate(BaseModel):
  username: str
  email: EmailStr
  password: str
  is_instructor: Optional[bool] = False

  @validator('username')
  def trim_username(cls, v):
    return v.strip()

  @validator('password')
  def validate_password(cls, v):
    if not v:
      raise ValueError('Password cannot be empty')
    if len(v) < 8:
      raise ValueError('Password must be at least 8 characters long')
    if not re.search(r'[A-Z]', v):
      raise ValueError('Password must contain at least one uppercase letter')
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
      raise ValueError('Password must contain at least one special character')
    return v.strip()

  @validator('email')
  def trim_email(cls, v):
    return v.strip()

class UserLogin(BaseModel):
    username: str
    password: str

    @model_validator(mode='before')
    def trim_fields(cls, values):
        return {k: v.strip() if isinstance(v, str) else v for k, v in values.items()}

    @validator('password')
    def validate_password_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Password cannot be empty')
        return v

class Token(BaseModel):
    access_token: str
    refresh_token: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class AccessTokenResponse(BaseModel):
    access_token: str
