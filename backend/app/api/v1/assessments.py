"""
Assessment API Endpoints for HireShield AI.
Create, list, retrieve, delete assessments, and download PDF dossiers.
Ensures strict tenant / user isolation: users can only view or delete their own assessments.
"""
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Response, Request
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.entities import User, JobAssessment, RiskIndicator, AuditLog
from app.schemas.schemas import (
    AssessmentCreate,
    AssessmentResponse,
    AssessmentListResponse,
    AssessmentListItem,
    RiskIndicatorResponse
)
from app.api.v1.deps import get_db, get_current_user
from app.services.detection_engine import risk_engine
from app.services.pdf_report import generate_assessment_pdf

router = APIRouter()

@router.post("", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
def create_assessment(
    assessment_in: AssessmentCreate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Execute Hybrid Risk Assessment
    assessment_result = risk_engine.assess_job(
        job_title=assessment_in.job_title,
        job_description=assessment_in.job_description,
        company_name=assessment_in.company_name,
        company_url=assessment_in.company_url,
        recruiter_email=assessment_in.recruiter_email,
        salary_text=assessment_in.salary_text,
        experience_level=assessment_in.experience_level
    )

    # Privacy-conscious storage: store excerpt up to 1000 chars
    excerpt = assessment_in.job_description[:1000] + ("..." if len(assessment_in.job_description) > 1000 else "")

    new_assessment = JobAssessment(
        user_id=current_user.id,
        job_title=assessment_in.job_title.strip(),
        company_name=assessment_in.company_name.strip() if assessment_in.company_name else None,
        company_url=assessment_in.company_url.strip() if assessment_in.company_url else None,
        recruiter_email=assessment_in.recruiter_email.strip() if assessment_in.recruiter_email else None,
        salary_text=assessment_in.salary_text.strip() if assessment_in.salary_text else None,
        experience_level=assessment_in.experience_level.strip() if assessment_in.experience_level else None,
        description_excerpt=excerpt,
        risk_score=assessment_result["risk_score"],
        risk_category=assessment_result["risk_category"],
        ml_prediction=assessment_result["ml_prediction"],
        ml_probability=assessment_result["ml_probability"],
        model_version=assessment_result["ml_model_version"]
    )
    db.add(new_assessment)
    db.commit()
    db.refresh(new_assessment)

    # Persist Risk Indicators
    indicators_out = []
    for ind in assessment_result["indicators"]:
        ri = RiskIndicator(
            assessment_id=new_assessment.id,
            code=ind["code"],
            title=ind["title"],
            severity=ind["severity"],
            description=ind["description"],
            evidence_snippet=ind.get("evidence_snippet")
        )
        db.add(ri)
        db.commit()
        db.refresh(ri)
        indicators_out.append(RiskIndicatorResponse.model_validate(ri))

    # Audit log
    audit = AuditLog(
        user_id=current_user.id,
        action="ASSESSMENT_CREATED",
        resource_type="JOB_ASSESSMENT",
        resource_id=new_assessment.id,
        ip_address=request.client.host if request.client else None,
        details_json=f'{{"risk_score": {new_assessment.risk_score}, "category": "{new_assessment.risk_category}"}}'
    )
    db.add(audit)
    db.commit()

    return AssessmentResponse(
        id=new_assessment.id,
        job_title=new_assessment.job_title,
        company_name=new_assessment.company_name,
        company_url=new_assessment.company_url,
        recruiter_email=new_assessment.recruiter_email,
        salary_text=new_assessment.salary_text,
        experience_level=new_assessment.experience_level,
        description_excerpt=new_assessment.description_excerpt,
        risk_score=new_assessment.risk_score,
        risk_category=new_assessment.risk_category,
        ml_prediction=new_assessment.ml_prediction,
        ml_probability=new_assessment.ml_probability,
        model_version=new_assessment.model_version,
        created_at=new_assessment.created_at,
        indicators=indicators_out,
        positive_signals=assessment_result["positive_signals"],
        recommended_actions=assessment_result["recommended_actions"],
        disclaimer=assessment_result["disclaimer"]
    )

@router.get("", response_model=AssessmentListResponse)
def list_assessments(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(JobAssessment).filter(JobAssessment.user_id == current_user.id)

    if category:
        query = query.filter(JobAssessment.risk_category == category.upper())
    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            (JobAssessment.job_title.ilike(search_fmt)) |
            (JobAssessment.company_name.ilike(search_fmt))
        )

    total = query.count()
    items = (
        query.order_by(desc(JobAssessment.created_at))
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return AssessmentListResponse(
        total=total,
        page=page,
        page_size=page_size,
        items=[AssessmentListItem.model_validate(it) for it in items]
    )

@router.get("/{assessment_id}", response_model=AssessmentResponse)
def get_assessment_details(
    assessment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assessment = db.query(JobAssessment).filter(
        JobAssessment.id == assessment_id,
        JobAssessment.user_id == current_user.id
    ).first()

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment record not found or access denied."
        )

    # Re-evaluate dynamic advisory fields
    re_eval = risk_engine.assess_job(
        job_title=assessment.job_title,
        job_description=assessment.description_excerpt,
        company_name=assessment.company_name,
        company_url=assessment.company_url,
        recruiter_email=assessment.recruiter_email
    )

    indicators_out = [
        RiskIndicatorResponse.model_validate(ind) for ind in assessment.indicators
    ]

    return AssessmentResponse(
        id=assessment.id,
        job_title=assessment.job_title,
        company_name=assessment.company_name,
        company_url=assessment.company_url,
        recruiter_email=assessment.recruiter_email,
        salary_text=assessment.salary_text,
        experience_level=assessment.experience_level,
        description_excerpt=assessment.description_excerpt,
        risk_score=assessment.risk_score,
        risk_category=assessment.risk_category,
        ml_prediction=assessment.ml_prediction,
        ml_probability=assessment.ml_probability,
        model_version=assessment.model_version,
        created_at=assessment.created_at,
        indicators=indicators_out,
        positive_signals=re_eval["positive_signals"],
        recommended_actions=re_eval["recommended_actions"],
        disclaimer=re_eval["disclaimer"]
    )

@router.delete("/{assessment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_assessment(
    assessment_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assessment = db.query(JobAssessment).filter(
        JobAssessment.id == assessment_id,
        JobAssessment.user_id == current_user.id
    ).first()

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment record not found or access denied."
        )

    db.delete(assessment)
    db.commit()

    # Audit log
    audit = AuditLog(
        user_id=current_user.id,
        action="ASSESSMENT_DELETED",
        resource_type="JOB_ASSESSMENT",
        resource_id=assessment_id,
        ip_address=request.client.host if request.client else None
    )
    db.add(audit)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/{assessment_id}/report")
def download_assessment_report(
    assessment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assessment = db.query(JobAssessment).filter(
        JobAssessment.id == assessment_id,
        JobAssessment.user_id == current_user.id
    ).first()

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment record not found or access denied."
        )

    re_eval = risk_engine.assess_job(
        job_title=assessment.job_title,
        job_description=assessment.description_excerpt,
        company_name=assessment.company_name,
        company_url=assessment.company_url,
        recruiter_email=assessment.recruiter_email
    )

    pdf_payload = {
        "id": assessment.id,
        "job_title": assessment.job_title,
        "company_name": assessment.company_name,
        "recruiter_email": assessment.recruiter_email,
        "created_at": assessment.created_at,
        "risk_score": assessment.risk_score,
        "risk_category": assessment.risk_category,
        "ml_probability": assessment.ml_probability,
        "model_version": assessment.model_version,
        "indicators": [
            {
                "code": ind.code,
                "title": ind.title,
                "severity": ind.severity,
                "description": ind.description,
                "evidence_snippet": ind.evidence_snippet
            }
            for ind in assessment.indicators
        ],
        "positive_signals": re_eval["positive_signals"],
        "recommended_actions": re_eval["recommended_actions"],
        "disclaimer": re_eval["disclaimer"]
    }

    pdf_bytes = generate_assessment_pdf(pdf_payload)
    filename = f"HireShield-Report-{assessment_id[:8]}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
