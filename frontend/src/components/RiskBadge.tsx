"use client";

import React from "react";
import { ShieldCheck, AlertCircle, AlertTriangle, ShieldAlert } from "lucide-react";

interface RiskBadgeProps {
  category: "LOW" | "MODERATE" | "HIGH" | "CRITICAL" | string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  category,
  size = "md",
  className = "",
  showIcon = true,
}) => {
  const normCat = (category || "LOW").toUpperCase();

  const configs = {
    LOW: {
      label: "Low Risk",
      ariaLabel: "Risk level: Low Risk. Posting appears legitimate.",
      icon: ShieldCheck,
      containerClass: "bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100/70",
      dotClass: "bg-emerald-500",
      iconClass: "text-emerald-600",
    },
    MODERATE: {
      label: "Moderate Risk",
      ariaLabel: "Risk level: Moderate Risk. Exercise caution and verify details.",
      icon: AlertCircle,
      containerClass: "bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100/70",
      dotClass: "bg-amber-500",
      iconClass: "text-amber-600",
    },
    HIGH: {
      label: "High Risk",
      ariaLabel: "Risk level: High Risk. Strong suspicious indicators detected.",
      icon: AlertTriangle,
      containerClass: "bg-orange-50 text-orange-800 border-orange-200/80 hover:bg-orange-100/70",
      dotClass: "bg-orange-500",
      iconClass: "text-orange-600",
    },
    CRITICAL: {
      label: "Critical Risk",
      ariaLabel: "Risk level: Critical Risk. High likelihood of recruitment scam or fee demand.",
      icon: ShieldAlert,
      containerClass: "bg-rose-50 text-rose-800 border-rose-200/80 hover:bg-rose-100/70",
      dotClass: "bg-rose-500 animate-pulse",
      iconClass: "text-rose-600",
    },
  };

  const config = configs[normCat as keyof typeof configs] || configs.LOW;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3.5 py-1.5 text-sm gap-2 font-semibold",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  return (
    <span
      role="status"
      aria-label={config.ariaLabel}
      className={`inline-flex items-center font-medium rounded-full border shadow-subtle transition-colors duration-150 select-none ${
        config.containerClass
      } ${sizeClasses[size]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotClass}`} aria-hidden="true" />
      {showIcon && <IconComponent className={`shrink-0 ${iconSizes[size]} ${config.iconClass}`} aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  );
};
