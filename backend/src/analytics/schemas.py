from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime


class SiteCreate(BaseModel):
    name: str
    domain: str


class SiteResponse(BaseModel):
    id: int
    name: str
    domain: str
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PageViewCreate(BaseModel):
    page: str
    user_id: int
    event_metadata: Optional[Dict[str, Any]] = None


class EventCreate(BaseModel):
    name: str
    site_id: int
    properties: Dict[str, Any] = {}


class SessionCreate(BaseModel):
    user_id: int
    site_id: int
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None
    session_metadata: Optional[Dict[str, Any]] = None


class EventResponse(BaseModel):
    id: int
    name: str
    site_id: int
    properties: Dict[str, Any]
    timestamp: datetime

    class Config:
        from_attributes = True


class AnalyticsFilter(BaseModel):
    site_id: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    event_type: Optional[str] = None


class AnalyticsResponse(BaseModel):
    site: SiteResponse
    pageviews: List[PageViewCreate]
    events: List[EventResponse]
    unique_visitors: int
    start_date: datetime
    end_date: datetime
