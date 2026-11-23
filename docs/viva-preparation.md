# HireShield AI — Presentation Outline, Demo Script & Viva Q&A

**Degree**: Master of Science in Information Technology (M.Sc. IT)  
**Project**: HireShield AI — Intelligent Job & Internship Risk Assessment Platform  
**Tagline**: *"Verify the opportunity. Understand the risk. Apply with confidence."*

---

## Part 1: 14-Slide Presentation Outline

### Slide 1: Title & Group Introduction
- **Title**: HireShield AI: Hybrid AI-Powered Job & Internship Fraud Screening Platform
- **Subtitle**: Protecting Students and Entry-Level Job Seekers Against Recruitment Scams and Identity Theft
- **Presenters**: [Member 1, Member 2, Member 3, Member 4]
- **Institution**: Department of Information Technology, Postgraduate Studies

### Slide 2: Problem Statement & Motivation
- **The Issue**: Proliferation of predatory job postings, ghost internships, advance-fee training scams, and identity harvesting on professional networks (LinkedIn, Telegram, job boards).
- **Vulnerable Demographic**: Students, freshers, and remote workers facing aggressive phishing masquerading as recruitment.
- **Academic Goal**: Design an explainable, end-to-end software system that combines genuine machine learning with deterministic cyber-risk indicators to evaluate recruitment listings in real time.

### Slide 3: Existing Systems & Their Limitations
- **Manual Verification**: Inefficient and requires specialized cyber awareness.
- **Generic LLM Chatbots**: Hallucination risks, inconsistent scoring, lack of reproducible mathematical calibration, latency, and expensive API overhead.
- **Heuristics Alone**: Fails against subtly rephrased fraudulent descriptions.
- **HireShield Solution**: A hybrid system combining calibrated TF-IDF NLP with deterministic rule heuristics.

### Slide 4: Proposed System Architecture
- Flow diagram: User Input &rarr; Next.js Frontend &rarr; FastAPI Backend &rarr; Hybrid Detection Engine (Calibrated LinearSVC + Rule Indicators) &rarr; PostgreSQL / SQLite DB &rarr; Explainable UI & Downloadable PDF Dossier.

### Slide 5: Real-World Dataset & Academic Provenance
- **Dataset**: University of the Aegean Employment Scam Aegean Dataset (EMSCAD).
- **Original Source**: Laboratory of Information & Communication Systems Security (ICCS), 17,880 records.
- **Class Imbalance**: 19.65 : 1 ratio (95.16% legitimate, 4.84% scam).
- **Leakage Prevention**: Stratified 80/20 train/test split established before any feature extraction or vocabulary fitting.

### Slide 6: Machine Learning Pipeline & Model Comparison
- **Preprocessing**: Sublinear TF-IDF (12,000 n-gram features, range 1–2, stopword removal).
- **Model Selection (5-Fold Stratified CV on Training Split)**:
  - Baseline Logistic Regression: Scam F1 = 74.33%, Precision = 68.62%, Recall = 81.23%
  - Champion Calibrated LinearSVC: Scam F1 = 80.07%, Precision = 89.25%, Recall = 72.63%
- **Why LinearSVC was selected**: Far higher precision (89.25%) drastically reduces false alarms on legitimate employers while maintaining solid recall.

### Slide 7: Evaluation Results on Held-Out Test Set (N = 3,175)
- **Scam Precision**: 88.52%
- **Scam Recall**: 76.06%
- **Scam F1-Score**: 81.82%
- **ROC-AUC**: 0.9691
- **PR-AUC**: 0.8681
- **Confusion Matrix**: 3,019 TN, 14 FP, 34 FN, 108 TP (False positive rate: 0.46%).

### Slide 8: The Detection & Risk Assessment Engine (Hybrid Logic)
- **ML Probability (50% weight)**: Calibrated confidence from trained lexical n-grams.
- **Deterministic Red Flags (50% weight)**:
  - `ADVANCE_PAYMENT_DEMAND`: Upfront equipment/training deposits (+45 pts).
  - `SENSITIVE_DATA_SOLICITATION`: Premature banking/OTP/SSN requests (+35 pts).
  - `PUBLIC_EMAIL_DOMAIN`: Free @gmail.com for purported corporations (+25 pts).
  - `UNOFFICIAL_INTERVIEW_CHANNEL`: Redirection to Telegram/WhatsApp (+20 pts).
  - `GUARANTEED_OFFER_URGENCY`: "100% immediate hiring with no interview" (+20 pts).

### Slide 9: User Experience & Assessment Workflow
- Responsive Next.js App Router interface styled in warm off-white, emerald, and amber.
- Instant analysis form with sample scam pre-filler for live demonstrations.
- Interactive Risk Gauge, evidence highlights, reassuring signals, and verification checklist.

### Slide 10: PDF Dossier & Reporting Module
- Server-side generated PDF dossier built with ReportLab.
- Contains official assessment UUID, model version, calculated risk status, itemized indicators, and candidate safety guidance.

### Slide 11: Security & Database Architecture
- Normalized relational schema: `users`, `job_assessments`, `risk_indicators`, `model_versions`, `model_evaluation_runs`, `audit_logs`.
- BCrypt password hashing, JWT bearer tokens, tenant-isolated queries, and role-based access control (`USER` vs `ADMIN`).

