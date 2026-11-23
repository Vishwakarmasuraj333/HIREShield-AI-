"""
Model Training Script for HireShield AI.
Compares a Baseline (Balanced Logistic Regression) vs Alternative (Calibrated LinearSVC).
Performs Stratified 5-Fold Cross Validation on the training split only.
Selects and serializes the champion model artifact, vectorizer, and metadata.
"""
import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timezone
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.metrics import classification_report, f1_score, precision_score, recall_score, roc_auc_score

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
ARTIFACTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "artifacts"))
TRAIN_PATH = os.path.join(DATA_DIR, "train.csv")

RANDOM_SEED = 42

def train():
    if not os.path.exists(TRAIN_PATH):
        print(f"Error: Training data not found at {TRAIN_PATH}. Run prepare_dataset.py first.")
        sys.exit(1)

    os.makedirs(ARTIFACTS_DIR, exist_ok=True)

    print("Loading training dataset...")
    train_df = pd.read_csv(TRAIN_PATH)
    train_df["full_text_clean"] = train_df["full_text_clean"].fillna("")
    
    X_train_raw = train_df["full_text_clean"]
    y_train = train_df["fraudulent"].values

    print(f"Training samples: {len(X_train_raw):,} (Fraudulent: {y_train.sum():,})")

    # 1. Feature Extraction: Sublinear TF-IDF (Fitted strictly on train partition)
    print("\n[Step 1] Fitting TF-IDF Vectorizer on training partition...")
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=12000,
        sublinear_tf=True,
        stop_words="english",
        min_df=3,
        max_df=0.90
    )
    X_train_vec = vectorizer.fit_transform(X_train_raw)
    print(f"Vocabulary size: {len(vectorizer.vocabulary_):,} features")

    # 2. Define Candidate Models
    models = {
        "Baseline_LogisticRegression": LogisticRegression(
            C=2.0,
            class_weight="balanced",
            max_iter=1000,
            solver="liblinear",
            random_state=RANDOM_SEED
        ),
        "Alternative_CalibratedLinearSVC": CalibratedClassifierCV(
            estimator=LinearSVC(class_weight="balanced", random_state=RANDOM_SEED, max_iter=2000, C=1.0),
            method="sigmoid",
            cv=5
        )
    }

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_SEED)
    scoring = {
        "f1_scam": "f1",
        "precision_scam": "precision",
        "recall_scam": "recall",
        "roc_auc": "roc_auc"
    }

    comparison_results = {}

    print("\n[Step 2] Executing 5-Fold Stratified Cross-Validation on Training Split:")
    print("-" * 75)
    print(f"{'Model Name':<35} | {'Scam Rec':<9} | {'Scam Prec':<9} | {'Scam F1':<9} | {'ROC-AUC':<8}")
    print("-" * 75)

    for name, clf in models.items():
        cv_res = cross_validate(clf, X_train_vec, y_train, cv=cv, scoring=scoring, n_jobs=-1)
        mean_rec = np.mean(cv_res["test_recall_scam"])
        mean_prec = np.mean(cv_res["test_precision_scam"])
        mean_f1 = np.mean(cv_res["test_f1_scam"])
        mean_auc = np.mean(cv_res["test_roc_auc"])

        comparison_results[name] = {
            "cv_recall_mean": float(mean_rec),
            "cv_precision_mean": float(mean_prec),
            "cv_f1_mean": float(mean_f1),
            "cv_roc_auc_mean": float(mean_auc)
        }
        print(f"{name:<35} | {mean_rec*100:>8.2f}% | {mean_prec*100:>8.2f}% | {mean_f1*100:>8.2f}% | {mean_auc:>8.4f}")
    print("-" * 75)

    # Champion selection: Calibrated LinearSVC or Logistic Regression based on Scam F1
    best_name = max(comparison_results, key=lambda k: comparison_results[k]["cv_f1_mean"])
    print(f"\nChampion Model Selected: {best_name} (Highest 5-Fold Cross-Validation Scam F1)")

    # 3. Fit Champion on complete training set
    champion_clf = models[best_name]
    print(f"Fitting final {best_name} on all training data...")
    champion_clf.fit(X_train_vec, y_train)

    # 4. Extract Top Explainability Features using Logistic Regression coefficients
    baseline_lr = models["Baseline_LogisticRegression"]
    baseline_lr.fit(X_train_vec, y_train)
    feature_names = np.array(vectorizer.get_feature_names_out())
    coefs = baseline_lr.coef_[0]

    top_fraud_indices = np.argsort(coefs)[-25:][::-1]
    top_legit_indices = np.argsort(coefs)[:25]

    top_fraud_features = [{"feature": str(feature_names[i]), "weight": float(coefs[i])} for i in top_fraud_indices]
    top_legit_features = [{"feature": str(feature_names[i]), "weight": float(coefs[i])} for i in top_legit_indices]

    # 5. Serialize Artifacts
    model_path = os.path.join(ARTIFACTS_DIR, "model.joblib")
    vectorizer_path = os.path.join(ARTIFACTS_DIR, "vectorizer.joblib")
    metadata_path = os.path.join(ARTIFACTS_DIR, "metadata.json")

    joblib.dump(champion_clf, model_path)
    joblib.dump(vectorizer, vectorizer_path)

    metadata = {
        "model_version": "v1.0.0-emscad-nlp",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "algorithm": best_name,
        "dataset_name": "EMSCAD (University of the Aegean)",
        "train_samples": int(len(train_df)),
        "train_fraud_samples": int(y_train.sum()),
        "train_legit_samples": int((y_train == 0).sum()),
        "vocab_size": len(vectorizer.vocabulary_),
        "hyperparameters": champion_clf.get_params(),
        "cv_metrics": comparison_results,
        "top_scam_indicators": top_fraud_features[:15],
        "top_legitimate_indicators": top_legit_features[:15]
    }

    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2, default=str)

    print("\nTraining Artifacts Successfully Generated:")
    print(f"  - Model:      {model_path} ({os.path.getsize(model_path):,} bytes)")
    print(f"  - Vectorizer: {vectorizer_path} ({os.path.getsize(vectorizer_path):,} bytes)")
    print(f"  - Metadata:   {metadata_path}")

if __name__ == "__main__":
    train()
