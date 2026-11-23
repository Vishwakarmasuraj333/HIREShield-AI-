"""
Automated Pytest Suite for Admin Console, Role Restrictions, Analytics, and Model Transparency APIs.
"""
import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.database import SessionLocal
from app.models.entities import User

client = TestClient(app)

def create_user_with_role(role="USER"):
    unique_id = uuid.uuid4().hex[:8]
    email = f"user_{unique_id}@example.com"
    pwd = "SecurePassword123!"
    reg_res = client.post("/api/v1/auth/register", json={
        "email": email,
        "password": pwd,
        "full_name": f"Test {role} {unique_id}"
    })
    token = reg_res.json()["access_token"]
    user_id = reg_res.json()["user"]["id"]

    if role == "ADMIN":
        db = SessionLocal()
        u = db.query(User).filter(User.id == user_id).first()
        u.role = "ADMIN"
        db.commit()
        db.close()
        # Re-login to get admin token
        login_res = client.post("/api/v1/auth/login", json={"email": email, "password": pwd})
        token = login_res.json()["access_token"]

    return {
        "id": user_id,
        "email": email,
        "token": token,
        "headers": {"Authorization": f"Bearer {token}"}
    }

def test_admin_rbac_enforcement():
    normal_user = create_user_with_role(role="USER")
    admin_user = create_user_with_role(role="ADMIN")

    # Regular user attempting admin endpoints -> 403 Forbidden
    res_users = client.get("/api/v1/admin/users", headers=normal_user["headers"])
    assert res_users.status_code == 403

    res_logs = client.get("/api/v1/admin/audit-logs", headers=normal_user["headers"])
    assert res_logs.status_code == 403

    # Admin user accessing admin endpoints -> 200 OK
    admin_res_users = client.get("/api/v1/admin/users", headers=admin_user["headers"])
    assert admin_res_users.status_code == 200
    assert len(admin_res_users.json()) >= 2

    admin_res_logs = client.get("/api/v1/admin/audit-logs", headers=admin_user["headers"])
    assert admin_res_logs.status_code == 200
    assert isinstance(admin_res_logs.json(), list)

def test_admin_user_lifecycle_toggle():
    admin_user = create_user_with_role(role="ADMIN")
    target_user = create_user_with_role(role="USER")

    # Admin deactivates target user
    deact_res = client.patch(
        f"/api/v1/admin/users/{target_user['id']}/status",
        json={"is_active": False},
        headers=admin_user["headers"]
    )
    assert deact_res.status_code == 200
    assert deact_res.json()["is_active"] is False

    # Deactivated user login rejected
    login_attempt = client.post("/api/v1/auth/login", json={
        "email": target_user["email"],
        "password": "SecurePassword123!"
    })
    assert login_attempt.status_code == 403

    # Admin cannot deactivate self (prevent self-lockout)
    self_lockout = client.patch(
        f"/api/v1/admin/users/{admin_user['id']}/status",
        json={"is_active": False},
        headers=admin_user["headers"]
    )
    assert self_lockout.status_code == 400

    # Reactivate user
    react_res = client.patch(
        f"/api/v1/admin/users/{target_user['id']}/status",
        json={"is_active": True},
        headers=admin_user["headers"]
    )
    assert react_res.status_code == 200
    assert react_res.json()["is_active"] is True

def test_user_analytics_overview():
    user = create_user_with_role(role="USER")

    # Analytics for brand new user
    res_empty = client.get("/api/v1/analytics/overview", headers=user["headers"])
    assert res_empty.status_code == 200
    data_empty = res_empty.json()
    assert data_empty["total_assessments"] == 0
    assert data_empty["average_risk_score"] == 0.0

    # Create an assessment
    client.post(
        "/api/v1/assessments",
        json={
            "job_title": "ML Engineer",
            "job_description": "Work on deep learning and NLP architectures in PyTorch.",
            "company_name": "AI Labs"
        },
        headers=user["headers"]
    )

    # Analytics with assessment
    res_active = client.get("/api/v1/analytics/overview", headers=user["headers"])
    assert res_active.status_code == 200
    data_active = res_active.json()
    assert data_active["total_assessments"] == 1
    assert len(data_active["categories"]) == 4

def test_model_metadata_endpoints():
    res_active = client.get("/api/v1/models/active")
    assert res_active.status_code == 200
    meta = res_active.json()
    assert "version_tag" in meta
    assert "algorithm" in meta
    assert meta["scam_class_recall"] > 0.70

    res_eval = client.get("/api/v1/models/evaluations")
    assert res_eval.status_code == 200
    eval_data = res_eval.json()
    assert "metrics" in eval_data
    assert "confusion_matrix" in eval_data
    assert eval_data["confusion_matrix"]["true_negatives"] == 3019
    assert eval_data["confusion_matrix"]["true_positives"] == 108
