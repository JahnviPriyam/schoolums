from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import date
import requests

from database import engine
from models import Student, Attendance
from schemas import (
    StudentCreate,
    StudentRead,
    AttendanceCreate,
    AttendanceRead
)
from auth_utils import get_current_user, teacher_required

router = APIRouter()

AUTH_REGISTER_URL = "http://auth-service:8000/register"
AUTH_GET_USER_URL = "http://auth-service:8000/users/by-email"

# =====================================================
# STUDENT ROUTES
# =====================================================

@router.post("/students", response_model=StudentRead)
def create_student(
    data: StudentCreate,
    user=Depends(teacher_required)
):
    with Session(engine) as session:
        try:
            email = data.email.lower()

            # STEP 1: Try to register user
            auth_response = requests.post(
                AUTH_REGISTER_URL,
                json={
                    "email": email,
                    "password": data.password,
                    "role": "student"
                },
                timeout=5
            )

            # STEP 2: Handle responses
            if auth_response.status_code == 200:
                auth_data = auth_response.json()
                user_id = auth_data.get("user_id") or auth_data.get("id")

            elif auth_response.status_code == 400:
                # Email already exists → fetch user
                user_lookup = requests.get(
                    f"{AUTH_GET_USER_URL}?email={email}",
                    timeout=5
                )

                if user_lookup.status_code != 200:
                    raise HTTPException(
                        status_code=400,
                        detail="User exists but cannot fetch user_id"
                    )

                user_id = user_lookup.json()["id"]

            else:
                raise HTTPException(
                    status_code=auth_response.status_code,
                    detail=auth_response.text
                )

            if not user_id:
                raise HTTPException(
                    status_code=500,
                    detail="user_id missing from auth service"
                )

            # STEP 3: Check if student already exists (avoid duplicates)
            existing_student = session.exec(
                select(Student).where(Student.user_id == user_id)
            ).first()

            if existing_student:
                return existing_student

            # STEP 4: Create student
            student = Student(
                user_id=user_id,
                teacher_id=user["user_id"],
                name=data.name,
                class_name=data.class_name
            )

            session.add(student)
            session.commit()
            session.refresh(student)

            return student

        except requests.exceptions.RequestException:
            session.rollback()
            raise HTTPException(
                status_code=503,
                detail="Auth service unreachable"
            )

        except HTTPException:
            session.rollback()
            raise

        except Exception as e:
            session.rollback()
            raise HTTPException(
                status_code=500,
                detail=str(e)
            )


@router.get("/students", response_model=list[StudentRead])
def get_students(user=Depends(get_current_user)):
    with Session(engine) as session:

        if user["role"] == "teacher":
            return session.exec(
                select(Student)
                .where(Student.teacher_id == user["user_id"])
            ).all()

        if user["role"] == "student":
            return session.exec(
                select(Student)
                .where(Student.user_id == user["user_id"])
            ).all()

        raise HTTPException(status_code=403, detail="Unauthorized")


@router.delete("/students/{student_id}")
def delete_student(student_id: int, user=Depends(teacher_required)):
    with Session(engine) as session:

        student = session.get(Student, student_id)

        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        if student.teacher_id != user["user_id"]:
            raise HTTPException(status_code=403, detail="Not allowed")

        records = session.exec(
            select(Attendance)
            .where(Attendance.student_id == student_id)
        ).all()

        for r in records:
            session.delete(r)

        session.delete(student)
        session.commit()

        return {"message": "Deleted"}


# =====================================================
# ATTENDANCE
# =====================================================

@router.post("/attendance", response_model=AttendanceRead)
def mark_attendance(
    data: AttendanceCreate,
    user=Depends(teacher_required)
):
    with Session(engine) as session:

        student = session.get(Student, data.student_id)

        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        if student.teacher_id != user["user_id"]:
            raise HTTPException(status_code=403, detail="Not allowed")

        existing = session.exec(
            select(Attendance)
            .where(Attendance.student_id == data.student_id)
            .where(Attendance.date == data.date)
        ).first()

        if existing:
            existing.status = data.status
            session.add(existing)
            session.commit()
            session.refresh(existing)
            return existing

        attendance = Attendance(
            student_id=data.student_id,
            teacher_id=user["user_id"],
            date=data.date,
            status=data.status
        )

        session.add(attendance)
        session.commit()
        session.refresh(attendance)

        return attendance


@router.get("/attendance/today/stats")
def get_today_stats(user=Depends(teacher_required)):
    with Session(engine) as session:

        teacher_id = user["user_id"]
        today = date.today()

        students = session.exec(
            select(Student)
            .where(Student.teacher_id == teacher_id)
        ).all()

        total = len(students)

        records = session.exec(
            select(Attendance)
            .where(Attendance.teacher_id == teacher_id)
            .where(Attendance.date == today)
        ).all()

        present = len([r for r in records if r.status == "present"])
        absent = len([r for r in records if r.status == "absent"])

        percentage = (present / total * 100) if total else 0

        return {
            "total_students": total,
            "present_today": present,
            "absent_today": absent,
            "attendance_percentage": round(percentage, 2)
        }

@router.get("/attendance", response_model=list[AttendanceRead])
def get_attendance(user=Depends(get_current_user)):
    with Session(engine) as session:
        if user["role"] == "teacher":
            return session.exec(
                select(Attendance)
                .where(Attendance.teacher_id == user["user_id"])
            ).all()
        elif user["role"] == "student":
            return session.exec(
                select(Attendance)
                .where(Attendance.student_id == user["user_id"])
            ).all()
        raise HTTPException(status_code=403, detail="Unauthorized")