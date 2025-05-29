from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from src.database import Base

# Track Page Visits


class PageView(Base):
    __tablename__ = "pageviews"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    site_id = Column(Integer, ForeignKey("sites.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)

    session = relationship("Session", back_populates="pageviews")
    site = relationship("Site", back_populates="pageviews")

    def __repr__(self):
        return f"<PageView {self.id}>"
