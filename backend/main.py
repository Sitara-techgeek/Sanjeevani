from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, hospitals, blood_banks, triage, upload
from routers.location import socket_app

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AYUSETU API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(hospitals.router)
app.include_router(blood_banks.router)
app.include_router(triage.router)
app.include_router(upload.router)

app.mount("/", socket_app)


@app.get("/health")
def health():
    """
    Health check endpoint.
    Returns API status and link to auto-generated docs.
    """
    return {"message": "AYUSETU API v2 running", "docs": "/docs"}