from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.upload import router as upload_router
from app.api.analysis import router as analysis_router
from app.api.investors import router as investor_router
from app.api.reports import router as reports_router
from app.api.full_analysis import router as full_analysis_router

from app.core.database import engine, Base
import app.models  # Registers the models

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="VentureLens AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(upload_router)
# app.include_router(analysis_router)
# app.include_router(investor_router)
app.include_router(reports_router)
app.include_router(full_analysis_router)

@app.get("/")
def root():
    return {
        "message": "VentureLens API Running"
    }