# HireShield AI — 14-Slide M.Sc. IT Presentation Outline & Viva Guide

**Degree**: Master of Science in Information Technology (M.Sc. IT)  
**Project Title**: HireShield AI — Intelligent Job & Internship Risk Assessment Platform  
**Academic Year**: 2026–2027  
**Presentation Time**: 15 minutes (8 min slides + 7 min live demo + viva examination)  

---

## 1. 14-Slide Presentation Structure

### Slide 1: Title, Team & Project Identity
- **Project Title**: **HireShield AI: Hybrid Machine Learning & Heuristic Job Fraud Screening Platform**
- **Tagline**: *"Verify the opportunity. Understand the risk. Apply with confidence."*
- **Presented By**: [Team Members 1, 2, 3, 4]
- **Academic Department**: Department of Information Technology, Postgraduate Studies
- **Key Project Pillars**: Genuine Scikit-Learn ML Model, FastAPI Asynchronous Backend, Next.js 14 App Router UI, PostgreSQL/SQLite Persistence, ReportLab PDF Dossiers.

---

### Slide 2: Abstract
- **Context**: Exponential surge in deceptive recruitment postings, advance-fee training schemes, and identity harvesting targeting tertiary students and fresh graduates.
- **Contribution**: Design and independent verification of an explainable, full-stack risk decision-support platform.
- **Methodology**: Combines a Calibrated Linear Support Vector Classifier (trained on 17,880 EMSCAD benchmark records) with transparent deterministic red-flag heuristics.
- **Results**: Held-out test performance of **88.52% Scam Precision**, **76.06% Scam Recall**, **81.82% Scam F1**, and **0.9691 ROC-AUC** with an ultra-low 0.46% false positive rate.

---

### Slide 3: Problem Statement & Real-World Motivation
- **The Threat Landscape**:
  - Global recruitment fraud losses exceed $2 billion annually (FTC & Interpol cybercrime reports).
  - High proliferation of ghost internships demanding upfront "refundable training deposits" or "equipment fees".
  - Premature harvesting of Aadhaar/SSN, PAN, and banking details leading to synthetic identity theft.
- **Vulnerable Cohort**: University students, entry-level candidates, and remote gig seekers eager for opportunities.
- **Research Goal**: Construct an automated, cost-free, explainable software aid providing mathematically grounded risk evaluations before candidates submit personal data.

---

### Slide 4: Existing Systems & Their Inherent Limitations
| Approach | Critical Limitations |
| :--- | :--- |
| **Manual Investigation** | Labor-intensive, slow, requires deep cyber-hygiene knowledge that students typically lack. |
| **Generic Commercial LLMs** | Non-deterministic scoring (varying answers for identical text), hallucination risk, latency (>3s), expensive per-token API costs. |
| **Simple Keyword Matchers** | Inflexible, high false positives on legitimate technical postings, trivial for scammers to circumvent. |
| **HireShield AI Hybrid** | **Deterministic red flags + calibrated TF-IDF LinearSVC**: Reproducible scoring, millisecond inference, zero external API costs, mathematically verifiable metrics. |

---

### Slide 5: Proposed System Architecture & Objectives
- **System Architecture**: Decoupled 3-Tier Enterprise Web Application:
  1. **Presentation**: Next.js 14, React 18, Tailwind CSS, Recharts for responsive telemetry.
  2. **Application Service**: FastAPI (Python 3.12), Pydantic v2 schemas, PyJWT authentication, ReportLab PDF synthesis.
  3. **Data Layer**: SQLAlchemy ORM with multi-database support (zero-config SQLite for dev, PostgreSQL 15 for production).
- **Core Objectives**:
  - Deliver sub-second risk classification.
  - Enforce tenant-isolated access controls (users can only access their own assessments).
  - Guarantee traceable indicator explanations and downloadable PDF dossiers.

---

### Slide 6: Dataset Acquisition & Provenance
- **Dataset**: University of the Aegean Employment Scam Aegean Dataset (EMSCAD).
- **Primary Authors**: Vidros et al. (2017), *Future Generation Computer Systems*.
- **Volume & Characteristics**: 17,880 real-world job postings collected from international job boards.
- **Target Distribution**:
  - 17,014 Legitimate postings (95.16%)
  - 866 Fraudulent postings (4.84%)
  - **Severe Class Imbalance**: ~19.65 to 1 ratio.

---

