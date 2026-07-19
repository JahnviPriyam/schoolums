from fastapi import FastAPI
from database import create_db
from routes import router
import models   # IMPORTANT: ensures table registration
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Auth Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
from database import engine
from sqlmodel import Session, select
from models import User
from utils import hash_password
from datetime import datetime

create_db()

@app.on_event("startup")
def seed_demo_users():
    if os.getenv("ENABLE_DEMO_USERS", "false").lower() == "true":
        with Session(engine) as session:
            # Seed Student Demo
            if not session.exec(select(User).where(User.email == "student@demo.com")).first():
                student = User(
                    email="student@demo.com",
                    password_hash=hash_password("student123"),
                    role="student",
                    created_at=datetime.utcnow(),
                    password_updated_at=datetime.utcnow(),
                    requires_password_change=False
                )
                session.add(student)
            
            # Seed Teacher Demo
            if not session.exec(select(User).where(User.email == "teacher@demo.com")).first():
                teacher = User(
                    email="teacher@demo.com",
                    password_hash=hash_password("teacher123"),
                    role="teacher",
                    created_at=datetime.utcnow(),
                    password_updated_at=datetime.utcnow(),
                    requires_password_change=False
                )
                session.add(teacher)
            
            session.commit()

app.include_router(router)