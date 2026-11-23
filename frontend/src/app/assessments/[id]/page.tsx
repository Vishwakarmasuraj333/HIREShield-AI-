"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../lib/api";
import { Assessment } from "../../../types";
import { RiskBadge } from "../../../components/RiskBadge";
import { RiskGauge } from "../../../components/RiskGauge";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { AssessmentDetailsSkeleton } from "../../../components/LoadingSkeleton";
import { EmptyState } from "../../../components/EmptyState";
import { AnimatedSecurityBackground } from "../../../components/backgrounds/AnimatedSecurityBackground";
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
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  AlertOctagon
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copiedExcerpt, setCopiedExcerpt] = useState(false);

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

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await api.deleteAssessment(assessmentId);
      router.push("/history");
    } catch (err: any) {
      alert("Failed to delete assessment: " + err.message);
      setDeleting(false);
      setShowDeleteConfirm(false);
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

  const handleCopyExcerpt = () => {
    if (!assessment) return;
    navigator.clipboard.writeText(assessment.description_excerpt);
    setCopiedExcerpt(true);
    setTimeout(() => setCopiedExcerpt(false), 2000);
  };

  if (loading || authLoading) {
    return (
      <div className="relative min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 max-w-4xl mx-auto space-y-6">
        <AnimatedSecurityBackground variant="minimal" />
        <AssessmentDetailsSkeleton />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="relative min-h-[calc(100vh-140px)] py-12 px-4 sm:px-6 max-w-md mx-auto">
        <AnimatedSecurityBackground variant="minimal" />
        <EmptyState
          icon={AlertTriangle}
          title="Assessment Record Unavailable"
          description={error || "The requested assessment record could not be found or has been removed."}
          actionHref="/history"
          actionLabel="Return to Assessment History"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 max-w-4xl mx-auto space-y-8 pb-16">
      <AnimatedSecurityBackground variant="minimal" />

      {/* Top Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-4">
        <Link
          href="/history"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors py-1"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>Back to Assessment History</span>
        </Link>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:scale-[0.99] text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
          >
            {downloading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating PDF Dossier...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Official PDF Dossier</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleting}
            className="p-2.5 rounded-xl border border-zinc-200/80 bg-white hover:border-rose-300 hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-all shadow-sm"
            title="Delete this assessment record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Posting Summary Header Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-zinc-400 tracking-wide">
              ID: {assessment.id} • {new Date(assessment.created_at).toLocaleString()}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              {assessment.job_title}
            </h1>
          </div>
          <RiskBadge category={assessment.risk_category} size="lg" />
        </div>

        {/* Metadata Chips */}
        <div className="flex flex-wrap items-center gap-y-2.5 gap-x-6 text-xs text-zinc-600 pt-3 border-t border-zinc-100">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-zinc-400 shrink-0" />
            <span>Company: <b className="text-zinc-800">{assessment.company_name || "Undisclosed"}</b></span>
          </div>

          {assessment.recruiter_email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>Contact: <b className="text-zinc-800">{assessment.recruiter_email}</b></span>
            </div>
          )}

          {assessment.salary_text && (
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>Stipend / Salary: <b className="text-zinc-800">{assessment.salary_text}</b></span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-zinc-400 shrink-0" />
            <span>Classifier: <b className="text-zinc-800">{assessment.model_version}</b></span>
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
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-zinc-900">
              Evidence-Based Risk Indicators
            </h2>
          </div>
          <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full font-mono">
            {assessment.indicators.length} Flagged
          </span>
        </div>

        {assessment.indicators.length > 0 ? (
          <div className="space-y-3">
            {assessment.indicators.map((ind, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-zinc-200/80 bg-zinc-50/60 hover:bg-zinc-50 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-xs sm:text-sm font-bold text-zinc-900">{ind.title}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      ind.severity === "CRITICAL"
                        ? "bg-rose-100 text-rose-800 border border-rose-200"
                        : ind.severity === "HIGH"
                        ? "bg-orange-100 text-orange-800 border border-orange-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {ind.severity}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">{ind.description}</p>
                {ind.evidence_snippet && (
                  <div className="text-[11px] font-mono text-zinc-800 bg-white p-2.5 rounded-lg border border-zinc-200/80 flex items-start gap-2 shadow-inner">
                    <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px] shrink-0 mt-0.5">
                      Flagged Snippet:
                    </span>
                    <span className="text-rose-900 bg-rose-50/70 px-1.5 py-0.5 rounded">
                      &ldquo;{ind.evidence_snippet}&rdquo;
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-xs font-semibold text-zinc-700">No Deceptive Cyber Indicators Flagged</p>
            <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
              This posting did not trigger heuristic red flags like upfront payment demands, unofficial messaging domains, or suspicious recruiter handles.
            </p>
          </div>
        )}
      </div>

      {/* Observed Positive Reassurance Signals */}
      {assessment.positive_signals && assessment.positive_signals.length > 0 && (
        <div className="bg-emerald-50/50 backdrop-blur-sm rounded-2xl border border-emerald-200/90 p-6 sm:p-8 space-y-3">
          <h2 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Observed Positive / Reassuring Signals</span>
          </h2>
          <ul className="space-y-2 text-xs text-emerald-900">
            {assessment.positive_signals.map((sig, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                <span className="leading-relaxed">{sig}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Candidate Action Checklist */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-emerald-600" />
          <span>Recommended Candidate Action Checklist</span>
        </h2>
        <ul className="space-y-2.5 text-xs text-zinc-700">
          {assessment.recommended_actions.map((act, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50/70 border border-zinc-100"
            >
              <span className="w-5 h-5 rounded-lg bg-zinc-200 text-zinc-800 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed font-medium text-zinc-800">{act}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Analyzed Description Excerpt */}
      <div className="bg-zinc-50/90 rounded-2xl border border-zinc-200/80 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
            Analyzed Job Description Excerpt
          </span>
          <button
            onClick={handleCopyExcerpt}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-[11px] font-medium text-zinc-700 transition-colors"
          >
            {copiedExcerpt ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-zinc-500" />
                <span>Copy Excerpt</span>
              </>
            )}
          </button>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-zinc-200/80 text-xs text-zinc-600 leading-relaxed font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
          {assessment.description_excerpt}
        </div>
      </div>

      {/* Academic Disclaimer */}
      <div className="p-4 rounded-xl bg-zinc-100/80 border border-zinc-200 text-[11px] text-zinc-600 leading-relaxed flex items-start gap-2.5">
        <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
        <div>
          <b className="text-zinc-800">Academic & Decision Support Disclaimer: </b>
          {assessment.disclaimer}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Permanently Delete Assessment?"
        message={`Are you sure you want to delete the risk assessment record for "${assessment.job_title}"? This action cannot be reversed and will remove the corresponding PDF dossier.`}
        confirmLabel={deleting ? "Deleting..." : "Delete Permanently"}
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
