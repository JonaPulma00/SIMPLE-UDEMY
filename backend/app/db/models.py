from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey, UniqueConstraint, Text, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

Base = declarative_base()

class User(Base):
  __tablename__ = 'users'

  user_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
  username = Column(String(50), unique=True, nullable=False)
  email = Column(String(100), unique=True, nullable=False)
  password = Column(String(255), nullable=True)
  profile_picture = Column(String(255), nullable=True)
  bio = Column(Text, nullable=True)
  created_at = Column(TIMESTAMP, server_default=func.now())
  is_instructor = Column(Boolean, default=False)
  pending_validation = Column(Boolean, default=False)
  courses = relationship("Course", back_populates="instructor", cascade="all, delete")
  streams = relationship("Stream", back_populates="instructor", cascade="all, delete")
  stream_messages = relationship("StreamMessage", back_populates="user", cascade="all, delete")

class Course(Base):
    __tablename__ = 'courses'

    course_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    instructor_id = Column(String(36), ForeignKey('users.user_id', ondelete="CASCADE"), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    category_id = Column(String(36), ForeignKey('categories.category_id', ondelete="SET NULL"), nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    instructor = relationship("User", back_populates="courses")
    sections = relationship("Section", back_populates="course", cascade="all, delete")
    streams = relationship("Stream", back_populates="course", cascade="all, delete")

class Category(Base):
    __tablename__ = 'categories'
    
    category_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)

class Enrollments(Base):
    __tablename__ = 'enrollments'

    enrollment_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4())) 
    user_id = Column(String(36), ForeignKey('users.user_id', ondelete="CASCADE"), nullable=False)  
    course_id = Column(String(36), ForeignKey('courses.course_id', ondelete="CASCADE"), nullable=False)  
    enrolled_at = Column(TIMESTAMP, server_default=func.now())  

    __table_args__ = (UniqueConstraint('user_id', 'course_id', name='uq_user_course'),) 

class Section(Base):
    __tablename__ = 'sections'

    section_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(String(36), ForeignKey('courses.course_id', ondelete="CASCADE"), nullable=False)
    title = Column(String(100), nullable=False)
    position = Column(Integer, nullable=False)

    course = relationship("Course", back_populates="sections")
    lessons = relationship("Lesson", back_populates="section", cascade="all, delete")

class Lesson(Base):
    __tablename__ = 'lessons'

    lesson_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    section_id = Column(String(36), ForeignKey('sections.section_id', ondelete="CASCADE"), nullable=False)
    title = Column(String(100), nullable=False)
    video_url = Column(String(255), nullable=True)
    position = Column(Integer, nullable=False)

    section = relationship("Section", back_populates="lessons")

class Stream(Base):
    __tablename__ = 'streams'

    stream_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    instructor_id = Column(String(36), ForeignKey('users.user_id', ondelete="CASCADE"), nullable=False)
    course_id = Column(String(36), ForeignKey('courses.course_id', ondelete="SET NULL"), nullable=True)
    title = Column(String(100), nullable=True)
    started_at = Column(TIMESTAMP, server_default=func.now())
    ended_at = Column(TIMESTAMP, nullable=True)

    instructor = relationship("User", back_populates="streams")
    course = relationship("Course", back_populates="streams")
    messages = relationship("StreamMessage", back_populates="stream", cascade="all, delete")

class StreamMessage(Base):
    __tablename__ = 'stream_messages'

    message_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    stream_id = Column(String(36), ForeignKey('streams.stream_id', ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey('users.user_id', ondelete="CASCADE"), nullable=False)
    message = Column(Text, nullable=False)
    sent_at = Column(TIMESTAMP, server_default=func.now())

    stream = relationship("Stream", back_populates="messages")
    user = relationship("User", back_populates="stream_messages")
