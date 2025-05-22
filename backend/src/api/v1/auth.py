# Authentication endpoints (login, signup)

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Any
from ...core.auth import (
    verify_password,
    create_access_token,
    get_password_hash,
    get_current_active_user,
)
from ...database import get_db
from ...models.auth import User
from ...schemas.auth import Token, UserCreate, UserResponse

# Initialising Router
router = APIRouter()


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    # Find user by email
    user = db.query(User).filter(User.email == form_data.username).first()
    
    # Check if user exists and password is correct
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "redirect_url": f"/dashboard?user_id={user.id}"
    }

# Requets reaches this endpoint
@router.post("/register", response_model=UserResponse)
async def register(
    user_in: UserCreate, # 5. Data is validated against UserCreate schema
    db: Session = Depends(get_db) # 6. Database session is created
) -> Any:
    """
    Register new user
    """
    # Check if user already exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user with hashed password
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password), # Password is hashed
        full_name=user_in.full_name,
        is_active=True
    )
     # Save to database
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user

@router.get("/me", response_model=UserResponse)
async def read_users_me(
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get current user
    """
    return current_user
