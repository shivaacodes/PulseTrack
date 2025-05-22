from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from src.db.database import get_db
from src.db.models.event import Event
from src.db.models.site import Site

router = APIRouter()

@router.get("/analytics/clicks")
async def get_click_analytics(
    site_id: str,
    start_date: datetime = None,
    end_date: datetime = None,
    db: Session = Depends(get_db)
):
    # Verify site exists
    site = db.query(Site).filter(Site.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    # Set default date range if not provided
    if not end_date:
        end_date = datetime.utcnow()
    if not start_date:
        start_date = end_date - timedelta(days=7)

    # Query click events
    click_events = db.query(
        func.date(Event.created_at).label('date'),
        func.count().label('click_count')
    ).filter(
        Event.site_id == site_id,
        Event.type == 'click',
        Event.created_at.between(start_date, end_date)
    ).group_by(
        func.date(Event.created_at)
    ).all()

    # Calculate click rate (clicks per page view)
    page_views = db.query(
        func.date(Event.created_at).label('date'),
        func.count().label('page_view_count')
    ).filter(
        Event.site_id == site_id,
        Event.type == 'page_view',
        Event.created_at.between(start_date, end_date)
    ).group_by(
        func.date(Event.created_at)
    ).all()

    # Combine results
    results = []
    for date, click_count in click_events:
        page_view_count = next((pv.page_view_count for pv in page_views if pv.date == date), 0)
        click_rate = (click_count / page_view_count * 100) if page_view_count > 0 else 0
        
        results.append({
            "date": date.isoformat(),
            "clicks": click_count,
            "page_views": page_view_count,
            "click_rate": round(click_rate, 2)
        })

    return {
        "site_id": site_id,
        "period": {
            "start": start_date.isoformat(),
            "end": end_date.isoformat()
        },
        "metrics": results
    }

@router.get("/analytics/elements")
async def get_element_analytics(
    site_id: str,
    start_date: datetime = None,
    end_date: datetime = None,
    db: Session = Depends(get_db)
):
    # Verify site exists
    site = db.query(Site).filter(Site.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    # Set default date range if not provided
    if not end_date:
        end_date = datetime.utcnow()
    if not start_date:
        start_date = end_date - timedelta(days=7)

    # Query click events by element
    element_clicks = db.query(
        Event.data['element'].label('element'),
        func.count().label('click_count')
    ).filter(
        Event.site_id == site_id,
        Event.type == 'click',
        Event.created_at.between(start_date, end_date)
    ).group_by(
        Event.data['element']
    ).order_by(
        func.count().desc()
    ).limit(10).all()

    return {
        "site_id": site_id,
        "period": {
            "start": start_date.isoformat(),
            "end": end_date.isoformat()
        },
        "top_elements": [
            {
                "element": click.element,
                "clicks": click.click_count
            }
            for click in element_clicks
        ]
    } 