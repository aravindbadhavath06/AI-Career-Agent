from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.analyze import router as analyze_router
from app.routes.auth import router as auth_router
from app.routes.resume import router as resume_router

from app.database.database import Base, engine
from app.database import models


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI()


# ==============================
# CORS
# ==============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================
# Analyze API
# ==============================

app.include_router(
    analyze_router,
    prefix="/api"
)


# ==============================
# Authentication API
# ==============================

app.include_router(
    auth_router,
    prefix="/api/auth"
)


# ==============================
# Resume API
# ==============================

app.include_router(
    resume_router,
    prefix="/api/resume"
)


# ==============================
# Root
# ==============================

@app.get("/")
def root():
    return {
        "message": "AI Career Agent Backend is running!"
    }