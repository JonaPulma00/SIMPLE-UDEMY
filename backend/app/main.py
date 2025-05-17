from fastapi import FastAPI
from app.routes.routes import router as api_routes
from fastapi.middleware.cors import CORSMiddleware
import logging
from app.middlewares.exceptions_handler import ExceptionHandlerMiddleware
from app.middlewares.rate_limit import limiter
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

logging.basicConfig(level=logging.INFO)

app = FastAPI()
origins = [
  "http://localhost:5200",
  "http://127.0.0.1:5200"
]

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
  expose_headers=["*"]
)

app.include_router(api_routes, prefix="/api/v1")

app.add_middleware(ExceptionHandlerMiddleware)
