from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from src.database import Base

# Tracking Websites


class Site(Base):
    __tablename__ = "sites"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    domain = Column(String(255), unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)

    user = relationship("User", back_populates="sites")
    sessions = relationship(
        "Session", back_populates="site", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="site",
                          cascade="all, delete-orphan")
    pageviews = relationship(
        "PageView", back_populates="site", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Site {self.domain}>"
