from pydantic import BaseModel, EmailStr
from datetime import date


# ================================
# STUDENT SCHEMAS
# ================================

class StudentCreate(BaseModel):
    name: str
    email: EmailStr
    password: str   # 🔥 REQUIRED for auth service
    class_name: str


class StudentRead(BaseModel):
    id: int
    user_id: int
    teacher_id: int
    name: str
    class_name: str

    class Config:
        from_attributes = True


# ================================
# ATTENDANCE SCHEMAS
# ================================

class AttendanceCreate(BaseModel):
    student_id: int
    date: date
    status: str


class AttendanceRead(BaseModel):
    id: int
    student_id: int
    teacher_id: int
    date: date
    status: str

    class Config:
        from_attributes = True