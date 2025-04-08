from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.sql import func
from fastapi import HTTPException
import uuid
from app.db.models import Course, User, Section, Lesson
from app.schemas.course import CourseCreate, CourseResponse
from datetime import datetime
from sqlalchemy.orm import selectinload
from fastapi import status

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

async def get_instructor_courses(db: AsyncSession, instructor_id: str, page: int = 1, limit: int = 10):
    if page < 1 or limit < 1:
        raise HTTPException(status_code=400, detail="Page and limit must be positive integers")

    offset = (page - 1) * limit

    stmt = select(Course).filter(Course.instructor_id == instructor_id)\
        .order_by(Course.created_at.desc())\
        .limit(limit).offset(offset)
    
    result = await db.execute(stmt)
    courses = result.scalars().all()

    total_count_stmt = select(func.count()).select_from(Course)\
        .filter(Course.instructor_id == instructor_id)
    total_count = await db.execute(total_count_stmt)
    total_count = total_count.scalar()

    if total_count == 0:

        instructor_stmt = select(User).filter(User.user_id == instructor_id)
        instructor_result = await db.execute(instructor_stmt)
        instructor = instructor_result.scalar_one_or_none()
        
        if not instructor:
            raise HTTPException(
                status_code=404,
                detail="Instructor not found"
            )

    return {
        "page": page,
        "limit": limit,
        "total_courses": total_count,
        "total_pages": (total_count // limit) + (1 if total_count % limit else 0),
        "courses": courses
    }

async def get_course_by_id(db: AsyncSession, course_id: str, user_id: str):
    stmt = select(Course).options(
        selectinload(Course.sections).selectinload(Section.lessons)
    ).filter(Course.course_id == course_id)
    
    result = await db.execute(stmt)
    course = result.scalar_one_or_none()

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    if course.instructor_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to access this course"
        )

    for section in course.sections:
        section.lessons.sort(key=lambda x: x.position)
    course.sections.sort(key=lambda x: x.position)

    return course

