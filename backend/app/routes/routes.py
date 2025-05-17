from fastapi import APIRouter
from app.routes.auth import router as auth_router
from app.routes.course_router import router as course_router
from app.routes.enrollments_router import router as enrollments_router
from app.routes.category_router import router as category_router
from app.routes.lessons_router import router as lessons_router
from app.routes.stream_router import router as stream_router

router = APIRouter()

# Auth routes
router.include_router(auth_router, prefix="/auth", tags=["Auth"])

# Course routes
router.include_router(course_router, prefix="/courses", tags=["Courses"])

# Enrollment routes
router.include_router(enrollments_router, prefix="/enrollments", tags=["Enrollments"])

# Category routes
router.include_router(category_router, prefix="/categories", tags=["Categories"])

# Lessons routes
router.include_router(lessons_router, prefix="/lessons", tags=["Lessons"])

# Stream routes
router.include_router(stream_router, prefix="/streams", tags=["Streams"])
