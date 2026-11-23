"""
Pydantic Schemas for Request and Response Models across HireShield AI API.
Strict validation and serialized models compliant with Pydantic v2.
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict

# ----------------- Auth Schemas -----------------

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    full_name: str = Field(..., min_length=2, max_length=100)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None

# ----------------- Assessment Schemas -----------------

class AssessmentCreate(BaseModel):
    job_title: str = Field(..., min_length=2, max_length=200, description="Title of the job/internship")
    company_name: Optional[str] = Field(None, max_length=200, description="Hiring company name")
    company_url: Optional[str] = Field(None, max_length=500, description="Website or application URL")
    recruiter_email: Optional[str] = Field(None, max_length=200, description="Recruiter contact email")
    salary_text: Optional[str] = Field(None, max_length=150, description="Offered stipend/salary")
    experience_level: Optional[str] = Field(None, max_length=100, description="Required experience")
    job_description: str = Field(..., min_length=20, max_length=25000, description="Full job/internship description")

class RiskIndicatorResponse(BaseModel):
    id: Optional[str] = None
    code: str
    title: str
    severity: str  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    description: str
    evidence_snippet: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class AssessmentResponse(BaseModel):
    id: str
    job_title: str
    company_name: Optional[str] = None
    company_url: Optional[str] = None
    recruiter_email: Optional[str] = None
    salary_text: Optional[str] = None
    experience_level: Optional[str] = None
    description_excerpt: str
    risk_score: float
    risk_category: str
    ml_prediction: int
    ml_probability: float
    model_version: str
    created_at: datetime
    indicators: List[RiskIndicatorResponse] = []
    positive_signals: List[str] = []
    recommended_actions: List[str] = []
    disclaimer: str

    model_config = ConfigDict(from_attributes=True)

class AssessmentListItem(BaseModel):
    id: str
    job_title: str
    company_name: Optional[str] = None
    risk_score: float
    risk_category: str
    ml_prediction: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AssessmentListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[AssessmentListItem]

# ----------------- Analytics & Model Schemas -----------------

class RiskCategoryCount(BaseModel):
    category: str
    count: int
    percentage: float

class AnalyticsOverviewResponse(BaseModel):
    total_assessments: int
    high_risk_count: int
    critical_risk_count: int
    low_risk_count: int
    moderate_risk_count: int
    average_risk_score: float
    categories: List[RiskCategoryCount]
    recent_activity: List[Dict[str, Any]]

class ModelVersionResponse(BaseModel):
    id: str
    version_tag: str
    algorithm: str
    dataset_name: str
    dataset_size: int
    scam_class_recall: float
    scam_class_precision: float
    f1_score: float
    roc_auc: float
    pr_auc: float
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ModelEvaluationResponse(BaseModel):
    model_version: str
    algorithm: str
    dataset_name: str
    metrics: Dict[str, float]
    confusion_matrix: Dict[str, int]
    top_scam_indicators: List[Dict[str, Any]]
    top_legitimate_indicators: List[Dict[str, Any]]

# ----------------- Admin Schemas -----------------

class UserStatusUpdate(BaseModel):
    is_active: bool

class AuditLogResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    ip_address: Optional[str] = None
    details_json: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
