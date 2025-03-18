from fastapi import FastAPI
from app.routes.routes import router as api_routes
import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI()

app.include_router(api_routes, prefix="/api/v1")

