"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
  <div className={`bg-zinc-200/70 animate-pulse rounded-lg ${className}`} aria-hidden="true" />
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6 max-w-6xl mx-auto" aria-busy="true" aria-label="Loading dashboard data">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-9 w-36 rounded-lg" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white p-5 rounded-xl border border-zinc-200 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border border-zinc-200 space-y-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-52 w-full rounded-xl" />
      </div>
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-zinc-200 space-y-4">
        <Skeleton className="h-5 w-48" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const AssessmentDetailsSkeleton: React.FC = () => (
  <div className="max-w-4xl mx-auto space-y-6" aria-busy="true" aria-label="Loading assessment dossier">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-40" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-44 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
    </div>
    <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-4">
      <Skeleton className="h-7 w-64" />
      <div className="flex gap-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <div className="bg-white p-8 rounded-2xl border border-zinc-200 h-44" />
    <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-4">
      <Skeleton className="h-5 w-52" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  </div>
);
