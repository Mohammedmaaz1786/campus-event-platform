from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc, func
from typing import List, Optional
from datetime import datetime

from database import get_db
from models import User, Event, Registration, Feedback, EventStatus, RegistrationStatus
from schemas import (
    Event as EventSchema, EventResponse,
    Registration as RegistrationSchema, RegistrationCreate, RegistrationResponse,
    Feedback as FeedbackSchema, FeedbackCreate, FeedbackResponse,
    UserResponse
)
from auth import get_current_student_user

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
async def get_student_profile(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    return current_user

@router.get("/events", response_model=List[EventResponse])
async def get_available_events(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db),
    category: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100)
):
    query = db.query(Event).filter(
        and_(
            Event.college_id == current_user.college_id,
            Event.status == EventStatus.ACTIVE,
            Event.date >= datetime.utcnow(),
            Event.is_registration_open == True
        )
    )
    
    if category:
        query = query.filter(Event.category == category)
    
    events = query.order_by(Event.date).offset(skip).limit(limit).all()
    return events

@router.post("/events/{event_id}/register", response_model=RegistrationResponse)
async def register_for_event(
    event_id: int,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    # Check if event exists and belongs to same college
    event = db.query(Event).filter(
        and_(
            Event.id == event_id,
            Event.college_id == current_user.college_id,
            Event.status == EventStatus.ACTIVE,
            Event.is_registration_open == True
        )
    ).first()
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found or registration closed"
        )
    
    # Check if event is full
    if event.registered_count >= event.max_attendees:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event is full"
        )
    
    # Check if registration deadline has passed
    if event.registration_deadline and event.registration_deadline < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration deadline has passed"
        )
    
    # Check if already registered
    existing_registration = db.query(Registration).filter(
        and_(
            Registration.student_id == current_user.id,
            Registration.event_id == event_id,
            Registration.status.in_([RegistrationStatus.REGISTERED, RegistrationStatus.ATTENDED])
        )
    ).first()
    
    if existing_registration:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already registered for this event"
        )
    
    # Create registration
    registration = Registration(
        student_id=current_user.id,
        event_id=event_id,
        status=RegistrationStatus.REGISTERED
    )
    
    # Update event registered count
    event.registered_count += 1
    
    db.add(registration)
    db.commit()
    db.refresh(registration)
    
    return registration

@router.delete("/events/{event_id}/register")
async def cancel_registration(
    event_id: int,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    registration = db.query(Registration).filter(
        and_(
            Registration.student_id == current_user.id,
            Registration.event_id == event_id,
            Registration.status == RegistrationStatus.REGISTERED
        )
    ).first()
    
    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found"
        )
    
    # Check if event hasn't started yet
    event = registration.event
    if event.date <= datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel registration for past events"
        )
    
    # Cancel registration
    registration.status = RegistrationStatus.CANCELLED
    event.registered_count -= 1
    
    db.commit()
    
    return {"message": "Registration cancelled successfully"}

@router.get("/registrations", response_model=List[RegistrationResponse])
async def get_my_registrations(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db),
    status_filter: Optional[str] = Query(None)
):
    query = db.query(Registration).filter(
        Registration.student_id == current_user.id
    )
    
    if status_filter:
        query = query.filter(Registration.status == status_filter)
    
    registrations = query.order_by(desc(Registration.created_at)).all()
    return registrations

@router.post("/events/{event_id}/feedback", response_model=FeedbackResponse)
async def submit_feedback(
    event_id: int,
    feedback: FeedbackCreate,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    # Check if student attended the event
    registration = db.query(Registration).filter(
        and_(
            Registration.student_id == current_user.id,
            Registration.event_id == event_id,
            Registration.status == RegistrationStatus.ATTENDED
        )
    ).first()
    
    if not registration:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only provide feedback for attended events"
        )
    
    # Check if feedback already exists
    existing_feedback = db.query(Feedback).filter(
        and_(
            Feedback.student_id == current_user.id,
            Feedback.event_id == event_id
        )
    ).first()
    
    if existing_feedback:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Feedback already submitted for this event"
        )
    
    # Create feedback
    db_feedback = Feedback(
        student_id=current_user.id,
        event_id=event_id,
        rating=feedback.rating,
        comment=feedback.comment
    )
    
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    
    return db_feedback

@router.get("/events/{event_id}", response_model=EventResponse)
async def get_event_details(
    event_id: int,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
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

@router.get("/events/history", response_model=List[EventResponse])
async def get_attended_events(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    events = db.query(Event).join(Registration).filter(
        and_(
            Registration.student_id == current_user.id,
            Registration.status == RegistrationStatus.ATTENDED,
            Event.college_id == current_user.college_id
        )
    ).order_by(desc(Event.date)).all()
    
    return events
