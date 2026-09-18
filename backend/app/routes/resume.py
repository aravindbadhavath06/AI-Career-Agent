from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends
)

from pypdf import PdfReader
from io import BytesIO
from sqlalchemy.orm import Session

from app.gemini import ask_gemini
from app.database.database import SessionLocal
from app.database.models import (
    StudentProfile,
    ResumeAnalysis
)
from app.routes.dependencies import get_current_student


router = APIRouter()


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
# Analyze Resume
# ==============================

@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_student: StudentProfile = Depends(
        get_current_student
    )
):

    # Check PDF
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported"
        )

    # Read file
    content = await file.read()

    try:
        reader = PdfReader(BytesIO(content))

        text = ""

        for page in reader.pages:
            text += page.extract_text() or ""

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Could not read PDF"
        )

    # Check extracted text
    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="No readable text found in resume"
        )

    # Gemini prompt
    prompt = f"""
Analyze this student's resume.

Student:
{current_student.name}

Resume:
{text}

Provide:

1. Detected skills
2. Education
3. Experience
4. Strengths
5. Missing skills
6. Suitable career roles
7. Short improvement suggestions

Keep the response practical and concise.
"""

    # AI analysis
    analysis = ask_gemini(prompt)

    # Save analysis
    resume_analysis = ResumeAnalysis(
        student_id=current_student.id,
        filename=file.filename,
        analysis=analysis
    )

    db.add(resume_analysis)
    db.commit()
    db.refresh(resume_analysis)

    return {
        "student_id": current_student.id,
        "resume_id": resume_analysis.id,
        "filename": file.filename,
        "resume_analysis": analysis
    }


# ==============================
# Resume History
# ==============================

@router.get("/history")
def get_resume_history(
    db: Session = Depends(get_db),
    current_student: StudentProfile = Depends(
        get_current_student
    )
):

    resumes = db.query(ResumeAnalysis).filter(
        ResumeAnalysis.student_id == current_student.id
    ).order_by(
        ResumeAnalysis.id.desc()
    ).all()

    return [
        {
            "resume_id": resume.id,
            "filename": resume.filename,
            "analysis": resume.analysis
        }
        for resume in resumes
    ]