from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from database import engine
from models import Student
from schemas import StudentCreate, StudentRead
from auth_utils import get_current_user, teacher_required

router = APIRouter()


# ==========================
# CREATE STUDENT (Teacher Only)
# ==========================
@router.post("/students", response_model=StudentRead)
def create_student(
    data: StudentCreate,
    user=Depends(teacher_required)
):
    with Session(engine) as session:
        student = Student(
            user_id=data.user_id,
            teacher_id=user["user_id"],
            name=data.name,
            email=data.email,
            class_name=data.class_name
        )

        session.add(student)
        session.commit()
        session.refresh(student)

        return student


# ==========================
# GET STUDENTS
# ==========================
@router.get("/students", response_model=list[StudentRead])
def get_students(user=Depends(get_current_user)):
    with Session(engine) as session:

        # Teacher sees their students
        if user["role"] == "teacher":
            return session.exec(
                select(Student).where(Student.teacher_id == user["user_id"])
            ).all()

        # Student sees only themselves
        if user["role"] == "student":
            return session.exec(
                select(Student).where(Student.user_id == user["user_id"])
            ).all()

        raise HTTPException(status_code=403)

@router.delete("/students/{student_id}")
def delete_student(
    student_id: int,
    user=Depends(teacher_required)
):
    with Session(engine) as session:
        student = session.get(Student, student_id)

        if not student:
            raise HTTPException(status_code=404)

        if student.teacher_id != user["user_id"]:
            raise HTTPException(status_code=403)

        session.delete(student)
        session.commit()

        return {"message": "Student deleted"}

# ==========================
# GET MY PROFILE
# ==========================
@router.get("/students/me", response_model=StudentRead)
def get_my_profile(user=Depends(get_current_user)):
    with Session(engine) as session:
        student = session.exec(
            select(Student).where(Student.user_id == user["user_id"])
        ).first()

        if not student:
            raise HTTPException(status_code=404)

        return student