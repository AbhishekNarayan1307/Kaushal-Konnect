from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models import Worker, User, UserRole
from app.schemas.worker import WorkerCreate, WorkerRead
from app.api.deps import get_current_user, check_role

router = APIRouter()

@router.post("/", response_model=WorkerRead)
def create_worker(
    worker: WorkerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_worker = Worker(**worker.model_dump())
    db.add(db_worker)
    db.commit()
    db.refresh(db_worker)
    return db_worker

@router.patch("/{worker_id}/verify", response_model=WorkerRead)
def verify_worker(
    worker_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_role([UserRole.admin, UserRole.coop_manager]))
):
    db_worker = db.query(Worker).filter(Worker.id == worker_id).first()
    if not db_worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    db_worker.is_verified = True
    db.commit()
    db.refresh(db_worker)
    return db_worker

@router.get("/", response_model=List[WorkerRead])
def read_workers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Worker).offset(skip).limit(limit).all()

@router.get("/{worker_id}", response_model=WorkerRead)
def read_worker(worker_id: str, db: Session = Depends(get_db)):
    db_worker = db.query(Worker).filter(Worker.id == worker_id).first()
    if not db_worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    return db_worker
