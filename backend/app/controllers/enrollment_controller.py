from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.sql import func
from fastapi import HTTPException, status
from app.db.models import Enrollments, Course
import uuid

async def enroll_user(db: AsyncSession, user_id: str, course_id: str):
    course_stmt = select(Course).filter(Course.course_id == course_id)
    course_result = await db.execute(course_stmt)
    course = course_result.scalar_one_or_none()

    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    enrollment_stmt = select(Enrollments).filter(
        Enrollments.user_id == user_id,
        Enrollments.course_id == course_id
    )
    enrollment_result = await db.execute(enrollment_stmt)
    existing_enrollment = enrollment_result.scalar_one_or_none()

    if existing_enrollment:
        raise HTTPException(status_code=400, detail="User already enrolled in this course")

    enrollment = Enrollments(
        enrollment_id=str(uuid.uuid4()),
        user_id=user_id,
        course_id=course_id
    )

    db.add(enrollment)
    await db.commit()
    await db.refresh(enrollment)

    return enrollment

async def get_user_enrollments(db: AsyncSession, user_id: str, page: int = 1, limit: int = 10):
    if page < 1 or limit < 1:
        raise HTTPException(status_code=400, detail="Page and limit must be positive integers")

    offset = (page - 1) * limit  

    stmt = (
        select(Enrollments.course_id, Course.title, Course.description)
        .join(Course, Enrollments.course_id == Course.course_id)
        .filter(Enrollments.user_id == user_id)
        .limit(limit)
        .offset(offset)
    )
    
    result = await db.execute(stmt)
    enrollments = result.mappings().all() 

    total_count_stmt = select(func.count()).filter(Enrollments.user_id == user_id) 
    total_count = await db.execute(total_count_stmt)
    total_count = total_count.scalar()

    return {
        "page": page,
        "limit": limit,
        "total_enrollments": total_count,
        "total_pages": (total_count // limit) + (1 if total_count % limit else 0),
        "enrollments": enrollments
    }
