from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import Lesson
from fastapi import HTTPException

async def update_lesson_video(db: AsyncSession, lesson_id: str, video_path: str):

    lesson = await db.get(Lesson, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    lesson.video_path = video_path
    await db.commit()
    return lesson 