"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { User, AuditLog } from "../../types";
import {
  Lock,
  Users,
  ShieldCheck,
  AlertTriangle,
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Clock
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, loading: authLoading } = useAuth();

  const [usersList, setUsersList] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

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
        // Not admin
      } else {
        fetchAdminData();
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  const handleToggleStatus = async (targetUser: User) => {
    if (targetUser.id === user?.id) {
      alert("Administrators cannot deactivate their own active session.");
      return;
    }

    setTogglingId(targetUser.id);
    try {
      const updated = await api.updateUserStatus(targetUser.id, !targetUser.is_active);
      setUsersList((prev) =>
        prev.map((u) => (u.id === updated.id ? updated : u))
      );
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    } finally {
      setTogglingId(null);
    }
  };

  if (authLoading) {
    return <div className="p-8 text-center text-xs text-zinc-400">Verifying session...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <Lock className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-zinc-900">Access Restricted</h2>
        <p className="text-xs text-zinc-500">
          This administrative control console requires verified ADMIN privileges. Your current role is <b>{user?.role || "GUEST"}</b>.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 text-white text-[10px] font-semibold mb-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Role-Based Access Control: Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Administrator Console
          </h1>
          <p className="text-xs text-zinc-500">
            System health, user lifecycle management, and platform audit records.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold shadow-sm transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* User Management Section */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-zinc-500" />
            <span>Registered System Accounts ({usersList.length})</span>
          </h2>
          <span className="text-xs text-zinc-400">Total System Users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600 divide-y divide-zinc-200">
            <thead className="bg-zinc-50 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3">Full Name & Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Account Status</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <p className="font-bold text-zinc-900">{u.full_name}</p>
                    <p className="text-[11px] text-zinc-400">{u.email}</p>
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.role === "ADMIN"
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
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
                  <td className="px-6 py-3.5 whitespace-nowrap text-zinc-500">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleToggleStatus(u)}
                      disabled={togglingId === u.id || u.id === user?.id}
                      className={`px-3 py-1 text-xs font-semibold rounded border transition-colors ${
                        u.is_active
                          ? "border-rose-200 text-rose-600 hover:bg-rose-50"
                          : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      } disabled:opacity-40`}
                    >
                      {togglingId === u.id
                        ? "Saving..."
                        : u.is_active
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Log Stream */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden space-y-2">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Platform Security Audit Stream</span>
          </h2>
          <span className="text-xs text-zinc-400">Latest 50 events</span>
        </div>

        {auditLogs.length > 0 ? (
          <div className="divide-y divide-zinc-100 max-h-96 overflow-y-auto px-6">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-xs gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-[11px] font-semibold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded">
                    {log.action}
                  </span>
                  <span className="text-zinc-500 truncate text-[11px]">
                    Resource: <b>{log.resource_type}</b> ({log.resource_id || "N/A"})
                  </span>
                </div>
                <div className="flex items-center gap-4 shrink-0 text-[11px] text-zinc-400">
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
    </div>
  );
}
