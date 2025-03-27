from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.controllers.course_controller import create_course
from app.db.database import get_db
from app.schemas.course import CourseCreate, CourseResponse
from app.middlewares.authenticate_token import AuthenticateToken

router = APIRouter(dependencies=[Depends(AuthenticateToken)])

@router.post("/create-course", response_model=CourseResponse)
async def create_new_course(
    request: Request,
    course: CourseCreate, 
    db: AsyncSession = Depends(get_db)
):
    user = request.state.user
    user_id = user.get("uuid")
    
    return await create_course(db, course, user_id)