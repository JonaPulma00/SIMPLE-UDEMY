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
    instructor_id=user_id,
    course_id=stream_data.course_id,
    title=stream_data.title,
    started_at=datetime.now(timezone.utc)
  )

  db.add(new_stream)
  await db.commit()
  await db.refresh(new_stream)

  return new_stream

async def get_stream(db: AsyncSession, stream_id: str):
    stream_query = select(Stream).where(Stream.stream_id == stream_id)
    stream_result = await db.execute(stream_query)
    stream = stream_result.scalars().first()

    if not stream:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stream not found")
    
    return stream

async def end_stream(db: AsyncSession, stream_id: str, user_id: str):
    stream_query = select(Stream).where(Stream.stream_id == stream_id)
    stream_result = await db.execute(stream_query)
    stream = stream_result.scalars().first()
    
    if not stream:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stream not found"
        )
    
    if stream.instructor_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the stream creator can end the stream"
        )
    
    if stream.ended_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stream has already ended"
        )
    
    stream.ended_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(stream)
    
    return stream

async def get_instructor_streams(db: AsyncSession, instructor_id: str):
    streams_query = select(Stream).where(
        Stream.instructor_id == instructor_id
    ).order_by(Stream.started_at.desc())
    
    streams_result = await db.execute(streams_query)
    streams = streams_result.scalars().all()
    
    return streams

async def get_course_streams(db: AsyncSession, course_id: str):
    streams_query = select(Stream).where(
        Stream.course_id == course_id
    ).order_by(Stream.started_at.desc())
    
    streams_result = await db.execute(streams_query)
    streams = streams_result.scalars().all()
    
    return streams

async def add_stream_message(db: AsyncSession, stream_id: str, user_id: str, message: str):

    stream_query = select(Stream).where(Stream.stream_id == stream_id)
    stream_result = await db.execute(stream_query)
    stream = stream_result.scalars().first()
    
    if not stream:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stream not found"
        )
    
    if stream.ended_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot add message to an ended stream"
        )
    

    new_message = StreamMessage(
        message_id=str(uuid.uuid4()),
        stream_id=stream_id,
        user_id=user_id,
        message=message,
        sent_at=datetime.now(timezone.utc)
    )
    
    db.add(new_message)
    await db.commit()
    await db.refresh(new_message)
    
    return new_message

async def get_stream_messages(db: AsyncSession, stream_id: str):
    messages_query = select(StreamMessage).where(
        StreamMessage.stream_id == stream_id
    ).order_by(StreamMessage.sent_at)
    
    messages_result = await db.execute(messages_query)
    messages = messages_result.scalars().all()
    
    return messages