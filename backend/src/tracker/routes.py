from fastapi import APIRouter, Depends, HTTPException, Header, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from ..database import get_db
from . import schemas
from ..db.models import Event, PageView

router = APIRouter()


@router.post("/events", response_model=schemas.EventResponse)
async def create_event(
    event: schemas.EventCreate,
    request: Request,
    x_site_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Create a new tracking event.

    This endpoint is used by the tracker script to record user interactions.
    Requires X-Site-ID header for authentication.
    """
    # Verify site_id matches header
    if x_site_id and event.site_id != x_site_id:
        raise HTTPException(status_code=403, detail="Site ID mismatch")

    # Create event record
    db_event = Event(
        site_id=event.site_id,
        event_type=event.event_type,
        properties=event.properties,
        url=event.url,
        referrer=event.referrer,
        timestamp=event.timestamp,
        session_id=event.session_id,
        user_id=event.user_id
    )

    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


@router.get("/events", response_model=List[schemas.EventResponse])
async def get_events(
    filter_params: schemas.EventFilter,
    db: Session = Depends(get_db)
):
    """
    Get filtered events.

    This endpoint allows querying events with various filters including:
    - Site ID
    - Event type
    - Date range
    - Session ID
    - User ID
    """
    query = db.query(Event)

    if filter_params.site_id:
        query = query.filter(Event.site_id == filter_params.site_id)
    if filter_params.event_type:
        query = query.filter(Event.event_type == filter_params.event_type)
    if filter_params.start_date:
        query = query.filter(Event.timestamp >= filter_params.start_date)
    if filter_params.end_date:
        query = query.filter(Event.timestamp <= filter_params.end_date)
    if filter_params.session_id:
        query = query.filter(Event.session_id == filter_params.session_id)
    if filter_params.user_id:
        query = query.filter(Event.user_id == filter_params.user_id)

    return query.order_by(Event.timestamp.desc()).all()


@router.post("/pageview")
async def track_pageview(pageview: PageView, db: Session = Depends(get_db)):
    try:
        db_pageview = PageView(**pageview.dict())
        db.add(db_pageview)
        db.commit()
        db.refresh(db_pageview)
        return {"status": "success", "message": "Page view tracked successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/event")
async def track_event(event: Event, db: Session = Depends(get_db)):
    try:
        db_event = Event(**event.dict())
        db.add(db_event)
        db.commit()
        db.refresh(db_event)
        return {"status": "success", "message": "Event tracked successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
