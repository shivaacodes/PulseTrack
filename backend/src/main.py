from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from src.database import engine, Base
from src.auth import auth
from src.analytics.routes import router as analytics
from src.db.models import User, Site, Session, PageView, Event
from src.core.config import settings
from sqlalchemy import text

# Drop and recreate all tables with CASCADE
with engine.connect() as conn:
    conn.execute(text("DROP SCHEMA public CASCADE; CREATE SCHEMA public;"))
    conn.commit()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for the tracker
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="src/tracker"), name="static")

# Include routers
app.include_router(
    auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(analytics)

@app.get("/")
async def root():
    return {"message": "Welcome to PulseTrack API"}

@app.get("/test")
async def test_page():
    """Serve the test page."""
    return FileResponse("src/tracker/test_page.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
