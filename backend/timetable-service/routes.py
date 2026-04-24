from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from typing import List, Optional
from database import engine
from models import Timetable
from schemas import TimetableCreate
from auth_utils import get_current_user, teacher_required

router = APIRouter()

def is_overlap(start1, end1, start2, end2):
    # Standard time overlap check assuming format "HH:MM"
    # A overlaps B if A starts before B ends AND A ends after B starts
    return start1 < end2 and end1 > start2

@router.post("/timetable")
def create_timetable(data: TimetableCreate, user=Depends(teacher_required)):
    if data.start_time >= data.end_time:
        raise HTTPException(status_code=400, detail="Start time must be before end time.")

    with Session(engine) as session:
        # Check for overlaps for same day
        existing_slots = session.exec(
            select(Timetable).where(Timetable.day == data.day)
        ).all()

        teacher_id = user["user_id"]

        for slot in existing_slots:
            if is_overlap(data.start_time, data.end_time, slot.start_time, slot.end_time):
                # Check class overlap
                if slot.class_name == data.class_name:
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Class overlap: {data.class_name} already has a class from {slot.start_time} to {slot.end_time} on {data.day}."
                    )
                # Check teacher overlap
                if str(slot.teacher_id) == str(teacher_id):
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Teacher overlap: You already have a class ({slot.class_name}) from {slot.start_time} to {slot.end_time} on {data.day}."
                    )

        new_slot = Timetable(
            teacher_id=teacher_id,
            class_name=data.class_name,
            day=data.day,
            subject=data.subject,
            start_time=data.start_time,
            end_time=data.end_time
        )
        session.add(new_slot)
        session.commit()
        session.refresh(new_slot)
        return new_slot

@router.get("/timetable")
def get_timetable(class_name: Optional[str] = Query(None, alias="class"), user=Depends(get_current_user)):
    with Session(engine) as session:
        query = select(Timetable)
        if class_name:
            query = query.where(Timetable.class_name == class_name)
        return session.exec(query).all()

@router.delete("/timetable/{slot_id}")
def delete_timetable_slot(slot_id: str, user=Depends(teacher_required)):
    with Session(engine) as session:
        slot = session.get(Timetable, slot_id)
        if not slot:
            raise HTTPException(status_code=404, detail="Slot not found")
        if str(slot.teacher_id) != str(user["user_id"]):
            raise HTTPException(status_code=403, detail="You can only delete your own slots")
            
        session.delete(slot)
        session.commit()
        return {"detail": "Slot deleted successfully"}
