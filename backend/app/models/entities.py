"""
SQLAlchemy ORM Entities for HireShield AI.
Includes User, JobAssessment, RiskIndicator, ModelVersion, ModelEvaluationRun, and AuditLog.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Boolean,
    Float,
    Integer,
    DateTime,
    ForeignKey,
    Text,
    Index
)
from sqlalchemy.orm import relationship
from app.models.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="USER")  # "USER" or "ADMIN"
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    assessments = relationship("JobAssessment", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user")


class JobAssessment(Base):
    __tablename__ = "job_assessments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    job_title = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=True)
    company_url = Column(String(500), nullable=True)
    recruiter_email = Column(String(255), nullable=True)
    salary_text = Column(String(255), nullable=True)
    experience_level = Column(String(100), nullable=True)
    description_excerpt = Column(Text, nullable=False)
    risk_score = Column(Float, nullable=False)  # 0.0 to 100.0
    risk_category = Column(String(50), nullable=False)  # "LOW", "MODERATE", "HIGH", "CRITICAL"
    ml_prediction = Column(Integer, nullable=False)  # 0 (Legit) or 1 (Scam)
    ml_probability = Column(Float, nullable=False)  # 0.0 to 1.0
    model_version = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    # Relationships
    user = relationship("User", back_populates="assessments")
    indicators = relationship("RiskIndicator", back_populates="assessment", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_assessment_user_created", "user_id", "created_at"),
    )


class RiskIndicator(Base):
    __tablename__ = "risk_indicators"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    assessment_id = Column(String(36), ForeignKey("job_assessments.id", ondelete="CASCADE"), nullable=False, index=True)
    code = Column(String(100), nullable=False)
    title = Column(String(255), nullable=False)
    severity = Column(String(50), nullable=False)  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    description = Column(Text, nullable=False)
    evidence_snippet = Column(Text, nullable=True)

    # Relationship
    assessment = relationship("JobAssessment", back_populates="indicators")


class ModelVersion(Base):
    __tablename__ = "model_versions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    version_tag = Column(String(100), unique=True, nullable=False, index=True)
    algorithm = Column(String(100), nullable=False)
    dataset_name = Column(String(255), nullable=False)
    dataset_size = Column(Integer, nullable=False)
    scam_class_recall = Column(Float, nullable=False)
    scam_class_precision = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    roc_auc = Column(Float, nullable=False)
    pr_auc = Column(Float, nullable=False)
    artifact_path = Column(String(500), nullable=False)
    is_active = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    evaluations = relationship("ModelEvaluationRun", back_populates="model_version", cascade="all, delete-orphan")


class ModelEvaluationRun(Base):
    __tablename__ = "model_evaluation_runs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    model_version_id = Column(String(36), ForeignKey("model_versions.id", ondelete="CASCADE"), nullable=False, index=True)
    run_timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    metrics_json = Column(Text, nullable=False)
    confusion_matrix_json = Column(Text, nullable=False)
    test_partition_size = Column(Integer, nullable=False)

    model_version = relationship("ModelVersion", back_populates="evaluations")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    action = Column(String(100), nullable=False, index=True)
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(String(100), nullable=True)
    ip_address = Column(String(45), nullable=True)
    details_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    user = relationship("User", back_populates="audit_logs")
