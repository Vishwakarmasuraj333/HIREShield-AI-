import React from "react";
import { RiskCategory } from "../types";
import { ShieldCheck, AlertTriangle, AlertOctagon, Info } from "lucide-react";

interface RiskBadgeProps {
  category: RiskCategory;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  category,
  size = "md",
  showIcon = true,
}) => {
  const normalized = (category || "LOW").toUpperCase() as RiskCategory;

  const styles = {
    LOW: {
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-200",
      icon: ShieldCheck,
      label: "Low Risk",
    },
    MODERATE: {
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      icon: Info,
      label: "Moderate Risk",
    },
    HIGH: {
      bg: "bg-orange-50",
      text: "text-orange-800",
      border: "border-orange-200",
      icon: AlertTriangle,
      label: "High Risk",
    },
    CRITICAL: {
      bg: "bg-rose-50",
      text: "text-rose-800",
      border: "border-rose-200",
      icon: AlertOctagon,
      label: "Critical Risk",
    },
  }[normalized] || {
    bg: "bg-zinc-50",
    text: "text-zinc-800",
    border: "border-zinc-200",
    icon: Info,
    label: normalized,
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs font-medium gap-1.5",
    lg: "px-3.5 py-1.5 text-sm font-semibold gap-2",
  }[size];

  const IconComponent = styles.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full border ${styles.bg} ${styles.text} ${styles.border} ${sizeClasses}`}
    >
      {showIcon && <IconComponent className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />}
      <span>{styles.label}</span>
    </span>
  );
};
