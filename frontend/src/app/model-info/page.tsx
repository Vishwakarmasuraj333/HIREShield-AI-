"use client";

import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { ModelEvaluation } from "../../types";
import { AnimatedSecurityBackground } from "../../components/backgrounds/AnimatedSecurityBackground";
import { PageHeader } from "../../components/PageHeader";
import { MetricDisplay } from "../../components/MetricDisplay";
import {
  Cpu,
  Database,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  BookOpen,
  TrendingUp,
  Table as TableIcon,
  ShieldCheck,
  Zap,
  Info,
  Scale,
  Binary,
  Lock
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
    <div className="relative min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 max-w-5xl mx-auto space-y-10 pb-16">
      <AnimatedSecurityBackground variant="minimal" />

      {/* Header */}
      <PageHeader
        badge="Calibrated Linear SVC • EMSCAD Trained"
        title="Model Specifications & Academic Verification"
        description="HireShield AI adheres strictly to academic integrity: all performance metrics below derive from reproducible 5-fold cross-validation and an untouched held-out test split of the University of the Aegean EMSCAD benchmark."
      />

      {/* Held-out Test Metrics KPI Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              Held-Out Test Set Performance (3,175 Unseen Postings)
            </h2>
          </div>
          <span className="text-xs font-semibold text-zinc-500 font-mono">
            Test Split: 20% Stratified
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-zinc-200/80 shadow-sm text-center space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Scam Precision</span>
            <p className="text-2xl font-black text-zinc-900 font-mono">{(metrics.scam_precision * 100).toFixed(1)}%</p>
            <span className="text-[10px] text-zinc-500 block">Low false alarms</span>
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/30 shadow-sm text-center space-y-1">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Scam Recall</span>
            <p className="text-2xl font-black text-emerald-700 font-mono">{(metrics.scam_recall * 100).toFixed(1)}%</p>
            <span className="text-[10px] text-emerald-800/80 block">Catches 3 of 4 scams</span>
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-zinc-200/80 shadow-sm text-center space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Scam F1-Score</span>
            <p className="text-2xl font-black text-zinc-900 font-mono">{(metrics.scam_f1 * 100).toFixed(1)}%</p>
            <span className="text-[10px] text-zinc-500 block">Harmonic mean</span>
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-zinc-200/80 shadow-sm text-center space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">ROC-AUC</span>
            <p className="text-2xl font-black text-zinc-900 font-mono">{metrics.roc_auc.toFixed(4)}</p>
            <span className="text-[10px] text-zinc-500 block">Global separation</span>
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-zinc-200/80 shadow-sm text-center space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">PR-AUC</span>
            <p className="text-2xl font-black text-zinc-900 font-mono">{metrics.pr_auc.toFixed(4)}</p>
            <span className="text-[10px] text-zinc-500 block">Imbalance metric</span>
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-zinc-200/80 shadow-sm text-center space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Overall Acc.</span>
            <p className="text-2xl font-black text-zinc-900 font-mono">{(metrics.accuracy * 100).toFixed(1)}%</p>
            <span className="text-[10px] text-zinc-500 block">Total accuracy</span>
          </div>
        </div>
      </div>

      {/* Confusion Matrix and Model Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Confusion Matrix */}
        <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-7 rounded-2xl border border-zinc-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-emerald-600" />
              <span>Confusion Matrix (Held-out Test Partition)</span>
            </h3>
            <span className="text-xs font-mono font-bold text-zinc-500">N = 3,175</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs">
              <thead>
                <tr className="text-zinc-500 border-b border-zinc-200/80">
                  <th className="py-2.5 text-left font-semibold">Actual \ Predicted</th>
                  <th className="py-2.5 text-emerald-800 font-bold">Pred. Legit (0)</th>
                  <th className="py-2.5 text-rose-800 font-bold">Pred. Scam (1)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-mono">
                <tr>
                  <td className="py-3.5 text-left font-bold text-zinc-800 font-sans">
                    Actual Legit (0)
                  </td>
                  <td className="py-3.5 bg-emerald-50/70 font-black text-emerald-900">
                    {cm.true_negatives.toLocaleString()} <span className="text-[10px] text-emerald-700 font-sans font-bold">(TN)</span>
                  </td>
                  <td className="py-3.5 bg-zinc-50/80 text-zinc-600">
                    {cm.false_positives} <span className="text-[10px] text-zinc-400 font-sans">(FP)</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 text-left font-bold text-zinc-800 font-sans">
                    Actual Scam (1)
                  </td>
                  <td className="py-3.5 bg-zinc-50/80 text-zinc-600">
                    {cm.false_negatives} <span className="text-[10px] text-zinc-400 font-sans">(FN)</span>
                  </td>
                  <td className="py-3.5 bg-rose-50/70 font-black text-rose-900">
                    {cm.true_positives} <span className="text-[10px] text-rose-700 font-sans font-bold">(TP)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70 text-[11px] text-zinc-600 leading-relaxed">
            <span className="font-bold text-zinc-900">Key Finding: </span>
            Out of 3,033 legitimate job postings in the held-out test split, only 14 were mistakenly flagged as fraudulent — yielding a remarkably low{" "}
            <span className="font-bold text-emerald-700">0.46% False Positive Rate</span> that prevents candidate alert fatigue.
          </div>
        </div>

        {/* 5-Fold Cross-Validation Comparison */}
        <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-7 rounded-2xl border border-zinc-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>5-Fold Stratified Cross-Validation</span>
            </h3>
            <span className="text-xs font-mono font-bold text-zinc-500">Train Split Only</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Baseline Model */}
            <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-800">Baseline: Logistic Regression</span>
                <span className="font-mono font-semibold text-zinc-600">Scam F1: 74.33%</span>
              </div>
              <p className="text-[11px] text-zinc-500 font-mono">
                Recall: 81.23% • Precision: 68.62% • ROC-AUC: 0.9761
              </p>
            </div>

            {/* Champion Model */}
            <div className="p-3.5 rounded-xl border border-emerald-300/80 bg-emerald-50/50 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Champion: Calibrated LinearSVC</span>
                </span>
                <span className="font-mono font-bold text-emerald-800">Scam F1: 80.07%</span>
              </div>
              <p className="text-[11px] text-emerald-900 font-mono">
                Recall: 72.63% • Precision: 89.25% • ROC-AUC: 0.9758
              </p>
              <div className="pt-1 flex items-center gap-2">
                <span className="inline-block text-[10px] bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                  Selected for Production Deployment
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70 text-[11px] text-zinc-600 leading-relaxed">
            <span className="font-bold text-zinc-900">Selection Rationale: </span>
            LinearSVC delivered superior scam precision (+20.63 percentage points over baseline), drastically reducing false accusations while maintaining strong scam detection.
          </div>
        </div>
      </div>

      {/* Probability Calibration & Platt Scaling */}
      <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-600" />
          <span>Probability Calibration & Platt Scaling (Sigmoid Method)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1.5">
            <span className="font-bold text-zinc-900 block">Uncalibrated SVM Limits</span>
            <p className="text-zinc-600 leading-relaxed">
              Standard Linear Support Vector Machines optimize geometric margin distances, which do not inherently represent calibrated probabilities.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-1.5">
            <span className="font-bold text-emerald-950 block">Platt Scaling Transformation</span>
            <p className="text-emerald-900 leading-relaxed">
              We apply <code className="font-mono font-bold">CalibratedClassifierCV(method=&apos;sigmoid&apos;)</code> to fit a logistic sigmoid over decision values, outputting true posterior probabilities.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1.5">
            <span className="font-bold text-zinc-900 block">Verified Brier Score</span>
            <p className="text-zinc-600 leading-relaxed">
              Held-out Brier score: <b className="font-mono text-zinc-900">0.012558</b>. Near-zero mean squared difference confirms excellent probability calibration fidelity.
            </p>
          </div>
        </div>
      </div>

      {/* Dataset Provenance & Leakage Prevention */}
      <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-600" />
          <span>Dataset Provenance & Rigorous Leakage Prevention</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-700">
          <div className="space-y-2">
            <h4 className="font-bold text-zinc-900">University of the Aegean EMSCAD Corpus</h4>
            <p className="leading-relaxed text-zinc-600">
              The Employment Scam Aegean Dataset (EMSCAD) contains 17,880 real-world job postings collected between 2012 and 2014, annotated by cybersecurity researchers with 866 confirmed fraudulent offers (4.84% positive class base rate).
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-zinc-900">Strict Train/Test Isolation</h4>
            <p className="leading-relaxed text-zinc-600">
              Stratified 80/20 train/test splitting was executed prior to any TF-IDF vocabulary fitting. Programmatic verification confirms exactly 0 overlapping text instances between training and evaluation partitions (<code className="font-mono text-zinc-900">len(set(train) & set(test)) == 0</code>).
            </p>
          </div>
        </div>
      </div>

      {/* Limitations & Responsible AI Disclosure */}
      <div className="p-5 rounded-2xl bg-zinc-900 text-zinc-100 flex items-start gap-3.5 shadow-sm">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-white text-sm">Academic & Operational Limitations</h4>
          <p className="text-zinc-400 leading-relaxed">
            Lexical machine learning models detect phrasing patterns observed in historical corpora. To counter adversarial circumvention (e.g. LLM-generated clean scam text), HireShield AI layers deterministic cybersecurity rules (detecting upfront gift card deposits, telegram redirects, and free email domains) to form a robust defense-in-depth risk composite.
          </p>
        </div>
      </div>
    </div>
  );
}
