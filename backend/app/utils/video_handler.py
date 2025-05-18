import boto3
from fastapi import HTTPException, status, UploadFile
from typing import Optional
from app.core.config import settings

class VideoHandler:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            aws_session_token=settings.AWS_SESSION_TOKEN,  
            region_name=settings.AWS_REGION
        )
        self.bucket_name = settings.AWS_BUCKET_NAME

    def get_video_path(self, course_id: str, section_id: str, lesson_id: str) -> str:
        return f"course_{course_id}/section_{section_id}/lesson_{lesson_id}/video.mp4"

    async def upload_video(self, 
                         video_file: UploadFile,
                         course_id: str,
                         section_id: str,
                         lesson_id: str) -> Optional[str]:
        try:
            video_path = self.get_video_path(course_id, section_id, lesson_id)
            
            content_type = video_file.content_type or 'video/mp4'
            
            self.s3_client.upload_fileobj(
                video_file.file,
                self.bucket_name,
                video_path,
                ExtraArgs={
                    'ContentType': content_type
                }
            )
            
            url = f"https://{self.bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/{video_path}"
            return url
        except Exception:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to upload video")
    def get_presigned_url(self, video_path: str, expires_in: int = 3600) -> Optional[str]:
 
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': video_path 
                },
                ExpiresIn=expires_in
            )
            return url
        except Exception:
             raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate video URL")