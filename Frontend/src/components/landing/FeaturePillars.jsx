import React from 'react';
import SpotlightCard from '../common/SpotlightCard';

export function FeaturePillars() {
  const features = [
    {
      title: "Interactive Workspaces",
      description: "Organize projects into transparent spaces with visual boards, list views, and timeline projections in one click.",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
      textColor: "text-indigo-400",
      spotlightColor: "rgba(99, 102, 241, 0.25)",
      icon: (
        <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      title: "Automated Velocity",
      description: "Real-time throughput metrics automatically calculate estimated delivery dates and flag potential blockages before they happen.",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      textColor: "text-cyan-400",
      spotlightColor: "rgba(56, 189, 248, 0.25)",
      icon: (
        <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Live Team Presence",
      description: "Collaborate together with multiplayer live avatars, in-line mentions, synchronous task edits, and instant notifications.",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      textColor: "text-purple-400",
      spotlightColor: "rgba(192, 132, 252, 0.25)",
      icon: (
        <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Docs & Meeting Notes",
      description: "Tie markdown documentation directly to actionable milestones so technical specs never sit stale in separate folders.",
      bgColor: "bg-teal-500/10",
      borderColor: "border-teal-500/20",
      textColor: "text-teal-400",
      spotlightColor: "rgba(45, 212, 191, 0.25)",
      icon: (
        <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "SOC2 & Enterprise Shield",
      description: "Role-based granular access controls, immutable audit trails, and end-to-end data encryption at rest and in transit.",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/20",
      textColor: "text-pink-400",
      spotlightColor: "rgba(244, 114, 182, 0.25)",
      icon: (
        <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: "Continuous Sync",
      description: "Native integrations with GitHub, Figma, Slack, and Google Workspace keep every branch and asset connected.",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      textColor: "text-amber-400",
      spotlightColor: "rgba(251, 191, 36, 0.25)",
      icon: (
        <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    }
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-32" data-purpose="features-grid" id="features">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-3">Engineered For Focus</h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Everything modern teams need to execute fast</h3>
        <p className="text-slate-400 text-base mt-3">Avoid fragmented tools. WorkNest replaces status spreadsheets, chat threads, and sticky notes with unified velocity.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <SpotlightCard
            key={idx}
            spotlightColor={feature.spotlightColor}
            className="border-white/10 bg-slate-900/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40"
          >
            <div className={`w-12 h-12 rounded-xl ${feature.bgColor} border ${feature.borderColor} flex items-center justify-center ${feature.textColor} mb-6`}>
              {feature.icon}
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}