### Slide 7: Preprocessing & Data Leakage Prevention
- **Text Normalization**: Stripping HTML tags, sanitizing URL links, lowercase normalization, whitespace compaction.
- **Deduplication**: Removed 1,999 exact textual duplicate postings &rarr; 15,871 clean unique records.
- **Strict Stratified 80/20 Partitioning**:
  - **Training Split (`train.csv`)**: 12,696 records (570 Fraudulent [4.49%], 12,126 Legitimate [95.51%]).
  - **Held-Out Test Split (`test.csv`)**: 3,175 records (142 Fraudulent [4.47%], 3,033 Legitimate [95.53%]).
- **Zero Leakage Verification**: Set intersection between train and test texts is strictly **0**. TF-IDF vocabulary (12,000 n-grams) fitted exclusively on `train.csv`.

---

### Slide 8: Machine Learning Methodology & Model Selection
- **Feature Pipeline**: Sublinear TF-IDF Vectorizer (`ngram_range=(1,2)`, `max_features=12000`, English stop-word filtering).
- **Experimental Model Comparison (5-Fold Stratified Cross-Validation on Training Split)**:

| Candidate Architecture | 5-Fold Scam Recall | 5-Fold Scam Precision | 5-Fold Scam F1 | 5-Fold ROC-AUC | Decision |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Baseline: Logistic Regression (Balanced)** | 81.23% | 68.62% | 74.33% | 0.9761 | High recall, lower precision |
| **Champion: Calibrated LinearSVC (Sigmoid)** | **72.63%** | **89.25%** | **80.07%** | **0.9758** | **Selected Champion (Superior F1 & low false alarms)** |

- **Why Calibrated LinearSVC?** Linear Support Vector Classifiers maximize margins in high-dimensional sparse spaces. Calibrated via Platt sigmoid scaling to output true statistical probabilities.

---

### Slide 9: Evaluation Results on Held-Out Test Set (N = 3,175)
- **Scam Precision**: **88.52%** (When the model flags a scam, it is correct in 9 out of 10 cases).
- **Scam Recall**: **76.06%** (Automatically isolates over 3 out of 4 deceptive listings).
- **Scam F1-Score**: **81.82%** (Robust harmonic mean under extreme 4.5% class prevalence).
- **ROC-AUC**: **0.9691** (Global discriminative power across all possible thresholds).
- **PR-AUC (Average Precision)**: **0.8681** (Exceeds baseline by >18 percentage points).
- **Overall Accuracy**: **98.49%**.

---

### Slide 10: Confusion Matrix & Error Analysis
```
                         Predicted Legitimate (0)   Predicted Fraudulent (1)
Actual Legitimate (0)           3,019 (TN)                  14 (FP)
Actual Fraudulent (1)              34 (FN)                 108 (TP)
```
- **False Positive Rate**: $14 / 3033 = 0.46\%$ (Minimal friction for legitimate recruiters).
- **False Negative Mitigation**: Covert scams missed by lexical n-grams alone are intercepted by HireShield's deterministic red-flag rules (e.g. upfront deposit demands, Telegram chat requirements, free email domain mismatches).

---

### Slide 11: The Hybrid Detection & Risk Assessment Engine
- **Balanced Scoring Formula**:
  $$\text{Base Score} = (0.50 \times \text{ML Probability} \times 100) + (0.50 \times \text{Heuristic Score})$$
- **Configured Deterministic Indicators**:
  1. `ADVANCE_PAYMENT_DEMAND`: Upfront laptop/training deposit demands (+45 pts, enforces floor &ge; 82).
  2. `SENSITIVE_DATA_SOLICITATION`: Premature banking/OTP/SSN requests (+35 pts, enforces floor &ge; 82).
  3. `PUBLIC_EMAIL_DOMAIN`: Free @gmail/@yahoo address for corporate employer (+25 pts).
  4. `UNOFFICIAL_INTERVIEW_CHANNEL`: Off-platform messaging via Telegram/WhatsApp (+20 pts).
  5. `GUARANTEED_OFFER_URGENCY`: "100% immediate hiring with no interview" (+20 pts).
  6. `DOMAIN_MISMATCH`: Recruiter email domain differs from corporate website (+15 pts).
  7. `ANONYMOUS_EMPLOYER`: Undisclosed employer name (+15 pts).
- **Reassuring Signals**: Detailed responsibilities, verified domains, absence of fee solicitations.

---

