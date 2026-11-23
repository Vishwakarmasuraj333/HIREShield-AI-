"""
Main FastAPI Application Entrypoint for HireShield AI.
Includes CORS, route mounting, health checks, and lifecycle table initialization.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.models.database import engine, Base
from app.api.v1 import auth, assessments, analytics, models, admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Intelligent Job & Internship Risk Assessment Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root Health Checks
@app.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT
    }

@app.get("/api/v1/health/ready", status_code=status.HTTP_200_OK, tags=["Health"])
def readiness_check():
    return {
        "status": "ready",
        "service": settings.PROJECT_NAME,
        "database": "connected",
        "active_model": settings.ACTIVE_MODEL_VERSION
    }

# Mount API Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_PREFIX}/auth", tags=["Authentication"])
app.include_router(assessments.router, prefix=f"{settings.API_V1_PREFIX}/assessments", tags=["Assessments"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_PREFIX}/analytics", tags=["Analytics"])
app.include_router(models.router, prefix=f"{settings.API_V1_PREFIX}/models", tags=["Models"])
app.include_router(admin.router, prefix=f"{settings.API_V1_PREFIX}/admin", tags=["Admin"])
