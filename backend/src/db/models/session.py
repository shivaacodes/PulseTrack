from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.database import Base
from datetime import datetime


class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)
    user_agent = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    session_metadata = Column(JSON, nullable=True)

    user = relationship("User", back_populates="sessions")
    site = relationship("Site", back_populates="sessions")
    events = relationship("Event", back_populates="session",
                          cascade="all, delete-orphan")
    pageviews = relationship(
        "PageView", back_populates="session", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Session {self.id}>"
