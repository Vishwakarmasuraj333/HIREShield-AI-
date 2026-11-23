"use client";

import React from "react";
import { Cpu, ShieldCheck, AlertTriangle } from "lucide-react";

interface RiskGaugeProps {
  score: number; // 0.0 to 100.0
  category: "LOW" | "MODERATE" | "HIGH" | "CRITICAL" | string;
  mlProbability?: number; // 0.0 to 1.0
  className?: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score = 0,
  category = "LOW",
  mlProbability,
  className = "",
}) => {
  const normScore = Math.min(Math.max(score, 0), 100);
  const normCat = (category || "LOW").toUpperCase();

  // Color config based on severity
  const catStyles = {
    LOW: {
      text: "text-emerald-700",
      stroke: "#10B981",
      bgLight: "bg-emerald-50/50",
      border: "border-emerald-200",
      description: "Low risk indicators detected. Posting exhibits standard corporate recruitment characteristics.",
    },
    MODERATE: {
      text: "text-amber-700",
      stroke: "#F59E0B",
      bgLight: "bg-amber-50/50",
      border: "border-amber-200",
      description: "Moderate anomalies detected. Verify company credentials and interview communication channels before proceeding.",
    },
    HIGH: {
      text: "text-orange-700",
      stroke: "#F97316",
      bgLight: "bg-orange-50/50",
      border: "border-orange-200",
      description: "High risk signals flagged. Counterparty exhibits multiple patterns consistent with deceptive recruitment.",
    },
    CRITICAL: {
      text: "text-rose-700",
      stroke: "#E11D48",
      bgLight: "bg-rose-50/50",
      border: "border-rose-200",
      description: "Critical risk warning! Solicitation of upfront fees, banking records, or unauthorized messaging detected.",
    },
  };

  const style = catStyles[normCat as keyof typeof catStyles] || catStyles.LOW;

  // SVG Gauge calculations
  // Semi-circle from 180 to 0 degrees
  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // Half-circle circumference
  const strokeDashoffset = circumference - (normScore / 100) * circumference;

  return (
    <div
      role="region"
      aria-label="Risk assessment gauge and probability score"
      className={`bg-white rounded-2xl border border-zinc-200/90 shadow-card p-6 sm:p-8 space-y-6 ${className}`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Interactive Semi-Circle Meter */}
        <div className="relative flex flex-col items-center justify-center shrink-0">
          <svg
            className="w-52 h-28 overflow-visible"
            viewBox="0 0 200 110"
            role="meter"
            aria-valuenow={normScore}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Overall Risk Severity Score: ${normScore} out of 100`}
          >
            {/* Background Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#F3F4F6"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Animated Value Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={style.stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Score Overlay */}
          <div className="text-center -mt-10">
            <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight font-mono ${style.text}`}>
              {normScore.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-zinc-400 block -mt-1 uppercase tracking-wider">
              / 100 Risk Score
            </span>
          </div>
        </div>

        {/* Right: Score Breakdown & Calibrated ML Probability */}
        <div className="flex-1 space-y-3.5 w-full">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Evaluation Assessment
              </span>
              <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${style.bgLight} ${style.text}`}>
                {normCat} SEVERITY
              </span>
            </div>
            <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
              {style.description}
            </p>
          </div>

          {/* Model Calibrated Probability vs Rule Heuristic Demarcation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {mlProbability !== undefined && (
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-2.5">
                <Cpu className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="text-[11px] font-semibold text-zinc-500 block">
                    Calibrated ML Probability
                  </span>
                  <span className="text-sm font-bold text-zinc-900 font-mono">
                    {(mlProbability * 100).toFixed(1)}%
                  </span>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Sigmoid Platt-scaled statistical confidence
                  </p>
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="text-[11px] font-semibold text-zinc-500 block">
                  Scoring Balance
                </span>
                <span className="text-sm font-bold text-zinc-900">
                  50% ML + 50% Heuristics
                </span>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Critical rules enforce floor thresholds
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
