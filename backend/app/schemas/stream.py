from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime

class StreamCreate(BaseModel):
    course_id: Optional[str] = None
    title: Optional[str] = None

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

class MessageResponse(BaseModel):
    message_id: str
    stream_id: str
    user_id: str
    message: str
    sent_at: datetime
    
    class Config:
        from_attributes = True
