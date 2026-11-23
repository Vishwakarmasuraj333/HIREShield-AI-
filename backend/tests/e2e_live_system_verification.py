"""
Live End-to-End System & API Verification Script for HireShield AI.
Executes the complete multi-step user journey against the live running services:
- Frontend: http://localhost:3000
- Backend:  http://localhost:8000
"""
import uuid
import httpx

FRONTEND_URL = "http://127.0.0.1:3000"
BACKEND_URL = "http://127.0.0.1:8000/api/v1"

def run_live_e2e_verification():
    print("=" * 70)
    print("HIRESHIELD AI — LIVE END-TO-END SYSTEM VERIFICATION")
    print("=" * 70)
    client = httpx.Client(timeout=15.0)

    # Step 1: Health & Landing Page
    print("\n[Step 1] Verifying System Availability & Frontend...")
    res_health = client.get("http://127.0.0.1:8000/health")
    assert res_health.status_code == 200, f"Health check failed: {res_health.status_code}"
    print(f"✔ Backend Health Endpoint: 200 OK -> {res_health.json()}")

    res_ready = client.get(f"{BACKEND_URL}/health/ready")
    assert res_ready.status_code == 200
    print(f"✔ Backend Readiness: 200 OK -> {res_ready.json()}")

    res_landing = client.get(FRONTEND_URL)
    assert res_landing.status_code == 200
    assert "HireShield" in res_landing.text
    print(f"✔ Frontend Landing Page: 200 OK (Content length: {len(res_landing.text):,} chars)")

    # Step 2: Register New Test User
    print("\n[Step 2] User Registration & Session Issuance...")
    rand_id = uuid.uuid4().hex[:6]
    test_email = f"live_auditor_{rand_id}@hireshield.ai"
    test_password = "SecurePassword@123!"
    reg_payload = {
        "email": test_email,
        "password": test_password,
        "full_name": f"Live QA Auditor {rand_id}"
    }
    res_reg = client.post(f"{BACKEND_URL}/auth/register", json=reg_payload)
    assert res_reg.status_code == 201, f"Registration failed: {res_reg.text}"
    user_a_token = res_reg.json()["access_token"]
    user_a_id = res_reg.json()["user"]["id"]
    headers_a = {"Authorization": f"Bearer {user_a_token}"}
    print(f"✔ Registered User A: {test_email} (ID: {user_a_id})")

    # Step 3: Login Verification
    print("\n[Step 3] Authentication Verification & Protected Profile...")
    res_login = client.post(f"{BACKEND_URL}/auth/login", json={
        "email": test_email,
        "password": test_password
    })
    assert res_login.status_code == 200
    res_me = client.get(f"{BACKEND_URL}/auth/me", headers=headers_a)
    assert res_me.status_code == 200
    assert res_me.json()["email"] == test_email
    print(f"✔ Authenticated caller profile verified: {res_me.json()['full_name']} ({res_me.json()['role']})")

    # Step 4: Submit Suspicious Job Description (Live ML + Rule Assessment)
    print("\n[Step 4] Live Assessment Submission (Scam Sample)...")
    scam_payload = {
        "job_title": "Remote Python & Data Research Intern",
        "company_name": "Apex Global Technologies LLC",
        "company_url": "http://apex-quick-jobs.xyz",
        "recruiter_email": "hiring.apexglobal@gmail.com",
        "salary_text": "$45/hour (Immediate Joining)",
        "experience_level": "Fresher / No experience required",
        "job_description": (
            "We are urgently hiring remote data entry assistants and Python research interns! "
            "Immediate 100% guaranteed selection with no interview required. "
            "Work from home at your convenience. Selected candidates are required to transfer a "
            "mandatory $150 refundable onboarding laptop security deposit via gift card or crypto "
            "before work tools are dispatched. Contact our recruiter directly on Telegram @ApexHiring."
        )
    }
    res_assess = client.post(f"{BACKEND_URL}/assessments", json=scam_payload, headers=headers_a)
    assert res_assess.status_code == 201, f"Assessment failed: {res_assess.text}"
    assessment_data = res_assess.json()
    assessment_id = assessment_data["id"]
    print(f"✔ Assessment Generated Successfully (ID: {assessment_id})")
    print(f"  - Calculated Risk Score:    {assessment_data['risk_score']} / 100.0")
    print(f"  - Assigned Risk Category:   {assessment_data['risk_category']}")
    print(f"  - Calibrated ML Probability:{assessment_data['ml_probability'] * 100:.1f}%")
    print(f"  - Active Model Version:     {assessment_data['model_version']}")
    print(f"  - Flagged Indicators ({len(assessment_data['indicators'])} total):")
    for ind in assessment_data["indicators"]:
        print(f"    * [{ind['severity']}] {ind['title']} ({ind['code']}): {ind['evidence_snippet']}")

    assert assessment_data["risk_category"] == "CRITICAL"
    assert assessment_data["risk_score"] >= 82.0
    indicator_codes = [i["code"] for i in assessment_data["indicators"]]
    assert "ADVANCE_PAYMENT_DEMAND" in indicator_codes
    assert "PUBLIC_EMAIL_DOMAIN" in indicator_codes

    # Step 5: PDF Dossier Download & Verification
    print("\n[Step 5] PDF Report Generation & Stream Verification...")
    res_pdf = client.get(f"{BACKEND_URL}/assessments/{assessment_id}/report", headers=headers_a)
    assert res_pdf.status_code == 200
    assert res_pdf.headers.get("content-type") == "application/pdf"
    assert res_pdf.content.startswith(b"%PDF"), "Binary content is not a valid PDF"
    print(f"✔ PDF Dossier Verified: {len(res_pdf.content):,} bytes generated via ReportLab")

    # Step 6: Assessment History & Persistence
    print("\n[Step 6] Assessment History & Data Persistence...")
    res_history = client.get(f"{BACKEND_URL}/assessments", headers=headers_a)
    assert res_history.status_code == 200
    history_data = res_history.json()
    assert history_data["total"] >= 1
    matched = any(it["id"] == assessment_id for it in history_data["items"])
    assert matched, "Newly created assessment not found in history list"
    print(f"✔ Assessment History: Found {history_data['total']} record(s) persisted in database.")

    # Step 7: Cross-User Isolation (Tenant Boundary Check)
    print("\n[Step 7] Security Isolation: Cross-User Access Attempt...")
    user_b_payload = {
        "email": f"attacker_{rand_id}@example.com",
        "password": "Password123!",
        "full_name": "Unauthorized User B"
    }
    res_user_b = client.post(f"{BACKEND_URL}/auth/register", json=user_b_payload)
    headers_b = {"Authorization": f"Bearer {res_user_b.json()['access_token']}"}

    # User B attempts to access User A's assessment
    res_cross_get = client.get(f"{BACKEND_URL}/assessments/{assessment_id}", headers=headers_b)
    assert res_cross_get.status_code == 404, f"Expected 404, got {res_cross_get.status_code}"

    # User B attempts to download User A's PDF
    res_cross_pdf = client.get(f"{BACKEND_URL}/assessments/{assessment_id}/report", headers=headers_b)
    assert res_cross_pdf.status_code == 404, f"Expected 404, got {res_cross_pdf.status_code}"

    # User B attempts to delete User A's assessment
    res_cross_del = client.delete(f"{BACKEND_URL}/assessments/{assessment_id}", headers=headers_b)
    assert res_cross_del.status_code == 404, f"Expected 404, got {res_cross_del.status_code}"
    print("✔ Cross-User Tenant Isolation 100% Enforced: User B received 404 on GET, PDF, and DELETE.")

    # Step 8: Admin Authentication & RBAC Oversight
    print("\n[Step 8] Administrative Oversight & Security Audit Stream...")
    admin_login = client.post(f"{BACKEND_URL}/auth/login", json={
        "email": "admin@hireshield.ai",
        "password": "Admin@12345"
    })
    assert admin_login.status_code == 200, f"Admin login failed: {admin_login.text}"
    admin_headers = {"Authorization": f"Bearer {admin_login.json()['access_token']}"}

    res_users = client.get(f"{BACKEND_URL}/admin/users", headers=admin_headers)
    assert res_users.status_code == 200
    user_emails = [u["email"] for u in res_users.json()]
    assert test_email in user_emails
    print(f"✔ Admin User Console: Verified {len(res_users.json())} system accounts.")

    res_logs = client.get(f"{BACKEND_URL}/admin/audit-logs", headers=admin_headers)
    assert res_logs.status_code == 200
    print(f"✔ Platform Audit Stream: Retrieved {len(res_logs.json())} real audit events.")

    # Step 9: Model Specs & Benchmarks Endpoint
    print("\n[Step 9] Transparent Model Specs Verification...")
    res_meta = client.get(f"{BACKEND_URL}/models/evaluations")
    assert res_meta.status_code == 200
    eval_bench = res_meta.json()
    print(f"✔ Active Model: {eval_bench['model_version']} ({eval_bench['algorithm']})")
    print(f"✔ Benchmarks: Precision={eval_bench['metrics']['scam_precision']}, Recall={eval_bench['metrics']['scam_recall']}, ROC-AUC={eval_bench['metrics']['roc_auc']}")
    print(f"✔ Confusion Matrix: TN={eval_bench['confusion_matrix']['true_negatives']}, FP={eval_bench['confusion_matrix']['false_positives']}, FN={eval_bench['confusion_matrix']['false_negatives']}, TP={eval_bench['confusion_matrix']['true_positives']}")

    # Step 10: Frontend Routes Verification
    print("\n[Step 10] Frontend Routes Verification...")
    routes = ["/", "/analyze", "/dashboard", "/history", "/model-info", "/login", "/register", "/admin"]
    for r in routes:
        resp = client.get(f"{FRONTEND_URL}{r}")
        assert resp.status_code == 200, f"Route {r} returned {resp.status_code}"
        print(f"  - Route {r:<15}: 200 OK")

    print("\n" + "=" * 70)
    print("ALL 10 LIVE END-TO-END WORKFLOW STAGES PASSED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == "__main__":
    run_live_e2e_verification()
