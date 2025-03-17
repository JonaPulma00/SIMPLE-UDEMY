from fastapi import FastAPI
from app.routes.auth import router as auth_router
import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI()

app.include_router(auth_router, prefix="auth", tags=["auth"])

