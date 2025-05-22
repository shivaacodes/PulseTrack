from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from src.db.database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(String, ForeignKey("sites.id"), nullable=False)
    type = Column(String, nullable=False)  # page_view, click, page_unload, etc.
    data = Column(JSON, nullable=False)  # Additional event data
    created_at = Column(DateTime(timezone=True), server_default=func.now())
