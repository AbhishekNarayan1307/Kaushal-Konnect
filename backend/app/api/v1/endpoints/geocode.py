from fastapi import APIRouter, HTTPException
import requests
from app.core.config import settings

router = APIRouter()

@router.post("/geocode")
def geocode(address: str):
    if not settings.GOOGLE_MAPS_API_KEY:
        raise HTTPException(status_code=500, detail="Google Maps API key not configured")
    response = requests.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        params={"address": address, "key": settings.GOOGLE_MAPS_API_KEY},
    )
    data = response.json()
    if response.status_code != 200 or data.get("status") != "OK":
        raise HTTPException(status_code=400, detail="Geocoding failed")
    loc = data["results"][0]["geometry"]["location"]
    return {"lat": loc["lat"], "lng": loc["lng"]}
