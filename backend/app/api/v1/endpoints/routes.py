from fastapi import APIRouter, HTTPException
import requests
from app.core.config import settings

router = APIRouter()

@router.get("/eta")
async def travel_eta(
    worker_lat: float,
    worker_lng: float,
    customer_lat: float,
    customer_lng: float,
):
    """
    Return:
      {
        "distance_km": 12.3,
        "time_min": 15
      }
    """
    if not settings.GOOGLE_MAPS_API_KEY:
        raise HTTPException(status_code=500, detail="Google Maps API key not configured")

    url = "https://maps.googleapis.com/maps/api/directions/json"
    params = {
        "origin": f"{worker_lat},{worker_lng}",
        "destination": f"{customer_lat},{customer_lng}",
        "key": settings.GOOGLE_MAPS_API_KEY,
        "mode": "driving",
    }

    resp = requests.get(url, params=params)
    data = resp.json()

    if resp.status_code != 200 or data.get("status") not in ("OK", "ZERO_RESULTS"):
        raise HTTPException(status_code=400, detail="Routing failed")

    if data.get("status") == "ZERO_RESULTS":
        return {"distance_km": None, "time_min": None}

    leg = data["routes"][0]["legs"][0]
    distance_m = leg["distance"]["value"]
    duration_s = leg["duration"]["value"]
    return {
        "distance_km": distance_m / 1000.0,
        "time_min": duration_s // 60,
    }
