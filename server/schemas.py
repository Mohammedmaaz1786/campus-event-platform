from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List, Union
from datetime import datetime
from models import UserRole, EventStatus, EventCategory, RegistrationStatus

# Base schemas
class CollegeBase(BaseModel):
    name: str
    address: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[str] = None

class CollegeCreate(CollegeBase):
    pass

class College(CollegeBase):
    id: int
    logo: Optional[str] = None
    allow_student_registration: bool = True
    require_approval_for_events: bool = False
    max_events_per_student: int = 10
    email_notifications: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# User schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole = UserRole.STUDENT
    department: Optional[str] = None
    year: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str
    college_id: int

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    is_active: bool = True
    last_login: Optional[datetime] = None
    events_attended: int = 0
    college_id: int
    profile_image: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserResponse(User):
    college: Optional[College] = None

# Event schemas
class EventBase(BaseModel):
    title: str
    description: str
    date: datetime
    time: str
    location: str
    category: EventCategory
    max_attendees: int
    requirements: Optional[str] = None
    tags: Optional[str] = None
    is_registration_open: bool = True
    registration_deadline: Optional[datetime] = None

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    time: Optional[str] = None
    location: Optional[str] = None
    category: Optional[EventCategory] = None
    max_attendees: Optional[int] = None
    requirements: Optional[str] = None
    tags: Optional[str] = None
    is_registration_open: Optional[bool] = None
    registration_deadline: Optional[datetime] = None
    status: Optional[EventStatus] = None

class Event(EventBase):
    id: int
    registered_count: int = 0
    attended_count: int = 0
    status: EventStatus = EventStatus.ACTIVE
    image: Optional[str] = None
    qr_code: Optional[str] = None
    organizer_id: int
    college_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class EventResponse(Event):
    organizer: Optional[User] = None
    college: Optional[College] = None

# Registration schemas
class RegistrationBase(BaseModel):
    event_id: int

class RegistrationCreate(RegistrationBase):
    pass

class Registration(RegistrationBase):
    id: int
    student_id: int
    registration_date: datetime
    status: RegistrationStatus = RegistrationStatus.REGISTERED
    check_in_time: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class RegistrationResponse(Registration):
    student: Optional[User] = None
    event: Optional[Event] = None

# Feedback schemas
class FeedbackBase(BaseModel):
    event_id: int
    rating: int
    comment: Optional[str] = None
    
    @validator('rating')
    def validate_rating(cls, v):
        if v < 1 or v > 5:
            raise ValueError('Rating must be between 1 and 5')
        return v

class FeedbackCreate(FeedbackBase):
    pass

class Feedback(FeedbackBase):
    id: int
    student_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class FeedbackResponse(Feedback):
    student: Optional[User] = None
    event: Optional[Event] = None

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None

# Dashboard/Report schemas
class DashboardStats(BaseModel):
    total_events: int
    total_students: int
    total_registrations: int
    upcoming_events: int
    completed_events: int

class EventReport(BaseModel):
    event: Event
    total_registrations: int
    total_attendance: int
    attendance_rate: float
    avg_rating: Optional[float] = None
    feedback_count: int
