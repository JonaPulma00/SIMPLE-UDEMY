import boto3
from fastapi import HTTPException, status, UploadFile
from app.core.config import settings
from typing import Optional
from PIL import Image
import io

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
    
  async def upload_pfp(self, pfp_file: UploadFile, user_id: str) -> str:
    try:
     
      current_position = pfp_file.file.tell()
      
      
      try:
        image_data = await pfp_file.read()
        Image.open(io.BytesIO(image_data))
        
        
        if pfp_file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
          raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="File must be a JPEG or PNG image"
          )
        
       
        pfp_file.file.seek(0)
      except Exception:

        pfp_file.file.seek(current_position)
        raise HTTPException(
          status_code=status.HTTP_400_BAD_REQUEST,
          detail="Invalid image file. Only JPEG and PNG images are allowed."
        )
      
      pfp_path = self.get_profile_picture_path(user_id)
      content_type = pfp_file.content_type or 'image/jpeg'

      self.s3_client.upload_fileobj(
        pfp_file.file,
        self.bucket_name,
        pfp_path,
        ExtraArgs={
          'ContentType': content_type
        }
      )

      url = f"https://{self.bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/{pfp_path}"

      return url
    except HTTPException:
      raise
    except Exception as e:
      raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to upload profile picture: {str(e)}")
    
  def get_presigned_url(self, pfp_path: str, expires_in: int = settings.AWS_PRESIGNED_URL_EXPIRE_MINUTES) -> Optional[str]:
    try:
      url = self.s3_client.generate_presigned_url(
        'get_object',
        Params={
          'Bucket': self.bucket_name,
          'Key': pfp_path
        },
        ExpiresIn=expires_in
      )
      return url
    except Exception:
      raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate profile picture url")