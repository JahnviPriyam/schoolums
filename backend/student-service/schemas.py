from pydantic import BaseModel


class StudentCreate(BaseModel):
    user_id: int
    name: str
    email: str
    class_name: str


class StudentRead(BaseModel):
    id: int
    user_id: int
    teacher_id: int
    name: str
    email: str
    class_name: str

    class Config:
        from_attributes = True