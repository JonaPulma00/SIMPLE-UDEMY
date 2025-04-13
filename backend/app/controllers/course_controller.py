from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.sql import func
from fastapi import HTTPException
import uuid
from app.db.models import Course, User, Section, Lesson
from app.schemas.course import CourseCreate, CourseResponse, CourseUpdate, SectionCreate, LessonCreate
from datetime import datetime, timezone
from sqlalchemy.orm import selectinload
from fastapi import status

async def create_course(db: AsyncSession, course_data: CourseCreate, instructor_id: str):
    db_course = Course(
        course_id=str(uuid.uuid4()),
        instructor_id=instructor_id,
        title=course_data.title,
        description=course_data.description,
        category_id=course_data.category_id,
        created_at=datetime.now(timezone.utc)
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

async def delete_course(db: AsyncSession, course_id: str, user_id: str):
    stmt = select(Course).filter(Course.course_id == course_id)
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
            detail="You don't have permission to delete this course"
        )

    await db.delete(course)
    await db.commit()

    return {"message": "Course deleted successfully"}

async def update_course(db: AsyncSession, course_id: str, user_id: str, course_data: CourseUpdate):
    stmt = select(Course).filter(Course.course_id == course_id)
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
            detail="You don't have permission to update this course"
        )

    if course_data.title is not None:
        course.title = course_data.title
    if course_data.description is not None:
        course.description = course_data.description
    if course_data.category_id is not None:
        course.category_id = course_data.category_id

    await db.commit()
    await db.refresh(course)

    return course

async def add_section_to_course(db: AsyncSession, course_id: str, user_id: str, section_data: SectionCreate):
    course = await get_course_by_id(db, course_id, user_id)
    

    stmt = select(func.count()).select_from(Section).where(Section.course_id == course_id)
    result = await db.execute(stmt)
    position = result.scalar() + 1  
    
    new_section = Section(
        section_id=str(uuid.uuid4()),
        course_id=course_id,
        title=section_data.title,
        position=position  
    )
    
    db.add(new_section)
    await db.commit()
    await db.refresh(new_section)
    
    return new_section

async def add_lesson_to_section(db: AsyncSession, course_id: str, section_id: str, user_id: str, lesson_data: LessonCreate):
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
        title=lesson_data.title,
        video_url=lesson_data.video_url,
        position=position,  
    )
    
    db.add(new_lesson)
    await db.commit()
    
    return new_lesson

# async def get_course_structure(db: AsyncSession, course_id: str, user_id: str):
#     stmt = select(Course).options(
#         selectinload(Course.sections).selectinload(Section.lessons)
#     ).filter(Course.course_id == course_id)
    
#     result = await db.execute(stmt)
#     course = result.scalar_one_or_none()

#     if not course:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Course not found"
#         )

#     if course.instructor_id != user_id:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="You don't have permission to access this course"
#         )

#     for section in course.sections:
#         section.lessons.sort(key=lambda x: x.position)
#     course.sections.sort(key=lambda x: x.position)

#     return {
#         "course_id": course.course_id,
#         "title": course.title,
#         "sections": [
#             {
#                 "section_id": section.section_id,
#                 "title": section.title,
#                 "position": section.position,
#                 "lessons": [
#                     {
#                         "lesson_id": lesson.lesson_id,
#                         "title": lesson.title,
#                         "video_url": lesson.video_url,
#                         "position": lesson.position,
#                         "is_free": lesson.is_free
#                     }
#                     for lesson in section.lessons
#                 ]
#             }
#             for section in course.sections
#         ]
#     }