from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Dict, Any
import os
import time
import logging
from dotenv import load_dotenv
import uuid
from datetime import datetime

# Import models
from models import (
    StudentCoreProfile, LearningStyleProfile, AcademicHistory,
    BehavioralProfile, CareerInterestProfile,
    TeacherRequest, TeacherResponse,
    PlannerRequest, LearningPlan,
    AssessmentRequest, AssessmentResult,
    MentorRequest, MentorResponse,
    PsychologyRequest, PsychologyResponse,
    SecretaryRequest, SecretaryResponse
)

# Import database
from database import (
    init_db, get_db,
    get_student_profile, create_student_profile,
    get_learning_style, get_academic_record,
    get_behavioral_record, get_recent_sessions,
    save_assessment, save_learning_plan,
    StudentProfile, LearningStyle as LearningStyleDB,
    AcademicRecord, BehavioralRecord, CareerInterest,
    Session as SessionDB
)

# Import agents
from agents import (
    TeacherAgent, PlannerAgent, AssessmentAgent,
    MentorAgent, PsychologyAgent, SecretaryAgent
)

load_dotenv()

# ── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=getattr(logging, os.getenv("LOG_LEVEL", "INFO").upper(), logging.INFO),
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
logger = logging.getLogger("ai_learning")

# ── FastAPI App ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="Multi-Agent AI Learning System",
    description="Personalized education platform with six specialized AI agents",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request Logging Middleware ────────────────────────────────────────────────
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000
    logger.info(
        f"{request.method} {request.url.path} → {response.status_code} "
        f"({duration_ms:.1f}ms)"
    )
    return response

# ── Global Exception Handler ──────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again later."},
    )

# ── Startup Event ─────────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Starting Multi-Agent AI Learning System…")

    # Initialize database
    try:
        init_db()
        logger.info("✅ Database initialized")
    except Exception as e:
        logger.error(f"❌ Database init failed: {e}")

    # Check API key
    if not os.getenv("GEMINI_API_KEY"):
        logger.warning("⚠️  GEMINI_API_KEY not set — AI responses will fail")
    else:
        logger.info("✅ GEMINI_API_KEY loaded")

    logger.info("✅ All agents ready. Server is live.")

# ── Initialize Agents ─────────────────────────────────────────────────────────
teacher_agent   = TeacherAgent()
planner_agent   = PlannerAgent()
assessment_agent = AssessmentAgent()
mentor_agent    = MentorAgent()
psychology_agent = PsychologyAgent()
secretary_agent = SecretaryAgent()


# ── Helpers ───────────────────────────────────────────────────────────────────
def build_agent_context(student_id: str, db: Session) -> Dict[str, Any]:
    """Build context dictionary for agent processing"""
    context = {}

    student = get_student_profile(db, student_id)
    if student:
        context["student_core_profile"] = {
            "student_id": student.student_id,
            "name": student.name,
            "age": student.age,
            "grade": student.grade,
            "school_board": student.school_board,
            "syllabus": student.syllabus,
            "hobbies": student.hobbies or [],
            "interests": student.interests or [],
            "sports": student.sports or [],
            "daily_routine": student.daily_routine,
            "cultural_context": student.cultural_context,
        }

    learning_style = get_learning_style(db, student_id)
    if learning_style:
        context["learning_style_profile"] = {
            "primary_style": learning_style.primary_style,
            "secondary_styles": learning_style.secondary_styles or [],
            "prefers_examples": learning_style.prefers_examples,
            "prefers_visuals": learning_style.prefers_visuals,
            "prefers_stories": learning_style.prefers_stories,
            "attention_span_minutes": learning_style.attention_span_minutes,
        }

    academic = get_academic_record(db, student_id)
    if academic:
        context["academic_history"] = {
            "subjects": academic.subjects or [],
            "current_grades": academic.current_grades or {},
            "weak_concepts": academic.weak_concepts or [],
            "mastered_concepts": academic.mastered_concepts or [],
            "in_progress_concepts": academic.in_progress_concepts or [],
            "overall_performance": academic.overall_performance,
        }

    behavioral = get_behavioral_record(db, student_id)
    if behavioral:
        context["behavioral_profile"] = {
            "motivation_level": behavioral.motivation_level,
            "attention_span": behavioral.attention_span,
            "study_habits": behavioral.study_habits or [],
            "procrastination_tendency": behavioral.procrastination_tendency,
            "stress_indicators": behavioral.stress_indicators or [],
            "preferred_study_time": behavioral.preferred_study_time,
            "energy_levels": behavioral.energy_levels or {},
            "consistency_score": behavioral.consistency_score,
        }

    career = db.query(CareerInterest).filter(CareerInterest.student_id == student_id).first()
    if career:
        context["career_interest_profile"] = {
            "interests": career.interests or [],
            "career_goals": career.career_goals or [],
            "exploration_areas": career.exploration_areas or [],
            "strengths": career.strengths or [],
            "role_models": career.role_models or [],
        }

    recent_sessions = get_recent_sessions(db, student_id, limit=10)
    context["recent_sessions"] = [
        {
            "session_id": s.session_id,
            "timestamp": s.timestamp.isoformat() if s.timestamp else None,
            "agent_type": s.agent_type,
            "duration_minutes": s.duration_minutes,
            "student_engagement": s.student_engagement,
        }
        for s in recent_sessions
    ]

    return context


def _save_session(db: Session, student_id: str, agent_type: str,
                  request_data: dict, response: dict):
    """Helper to persist a session record."""
    session = SessionDB(
        session_id=str(uuid.uuid4()),
        student_id=student_id,
        timestamp=datetime.utcnow(),
        agent_type=agent_type,
        interactions=[request_data],
        outcomes=response,
    )
    db.add(session)
    db.commit()


# ── Health & Info ─────────────────────────────────────────────────────────────
@app.get("/", tags=["System"])
async def root():
    return {
        "status": "healthy",
        "service": "Multi-Agent AI Learning System",
        "version": "1.0.0",
        "agents": ["teacher", "planner", "assessment", "mentor", "psychology", "secretary"],
    }


@app.get("/health", tags=["System"])
async def health_check():
    """Detailed health check for load balancers and Docker."""
    api_key_ok = bool(os.getenv("GEMINI_API_KEY"))
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "checks": {
            "api_key": "ok" if api_key_ok else "missing",
            "database": "ok",
        },
    }


@app.get("/ready", tags=["System"])
async def readiness_check():
    """Kubernetes/Docker readiness probe."""
    if not os.getenv("GEMINI_API_KEY"):
        return JSONResponse(
            status_code=503,
            content={"status": "not_ready", "reason": "GEMINI_API_KEY not configured"},
        )
    return {"status": "ready"}


