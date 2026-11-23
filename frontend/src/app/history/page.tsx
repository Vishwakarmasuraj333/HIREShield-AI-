"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { AssessmentListItem } from "../../types";
import { RiskBadge } from "../../components/RiskBadge";
import { PageHeader } from "../../components/PageHeader";
import { EmptyState } from "../../components/EmptyState";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { AnimatedSecurityBackground } from "../../components/backgrounds/AnimatedSecurityBackground";
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
  ArrowRight,
  Building2,
  Calendar,
  X
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

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleClearSearch = () => {
    setSearch("");
    setPage(1);
    // trigger immediate reload
    api.listAssessments({ page: 1, page_size: pageSize, category: category || undefined })
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
      });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteAssessment(deleteTarget.id);
      setDeleteTarget(null);
      fetchAssessments();
    } catch (err: any) {
      alert("Failed to delete assessment: " + err.message);
    } finally {
      setIsDeleting(false);
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
    <div className="relative min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 max-w-6xl mx-auto space-y-6 pb-16">
      <AnimatedSecurityBackground variant="dashboard" />

      {/* Header */}
      <PageHeader
        badge="Audit Trail"
        title="Assessment History"
        description={`Browse, filter, and export verified opportunity screenings (${total} records).`}
        actions={
          items.length > 0 ? (
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs shadow-sm transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>
          ) : undefined
        }
      />

      {/* Search and Filter Control Bar */}
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, company..."
            className="w-full pl-10 pr-9 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-zinc-400 shrink-0" />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3.5 py-2 text-xs font-medium rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
          >
            <option value="">All Risk Categories</option>
            <option value="CRITICAL">Critical Risk Only</option>
            <option value="HIGH">High Risk Only</option>
            <option value="MODERATE">Moderate Risk</option>
            <option value="LOW">Low / Safe Risk</option>
          </select>
        </div>
      </div>

      {/* Assessment Table / Responsive Card View */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-zinc-200/80 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-zinc-400 flex flex-col items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin" />
            <span>Loading assessment records...</span>
          </div>
        ) : items.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-600 divide-y divide-zinc-200/70">
                <thead className="bg-zinc-50/80 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-3.5">Position & Company</th>
                    <th className="px-6 py-3.5">Risk Severity</th>
                    <th className="px-6 py-3.5">Risk Score</th>
                    <th className="px-6 py-3.5">Date Screened</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {items.map((it) => (
                    <tr key={it.id} className="hover:bg-zinc-50/60 transition-colors group">
                      <td className="px-6 py-4">
                        <Link
                          href={`/assessments/${it.id}`}
                          className="font-bold text-zinc-900 group-hover:text-emerald-700 block truncate max-w-xs md:max-w-md transition-colors"
                        >
                          {it.job_title}
                        </Link>
                        <p className="text-[11px] text-zinc-400 mt-0.5 truncate flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          <span>{it.company_name || "Company Undisclosed"}</span>
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RiskBadge category={it.risk_category} size="sm" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-zinc-800">
                        {it.risk_score.toFixed(1)} <span className="text-zinc-400 font-normal">/ 100</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-zinc-500 font-mono text-[11px]">
                        {new Date(it.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/assessments/${it.id}`}
                            className="p-1.5 text-zinc-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Inspect dossier"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget({ id: it.id, title: it.job_title })}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete record"
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

            {/* Mobile Stacked Card View */}
            <div className="block sm:hidden divide-y divide-zinc-100">
              {items.map((it) => (
                <div key={it.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/assessments/${it.id}`}
                        className="font-bold text-sm text-zinc-900 block"
                      >
                        {it.job_title}
                      </Link>
                      <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-zinc-400" />
                        <span>{it.company_name || "Undisclosed"}</span>
                      </p>
                    </div>
                    <RiskBadge category={it.risk_category} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
                    <span className="font-mono font-bold text-zinc-800">
                      Score: {it.risk_score.toFixed(1)}/100
                    </span>
                    <span className="font-mono text-[11px]">
                      {new Date(it.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                    <Link
                      href={`/assessments/${it.id}`}
                      className="flex-1 text-center py-2 px-3 rounded-lg bg-zinc-900 text-white text-xs font-semibold"
                    >
                      View Report
                    </Link>
                    <button
                      onClick={() => setDeleteTarget({ id: it.id, title: it.job_title })}
                      className="p-2 rounded-lg border border-zinc-200 text-zinc-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {total > pageSize && (
              <div className="px-6 py-3.5 bg-zinc-50/80 border-t border-zinc-200/70 flex items-center justify-between text-xs text-zinc-600">
                <span className="font-medium">
                  Page <span className="font-bold text-zinc-900">{page}</span> of {totalPages} ({total} items)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page <= 1}
                    className="p-1.5 rounded-lg border border-zinc-200/80 bg-white hover:bg-zinc-50 disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page >= totalPages}
                    className="p-1.5 rounded-lg border border-zinc-200/80 bg-white hover:bg-zinc-50 disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={ShieldAlert}
            title="No Assessment Records Found"
            description={
              search || category
                ? "No previous opportunity scans match your current filter criteria. Clear search or select another category."
                : "You haven't scanned any listings yet. Run your first job risk assessment now."
            }
            actionHref="/analyze"
            actionLabel="Scan New Opportunity"
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Assessment Record?"
        message={`Are you sure you want to permanently delete the audit record for "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel={isDeleting ? "Deleting..." : "Delete Record"}
        cancelLabel="Keep Record"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
