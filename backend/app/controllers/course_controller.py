from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status
import uuid
from app.db.models import Course
from app.schemas.course import CourseCreate
from datetime import datetime

async def create_course(db: AsyncSession, course_data: CourseCreate, instructor_id: str):
    db_course = Course(
        course_id=str(uuid.uuid4()),
        instructor_id=instructor_id,
        title=course_data.title,
        description=course_data.description,
        category_id=course_data.category_id,
        created_at=datetime.now()
)

    db.add(db_course)
    await db.commit()
    await db.refresh(db_course)

    return db_course