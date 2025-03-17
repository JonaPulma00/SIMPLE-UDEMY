from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.controllers.auth_controller import register_user, authenticate_user
from app.db.database import get_db
from app.schemas.user import UserCreate, UserLogin, Token
from app.utils.security import create_access_token, create_refresh_token

router = APIRouter()

# Register
@router.post("/register", response_model=Token)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
  db_user = await register_user(db,user)
  access_token = create_access_token({"sub": db_user.user_id})
  refresh_token = create_refresh_token({"sub": db_user.user_id})
  return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

# Login 
@router.post("/login", response_model=Token)
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
  db_user = await authenticate_user(db, user.username, user.password)
  access_token = create_access_token({"sub": db_user.user_id})
  refresh_token = create_refresh_token({"sub": db_user.user_id})
  return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

# Refresh token
@router.post("/refresh", response_model=Token)
async def refresh(refresh_token: str):
  try:
    payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
    user_id = payload.get("sub")
    if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    new_tokens = {
            "access_token": create_access_token({"sub": user_id}),
            "refresh_token": create_refresh_token({"sub": user_id}),
            "token_type": "bearer"
    }
    return new_tokens
  except jwt.PyJWTError:
     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")