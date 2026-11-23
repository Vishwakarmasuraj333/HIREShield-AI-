# EMSCAD (Employment Scam Aegean Dataset) — Dataset Card

## 1. Provenance & Attribution
- **Dataset Name**: Employment Scam Aegean Dataset (EMSCAD)
- **Original Authors**: Vidros, S., Kolias, C., Kambourakis, G., & Akoglu, L. (2014)
- **Institution**: Laboratory of Information & Communication Systems Security (ICCS), Department of Information and Communication Systems Engineering, University of the Aegean, Samos, Greece.
- **Reference Publication**: 
  - Vidros, S., Kolias, C., Kambourakis, G., & Akoglu, L. (2017). *Automatic Detection of Online Recruitment Frauds: Characteristics, Methods, and a Public Dataset*. Future Generation Computer Systems, 81, 132-147. DOI: [10.1016/j.future.2017.10.043](https://doi.org/10.1016/j.future.2017.10.043).
- **Public Benchmark Repositories**: University of the Aegean Repository, Kaggle Public Real/Fake Job Posting Prediction dataset.

## 2. Dataset Overview
- **Total Records**: 17,880 published job postings
- **Target Variable**: `fraudulent`
  - `0`: Legitimate opportunity (~17,014 records, 95.16%)
  - `1`: Fraudulent / Scam opportunity (~866 records, 4.84%)
- **Class Imbalance**: Approximately 19.6 : 1 ratio of legitimate to fraudulent postings.

## 3. Schema & Key Fields
| Column Name | Type | Description | Handling in HireShield AI |
| :--- | :--- | :--- | :--- |
| `job_id` | Integer | Unique identifier | Used for indexing and provenance |
| `title` | String | Job position title | Concatenated to text corpus |
| `company_profile` | String | Overview of hiring company | Concatenated to text corpus |
| `description` | String | Core responsibilities & duties | Concatenated to text corpus |
| `requirements` | String | Qualifications and skills | Concatenated to text corpus |
| `benefits` | String | Perks, compensation perks | Concatenated to text corpus |
| `telecommuting` | Binary (0/1) | Whether role is remote | Feature analysis |
| `has_company_logo` | Binary (0/1) | Whether company logo exists | Metadata feature |
| `has_questions` | Binary (0/1) | Screening questions present | Metadata feature |
| `employment_type` | Categorical | Full-time, Part-time, Contract, etc. | Metadata context |
| `required_experience` | Categorical | Entry level, Associate, Mid-Senior | Metadata context |
| `fraudulent` | Binary (0/1) | Ground-truth fraud label | Supervised learning target |

## 4. Leakage Prevention & Partition Methodology
- Split strategy: Stratified 80/20 train/test split.
- `train.csv`: 80% partition (~14,304 records). All vectorizers and vocabularies are fitted **exclusively** on this partition.
- `test.csv`: 20% partition (~3,576 records). Held-out untouched evaluation set.

## 5. Ethical Considerations & Limitations
- **Temporal Distribution Shift**: Postings originated in 2012–2014. Modern scams often incorporate newer channels (e.g., Telegram, cryptocurrency, AI interview bots).
- **Hybrid Necessity**: Because purely statistical NLP may miss newly minted scam scripts, HireShield AI marries this ML model with explicit deterministic rule checks (fees, crypto, bank details, domain anomalies).
