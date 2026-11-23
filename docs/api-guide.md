# HireShield AI — REST API Documentation

**Base URL**: `http://localhost:8000/api/v1`  
**Interactive Docs**: `http://localhost:8000/docs` (Swagger UI) / `http://localhost:8000/redoc` (ReDoc)  
**Authentication**: Bearer Token in `Authorization: Bearer <JWT>` header.

---

## 1. System Health & Diagnostics

### `GET /health`
Returns high-level server availability.
- **Auth**: None
- **Response**: `200 OK`
  ```json
  {
    "status": "healthy",
    "service": "HireShield AI",
    "environment": "development"
  }
  ```

### `GET /api/v1/health/ready`
Readiness check confirming database connectivity and active model registration.
- **Auth**: None
- **Response**: `200 OK`
  ```json
  {
    "status": "ready",
    "service": "HireShield AI",
    "database": "connected",
    "active_model": "v1.0.0-emscad-nlp"
  }
  ```

---

## 2. Authentication & Session (`/auth`)

### `POST /api/v1/auth/register`
Creates a new user profile and returns an initial JWT bearer token.
- **Payload**:
  ```json
  {
    "email": "student@university.edu",
    "password": "SecurePassword123!",
    "full_name": "Aarav Sharma"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "user": {
      "id": "c1f7a0b2-...",
      "email": "student@university.edu",
      "full_name": "Aarav Sharma",
      "role": "USER",
      "is_active": true,
      "created_at": "2026-11-23T19:50:00Z"
    }
  }
  ```

### `POST /api/v1/auth/login`
Validates credentials and issues a JWT token.
- **Payload**:
  ```json
  {
    "email": "student@university.edu",
    "password": "SecurePassword123!"
  }
  ```
- **Response**: `200 OK` (Same format as registration response)

### `GET /api/v1/auth/me`
Retrieves the profile of the current authenticated caller.
- **Auth**: Bearer Token
- **Response**: `200 OK`

---

## 3. Risk Assessment Engine (`/assessments`)

### `POST /api/v1/assessments`
Submits a job or internship description to the hybrid detection engine.
- **Auth**: Bearer Token
- **Payload**:
  ```json
  {
    "job_title": "Remote Python Intern",
    "company_name": "Apex Global LLC",
    "company_url": "http://apex-jobs.xyz",
    "recruiter_email": "recruiter@gmail.com",
    "salary_text": "$45/hour",
    "experience_level": "Fresher",
    "job_description": "We are urgently hiring. Please transfer $150 refundable deposit for laptop."
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": "4c42fa5e-...",
    "job_title": "Remote Python Intern",
    "company_name": "Apex Global LLC",
    "risk_score": 92.5,
    "risk_category": "CRITICAL",
    "ml_prediction": 1,
    "ml_probability": 0.89,
    "model_version": "v1.0.0-emscad-nlp",
    "indicators": [
      {
        "code": "ADVANCE_PAYMENT_DEMAND",
        "title": "Upfront Payment or Deposit Demanded",
        "severity": "CRITICAL",
        "description": "Legitimate employers never require candidates to pay registration or equipment fees.",
        "evidence_snippet": "transfer $150 refundable deposit for laptop"
      }
    ],
    "positive_signals": [],
    "recommended_actions": [
      "CRITICAL WARNING: Cease communications if the counterparty requests payment or banking OTPs.",
      "Never transfer funds, purchase gift cards, or pay for equipment as a condition of employment."
    ],
    "disclaimer": "HireShield AI is an intelligent decision-support screening aid..."
  }
  ```

### `GET /api/v1/assessments`
Lists paginated assessments belonging to the caller.
- **Query Params**:
  - `page` (default 1)
  - `page_size` (default 10, max 100)
  - `category` (optional: `LOW`, `MODERATE`, `HIGH`, `CRITICAL`)
  - `search` (optional substring query on title or company)
- **Response**: `200 OK` (`AssessmentListResponse`)

### `GET /api/v1/assessments/{assessment_id}`
Returns complete details of a specific assessment.
- **Security**: Tenant-isolated; users cannot view other users' records (returns `404 Not Found`).

### `DELETE /api/v1/assessments/{assessment_id}`
Permanently deletes an assessment and logs an audit record.
- **Response**: `204 No Content`

### `GET /api/v1/assessments/{assessment_id}/report`
Generates and streams an in-memory official PDF risk assessment dossier.
- **Response**: Binary stream with `Content-Type: application/pdf` and `Content-Disposition: attachment; filename="..."`.

---

## 4. User Analytics (`/analytics`)

### `GET /api/v1/analytics/overview`
Aggregates user-specific assessment metrics:
- Total assessments
- Category counts (Critical, High, Moderate, Low)
- Average risk score
- Activity history sparkline

---

## 5. Model Benchmarks & Metadata (`/models`)

### `GET /api/v1/models/active`
Returns active model hyperparameters, algorithm (`Calibrated LinearSVC`), and training dataset provenance.

### `GET /api/v1/models/evaluations`
Returns held-out test evaluation benchmarks:
- Confusion Matrix (`TN`, `FP`, `FN`, `TP`)
- Scam Recall (76.06%), Scam Precision (88.52%), Scam F1 (81.82%)
- ROC-AUC (0.9691) & PR-AUC (0.8681)
- Top scam n-gram feature weights

---

## 6. Administration & Security (`/admin`)
*Guarded by strict RBAC (`ADMIN` role required).*

### `GET /api/v1/admin/users`
Lists all registered users, roles, and active statuses.

### `PATCH /api/v1/admin/users/{user_id}/status`
Toggles user active state (suspension / reactivation). Prevents admin self-lockout.

### `GET /api/v1/admin/audit-logs`
Returns chronological security audit logs.
