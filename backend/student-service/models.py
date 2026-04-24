from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date

class Student(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int
    teacher_id: int
    name: str
    class_name: str

class Attendance(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_id: int
    teacher_id: int
    date: date
    status: str  # "Present" or "Absent"