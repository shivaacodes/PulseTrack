from fastapi import APIRouter

from ..auth import auth
from ..analytics import routes as analytics

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(
    analytics.router, prefix="/analytics", tags=["analytics"])
