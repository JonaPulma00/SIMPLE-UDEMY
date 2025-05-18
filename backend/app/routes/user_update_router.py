from fastapi import APIRouter, Depends, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.middlewares.authenticate_token import verify_token
from app.controllers.user_update_controller import update_user_profile
from typing import Optional

router = APIRouter()

@router.patch("/update-profile")
async def update_profile(
    bio: Optional[str] = Form(None),
    profile_picture: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
    token_payload: dict = Depends(verify_token)
):

    if bio is None and profile_picture is None:
        return {"message": "No updates provided"}
    
    user_id = token_payload["uuid"]
    
    return await update_user_profile(
        db=db,
        user_id=user_id,
        bio=bio,
        profile_picture=profile_picture
    )
