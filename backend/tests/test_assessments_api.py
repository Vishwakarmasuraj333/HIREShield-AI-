"""
Automated Pytest Suite for Assessments API & Access Control.
Verifies tenant isolation, PDF report export, pagination, and deletion.
"""
import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def create_authenticated_user(email_prefix: str):
    email = f"{email_prefix}_{uuid.uuid4().hex[:6]}@example.com"
    pwd = "TestPassword123!"
    reg = client.post("/api/v1/auth/register", json={
        "email": email,
        "password": pwd,
        "full_name": f"User {email_prefix}"
    })
    token = reg.json()["access_token"]
    return {"token": token, "email": email, "headers": {"Authorization": f"Bearer {token}"}}

def test_assessment_lifecycle_and_user_isolation():
    user_a = create_authenticated_user("alice")
    user_b = create_authenticated_user("bob")

    # 1. User A creates an assessment
    payload = {
        "job_title": "React Frontend Intern",
        "company_name": "WebCraft Studio",
        "company_url": "https://webcraft.dev",
        "recruiter_email": "careers@webcraft.dev",
        "salary_text": "$30/hr",
        "job_description": "We are seeking a React intern to build accessible UI components and write unit tests."
    }
    create_res = client.post("/api/v1/assessments", json=payload, headers=user_a["headers"])
    assert create_res.status_code == 201
    assessment_data = create_res.json()
    assessment_id = assessment_data["id"]
    assert assessment_id
    assert assessment_data["job_title"] == "React Frontend Intern"

    # 2. User A can retrieve it
    get_res = client.get(f"/api/v1/assessments/{assessment_id}", headers=user_a["headers"])
    assert get_res.status_code == 200
    assert get_res.json()["id"] == assessment_id

    # 3. User A can download PDF report
    pdf_res = client.get(f"/api/v1/assessments/{assessment_id}/report", headers=user_a["headers"])
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    assert len(pdf_res.content) > 1000

    # 4. User B cannot access User A's assessment (Isolation check)
    forbidden_get = client.get(f"/api/v1/assessments/{assessment_id}", headers=user_b["headers"])
    assert forbidden_get.status_code == 404

    # 5. User B cannot delete User A's assessment
    forbidden_del = client.delete(f"/api/v1/assessments/{assessment_id}", headers=user_b["headers"])
    assert forbidden_del.status_code == 404

    # 6. User A lists their assessments
    list_res = client.get("/api/v1/assessments", headers=user_a["headers"])
    assert list_res.status_code == 200
    assert list_res.json()["total"] >= 1

    # 7. User A deletes their assessment
    del_res = client.delete(f"/api/v1/assessments/{assessment_id}", headers=user_a["headers"])
    assert del_res.status_code == 204

    # 8. Assessment is gone
    post_del_get = client.get(f"/api/v1/assessments/{assessment_id}", headers=user_a["headers"])
    assert post_del_get.status_code == 404