### Slide 12: Automated Quality Assurance & Testing
- 100% passing automated test suite with Pytest.
- Tests covering authentication, user isolation, rule trigger accuracy, PDF streaming, and ML inference.

### Slide 13: Project Limitations & Ethical Guardrails
- **Temporal Shift**: Evolution of recruitment fraud into task-based Telegram tasks.
- **Screening Aid**: Framed as decision support; never issues definitive defamatory judgments against organizations without manual candidate verification.

### Slide 14: Conclusion & Future Scope
- **Accomplishments**: Genuine trained ML model, responsive full-stack platform, zero fabricated metrics, academic integrity.
- **Future Enhancements**: Browser extension for inline job-board scanning, real-time DNS WHOIS domain age checks, and corporate registry verification.

---

## Part 2: 7-Minute Live Demonstration Script

| Time | Presenter Action | Spoken Narrative & Key Viva Points |
| :--- | :--- | :--- |
| **0:00 - 1:00** | Open Landing Page (`localhost:3000`) | *"Good morning respected examiners. Welcome to HireShield AI. We built this platform to tackle online recruitment fraud targeting university students and job seekers. The platform is running locally with a FastAPI backend and Next.js frontend."* |
| **1:00 - 2:00** | Click Sign In & use Viva Quick-Fill (`student@university.edu`) | *"Here we log in as a student using JWT authentication with BCrypt password hashing. We land on the User Dashboard, which pulls live metrics directly from our SQLite/PostgreSQL database."* |
| **2:00 - 3:30** | Navigate to `/analyze` & click **Load Scam Sample** | *"Let's test our detection engine. We click 'Load Scam Sample' to simulate a common remote data entry scam demanding a $150 onboarding laptop deposit and directing applicants to Telegram. We click Execute Risk Assessment."* |
| **3:30 - 4:45** | Review Results at `/assessments/[id]` | *"Instantly, our hybrid engine evaluates the post. Notice the score: 92.5 / 100 (Critical Risk). The ML classifier predicted a high scam probability, and our deterministic rule engine flagged both the advance payment solicitation and the generic @gmail.com recruiter address. We also generate candidate action checklists."* |
| **4:45 - 5:30** | Click **Download Official PDF Dossier** | *"Candidates can export a formal, publication-grade PDF risk dossier with a single click, generated dynamically via Python ReportLab for their records."* |
| **5:30 - 6:30** | Navigate to `/model-info` | *"On the Model Specs page, we display our academic benchmarks. We trained on the genuine University of the Aegean EMSCAD dataset with 17,880 postings, achieving 88.5% precision and 96.9% ROC-AUC on a held-out test split of 3,175 postings."* |
| **6:30 - 7:00** | Switch to Admin Account (`admin@hireshield.ai`) | *"Finally, our admin console demonstrates role-based access control, user account suspension toggling, and live platform security audit trails."* |

---

## Part 3: Frequently Asked Viva Questions & Answers

### Q1: Why did you use a hybrid model instead of an LLM like GPT-4 or Gemini for scoring?
**Answer**:  
*"While LLMs excel at conversational generation, they have three significant drawbacks for high-stakes screening: non-deterministic scoring (different scores for the same text), latency and high API cost, and hallucination risks. By training a calibrated Support Vector Classifier on 17,880 verified job postings combined with deterministic red-flag rules, we achieve reproducible, zero-cost, millisecond-latency risk assessments with mathematically verifiable precision and recall."*

### Q2: What dataset did you use, and how did you prevent target leakage?
**Answer**:  
*"We used the Employment Scam Aegean Dataset (EMSCAD), published by researchers at the University of the Aegean (Vidros et al., 2017). To guarantee zero data leakage, we partitioned the data into an 80% train split and 20% test split before performing any text processing or vocabulary fitting. The Sublinear TF-IDF Vectorizer was fitted strictly on the 12,696 training samples, and the 3,175 test samples were evaluated only after training was finalized."*

### Q3: How did you handle the severe class imbalance in the dataset?
**Answer**:  
*"Fraudulent postings represent only ~4.8% of the dataset (a 19.6:1 imbalance). We addressed this by: (1) using Stratified K-Fold partitioning to preserve class proportions across all folds, (2) applying balanced class weighting in our classifiers to penalize misclassifications of the minority scam class, and (3) evaluating models using Scam Recall, Scam Precision, Scam F1, and PR-AUC (Precision-Recall AUC) rather than relying on misleading raw accuracy."*

### Q4: Why did Calibrated LinearSVC outperform Logistic Regression as your champion model?
**Answer**:  
*"Linear Support Vector Machines are exceptionally effective in high-dimensional sparse text spaces like TF-IDF n-grams (12,000 features). During 5-fold cross-validation, while Logistic Regression achieved 81.2% recall, its precision was only 68.6%. LinearSVC achieved 89.2% precision and 80.1% F1. In real-world recruitment screening, high precision is essential to avoid falsely penalizing legitimate employers."*

### Q5: How is user privacy protected in HireShield AI?
**Answer**:  
*"We implement data minimization: rather than archiving massive 25,000-character job descriptions permanently, we store a truncated 1,000-character excerpt. Furthermore, passwords are never stored in plaintext (salted BCrypt with 12 rounds is used), and database queries enforce strict tenant isolation so users can never view or delete another user's assessments."*
