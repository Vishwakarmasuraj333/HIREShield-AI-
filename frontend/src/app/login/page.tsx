"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { AnimatedSecurityBackground } from "../../components/backgrounds/AnimatedSecurityBackground";
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  ShieldAlert
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.login({ email, password });
      login(res.access_token, res.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="relative min-h-[calc(100vh-140px)] flex items-center justify-center py-10 px-4 sm:px-6">
      <AnimatedSecurityBackground variant="minimal" />

      <div className="relative w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200/80 shadow-card p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center text-white mx-auto shadow-sm ring-4 ring-emerald-500/10">
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Sign in to HireShield AI
            </h1>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Access your job risk assessments, analytical reports, and threat history
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-rose-50/90 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800 animate-fadeIn"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold">Authentication failed: </span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-xs font-semibold text-zinc-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="block text-xs font-semibold text-zinc-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 p-0.5 rounded transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:scale-[0.99] text-white font-medium text-sm transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-zinc-100 space-y-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Viva Demonstration Presets</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("student@university.edu", "Student@12345")}
                className="text-left p-2.5 rounded-xl border border-zinc-200/80 bg-zinc-50/70 hover:bg-emerald-50/60 hover:border-emerald-200 text-xs transition-all group"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-zinc-900 group-hover:text-emerald-950">Student</p>
                  <CheckCircle2 className="w-3 h-3 text-zinc-400 group-hover:text-emerald-600" />
                </div>
                <p className="text-[10px] text-zinc-500 truncate mt-0.5">student@university.edu</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("admin@hireshield.ai", "Admin@12345")}
                className="text-left p-2.5 rounded-xl border border-zinc-200/80 bg-zinc-50/70 hover:bg-emerald-50/60 hover:border-emerald-200 text-xs transition-all group"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-zinc-900 group-hover:text-emerald-950">Administrator</p>
                  <ShieldAlert className="w-3 h-3 text-zinc-400 group-hover:text-emerald-600" />
                </div>
                <p className="text-[10px] text-zinc-500 truncate mt-0.5">admin@hireshield.ai</p>
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-zinc-500">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/register"
                className="font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-4 decoration-emerald-300"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