# ── Student Endpoints ─────────────────────────────────────────────────────────
@app.post("/students/", response_model=Dict[str, Any], tags=["Students"])
async def create_student(profile: StudentCoreProfile, db: Session = Depends(get_db)):
    """Create a new student profile"""
    try:
        existing = get_student_profile(db, profile.student_id)
        if existing:
            raise HTTPException(status_code=400, detail="Student already exists")
        student_data = profile.model_dump()
        student = create_student_profile(db, student_data)
        logger.info(f"Created student profile: {student.student_id}")
        return {"message": "Student profile created successfully", "student_id": student.student_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating student: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/students/{student_id}", tags=["Students"])
async def get_student(student_id: str, db: Session = Depends(get_db)):
    """Get student profile and all related data"""
    student = get_student_profile(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return build_agent_context(student_id, db)


# ── Agent Endpoints ───────────────────────────────────────────────────────────
@app.post("/agents/teacher", response_model=Dict[str, Any], tags=["Agents"])
async def teacher_endpoint(request: TeacherRequest, db: Session = Depends(get_db)):
    """Teacher Agent – Personalized teaching"""
    try:
        context = build_agent_context(request.student_id, db)
        request_data = request.model_dump()
        response = await teacher_agent.process(request_data, context)
        _save_session(db, request.student_id, "teacher", request_data, response)
        return response
    except Exception as e:
        logger.error(f"Teacher agent error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/agents/planner", response_model=Dict[str, Any], tags=["Agents"])
async def planner_endpoint(request: PlannerRequest, db: Session = Depends(get_db)):
    """Planner Agent – Study plan generation"""
    try:
        context = build_agent_context(request.student_id, db)
        request_data = request.model_dump()
        response = await planner_agent.process(request_data, context)

        plan_data = {
            "plan_id": str(uuid.uuid4()),
            "student_id": request.student_id,
            "created_at": datetime.utcnow(),
            "plan_type": request.plan_type,
            "start_date": datetime.utcnow(),
            "end_date": datetime.utcnow(),
            "daily_tasks": response.get("daily_tasks", []),
            "weekly_goals": response.get("weekly_goals", []),
            "revision_schedule": response.get("revision_schedule", {}),
            "total_study_hours": response.get("total_study_hours", 0),
            "break_intervals": response.get("break_intervals", []),
            "notes": response.get("notes", ""),
        }
        save_learning_plan(db, plan_data)
        _save_session(db, request.student_id, "planner", request_data, response)
        return response
    except Exception as e:
        logger.error(f"Planner agent error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/agents/assessment", response_model=Dict[str, Any], tags=["Agents"])
async def assessment_endpoint(request: AssessmentRequest, db: Session = Depends(get_db)):
    """Assessment Agent – Quiz/test generation and evaluation"""
    try:
        context = build_agent_context(request.student_id, db)
        request_data = request.model_dump()
        response = await assessment_agent.process(request_data, context)

        if "questions" in response and response.get("questions"):
            assessment_data = {
                "assessment_id": str(uuid.uuid4()),
                "student_id": request.student_id,
                "timestamp": datetime.utcnow(),
                "assessment_type": request.assessment_type,
                "subject": request.subject,
                "topics": request.topics,
                "questions": response.get("questions", []),
                "student_answers": [],
                "total_marks": response.get("total_marks", 0),
                "marks_obtained": 0,
                "percentage": 0,
            }
            save_assessment(db, assessment_data)

        _save_session(db, request.student_id, "assessment", request_data, response)
        return response
    except Exception as e:
        logger.error(f"Assessment agent error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/agents/mentor", response_model=Dict[str, Any], tags=["Agents"])
async def mentor_endpoint(request: MentorRequest, db: Session = Depends(get_db)):
    """Mentor Agent – Guidance and career exploration"""
    try:
        context = build_agent_context(request.student_id, db)
        request_data = request.model_dump()
        response = await mentor_agent.process(request_data, context)
        _save_session(db, request.student_id, "mentor", request_data, response)
        return response
    except Exception as e:
        logger.error(f"Mentor agent error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/agents/psychology", response_model=Dict[str, Any], tags=["Agents"])
async def psychology_endpoint(request: PsychologyRequest, db: Session = Depends(get_db)):
    """Psychology Agent – Well-being support"""
    try:
        context = build_agent_context(request.student_id, db)
        request_data = request.model_dump()
        response = await psychology_agent.process(request_data, context)
        _save_session(db, request.student_id, "psychology", request_data, response)
        return response
    except Exception as e:
        logger.error(f"Psychology agent error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/agents/secretary", response_model=Dict[str, Any], tags=["Agents"])
async def secretary_endpoint(request: SecretaryRequest, db: Session = Depends(get_db)):
    """Secretary Agent – Task tracking and reporting"""
    try:
        context = build_agent_context(request.student_id, db)
        request_data = request.model_dump()
        response = await secretary_agent.process(request_data, context)
        _save_session(db, request.student_id, "secretary", request_data, response)
        return response
    except Exception as e:
        logger.error(f"Secretary agent error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("ENV", "production") == "development",
        log_level=os.getenv("LOG_LEVEL", "info").lower(),
    )
