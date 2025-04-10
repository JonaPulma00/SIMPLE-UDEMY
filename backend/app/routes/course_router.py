from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.course import CourseCreate, CourseResponse, CourseUpdate, SectionCreate, LessonCreate
from app.controllers.course_controller import create_course, get_courses, get_instructor_courses, get_course_by_id, delete_course, update_course, add_section_to_course, add_lesson_to_section
from app.middlewares.authorization import verify_instructor
from app.middlewares.authenticate_token import verify_token

router = APIRouter()

@router.post("/create", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course_handler(
    course: CourseCreate,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_instructor)
):
    return await create_course(db, course, token_payload["uuid"])

@router.get("/get-general-courses", status_code=status.HTTP_200_OK)
async def get_courses_handler(
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_token),
    page: int = Query(1, alias="page", ge=1),
    limit: int = Query(10, alias="limit", ge=1, le=100)  
):
    return await get_courses(db, token_payload["uuid"], page, limit)

@router.get("/instructor/{instructor_id}", status_code=status.HTTP_200_OK)
async def get_instructor_courses_handler(
    instructor_id: str,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_instructor),
    page: int = Query(1, alias="page", ge=1),
    limit: int = Query(10, alias="limit", ge=1, le=100)
):
    return await get_instructor_courses(db, instructor_id, page, limit)

@router.get("/get-course-by-id/{course_id}", status_code=status.HTTP_200_OK)
async def get_course_handler(
    course_id: str,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_instructor)
):
    return await get_course_by_id(db, course_id, token_payload["uuid"])

@router.delete("/delete/{course_id}", status_code=status.HTTP_200_OK)
async def delete_course_handler(
    course_id: str,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_instructor)
):
    return await delete_course(db, course_id, token_payload["uuid"])

@router.put("/update/{course_id}", response_model=CourseResponse, status_code=status.HTTP_200_OK)
async def update_course_handler(
    course_id: str,
    course_data: CourseUpdate,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_instructor)
):
    return await update_course(db, course_id, token_payload["uuid"], course_data)

@router.post("/{course_id}/sections", status_code=status.HTTP_201_CREATED)
async def add_section_handler(
    course_id: str,
    section_data: SectionCreate,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_instructor)
):
    return await add_section_to_course(db, course_id, token_payload["uuid"], section_data)

@router.post("/{course_id}/sections/{section_id}/lessons", status_code=status.HTTP_201_CREATED)
async def add_lesson_handler(
    course_id: str,
    section_id: str,
    lesson_data: LessonCreate,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_instructor)
):
    return await add_lesson_to_section(db, course_id, section_id, token_payload["uuid"], lesson_data)

# @router.get("/{course_id}/structure", status_code=status.HTTP_200_OK)
# async def get_course_structure_handler(
#     course_id: str,
#     db: AsyncSession = Depends(get_db),
#     token_payload: dict = Depends(verify_instructor)
# ):
#     return await get_course_structure(db, course_id, token_payload["uuid"])