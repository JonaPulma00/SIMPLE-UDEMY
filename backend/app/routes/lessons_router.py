from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import StreamingResponse
from app.utils.video_handler import VideoUploader
from app.utils.security import verify_token
from typing import Dict
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()
video_uploader = VideoUploader()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/{course_id}/{section_id}/{lesson_id}/upload-video")
async def upload_lesson_video(
    course_id: int,
    section_id: int,
    lesson_id: int,
    video: UploadFile = File(...),
    token: str = Depends(oauth2_scheme)
):
    # Verify token and get user info
    user_data = verify_token(token)
    
    # Here you should add role verification (instructor/admin)
    # For example: if user_data["role"] != "instructor": raise HTTPException...
    
    if not video.content_type.startswith("video/"):
        raise HTTPException(
            status_code=400,
            detail="File must be a video"
        )
    
    video_path = await video_uploader.upload_to_ec2(
        video_file=video,
        course_id=course_id,
        section_id=section_id,
        lesson_id=lesson_id
    )
    
    if not video_path:
        raise HTTPException(
            status_code=500,
            detail="Error uploading video"
        )
    
    # Here you should update your lesson in the database with the video_path
    # await update_lesson_video_path(lesson_id, video_path)
    
    return {
        "message": "Video uploaded successfully",
        "path": video_path
    }

@router.get("/{course_id}/{section_id}/{lesson_id}/video")
async def get_lesson_video(
    course_id: int,
    section_id: int,
    lesson_id: int,
    token: str = Depends(oauth2_scheme)
):
    # Verify token and get user info
    user_data = verify_token(token)
    
    # Here you should verify if the user has access to this lesson
    # For example: check if user is enrolled in the course
    
    video_path = video_uploader.get_video_path(course_id, section_id, lesson_id)
    
    # Here implement the video streaming logic
    # This is a placeholder - you'll need to implement the actual video streaming
    return {"video_path": video_path} 