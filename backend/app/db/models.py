from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey, DECIMAL, Integer, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class User(Base):
  __tablename__ = 'users'

  user_id = Column(String(36), primary_key=True)
  username = Column(String(50), unique=True, nullable=False)
  email = Column(String(100), unique=True, nullable=False)
  password = Column(String(255), nullable=False)
  profile_picture = Column(String(255), nullable=True)
  bio = Column(Text, nullable=True)
  created_at = Column(TIMESTAMP, server_default=func.now())