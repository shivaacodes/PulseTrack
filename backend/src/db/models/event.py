from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from src.database import Base

class Event(Base):
    """Event model for tracking user interactions."""
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    site_id = Column(Integer, ForeignKey("sites.id"))
    name = Column(String(255))
    properties = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    session = relationship("Session", back_populates="events")
    site = relationship("Site", back_populates="events")

    def __repr__(self):
        return f"<Event {self.name}>" 