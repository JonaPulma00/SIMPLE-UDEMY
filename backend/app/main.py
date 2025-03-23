from fastapi import FastAPI
from app.routes.routes import router as api_routes
from fastapi.middleware.cors import CORSMiddleware
import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI()

origins = [
  "http://localhost:5200",
  "http://127.0.0.1:5200"
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
  expose_headers=["*"]
)

app.include_router(api_routes, prefix="/api/v1")
