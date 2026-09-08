from sqlalchemy.orm import Session
import pandas as pd
from app.models import Worker
from recommender import get_recommendations

def get_worker_recommendations(db: Session, category: str, zone: str, budget: float, top_n: int):
    # Fetch relevant workers from DB to create a DataFrame for the ML model
    workers = db.query(Worker).all()

    if not workers:
        return pd.DataFrame()

    # Convert SQLAlchemy models to a DataFrame that the recommender expects
    worker_list = []
    for w in workers:
        worker_list.append({
            "worker_id": str(w.id),
            "category": w.service_id, # Mapping service_id to category for the model
            "worker_zone": w.worker_zone,
            "rating": float(w.rating),
            "weekly_gigs": 0, # This would need a real query to bookings
            "completed_jobs": w.completed_jobs,
            "price": float(w.hourly_rate),
            "distance_km": 0.0, # This would need a geo-calculation
            "acceptance_rate": 0.5,
            "cancellation_rate": 0.0,
            "response_minutes": w.response_minutes,
        })

    worker_df = pd.DataFrame(worker_list)

    return get_recommendations(
        category=category,
        zone=zone,
        budget=budget,
        worker_data=worker_df,
        top_n=top_n
    )
