from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status, UploadFile
from app.db.models import User
from app.schemas.user import UserUpdate
from app.utils.profile_handler import ProfileHandler
import os

profile_handler = ProfileHandler()

async def update_user_profile(db: AsyncSession, user_id: str, bio: str = None, profile_picture: UploadFile = None):

    stmt = select(User).filter(User.user_id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    

    if bio is not None:
        user.bio = bio
    

    if profile_picture:
        if profile_picture.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="File must be a JPEG or PNG image"
            )
        
        try:
            profile_url = await profile_handler.upload_pfp(profile_picture, user_id)
            user.profile_picture = profile_url
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload profile picture: {str(e)}"
            )
    

    await db.commit()
    await db.refresh(user)
    
    return {
        "user_id": user.user_id,
        "username": user.username,
        "email": user.email,
        "bio": user.bio,
        "profile_picture": user.profile_picture,
        "is_instructor": user.is_instructor
    }

async def get_user_profile_picture(db: AsyncSession, user_id: str):
    stmt = select(User).filter(User.user_id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not user.profile_picture:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile picture not found"
        )
    
    try:
        
        profile_path = user.profile_picture.split(f"{os.getenv('AWS_BUCKET_NAME')}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/")[-1]
        
        profile_handler_instance = ProfileHandler()
        presigned_url = profile_handler_instance.get_presigned_url(profile_path)
        
        return {
            "url": presigned_url
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate profile picture URL: {str(e)}"
        )