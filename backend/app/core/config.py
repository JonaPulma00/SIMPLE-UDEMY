import os
from dotenv import load_dotenv


load_dotenv()

class Settings:
  DB_USER: str = os.getenv("DB_USER")
  DB_PASSWORD: str = os.getenv("DB_PASSWORD")
  DB_HOST: str = os.getenv("DB_HOST")
  DB_NAME: str = os.getenv("DB_NAME")
  DB_PORT: int = int(os.getenv("DB_PORT"))
  SECRET_KEY: str = os.getenv("SECRET_KEY")
  JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM")
  ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1200"))
  REFRESH_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_MINUTES", "604800"))

settings = Settings()

SECRET_KEY = settings.SECRET_KEY
JWT_ALGORITHM = settings.JWT_ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_MINUTES = settings.REFRESH_TOKEN_EXPIRE_MINUTES
