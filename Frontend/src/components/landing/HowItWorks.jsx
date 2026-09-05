import React from 'react';

export function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: "Create Workspace",
      description: "Spin up a space tailored for your product team, agency client, or engineering sprint with ready templates.",
      badgeBg: "bg-indigo-500/20",
      badgeText: "text-indigo-400",
      badgeBorder: "border-indigo-500/40"
    },
    {
      num: 2,
      title: "Organize Work",
      description: "Add tasks, assign owners, set milestones, and break down complex initiatives into clear deliverables.",
      badgeBg: "bg-cyan-500/20",
      badgeText: "text-cyan-400",
      badgeBorder: "border-cyan-500/40"
    },
    {
      num: 3,
      title: "Deliver at Velocity",
      description: "Execute with clarity, eliminate context-switching meetings, and hit launch day ahead of schedule.",
      badgeBg: "bg-purple-500/20",
      badgeText: "text-purple-400",
      badgeBorder: "border-purple-500/40"
    }
  ];

  return (
    <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 mb-32" data-purpose="how-it-works" id="how-it-works">
      <div className="text-center mb-16">
        <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-3">Simple 3-Step Setup</h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">From concept to shipped in record time</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((step) => (
          <div key={step.num} className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-900/40 border border-white/5">
            <div className={`w-10 h-10 rounded-full ${step.badgeBg} ${step.badgeText} border ${step.badgeBorder} flex items-center justify-center font-bold text-base mb-4`}>
              {step.num}
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
            <p className="text-sm text-slate-400">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
