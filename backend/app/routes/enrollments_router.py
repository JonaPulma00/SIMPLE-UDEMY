from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.controllers.enrollment_controller import enroll_user, get_user_enrollments
from app.middlewares.authenticate_token import verify_token

router = APIRouter()

@router.post("/enroll-user", status_code=status.HTTP_201_CREATED)
async def enroll_user_handler(
    course_id: str,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_token)
):
    return await enroll_user(db, token_payload["uuid"], course_id)

@router.get("/enrollments", status_code=status.HTTP_200_OK)
async def get_user_enrollments_handler(
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_token),
    page: int = Query(1, alias="page", ge=1),
    limit: int = Query(10, alias="limit", ge=1, le=100)  
):
    return await get_user_enrollments(db, token_payload["uuid"], page, limit)