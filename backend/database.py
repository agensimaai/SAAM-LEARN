from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, JSON, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
from typing import Optional, Dict, Any
import json
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./learning_system.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Database Models
class StudentProfile(Base):
    __tablename__ = "student_profiles"
    
    student_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    grade = Column(String, nullable=False)
    school_board = Column(String, nullable=False)
    syllabus = Column(String, nullable=False)
    hobbies = Column(JSON, default=list)
    interests = Column(JSON, default=list)
    sports = Column(JSON, default=list)
    daily_routine = Column(Text, nullable=True)
    cultural_context = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class LearningStyle(Base):
    __tablename__ = "learning_styles"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String, index=True, nullable=False)
    primary_style = Column(String, nullable=False)
    secondary_styles = Column(JSON, default=list)
    prefers_examples = Column(Boolean, default=True)
    prefers_visuals = Column(Boolean, default=True)
    prefers_stories = Column(Boolean, default=False)
    needs_repetition = Column(Boolean, default=False)
    learns_by_teaching = Column(Boolean, default=False)
    attention_span_minutes = Column(Integer, default=30)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class AcademicRecord(Base):
    __tablename__ = "academic_records"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String, index=True, nullable=False)
    subjects = Column(JSON, default=list)
    current_grades = Column(JSON, default=dict)
    test_scores = Column(JSON, default=list)
    weak_concepts = Column(JSON, default=list)
    mastered_concepts = Column(JSON, default=list)
    in_progress_concepts = Column(JSON, default=list)
    overall_performance = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class BehavioralRecord(Base):
    __tablename__ = "behavioral_records"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String, index=True, nullable=False)
    motivation_level = Column(String, nullable=False)
    attention_span = Column(Integer, default=30)
    study_habits = Column(JSON, default=list)
    procrastination_tendency = Column(String, nullable=True)
    stress_indicators = Column(JSON, default=list)
    preferred_study_time = Column(String, nullable=True)
    energy_levels = Column(JSON, default=dict)
    consistency_score = Column(Float, default=0.5)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class CareerInterest(Base):
    __tablename__ = "career_interests"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String, index=True, nullable=False)
    interests = Column(JSON, default=list)
    career_goals = Column(JSON, default=list)
    exploration_areas = Column(JSON, default=list)
    strengths = Column(JSON, default=list)
    role_models = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Session(Base):
    __tablename__ = "sessions"
    
    session_id = Column(String, primary_key=True, index=True)
    student_id = Column(String, index=True, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    agent_type = Column(String, nullable=False)
    interactions = Column(JSON, default=list)
    outcomes = Column(JSON, default=dict)
    duration_minutes = Column(Integer, nullable=True)
    student_engagement = Column(String, nullable=True)


class Assessment(Base):
    __tablename__ = "assessments"
    
    assessment_id = Column(String, primary_key=True, index=True)
    student_id = Column(String, index=True, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    assessment_type = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    topics = Column(JSON, default=list)
    questions = Column(JSON, default=list)
    student_answers = Column(JSON, default=list)
    total_marks = Column(Float, nullable=False)
    marks_obtained = Column(Float, nullable=False)
    percentage = Column(Float, nullable=False)
    diagnostic_report = Column(Text, nullable=True)
    error_patterns = Column(JSON, default=list)
    concepts_to_review = Column(JSON, default=list)


class LearningPlanRecord(Base):
    __tablename__ = "learning_plans"
    
    plan_id = Column(String, primary_key=True, index=True)
    student_id = Column(String, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    plan_type = Column(String, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    daily_tasks = Column(JSON, default=list)
    weekly_goals = Column(JSON, default=list)
    revision_schedule = Column(JSON, default=dict)
    total_study_hours = Column(Float, nullable=False)
    break_intervals = Column(JSON, default=list)
    notes = Column(Text, nullable=True)


# Database initialization
def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Helper functions for CRUD operations
def get_student_profile(db: Session, student_id: str) -> Optional[StudentProfile]:
    """Get student profile by ID"""
    return db.query(StudentProfile).filter(StudentProfile.student_id == student_id).first()


def create_student_profile(db: Session, profile_data: Dict[str, Any]) -> StudentProfile:
    """Create new student profile"""
    profile = StudentProfile(**profile_data)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def get_learning_style(db: Session, student_id: str) -> Optional[LearningStyle]:
    """Get learning style for student"""
    return db.query(LearningStyle).filter(LearningStyle.student_id == student_id).first()


def get_academic_record(db: Session, student_id: str) -> Optional[AcademicRecord]:
    """Get academic record for student"""
    return db.query(AcademicRecord).filter(AcademicRecord.student_id == student_id).first()


def get_behavioral_record(db: Session, student_id: str) -> Optional[BehavioralRecord]:
    """Get behavioral record for student"""
    return db.query(BehavioralRecord).filter(BehavioralRecord.student_id == student_id).first()


def get_recent_sessions(db: Session, student_id: str, limit: int = 10) -> list:
    """Get recent sessions for student"""
    return db.query(Session).filter(
        Session.student_id == student_id
    ).order_by(Session.timestamp.desc()).limit(limit).all()


def save_assessment(db: Session, assessment_data: Dict[str, Any]) -> Assessment:
    """Save assessment result"""
    assessment = Assessment(**assessment_data)
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment


def save_learning_plan(db: Session, plan_data: Dict[str, Any]) -> LearningPlanRecord:
    """Save learning plan"""
    plan = LearningPlanRecord(**plan_data)
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan
