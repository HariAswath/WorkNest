import React, { useState } from 'react';
import BorderGlow from '../common/BorderGlow';

export function ProjectFeaturesSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  const moduleCards = [
    {
      id: 'tasks',
      category: 'core',
      title: 'Smart Task & Subtask Hierarchy',
      subtitle: 'Break down complex epics into actionable subtasks with automatic completion tracking.',
      glowColor: '250 85 75',
      colors: ['#818cf8', '#c084fc', '#38bdf8'],
      icon: (
        <svg className="w-6 h-6 shrink-0 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      previewContent: (
        <div className="p-4 bg-slate-900/80 rounded-xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">OAuth2 Authentication Flow</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold">Urgent</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded border border-emerald-400 bg-emerald-400/20 flex items-center justify-center text-[9px] text-emerald-400 font-bold">✓</span>
                <span className="line-through text-slate-400">JWT Access & Refresh Token strategy</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded border border-emerald-400 bg-emerald-400/20 flex items-center justify-center text-[9px] text-emerald-400 font-bold">✓</span>
                <span className="line-through text-slate-400">Google OAuth Provider Callback</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded border border-indigo-400 bg-indigo-500/10 flex items-center justify-center"></span>
                <span>Role-based Route Middleware</span>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Progress: 2/3 Subtasks</span>
            <span className="text-indigo-400 font-bold">66%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-500 h-full w-[66%]"></div>
          </div>
        </div>
      )
    },
    {
      id: 'notes',
      category: 'collaboration',
      title: 'Project Notes & Specs Hub',
      subtitle: 'Keep technical documentation, API contracts, and meeting notes attached directly to workspaces.',
      glowColor: '175 80 60',
      colors: ['#2dd4bf', '#38bdf8', '#818cf8'],
      icon: (
        <svg className="w-6 h-6 shrink-0 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      previewContent: (
        <div className="p-4 bg-slate-900/80 rounded-xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              <span className="text-xs font-bold text-white">Sprint 25 Architecture Spec</span>
            </div>
            <span className="text-[10px] text-slate-400">Updated 10m ago</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/60 p-2.5 rounded border border-white/5">
            "All API endpoints must enforce strict input validation using Express validators..."
          </p>
        </div>
      )
    },
    {
      id: 'members',
      category: 'collaboration',
      title: 'Team Presence & Granular Roles',
      subtitle: 'Manage project members with Project Admin, Contributor, and Guest access permissions.',
      glowColor: '280 85 70',
      colors: ['#c084fc', '#f472b6', '#818cf8'],
      icon: (
        <svg className="w-6 h-6 shrink-0 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      previewContent: (
        <div className="p-4 bg-slate-900/80 rounded-xl border border-white/5 space-y-2.5">
          <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-800/60">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">SK</div>
              <span className="font-semibold text-white">Sarah K.</span>
            </div>
            <span className="text-[10px] font-bold text-indigo-300">Project Admin</span>
          </div>
          <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-800/60">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] font-bold text-white">DP</div>
              <span className="font-semibold text-white">David P.</span>
            </div>
            <span className="text-[10px] font-bold text-cyan-300">Lead Developer</span>
          </div>
        </div>
      )
    },
    {
      id: 'kanban',
      category: 'core',
      title: 'Custom Workflow Pipelines',
      subtitle: 'Customize columns, drag-and-drop cards, and set automated state transitions.',
      glowColor: '40 90 60',
      colors: ['#fbbf24', '#f97316', '#818cf8'],
      icon: (
        <svg className="w-6 h-6 shrink-0 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      previewContent: (
        <div className="p-4 bg-slate-900/80 rounded-xl border border-white/5 space-y-2">
          <div className="flex gap-2">
            <div className="flex-1 bg-slate-800/80 p-2 rounded text-[11px]">
              <div className="font-bold text-slate-300 mb-1">Backlog (12)</div>
              <div className="bg-slate-900 p-1.5 rounded text-[10px] text-slate-400 border border-white/5">Refactor Store</div>
            </div>
            <div className="flex-1 bg-indigo-950/40 p-2 rounded text-[11px] border border-indigo-500/20">
              <div className="font-bold text-indigo-300 mb-1">Review (4)</div>
              <div className="bg-slate-900 p-1.5 rounded text-[10px] text-white border border-indigo-500/30 font-semibold">PR #108 WebGL</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'analytics',
      category: 'intelligence',
      title: 'Automated Velocity & Insights',
      subtitle: 'Real-time calculation of sprint burn-down, velocity metrics, and delivery bottlenecks.',
      glowColor: '150 85 60',
      colors: ['#34d399', '#38bdf8', '#818cf8'],
      icon: (
        <svg className="w-6 h-6 shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      previewContent: (
        <div className="p-4 bg-slate-900/80 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400">Sprint Completion Rate</div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">94.8%</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-slate-400">Active Workspaces</div>
            <div className="text-lg font-bold text-white mt-0.5">14 Active</div>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      category: 'intelligence',
      title: 'Audit Trails & Activity Logs',
      subtitle: 'Immutable record of task movements, project creations, and member permissions.',
      glowColor: '190 85 65',
      colors: ['#38bdf8', '#818cf8', '#c084fc'],
      icon: (
        <svg className="w-6 h-6 shrink-0 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      previewContent: (
        <div className="p-4 bg-slate-900/80 rounded-xl border border-white/5 space-y-2 text-[11px] text-slate-300">
          <div className="flex items-center justify-between">
            <span>• Task #4 status updated to Completed</span>
            <span className="text-[10px] text-slate-500">2m ago</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>• New Project Member 'Alex M.' added</span>
            <span className="text-[10px] text-slate-500">1h ago</span>
          </div>
        </div>
      )
    }
  ];

  const filteredCards = activeCategory === 'all' 
    ? moduleCards 
    : moduleCards.filter(c => c.category === activeCategory);

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-32" id="modules">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-3">Complete Project Ecosystem</h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Built for high-velocity software engineering</h3>
        <p className="text-slate-400 text-base mt-3">Explore the core modules engineered into WorkNest to manage projects, tasks, team roles, and specs.</p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
        <button 
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          All Modules
        </button>
        <button 
          onClick={() => setActiveCategory('core')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'core' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          Tasks & Workflows
        </button>
        <button 
          onClick={() => setActiveCategory('collaboration')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'collaboration' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          Team & Docs
        </button>
        <button 
          onClick={() => setActiveCategory('intelligence')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'intelligence' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          Analytics & Shield
        </button>
      </div>

      {/* Feature Cards Grid with BorderGlow Effect */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map(card => (
          <BorderGlow
            key={card.id}
            borderRadius={20}
            backgroundColor="#0b0f19"
            glowColor={card.glowColor}
            colors={card.colors}
            glowRadius={25}
            className="p-6 h-full transition-all duration-300"
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 shadow-inner">
                    {card.icon}
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{card.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">{card.subtitle}</p>
              </div>
              <div>
                {card.previewContent}
              </div>
            </div>
          </BorderGlow>
        ))}
      </div>
    </section>
  );
}
