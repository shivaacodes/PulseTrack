# Analytics Routes Module
# This module defines the API endpoints for analytics functionality:
# - Event tracking
# - Analytics data retrieval
# - Overview metrics

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from ..database import get_db
from ..db.models.user import User
from ..db.models.site import Site
from ..db.models.session import Session as DBSession
from ..db.models.event import Event
from ..db.models.pageview import PageView
from ..core.security import get_current_active_user
from .schemas import (
    SiteCreate,
    SiteResponse,
    AnalyticsResponse,
    PageViewCreate,
    EventCreate,
    SessionCreate,
    EventResponse,
    AnalyticsFilter
)
from .service import AnalyticsService

router = APIRouter(prefix="/api/v1/analytics", tags=["analytics"])

@router.post("/events", response_model=EventResponse)
async def create_event(
    event: EventCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new analytics event.
    
    This endpoint is used to track user interactions and system events.
    For pageview events, it will also create a page view record.
    
    Args:
        event (EventCreate): Event data including name, type, and properties
        db (Session): Database session (injected)
        
    Returns:
        EventResponse: Created event record
    """
    analytics_service = AnalyticsService(db)
    return analytics_service.create_event(event)

@router.get("/events", response_model=List[EventResponse])
async def get_events(
    filter_params: AnalyticsFilter,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Retrieve filtered analytics events.
    
    This endpoint allows querying events with various filters including:
    - Date range
    - Event type
    - Site ID
    
    Args:
        filter_params (AnalyticsFilter): Filter parameters for the query
        db (Session): Database session (injected)
        current_user (User): Currently authenticated user (injected)
        
    Returns:
        List[EventResponse]: List of events matching the filter criteria
    """
    analytics_service = AnalyticsService(db)
    return analytics_service.get_events(filter_params)

@router.get("/events/counts")
async def get_event_counts(
    site_id: int,
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get event counts by type for a specific site.
    
    This endpoint provides aggregated counts of different event types
    within a specified time period.
    
    Args:
        site_id (int): ID of the site
        days (int): Number of days to look back (default: 30)
        db (Session): Database session (injected)
        current_user (User): Currently authenticated user (injected)
        
    Returns:
        dict: Dictionary mapping event types to their counts
    """
    analytics_service = AnalyticsService(db)
    return analytics_service.get_event_counts(site_id, days)

@router.get("/overview")
async def get_analytics_overview(
    site_id: str,
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get a comprehensive overview of analytics metrics.
    
    This endpoint provides a summary of key performance indicators including:
    - Page visits
    - Click-through rate
    - Bounce rate
    - Conversion rate
    - User retention rate
    
    Args:
        site_id (str): ID of the site
        days (int): Number of days to look back (default: 30)
        db (Session): Database session (injected)
        current_user (User): Currently authenticated user (injected)
        
    Returns:
        dict: Dictionary containing all analytics metrics
    """
    analytics_service = AnalyticsService(db)
    return analytics_service.get_analytics_overview(site_id, days)

@router.get("/pages")
async def get_page_performance(
    site_id: str,
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get page performance metrics over time.
    
    This endpoint provides daily metrics for each page including:
    - Page views
    - Clicks
    - Bounce rate
    
    Args:
        site_id (str): ID of the site
        days (int): Number of days to look back (default: 30)
        db (Session): Database session (injected)
        current_user (User): Currently authenticated user (injected)
        
    Returns:
        List[dict]: List of daily page performance metrics
    """
    analytics_service = AnalyticsService(db)
    return analytics_service.get_page_performance(site_id, days)

@router.get("/page-visits")
async def get_page_visits(
    site_id: str,
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get page visits data for graphing.
    
    Args:
        site_id (str): ID of the site
        days (int): Number of days to look back (default: 30)
        db (Session): Database session (injected)
        current_user (User): Currently authenticated user (injected)
        
    Returns:
        List[dict]: List of daily page visits with format:
        {
            date: str,
            visits: int
        }
    """
    analytics_service = AnalyticsService(db)
    return analytics_service.get_page_visits(site_id, days)