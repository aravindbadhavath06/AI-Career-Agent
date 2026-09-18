from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.database.database import Base


class StudentProfile(Base):

    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100))

    email = Column(
        String(150),
        unique=True,
        index=True
    )

    password = Column(String(255))

    education = Column(String(200))
    skills = Column(Text)
    interests = Column(Text)
    career_goal = Column(String(200))
    opportunity_type = Column(String(50))


class CareerAnalysis(Base):

    __tablename__ = "career_analysis"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("student_profiles.id")
    )

    profile_analysis = Column(Text)
    career_match = Column(Text)
    skill_gaps = Column(Text)
    roadmap = Column(Text)

    private_job_matches = Column(Text)
    government_job_matches = Column(Text)
    internship_matches = Column(Text)


class Progress(Base):

    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("student_profiles.id")
    )

    skill = Column(String(200))

    status = Column(
        String(50),
        default="NOT_STARTED"
    )

    progress_percentage = Column(
        Integer,
        default=0
    )


class ResumeAnalysis(Base):

    __tablename__ = "resume_analysis"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("student_profiles.id")
    )

    filename = Column(String(255))

    analysis = Column(Text)