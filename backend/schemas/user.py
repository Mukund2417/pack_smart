from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str = 'FARMER_USER'

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str

class QueryLogResponse(BaseModel):
    id: int
    user_id: int
    commodity_id: Optional[int] = None
    recommended_laminate: Optional[str] = None
    simulated_shelf_life_days: Optional[float] = None
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)
