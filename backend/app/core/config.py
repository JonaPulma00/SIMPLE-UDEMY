import os
from dotenv import load_dotenv


load_dotenv()

class Settings:
  # === DB CONFIGURATION ===
  DB_USER: str = os.getenv("DB_USER")
  DB_PASSWORD: str = os.getenv("DB_PASSWORD")
  DB_HOST: str = os.getenv("DB_HOST")
  DB_NAME: str = os.getenv("DB_NAME")
  DB_PORT: int = int(os.getenv("DB_PORT"))
  DB_URL: str = f"mysql+asyncmy://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

  # === REDIS CONFIGURATION ===
  REDIS_HOST: str = os.getenv("REDIS_HOST")
  REDIS_PORT: int = int(os.getenv("REDIS_PORT"))

  # === JWT CONFIGURATION ===
  SECRET_KEY: str = os.getenv("SECRET_KEY")
  JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM")
  ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1200"))
  REFRESH_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_MINUTES", "604800"))

  # === AWS CONFIGURATION ===
  AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID")
  AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY")
  AWS_SESSION_TOKEN: str = os.getenv("AWS_SESSION_TOKEN")
  AWS_REGION: str = os.getenv("AWS_REGION")
  AWS_BUCKET_NAME: str = os.getenv("AWS_BUCKET_NAME")

settings = Settings()
