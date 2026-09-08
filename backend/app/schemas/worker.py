from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal

class WorkerBase(BaseModel):
    worker_zone: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_verified: bool = False
    available: bool = True
    hourly_rate: Decimal = Field(gt=0)
    rating: float = Field(default=0.0, ge=0, le=5)
    completed_jobs: int = Field(default=0, ge=0)
    response_minutes: int = Field(default=0, ge=0)

class WorkerCreate(WorkerBase):
    user_id: UUID
    coop_id: UUID
    service_id: str

class WorkerRead(WorkerBase):
    id: UUID
    user_id: UUID
    coop_id: UUID
    service_id: str
    created_at: datetime

    class Config:
        from_attributes = True
