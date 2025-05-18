import boto3
from fastapi import HTTPException, status, UploadFile
from app.core.config import settings

class ProfileHandler:
  def __init__(self):
    self.s3_client = boto3.client(
      's3',
      aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
      aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
      aws_session_token=settings.AWS_SESSION_TOKEN, 
      region_name=settings.AWS_REGION
    )
    self.bucket_name = settings.AWS_BUCKET_NAME
    
  def get_profile_picture_path(self, user_id: str) -> str:
    return f"users/{user_id}/profile_picture.jpg"
    