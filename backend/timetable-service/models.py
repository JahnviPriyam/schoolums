from sqlmodel import SQLModel, Field, UniqueConstraint
import uuid

class TimetableBase(SQLModel):
    teacher_id: str
    class_name: str
    day: str
    subject: str
    start_time: str
    end_time: str

class Timetable(TimetableBase, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