### Slide 12: Live Application Features & User Experience
- **Interactive Risk Gauge**: Visual SVG gauge with color-coded severity (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
- **Explainable Findings**: Itemized cards showing trigger severity and extracted textual evidence snippets.
- **Candidate Safety Checklist**: Actionable verification steps tailored to the detected risk profile.
- **Official PDF Risk Dossier**: Instant downloadable report generated via ReportLab with assessment UUID and cryptographic audit stamp.
- **User Dashboard & History**: Real-time distribution charts, keyword search, category filters, and CSV export.

---

### Slide 13: Automated Quality Assurance, Security & Privacy
- **100% Automated Pytest Suite**: 17 passing integration tests validating authentication, tenant isolation, rule triggers, ML inference, and admin RBAC.
- **Tenant Isolation**: User B receives HTTP `404 Not Found` when attempting to read, delete, or export User A's assessments.
- **Admin RBAC**: Administrative endpoints guarded by role checks; self-lockout prevention enforced.
- **Privacy Preservation**: Job descriptions truncated to 1,000-character excerpts in database storage.
- **Security Protections**: BCrypt salted password hashing (12 rounds), stateless JWT tokens, parameterized SQL via SQLAlchemy.

---

### Slide 14: Conclusion, Limitations & Future Scope
- **Conclusion**: HireShield AI successfully bridges academic natural language processing with practical cybersecurity, delivering a transparent, reproducible, production-ready solution.
- **Known Limitations**:
  - Temporal vocabulary drift in scam tactics.
  - Advisory decision-support system, not a definitive legal adjudication.
- **Future Enhancements**:
  - Real-time WHOIS domain age lookup and DNS MX record validation.
  - Chromium browser extension for inline scanning on LinkedIn and Indeed.
  - Multi-lingual text preprocessing for regional job boards.

---

## 2. Seven-Minute Live Demonstration Script

| Time | Stage | Action & Screen | Verbal Explanation & Examiner Highlights |
| :--- | :--- | :--- | :--- |
| **0:00 - 1:00** | Introduction | Landing Page (`localhost:3000`) | *"Respected examiners, welcome to HireShield AI. We designed this platform to combat online employment and internship fraud. Here on the landing page, we emphasize transparency with benchmark statistics and an illustrative comparison card contrasting scam patterns against safe listings."* |
| **1:00 - 2:00** | Authentication | Sign In (`/login`) & Dashboard | *"We log in as an authenticated user using JWT authentication with BCrypt password hashing. We land on the dashboard, which displays live aggregated analytics directly from our database: total scans, risk category breakdowns via Recharts, and recent activity."* |
| **2:00 - 3:30** | Assessment Workspace | `/analyze` & Load Scam Sample | *"Let's test the detection engine. We navigate to the Analysis Workspace and click 'Load Scam Sample'. This populates a deceptive listing soliciting a $150 refundable laptop onboarding deposit via Telegram. We click 'Execute Risk Assessment'."* |
| **3:30 - 4:45** | Explainable Results | `/assessments/[id]` | *"In under 200 milliseconds, our hybrid engine returns the evaluation: CRITICAL RISK (Score 82.0/100, Calibrated ML Scam Probability 55.9%). Notice the explainability: it flags the advance payment demand with the exact snippet, highlights the recruiter's free Gmail address, notes the Telegram redirect, and provides a customized safety checklist."* |
| **4:45 - 5:30** | Official PDF Export | Click Download Official PDF Dossier | *"The user can click 'Download Official PDF Dossier' to obtain a publication-grade vector PDF generated dynamically by Python ReportLab, featuring the unique assessment UUID, model version, and audit evidence."* |
| **5:30 - 6:15** | Persistence & Isolation | `/history` & Data Store | *"Navigating to History, the new record is persisted in the database. When we refresh, the data remains intact. If another user logs in, tenant isolation ensures they cannot access or delete this assessment (returning 404)."* |
| **6:15 - 7:00** | Model Specs & Admin Console | `/model-info` & `/admin` | *"Finally, our Model Specs page publishes our held-out test benchmarks on the 17,880-record EMSCAD dataset (88.5% precision, 96.9% ROC-AUC, full confusion matrix), and our Admin Console demonstrates user lifecycle management and platform audit trails."* |

---

## 3. Beginner-Friendly Viva Questions & Answers

### Q1: What is NLP and how does TF-IDF work in your project?
**Answer**:  
Natural Language Processing (NLP) is the field of computer science focused on enabling computers to understand and process human text. In our project, machine learning algorithms cannot read raw English words directly; they require numerical vectors.  
**TF-IDF** stands for *Term Frequency-Inverse Document Frequency*:
- **Term Frequency (TF)** measures how frequently a word occurs in a specific job description. If words like "deposit" or "wire transfer" appear repeatedly, their frequency increases.
- **Inverse Document Frequency (IDF)** diminishes the weight of common words that appear across almost all job postings (e.g. "job", "applicant", "work").
- **Sublinear TF** applies a logarithmic dampening ($1 + \log(\text{TF})$) so that an occurrence of 10 times does not exert 10 times the influence of a single occurrence. We extract 12,000 unigrams and bigrams (single words and two-word pairs) to capture phrases like "data entry" or "gift card".

---

### Q2: What is the difference between Precision and Recall, and why is Precision especially critical here?
**Answer**:  
- **Precision** answers: *"Of all the job postings our model flagged as fraudulent, what percentage were actually scams?"*
  $$\text{Precision} = \frac{\text{True Positives}}{\text{True Positives} + \text{False Positives}} = \frac{108}{108 + 14} = 88.52\%$$
- **Recall (Sensitivity)** answers: *"Of all the actual scams present in the dataset, what percentage did our model successfully catch?"*
  $$\text{Recall} = \frac{\text{True Positives}}{\text{True Positives} + \text{False Negatives}} = \frac{108}{108 + 34} = 76.06\%$$
- **Why Precision is Critical**: If a system produces high false alarms (poor precision), legitimate employers and startup founders are unfairly labeled as fraudsters, causing candidates to lose trust and ignore the tool. Our 88.52% precision ensures that when a scam alert is triggered, it is overwhelmingly credible.

---

### Q3: What is F1-score and why can't we just rely on raw Accuracy?
**Answer**:  
Raw Accuracy is misleading under **severe class imbalance**. In the EMSCAD dataset, 95.16% of postings are legitimate and only 4.84% are fraudulent. A naive "dummy" model that predicts every single job is legitimate would achieve **95.16% accuracy** while catching **0% of scams**!  
**F1-Score** is the harmonic mean of precision and recall:
$$\text{F1} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}} = 2 \times \frac{0.8852 \times 0.7606}{0.8852 + 0.7606} = 81.82\%$$
It cannot be inflated by the majority class and is only high if both precision and recall are strong.

