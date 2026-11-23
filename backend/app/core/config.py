"""
Application Configuration Settings for HireShield AI.
Uses Pydantic Settings with Pydantic v2 SettingsConfigDict.
"""
import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "HireShield AI"
    PROJECT_TAGLINE: str = "Verify the opportunity. Understand the risk. Apply with confidence."
    API_V1_PREFIX: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Security & JWT
    SECRET_KEY: str = "hireshield-dev-secret-key-super-secure-change-in-production-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database Settings
    DATABASE_URL: str = "sqlite:///./hireshield.db"
    
    # CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]
    
    # ML Artifacts Directory
    ML_ARTIFACTS_DIR: str = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "..", "ml", "artifacts")
    )
    ACTIVE_MODEL_VERSION: str = "v1.0.0-emscad-nlp"
    
    # Risk Engine Heuristic Weights
    ML_RISK_WEIGHT: float = 0.50
    HEURISTIC_RISK_WEIGHT: float = 0.50

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

settings = Settings()
