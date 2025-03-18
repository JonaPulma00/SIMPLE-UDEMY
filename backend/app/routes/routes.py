from fastapi import APIRouter
from app.routes.auth import router as auth_router

router = APIRouter()

# Auth routes
router.include_router(auth_router,prefix="/auth", tags=["Auth"])