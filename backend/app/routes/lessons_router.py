from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import StreamingResponse
from app.utils.video_handler import VideoHandler
from app.middlewares.authenticate_token import verify_token
from typing import Dict
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.middlewares.authorization import verify_instructor
from app.controllers.lesson_controller import add_lesson_to_section, update_lesson_video, get_lesson_video
from app.schemas.course import LessonCreate

router = APIRouter()
video_handler = VideoHandler()

@router.post("/create-lesson/{course_id}/sections/{section_id}")
async def create_lesson(
    course_id: str,
    section_id: str,
    lesson_data: LessonCreate,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_instructor)
):
    return await add_lesson_to_section(db, course_id, section_id, token_payload["uuid"], lesson_data.model_dump())

@router.post("/upload-video/{course_id}/sections/{section_id}/lessons/{lesson_id}/video")
async def upload_video(
    course_id: str,
    section_id: str,
    lesson_id: str,
    video: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_instructor)
):
    if not video.content_type.startswith("video/"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File must be a video")
    
    return await update_lesson_video(db, lesson_id, video, course_id, section_id)

@router.get("/get-video/{lesson_id}/video")
async def get_lesson_video_route(
    lesson_id: str,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_token)
):
    return await get_lesson_video(db, lesson_id) 