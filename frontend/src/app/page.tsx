import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Lock,
  Cpu,
  FileText,
} from "lucide-react";
import { RiskBadge } from "../components/RiskBadge";

export default function LandingPage() {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto pt-6 sm:pt-12 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Trained on 17,880 Real-World Postings &bull; 96.9% ROC-AUC
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 tracking-tight leading-[1.15]">
          Verify the opportunity. <br />
          <span className="text-emerald-700">Understand the risk.</span> <br />
          Apply with confidence.
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
          HireShield AI evaluates employment postings and internship offers using calibrated
          natural language processing coupled with transparent red-flag heuristics to shield job seekers
          from recruitment fraud and identity theft.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/analyze"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm shadow-sm transition-all"
          >
            <Search className="w-4 h-4 text-emerald-400" />
            <span>Analyze a Job or Internship</span>
          </Link>
          <Link
            href="/model-info"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 font-medium text-sm transition-all"
          >
            <Cpu className="w-4 h-4 text-zinc-500" />
            <span>Inspect Model Benchmarks</span>
          </Link>
        </div>
      </section>

      {/* Illustrative Comparison Preview Card */}
      <section className="max-w-5xl mx-auto bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
            Illustrative Screening Comparison
          </span>
          <span className="text-xs text-zinc-500">Live Hybrid Engine Preview</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
          {/* Flagged Example */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <RiskBadge category="CRITICAL" />
              <span className="text-xs font-bold text-rose-600">Score: 92.5 / 100</span>
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-base">Remote Data Entry Assistant</h3>
              <p className="text-xs text-zinc-500">Purported Employer: Apex Global (via gmail.com)</p>
            </div>
            <div className="space-y-2 text-xs text-zinc-600 bg-rose-50/50 p-3 rounded-lg border border-rose-100">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><b>Advance Fee Demand:</b> Solicits $150 refundable laptop onboarding deposit.</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><b>Public Domain:</b> Recruiter contact uses unverified free @gmail.com address.</span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 italic">
              ML Classifier estimated 89.0% scam probability on semantic n-gram tokens.
            </p>
          </div>

          {/* Legitimate Example */}
          <div className="p-6 space-y-4 bg-emerald-50/20">
            <div className="flex items-center justify-between">
              <RiskBadge category="LOW" />
              <span className="text-xs font-bold text-emerald-700">Score: 14.2 / 100</span>
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-base">Junior Frontend Engineer</h3>
              <p className="text-xs text-zinc-500">CloudScale Systems (talent@cloudscale.io)</p>
            </div>
            <div className="space-y-2 text-xs text-zinc-600 bg-emerald-50/60 p-3 rounded-lg border border-emerald-100">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><b>Verified Domain:</b> Recruiter contact matches authoritative career portal.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><b>Zero Monetary Requests:</b> Structured duties, clear technical requirements.</span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 italic">
              ML Classifier estimated 4.0% scam probability with robust legitimate indicators.
            </p>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            How the Detection System Works
          </h2>
          <p className="text-sm text-zinc-600 max-w-xl mx-auto">
            A multi-layered defense mechanism uniting academic machine learning with practical cyber-hygiene rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-zinc-900">Genuine Machine Learning</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Trained and cross-validated on the authentic University of the Aegean EMSCAD corpus (17,880 listings). Evaluated on held-out test data achieving 88.5% scam precision.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-zinc-900">Transparent Rule Engine</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Deterministic checks flag upfront registration fees, banking OTP requests, Telegram redirects, and free email domain mismatches with concrete evidence snippets.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-zinc-900">Official PDF Risk Dossiers</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Export downloadable, publication-grade risk dossiers with assessment IDs, model versions, and verification checklists suitable for academic viva and records.
            </p>
          </div>
        </div>
      </section>

      {/* Responsible AI Disclaimer */}
      <section className="max-w-4xl mx-auto bg-zinc-50 border border-zinc-200 rounded-xl p-6 text-center space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
          Responsible AI & Academic Integrity Notice
        </h4>
        <p className="text-xs text-zinc-500 leading-relaxed">
          HireShield AI is an intelligent decision-support screening aid. It flags statistically anomalous language
          patterns and overt predatory behaviors. Users are advised to independently verify employer credentials,
          never send funds for job applications, and confirm offers through official corporate channels.
        </p>
      </section>
    </div>
  );
}
