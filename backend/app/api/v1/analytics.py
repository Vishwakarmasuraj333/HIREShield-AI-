"""
User Dashboard Analytics API for HireShield AI.
Aggregates metrics and distributions from real database records for the authenticated user.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.entities import User, JobAssessment
from app.schemas.schemas import AnalyticsOverviewResponse, RiskCategoryCount
from app.api.v1.deps import get_db, get_current_user

router = APIRouter()

@router.get("/overview", response_model=AnalyticsOverviewResponse)
def get_user_analytics_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_assessments = db.query(JobAssessment).filter(JobAssessment.user_id == current_user.id)
    total_count = user_assessments.count()

    if total_count == 0:
        return AnalyticsOverviewResponse(
            total_assessments=0,
            high_risk_count=0,
            critical_risk_count=0,
            low_risk_count=0,
            moderate_risk_count=0,
            average_risk_score=0.0,
            categories=[
                RiskCategoryCount(category="LOW", count=0, percentage=0.0),
                RiskCategoryCount(category="MODERATE", count=0, percentage=0.0),
                RiskCategoryCount(category="HIGH", count=0, percentage=0.0),
                RiskCategoryCount(category="CRITICAL", count=0, percentage=0.0),
            ],
            recent_activity=[]
        )

    # Category counts
    cat_counts = (
        db.query(JobAssessment.risk_category, func.count(JobAssessment.id))
        .filter(JobAssessment.user_id == current_user.id)
        .group_by(JobAssessment.risk_category)
        .all()
    )
    counts_map = {cat: count for cat, count in cat_counts}

    low_c = counts_map.get("LOW", 0)
    mod_c = counts_map.get("MODERATE", 0)
    high_c = counts_map.get("HIGH", 0)
    crit_c = counts_map.get("CRITICAL", 0)

    # Average risk score
    avg_score = db.query(func.avg(JobAssessment.risk_score)).filter(JobAssessment.user_id == current_user.id).scalar() or 0.0

    # Recent assessments for activity sparkline
    recent = (
        user_assessments.order_by(JobAssessment.created_at.desc())
        .limit(7)
        .all()
    )
    recent_activity = [
        {
            "id": r.id,
            "job_title": r.job_title,
            "company_name": r.company_name or "Undisclosed",
            "risk_score": r.risk_score,
            "risk_category": r.risk_category,
            "created_at": r.created_at.isoformat()
        }
        for r in recent
    ]

    categories = [
        RiskCategoryCount(category="LOW", count=low_c, percentage=round((low_c / total_count) * 100, 1)),
        RiskCategoryCount(category="MODERATE", count=mod_c, percentage=round((mod_c / total_count) * 100, 1)),
        RiskCategoryCount(category="HIGH", count=high_c, percentage=round((high_c / total_count) * 100, 1)),
        RiskCategoryCount(category="CRITICAL", count=crit_c, percentage=round((crit_c / total_count) * 100, 1)),
    ]

    return AnalyticsOverviewResponse(
        total_assessments=total_count,
        high_risk_count=high_c,
        critical_risk_count=crit_c,
        low_risk_count=low_c,
        moderate_risk_count=mod_c,
        average_risk_score=round(float(avg_score), 1),
        categories=categories,
        recent_activity=recent_activity
    )
