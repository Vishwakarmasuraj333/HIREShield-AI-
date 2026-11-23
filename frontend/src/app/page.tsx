"use client";

import React, { useState } from "react";
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
  ChevronDown,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Building2,
  Mail,
  DollarSign
} from "lucide-react";
import { AnimatedSecurityBackground } from "../components/backgrounds/AnimatedSecurityBackground";
import { RiskBadge } from "../components/RiskBadge";
import { SectionReveal } from "../components/SectionReveal";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "How does HireShield AI evaluate job and internship listings?",
      a: "HireShield AI operates a dual-layer hybrid architecture. First, a Calibrated Linear Support Vector Classifier (trained on 17,880 listings from the University of the Aegean EMSCAD benchmark) extracts Sublinear TF-IDF lexical n-grams to estimate a statistical scam probability. Second, a deterministic cybersecurity rule engine checks for concrete red flags such as upfront fee solicitations, banking OTP requests, Telegram redirects, and free email domain anomalies.",
    },
    {
      q: "Why use a hybrid model instead of a generic commercial LLM like ChatGPT?",
      a: "Commercial generative LLMs introduce variable non-deterministic scoring (different scores for identical texts), hallucination risks, high per-token API costs, and significant network latency (>3s). HireShield AI runs completely locally, providing deterministic, mathematically reproducible risk scores in under 200ms at zero external API cost.",
    },
    {
      q: "Does a high risk score mean an employer is definitively a criminal fraudster?",
      a: "No. HireShield AI is explicitly designed as an intelligent decision-support screening aid, not a legally binding adjudication. A high or critical risk score indicates that the posting exhibits high-risk linguistic patterns or predatory behaviors (such as demanding payment). Candidates are advised to independently verify employer credentials via official corporate career sites.",
    },
    {
      q: "Are small businesses using Gmail accounts automatically marked as scams?",
      a: "No. The scoring algorithm assigns 25 heuristic points for a public email domain, but without overt predatory violations (such as payment demands or banking solicitations), the combined score remains under 35.0, placing the posting safely within the LOW or MODERATE risk band.",
    },
    {
      q: "Can candidates export an official assessment for academic or personal records?",
      a: "Yes. Every assessment generates an on-demand, publication-grade vector PDF dossier via Python ReportLab, featuring the unique assessment UUID, model version, risk gauge, detected evidence snippets, and a candidate safety checklist.",
    },
  ];

  return (
    <div className="relative min-h-screen space-y-20 sm:space-y-28 pb-20 overflow-hidden">
      {/* Animated Security Canvas Background */}
      <AnimatedSecurityBackground variant="landing" showScanLine={true} />

      {/* Hero Section */}
      <section className="relative pt-10 sm:pt-16 lg:pt-20 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-subtle animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Calibrated on 17,880 EMSCAD Postings &bull; 88.5% Scam Precision</span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-zinc-900 tracking-tight leading-[1.12]">
            Your Next Opportunity <br />
            <span className="text-emerald-700 underline decoration-emerald-200 decoration-wavy decoration-2 underline-offset-8">
              Deserves a Safety Check.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed pt-2">
            Analyze job descriptions, identify suspicious signals, and understand potential risks before sharing your information or paying recruitment fees.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            href="/analyze"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm shadow-card transition-all duration-150 hover:translate-y-[-1px]"
          >
            <Search className="w-4 h-4 text-emerald-400" />
            <span>Analyze a Job Description</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/90 hover:bg-zinc-50 border border-zinc-200/90 text-zinc-800 font-semibold text-sm shadow-subtle transition-all duration-150"
          >
            <span>Explore How It Works</span>
          </a>
        </div>

        {/* Illustrative Sample Preview Card (Explicitly Labeled) */}
        <div className="pt-8 max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 shadow-elevated overflow-hidden text-left">
            <div className="px-6 py-3.5 bg-zinc-50/90 border-b border-zinc-200/80 flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Illustrative Sample Assessment — Not Real Candidate Data</span>
              </span>
              <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                UUID: 8a4f9e12-sample
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">
                    Remote Python Data Entry & Research Assistant
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 mt-1">
                    <span>Company: Apex Global Technologies</span>
                    <span>&bull;</span>
                    <span>Contact: hiring.apex@gmail.com</span>
                    <span>&bull;</span>
                    <span>Offered: $45/hour</span>
                  </div>
                </div>
                <RiskBadge category="CRITICAL" size="lg" />
              </div>

              {/* Sample Indicators Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-900">Upfront Laptop Deposit</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-200 text-rose-800">CRITICAL</span>
                  </div>
                  <p className="text-[11px] text-rose-800 leading-relaxed">
                    Solicits a mandatory $150 refundable onboarding laptop security deposit via crypto or gift card.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-900">Public Recruiter Domain</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-200 text-orange-800">HIGH</span>
                  </div>
                  <p className="text-[11px] text-orange-800 leading-relaxed">
                    Recruiter contact uses free public email (@gmail.com) for a claimed corporate enterprise.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  <span>Calibrated ML Scam Probability: <b>89.2%</b> (LinearSVC)</span>
                </span>
                <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  Risk Severity: 92.5 / 100
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How the Platform Works (Section 1) */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 relative z-10">
        <SectionReveal className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            System Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            How HireShield AI Evaluates Postings
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto leading-relaxed">
            A three-step pipeline uniting statistical machine learning with deterministic cyber-risk heuristics.
          </p>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SectionReveal delayMs={100} className="bg-white p-7 rounded-2xl border border-zinc-200/90 shadow-card space-y-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-zinc-900">1. Text Ingestion & Parsing</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Job descriptions, employer names, website URLs, and recruiter emails are sanitized and parsed to eliminate formatting noise and target leakage.
            </p>
          </SectionReveal>

          <SectionReveal delayMs={200} className="bg-white p-7 rounded-2xl border border-zinc-200/90 shadow-card space-y-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-zinc-900">2. Hybrid Risk Analysis</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Our Calibrated Linear Support Vector Classifier scores semantic n-grams, while 7 deterministic rules check for fees, OTPs, Telegram links, and domain mismatches.
            </p>
          </SectionReveal>

          <SectionReveal delayMs={300} className="bg-white p-7 rounded-2xl border border-zinc-200/90 shadow-card space-y-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-zinc-900">3. Actionable Risk Dossier</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Candidates receive an itemized risk breakdown, safety verification checklist, reassuring positive signals, and a downloadable vector PDF dossier.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Detection Workflow & 7 Core Risk Indicators */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 relative z-10">
        <SectionReveal className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Explainable Defense
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            The 7 Configured Risk Indicators
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto leading-relaxed">
            Every flag produces traceable evidence rather than arbitrary black-box scoring.
          </p>
        </SectionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              code: "ADVANCE_PAYMENT_DEMAND",
              sev: "CRITICAL",
              title: "Upfront Fee or Deposit Demand",
              desc: "Solicitation of training fees, equipment deposits, or registration charges before hiring.",
            },
            {
              code: "SENSITIVE_DATA_SOLICITATION",
              sev: "CRITICAL",
              title: "Premature Banking or ID Harvest",
              desc: "Requesting bank account numbers, OTPs, or government IDs before formal contracts.",
            },
            {
              code: "PUBLIC_EMAIL_DOMAIN",
              sev: "HIGH",
              title: "Public Recruiter Email Domain",
              desc: "Using generic providers (@gmail.com) while claiming to represent established corporations.",
            },
            {
              code: "UNOFFICIAL_INTERVIEW_CHANNEL",
              sev: "HIGH",
              title: "Informal Chat-Based Recruitment",
              desc: "Directing applicants exclusively to personal messaging apps like Telegram or WhatsApp.",
            },
            {
              code: "GUARANTEED_OFFER_URGENCY",
              sev: "HIGH",
              title: "Unrealistic Guarantees & Pressure",
              desc: "Guaranteed 100% placement with zero technical interview and artificial urgency.",
            },
            {
              code: "DOMAIN_MISMATCH",
              sev: "MEDIUM",
              title: "Recruiter Email Domain Mismatch",
              desc: "Recruiter contact address does not correspond with the verified corporate website URL.",
            },
            {
              code: "ANONYMOUS_EMPLOYER",
              sev: "MEDIUM",
              title: "Concealed or Anonymous Entity",
              desc: "Posting conceals the true legal name of the hiring entity, impeding verification.",
            },
          ].map((item, idx) => (
            <SectionReveal key={item.code} delayMs={idx * 60} className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-zinc-400 font-bold">{item.code}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.sev === "CRITICAL"
                      ? "bg-rose-100 text-rose-800"
                      : item.sev === "HIGH"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {item.sev}
                </span>
              </div>
              <h3 className="text-sm font-bold text-zinc-900">{item.title}</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">{item.desc}</p>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* Model Transparency & Academic Provenance */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-elevated p-8 sm:p-12 space-y-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-zinc-100 pb-8">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Academic Provenance & Benchmarks
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                Held-Out Evaluation on EMSCAD Benchmark
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Evaluated on 3,175 untouched held-out postings from the University of the Aegean Employment Scam Aegean Dataset (EMSCAD). Zero data leakage between partitions.
              </p>
            </div>

            <Link
              href="/model-info"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-subtle shrink-0 transition-colors"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Inspect Complete Model Card</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase">Scam Precision</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-mono mt-1">88.5%</p>
              <span className="text-[10px] text-zinc-500">Low false alarms</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase">Scam Recall</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono mt-1">76.1%</p>
              <span className="text-[10px] text-zinc-500">Isolates 3 of 4 scams</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase">Scam F1-Score</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-mono mt-1">81.8%</p>
              <span className="text-[10px] text-zinc-500">Harmonic mean</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase">ROC-AUC</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-mono mt-1">0.9691</p>
              <span className="text-[10px] text-zinc-500">Discrimination</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase">PR-AUC</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-mono mt-1">0.8681</p>
              <span className="text-[10px] text-zinc-500">Imbalance resilience</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase">False Positive Rate</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono mt-1">0.46%</p>
              <span className="text-[10px] text-zinc-500">14 / 3,033 legit</span>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 relative z-10">
        <SectionReveal className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Common Inquiries
          </span>
          <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto">
            Clear, honest answers about machine learning methodology, scoring, and data safety.
          </p>
        </SectionReveal>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-zinc-200/90 shadow-subtle overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-zinc-900 hover:text-emerald-700 transition-colors"
                aria-expanded={openFaq === idx}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                    openFaq === idx ? "transform rotate-180 text-emerald-600" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Responsible AI Disclaimer Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="p-6 rounded-2xl bg-zinc-100/90 border border-zinc-200/90 text-center space-y-2 text-xs text-zinc-600">
          <span className="font-bold uppercase tracking-wider text-zinc-800 text-[11px] block">
            Responsible AI & Academic Integrity Notice
          </span>
          <p className="leading-relaxed max-w-2xl mx-auto">
            HireShield AI is an intelligent decision-support screening aid. It flags statistically anomalous language patterns and overt predatory behaviors. Users are advised to independently verify employer credentials, never send funds for job applications, and confirm offers through official corporate channels.
          </p>
        </div>
      </section>
    </div>
  );
}
