# HireShield AI — Model Card: v1.0.0-emscad-nlp

## 1. Model Overview
- **Model Tag**: `v1.0.0-emscad-nlp`
- **Architecture**: Calibrated Linear Support Vector Classifier (`CalibratedClassifierCV(LinearSVC(class_weight='balanced'))`)
- **Feature Extraction**: Sublinear Term Frequency-Inverse Document Frequency (`TfidfVectorizer(ngram_range=(1,2), max_features=12000, sublinear_tf=True, stop_words='english')`)
- **Primary Task**: Binary risk classification of employment & internship postings (`0: Legitimate`, `1: Fraudulent / Scam`).
- **Release Date**: November 2026
- **Developer**: HireShield AI Engineering Team (M.Sc. IT Major Project)

---

## 2. Training Data & Leakage Prevention
- **Dataset**: University of the Aegean Employment Scam Aegean Dataset (EMSCAD).
- **Total Dataset Size**: 17,880 postings.
- **Deduplicated & Cleaned**: 15,871 postings.
- **Partition Methodology**: Stratified 80/20 train/test split.
  - **Train partition (`train.csv`)**: 12,696 records (570 Fraudulent [4.49%], 12,126 Legitimate [95.51%]).
  - **Held-out test partition (`test.csv`)**: 3,175 records (142 Fraudulent [4.47%], 3,033 Legitimate [95.53%]).
- **Leakage Prevention Guarantee**: All vectorizer vocabulary extraction and IDF weights were fitted strictly on the 12,696 training samples. The test partition was completely unseen until final evaluation.

---

## 3. Experimental Model Comparison (5-Fold Stratified Cross Validation on Train Split)

| Candidate Model | Scam Recall | Scam Precision | Scam F1-Score | ROC-AUC | Selection Decision |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Baseline: Logistic Regression (Balanced)** | 81.23% | 68.62% | 74.33% | 0.9761 | Baseline benchmark |
| **Champion: Calibrated LinearSVC (Sigmoid CV)** | **72.63%** | **89.25%** | **80.07%** | **0.9758** | **Selected (Superior F1 & low false alarms)** |

---

## 4. Final Evaluation Benchmarks (Held-out Test Partition, N = 3,175)

| Metric | Score | Interpretation |
| :--- | :--- | :--- |
| **Scam Precision** | **88.52%** | Out of all postings flagged by the model as fraudulent, 88.5% were true scams. |
| **Scam Recall** | **76.06%** | Model isolates 76.1% of fraudulent postings automatically without human review. |
| **Scam F1-Score** | **81.82%** | Balanced harmonic performance under severe class imbalance (~4.5% prevalence). |
| **ROC-AUC** | **0.9691** | Near-perfect separation capability across all discrimination thresholds. |
| **PR-AUC (Avg Precision)** | **0.8681** | Area under precision-recall curve, robust indicator under rare scam occurrences. |
| **Overall Accuracy** | **98.49%** | Correct classification across both legitimate and scam classes. |

### Confusion Matrix Breakdown
```
                       Predicted Legitimate (0)   Predicted Fraudulent (1)
Actual Legitimate (0)         3,019 (TN)                  14 (FP)
Actual Fraudulent (1)            34 (FN)                 108 (TP)
```
- **False Positive Rate**: $14 / 3,033 = 0.46\%$ (Virtually zero friction for legitimate employers).
- **False Negative Mitigation**: Remaining covert scams missed by pure lexical NLP are caught by HireShield's deterministic red-flag rules (e.g. upfront deposit demands, Telegram chat requirements, free email domain mismatches).

---

## 5. Top Predictive Lexical Indicators

### Scam Predictive Tokens (Positive Weights):
1. `entry level` / `data entry`
2. `wire transfer` / `payroll`
3. `administrative assistant`
4. `flexible hours` / `work from home`
5. `earn daily` / `immediate opening`

### Legitimate Predictive Tokens (Negative Weights):
1. `bachelor degree` / `computer science`
2. `responsibilities include` / `collaborate with`
3. `software development` / `continuous integration`
4. `qualifications` / `competitive salary`
5. `benefits package` / `401k`

---

## 6. Limitations & Ethical Considerations
1. **Temporal Shift**: Scammers continually modify vernacular (e.g. pivoting to Web3 tasks or WhatsApp task scams). Pure statistical NLP must be augmented with deterministic rules.
2. **Advisory Purpose**: Predictions are calibrated statistical risk indicators. No posting or organization is declared definitively fraudulent by the software without independent user verification.
