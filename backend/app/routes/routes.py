from fastapi import APIRouter
from app.routes.auth import router as auth_router
from app.routes.course_router import router as course_router
router = APIRouter()

# Auth routes
router.include_router(auth_router, prefix="/auth", tags=["Auth"])

# Course routes
router.include_router(course_router, prefix="/courses", tags=["Courses"])