"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../lib/api";
import { Assessment } from "../../../types";
import { RiskBadge } from "../../../components/RiskBadge";
import { RiskGauge } from "../../../components/RiskGauge";
import {
  ShieldAlert,
  Download,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  CheckSquare,
  Building2,
  Mail,
  DollarSign,
  Cpu,
  Info,
  ExternalLink
} from "lucide-react";

export default function AssessmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const assessmentId = params.id as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (assessmentId) {
      api.getAssessment(assessmentId)
        .then(setAssessment)
        .catch((err) => setError(err.message || "Failed to load assessment."))
        .finally(() => setLoading(false));
    }
  }, [assessmentId, authLoading, isAuthenticated, router]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this assessment record?")) {
      return;
    }

    setDeleting(true);
    try {
      await api.deleteAssessment(assessmentId);
      router.push("/history");
    } catch (err: any) {
      alert("Failed to delete assessment: " + err.message);
      setDeleting(false);
    }
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const filename = `HireShield-Report-${assessmentId.slice(0, 8)}.pdf`;
      await api.downloadReport(assessmentId, filename);
    } catch {
      const url = api.getReportDownloadUrl(assessmentId);
      window.open(url, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-6 bg-zinc-200 rounded w-48" />
        <div className="h-32 bg-white rounded-xl border border-zinc-200" />
        <div className="h-64 bg-white rounded-xl border border-zinc-200" />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-zinc-900">Assessment Record Unavailable</h2>
        <p className="text-xs text-zinc-500">{error || "The requested assessment could not be located."}</p>
        <Link
          href="/history"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to History</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <Link
          href="/history"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Assessment History</span>
        </Link>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>{downloading ? "Preparing PDF..." : "Download Official PDF Dossier"}</span>
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 rounded-lg border border-zinc-200 hover:border-rose-300 hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-colors"
            title="Delete record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Posting Summary Header */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono text-zinc-400">ID: {assessment.id}</span>
            <h1 className="text-2xl font-bold text-zinc-900 mt-0.5">{assessment.job_title}</h1>
          </div>
          <RiskBadge category={assessment.risk_category} size="lg" />
        </div>

        {/* Metadata Chips */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-zinc-400" />
            <span>Company: <b>{assessment.company_name || "Undisclosed"}</b></span>
          </div>

          {assessment.recruiter_email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-zinc-400" />
              <span>Contact: <b>{assessment.recruiter_email}</b></span>
            </div>
          )}

          {assessment.salary_text && (
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-zinc-400" />
              <span>Compensation: <b>{assessment.salary_text}</b></span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-zinc-400" />
            <span>Model Engine: <b>{assessment.model_version}</b></span>
          </div>
        </div>
      </div>

      {/* Risk Gauge & Probabilities */}
      <RiskGauge
        score={assessment.risk_score}
        category={assessment.risk_category}
        mlProbability={assessment.ml_probability}
      />

      {/* Detected Evidence-Based Risk Indicators */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Evidence-Based Risk Indicators</span>
          </h2>
          <span className="text-xs font-semibold text-zinc-500">
            {assessment.indicators.length} Flagged
          </span>
        </div>

        {assessment.indicators.length > 0 ? (
          <div className="space-y-3">
            {assessment.indicators.map((ind, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">{ind.title}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ind.severity === "CRITICAL"
                        ? "bg-rose-100 text-rose-800"
                        : ind.severity === "HIGH"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {ind.severity}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">{ind.description}</p>
                {ind.evidence_snippet && (
                  <div className="text-[11px] font-mono text-zinc-700 bg-white p-2 rounded border border-zinc-200">
                    <span className="text-zinc-400">Evidence: </span>
                    {ind.evidence_snippet}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-zinc-500">
            ✔ No high-risk anomalies or deceptive indicators were discovered in this text.
          </div>
        )}
      </div>

      {/* Reassuring Signals Observed */}
      {assessment.positive_signals && assessment.positive_signals.length > 0 && (
        <div className="bg-emerald-50/40 rounded-2xl border border-emerald-200 p-6 sm:p-8 space-y-3">
          <h2 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Observed Positive / Reassuring Signals</span>
          </h2>
          <ul className="space-y-2 text-xs text-emerald-800">
            {assessment.positive_signals.map((sig, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{sig}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Verification Action Checklist */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-zinc-700" />
          <span>Recommended Candidate Action Checklist</span>
        </h2>
        <ul className="space-y-2.5 text-xs text-zinc-700">
          {assessment.recommended_actions.map((act, idx) => (
            <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-zinc-50 border border-zinc-100">
              <span className="w-4 h-4 rounded bg-zinc-200 text-zinc-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{act}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Analyzed Description Excerpt */}
      <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-5 space-y-2">
        <span className="text-xs font-bold text-zinc-700">Analyzed Job Description Excerpt</span>
        <p className="text-xs text-zinc-600 leading-relaxed font-mono whitespace-pre-wrap">
          {assessment.description_excerpt}
        </p>
      </div>

      {/* Academic Disclaimer */}
      <div className="p-4 rounded-xl bg-zinc-100 border border-zinc-200 text-[11px] text-zinc-500 leading-relaxed flex items-start gap-2.5">
        <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
        <div>
          <b>Academic & Decision Support Disclaimer:</b> {assessment.disclaimer}
        </div>
      </div>
    </div>
  );
}
