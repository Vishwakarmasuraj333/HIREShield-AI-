"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon, ArrowRight, ShieldCheck } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = ShieldCheck,
  title,
  description,
  actionHref,
  actionLabel,
  className = "",
}) => {
  return (
    <div
      role="status"
      className={`py-14 px-6 text-center space-y-3.5 max-w-md mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-500 mx-auto shadow-subtle">
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-zinc-900 tracking-tight">{title}</h3>
        <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
      </div>
      {actionHref && actionLabel && (
        <div className="pt-2">
          <Link
            href={actionHref}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white transition-colors shadow-subtle"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
};
