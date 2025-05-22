from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.router import api_router
from src.db.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="PulseTrack API")

# Configure CORS
origins = [
    "http://localhost:3000",  # Next.js default port
    "http://127.0.0.1:3000",
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 