from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models import Category
from typing import List
from app.schemas.category import CategoryResponse


async def get_all_categories(db: AsyncSession) -> List[CategoryResponse]:
    query = select(Category)
    result = await db.execute(query)
    categories = result.scalars().all()
    
    return [CategoryResponse.model_validate(category) for category in categories]
