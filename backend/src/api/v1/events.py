from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from src.db.database import get_db
from src.db.models.site import Site
from src.db.models.event import Event
from sqlalchemy.orm import Session
from fastapi import Depends

router = APIRouter()

# Pydantic schema for event payload


class EventCreate(BaseModel):
    site_id: str
    type: str
    data: dict

# Dependency for database session


def get_db_session():
    db = get_db()
    try:
        yield db
    finally:
        db.close()


@router.post("/events")
async def create_event(
    event: EventCreate,
    x_site_id: str = Header(...),
    db: Session = Depends(get_db_session),
):
    # Verify site_id
    site = db.query(Site).filter(Site.id == event.site_id).first()
    if not site or site.id != x_site_id:
        raise HTTPException(status_code=403, detail="Invalid site ID")

    # Save event to database
    db_event = Event(
        site_id=event.site_id,
        type=event.type,
        data=event.data,
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return {"message": "Event recorded"}
