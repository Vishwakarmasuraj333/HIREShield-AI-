import React from "react";
import { RiskCategory } from "../types";

interface RiskGaugeProps {
  score: number; // 0 - 100
  category: RiskCategory;
  mlProbability: number; // 0.0 - 1.0
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  category,
  mlProbability,
}) => {
  const normalized = (category || "LOW").toUpperCase() as RiskCategory;

  const colorMap = {
    LOW: { bar: "bg-emerald-500", text: "text-emerald-700", ring: "stroke-emerald-500" },
    MODERATE: { bar: "bg-amber-500", text: "text-amber-700", ring: "stroke-amber-500" },
    HIGH: { bar: "bg-orange-500", text: "text-orange-700", ring: "stroke-orange-500" },
    CRITICAL: { bar: "bg-rose-600", text: "text-rose-700", ring: "stroke-rose-600" },
  }[normalized] || { bar: "bg-zinc-500", text: "text-zinc-700", ring: "stroke-zinc-500" };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Overall Risk Score</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-4xl font-bold tracking-tight ${colorMap.text}`}>
              {score.toFixed(1)}
            </span>
            <span className="text-zinc-400 text-sm font-medium">/ 100</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-zinc-500">ML Model Probability</span>
          <p className="text-sm font-semibold text-zinc-800 mt-1">
            {(mlProbability * 100).toFixed(1)}% Scam Prob
          </p>
        </div>
      </div>

      {/* Progress Bar with Color Bands */}
      <div className="relative w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-700 ease-out rounded-full ${colorMap.bar}`}
          style={{ width: `${Math.min(Math.max(score, 3), 100)}%` }}
        />
      </div>

      {/* Scale Markers */}
      <div className="flex justify-between text-[11px] font-medium text-zinc-400 mt-2 px-0.5">
        <span>0 (Safe)</span>
        <span>30 (Mod)</span>
        <span>60 (High)</span>
        <span>80+ (Critical)</span>
      </div>

      {/* Narrative Subtext */}
      <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
        <span>Combined Model: NLP Classifier + Deterministic Red Flags</span>
        <span className="font-medium text-zinc-900">{category} Severity</span>
      </div>
    </div>
  );
};
