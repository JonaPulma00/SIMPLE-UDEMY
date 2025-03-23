from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.controllers.auth_controller import register_user, authenticate_user, refresh_access_token, logout_user
from app.db.database import get_db
from app.schemas.user import UserCreate, UserLogin, Token, RefreshTokenRequest, AccessTokenResponse
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

@router.post("/register")
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    await register_user(db, user)
    return {"success": True, "message": "User successfully registered"}

@router.post("/login", response_model=Token)
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    return await authenticate_user(db, user.username, user.password)
 
@router.post("/refresh", response_model=AccessTokenResponse)
async def refresh(data: RefreshTokenRequest):
    return await refresh_access_token(data.refresh_token)

@router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    return await logout_user(token)
