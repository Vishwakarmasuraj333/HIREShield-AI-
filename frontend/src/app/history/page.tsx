"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { AssessmentListItem } from "../../types";
import { RiskBadge } from "../../components/RiskBadge";
import {
  History,
  Search,
  Filter,
  Download,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from "lucide-react";

export default function HistoryPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [items, setItems] = useState<AssessmentListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const res = await api.listAssessments({
        page,
        page_size: pageSize,
        category: category || undefined,
        search: search || undefined,
      });
      setItems(res.items);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      fetchAssessments();
    }
  }, [authLoading, isAuthenticated, page, category, router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAssessments();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the assessment for "${title}"?`)) {
      return;
    }
    try {
      await api.deleteAssessment(id);
      fetchAssessments();
    } catch (err: any) {
      alert("Failed to delete assessment: " + err.message);
    }
  };

  const handleExportCsv = () => {
    if (items.length === 0) return;
    const headers = ["ID", "Job Title", "Company", "Risk Score", "Risk Category", "Date"];
    const rows = items.map((it) => [
      it.id,
      `"${it.job_title.replace(/"/g, '""')}"`,
      `"${(it.company_name || 'N/A').replace(/"/g, '""')}"`,
      it.risk_score,
      it.risk_category,
      new Date(it.created_at).toISOString(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HireShield_Assessments_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Assessment History
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Browse, search, and export your previous job fraud screenings ({total} total records).
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={items.length === 0}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5 text-zinc-500" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or company..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-zinc-400" />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-1.5 text-xs rounded-lg border border-zinc-200 bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          >
            <option value="">All Risk Categories</option>
            <option value="CRITICAL">Critical Risk Only</option>
            <option value="HIGH">High Risk Only</option>
            <option value="MODERATE">Moderate Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-zinc-400">Loading assessments...</div>
        ) : items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-600 divide-y divide-zinc-200">
              <thead className="bg-zinc-50 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3">Position & Company</th>
                  <th className="px-6 py-3">Risk Severity</th>
                  <th className="px-6 py-3">Risk Score</th>
                  <th className="px-6 py-3">Date Evaluated</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {items.map((it) => (
                  <tr key={it.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/assessments/${it.id}`}
                        className="font-bold text-zinc-900 hover:text-emerald-700 block truncate max-w-xs sm:max-w-md"
                      >
                        {it.job_title}
                      </Link>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {it.company_name || "Company Undisclosed"}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RiskBadge category={it.risk_category} size="sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-semibold text-zinc-800">
                      {it.risk_score.toFixed(1)} / 100
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-zinc-500">
                      {new Date(it.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/assessments/${it.id}`}
                          className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded"
                          title="View Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(it.id, it.job_title)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <ShieldAlert className="w-10 h-10 text-zinc-300 mx-auto" />
            <h3 className="text-sm font-bold text-zinc-700">No Assessment Records Found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              You haven't scanned any listings matching your current filter criteria.
            </p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white"
            >
              <span>Scan a new job now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Pagination Bar */}
        {total > pageSize && (
          <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1}
                className="p-1 rounded border border-zinc-200 hover:bg-white disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages}
                className="p-1 rounded border border-zinc-200 hover:bg-white disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
