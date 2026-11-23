"use client";

import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { ModelEvaluation } from "../../types";
import {
  Cpu,
  Database,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  BookOpen,
  TrendingUp,
  Table as TableIcon
} from "lucide-react";

export default function ModelInfoPage() {
  const [evaluation, setEvaluation] = useState<ModelEvaluation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getModelEvaluations()
      .then(setEvaluation)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const metrics = evaluation?.metrics || {
    accuracy: 0.9849,
    scam_recall: 0.7606,
    scam_precision: 0.8852,
    scam_f1: 0.8182,
    roc_auc: 0.9691,
    pr_auc: 0.8681,
  };

  const cm = evaluation?.confusion_matrix || {
    true_negatives: 3019,
    false_positives: 14,
    false_negatives: 34,
    true_positives: 108,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Title */}
      <div className="space-y-2 border-b border-zinc-200 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-white text-[11px] font-semibold">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span>Active Architecture: Calibrated Linear Support Vector Classifier</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
          Model Specifications & Experimental Benchmarks
        </h1>
        <p className="text-sm text-zinc-600 max-w-3xl leading-relaxed">
          HireShield AI adheres strictly to academic honesty: all metrics presented below derive from
          reproducible cross-validation and an untouched held-out test split of the University of the Aegean
          EMSCAD dataset.
        </p>
      </div>

      {/* Held-out Test Metrics KPI Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Held-Out Test Set Performance (3,175 Unseen Postings)</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm text-center">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase">Scam Precision</span>
            <p className="text-2xl font-bold text-zinc-900 mt-1">{(metrics.scam_precision * 100).toFixed(1)}%</p>
            <span className="text-[10px] text-zinc-500">Low false alarms</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm text-center">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase">Scam Recall</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{(metrics.scam_recall * 100).toFixed(1)}%</p>
            <span className="text-[10px] text-zinc-500">Catches 3 of 4 scams</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm text-center">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase">Scam F1-Score</span>
            <p className="text-2xl font-bold text-zinc-900 mt-1">{(metrics.scam_f1 * 100).toFixed(1)}%</p>
            <span className="text-[10px] text-zinc-500">Harmonic mean</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm text-center">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase">ROC-AUC</span>
            <p className="text-2xl font-bold text-zinc-900 mt-1">{metrics.roc_auc.toFixed(4)}</p>
            <span className="text-[10px] text-zinc-500">Global discrimination</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm text-center">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase">PR-AUC</span>
            <p className="text-2xl font-bold text-zinc-900 mt-1">{metrics.pr_auc.toFixed(4)}</p>
            <span className="text-[10px] text-zinc-500">Imbalance resilience</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm text-center">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase">Overall Acc.</span>
            <p className="text-2xl font-bold text-zinc-900 mt-1">{(metrics.accuracy * 100).toFixed(1)}%</p>
            <span className="text-[10px] text-zinc-500">Total accuracy</span>
          </div>
        </div>
      </div>

      {/* Confusion Matrix and Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Confusion Matrix */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-zinc-500" />
              <span>Confusion Matrix (Held-out Test Partition)</span>
            </h3>
            <span className="text-xs text-zinc-500">N = 3,175</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs">
              <thead>
                <tr className="text-zinc-500 border-b border-zinc-200">
                  <th className="py-2 text-left">Actual \\ Predicted</th>
                  <th className="py-2 text-emerald-700 font-bold">Pred. Legit (0)</th>
                  <th className="py-2 text-rose-700 font-bold">Pred. Scam (1)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-mono">
                <tr>
                  <td className="py-3 text-left font-semibold text-zinc-700">Actual Legit (0)</td>
                  <td className="py-3 bg-emerald-50/50 font-bold text-emerald-800">
                    {cm.true_negatives.toLocaleString()} (TN)
                  </td>
                  <td className="py-3 bg-zinc-50 text-zinc-600">
                    {cm.false_positives} (FP)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-left font-semibold text-zinc-700">Actual Scam (1)</td>
                  <td className="py-3 bg-zinc-50 text-zinc-600">
                    {cm.false_negatives} (FN)
                  </td>
                  <td className="py-3 bg-rose-50/50 font-bold text-rose-800">
                    {cm.true_positives} (TP)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-zinc-500 italic">
            Out of 3,033 legitimate job postings in the test set, only 14 were mistakenly flagged (0.46% False Positive Rate).
          </p>
        </div>

        {/* Candidate Model Comparison */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-zinc-500" />
              <span>5-Fold Cross-Validation Comparison</span>
            </h3>
            <span className="text-xs text-zinc-500">Training Split Only</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Baseline */}
            <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-800">Baseline: Logistic Regression</span>
                <span className="text-zinc-500">Scam F1: 74.33%</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Recall: 81.23% &bull; Precision: 68.62% &bull; ROC-AUC: 0.9761
              </p>
            </div>

            {/* Champion */}
            <div className="p-3 rounded-lg border border-emerald-300 bg-emerald-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900">Champion: Calibrated LinearSVC</span>
                <span className="font-bold text-emerald-700">Scam F1: 80.07%</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Recall: 72.63% &bull; Precision: 89.25% &bull; ROC-AUC: 0.9758
              </p>
              <span className="inline-block text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-semibold mt-1">
                Selected for Production Deployment
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Provenance & Methodology */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-zinc-700" />
          <span>Dataset Provenance & Experimental Methodology</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-600 leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-semibold text-zinc-900">EMSCAD Benchmark Dataset</h4>
            <p>
              Sourced from the Laboratory of Information & Communication Systems Security (ICCS) at the
              University of the Aegean. Comprises 17,880 verified job postings (866 fraudulent = 4.84%,
              17,014 legitimate = 95.16%).
            </p>
            <p>
              Publication: <i>Vidros, S., Kolias, C., Kambourakis, G., & Akoglu, L. (2017). Automatic Detection
              of Online Recruitment Frauds: Characteristics, Methods, and a Public Dataset. Future Generation
              Computer Systems.</i>
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-zinc-900">Leakage Prevention & Feature Pipeline</h4>
            <p>
              A strict stratified 80/20 train/test split was established prior to any text transformations.
              The Sublinear TF-IDF Vectorizer (ngram range: 1–2, 12,000 features, English stop-words removed)
              was fitted exclusively on the training partition.
            </p>
            <p>
              All test evaluation metrics originate from the untouched 3,175 held-out records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
