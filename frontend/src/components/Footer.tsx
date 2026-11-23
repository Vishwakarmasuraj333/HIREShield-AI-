"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, Github, ExternalLink, Cpu, BookOpen, Lock } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200/80 bg-white/70 backdrop-blur-sm mt-auto text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center text-white">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-bold text-sm tracking-tight text-zinc-900">
                HireShield <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 font-semibold text-zinc-700">AI</span>
              </span>
            </div>
            <p className="text-zinc-600 text-xs leading-relaxed max-w-sm">
              Empowering students and job seekers against fraudulent employment offers, advance-fee training scams, and identity theft through explainable machine learning and deterministic cyber-risk heuristics.
            </p>
            <p className="text-[11px] text-zinc-400">
              Developed as an M.Sc. in Information Technology Major Project (2026–2027).
            </p>
          </div>

          {/* Quick Platform Links */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-900">
              Platform Modules
            </span>
            <ul className="space-y-1.5 text-zinc-600">
              <li>
                <Link href="/analyze" className="hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                  <span>Job Risk Workspace</span>
                </Link>
              </li>
              <li>
                <Link href="/model-info" className="hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                  <span>EMSCAD Model Specs</span>
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-emerald-700 transition-colors">
                  Assessment History
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-700 transition-colors">
                  Candidate Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Transparency & External Resources */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-900">
              Academic Provenance
            </span>
            <ul className="space-y-1.5 text-zinc-600">
              <li>
                <a
                  href="https://github.com/Vishwakarmasuraj333/HIREShield-AI-"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://doi.org/10.1016/j.future.2017.10.043"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                  <span>EMSCAD Benchmark Paper</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </a>
              </li>
              <li>
                <span className="text-[11px] text-zinc-400 block pt-1">
                  Benchmarked on 17,880 Aegean Postings
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Disclaimer */}
        <div className="pt-8 mt-8 border-t border-zinc-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <p>© 2026 HireShield AI. Academic research & decision-support system.</p>
          <p className="text-center sm:text-right">
            Intended for advisory decision support. Users must independently verify employer authenticity.
          </p>
        </div>
      </div>
    </footer>
  );
};
