from fastapi import APIRouter
from .v1 import analytics, auth

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
