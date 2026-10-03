from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models import User, CustomerLocation, UserRole
from app.schemas.location import LocationCreate, LocationRead
from app.api.deps import get_current_user, check_role

router = APIRouter()

@router.post("/", response_model=LocationRead)
async def create_location(
    location_in: LocationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.customer:
        raise HTTPException(status_code=403, detail="Only customers can manage locations")
    new_loc = CustomerLocation(
        user_id=current_user.id,
        name=location_in.name,
        address=location_in.address,
        latitude=location_in.latitude,
        longitude=location_in.longitude,
    )
    db.add(new_loc)
    db.commit()
    db.refresh(new_loc)
    return new_loc

@router.get("/", response_model=List[LocationRead])
async def list_locations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.customer:
        raise HTTPException(status_code=403, detail="Only customers can view locations")
    locations = db.query(CustomerLocation).filter(CustomerLocation.user_id == current_user.id).all()
    return locations

@router.patch("/{location_id}", response_model=LocationRead)
async def update_location(
    location_id: str,
    location_in: LocationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    loc = db.query(CustomerLocation).filter(CustomerLocation.id == location_id, CustomerLocation.user_id == current_user.id).first()
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")
    loc.name = location_in.name
    loc.address = location_in.address
    loc.latitude = location_in.latitude
    loc.longitude = location_in.longitude
    db.commit()
    db.refresh(loc)
    return loc

@router.delete("/{location_id}")
async def delete_location(
    location_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    loc = db.query(CustomerLocation).filter(CustomerLocation.id == location_id, CustomerLocation.user_id == current_user.id).first()
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")
    db.delete(loc)
    db.commit()
    return {"detail": "Location deleted"}
