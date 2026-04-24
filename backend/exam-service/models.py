from sqlmodel import SQLModel, Field, UniqueConstraint
import uuid
import uuid as uuid_pkg
from typing import Optional

class ExamBase(SQLModel):
    subject: str
    class_name: str
    date: str
    total_marks: int
    teacher_id: str

class Exam(ExamBase, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)

class MarksBase(SQLModel):
    student_id: str
    exam_id: str
    marks_obtained: int

class Marks(MarksBase, table=True):
    __table_args__ = (UniqueConstraint("student_id", "exam_id", name="unique_student_exam_marks"),)
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