---

### Q4: What does ROC-AUC and PR-AUC mean in your evaluation?
**Answer**:  
- **ROC-AUC (Receiver Operating Characteristic - Area Under Curve)** measures the model's ability to discriminate between legitimate and fraudulent listings across all possible classification thresholds. A score of 0.5 represents random guessing; our score of **0.9691** indicates outstanding separability.
- **PR-AUC (Precision-Recall Area Under Curve / Average Precision)** plots Precision against Recall across varying decision thresholds. Under severe class imbalance, PR-AUC is the gold standard benchmark because it focuses entirely on the minority scam class. Our PR-AUC of **0.8681** confirms strong performance without suffering false positive bloat.

---

### Q5: What is Data Leakage and how did you guarantee zero leakage?
**Answer**:  
**Data leakage** occurs when information from outside the training dataset (such as test set vocabulary or statistics) inadvertently leaks into the model during training, producing artificially high test scores that fail in production.  
We prevented leakage by:
1. Performing a stratified 80/20 train/test split **before** fitting any vectorizer or transformer.
2. Fitting the Sublinear TF-IDF Vectorizer **strictly** on the 12,696 training samples (`train.csv`).
3. Keeping the 3,175 test samples (`test.csv`) completely unseen until the final serialized model evaluation.
4. Verifying programmatically that the set intersection of text between train and test splits is **0**.

---

### Q6: What is Probability Calibration and why was it necessary for LinearSVC?
**Answer**:  
A standard Linear Support Vector Classifier outputs an unconstrained geometric distance (margin) from the separating hyperplane via `decision_function`, not a calibrated probability.  
To convert this raw margin into a trustworthy probability between 0.0 and 1.0 (e.g. "89% likelihood of fraud"), we used **Platt Scaling** via Scikit-Learn's `CalibratedClassifierCV(method="sigmoid", cv=5)`. This fits a logistic sigmoid function over the cross-validated decision margins so that predicted probabilities accurately match empirical scam prevalence.

---

### Q7: Why did you build a Hybrid Risk Engine instead of relying only on Machine Learning?
**Answer**:  
Statistical NLP models recognize lexical patterns that were present in historical training data. However, recruitment scammers continuously adapt their language—for instance, switching from email phishing to Telegram cryptocurrency tasks or remote typing deposits.  
By augmenting the ML model with **deterministic cybersecurity rules**, we catch overt red flags (e.g., upfront payment demands, OTP solicitations, free email domains) even if the scammer's vocabulary was never seen in the 2014 training dataset. The two layers complement each other: ML detects nuanced linguistic manipulation, while rules catch explicit predatory behaviors.
