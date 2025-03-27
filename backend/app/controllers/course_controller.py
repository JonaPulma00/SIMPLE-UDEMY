from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
import uuid
from app.db.models import Course, User
from app.schemas.course import CourseCreate
import logging

logger = logging.getLogger(__name__)

async def create_course(db: AsyncSession, course: CourseCreate, user_id: str):

    user = await db.get(User, user_id)
    if not user or not user.is_instructor:
        logger.warning(f"Non-instructor tried to create course: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_408_FORBIDDEN,
            detail="Only instructors can create courses"
        )
    
    new_course = Course(
        course_id=str(uuid.uuid4()),
        instructor_id=user_id,
        title=course.title,
        description=course.description,
        category_id=course.category_id
    )
    
    db.add(new_course)
    await db.commit()
    await db.refresh(new_course)
    
    logger.info(f"Course created: {new_course.course_id} by instructor: {user_id}")
    
    return new_course