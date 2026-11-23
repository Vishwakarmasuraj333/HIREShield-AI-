# HireShield AI — Database Architecture & Schema Design

## 1. Relational Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ JOB_ASSESSMENTS : "performs"
    USERS ||--o{ AUDIT_LOGS : "triggers"
    JOB_ASSESSMENTS ||--o{ RISK_INDICATORS : "generates"
    MODEL_VERSIONS ||--o{ MODEL_EVALUATION_RUNS : "evaluates"

    USERS {
        uuid id PK "Primary Key"
        varchar email "Unique, Indexed"
        varchar hashed_password "BCrypt Salted Hash"
        varchar full_name "User Display Name"
        varchar role "USER | ADMIN"
        boolean is_active "Account Status"
        timestamp created_at "Registration Timestamp"
        timestamp updated_at "Last Modified Timestamp"
    }

    JOB_ASSESSMENTS {
        uuid id PK "Primary Key"
        uuid user_id FK "References users.id"
        varchar job_title "Evaluated Position Title"
        varchar company_name "Target Company"
        varchar company_url "Job Portal / Web URL"
        varchar recruiter_email "Recruiter Email"
        varchar salary_text "Salary Text Snippet"
        varchar experience_level "Experience Requirement"
        text description_excerpt "Privacy-Conscious Excerpt"
        float risk_score "Computed Score (0.0 - 100.0)"
        varchar risk_category "LOW | MODERATE | HIGH | CRITICAL"
        int ml_prediction "0: Legitimate, 1: Scam"
        float ml_probability "Calibrated Scam Probability"
        varchar model_version "Inference Version Tag"
        timestamp created_at "Assessment Date, Indexed"
    }

    RISK_INDICATORS {
        uuid id PK "Primary Key"
        uuid assessment_id FK "References job_assessments.id"
        varchar code "Canonical Indicator Code"
        varchar title "Human-Readable Finding"
        varchar severity "LOW | MEDIUM | HIGH | CRITICAL"
        text description "Detailed Explanation"
        text evidence_snippet "Extracted Textual Trigger"
    }

    MODEL_VERSIONS {
        uuid id PK "Primary Key"
        varchar version_tag "Unique Version Tag"
        varchar algorithm "Algorithm Name"
        varchar dataset_name "Dataset Provenance"
        int dataset_size "Record Count"
        float scam_class_recall "Held-out Scam Recall"
        float scam_class_precision "Held-out Scam Precision"
        float f1_score "Held-out Scam F1"
        float roc_auc "Area Under ROC Curve"
        float pr_auc "Area Under PR Curve"
        varchar artifact_path "Filesystem Location"
        boolean is_active "Active Status"
        timestamp created_at "Training Timestamp"
    }

    MODEL_EVALUATION_RUNS {
        uuid id PK "Primary Key"
        uuid model_version_id FK "References model_versions.id"
        timestamp run_timestamp "Execution Timestamp"
        text metrics_json "Full Metrics Serialized"
        text confusion_matrix_json "TN, FP, FN, TP Breakdown"
        int test_partition_size "Held-out Test Record Count"
    }

    AUDIT_LOGS {
        uuid id PK "Primary Key"
        uuid user_id FK "References users.id"
        varchar action "Audit Event Code"
        varchar resource_type "Entity Kind"
        varchar resource_id "Target Entity UUID"
        varchar ip_address "Origin IPv4/IPv6"
        text details_json "Contextual Metadata"
        timestamp created_at "Event Timestamp"
    }
```

---

## 2. Table Specifications & Constraints

### A. `users`
- **Primary Key**: `id` (`VARCHAR(36)` UUID v4 string).
- **Index**: Unique index on `email` (`LOWER(email)` normalized).
- **Cascade**: Deleting a user cascades to remove all associated `job_assessments` and nullifies references in `audit_logs`.

### B. `job_assessments`
- **Primary Key**: `id` (`VARCHAR(36)` UUID v4 string).
- **Foreign Key**: `user_id -> users.id` with `ON DELETE CASCADE`.
- **Composite Index**: `idx_assessment_user_created (user_id, created_at DESC)` for fast paginated queries.
- **Privacy Preservation**: Raw 25,000-character job postings are truncated to an essential 1,000-character excerpt (`description_excerpt`) to prevent storing unnecessary personal data.

### C. `risk_indicators`
- **Primary Key**: `id` (`VARCHAR(36)` UUID v4 string).
- **Foreign Key**: `assessment_id -> job_assessments.id` with `ON DELETE CASCADE`.
- **Fields**: Canonical rule codes (e.g. `ADVANCE_PAYMENT_DEMAND`, `PUBLIC_EMAIL_DOMAIN`, `SENSITIVE_DATA_SOLICITATION`).

### D. `model_versions` & `model_evaluation_runs`
- Tracks the active ML artifact version (`v1.0.0-emscad-nlp`), serialized hyperparameters, and evaluation metrics on the held-out test split.

### E. `audit_logs`
- Implements security traceability for authentication attempts, assessment deletions, and administrative status alterations.
