import json
from pathlib import Path

import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from recommender import get_recommendations


app = FastAPI(
    title="Kaushal-Konnect API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

WORKER_DATA_PATH = (
    Path(__file__).resolve().parent
    / "data"
    / "worker_data.csv"
)


class WorkerRegistration(BaseModel):
    category: str = Field(min_length=2)
    worker_zone: str = Field(min_length=2)
    available: int = Field(default=1, ge=0, le=1)
    price: float = Field(gt=0)
    response_minutes: int = Field(default=60, ge=1)
    distance_km: float = Field(default=5.0, ge=0)


def load_worker_data():
    return pd.read_csv(WORKER_DATA_PATH)


def save_worker_data(worker_data):
    worker_data.to_csv(WORKER_DATA_PATH, index=False)


@app.get("/")
def home():
    return {
        "message": "Kaushal-Konnect backend is running."
    }


@app.post("/workers")
def register_worker(worker: WorkerRegistration):
    worker_data = load_worker_data()

    worker_ids = pd.to_numeric(
        worker_data["worker_id"],
        errors="coerce"
    )

    new_worker_id = int(worker_ids.max()) + 1

    new_worker = {
        "worker_id": new_worker_id,
        "category": worker.category,
        "user_zone": worker.worker_zone,
        "worker_zone": worker.worker_zone,
        "available": worker.available,
        "weekly_gigs": 0,
        "rating": 3.0,
        "completed_jobs": 0,
        "acceptance_rate": 0.50,
        "cancellation_rate": 0.00,
        "response_minutes": worker.response_minutes,
        "price": worker.price,
        "budget": 0,
        "distance_km": worker.distance_km,
        "successful_booking": 0
    }

    updated_worker_data = pd.concat(
        [worker_data, pd.DataFrame([new_worker])],
        ignore_index=True
    )

    save_worker_data(updated_worker_data)

    return {
        "message": "Worker registered successfully.",
        "worker": new_worker
    }


@app.get("/recommendations")
def recommendations(
    category: str = Query(...),
    zone: str = Query(...),
    budget: float = Query(...),
    top_n: int = Query(10, ge=1, le=20)
):
    worker_data = load_worker_data()

    ranked_workers = get_recommendations(
        category=category,
        zone=zone,
        budget=budget,
        worker_data=worker_data,
        top_n=top_n
    )

    if ranked_workers.empty:
        raise HTTPException(
            status_code=404,
            detail="No eligible workers found."
        )

    result_columns = [
        "rank",
        "worker_id",
        "category",
        "worker_zone",
        "rating",
        "weekly_gigs",
        "completed_jobs",
        "price",
        "distance_km",
        "booking_success_probability",
        "workload_balance_score",
        "recommendation_score"
    ]

    response_data = ranked_workers[
        result_columns
    ].to_json(orient="records")

    return json.loads(response_data)
