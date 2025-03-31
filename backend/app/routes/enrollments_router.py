from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.controllers.enrollment_controller import enroll_user
from app.middlewares.authenticate_token import verify_token

router = APIRouter()

@router.post("/enroll", status_code=status.HTTP_201_CREATED)
async def enroll_user_handler(
    course_id: str,
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_token)
):
    return await enroll_user(db, token_payload["uuid"], course_id)
