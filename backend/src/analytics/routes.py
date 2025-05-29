# Analytics Routes Module
# This module defines the API endpoints for analytics functionality:
# - Event tracking
# - Analytics data retrieval
# - Overview metrics

from .service import AnalyticsService
from .schemas import (
    EventResponse,
    AnalyticsFilter
)
from ..core.security import get_current_active_user
from ..db.models.pageview import PageView
from ..db.models.event import Event
from ..db.models.session import Session as DBSession
from ..db.models.site import Site
from ..db.models.user import User
from ..database import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import json
import logging

logger = logging.getLogger(__name__)


router = APIRouter(prefix="/api/v1/analytics", tags=["analytics"])


@router.post("/events")
async def create_event(
    event: dict,
    db: Session = Depends(get_db)
):
    """
    Create a new analytics event.
    """
    try:
        # Get or create site
        site = db.query(Site).filter(
            Site.domain == event.get('domain')).first()
        if not site:
            site = Site(
                name=f"Site {event.get('domain')}",
                domain=event.get('domain'),
                user_id=1  # Default user for now
            )
            db.add(site)
            db.commit()
            db.refresh(site)

        # Create the event
        analytics_event = Event(
            site_id=site.id,
            name=event.get('name'),
            properties=event.get('properties', {})
        )
        db.add(analytics_event)
        db.commit()
        db.refresh(analytics_event)

        # If it's a click event, update WebSocket
        if event.get('name') == 'click':
            from src.websocket.manager import manager
            click_data = manager.record_click(str(site.id))
            # Broadcast to all clients
            await manager.broadcast(json.dumps({
                "type": "analytics_update",
                "site_id": str(site.id),
                "data": click_data
            }))

        return {"status": "success", "event_id": analytics_event.id}
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating event: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": str(e)}
        )


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


@router.get("/conversion-rate")
async def get_conversion_rate(
    site_id: str,
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get conversion rate for a site.

    Args:
        site_id (str): ID of the site
        days (int): Number of days to look back (default: 30)
        db (Session): Database session (injected)
        current_user (User): Currently authenticated user (injected)

    Returns:
        float: Conversion rate as a percentage
    """
    analytics_service = AnalyticsService(db)
    return analytics_service.get_conversion_rate(site_id, days)


@router.get("/retention-rate")
async def get_retention_rate(
    site_id: str,
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get user retention rate for a site.

    Args:
        site_id (str): ID of the site
        days (int): Number of days to look back (default: 30)
        db (Session): Database session (injected)
        current_user (User): Currently authenticated user (injected)

    Returns:
        float: Retention rate as a percentage
    """
    analytics_service = AnalyticsService(db)
    return analytics_service.get_retention_rate(site_id, days)
