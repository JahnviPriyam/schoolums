from pydantic import BaseModel
from typing import Optional

class TimetableCreate(BaseModel):
    class_name: str
    day: str
    subject: str
    start_time: str
    end_time: str
