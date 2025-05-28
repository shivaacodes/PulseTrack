from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from src.core.config import settings

engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,  # Ensures connections are still valid
    pool_size=5,         # Maintains 5 connections in the pool
    max_overflow=10      # Allows up to 10 additional connections when needed
)

# Create session factory and base class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Import models to register them with SQLAlchemy
from src.db.models import User, Site, Session, PageView, Event  # noqa


def get_db():
    """Database session dependency for FastAPI endpoints.

    Yields:
        Session: SQLAlchemy database session

    Usage:
        @app.get("/items")
        def read_items(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
