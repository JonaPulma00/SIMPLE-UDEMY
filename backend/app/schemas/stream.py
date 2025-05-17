from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime

class StreamCreate(BaseModel):
    course_id: Optional[str] = None
    title: Optional[str] = None
    
    @field_validator('title', mode='before')
    def validate_title(cls, v):
        if v and len(v) > 100:
            raise ValueError('Title must be less than 100 characters')
        return v.strip() if v else v

class StreamResponse(BaseModel):
    stream_id: str
    instructor_id: str
    course_id: Optional[str] = None
    title: Optional[str] = None
    started_at: datetime
    ended_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    message: str
    
    @field_validator('message', mode='before')
    def validate_message(cls, v):
        if not v.strip():
            raise ValueError('Message cannot be empty')
        if len(v) > 100:
            raise ValueError('Message must be less than 100 characters')
        return v.strip()

class MessageResponse(BaseModel):
    message_id: str
    stream_id: str
    user_id: str
    message: str
    sent_at: datetime
    
    class Config:
        from_attributes = True