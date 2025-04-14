from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.sql import func
from fastapi import HTTPException, status
import uuid
from app.db.models import Lesson, Section
from app.utils.video_handler import VideoUploader
from app.controllers.course_controller import get_course_by_id
from fastapi.responses import StreamingResponse
import os

video_uploader = VideoUploader()

async def add_lesson_to_section(db: AsyncSession, course_id: str, section_id: str, user_id: str, lesson_data: dict):

    course = await get_course_by_id(db, course_id, user_id)

    stmt = select(Section).filter(Section.section_id == section_id, Section.course_id == course_id)
    result = await db.execute(stmt)
    section = result.scalar_one_or_none()
    
    if not section:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found or doesn't belong to this course"
        )
    

    lessons_count_stmt = select(func.count()).select_from(Lesson).where(Lesson.section_id == section_id)
    result = await db.execute(lessons_count_stmt)
    position = result.scalar() + 1


    new_lesson = Lesson(
        lesson_id=str(uuid.uuid4()),
        section_id=section_id,
        title=lesson_data["title"],
        video_url="", 
        position=position,
    )
    
    db.add(new_lesson)
    await db.commit()
    await db.refresh(new_lesson)
    
    return new_lesson

async def update_lesson_video(db: AsyncSession, lesson_id: str, video_file, course_id: str, section_id: str):
    lesson = await db.get(Lesson, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    

    video_path = await video_uploader.upload_to_ec2(
        video_file=video_file,
        course_id=course_id,
        section_id=section_id,
        lesson_id=lesson_id
    )
    
    if not video_path:
        raise HTTPException(
            status_code=500,
            detail="Failed to upload video"
        )


    lesson.video_url = video_path
    await db.commit()
    await db.refresh(lesson)
    
    return lesson 

async def get_lesson_video(db: AsyncSession, lesson_id: str):

    stmt = select(Lesson).filter(Lesson.lesson_id == lesson_id)
    result = await db.execute(stmt)
    lesson = result.scalar_one_or_none()

    if not lesson or not lesson.video_url:
        raise HTTPException(status_code=404, detail="Video not found")


    video_path = f"/home/ec2-user/course_videos/{lesson.video_url}"

    if not os.path.exists(video_path):
        raise HTTPException(status_code=404, detail="Video file not found")

    def iterfile():
        with open(video_path, mode="rb") as file:
            yield from file

    return StreamingResponse(
        iterfile(),
        media_type="video/mp4",
        headers={
            "Accept-Ranges": "bytes",
            "Content-Disposition": f"inline; filename=video.mp4"
        }
    ) 