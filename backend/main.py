import json
from pathlib import Path

import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

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


def load_worker_data():
    return pd.read_csv(WORKER_DATA_PATH)


@app.get("/")
def home():
    return {
        "message": "Kaushal-Konnect backend is running."
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
