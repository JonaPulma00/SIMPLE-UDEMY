from pydantic import BaseModel
from typing import Optional


class CategoryResponse(BaseModel):
    category_id: str
    name: str
    description: Optional[str] = None
    
    class Config:
        from_attributes = True 