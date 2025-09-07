from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_
from typing import List, Optional
from datetime import datetime

from database import get_db
from models import User, Event, Registration, College, Feedback, EventStatus, RegistrationStatus
from schemas import (
    Event as EventSchema, EventCreate, EventUpdate, EventResponse,
    User as UserSchema, UserResponse,
    Registration as RegistrationSchema, RegistrationResponse,
    DashboardStats, EventReport,
    Feedback as FeedbackSchema, FeedbackResponse
)
from auth import get_current_admin_user

router = APIRouter()

@router.get("/dashboard", response_model=DashboardStats)
async def get_admin_dashboard(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    college_id = current_user.college_id
    
    # Get statistics for the admin's college
    total_events = db.query(Event).filter(Event.college_id == college_id).count()
    total_students = db.query(User).filter(
        and_(User.college_id == college_id, User.role == "student")
    ).count()
    total_registrations = db.query(Registration).join(Event).filter(
        Event.college_id == college_id
    ).count()
    upcoming_events = db.query(Event).filter(
        and_(
            Event.college_id == college_id,
            Event.date >= datetime.utcnow(),
            Event.status == EventStatus.ACTIVE
        )
    ).count()
    completed_events = db.query(Event).filter(
        and_(
            Event.college_id == college_id,
            Event.status == EventStatus.COMPLETED
        )
    ).count()
    
    return DashboardStats(
        total_events=total_events,
        total_students=total_students,
        total_registrations=total_registrations,
        upcoming_events=upcoming_events,
        completed_events=completed_events
    )

@router.get("/events", response_model=List[EventResponse])
async def get_admin_events(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100)
):
    events = db.query(Event).filter(
        Event.college_id == current_user.college_id
    ).order_by(desc(Event.created_at)).offset(skip).limit(limit).all()
    
    return events

@router.post("/events", response_model=EventResponse)
async def create_event(
    event: EventCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    db_event = Event(
        **event.dict(),
        organizer_id=current_user.id,
        college_id=current_user.college_id
    )
    
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    
    return db_event

@router.put("/events/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: int,
    event_update: EventUpdate,
    current_user: User = Depends(get_current_admin_user),
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
    
    update_data = event_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(event, field, value)
    
    db.commit()
    db.refresh(event)
    
    return event

@router.delete("/events/{event_id}")
async def delete_event(
    event_id: int,
    current_user: User = Depends(get_current_admin_user),
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
    
    db.delete(event)
    db.commit()
    
    return {"message": "Event deleted successfully"}

@router.get("/events/{event_id}/registrations", response_model=List[RegistrationResponse])
async def get_event_registrations(
    event_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    # Verify event belongs to admin's college
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
    
    registrations = db.query(Registration).filter(
        Registration.event_id == event_id
    ).all()
    
    return registrations

@router.put("/registrations/{registration_id}/checkin")
async def checkin_student(
    registration_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    # Get registration and verify it belongs to admin's college
    registration = db.query(Registration).join(Event).filter(
        and_(
            Registration.id == registration_id,
            Event.college_id == current_user.college_id
        )
    ).first()
    
    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found"
        )
    
    if registration.status == RegistrationStatus.ATTENDED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student already checked in"
        )
    
    # Update registration
    registration.status = RegistrationStatus.ATTENDED
    registration.check_in_time = datetime.utcnow()
    
    # Update event attended count
    event = registration.event
    event.attended_count += 1
    
    # Update user events attended count
    student = registration.student
    student.events_attended += 1
    
    db.commit()
    
    return {"message": "Student checked in successfully"}

@router.get("/students", response_model=List[UserResponse])
async def get_students(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100)
):
    students = db.query(User).filter(
        and_(
            User.college_id == current_user.college_id,
            User.role == "student"
        )
    ).offset(skip).limit(limit).all()
    
    return students

@router.get("/reports/events", response_model=List[EventReport])
async def get_event_reports(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    events = db.query(Event).filter(
        Event.college_id == current_user.college_id
    ).all()
    
    reports = []
    for event in events:
        registrations_count = db.query(Registration).filter(
            Registration.event_id == event.id
        ).count()
        
        attendance_count = db.query(Registration).filter(
            and_(
                Registration.event_id == event.id,
                Registration.status == RegistrationStatus.ATTENDED
            )
        ).count()
        
        avg_rating = db.query(func.avg(Feedback.rating)).filter(
            Feedback.event_id == event.id
        ).scalar()
        
        feedback_count = db.query(Feedback).filter(
            Feedback.event_id == event.id
        ).count()
        
        attendance_rate = (attendance_count / registrations_count * 100) if registrations_count > 0 else 0
        
        reports.append(EventReport(
            event=event,
            total_registrations=registrations_count,
            total_attendance=attendance_count,
            attendance_rate=attendance_rate,
            avg_rating=float(avg_rating) if avg_rating else None,
            feedback_count=feedback_count
        ))
    
    return reports

@router.get("/feedback", response_model=List[FeedbackResponse])
async def get_all_feedback(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
    event_id: Optional[int] = Query(None)
):
    query = db.query(Feedback).join(Event).filter(
        Event.college_id == current_user.college_id
    )
    
    if event_id:
        query = query.filter(Feedback.event_id == event_id)
    
    feedback = query.order_by(desc(Feedback.created_at)).all()
    return feedback
