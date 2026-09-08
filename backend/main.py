import json
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import workers, bookings, recommendations, auth

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

# Global Error Handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "message": exc.detail,
            "code": exc.status_code
        },
    )

@app.exception_handler(Exception)
async def universal_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "An unexpected internal server error occurred.",
            "code": 500
        },
    )

# Include Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(workers.router, prefix="/workers", tags=["Workers"])
app.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
app.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])

@app.get("/")
def home():
    return {
        "message": "Kaushal-Konnect backend is running (Production DB mode)."
    }
