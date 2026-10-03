
from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from app.models import BookingStatus


class BookingBase(BaseModel):
    worker_id: UUID
    service_id: str
    amount: Optional[Decimal] = None
    slot: Optional[str] = None
    booking_date: Optional[datetime] = None


class BookingCreate(BookingBase):
    payment_method: Optional[str] = None
    customer_location_id: Optional[UUID] = None
    service_address: Optional[str] = None
    service_latitude: Optional[Decimal] = None
    service_longitude: Optional[Decimal] = None


class BookingRead(BookingBase):
    id: UUID
    customer_id: UUID
    status: BookingStatus
    created_at: datetime
    customer_location_id: Optional[UUID] = None
    service_address: Optional[str] = None
    service_latitude: Optional[Decimal] = None
    service_longitude: Optional[Decimal] = None

    class Config:
        from_attributes = True
