from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from backend.database import get_db
from backend.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from backend.models.user import User
from backend.auth.jwt_handler import create_access_token
from backend.auth.rbac import get_current_user
from google.oauth2 import id_token
from google.auth.transport import requests
from pydantic import BaseModel
from backend.config import settings
import os

class GoogleAuthRequest(BaseModel):
    token: str


router = APIRouter(prefix="/api/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


@router.post("/register", response_model=TokenResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_username = db.query(User).filter(User.username == user_in.username).first()
    if db_username:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_pwd = get_password_hash(user_in.password)
    new_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_pwd,
        role=user_in.role if user_in.role else "FARMER_USER"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(data={"sub": new_user.email, "role": new_user.role})
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        role=new_user.role,
        username=new_user.username
    )


@router.post("/login", response_model=TokenResponse)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        role=user.role,
        username=user.username
    )


@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/google", response_model=TokenResponse)
def google_auth(request: GoogleAuthRequest, db: Session = Depends(get_db)):
    try:
        client_id = settings.GOOGLE_CLIENT_ID
        idinfo = id_token.verify_oauth2_token(request.token, requests.Request(), client_id)
        
        email = idinfo.get("email")
        name = idinfo.get("name")
        
        user = db.query(User).filter(User.email == email).first()
        if not user:
            # Auto-create user
            user = User(
                name=name,
                email=email,
                auth_provider="google",
                role="user"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
        # If user exists but auth_provider is email, we just let them log in anyway 
        # (effectively linking the account)
        
        access_token = create_access_token(data={"sub": user.email, "role": user.role})
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user={
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "auth_provider": user.auth_provider
            }
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Google token")
