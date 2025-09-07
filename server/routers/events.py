from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc, func
from typing import List, Optional
from datetime import datetime

from database import get_db
from models import Event, EventStatus
from schemas import Event as EventSchema, EventResponse
from auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[EventResponse])
async def get_all_events(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db),
    category: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100)
):
    """Get all events for the user's college"""
    query = db.query(Event).filter(
        Event.college_id == current_user.college_id
    )
    
    if category:
        query = query.filter(Event.category == category)
    
    if status_filter:
        query = query.filter(Event.status == status_filter)
    
    events = query.order_by(desc(Event.date)).offset(skip).limit(limit).all()
    return events

@router.get("/upcoming", response_model=List[EventResponse])
async def get_upcoming_events(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=50)
):
    """Get upcoming events for the user's college"""
    events = db.query(Event).filter(
        and_(
            Event.college_id == current_user.college_id,
            Event.date >= datetime.utcnow(),
            Event.status == EventStatus.ACTIVE
        )
    ).order_by(Event.date).limit(limit).all()
    
    return events

@router.get("/popular", response_model=List[EventResponse])
async def get_popular_events(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=50)
):
    """Get most popular events (by registration count) for the user's college"""
    events = db.query(Event).filter(
        and_(
            Event.college_id == current_user.college_id,
            Event.status == EventStatus.ACTIVE
        )
    ).order_by(desc(Event.registered_count)).limit(limit).all()
    
    return events

@router.get("/categories")
async def get_event_categories(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all event categories used in the user's college"""
    categories = db.query(Event.category).filter(
        Event.college_id == current_user.college_id
    ).distinct().all()
    
    return [category[0] for category in categories]

@router.get("/{event_id}", response_model=EventResponse)
async def get_event_by_id(
    event_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific event by ID"""
    event = db.query(Event).filter(
        and_(
            Event.id == event_id,
            Event.college_id == current_user.college_id
        )
    ).first()
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    return event
