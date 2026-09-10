from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
from app.db.session import get_db
from app.models import Booking, BookingStatus, User, Payment
from app.schemas.booking import BookingCreate, BookingRead
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=BookingRead)
def create_booking(
    booking_in: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # 1. Create the Booking record first
        booking_data = booking_in.model_dump()
        payment_method = booking_data.pop("payment_method", "card")

        db_booking = Booking(
            **booking_data,
            customer_id=current_user.id,
            status=BookingStatus.ACCEPTED
        )
        db.add(db_booking)
        db.flush() # Flush to get the booking id without committing

        # 2. Create the Payment record
        payment = Payment(
            booking_id=db_booking.id,
            amount=booking_in.amount or 0,
            payment_method=booking_in.payment_method or "card",
            status="SUCCESS"
        )
        db.add(payment)

        db.commit()
        db.refresh(db_booking)
        return db_booking
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Booking failed: {str(e)}"
        )

@router.get("/", response_model=List[BookingRead])
def read_bookings(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return (
        db.query(Booking)
        .filter(Booking.customer_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )

@router.get("/{booking_id}", response_model=BookingRead)
def read_booking(booking_id: str, db: Session = Depends(get_db)):
    db_booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return db_booking
