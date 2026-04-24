from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from typing import List, Optional
from database import engine
from models import Exam, Marks
from schemas import ExamCreate, MarksCreate, MarksUpdate
from auth_utils import get_current_user, teacher_required

router = APIRouter()

# =====================================================
# EXAMS
# =====================================================

@router.post("/exams")
def create_exam(data: ExamCreate, user=Depends(teacher_required)):
    with Session(engine) as session:
        # Check duplicate
        existing = session.exec(
            select(Exam)
            .where(Exam.subject == data.subject)
            .where(Exam.class_name == data.class_name)
            .where(Exam.date == data.date)
        ).first()
        
        if existing:
            raise HTTPException(status_code=400, detail="Exam already exists for this subject, class, and date.")
        
        exam = Exam(
            teacher_id=user["user_id"],
            subject=data.subject,
            class_name=data.class_name,
            date=data.date,
            total_marks=data.total_marks
        )
        session.add(exam)
        session.commit()
        session.refresh(exam)
        return exam

@router.get("/exams")
def get_exams(class_name: Optional[str] = Query(None, alias="class"), user=Depends(get_current_user)):
    with Session(engine) as session:
        query = select(Exam)
        if class_name:
            query = query.where(Exam.class_name == class_name)
        return session.exec(query).all()

@router.delete("/exams/{exam_id}")
def delete_exam(exam_id: str, user=Depends(teacher_required)):
    with Session(engine) as session:
        exam = session.get(Exam, exam_id)
        if not exam:
            raise HTTPException(status_code=404, detail="Exam not found")
        if str(exam.teacher_id) != str(user["user_id"]):
            raise HTTPException(status_code=403, detail="You can only delete your own exams")
        
        # Delete associated marks
        marks = session.exec(select(Marks).where(Marks.exam_id == exam_id)).all()
        for mark in marks:
            session.delete(mark)
            
        session.delete(exam)
        session.commit()
        return {"detail": "Exam and associated marks deleted successfully"}



# =====================================================
# MARKS
# =====================================================

@router.post("/marks")
def add_marks(data: MarksCreate, user=Depends(teacher_required)):
    with Session(engine) as session:
        exam = session.get(Exam, data.exam_id)
        if not exam:
            raise HTTPException(status_code=404, detail="Exam not found")
            
        if str(exam.teacher_id) != str(user["user_id"]):
            raise HTTPException(status_code=403, detail="You can only add marks for your own exams.")

        if data.marks_obtained < 0 or data.marks_obtained > exam.total_marks:
            raise HTTPException(status_code=400, detail=f"Marks must be between 0 and {exam.total_marks}.")

        # Check duplicate manually before database hit
        existing = session.exec(
            select(Marks)
            .where(Marks.student_id == data.student_id)
            .where(Marks.exam_id == data.exam_id)
        ).first()
        
        if existing:
            existing.marks_obtained = data.marks_obtained
            session.add(existing)
            session.commit()
            session.refresh(existing)
            return existing

        marks = Marks(
            student_id=data.student_id,
            exam_id=data.exam_id,
            marks_obtained=data.marks_obtained
        )
        session.add(marks)
        session.commit()
        session.refresh(marks)
        return marks

@router.put("/marks/{id}")
def update_marks(id: str, data: MarksUpdate, user=Depends(teacher_required)):
    with Session(engine) as session:
        marks = session.get(Marks, id)
        if not marks:
            raise HTTPException(status_code=404, detail="Marks record not found")
            
        exam = session.get(Exam, marks.exam_id)
        if str(exam.teacher_id) != str(user["user_id"]):
            raise HTTPException(status_code=403, detail="You can only update marks for your own exams.")

        if data.marks_obtained < 0 or data.marks_obtained > exam.total_marks:
            raise HTTPException(status_code=400, detail=f"Marks must be between 0 and {exam.total_marks}.")

        marks.marks_obtained = data.marks_obtained
        session.add(marks)
        session.commit()
        session.refresh(marks)
        return marks

@router.get("/marks/student")
def get_student_marks(user=Depends(get_current_user)):
    if user.get("role") != "student":
        raise HTTPException(status_code=403, detail="Only students can view their marks this way.")
        
    with Session(engine) as session:
        student_id = user["user_id"]
        # Fetch marks and join with exam
        query = select(Marks, Exam).join(Exam, Marks.exam_id == Exam.id).where(Marks.student_id == student_id)
        results = session.exec(query).all()
        
        # Format the response nicely
        output = []
        for mark, exam in results:
            output.append({
                "id": mark.id,
                "exam_id": exam.id,
                "subject": exam.subject,
                "class_name": exam.class_name,
                "date": exam.date,
                "total_marks": exam.total_marks,
                "marks_obtained": mark.marks_obtained,
                "teacher_id": exam.teacher_id
            })
        return output

@router.get("/marks/exam/{exam_id}")
def get_exam_marks(exam_id: str, user=Depends(teacher_required)):
    with Session(engine) as session:
        return session.exec(select(Marks).where(Marks.exam_id == exam_id)).all()

@router.get("/marks/student/{student_id}")
def get_student_marks_by_teacher(student_id: str, user=Depends(teacher_required)):
    with Session(engine) as session:
        # Fetch marks and join with exam
        query = select(Marks, Exam).join(Exam, Marks.exam_id == Exam.id).where(Marks.student_id == student_id)
        results = session.exec(query).all()
        
        output = []
        for mark, exam in results:
            output.append({
                "id": mark.id,
                "exam_id": exam.id,
                "subject": exam.subject,
                "class_name": exam.class_name,
                "date": exam.date,
                "total_marks": exam.total_marks,
                "marks_obtained": mark.marks_obtained,
                "teacher_id": exam.teacher_id
            })
        return output
