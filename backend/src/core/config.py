import os
from typing import Dict, Any
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

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

    # Redis Configuration
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB: int = int(os.getenv("REDIS_DB", "0"))
    REDIS_PASSWORD: str = os.getenv("REDIS_PASSWORD", "")
    REDIS_SSL: bool = os.getenv("REDIS_SSL", "false").lower() == "true"
    
    # Cache Configuration
    CACHE_TTL: int = int(os.getenv("CACHE_TTL", "300"))  # 5 minutes default
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = int(os.getenv("RATE_LIMIT_REQUESTS", "60"))
    RATE_LIMIT_PERIOD: int = int(os.getenv("RATE_LIMIT_PERIOD", "60"))

    model_config = SettingsConfigDict(case_sensitive=True)


# Create settings instance
settings = Settings()

def get_redis_config() -> Dict[str, Any]:
    """Get Redis configuration as a dictionary"""
    return {
        "host": settings.REDIS_HOST,
        "port": settings.REDIS_PORT,
        "db": settings.REDIS_DB,
        "password": settings.REDIS_PASSWORD,
        "ssl": settings.REDIS_SSL,
        "decode_responses": True,
        "socket_timeout": 5,
        "retry_on_timeout": True
    }
