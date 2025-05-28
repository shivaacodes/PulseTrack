from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from src.database import engine, Base
from src.auth import auth
from src.analytics.routes import router as analytics_router
from src.websocket import router as websocket_router
from src.core.config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description=f"API backend for {settings.PROJECT_NAME} analytics platform",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific domains in production
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    allow_credentials=True,
)

# Mount static tracker files (like tracker.js and test HTML)
app.mount("/static", StaticFiles(directory="src/tracker"), name="static")

# Include authentication and analytics routes
app.include_router(
    auth.router,
    prefix=f"{settings.API_V1_STR}/auth",
    tags=["auth"]
)
app.include_router(analytics_router)
app.include_router(websocket_router, tags=["websocket"])

# Health check or default root route


@app.get("/")
async def root():
    return {"message": "Welcome to PulseTrack API"}


@app.get("/test")
async def serve_test_page():
    return FileResponse("src/tracker/test_page.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
