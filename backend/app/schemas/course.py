from pydantic import BaseModel, field_validator
from typing import Optional, List
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

class InstructorCoursesResponse(BaseModel):
    page: int
    limit: int
    total_courses: int
    total_pages: int
    courses: List[CourseResponse]

    class Config:
        from_attributes = True

class LessonResponse(BaseModel):
    lesson_id: str
    title: str
    video_url: Optional[str] = None
    position: int
    is_free: bool

    class Config:
        from_attributes = True

class SectionResponse(BaseModel):
    section_id: str
    title: str
    position: int
    lessons: List[LessonResponse]

    class Config:
        from_attributes = True

class CourseDetailResponse(BaseModel):
    course_id: str
    title: str
    description: Optional[str] = None
    instructor_id: str
    category_id: Optional[str] = None
    created_at: Optional[datetime]
    sections: List[SectionResponse]

    class Config:
        from_attributes = True

class CourseUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category_id: str | None = None

class SectionCreate(BaseModel):
    title: str
    position: int

    @field_validator('title', mode='before')
    def validate_title(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty')
        if len(v) > 100:
            raise ValueError('Title must be less than 100 characters')
        return v.strip()

class LessonCreate(BaseModel):
    title: str
    position: int

    @field_validator('title', mode='before')
    def validate_title(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty')
        if len(v) > 100:
            raise ValueError('Title must be less than 100 characters')
        return v.strip()
