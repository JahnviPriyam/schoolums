from sqlmodel import SQLModel, Field
from typing import Optional

class Student(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int            # ID from auth-service
    teacher_id: int         # teacher who created this student
    name: str
    email: str
    class_name: str