import os
import boto3
from botocore.exceptions import ClientError
from fastapi import UploadFile
from typing import Optional

class VideoHandler:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            aws_session_token=os.getenv('AWS_SESSION_TOKEN'),  
            region_name=os.getenv('AWS_REGION')
        )
        self.bucket_name = os.getenv('AWS_BUCKET_NAME')

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
            
            url = f"https://{self.bucket_name}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{video_path}"
            return url
        except Exception as e:
            print(f"Error uploading video to S3: {str(e)}")
            return None

    def get_presigned_url(self, video_path: str, expires_in: int = 3600) -> Optional[str]:
        """Generate a presigned URL for video access"""
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
        except Exception as e:
            print(f"Error generating presigned URL: {str(e)}")
            return None