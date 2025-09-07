from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Enum, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    STUDENT = "student"
    FACULTY = "faculty"

class EventStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class EventCategory(str, enum.Enum):
    TECHNOLOGY = "Technology"
    CAREER = "Career"
    CULTURAL = "Cultural"
    SPORTS = "Sports"
    ACADEMIC = "Academic"
    WORKSHOP = "Workshop"
    SEMINAR = "Seminar"
    OTHER = "Other"

class RegistrationStatus(str, enum.Enum):
    REGISTERED = "registered"
    CANCELLED = "cancelled"
    ATTENDED = "attended"
    NO_SHOW = "no-show"

class College(Base):
    __tablename__ = "colleges"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    address = Column(Text, nullable=False)
    phone = Column(String)
    email = Column(String)
    website = Column(String)
    logo = Column(String)
    allow_student_registration = Column(Boolean, default=True)
    require_approval_for_events = Column(Boolean, default=False)
    max_events_per_student = Column(Integer, default=10)
    email_notifications = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    users = relationship("User", back_populates="college")
    events = relationship("Event", back_populates="college")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.STUDENT)
    department = Column(String)
    year = Column(String)
    phone = Column(String)
    profile_image = Column(String)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime(timezone=True))
    events_attended = Column(Integer, default=0)
    college_id = Column(Integer, ForeignKey("colleges.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    college = relationship("College", back_populates="users")
    organized_events = relationship("Event", back_populates="organizer")
    registrations = relationship("Registration", back_populates="student")
    feedback = relationship("Feedback", back_populates="student")

class Event(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=False)
    date = Column(DateTime(timezone=True), nullable=False, index=True)
    time = Column(String, nullable=False)
    location = Column(String, nullable=False)
    category = Column(Enum(EventCategory), nullable=False, index=True)
    max_attendees = Column(Integer, nullable=False)
    registered_count = Column(Integer, default=0)
    attended_count = Column(Integer, default=0)
    status = Column(Enum(EventStatus), default=EventStatus.ACTIVE, index=True)
    image = Column(String)
    requirements = Column(Text)
    tags = Column(String)  # JSON string for tags
    qr_code = Column(String)
    is_registration_open = Column(Boolean, default=True)
    registration_deadline = Column(DateTime(timezone=True))
    organizer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    college_id = Column(Integer, ForeignKey("colleges.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    organizer = relationship("User", back_populates="organized_events")
    college = relationship("College", back_populates="events")
    registrations = relationship("Registration", back_populates="event")
    feedback = relationship("Feedback", back_populates="event")

class Registration(Base):
    __tablename__ = "registrations"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    registration_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(Enum(RegistrationStatus), default=RegistrationStatus.REGISTERED)
    check_in_time = Column(DateTime(timezone=True))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    student = relationship("User", back_populates="registrations")
    event = relationship("Event", back_populates="registrations")
    
    # Unique constraint
    __table_args__ = (
        {"extend_existing": True},
    )

class Feedback(Base):
    __tablename__ = "feedback"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 rating
    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    student = relationship("User", back_populates="feedback")
    event = relationship("Event", back_populates="feedback")
