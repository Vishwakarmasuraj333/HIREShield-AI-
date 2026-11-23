import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-zinc-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-sm text-zinc-900">HireShield AI</span>
            <span className="text-zinc-300">|</span>
            <span className="text-xs text-zinc-500">M.Sc. IT Group Major Project</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-500">
            <Link href="/model-info" className="hover:text-zinc-900 transition-colors">
              Model Provenance & Metrics
            </Link>
            <Link href="/analyze" className="hover:text-zinc-900 transition-colors">
              Assessment Engine
            </Link>
            <span>University Benchmark: EMSCAD</span>
          </div>

          <p className="text-xs text-zinc-400">
            &copy; 2026 HireShield AI. All rights reserved. Designed for candidate safety.
          </p>
        </div>
      </div>
    </footer>
  );
};
