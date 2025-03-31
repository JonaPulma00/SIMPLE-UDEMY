from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime

class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category_id: Optional[str] = None
    
    @field_validator('title', mode='before')
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
    created_at: Optional[datetime]

    class Config:
        from_attributes = True
