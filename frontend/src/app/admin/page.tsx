"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { User, AuditLog } from "../../types";
import { PageHeader } from "../../components/PageHeader";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { EmptyState } from "../../components/EmptyState";
import { AnimatedSecurityBackground } from "../../components/backgrounds/AnimatedSecurityBackground";
import {
  Lock,
  Users,
  ShieldCheck,
  AlertTriangle,
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Clock,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  UserX,
  FileText
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, loading: authLoading } = useAuth();

  const [usersList, setUsersList] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Status toggle confirmation modal
  const [statusTarget, setStatusTarget] = useState<User | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [u, a] = await Promise.all([
        api.listUsers(0, 50),
        api.getAuditLogs(50),
      ]);
      setUsersList(u);
      setAuditLogs(a);
    } catch (err) {
      console.error("Admin data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (!isAdmin) {
        // Not admin - handled in render
      } else {
        fetchAdminData();
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  const handleToggleClick = (targetUser: User) => {
    if (targetUser.id === user?.id) {
      alert("Administrators cannot deactivate their own active session.");
      return;
    }
    setStatusTarget(targetUser);
  };

  const confirmToggleStatus = async () => {
    if (!statusTarget) return;

    setTogglingId(statusTarget.id);
    try {
      const updated = await api.updateUserStatus(statusTarget.id, !statusTarget.is_active);
      setUsersList((prev) =>
        prev.map((u) => (u.id === updated.id ? updated : u))
      );
      setStatusTarget(null);
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    } finally {
      setTogglingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="relative min-h-[calc(100vh-140px)] py-12 px-4 flex items-center justify-center">
        <AnimatedSecurityBackground variant="minimal" />
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin" />
          <span>Verifying administrative session...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="relative min-h-[calc(100vh-140px)] py-16 px-4 max-w-md mx-auto">
        <AnimatedSecurityBackground variant="minimal" />
        <EmptyState
          icon={Lock}
          title="Access Restricted"
          description={`This administrative control console requires verified ADMIN privileges. Your current role is "${user?.role || "GUEST"}".`}
          actionHref="/dashboard"
          actionLabel="Return to Dashboard"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 max-w-6xl mx-auto space-y-8 pb-16">
      <AnimatedSecurityBackground variant="dashboard" />

      {/* Header */}
      <PageHeader
        badge="Role-Based Access Control • Active"
        title="Administrator Console"
        description="System health oversight, user lifecycle management, and live platform security audit records."
        actions={
          <button
            onClick={fetchAdminData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs shadow-sm transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Refreshing..." : "Refresh Records"}</span>
          </button>
        }
      />

      {/* User Management Section */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-zinc-200/80 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Registered System Accounts ({usersList.length})</span>
          </h2>
          <span className="text-xs font-mono text-zinc-400">Total System Users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600 divide-y divide-zinc-200/80">
            <thead className="bg-zinc-50/80 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Full Name & Email</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Account Status</th>
                <th className="px-6 py-3.5">Joined</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="px-6 py-3.5">
                    <p className="font-bold text-zinc-900">{u.full_name}</p>
                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{u.email}</p>
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        u.role === "ADMIN"
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        u.is_active ? "text-emerald-700" : "text-rose-600"
                      }`}
                    >
                      {u.is_active ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{u.is_active ? "Active" : "Suspended"}</span>
                    </span>
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-zinc-500 font-mono text-[11px]">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleToggleClick(u)}
                      disabled={togglingId === u.id || u.id === user?.id}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all shadow-sm ${
                        u.is_active
                          ? "border-rose-200/80 text-rose-700 bg-rose-50/50 hover:bg-rose-100/80"
                          : "border-emerald-200/80 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-100/80"
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {togglingId === u.id
                        ? "Saving..."
                        : u.is_active
                        ? "Suspend Account"
                        : "Reactivate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Log Stream */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-zinc-200/80 shadow-card overflow-hidden space-y-2">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Platform Security Audit Stream</span>
          </h2>
          <span className="text-xs font-mono text-zinc-400">Latest 50 events</span>
        </div>

        {auditLogs.length > 0 ? (
          <div className="divide-y divide-zinc-100 max-h-96 overflow-y-auto px-6">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs gap-4 hover:bg-zinc-50/50 -mx-2 px-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      log.action.includes("FAILED") || log.action.includes("SUSPEND")
                        ? "bg-rose-100 text-rose-800"
                        : log.action.includes("LOGIN") || log.action.includes("REGISTER")
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-zinc-100 text-zinc-800"
                    }`}
                  >
                    {log.action}
                  </span>
                  <span className="text-zinc-600 truncate text-[11px]">
                    Resource: <b className="text-zinc-800">{log.resource_type}</b> ({log.resource_id ? log.resource_id.slice(0, 8) : "N/A"})
                  </span>
                </div>
                <div className="flex items-center gap-4 shrink-0 text-[11px] text-zinc-400 font-mono">
                  <span>IP: {log.ip_address || "127.0.0.1"}</span>
                  <span>{new Date(log.created_at).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-zinc-400">No audit logs recorded yet.</div>
        )}
      </div>

      {/* Account Status Toggle Confirmation */}
      <ConfirmDialog
        isOpen={!!statusTarget}
        title={statusTarget?.is_active ? "Suspend User Account?" : "Reactivate User Account?"}
        message={
          statusTarget?.is_active
            ? `Are you sure you want to suspend access for "${statusTarget?.full_name}" (${statusTarget?.email})? They will be unable to log in until reactivated.`
            : `Reactivate login access for "${statusTarget?.full_name}" (${statusTarget?.email})?`
        }
        confirmLabel={statusTarget?.is_active ? "Suspend Account" : "Reactivate"}
        cancelLabel="Cancel"
        isDestructive={statusTarget?.is_active}
        onConfirm={confirmToggleStatus}
        onCancel={() => setStatusTarget(null)}
      />
    </div>
  );
}
