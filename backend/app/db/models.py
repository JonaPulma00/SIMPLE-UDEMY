from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey, UniqueConstraint, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid

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
  is_instructor = Column(Boolean, default=False)
  pending_validation = Column(Boolean, default=False)

class Course(Base):
    __tablename__ = 'courses'

    course_id = Column(String(36), primary_key=True)
    instructor_id = Column(String(36), ForeignKey('users.user_id'), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    category_id = Column(String(36), ForeignKey('categories.category_id'), nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

class Category(Base):
    __tablename__ = 'categories'
    
    category_id = Column(String(36), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)

class Enrollments(Base):
    __tablename__ = 'enrollments'

    enrollment_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4())) 
    user_id = Column(String(36), ForeignKey('users.user_id', ondelete="CASCADE"), nullable=False)  
    course_id = Column(String(36), ForeignKey('courses.course_id', ondelete="CASCADE"), nullable=False)  
    enrolled_at = Column(TIMESTAMP, server_default=func.now())  

    __table_args__ = (UniqueConstraint('user_id', 'course_id', name='uq_user_course'),) 