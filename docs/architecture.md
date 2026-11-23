# HireShield AI — System Architecture & Technical Design

## 1. Executive Architecture Summary
HireShield AI is engineered as a modern, decoupled three-tier enterprise web application designed to evaluate employment postings and internship offers. It combines statistical machine learning (Calibrated Linear Support Vector Classifier with Sublinear TF-IDF feature extraction) with deterministic cybersecurity heuristics (red-flag rule detection, payment demand isolation, and domain integrity checks) to protect job seekers from recruitment fraud and identity theft.

---

## 2. System Context Diagram (C4 Level 1)

```mermaid
flowchart TD
    User["Job Seeker / Student User"]
    Admin["System Administrator"]
    
    subgraph HireShieldPlatform["HireShield AI Platform"]
        UI["Next.js 14 Frontend Application<br/>(Tailwind CSS, TypeScript, Recharts)"]
        API["FastAPI Backend Services<br/>(Python 3.12, Pydantic v2, PyJWT)"]
        MLEngine["Calibrated ML Inference Engine<br/>(Scikit-Learn, Sublinear TF-IDF, Sigmoid Platt Scaling)"]
        RuleEngine["Deterministic Risk Rule Engine<br/>(Cyber-Hygiene Heuristics & Floor Safeguards)"]
        PDFService["PDF Dossier Generation Service<br/>(ReportLab Vector Graphics)"]
        Database[("Relational Database Store<br/>SQLite 3 Dev / PostgreSQL 15 Prod")]
    end

    User -->|"Interacts with web UI"| UI
    Admin -->|"Manages accounts & audits"| UI
    UI -->|"JSON / REST over HTTP"| API
    API -->|"Invokes prediction"| MLEngine
    API -->|"Evaluates red flags"| RuleEngine
    API -->|"Renders official dossier"| PDFService
    API -->|"Reads / Persists state"| Database
```

---

## 3. Data Flow Diagrams (DFD)

### A. Level 0 DFD (Context Level)

```mermaid
flowchart LR
    Candidate["Candidate / Job Seeker"] -->|"Submits Job Details & Description"| HireShield["HireShield AI System"]
    HireShield -->|"Returns Calibrated Risk Score (0-100), Category, Indicators & PDF Report"| Candidate
    AdminUser["System Administrator"] -->|"Manages Users & Observes Audit Stream"| HireShield
    HireShield -->|"Returns User Lifecycle & Security Logs"| AdminUser
```

### B. Level 1 DFD (Decomposed Process View)

```mermaid
flowchart TD
    P1["1.0 User Authentication & Session Provider"]
    P2["2.0 Text Preprocessing & Cleaning"]
    P3["3.0 Sublinear TF-IDF Vectorization"]
    P4["4.0 Calibrated ML Inference (LinearSVC)"]
    P5["5.0 Deterministic Red-Flag Rule Engine"]
    P6["6.0 Hybrid Score Aggregation & Floor Logic"]
    P7["7.0 Persistence & Audit Logging"]
    P8["8.0 PDF Dossier Synthesis"]

    User["User"] -->|"Credentials"| P1
    P1 -->|"JWT Token"| User
    User -->|"Job Posting Content"| P2
    P2 -->|"Normalized Tokens"| P3
    P3 -->|"12,000 Sparse TF-IDF Vector"| P4
    P4 -->|"Calibrated Probability (0.0 - 1.0)"| P6
    P2 -->|"Raw & Cleaned Text"| P5
    P5 -->|"Triggered Indicators & Severity"| P6
    P6 -->|"Final Risk Score (0-100) & Category"| P7
    P7 -->|"(users, job_assessments, risk_indicators)"| DB[("Database")]
    P7 -->|"Rendered Assessment"| User
    User -->|"Request PDF Export"| P8
    P8 -->|"In-Memory Binary PDF Stream"| User
```

---

## 4. Assessment Lifecycle Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Job Seeker
    participant UI as Next.js Frontend
    participant API as FastAPI Backend (/assessments)
    participant Engine as Detection & Risk Engine
    participant ML as ML Inference Engine
    participant DB as SQLite / PostgreSQL
    participant PDF as ReportLab PDF Service

    User->>UI: Pastes job description and metadata, clicks Submit
    UI->>API: POST /api/v1/assessments (Bearer Token)
    API->>API: Validate JWT and extract current_user
    API->>Engine: assess_job(title, desc, company, email, salary)
    Engine->>ML: predict(title, company, desc)
    ML->>ML: Clean text, transform via TF-IDF (12,000 features)
    ML->>ML: model.predict_proba() [Calibrated LinearSVC]
    ML-->>Engine: probability (0.89), prediction (1)
    Engine->>Engine: Run regex heuristic rules (fees, banking data, domains, urgency)
    Engine->>Engine: Aggregate 50% ML + 50% Heuristics + Critical Floor
    Engine-->>API: risk_score (92.5), risk_category (CRITICAL), indicators, actions
    API->>DB: INSERT INTO job_assessments & risk_indicators
    API->>DB: INSERT INTO audit_logs (ASSESSMENT_CREATED)
    DB-->>API: Persisted assessment UUID
    API-->>UI: 201 Created (JSON AssessmentResponse)
    UI-->>User: Displays interactive Risk Gauge, indicators, checklist
    
    opt Export Official PDF Dossier
        User->>UI: Clicks "Download Official PDF Dossier"
        UI->>API: GET /api/v1/assessments/{id}/report
        API->>PDF: generate_assessment_pdf(assessment_data)
        PDF-->>API: In-memory binary PDF bytes
        API-->>UI: 200 OK (application/pdf)
        UI-->>User: Browser downloads HireShield-Report-[UUID].pdf
    end
```

---

## 5. Technology Stack Summary

| Layer | Component | Version | Rationale & Selection Criteria |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js (App Router) | 14.2.35 | Server and client component rendering, zero-config routing, rapid build times. |
| **Styling** | Tailwind CSS | 3.4.3 | Responsive design, clean utility classes, consistent color tokens. |
| **Visualization** | Recharts | 2.12.7 | Interactive SVG charts for risk category breakdown and activity timelines. |
| **Backend** | FastAPI | 0.165.0 | High-performance asynchronous REST API framework, Pydantic v2 schema validation, automatic OpenAPI /docs. |
| **Server** | Uvicorn | 0.54.0 | ASGI web server for asynchronous Python execution. |
| **ORM** | SQLAlchemy | 2.1.9 | Declarative ORM mapping with cross-database support (SQLite / PostgreSQL). |
| **Migrations** | Alembic | 1.20.1 | Database schema migrations and tracking. |
| **Machine Learning** | Scikit-Learn | 1.9.1 | Production-ready TF-IDF extraction, LinearSVC classifier, CalibratedClassifierCV. |
| **Security** | PyJWT & BCrypt | 2.15.1 / 5.0.0 | Industry-standard salted cryptographic password hashing and stateless token issuance. |
| **Reporting** | ReportLab | 5.1.0 | Vectorized, publication-grade in-memory PDF generation. |
| **Testing** | Pytest & TestClient | 9.2.0 | Automated regression testing for APIs, isolation, and detection rules. |
