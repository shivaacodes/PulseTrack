from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from src.db.database import Base

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(String, ForeignKey("sites.id"), nullable=False)
    session_id = Column(String, unique=True, index=True, nullable=False)
    user_agent = Column(String)
    ip_address = Column(String)
    referrer = Column(String)
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True), nullable=True)
    duration = Column(Integer, nullable=True)  # Duration in seconds
    session_data = Column(JSON, nullable=True)  # Additional session data
