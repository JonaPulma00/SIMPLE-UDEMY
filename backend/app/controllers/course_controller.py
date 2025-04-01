from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.sql import func
from fastapi import HTTPException
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



async def get_courses(db: AsyncSession, user_id: str, page: int = 1, limit: int = 10):
    if page < 1 or limit < 1:
        raise HTTPException(status_code=400, detail="Page and limit must be positive integers")

    offset = (page - 1) * limit  

    stmt = select(Course).limit(limit).offset(offset)
    result = await db.execute(stmt)
    courses = result.scalars().all()  

    total_count_stmt = select(func.count()).select_from(Course)  
    total_count = await db.execute(total_count_stmt)
    total_count = total_count.scalar()

    return {
        "page": page,
        "limit": limit,
        "total_courses": total_count,
        "total_pages": (total_count // limit) + (1 if total_count % limit else 0),
        "courses": courses
    }
