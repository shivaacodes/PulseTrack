from fastapi import APIRouter
from src.api.v1 import events

api_router = APIRouter()
api_router.include_router(events.router, prefix="/v1")
