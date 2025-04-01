from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.course import CourseCreate, CourseResponse
from app.controllers.course_controller import create_course, get_courses
from app.middlewares.authorization import verify_instructor

router = APIRouter()

@router.post("/create", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course_handler(
    course: CourseCreate,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_instructor)
):
    return await create_course(db, course, token_payload["uuid"])

@router.get("/get-courses", status_code=status.HTTP_200_OK)
async def get_courses_handler(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, alias="page", ge=1),
    limit: int = Query(10, alias="limit", ge=1, le=100)  
):
    return await get_courses(db, page, limit)