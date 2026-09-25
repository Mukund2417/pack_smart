# Consolidated model re-export to eliminate duplicate SQLAlchemy table definitions
from backend.models import User

# Retain QueryLog definition mapped to User
from sqlalchemy import Integer, String, Text, Float, DateTime, Column, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.database import Base

class QueryLog(Base):
    __tablename__ = 'query_logs'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(36), ForeignKey('users.user_id'), nullable=True)
    commodity_id = Column(String(36), nullable=True)
    recommended_laminate = Column(Text, nullable=True)
    simulated_shelf_life_days = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
