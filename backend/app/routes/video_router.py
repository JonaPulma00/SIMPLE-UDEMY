from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.utils.video_handler import VideoUploader
from app.middlewares.authorization import verify_instructor
from app.controllers.lesson_controller import update_lesson_video

router = APIRouter()
video_uploader = VideoUploader()

@router.post("/courses/{course_id}/sections/{section_id}/lessons/{lesson_id}/upload")
async def upload_lesson_video(
    course_id: str,
    section_id: str,
    lesson_id: str,
    video: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_instructor)
):
    video_path = await video_uploader.upload_to_ec2(
        video_file=video,
        course_id=course_id,
        section_id=section_id,
        lesson_id=lesson_id
    )
    

    await update_lesson_video(db, lesson_id, video_path)
    
    return {"message": "Video uploaded successfully", "path": video_path} 