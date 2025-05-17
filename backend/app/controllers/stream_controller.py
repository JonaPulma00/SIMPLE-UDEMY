from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.sql import func
from fastapi import HTTPException, status
import uuid
from app.db.models import Stream, User, StreamMessage
from app.schemas.stream import StreamCreate, StreamResponse
from datetime import datetime, timezone

async def create_stream(db: AsyncSession, stream_data: StreamCreate, user_id: str):
  user_query = select(User).filter(User.id == user_id)
  user_result = await db.execute(user_query)
  user = user_result.scalars().first()

  if not user:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
  
  if not user.is_instructor:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Only instructor can create streams")
  
  new_stream = Stream(
    stream_id=str(uuid.uuid4()),
    intructor_id=user_id,
    course_id=stream_data.course_id,
    title=stream_data.title,
    started_at=datetime.now(timezone.utc)
  )

  db.add(new_stream)
  await db.commit()
  await db.refresh(new_stream)

  return new_stream
