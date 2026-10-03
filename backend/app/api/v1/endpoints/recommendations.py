from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from sqlalchemy.orm import Session
import json
from app.db.session import get_db
from app.services.recommender_service import get_worker_recommendations

router = APIRouter()

@router.get("/")
def recommendations(
    category: str = Query(...),
    zone: str = Query(...),
    budget: float = Query(...),
    top_n: int = Query(10, ge=1, le=20),
    user_lat: Optional[float] = Query(None),
    user_lon: Optional[float] = Query(None),
    radius_km: Optional[float] = Query(None),
    db: Session = Depends(get_db)
):
    
    print("\n🔥🔥🔥 RECOMMENDATIONS ENDPOINT HIT 🔥🔥🔥")
    print("category =", category)
    print("zone =", zone)
    print("budget =", budget)
    print("top_n =", top_n)

    ranked_workers = get_worker_recommendations(
        db=db,
        category=category,
        zone=zone,
        budget=budget,
        top_n=top_n,
        user_lat=user_lat,
        user_lon=user_lon,
        radius_km=radius_km
    )

    if ranked_workers.empty:
        raise HTTPException(
            status_code=404,
            detail="No eligible workers found."
        )

    # The ML model returns a DataFrame, we convert it to a list of dicts for JSON response
    return ranked_workers.to_dict(orient="records")
