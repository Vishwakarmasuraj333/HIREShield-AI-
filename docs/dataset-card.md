# HireShield AI — Dataset Card: EMSCAD Benchmark

## 1. Dataset Summary & Academic Provenance
- **Dataset Name**: Employment Scam Aegean Dataset (EMSCAD)
- **Primary Research Laboratory**: Information & Communication Systems Security (ICCS) Laboratory, Department of Information and Communication Systems Engineering, University of the Aegean, Karlovassi, Samos, Greece.
- **Reference Publication**:
  > Vidros, S., Kolias, C., Kambourakis, G., & Akoglu, L. (2017). *Automatic Detection of Online Recruitment Frauds: Characteristics, Methods, and a Public Dataset*. **Future Generation Computer Systems**, 81, 132-147. DOI: [10.1016/j.future.2017.10.043](https://doi.org/10.1016/j.future.2017.10.043)
- **Curated Time Horizon**: 2012 to 2014.
- **Acquisition Source**: Public university repository and Kaggle Open Benchmark Repository.
- **License**: Creative Commons Attribution 4.0 International (CC-BY 4.0) / Academic Research Open License.

---

## 2. Dataset Structure & Partition Statistics

### A. Raw EMSCAD Corpus
- **Total Published Postings**: 17,880
- **Total Features**: 18 columns (textual, boolean, and categorical metadata)
- **Class Label Distribution (`fraudulent`)**:
  - `0 (Legitimate Postings)`: 17,014 records (95.16%)
  - `1 (Fraudulent / Scam Postings)`: 866 records (4.84%)
- **Class Imbalance Ratio**: **19.65 : 1** (Legitimate to Fraudulent)

### B. Preprocessing & Deduplication
To prevent inflated evaluation metrics caused by duplicate postings or automated repostings, a rigorous text sanitization and deduplication pipeline was applied:
1. Stripped HTML markup and inline CSS formatting.
2. Normalized external URLs (`http\S+`, `www\S+`) to generic space tokens.
3. Collapsed redundant whitespaces and lowercased the composite text corpus (`title`, `company_profile`, `description`, `requirements`, `benefits`).
4. Filtered trivial postings with fewer than 20 characters.
5. Deduplicated on `full_text_clean`.
- **Deduplicated Record Count**: **15,871 postings** (1,999 redundant duplicates removed).

### C. Partitioning & Leakage Prevention Guarantee
A stratified 80/20 train/test split was established with a fixed random seed (`RANDOM_SEED = 42`):

| Partition | Record Count | Fraudulent (Class 1) | Legitimate (Class 0) | Fraud Prevalence |
| :--- | :--- | :--- | :--- | :--- |
| **Training Split (`train.csv`)** | 12,696 | 570 | 12,126 | 4.49% |
| **Held-Out Test Split (`test.csv`)** | 3,175 | 142 | 3,033 | 4.47% |
| **Total Processed** | 15,871 | 712 | 15,159 | 4.49% |

> [!IMPORTANT]
> **Zero Data Leakage Verification**: Set intersection between `train.csv` and `test.csv` text content is strictly **0** records (`len(set(train) & set(test)) == 0`). All TF-IDF vocabulary extraction, IDF weight estimation, and sublinear scaling were computed exclusively on the 12,696 training samples. The 3,175 held-out test samples were evaluated only after champion model serialization.

---

## 3. Schema & Feature Description

| Field Name | Type | Description | Handling in HireShield AI |
| :--- | :--- | :--- | :--- |
| `job_id` | Integer | Unique identifier assigned by EMSCAD collectors | Retained for data provenance and indexing |
| `title` | String | Advertised job or internship position title | Included in composite NLP corpus & displayed in UI |
| `company_profile` | String | Organization background, overview, and history | Included in composite NLP corpus |
| `description` | String | Core responsibilities, scope of work, and daily duties | Primary text input for TF-IDF feature extraction |
| `requirements` | String | Candidate qualifications, certifications, and skills | Included in composite NLP corpus |
| `benefits` | String | Compensation perks, health insurance, paid leave | Included in composite NLP corpus |
| `telecommuting` | Binary (0/1) | Whether role allows remote work | Analyzed in exploratory data inspection |
| `has_company_logo` | Binary (0/1) | Whether company logo was present in original listing | Analyzed during feature correlation |
| `has_questions` | Binary (0/1) | Presence of candidate pre-screening questions | Correlated with legitimate corporate hiring |
| `employment_type` | Categorical | Full-time, Part-time, Contract, Temporary, Other | Used for contextual display |
| `required_experience` | Categorical | Internship, Entry level, Associate, Mid-Senior, Executive | Mapped to user analysis options |
| `required_education` | Categorical | High School, Bachelor's Degree, Master's Degree, Unspecified | Educational prerequisite metadata |
| `fraudulent` | Binary (0/1) | Ground-truth verification (`0: Legitimate`, `1: Fraudulent`) | Ground-truth target label |

---

## 4. Key Predictive Textual Features

### Top 10 Fraud-Associated N-Grams (Highest Positive Weights):
1. `link` (Weight: +6.31) — Directing candidates off-platform to external untracked portals.
2. `earn` (Weight: +4.25) — Disproportionate promises of immediate financial gain.
3. `data entry` (Weight: +4.17) — Classic bait role targeting students and remote job seekers.
4. `accion` (Weight: +4.02) — High-pressure urgency calls.
5. `assistant` (Weight: +3.91) — Vaguely defined administrative roles.
6. `aptitude staffing` (Weight: +3.85) — Aggressive recruitment agencies.
7. `timejob` (Weight: +3.73) — Flexible/part-time lures.
8. `offshore` (Weight: +3.62) — Remote entity shielding true geographic origin.
9. `high school` (Weight: +3.58) — Roles intentionally requiring minimal qualifications.
10. `receptionist` (Weight: +3.23) — Front-desk lure roles.

### Top 10 Legitimate-Associated N-Grams (Highest Negative Weights):
1. `recruitment` (Weight: -3.55) — Professional corporate talent acquisition language.
2. `english` (Weight: -3.50) — Standardized corporate workplace language requirement.
3. `companies` (Weight: -3.38) — Multi-client enterprise engagement context.
4. `growing` (Weight: -3.32) — Organic organizational scaling terminology.
5. `web` (Weight: -3.31) — Technical domain context.
6. `digital` (Weight: -3.07) — Modern agency / product operations.
7. `software` (Weight: -2.94) — Technical specifications and tooling.
8. `client` (Weight: -2.84) — Structured business deliverables.
9. `right` (Weight: -2.67) — Cultural fit and standards.
10. `team` (Weight: -2.62) — Collaborative cross-functional workplace structure.

---

## 5. Known Limitations & Temporal Shift
1. **Temporal Horizon Shift**: EMSCAD listings date to 2012–2014. Modern online fraud schemes increasingly incorporate newer communication platforms (e.g. Telegram channels, WhatsApp task groups, cryptocurrency deposits).
2. **Hybrid Solution**: Because statistical NLP alone cannot anticipate newly invented scam scripts, HireShield AI deliberately augments this ML model with deterministic cybersecurity rules (upfront registration fee checks, banking OTP requests, public email domain mismatches).
