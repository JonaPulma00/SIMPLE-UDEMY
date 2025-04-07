from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.controllers.category_controller import get_all_categories
from app.middlewares.authenticate_token import verify_token
from typing import List
from app.schemas.category import CategoryResponse

router = APIRouter()

@router.get("/get-categories", response_model=List[CategoryResponse], status_code=status.HTTP_200_OK)
async def get_categories_handler(
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_token)
):
    return await get_all_categories(db)
