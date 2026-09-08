from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from app.models import BookingStatus

class BookingBase(BaseModel):
    customer_id: UUID
    worker_id: UUID
    service_id: str
    amount: Optional[Decimal] = None
    slot: Optional[str] = None
    booking_date: Optional[datetime] = None

class BookingCreate(BookingBase):
    pass

class BookingRead(BookingBase):
    id: UUID
    status: BookingStatus
    created_at: datetime

    class Config:
        from_attributes = True
