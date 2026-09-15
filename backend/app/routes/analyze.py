from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class StudentProfile(BaseModel):
    education: str
    skills: list[str]
    interests: list[str]
    career_goal: str


@router.post("/analyze")
def analyze(profile: StudentProfile):
    return {
        "message": "Profile received successfully!",
        "profile": profile
    }