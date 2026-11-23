"""
Independent ML Audit and Reproduction Script for HireShield AI.
Recalculates all held-out metrics from scratch.
"""
import os
import joblib
import pandas as pd
import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, confusion_matrix, classification_report, brier_score_loss
)
from sklearn.calibration import calibration_curve

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
ARTIFACTS_DIR = os.path.join(BASE_DIR, "artifacts")

raw_path = os.path.join(DATA_DIR, "fake_job_postings.csv")
train_path = os.path.join(DATA_DIR, "train.csv")
test_path = os.path.join(DATA_DIR, "test.csv")
model_path = os.path.join(ARTIFACTS_DIR, "model.joblib")
vec_path = os.path.join(ARTIFACTS_DIR, "vectorizer.joblib")

print("=== 1. DATASET VERIFICATION ===")
raw_df = pd.read_csv(raw_path)
print(f"Raw EMSCAD: {len(raw_df)} total rows. Columns: {len(raw_df.columns)}")
print(f"Raw Fraudulent: {raw_df['fraudulent'].sum()} ({raw_df['fraudulent'].mean()*100:.2f}%)")

train_df = pd.read_csv(train_path)
print(f"Train split: {len(train_df)} rows (Fraud: {train_df['fraudulent'].sum()}, Legit: {(train_df['fraudulent']==0).sum()})")

test_df = pd.read_csv(test_path)
print(f"Test split: {len(test_df)} rows (Fraud: {test_df['fraudulent'].sum()}, Legit: {(test_df['fraudulent']==0).sum()})")
print(f"Total train+test: {len(train_df) + len(test_df)}")

# Check text overlap / leakage between train and test
train_texts = set(train_df["full_text_clean"].dropna())
test_texts = set(test_df["full_text_clean"].dropna())
overlap = train_texts.intersection(test_texts)
print(f"Train/Test text overlap count: {len(overlap)} (Zero leakage verified: {len(overlap) == 0})")

print("\n=== 2. ARTIFACT AND PIPELINE VERIFICATION ===")
model = joblib.load(model_path)
vectorizer = joblib.load(vec_path)
print(f"Model type: {type(model)}")
print(f"Model estimator: {getattr(model, 'estimator', getattr(model, 'base_estimator', 'N/A'))}")
print(f"Calibration method: {getattr(model, 'method', 'N/A')}")
print(f"Vectorizer vocabulary size: {len(vectorizer.vocabulary_)}")
print(f"Vectorizer ngram_range: {vectorizer.ngram_range}")
print(f"Vectorizer sublinear_tf: {vectorizer.sublinear_tf}")

print("\n=== 3. INDEPENDENT RE-EVALUATION ON HELD-OUT TEST SET ===")
X_test = test_df["full_text_clean"].fillna("")
y_test = test_df["fraudulent"].values

X_test_vec = vectorizer.transform(X_test)
y_pred = model.predict(X_test_vec)
y_prob = model.predict_proba(X_test_vec)[:, 1]

acc = accuracy_score(y_test, y_pred)
rec = recall_score(y_test, y_pred, pos_label=1)
prec = precision_score(y_test, y_pred, pos_label=1)
f1 = f1_score(y_test, y_pred, pos_label=1)
roc_auc = roc_auc_score(y_test, y_prob)
pr_auc = average_precision_score(y_test, y_prob)
cm = confusion_matrix(y_test, y_pred)
tn, fp, fn, tp = cm.ravel()

print(f"Test samples: {len(y_test)}")
print(f"Confusion Matrix: TN={tn}, FP={fp}, FN={fn}, TP={tp}")
print(f"Accuracy:       {acc:.6f} (Reported: ~0.9849)")
print(f"Scam Precision: {prec:.6f} (Reported: ~0.8852)")
print(f"Scam Recall:    {rec:.6f} (Reported: ~0.7606)")
print(f"Scam F1:        {f1:.6f} (Reported: ~0.8182)")
print(f"ROC-AUC:        {roc_auc:.6f} (Reported: ~0.9691)")
print(f"PR-AUC (Avg P): {pr_auc:.6f} (Reported: ~0.8681)")

print("\n=== 4. PROBABILITY CALIBRATION VERIFICATION ===")
brier = brier_score_loss(y_test, y_prob)
prob_true, prob_pred = calibration_curve(y_test, y_prob, n_bins=5)
print(f"Brier score (lower is better, 0 is perfect): {brier:.6f}")
print("Calibration curve (predicted bin prob vs empirical true fraction):")
for p_pred, p_true in zip(prob_pred, prob_true):
    print(f"  Predicted prob ~ {p_pred:.4f} -> Actual fraud fraction = {p_true:.4f}")

print("\n=== 5. CHECK BACKEND CONSISTENCY ===")
import sys
sys.path.insert(0, os.path.abspath(os.path.join(BASE_DIR, "..", "backend")))
from app.ml.inference import ml_engine
test_sample = test_df.iloc[0]
backend_pred = ml_engine.predict(
    job_title=test_sample.get("title", ""),
    company_name=test_sample.get("company_profile", "")[:50],
    job_description=test_sample.get("description", "")
)
print("Backend prediction sample result:")
print(backend_pred)
print(f"Backend loaded status: {ml_engine.is_loaded}")
print(f"Backend model version: {backend_pred.get('model_version')}")
