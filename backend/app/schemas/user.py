from pydantic import BaseModel, EmailStr, field_validator, model_validator
from typing import Optional
import re

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    is_instructor: Optional[bool] = False
    pending_validation: Optional[bool] = False

    @field_validator('username', mode='before')
    def validate_username(cls, v):
        v = v.strip()
        if not v:
            raise ValueError('Username cannot be empty')
        if len(v) > 50:
            raise ValueError('Username must be less than 50 characters')
        return v

    @field_validator('email', mode='before')
    def validate_email(cls, v):
        v = v.strip()
        if not v:
            raise ValueError('Email cannot be empty')
        if len(v) > 100:
            raise ValueError('Email must be less than 100 characters')
        return v
    @field_validator('email', mode='before')
    def validate_email_format(cls, v):
        if not re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', v):
            raise ValueError('Email must be a valid email address')
        return v

    @field_validator('password', mode='before')
    def validate_password(cls, v):
        v = v.strip()
        if not v:
            raise ValueError('Password cannot be empty')
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v


class UserLogin(BaseModel):
    username: str
    password: str

    @model_validator(mode='before')
    def trim_fields(cls, values):
        return {k: v.strip() if isinstance(v, str) else v for k, v in values.items()}

    @field_validator('password', mode='before')
    def validate_password_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Password cannot be empty')
        return v


class UserUpdate(BaseModel):
    bio: Optional[str] = None
    profile_picture: Optional[str] = None

    @field_validator('bio', mode='before')
    def validate_bio(cls, v):
        if v:
            v = v.strip()
            if len(v) > 500:
                raise ValueError('Bio must be less than 500 characters')
        return v

    @field_validator('profile_picture', mode='before')
    def trim_profile_picture(cls, v):
        return v.strip() if v else v


class Token(BaseModel):
    access_token: str
    refresh_token: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class AccessTokenResponse(BaseModel):
    access_token: str
