from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), index=True)
    email = Column(String(255), unique=True, index=True)
    password_hash = Column(String(255))
    profile_picture_url = Column(String(255), nullable=True)
    endpoint_id = Column(String(50), unique=True, index=True)

class WebhookRequest(Base):
    __tablename__ = "webhook_requests"
    id = Column(Integer, primary_key=True, index=True)
    endpoint_id = Column(String(50), index=True)
    http_method = Column(String(10))
    headers = Column(Text)
    body = Column(Text)
    remote_ip = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)