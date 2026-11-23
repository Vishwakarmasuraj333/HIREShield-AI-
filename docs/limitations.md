# HireShield AI — Technical Limitations & Ethical Considerations

## 1. Technical & Architectural Limitations

### A. Temporal Vocabulary Shift
- **Context**: The machine learning model is trained on the University of the Aegean Employment Scam Aegean Dataset (EMSCAD), collected between 2012 and 2014.
- **Limitation**: Recruitment fraud evolves rapidly. Emerging fraudulent schemes (e.g., decentralized cryptocurrency tasks, WhatsApp daily "YouTube like" tasks, Web3 token payouts, and deepfake AI video interviews) employ vocabulary not represented in the 2014 corpus.
- **Mitigation in HireShield AI**: The system combines the statistical ML model with deterministic heuristic rules (checking for crypto/USDT payments, Telegram redirects, and equipment deposits) to capture modern fraud vectors even when lexical n-grams fail.

### B. Syntactic vs Active DNS Domain Verification
- **Context**: The `DOMAIN_MISMATCH` indicator evaluates textual discrepancy between the recruiter's email domain and the claimed company website URL.
- **Limitation**: In the current local deployment, the engine performs syntactic parsing (`urllib.parse`) rather than live active DNS MX record verification or ICANN WHOIS domain age lookups. A newly registered lookalike domain (e.g., `datad0g-careers.com`) would not be caught by static string matching alone without active network WHOIS queries.
- **Future Enhancement**: Integrate real-time RDAP / WHOIS lookups to flag domains registered within the last 30–60 days.

### C. Input Length & Cold-Start Textual Sensitivity
- **Context**: TF-IDF requires sufficient lexical tokens to construct a sparse feature vector.
- **Limitation**: When presented with extremely brief outreach snippets (< 30 words), statistical NLP has limited context, resulting in conservative probabilities near the prior mean (~4.5%).
- **Mitigation in HireShield AI**: The application enforces a 20-character minimum threshold and relies on explicit heuristic triggers (e.g., presence of Telegram handles or registration fees) when descriptions are short.

### D. Monolingual English Scope
- **Context**: Feature extraction uses an English stop-word dictionary and was trained on English-language listings.
- **Limitation**: Job listings written in other languages (e.g., Hindi, Spanish, French, German) will not activate the English n-gram vocabulary and will default to base heuristic scoring.
- **Future Enhancement**: Deploy multilingual sentence transformers (e.g., `paraphrase-multilingual-MiniLM-L12-v2`) to support cross-lingual embedding spaces.

### E. In-Memory PDF Synthesis vs Object Store Persistence
- **Context**: PDF dossiers are synthesized on-demand in-memory via ReportLab (`io.BytesIO`) and streamed directly over HTTP.
- **Limitation**: Under extreme concurrent load (>1,000 simultaneous downloads), server CPU utilization could spike.
- **Future Enhancement**: Cache pre-rendered PDFs in an S3-compatible object storage layer (e.g., MinIO, AWS S3) with pre-signed download URLs.

---

## 2. Ethical Considerations & Responsible AI Guardrails

### A. Decision-Support Aid vs Defamatory Adjudication
- **Ethical Mandate**: HireShield AI is explicitly architected and documented as an **intelligent decision-support screening aid**, not a definitive legal authority.
- **Guardrail**: The system never declares an organization or individual definitively guilty of fraud. Every assessment is framed as a "Risk Assessment Dossier" providing statistical probability and evidence indicators, accompanied by the mandatory academic disclaimer advising candidates to conduct independent verification.

### B. Protection of Legitimate Small Employers
- **Ethical Mandate**: Legitimate small businesses, startups, and solo consultants frequently use public email domains (`@gmail.com`) due to resource constraints.
- **Guardrail**: The risk engine is mathematically calibrated so that a public email domain alone **never** pushes a posting into the HIGH or CRITICAL risk tiers (combined score remains under 35.0, in the LOW/MODERATE band) unless accompanied by overt predatory signals such as advance fee demands or premature banking OTP requests.

### C. Data Privacy & Minimization
- **Ethical Mandate**: Users often paste unedited recruitment messages that may contain personal recruiter or candidate contact details.
- **Guardrail**: 
  1. The database truncates raw input text to an essential 1,000-character excerpt (`description_excerpt`) to prevent storing unnecessary personal data.
  2. Users can permanently delete their assessment records at any time via `DELETE /api/v1/assessments/{id}`, which cascades to all child indicators.
  3. Strict tenant isolation ensures that no user can view or query another user's assessment history.
