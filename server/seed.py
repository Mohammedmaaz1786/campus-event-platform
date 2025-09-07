import asyncio
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import sys
import os

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))

from database import SessionLocal, engine
from models import Base, College, User, Event, UserRole, EventCategory, EventStatus
from auth import get_password_hash

def create_tables():
    """Create database tables"""
    Base.metadata.create_all(bind=engine)

def seed_database():
    """Seed the database with initial data"""
    db = SessionLocal()
    
    try:
        # Create sample colleges
        colleges = [
            College(
                name="Tech University",
                address="123 Tech Street, Silicon Valley, CA 94000",
                phone="+1-555-0123",
                email="info@techuniv.edu",
                website="https://techuniv.edu"
            ),
            College(
                name="Business Institute",
                address="456 Business Ave, New York, NY 10001",
                phone="+1-555-0456",
                email="info@bizinst.edu",
                website="https://bizinst.edu"
            )
        ]
        
        for college in colleges:
            existing = db.query(College).filter(College.name == college.name).first()
            if not existing:
                db.add(college)
        
        db.commit()
        
        # Get college IDs
        tech_univ = db.query(College).filter(College.name == "Tech University").first()
        biz_inst = db.query(College).filter(College.name == "Business Institute").first()
        
        # Create sample users
        users = [
            # Admins
            User(
                name="John Admin",
                email="admin@techuniv.edu",
                password=get_password_hash("admin123"),
                role=UserRole.ADMIN,
                department="Administration",
                college_id=tech_univ.id
            ),
            User(
                name="Jane Admin",
                email="admin@bizinst.edu",
                password=get_password_hash("admin123"),
                role=UserRole.ADMIN,
                department="Administration",
                college_id=biz_inst.id
            ),
            # Students
            User(
                name="Alice Student",
                email="alice@techuniv.edu",
                password=get_password_hash("student123"),
                role=UserRole.STUDENT,
                department="Computer Science",
                year="3rd Year",
                college_id=tech_univ.id
            ),
            User(
                name="Bob Student",
                email="bob@techuniv.edu",
                password=get_password_hash("student123"),
                role=UserRole.STUDENT,
                department="Engineering",
                year="2nd Year",
                college_id=tech_univ.id
            ),
            User(
                name="Carol Student",
                email="carol@bizinst.edu",
                password=get_password_hash("student123"),
                role=UserRole.STUDENT,
                department="Business Administration",
                year="4th Year",
                college_id=biz_inst.id
            )
        ]
        
        for user in users:
            existing = db.query(User).filter(User.email == user.email).first()
            if not existing:
                db.add(user)
        
        db.commit()
        
        # Get admin users for organizing events
        tech_admin = db.query(User).filter(User.email == "admin@techuniv.edu").first()
        biz_admin = db.query(User).filter(User.email == "admin@bizinst.edu").first()
        
        # Create sample events
        now = datetime.utcnow()
        events = [
            # Tech University Events
            Event(
                title="AI Workshop",
                description="Learn about the latest developments in Artificial Intelligence and Machine Learning",
                date=now + timedelta(days=7),
                time="10:00 AM",
                location="Tech Building Room 101",
                category=EventCategory.TECHNOLOGY,
                max_attendees=50,
                organizer_id=tech_admin.id,
                college_id=tech_univ.id,
                status=EventStatus.ACTIVE,
                is_registration_open=True,
                registration_deadline=now + timedelta(days=5)
            ),
            Event(
                title="Career Fair 2024",
                description="Meet with top tech companies and explore career opportunities",
                date=now + timedelta(days=14),
                time="9:00 AM",
                location="University Auditorium",
                category=EventCategory.CAREER,
                max_attendees=200,
                organizer_id=tech_admin.id,
                college_id=tech_univ.id,
                status=EventStatus.ACTIVE,
                is_registration_open=True,
                registration_deadline=now + timedelta(days=12)
            ),
            Event(
                title="Programming Contest",
                description="Test your coding skills in our annual programming competition",
                date=now + timedelta(days=21),
                time="2:00 PM",
                location="Computer Lab A",
                category=EventCategory.ACADEMIC,
                max_attendees=30,
                organizer_id=tech_admin.id,
                college_id=tech_univ.id,
                status=EventStatus.ACTIVE,
                is_registration_open=True,
                registration_deadline=now + timedelta(days=18)
            ),
            # Business Institute Events
            Event(
                title="Entrepreneurship Seminar",
                description="Learn how to start and grow your own business",
                date=now + timedelta(days=10),
                time="11:00 AM",
                location="Business Hall Room 201",
                category=EventCategory.SEMINAR,
                max_attendees=75,
                organizer_id=biz_admin.id,
                college_id=biz_inst.id,
                status=EventStatus.ACTIVE,
                is_registration_open=True,
                registration_deadline=now + timedelta(days=8)
            ),
            Event(
                title="Networking Event",
                description="Connect with alumni and industry professionals",
                date=now + timedelta(days=17),
                time="6:00 PM",
                location="Business Center Lobby",
                category=EventCategory.CAREER,
                max_attendees=100,
                organizer_id=biz_admin.id,
                college_id=biz_inst.id,
                status=EventStatus.ACTIVE,
                is_registration_open=True,
                registration_deadline=now + timedelta(days=15)
            )
        ]
        
        for event in events:
            existing = db.query(Event).filter(
                Event.title == event.title,
                Event.college_id == event.college_id
            ).first()
            if not existing:
                db.add(event)
        
        db.commit()
        
        print("Database seeded successfully!")
        print("\nSample Users Created:")
        print("Tech University Admin: admin@techuniv.edu / admin123")
        print("Business Institute Admin: admin@bizinst.edu / admin123")
        print("Tech Student: alice@techuniv.edu / student123")
        print("Tech Student: bob@techuniv.edu / student123")
        print("Business Student: carol@bizinst.edu / student123")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating database tables...")
    create_tables()
    print("Seeding database with sample data...")
    seed_database()
