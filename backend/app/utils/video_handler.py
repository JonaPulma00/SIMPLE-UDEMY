import os
import paramiko
from fastapi import UploadFile
from typing import Optional

class VideoUploader:
    def __init__(self):
        self.ec2_host = os.getenv("EC2_HOST")
        self.ec2_user = os.getenv("EC2_USER")
        self.ec2_key_path = os.getenv("EC2_KEY_PATH")
        self.base_video_path = "/home/ec2-user/course_videos"

    def get_video_path(self, course_id: int, section_id: int, lesson_id: int) -> str:

        return f"course_{course_id}/section_{section_id}/lesson_{lesson_id}/video.mp4"

    async def upload_to_ec2(self, 
                           video_file: UploadFile,
                           course_id: int,
                           section_id: int,
                           lesson_id: int) -> Optional[str]:

        try:

            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            
        
            private_key = paramiko.RSAKey.from_private_key_file(self.ec2_key_path)
            ssh.connect(self.ec2_host, username=self.ec2_user, pkey=private_key)
            

            sftp = ssh.open_sftp()
            

            relative_path = self.get_video_path(course_id, section_id, lesson_id)
            full_path = f"{self.base_video_path}/{relative_path}"
            
     
            self._create_directories(sftp, full_path)
            
         
            sftp.putfo(video_file.file, full_path)
            
            sftp.close()
            ssh.close()
            
            return relative_path
            
        except Exception as e:
            print(f"Error uploading video: {str(e)}")
            return None

    def _create_directories(self, sftp, path: str):
  
        current = "/"
        for part in path.split("/")[1:-1]:
            current = current + part + "/"
            try:
                sftp.stat(current)
            except:
                sftp.mkdir(current) 