# Configuration and Settings

import os
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    """Application settings."""
    
    # Database settings
    SQLALCHEMY_DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://shiva:Shivam007@localhost:5432/pulsetrack"
    )
    
    # Security settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS settings
    CORS_ORIGINS: list = ["http://localhost:3000"]
    
    # API settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "PulseTrack"
    
    model_config = SettingsConfigDict(case_sensitive=True)

# Create settings instance
settings = Settings()