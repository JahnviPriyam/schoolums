from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from datetime import datetime

from database import engine
from models import User
from schemas import UserRegister, UserLogin
from utils import hash_password, verify_password, create_access_token

router = APIRouter()

@router.post("/register")
def register(data: UserRegister):
    with Session(engine) as session:
        existing_user = session.exec(
            select(User).where(User.email == data.email)
        ).first()

        if existing_user:
            raise HTTPException(status_code=400, detail="Email already exists")

        user = User(
            email=data.email,
            password_hash=hash_password(data.password),
            role=data.role,
            created_at=datetime.utcnow()
        )

        session.add(user)
        session.commit()

        return {"message": "User registered successfully"}


@router.post("/login")
def login(data: UserLogin):
    with Session(engine) as session:
        user = session.exec(
            select(User).where(User.email == data.email)
        ).first()

        if not user:
            raise HTTPException(status_code=400, detail="Invalid credentials")

        if not verify_password(data.password, user.password_hash):
            raise HTTPException(status_code=400, detail="Invalid credentials")

        token = create_access_token({
            "user_id": user.id,
            "role": user.role
        })

        return {
            "access_token": token,
            "token_type": "bearer"
        }