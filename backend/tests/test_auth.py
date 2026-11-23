"""
Automated Pytest Suite for HireShield AI Authentication & RBAC.
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.database import SessionLocal, Base, engine
from app.models.entities import User

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    yield

def test_health_endpoints():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

    res_ready = client.get("/api/v1/health/ready")
    assert res_ready.status_code == 200
    assert res_ready.json()["status"] == "ready"

def test_user_registration_and_login():
    import uuid
    rand_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    payload = {
        "email": rand_email,
        "password": "SecurePassword123!",
        "full_name": "Test Candidate"
    }
    
    # 1. Register
    reg_res = client.post("/api/v1/auth/register", json=payload)
    assert reg_res.status_code == 201
    reg_data = reg_res.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == rand_email

    # 2. Duplicate registration should fail
    dup_res = client.post("/api/v1/auth/register", json=payload)
    assert dup_res.status_code == 400

    # 3. Valid Login
    login_res = client.post("/api/v1/auth/login", json={
        "email": rand_email,
        "password": "SecurePassword123!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    assert token

    # 4. Invalid Password
    bad_login = client.post("/api/v1/auth/login", json={
        "email": rand_email,
        "password": "WrongPassword!"
    })
    assert bad_login.status_code == 401

    # 5. Access Protected /auth/me
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == rand_email
