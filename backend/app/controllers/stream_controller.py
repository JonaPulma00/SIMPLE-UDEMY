from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.sql import func
from fastapi import HTTPException, status
import uuid
from app.db.models import Stream, User, StreamMessage
from app.schemas.stream import StreamCreate, StreamResponse
from datetime import datetime, timezone