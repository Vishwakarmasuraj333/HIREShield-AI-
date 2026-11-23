"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface MetricDisplayProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "neutral" | "emerald" | "amber" | "rose";
  className?: string;
}

export const MetricDisplay: React.FC<MetricDisplayProps> = ({
  label,
  value,
  subtitle,
  icon: Icon,
  variant = "neutral",
  className = "",
}) => {
  const variantStyles = {
    neutral: {
      text: "text-zinc-900",
      iconBg: "bg-zinc-100 text-zinc-700",
    },
    emerald: {
      text: "text-emerald-700",
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    amber: {
      text: "text-amber-700",
      iconBg: "bg-amber-50 text-amber-600",
    },
    rose: {
      text: "text-rose-700",
      iconBg: "bg-rose-50 text-rose-600",
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={`bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-card flex items-center justify-between transition-all duration-200 hover:shadow-elevated ${className}`}
    >
      <div className="space-y-1">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
          {label}
        </span>
        <p className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono ${style.text}`}>
          {value}
        </p>
        {subtitle && <span className="text-[10px] text-zinc-500 block">{subtitle}</span>}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${style.iconBg}`}>
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
    </div>
  );
};
