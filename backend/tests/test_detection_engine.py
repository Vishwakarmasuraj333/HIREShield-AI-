"""
Automated Pytest Suite for Detection and Risk Assessment Engine.
Tests rule indicators, ML integration, severity calculations, and edge cases.
"""
import pytest
from app.services.detection_engine import RiskAssessmentEngine

@pytest.fixture
def engine():
    return RiskAssessmentEngine()

def test_advance_fee_detection(engine):
    sample = {
        "job_title": "Data Entry Intern",
        "job_description": "We offer immediate hiring. You must submit a refundable $100 registration fee for the training laptop.",
        "company_name": "QuickWorks Inc",
        "recruiter_email": "recruiter@gmail.com"
    }
    res = engine.assess_job(**sample)
    assert res["risk_score"] >= 80.0
    assert res["risk_category"] in ["CRITICAL", "HIGH"]
    codes = [i["code"] for i in res["indicators"]]
    assert "ADVANCE_PAYMENT_DEMAND" in codes
    assert "PUBLIC_EMAIL_DOMAIN" in codes

def test_sensitive_identity_solicitation(engine):
    sample = {
        "job_title": "Administrative Assistant",
        "job_description": "Please submit your bank account number and social security copy for instant background check.",
        "company_name": "Apex Staffing"
    }
    res = engine.assess_job(**sample)
    assert res["risk_score"] >= 70.0
    codes = [i["code"] for i in res["indicators"]]
    assert "SENSITIVE_DATA_SOLICITATION" in codes

def test_legitimate_listing_positive_signals(engine):
    sample = {
        "job_title": "Staff Software Engineer",
        "job_description": "We are seeking a seasoned backend engineer with experience in distributed systems, PostgreSQL, and Kubernetes. Key responsibilities include architecting microservices and leading sprint planning. Excellent health and retirement benefits provided.",
        "company_name": "Datadog Cloud Solutions",
        "company_url": "https://datadoghq.com",
        "recruiter_email": "jobs@datadoghq.com",
        "salary_text": "$160,000 - $190,000",
        "experience_level": "Mid-Senior Level"
    }
    res = engine.assess_job(**sample)
    assert res["risk_score"] <= 35.0
    assert res["risk_category"] in ["LOW", "MODERATE"]
    assert len(res["positive_signals"]) >= 2
    assert any("No requests for registration" in sig for sig in res["positive_signals"])

def test_domain_mismatch_detection(engine):
    sample = {
        "job_title": "Cloud Architect",
        "job_description": "Design and review cloud migration plans.",
        "company_name": "Enterprise Solutions",
        "company_url": "https://enterprisesolutions.com",
        "recruiter_email": "hiring@totallyunrelateddomain.org"
    }
    res = engine.assess_job(**sample)
    codes = [i["code"] for i in res["indicators"]]
    assert "DOMAIN_MISMATCH" in codes
