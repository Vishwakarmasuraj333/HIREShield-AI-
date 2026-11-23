"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { AnimatedSecurityBackground } from "../../components/backgrounds/AnimatedSecurityBackground";
import { PageHeader } from "../../components/PageHeader";
import {
  Search,
  Sparkles,
  AlertCircle,
  Building2,
  Mail,
  DollarSign,
  Briefcase,
  Globe,
  FileText,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Cpu,
  Layers
} from "lucide-react";

export default function AnalyzePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [salaryText, setSalaryText] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Quick fill samples for presentation
  const handleLoadSampleScam = () => {
    setJobTitle("Remote Python & Data Research Intern");
    setCompanyName("Apex Global Technologies LLC");
    setCompanyUrl("http://apex-quick-jobs.xyz");
    setRecruiterEmail("hiring.apexglobal@gmail.com");
    setSalaryText("$45/hour (Immediate Joining)");
    setExperienceLevel("Fresher / No experience required");
    setJobDescription(
      "We are urgently hiring remote data entry assistants and Python research interns! " +
      "Immediate 100% guaranteed selection with no interview required. " +
      "Work from home at your convenience. Selected candidates are required to transfer a " +
      "mandatory $150 refundable onboarding laptop security deposit via gift card or crypto " +
      "before work tools are dispatched. Contact our recruiter directly on Telegram @ApexHiring."
    );
    setError(null);
  };

  const handleLoadSampleLegit = () => {
    setJobTitle("Junior Software Engineer (Python/FastAPI)");
    setCompanyName("Datadog Cloud Solutions Inc.");
    setCompanyUrl("https://datadoghq.com/careers");
    setRecruiterEmail("recruiting@datadoghq.com");
    setSalaryText("$85,000 - $95,000 per year");
    setExperienceLevel("Entry to Associate (1-2 years)");
    setJobDescription(
      "Datadog is looking for a Junior Software Engineer to join our core backend metrics team. " +
      "Responsibilities include developing RESTful APIs using Python and FastAPI, writing automated " +
      "unit tests with Pytest, and optimizing PostgreSQL database queries. Requirements: B.Sc. or M.Sc. " +
      "in Computer Science or related technical discipline, foundational understanding of data structures, " +
      "and familiarity with Git and Docker. Comprehensive health coverage, 401(k) matching, and parental leave."
    );
    setError(null);
  };

  const handleClearForm = () => {
    setJobTitle("");
    setCompanyName("");
    setCompanyUrl("");
    setRecruiterEmail("");
    setSalaryText("");
    setExperienceLevel("");
    setJobDescription("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (jobDescription.trim().length < 20) {
      setError("Please provide a more substantial job description (at least 20 characters) for accurate lexical inference.");
      return;
    }

    setLoading(true);

    try {
      const assessment = await api.createAssessment({
        job_title: jobTitle,
        company_name: companyName || undefined,
        company_url: companyUrl || undefined,
        recruiter_email: recruiterEmail || undefined,
        salary_text: salaryText || undefined,
        experience_level: experienceLevel || undefined,
        job_description: jobDescription,
      });

      router.push(`/assessments/${assessment.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to analyze posting. Please verify inputs.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 max-w-4xl mx-auto space-y-6">
      <AnimatedSecurityBackground variant="minimal" />

      {/* Header */}
      <PageHeader
        badge="Threat Analysis Engine"
        title="Job & Internship Risk Workspace"
        description="Submit opportunity details to trigger real-time lexical inference and deterministic cyber-risk heuristics."
      />

      {/* Presentation Quick-Fill Bar */}
      <div className="bg-white/95 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-xs font-bold text-zinc-700">Viva Demonstration Presets:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleLoadSampleScam}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200/90 bg-rose-50/70 hover:bg-rose-100/80 text-rose-800 text-xs font-semibold transition-all shadow-sm active:scale-95"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Load Scam Sample</span>
          </button>

          <button
            type="button"
            onClick={handleLoadSampleLegit}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200/90 bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-800 text-xs font-semibold transition-all shadow-sm active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Load Safe Sample</span>
          </button>

          {(jobTitle || jobDescription) && (
            <button
              type="button"
              onClick={handleClearForm}
              className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              title="Reset form fields"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-rose-50/90 border border-rose-200 flex items-start gap-3 text-xs text-rose-800 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Analysis halted: </span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Main Analysis Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/95 backdrop-blur-sm rounded-2xl border border-zinc-200/80 shadow-card p-6 sm:p-8 space-y-6"
      >
        {/* Section 1: Position & Organization */}
        <div className="space-y-4">
          <div className="border-b border-zinc-100 pb-2.5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>Position & Recruiter Identity</span>
            </h2>
            <span className="text-[11px] text-zinc-400">Step 1 of 2</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="job-title" className="block text-xs font-semibold text-zinc-700">
                Job / Internship Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="job-title"
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Remote Python Developer Intern or Research Assistant"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="company-name" className="block text-xs font-semibold text-zinc-700">
                Company Name
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="company-name"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Apex Global Solutions"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="company-url" className="block text-xs font-semibold text-zinc-700">
                Company Website / Portal URL
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="company-url"
                  type="url"
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.target.value)}
                  placeholder="https://company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="recruiter-email" className="block text-xs font-semibold text-zinc-700">
                Recruiter Contact Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="recruiter-email"
                  type="email"
                  value={recruiterEmail}
                  onChange={(e) => setRecruiterEmail(e.target.value)}
                  placeholder="recruiter@domain.com or @gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="salary-text" className="block text-xs font-semibold text-zinc-700">
                Offered Compensation / Stipend
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="salary-text"
                  type="text"
                  value={salaryText}
                  onChange={(e) => setSalaryText(e.target.value)}
                  placeholder="e.g. $35/hr or $65,000/year"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Full Job Description */}
        <div className="space-y-2 pt-2">
          <div className="border-b border-zinc-100 pb-2.5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Full Opportunity Description & Outreach Text</span>
            </h2>
            <span
              className={`text-[11px] font-mono ${
                jobDescription.length >= 20 ? "text-emerald-700 font-semibold" : "text-zinc-400"
              }`}
            >
              {jobDescription.length} characters (min 20)
            </span>
          </div>

          <p className="text-[11px] text-zinc-500">
            Paste the complete posting text, job responsibilities, interview communication, or Telegram/WhatsApp outreach message.
          </p>

          <textarea
            required
            rows={8}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job posting details here... Our model extracts TF-IDF n-grams (1-2) and cross-checks payment phrases, deceptive domains, and urgent hiring patterns."
            className="w-full p-4 text-sm rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all leading-relaxed font-sans"
          />
        </div>

        {/* Submit Bar */}
        <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Cpu className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Calibrated Linear SVC (EMSCAD trained) + 7 Rule Engines</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:scale-[0.99] text-white font-medium text-sm transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Running Risk Engine...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span>Execute Risk Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
