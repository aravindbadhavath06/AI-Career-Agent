from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt

from app.database.database import SessionLocal
from app.database.models import StudentProfile


router = APIRouter()

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

SECRET_KEY = "agent-nexora-secret-key"
ALGORITHM = "HS256"


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register(
    user: RegisterRequest,
    db: Session = Depends(get_db)
):

    existing_user = db.query(StudentProfile).filter(
        StudentProfile.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = pwd_context.hash(user.password)

    student = StudentProfile(
        name=user.name,
        email=user.email,
        password=hashed_password
    )

    db.add(student)
    db.commit()
    db.refresh(student)

    return {
        "message": "Registration successful",
        "student_id": student.id
    }


@router.post("/login")
def login(
    user: LoginRequest,
    db: Session = Depends(get_db)
):

    student = db.query(StudentProfile).filter(
        StudentProfile.email == user.email
    ).first()

    if not student:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not pwd_context.verify(
        user.password,
        student.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = jwt.encode(
        {
            "student_id": student.id,
            "email": student.email
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "message": "Login successful",
        "student_id": student.id,
        "access_token": token
    }