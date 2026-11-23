"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
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
  ArrowRight
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (jobDescription.trim().length < 20) {
      setError("Please provide a more substantial job description (at least 20 characters).");
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
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Title & Quick Fill Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Job & Internship Risk Workspace
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Input job details to run ML lexical classification and deterministic cyber-risk heuristics.
          </p>
        </div>

        {/* Presentation Sample Fillers */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSampleScam}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>Load Scam Sample</span>
          </button>
          <button
            type="button"
            onClick={handleLoadSampleLegit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Load Safe Sample</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Analysis Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-zinc-500" />
            <span>Position & Opportunity Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-700">
                Job / Internship Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Remote Python Intern or Frontend Developer"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Company Name</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Company Website / Portal URL</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="url"
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.target.value)}
                  placeholder="https://company.com"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Recruiter Contact Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={recruiterEmail}
                  onChange={(e) => setRecruiterEmail(e.target.value)}
                  placeholder="recruiter@company.com or @gmail.com"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Offered Salary / Stipend</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={salaryText}
                  onChange={(e) => setSalaryText(e.target.value)}
                  placeholder="e.g. $25/hr or $60,000/yr"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Job Description Text Area */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-700">
              Full Job Description / Outreach Message <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-zinc-400">
              {jobDescription.length} characters
            </span>
          </div>
          <textarea
            required
            rows={8}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job advertisement, requirements, email outreach text, or internship details here..."
            className="w-full p-3.5 text-sm rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors leading-relaxed"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
          <span className="text-xs text-zinc-500 hidden sm:block">
            Screened via Calibrated TF-IDF Classifier & Red-Flag Rules
          </span>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50 ml-auto"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Running Assessment...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span>Execute Risk Assessment</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
