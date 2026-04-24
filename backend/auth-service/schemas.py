from pydantic import BaseModel

class UserRegister(BaseModel):
    email: str
    password: str
    role: str   # "teacher" or "student"

class UserLogin(BaseModel):
    email: str
    password: str

class ChangePassword(BaseModel):
    email: str
    old_password: str
    new_password: str

class ProfileUpdate(BaseModel):
    email: str
    avatar_id: int
    preferred_language: str