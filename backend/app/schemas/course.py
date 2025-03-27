from pydantic import BaseModel, validator
from typing import Optional
import uuid

class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category_id: Optional[str] = None
    
    @validator('title')
    def validate_title(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty')
        if len(v) > 100:
            raise ValueError('Title must be less than 100 characters')
        return v.strip()

class CourseResponse(BaseModel):
    course_id: str
    title: str
    description: Optional[str] = None
    instructor_id: str
    category_id: Optional[str] = None
    created_at: Optional[str] = None
    
    class Config:
        from_attributes = True