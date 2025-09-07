from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from database import get_db
from models import User, College
from schemas import UserCreate, UserLogin, Token, UserResponse, College as CollegeSchema, CollegeCreate
from auth import verify_password, create_access_token, get_password_hash

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if college exists
    college = db.query(College).filter(College.id == user.college_id).first()
    if not college:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="College not found"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role=user.role,
        department=user.department,
        year=user.year,
        phone=user.phone,
        college_id=user.college_id
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/login", response_model=Token)
async def login_user(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_credentials.email).first()
    
    if not user or not verify_password(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create access token
    access_token_expires = timedelta(minutes=60 * 24)  # 24 hours
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # Load college information
    user_with_college = db.query(User).filter(User.id == user.id).first()
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_with_college
    }

@router.get("/colleges", response_model=list[CollegeSchema])
async def get_colleges(db: Session = Depends(get_db)):
    colleges = db.query(College).all()
    return colleges

@router.post("/colleges", response_model=CollegeSchema)
async def create_college(college: CollegeCreate, db: Session = Depends(get_db)):
    db_college = College(**college.dict())
    db.add(db_college)
    db.commit()
    db.refresh(db_college)
    return db_college
