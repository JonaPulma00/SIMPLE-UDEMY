from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.course import CourseCreate, CourseResponse
from app.controllers.course_controller import create_course
from app.middlewares.authorization import verify_instructor

router = APIRouter()

@router.post("/create", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course_handler(
    course: CourseCreate,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_instructor)
):
    return await create_course(db, course, token_payload["uuid"])
