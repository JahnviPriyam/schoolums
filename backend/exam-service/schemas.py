from pydantic import BaseModel
from typing import Optional

class ExamCreate(BaseModel):
    subject: str
    class_name: str
    date: str
    total_marks: int

class MarksCreate(BaseModel):
    student_id: str
    exam_id: str
    marks_obtained: int

class MarksUpdate(BaseModel):
    marks_obtained: int
