from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from datetime import datetime

from database import engine
from models import User
from schemas import UserRegister, UserLogin, ChangePassword, ProfileUpdate
from utils import hash_password, verify_password, create_access_token

router = APIRouter()

# =====================================================
# REGISTER
# =====================================================

@router.post("/register")
def register(data: UserRegister):
    with Session(engine) as session:

        existing_user = session.exec(
            select(User).where(User.email == data.email)
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

        user = User(
            email=data.email,
            password_hash=hash_password(data.password),
            role=data.role,
            created_at=datetime.utcnow(),
            password_updated_at=datetime.utcnow(),
            requires_password_change=(data.role == "student")
        )

        session.add(user)
        session.commit()
        session.refresh(user)

        # 🔥 IMPORTANT: return user_id
        return {
            "id": user.id,
            "email": user.email,
            "role": user.role
        }


# =====================================================
# LOGIN
# =====================================================

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

        # Check password age (30 days)
        if user.password_updated_at and (datetime.utcnow() - user.password_updated_at).days >= 30:
            user.requires_password_change = True
            session.add(user)
            session.commit()
            session.refresh(user)

        token = create_access_token({
            "user_id": user.id,
            "role": user.role,
            "email": user.email
        })

        return {
            "access_token": token,
            "token_type": "bearer",
            "requires_change": user.requires_password_change,
            "avatar_id": user.avatar_id,
            "preferred_language": user.preferred_language
        }


# =====================================================
# 🔥 NEW: GET USER BY EMAIL (VERY IMPORTANT)
# =====================================================

@router.get("/users/by-email")
def get_user_by_email(email: str):
    with Session(engine) as session:

        user = session.exec(
            select(User).where(User.email == email)
        ).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "avatar_id": user.avatar_id,
            "preferred_language": user.preferred_language
        }

@router.post("/change-password")
def change_password(data: ChangePassword):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == data.email)).first()
        if not user:
            raise HTTPException(status_code=400, detail="User not found")
            
        if not verify_password(data.old_password, user.password_hash):
            raise HTTPException(status_code=400, detail="Incorrect old password")
            
        user.password_hash = hash_password(data.new_password)
        user.password_updated_at = datetime.utcnow()
        user.requires_password_change = False
        
        session.add(user)
        session.commit()
        
        return {"message": "Password updated successfully"}

@router.put("/users/profile")
def update_profile(data: ProfileUpdate):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == data.email)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        user.avatar_id = data.avatar_id
        user.preferred_language = data.preferred_language
        
        session.add(user)
        session.commit()
        session.refresh(user)
        
        return {
            "message": "Profile updated successfully",
            "avatar_id": user.avatar_id,
            "preferred_language": user.preferred_language
        }