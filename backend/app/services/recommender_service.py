
import math
import pandas as pd
from typing import Optional
from sqlalchemy.orm import Session, joinedload
from app.models import Worker
from app.services.recommender import get_recommendations


def get_worker_recommendations(
    db: Session,
    category: str,
    zone: str,
    budget: float,
    top_n: int,
    user_lat: Optional[float] = None,
    user_lon: Optional[float] = None,
    radius_km: Optional[float] = None,
):
    category_mapping = {
        "Home Cleaning": "home-cleaning",
        "Plumbing": "plumbing",
        "Electrical": "electrical",
        "Painting": "painting",
        "Carpentry": "carpentry",
        "Appliance Repair": "appliance-repair",
    }

    service_id = category_mapping.get(category, category)

    workers = (
        db.query(Worker)
        .filter(
            Worker.service_id == service_id,
            Worker.available.is_(True),
        )
        .all()
    )

    if not workers:
        return pd.DataFrame()

    worker_list = []

    for w in workers:
        distance = None

        if (
            user_lat is not None
            and user_lon is not None
            and w.latitude is not None
            and w.longitude is not None
        ):
            lat1 = math.radians(user_lat)
            lon1 = math.radians(user_lon)
            lat2 = math.radians(float(w.latitude))
            lon2 = math.radians(float(w.longitude))

            dlat = lat2 - lat1
            dlon = lon2 - lon1

            a = (
                math.sin(dlat / 2) ** 2
                + math.cos(lat1)
                * math.cos(lat2)
                * math.sin(dlon / 2) ** 2
            )
            a = max(0.0, min(1.0, a))
            distance = 6371.0 * 2 * math.atan2(
                math.sqrt(a), math.sqrt(1 - a)
            )

        worker_list.append({
            "worker_id": str(w.id),
            "category": w.service_id,
            "worker_zone": w.city,
            "available": int(w.available),
            "rating": float(w.rating or 0),
            "weekly_gigs": 0,
            "completed_jobs": w.completed_jobs or 0,
            "price": float(w.hourly_rate or 0),
            "distance_km": distance,
            "acceptance_rate": 0.5,
            "cancellation_rate": 0.0,
            "response_minutes": w.response_minutes,
        })

    worker_df = pd.DataFrame(worker_list)

    # Filter by radius before ranking when coordinates are supplied.
    if radius_km is not None:
        worker_df = worker_df[
            worker_df["distance_km"].notna()
            & (worker_df["distance_km"] <= radius_km)
        ].copy()

    if worker_df.empty:
        return pd.DataFrame()

    ranked_df = get_recommendations(
        category=service_id,
        zone=zone,
        budget=budget,
        worker_data=worker_df,
        top_n=top_n,
    )

    if ranked_df.empty:
        return pd.DataFrame()

    worker_ids = ranked_df["worker_id"].astype(str).tolist()

    final_workers = (
        db.query(Worker)
        .options(joinedload(Worker.user))
        .filter(Worker.id.in_(worker_ids))
        .all()
    )

    worker_map = {str(w.id): w for w in final_workers}
    sorted_workers = [
        worker_map[worker_id]
        for worker_id in worker_ids
        if worker_id in worker_map
    ]

    distance_map = worker_df.set_index("worker_id")[
        "distance_km"
    ].to_dict()

    results = []

    for w in sorted_workers:
        distance = distance_map.get(str(w.id))

        results.append({
            "id": w.id,
            "user_id": w.user_id,
            "coop_id": w.coop_id,
            "service_id": w.service_id,
            "worker_zone": w.city,
            "city": w.city,
            "locality": w.locality,
            "distance_km": (
                float(distance)
                if distance is not None and pd.notna(distance)
                else None
            ),
            "is_verified": w.is_verified,
            "available": w.available,
            "hourly_rate": w.hourly_rate,
            "rating": w.rating,
            "completed_jobs": w.completed_jobs,
            "response_minutes": w.response_minutes,
            "created_at": w.created_at,
            "full_name": w.user.full_name if w.user else "Unknown",
        })

    return pd.DataFrame(results)
