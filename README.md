# HireShield AI — Intelligent Job & Internship Risk Assessment Platform

> **"Verify the opportunity. Understand the risk. Apply with confidence."**

An academic, production-grade M.Sc. IT Group Major Project designed to protect students, fresh graduates, and remote job seekers from fraudulent recruitment offers, ghost internships, advance-fee training scams, and identity theft.

---

## 1. System Highlights

- **Genuine Machine Learning**: Trained and cross-validated on the University of the Aegean **EMSCAD** benchmark (17,880 postings). Evaluated on an untouched held-out test set ($N = 3,175$) achieving **88.52% scam precision**, **76.06% scam recall**, **0.9691 ROC-AUC**, and **0.8681 PR-AUC**.
- **Transparent Rule Heuristics**: Detects advance registration/equipment fees, premature banking OTP requests, Telegram/WhatsApp interview redirects, and free recruiter email domain mismatches.
- **Explainable Results & PDF Dossier**: Clear separation between statistical ML probability and evidence-based rule triggers. Downloadable, publication-grade PDF risk dossiers generated server-side via ReportLab.
- **Full-Stack SaaS Interface**: Built with Next.js 14 App Router, TypeScript, Tailwind CSS, and Recharts. Includes user analytics, assessment history, CSV export, and an RBAC-protected administrative console.
- **Enterprise-Grade API**: Built with FastAPI, Pydantic v2, SQLAlchemy, BCrypt salted password hashing, and JWT bearer authentication. Supports zero-setup SQLite development and production PostgreSQL with Alembic migrations.

---

## 2. Monorepo Structure

```
hireshield-ai/
  frontend/                     # Next.js 14 App Router (React, TypeScript, Tailwind CSS)
    src/
      app/                      # Pages: landing, login, register, dashboard, analyze, assessments, history, model-info, admin
      components/               # Navbar, Footer, RiskBadge, RiskGauge
      context/                  # AuthContext (JWT session state)
      lib/                      # API client with token management
      types/                    # TypeScript interfaces
  backend/                      # FastAPI Python Application
    app/
      api/v1/                   # Endpoints: auth, assessments, analytics, models, admin
      core/                     # Settings, BCrypt hashing, JWT security
      models/                   # SQLAlchemy ORM entities (users, assessments, indicators, audit)
      schemas/                  # Pydantic v2 request/response schemas
      services/                 # Hybrid detection engine & ReportLab PDF generator
      ml/                       # Production ML inference service
    tests/                      # Automated Pytest suite (100% passing)
    seed_data.py                # Development database seeder
    requirements.txt            # Python dependencies
  ml/                           # Reproducible Machine Learning Pipeline
    data/                       # EMSCAD dataset, train.csv, test.csv, README.md
    artifacts/                  # Serialized model.joblib, vectorizer.joblib, metadata.json
    scripts/                    # download_dataset.py, inspect_dataset.py, prepare_dataset.py, train.py, evaluate.py
    reports/                    # evaluation_results.json, evaluation_report.md
  docs/                         # Academic Deliverables & Architectural Specifications
    architecture.md             # System architecture & Mermaid flowcharts
    api-guide.md                # OpenAPI REST API documentation
    database-design.md          # Relational schema & ER diagram
    model-card.md               # Model specifications, feature weights & benchmarks
    testing-report.md           # Automated verification test results
    viva-preparation.md         # 14-slide presentation outline, demo script, and Viva Q&A
    group-contribution.md       # 4-member group collaboration template
  docker-compose.yml            # Multi-container production deployment
  .env.example                  # Environment configuration template
  README.md                     # Project documentation
```

---

## 3. Quickstart & Local Setup

### Prerequisites
- Python 3.11+ or 3.12
- Node.js v18+ or v20+ and npm
- (Optional) Docker & Docker Compose for containerized deployment

---

### Step 1: Clone and Set Up the Python Backend

```bash
cd hireshield-ai

# Create and activate virtual environment
python -m venv .venv

# On Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# On macOS / Linux:
# source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
```

---

### Step 2: Reproduce Machine Learning Pipeline

Execute the scripts to acquire the real EMSCAD benchmark dataset, preprocess without data leakage, compare candidate models, and evaluate on the held-out test split:

```bash
# 1. Download genuine EMSCAD dataset (17,880 postings)
python ml/scripts/download_dataset.py

# 2. Inspect dataset distribution and class balance
python ml/scripts/inspect_dataset.py

# 3. Clean text, deduplicate, and perform stratified 80/20 train/test split
python ml/scripts/prepare_dataset.py

# 4. Train Sublinear TF-IDF and compare Baseline Logistic Regression vs Champion Calibrated LinearSVC
python ml/scripts/train.py

# 5. Evaluate champion model on unseen held-out test partition
python ml/scripts/evaluate.py
```

*Evaluation artifacts will be saved to `ml/artifacts/` and `ml/reports/`.*

---

### Step 3: Run Automated Backend Tests

```bash
cd backend
pytest -v
```
*Executes all 7 automated unit and API integration tests verifying authentication, tenant isolation, rule indicators, and PDF dossier generation.*

---

### Step 4: Seed Database & Start Backend API Server

```bash
cd backend

# Seed test accounts and sample assessments
python seed_data.py

# Launch FastAPI on port 8000
uvicorn app.main:app --reload --port 8000
```
- API Base URL: `http://localhost:8000`
- Interactive Swagger UI: `http://localhost:8000/docs`

#### Seeded Demonstration Accounts:
- **Student User**: `student@university.edu` / `Student@12345`
- **Administrator**: `admin@hireshield.ai` / `Admin@12345`

---

### Step 5: Start Frontend Application

In a separate terminal:

```bash
cd hireshield-ai/frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
Open your browser at **`http://localhost:3000`**.

---

## 4. Academic Viva Demonstration Highlights

1. **One-Click Viva Login**: The login screen features quick-fill buttons for both the Student and Admin accounts.
2. **Instant Scam Simulation**: The `/analyze` workspace includes **"Load Scam Sample"** and **"Load Safe Sample"** buttons to showcase live classification during presentations.
3. **Downloadable PDF Dossiers**: Click **"Download Official PDF Dossier"** on any result to export a formatted report.
4. **Transparent Model Specs**: Navigate to `/model-info` to review the confusion matrix, ROC-AUC curve scores, and dataset provenance.

---

## 5. Docker Compose Deployment

To run the entire system (PostgreSQL 15, FastAPI, and Next.js) in isolated containers:

```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`

---

## 6. License & Academic Attribution
Developed as an M.Sc. Information Technology Group Major Project. Dataset sourced from University of the Aegean (Vidros et al., 2017). Designed strictly for candidate protection and academic evaluation.
