from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.controllers import stream_controller
from app.schemas.stream import StreamCreate, StreamResponse, MessageCreate, MessageResponse
from app.middlewares.authenticate_token import verify_token
from app.middlewares.authorization import verify_instructor
from typing import List

router = APIRouter()


@router.post("/", response_model=StreamResponse, status_code=status.HTTP_201_CREATED)
async def create_stream(
    stream_data: StreamCreate,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_instructor)
):
    user_id = token_payload.get("user_id")
    return await stream_controller.create_stream(db, stream_data, user_id)


@router.get("/{stream_id}", response_model=StreamResponse)
async def get_stream(
    stream_id: str,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_token)
):
    return await stream_controller.get_stream(db, stream_id)


@router.put("/{stream_id}/end", response_model=StreamResponse)
async def end_stream(
    stream_id: str,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_instructor)
):
    user_id = token_payload.get("user_id")
    return await stream_controller.end_stream(db, stream_id, user_id)

@router.get("/instructor/{instructor_id}", response_model=List[StreamResponse])
async def get_instructor_streams(
    instructor_id: str,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_token)
):
    return await stream_controller.get_instructor_streams(db, instructor_id)


@router.get("/course/{course_id}", response_model=List[StreamResponse])
async def get_course_streams(
    course_id: str,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_token)
):
    return await stream_controller.get_course_streams(db, course_id)


@router.post("/{stream_id}/messages", response_model=MessageResponse)
async def add_message(
    stream_id: str,
    message_data: MessageCreate,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_token)
):
    user_id = token_payload.get("user_id")
    return await stream_controller.add_stream_message(db, stream_id, user_id, message_data.message)


@router.get("/{stream_id}/messages", response_model=List[MessageResponse])
async def get_stream_messages(
    stream_id: str,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_token)
):
    return await stream_controller.get_stream_messages(db, stream_id)
