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
        self.known_hosts_path = os.getenv("KNOWN_HOSTS_PATH")

    def get_video_path(self, course_id: str, section_id: str, lesson_id: str) -> str:
        return f"course_{course_id}/section_{section_id}/lesson_{lesson_id}/video.mp4"

    async def upload_to_ec2(self, 
                           video_file: UploadFile,
                           course_id: str,
                           section_id: str,
                           lesson_id: str) -> Optional[str]:

        try:

            ssh = paramiko.SSHClient()
            ssh.load_host_keys(os.path.expanduser(self.known_hosts_path))
            
        
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

    async def retrieve_video_from_ec2(self, video_url: str, video_id: str) -> str:

        try:
            ssh = paramiko.SSHClient()
            ssh.load_host_keys(os.path.expanduser(self.known_hosts_path))
            private_key = paramiko.RSAKey.from_private_key_file(self.ec2_key_path)
            ssh.connect(self.ec2_host, username=self.ec2_user, pkey=private_key)

            sftp = ssh.open_sftp()

            remote_path = f"{self.base_video_path}/{video_url}"

            temp_dir = os.path.join(os.getcwd(), "temp")
            os.makedirs(temp_dir, exist_ok=True)
            temp_path = os.path.join(temp_dir, f"temp_video_{video_id}.mp4")

            sftp.get(remote_path, temp_path)

            sftp.close()
            ssh.close()

            return temp_path

        except Exception as e:
            print(f"Error retrieving video from EC2: {str(e)}")
            raise Exception("Failed to retrieve video from EC2") 