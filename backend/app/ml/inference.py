"""
Production Machine Learning Inference Service for HireShield AI.
Loads serialized TF-IDF vectorizer and champion classifier.
Provides calibrated probability estimation and local feature-contribution explainability.
"""
import os
import re
import json
import logging
from typing import Dict, Any, List, Optional, Tuple
import joblib
import numpy as np

logger = logging.getLogger(__name__)

class MLInferenceEngine:
    def __init__(self, artifacts_dir: Optional[str] = None):
        if artifacts_dir is None:
            artifacts_dir = os.path.abspath(
                os.path.join(os.path.dirname(__file__), "..", "..", "..", "ml", "artifacts")
            )
        self.artifacts_dir = artifacts_dir
        self.model = None
        self.vectorizer = None
        self.metadata = {}
        self.is_loaded = False
        self._load_artifacts()

    def _load_artifacts(self) -> bool:
        model_path = os.path.join(self.artifacts_dir, "model.joblib")
        vectorizer_path = os.path.join(self.artifacts_dir, "vectorizer.joblib")
        metadata_path = os.path.join(self.artifacts_dir, "metadata.json")

        if os.path.exists(model_path) and os.path.exists(vectorizer_path):
            try:
                self.model = joblib.load(model_path)
                self.vectorizer = joblib.load(vectorizer_path)
                if os.path.exists(metadata_path):
                    with open(metadata_path, "r", encoding="utf-8") as f:
                        self.metadata = json.load(f)
                self.is_loaded = True
                logger.info("Successfully loaded ML model & vectorizer from: %s", self.artifacts_dir)
                return True
            except Exception as exc:
                logger.error("Failed to load ML artifacts: %s", exc)
                self.is_loaded = False
                return False
        else:
            logger.warning("ML artifacts not found in %s. Inference will run in fallback heuristic mode until trained.", self.artifacts_dir)
            self.is_loaded = False
            return False

    def reload(self) -> bool:
        """Reloads artifacts dynamically after new training run."""
        return self._load_artifacts()

    @staticmethod
    def clean_text(text: str) -> str:
        if not isinstance(text, str):
            return ""
        text = re.sub(r"<[^>]+>", " ", text)
        text = re.sub(r"http\S+|www\S+", " ", text)
        text = re.sub(r"\s+", " ", text)
        return text.strip().lower()

    def predict(
        self,
        job_title: str,
        company_name: Optional[str],
        job_description: str,
        requirements: Optional[str] = None,
        benefits: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes ML inference over job text fields.
        Returns prediction (0/1), calibrated probability, model version, and top local contributing tokens.
        """
        raw_combined = f"{job_title} {company_name or ''} {job_description} {requirements or ''} {benefits or ''}"
        cleaned = self.clean_text(raw_combined)

        if not self.is_loaded or self.model is None or self.vectorizer is None:
            # Fallback if model hasn't been trained yet
            return {
                "prediction": 0,
                "probability": 0.05,
                "model_version": "fallback-pre-training",
                "top_contributing_features": [],
                "is_fallback": True
            }

        # Vectorize
        X_vec = self.vectorizer.transform([cleaned])

        # Prediction and Calibrated Probability
        pred = int(self.model.predict(X_vec)[0])
        if hasattr(self.model, "predict_proba"):
            proba = float(self.model.predict_proba(X_vec)[0][1])
        elif hasattr(self.model, "decision_function"):
            score = float(self.model.decision_function(X_vec)[0])
            proba = float(1.0 / (1.0 + np.exp(-score)))
        else:
            proba = float(pred)

        # Local Feature Contribution Extraction
        top_features = self._extract_local_explanations(X_vec)

        return {
            "prediction": pred,
            "probability": round(proba, 4),
            "model_version": self.metadata.get("model_version", "v1.0.0-emscad-nlp"),
            "top_contributing_features": top_features,
            "is_fallback": False
        }

    def _extract_local_explanations(self, X_vec) -> List[Dict[str, Any]]:
        """Identifies which active tokens in this specific text correlate strongly with fraud or legitimate patterns."""
        try:
            feature_names = self.vectorizer.get_feature_names_out()
            nonzero_indices = X_vec.nonzero()[1]
            if len(nonzero_indices) == 0:
                return []

            top_scam_vocab = {
                item["feature"]: item["weight"]
                for item in self.metadata.get("top_scam_indicators", [])
            }

            local_matches = []
            for idx in nonzero_indices:
                feat = feature_names[idx]
                if feat in top_scam_vocab:
                    local_matches.append({
                        "token": feat,
                        "weight": round(top_scam_vocab[feat], 4),
                        "signal": "scam_risk"
                    })

            # Sort by highest scam weight
            local_matches.sort(key=lambda x: x["weight"], reverse=True)
            return local_matches[:5]
        except Exception as exc:
            logger.warning("Could not extract local explanations: %s", exc)
            return []

# Singleton instance
ml_engine = MLInferenceEngine()
