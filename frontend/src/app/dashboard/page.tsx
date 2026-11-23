"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { AnalyticsOverview } from "../../types";
import { RiskBadge } from "../../components/RiskBadge";
import { PageHeader } from "../../components/PageHeader";
import { MetricDisplay } from "../../components/MetricDisplay";
import { DashboardSkeleton } from "../../components/LoadingSkeleton";
import { EmptyState } from "../../components/EmptyState";
import { AnimatedSecurityBackground } from "../../components/backgrounds/AnimatedSecurityBackground";
import {
  ShieldAlert,
  Search,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  History,
  ArrowRight,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building2,
  BarChart3,
  FileText
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      api.getAnalyticsOverview()
        .then(setAnalytics)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || loading) {
    return (
      <div className="relative min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 max-w-6xl mx-auto space-y-6">
        <AnimatedSecurityBackground variant="minimal" />
        <DashboardSkeleton />
      </div>
    );
  }

  const chartColors: Record<string, string> = {
    LOW: "#10B981",       // emerald
    MODERATE: "#F59E0B",  // amber
    HIGH: "#F97316",      // orange
    CRITICAL: "#E11D48",  // rose
  };

  const pieData = analytics?.categories
    .filter((c) => c.count > 0)
    .map((c) => ({
      name: `${c.category} Risk`,
      value: c.count,
      category: c.category,
    })) || [];

  const totalScans = analytics?.total_assessments || 0;

  return (
    <div className="relative min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
      <AnimatedSecurityBackground variant="dashboard" />

      {/* Header */}
      <PageHeader
        badge="Active Security Workspace"
        title="Assessment Dashboard"
        description={`Logged in as ${user?.full_name || "User"} (${user?.email}) • Role: ${user?.role || "STUDENT"}`}
        actions={
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs shadow-sm transition-colors"
          >
            <Search className="w-4 h-4 text-emerald-400" />
            <span>Scan New Opportunity</span>
          </Link>
        }
      />

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricDisplay
          label="Total Scans"
          value={analytics?.total_assessments || 0}
          subtitle="All opportunities evaluated"
          icon={TrendingUp}
          variant="neutral"
        />

        <MetricDisplay
          label="Critical Risk"
          value={analytics?.critical_risk_count || 0}
          subtitle="Severe threat detected"
          icon={AlertOctagon}
          variant="rose"
        />

        <MetricDisplay
          label="High Risk"
          value={analytics?.high_risk_count || 0}
          subtitle="Substantial indicators"
          icon={AlertTriangle}
          variant="amber"
        />

        <MetricDisplay
          label="Low / Safe Risk"
          value={analytics?.low_risk_count || 0}
          subtitle="Verified legitimate patterns"
          icon={CheckCircle2}
          variant="emerald"
        />
      </div>

      {/* Main Content Layout */}
      {totalScans === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No Job Assessments Recorded Yet"
          description="Your screening workspace is ready. Paste a job advertisement, recruiter message, or internship posting to inspect lexical fraud patterns and deterministic red flags."
          actionHref="/analyze"
          actionLabel="Start First Opportunity Scan"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Distribution Chart */}
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  <h2 className="text-sm font-bold text-zinc-900">Risk Severity Breakdown</h2>
                </div>
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Live Feed
                </span>
              </div>

              {pieData.length > 0 ? (
                <div className="h-64 w-full relative mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={62}
                        outerRadius={88}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={chartColors[entry.category] || "#9CA3AF"}
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111827",
                          borderRadius: "12px",
                          border: "1px solid rgba(255,255,255,0.1)",
                          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                          color: "#F9FAFB",
                          fontSize: "12px",
                          padding: "8px 12px"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Stat */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-zinc-900">{totalScans}</span>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Scans</span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Category breakdown pills */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100">
              {analytics?.categories.map((c) => (
                <div
                  key={c.category}
                  className="p-2 rounded-xl bg-zinc-50/80 border border-zinc-200/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: chartColors[c.category] || "#9CA3AF" }}
                    />
                    <span className="text-xs font-medium text-zinc-700 capitalize">
                      {c.category.toLowerCase()}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-zinc-900 font-mono">
                    {c.count} ({c.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Assessment Stream */}
          <div className="lg:col-span-2 bg-white/95 backdrop-blur-sm p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-500" />
                <h2 className="text-sm font-bold text-zinc-900">Recent Assessments</h2>
              </div>
              <Link
                href="/history"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
              >
                <span>Full history</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {analytics?.recent_activity && analytics.recent_activity.length > 0 ? (
              <div className="divide-y divide-zinc-100">
                {analytics.recent_activity.map((item) => (
                  <div
                    key={item.id}
                    className="py-3.5 flex items-center justify-between gap-4 group hover:bg-zinc-50/50 -mx-2 px-2 rounded-xl transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/assessments/${item.id}`}
                        className="text-xs sm:text-sm font-bold text-zinc-900 group-hover:text-emerald-700 truncate block transition-colors"
                      >
                        {item.job_title}
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 truncate mt-0.5">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-zinc-400" />
                          {item.company_name || "Company Undisclosed"}
                        </span>
                        <span>•</span>
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-bold font-mono text-zinc-900">
                          {item.risk_score.toFixed(1)} <span className="text-zinc-400 font-normal">/ 100</span>
                        </div>
                      </div>
                      <RiskBadge category={item.risk_category} size="sm" />
                      <Link
                        href={`/assessments/${item.id}`}
                        className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                        title="View details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <Clock className="w-8 h-8 text-zinc-300 mx-auto" />
                <p className="text-xs text-zinc-500">No activity logged recently.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Security Tip / Responsible AI Callout */}
      <div className="p-4 rounded-2xl bg-zinc-900 text-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-zinc-800 text-emerald-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white">
              Deterministic + Machine Learning Hybrid Detection
            </h3>
            <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
              HireShield AI combines an EMSCAD-trained Calibrated Linear SVC classifier with real-time heuristic security rules to eliminate blind spots.
            </p>
          </div>
        </div>
        <Link
          href="/model-info"
          className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 transition-colors inline-flex items-center gap-1.5"
        >
          <span>Inspect Model Specs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
