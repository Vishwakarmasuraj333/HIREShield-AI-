"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  ShieldAlert,
  Search,
  LayoutDashboard,
  History,
  Cpu,
  Lock,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  ChevronRight
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Manage body scroll and Escape key for mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileMenuOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Analyze", href: "/analyze", icon: Search },
    ...(isAuthenticated
      ? [
          { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { name: "History", href: "/history", icon: History },
        ]
      : []),
    { name: "Model Specs", href: "/model-info", icon: Cpu },
    ...(isAdmin ? [{ name: "Admin Console", href: "/admin", icon: Lock }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/85 backdrop-blur-md border-b border-zinc-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1 -ml-1 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-subtle group-hover:bg-emerald-600 transition-colors">
              <ShieldAlert className="w-5 h-5 text-emerald-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-zinc-900 flex items-center gap-1.5">
                HireShield
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100/70 border border-emerald-200/80 font-bold text-emerald-800">
                  AI
                </span>
              </span>
              <p className="text-[10px] font-medium text-zinc-500 hidden sm:block leading-none">
                Risk Assessment Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 ${
                    isActive
                      ? "bg-zinc-900 text-white shadow-subtle"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-3 border-l border-zinc-200/80">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 font-bold text-xs uppercase shadow-subtle">
                    {user?.full_name?.charAt(0) || "U"}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-zinc-900 leading-tight truncate max-w-[140px]">
                      {user?.full_name}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-medium leading-tight">
                      {user?.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Sign out of account"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-subtle transition-all"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Accessible Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-zinc-900/30 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="relative w-full max-w-xs bg-[#FAF9F6] border-r border-zinc-200 shadow-dropdown p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-3">
                Navigation
              </span>
              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                        isActive
                          ? "bg-zinc-900 text-white"
                          : "text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{link.name}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Auth Area */}
            <div className="pt-4 border-t border-zinc-200">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 px-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-xs">
                      {user?.full_name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">{user?.full_name}</p>
                      <p className="text-[10px] text-zinc-500">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="text-center py-2 text-xs font-semibold text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="text-center py-2 text-xs font-semibold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
