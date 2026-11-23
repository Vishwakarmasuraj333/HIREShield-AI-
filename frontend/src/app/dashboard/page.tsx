"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { AnalyticsOverview } from "../../types";
import { RiskBadge } from "../../components/RiskBadge";
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
  Sparkles
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
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
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-zinc-200 rounded w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white border border-zinc-200 rounded-xl" />
          ))}
        </div>
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Assessment Dashboard
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Logged in as <span className="font-semibold text-zinc-800">{user?.full_name}</span> ({user?.email})
          </p>
        </div>

        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs shadow-sm transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-emerald-400" />
          <span>Scan New Opportunity</span>
        </Link>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assessed */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Scans</span>
            <p className="text-3xl font-extrabold text-zinc-900 mt-1">
              {analytics?.total_assessments || 0}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Critical Risk</span>
            <p className="text-3xl font-extrabold text-rose-600 mt-1">
              {analytics?.critical_risk_count || 0}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        {/* High Risk Alerts */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">High Risk</span>
            <p className="text-3xl font-extrabold text-orange-600 mt-1">
              {analytics?.high_risk_count || 0}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Verified Low/Safe */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Low / Safe Risk</span>
            <p className="text-3xl font-extrabold text-emerald-700 mt-1">
              {analytics?.low_risk_count || 0}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Visuals & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Chart */}
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900">Risk Category Distribution</h2>
            <span className="text-xs text-zinc-500">Live Breakdown</span>
          </div>

          {pieData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[entry.category] || "#9CA3AF"} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181B",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-2 text-xs">
                {analytics?.categories.map((c) => (
                  <div key={c.category} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: chartColors[c.category] }}
                    />
                    <span className="text-zinc-600">
                      {c.category}: <b>{c.count}</b> ({c.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-4">
              <ShieldAlert className="w-8 h-8 text-zinc-300 mb-2" />
              <p className="text-xs text-zinc-500">No assessments recorded yet.</p>
              <Link href="/analyze" className="text-xs text-emerald-700 font-semibold mt-1">
                Scan your first posting &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Recent Assessment Timeline */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900">Recent Assessments</h2>
            <Link href="/history" className="text-xs text-emerald-700 hover:underline flex items-center gap-1">
              <span>View full history</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {analytics?.recent_activity && analytics.recent_activity.length > 0 ? (
            <div className="divide-y divide-zinc-100">
              {analytics.recent_activity.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      href={`/assessments/${item.id}`}
                      className="text-xs font-semibold text-zinc-900 hover:text-emerald-700 truncate block"
                    >
                      {item.job_title}
                    </Link>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                      {item.company_name} &bull; {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-semibold text-zinc-700">
                      {item.risk_score.toFixed(1)}/100
                    </span>
                    <RiskBadge category={item.risk_category} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-xs text-zinc-500">No assessments performed yet.</p>
              <Link
                href="/analyze"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-zinc-900 text-white"
              >
                Start an analysis
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
