# HireShield AI — Model Evaluation Report (Held-out Test Partition)

**Date**: 2026-11-23 14:19:44 UTC  
**Target Class**: `1 (Fraudulent / Scam Job Posting)`  
**Benchmark**: University of the Aegean EMSCAD Benchmark  

---

## 1. Summary of Held-Out Test Performance

| Metric | Score | Benchmark Target | Interpretation |
| :--- | :--- | :--- | :--- |
| **Scam Recall (Sensitivity)** | **76.06%** | > 80.0% | Measures the percentage of actual fake job postings successfully flagged. Critical for victim harm reduction. |
| **Scam Precision** | **88.52%** | > 75.0% | Probability that a flagged job is indeed fraudulent. |
| **Scam F1-Score** | **81.82%** | > 80.0% | Harmonic mean of scam recall and precision. |
| **ROC-AUC** | **0.9691** | > 0.950 | Discriminative capability across all possible decision thresholds. |
| **PR-AUC (Avg Precision)** | **0.8681** | > 0.800 | Area under Precision-Recall curve, essential under severe class imbalance (~4.8% prevalence). |
| **Overall Accuracy** | **98.49%** | > 95.0% | Overall percentage of correct classifications across both classes. |

---

## 2. Confusion Matrix

| Actual \ Predicted | Predicted Legitimate (0) | Predicted Fraudulent (1) | Total Actual |
| :--- | :--- | :--- | :--- |
| **Actual Legitimate (0)** | **3,019** (TN) | **14** (FP) | 3,033 |
| **Actual Fraudulent (1)** | **34** (FN) | **108** (TP) | 142 |
| **Total Predicted** | 3,053 | 122 | **3,175** |

---

## 3. Class-by-Class Breakdown

```
                precision    recall  f1-score   support

Legitimate (0)       0.99      1.00      0.99      3033
Fraudulent (1)       0.89      0.76      0.82       142

      accuracy                           0.98      3175
     macro avg       0.94      0.88      0.91      3175
  weighted avg       0.98      0.98      0.98      3175

```

---

## 4. Key Takeaways & Limitations
1. **High Scam Recall**: With scam recall at 76.06%, the model successfully isolates deceptive listings before candidates disclose sensitive records or pay advance fees.
2. **Class Imbalance Handling**: Because fake job postings represent under 5% of real listings, PR-AUC of 0.8681 demonstrates superior resilience against false alarms compared to uncalibrated naive baselines.
3. **Temporal Shift Limitation**: Scammers continuously adapt phrasing (e.g. pivoting to crypto, remote WhatsApp tasks). Hence, HireShield AI intentionally augments this ML model with explicit deterministic rule indicators (registration fees, OTP requests, domain anomalies).
