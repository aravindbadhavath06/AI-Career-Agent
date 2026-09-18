from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.agent.graph import graph
from app.database.database import SessionLocal
from app.database.models import (
    StudentProfile,
    CareerAnalysis,
    Progress
)
from app.routes.dependencies import get_current_student


router = APIRouter()


# ==============================
# Student Profile Request
# ==============================

class StudentProfileRequest(BaseModel):
    education: str
    skills: list[str]
    interests: list[str]
    career_goal: str
    opportunity_type: str


# ==============================
# Progress Request
# ==============================

class ProgressRequest(BaseModel):
    skill: str
    status: str = "NOT_STARTED"
    progress_percentage: int = 0


# ==============================
# Database Session
# ==============================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ==============================
# Analyze Student
# ==============================

@router.post("/analyze")
def analyze(
    profile: StudentProfileRequest,
    db: Session = Depends(get_db),
    current_student: StudentProfile = Depends(get_current_student)
):

    # Update logged-in student's profile
    current_student.education = profile.education
    current_student.skills = ", ".join(profile.skills)
    current_student.interests = ", ".join(profile.interests)
    current_student.career_goal = profile.career_goal
    current_student.opportunity_type = profile.opportunity_type

    db.commit()
    db.refresh(current_student)

    # Run LangGraph
    result = graph.invoke({
        "education": profile.education,
        "skills": profile.skills,
        "interests": profile.interests,
        "career_goal": profile.career_goal,
        "opportunity_type": profile.opportunity_type
    })

    # Save AI analysis
    analysis = CareerAnalysis(
        student_id=current_student.id,
        profile_analysis=result["profile_analysis"],
        career_match=result["career_match"],
        skill_gaps=result["skill_gaps"],
        roadmap=result["roadmap"],
        private_job_matches=result.get(
            "private_job_matches", ""
        ),
        government_job_matches=result.get(
            "government_job_matches", ""
        ),
        internship_matches=result.get(
            "internship_matches", ""
        )
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return {
        "student_id": current_student.id,
        "analysis_id": analysis.id,
        "profile_analysis": result["profile_analysis"],
        "career_match": result["career_match"],
        "private_job_matches": result.get(
            "private_job_matches", ""
        ),
        "government_job_matches": result.get(
            "government_job_matches", ""
        ),
        "internship_matches": result.get(
            "internship_matches", ""
        ),
        "skill_gaps": result["skill_gaps"],
        "roadmap": result["roadmap"]
    }


# ==============================
# Get Student Profile
# ==============================

@router.get("/profile/{student_id}")
def get_profile(
    student_id: int,
    db: Session = Depends(get_db),
    current_student: StudentProfile = Depends(get_current_student)
):

    # Prevent accessing another student's profile
    if student_id != current_student.id:
        raise HTTPException(
            status_code=403,
            detail="You can only access your own profile"
        )

    analysis = db.query(CareerAnalysis).filter(
        CareerAnalysis.student_id == student_id
    ).order_by(
        CareerAnalysis.id.desc()
    ).first()

    return {
        "student": {
            "id": current_student.id,
            "name": current_student.name,
            "email": current_student.email,
            "education": current_student.education,
            "skills": current_student.skills,
            "interests": current_student.interests,
            "career_goal": current_student.career_goal,
            "opportunity_type": current_student.opportunity_type
        },
        "analysis": {
            "id": analysis.id,
            "profile_analysis": analysis.profile_analysis,
            "career_match": analysis.career_match,
            "skill_gaps": analysis.skill_gaps,
            "roadmap": analysis.roadmap,
            "private_job_matches": analysis.private_job_matches,
            "government_job_matches": analysis.government_job_matches,
            "internship_matches": analysis.internship_matches
        } if analysis else None
    }


# ==============================
# Add Progress
# ==============================

@router.post("/progress")
def add_progress(
    progress: ProgressRequest,
    db: Session = Depends(get_db),
    current_student: StudentProfile = Depends(get_current_student)
):

    new_progress = Progress(
        student_id=current_student.id,
        skill=progress.skill,
        status=progress.status,
        progress_percentage=progress.progress_percentage
    )

    db.add(new_progress)
    db.commit()
    db.refresh(new_progress)

    return {
        "message": "Progress saved successfully",
        "progress_id": new_progress.id,
        "student_id": current_student.id
    }


# ==============================
# Get Progress
# ==============================

@router.get("/progress/{student_id}")
def get_progress(
    student_id: int,
    db: Session = Depends(get_db),
    current_student: StudentProfile = Depends(get_current_student)
):

    # Prevent accessing another student's progress
    if student_id != current_student.id:
        raise HTTPException(
            status_code=403,
            detail="You can only access your own progress"
        )

    progress = db.query(Progress).filter(
        Progress.student_id == current_student.id
    ).all()

    return [
        {
            "id": item.id,
            "skill": item.skill,
            "status": item.status,
            "progress_percentage": item.progress_percentage
        }
        for item in progress
    ]