import React from 'react';

export function MetricsRibbon() {
  return (
    <section className="relative z-10 border-y border-white/10 bg-slate-950/60 backdrop-blur-md py-12 mb-28" data-purpose="metrics-counter" id="metrics">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-white/5">
          <div className="px-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">100+</div>
            <div className="text-sm font-medium text-slate-400 mt-1">Workspaces Launched</div>
          </div>
          <div className="px-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">1,000+</div>
            <div className="text-sm font-medium text-slate-400 mt-1">Tasks Delivered Daily</div>
          </div>
          <div className="px-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">250+</div>
            <div className="text-sm font-medium text-slate-400 mt-1">Active Global Teams</div>
          </div>
          <div className="px-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">99.9%</div>
            <div className="text-sm font-medium text-slate-400 mt-1">Sprint Accuracy</div>
          </div>
        </div>
      </div>
    </section>
  );
}
