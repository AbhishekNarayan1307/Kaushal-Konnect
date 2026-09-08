from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models import Booking, BookingStatus, User
from app.schemas.booking import BookingCreate, BookingRead
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=BookingRead)
def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_booking = Booking(**booking.model_dump())
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@router.get("/", response_model=List[BookingRead])
def read_bookings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Booking).offset(skip).limit(limit).all()

@router.get("/{booking_id}", response_model=BookingRead)
def read_booking(booking_id: str, db: Session = Depends(get_db)):
    db_booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return db_booking
