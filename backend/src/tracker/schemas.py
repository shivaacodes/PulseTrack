from pydantic import BaseModel, HttpUrl
from typing import Optional, Dict, Any
from datetime import datetime

class EventBase(BaseModel):
    """Base schema for event data."""
    site_id: str
    event_type: str
    properties: Optional[Dict[str, Any]] = None
    url: str
    referrer: Optional[str] = None
    timestamp: datetime
    session_id: Optional[str] = None
    user_id: Optional[str] = None

class EventCreate(EventBase):
    """Schema for creating a new event."""
    pass

class EventResponse(EventBase):
    """Schema for event response."""
    id: int

    class Config:
        from_attributes = True

class EventFilter(BaseModel):
    """Schema for filtering events."""
    site_id: Optional[str] = None
    event_type: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    session_id: Optional[str] = None
    user_id: Optional[str] = None
