from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.models.analytics import AnalyticsEvent, Site
from backend.models.user import User
from backend.database.database import get_db
from backend.utils.logger import logger

router = APIRouter()

@router.post("/track")
async def track_event(
    event: AnalyticsEvent,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Get or create site
        site = await Site.create_if_not_exists(db, current_user.id, event.domain)
        
        # Create analytics event
        analytics_event = AnalyticsEvent(
            site_id=site.id,
            name=event.name,
            properties=event.properties
        )
        
        db.add(analytics_event)
        await db.commit()
        await db.refresh(analytics_event)
        
        return {"status": "success", "event_id": analytics_event.id}
    except Exception as e:
        logger.error(f"Error tracking event: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 