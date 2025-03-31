from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
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