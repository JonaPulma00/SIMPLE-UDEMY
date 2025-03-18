from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status
import uuid
from app.db.models import User
from app.schemas.user import UserCreate, UserLogin
from app.utils.security import get_password_hash, verify_password, create_access_token, create_refresh_token
import logging

logger = logging.getLogger(__name__)

async def register_user(db: AsyncSession, user: UserCreate):
  stmt = select(User).filter(User.email == user.email)
  result = await db.execute(stmt)
  existing_user = result.scalar_one_or_none()

  if existing_user:
    logger.warning(f"Tried to register with the same email: {user.email}")
    raise HTTPException(status_code=400, detail="Email already registered")
  
  hashed_password = get_password_hash(user.password)
  db_user = User(
    user_id=str(uuid.uuid4()),
    username=user.username,
    email=user.email,
    password=hashed_password,
    is_instructor=user.is_instructor
  )

  db.add(db_user)
  await db.commit()
  await db.refresh(db_user)

  logger.info(f"User registered: {user.email}")

  return db_user


async def authenticate_user(db: AsyncSession, username: str, password: str):
    stmt = select(User).filter(User.username == username)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(password, user.password):
        logger.warning(f"Login attempt failed: {username}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credentials not found")
    
    return user