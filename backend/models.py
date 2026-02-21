from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime
from enum import Enum


class LearningStyle(str, Enum):
    VISUAL = "visual"
    STORY_BASED = "story_based"
    STEP_BY_STEP = "step_by_step"
    PRACTICE_FIRST = "practice_first"
    CONCEPTUAL = "conceptual"
    HANDS_ON = "hands_on"


class MotivationLevel(str, Enum):
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    VARIABLE = "variable"


class StudentCoreProfile(BaseModel):
    student_id: str
    name: str
    age: int = Field(ge=5, le=18)
    grade: str
    school_board: str  # e.g., "CBSE", "ICSE", "IB", "State Board"
    syllabus: str  # Specific syllabus details
    hobbies: List[str] = []
    interests: List[str] = []
    sports: List[str] = []
    daily_routine: Optional[str] = None
    cultural_context: Optional[str] = None


class LearningStyleProfile(BaseModel):
    student_id: str
    primary_style: LearningStyle
    secondary_styles: List[LearningStyle] = []
    prefers_examples: bool = True
    prefers_visuals: bool = True
    prefers_stories: bool = False
    needs_repetition: bool = False
    learns_by_teaching: bool = False
    attention_span_minutes: int = Field(default=30, ge=10, le=120)


class ConceptStatus(BaseModel):
    concept_name: str
    subject: str
    topic: str
    mastery_level: float = Field(ge=0.0, le=1.0)  # 0.0 = not started, 1.0 = mastered
    last_practiced: Optional[datetime] = None
    attempts: int = 0
    success_rate: float = Field(default=0.0, ge=0.0, le=1.0)


class AcademicHistory(BaseModel):
    student_id: str
    subjects: List[str]
    current_grades: Dict[str, str] = {}  # subject -> grade
    test_scores: List[Dict[str, Any]] = []  # List of test results
    weak_concepts: List[ConceptStatus] = []
    mastered_concepts: List[ConceptStatus] = []
    in_progress_concepts: List[ConceptStatus] = []
    overall_performance: Optional[str] = None


class BehavioralProfile(BaseModel):
    student_id: str
    motivation_level: MotivationLevel
    attention_span: int = Field(default=30, ge=10, le=120)  # minutes
    study_habits: List[str] = []
    procrastination_tendency: Optional[str] = None  # "low", "moderate", "high"
    stress_indicators: List[str] = []
    preferred_study_time: Optional[str] = None  # "morning", "afternoon", "evening", "night"
    energy_levels: Dict[str, str] = {}  # time_of_day -> energy_level
    consistency_score: float = Field(default=0.5, ge=0.0, le=1.0)


class CareerInterestProfile(BaseModel):
    student_id: str
    interests: List[str] = []
    career_goals: List[str] = []
    exploration_areas: List[str] = []
    strengths: List[str] = []
    role_models: List[str] = []


class SessionData(BaseModel):
    session_id: str
    student_id: str
    timestamp: datetime
    agent_type: str  # "teacher", "planner", "assessment", "mentor", "psychology", "secretary"
    interactions: List[Dict[str, Any]] = []
    outcomes: Dict[str, Any] = {}
    duration_minutes: Optional[int] = None
    student_engagement: Optional[str] = None  # "low", "moderate", "high"


class Question(BaseModel):
    question_id: str
    question_text: str
    question_type: str  # "mcq", "short_answer", "long_answer", "true_false"
    subject: str
    topic: str
    difficulty: str  # "easy", "medium", "hard"
    correct_answer: Optional[str] = None
    options: Optional[List[str]] = None  # For MCQs
    marks: int = 1


class StudentAnswer(BaseModel):
    question_id: str
    answer_text: str
    is_correct: Optional[bool] = None
    marks_awarded: Optional[float] = None
    feedback: Optional[str] = None


class AssessmentResult(BaseModel):
    assessment_id: str
    student_id: str
    timestamp: datetime
    assessment_type: str  # "quiz", "test", "mock_exam", "formative"
    subject: str
    topics: List[str]
    questions: List[Question]
    student_answers: List[StudentAnswer]
    total_marks: float
    marks_obtained: float
    percentage: float
    diagnostic_report: Optional[str] = None
    error_patterns: List[str] = []
    concepts_to_review: List[str] = []


class DailyTask(BaseModel):
    task_id: str
    title: str
    description: str
    subject: str
    estimated_duration_minutes: int
    priority: str  # "high", "medium", "low"
    is_completed: bool = False
    completed_at: Optional[datetime] = None


class LearningPlan(BaseModel):
    plan_id: str
    student_id: str
    created_at: datetime
    plan_type: str  # "daily", "weekly"
    start_date: datetime
    end_date: datetime
    daily_tasks: List[DailyTask] = []
    weekly_goals: List[str] = []
    revision_schedule: Dict[str, List[str]] = {}  # date -> concepts to revise
    total_study_hours: float
    break_intervals: List[str] = []
    notes: Optional[str] = None


class TeacherRequest(BaseModel):
    student_id: str
    concept: str
    subject: str
    topic: str
    additional_context: Optional[str] = None


class TeacherResponse(BaseModel):
    explanation: str
    examples: List[str] = []
    formative_questions: List[Question] = []
    visual_aids_suggested: List[str] = []
    next_steps: Optional[str] = None


class PlannerRequest(BaseModel):
    student_id: str
    plan_type: str  # "daily", "weekly"
    available_hours_per_day: float
    specific_goals: Optional[List[str]] = None


class AssessmentRequest(BaseModel):
    student_id: str
    assessment_type: str  # "quiz", "test", "mock_exam"
    subject: str
    topics: List[str]
    difficulty_level: str  # "easy", "medium", "hard", "mixed"
    number_of_questions: int = Field(ge=1, le=50)


class MentorRequest(BaseModel):
    student_id: str
    topic: str  # "study_habits", "goal_setting", "career_exploration", "discipline"
    specific_question: Optional[str] = None


class MentorResponse(BaseModel):
    guidance: str
    action_items: List[str] = []
    resources: List[str] = []
    follow_up_suggestions: Optional[str] = None


class PsychologyRequest(BaseModel):
    student_id: str
    concern_type: str  # "motivation", "stress", "anxiety", "focus", "confidence"
    description: Optional[str] = None


class PsychologyResponse(BaseModel):
    support_message: str
    techniques: List[str] = []
    exercises: List[str] = []
    encouragement: str
    disclaimer: str = "This is educational support only. For medical concerns, please consult a healthcare professional."


class SecretaryRequest(BaseModel):
    student_id: str
    request_type: str  # "summary", "report", "tasks", "reminders"
    time_period: Optional[str] = None  # "today", "this_week", "this_month"


class SecretaryResponse(BaseModel):
    summary: str
    tasks: List[DailyTask] = []
    upcoming_deadlines: List[Dict[str, Any]] = []
    progress_metrics: Dict[str, Any] = {}
    report_data: Optional[Dict[str, Any]] = None
