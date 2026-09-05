import React, { useState } from 'react';
import BorderGlow from '../common/BorderGlow';

export function InteractiveWorkspaceShowcase() {
  const [activeTab, setActiveTab] = useState('kanban');

  const sampleTasks = {
    todo: [
      { id: 1, title: 'Design System Refresh', priority: 'High', assignee: 'Sarah K.' },
      { id: 2, title: 'OAuth2 Authentication', priority: 'Medium', assignee: 'Alex M.' },
    ],
    inProgress: [
      { id: 3, title: 'WebGL Shader Optimization', priority: 'High', assignee: 'David P.' },
      { id: 4, title: 'MongoDB Index Tuning', priority: 'Urgent', assignee: 'Elena R.' },
    ],
    completed: [
      { id: 5, title: 'Sprint 24 Retrospective', priority: 'Low', assignee: 'Marcus W.' },
      { id: 6, title: 'WebSocket Realtime Sync', priority: 'High', assignee: 'David P.' },
    ]
  };

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 my-36" id="workspace">
      {/* Header text with generous spacing */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Experience your new command center
        </h3>
        <p className="text-slate-300 text-base sm:text-lg mt-5 leading-relaxed">
          See how WorkNest organizes tasks, team velocity, and project timelines in one seamless interface.
        </p>
      </div>

      {/* Main Glass Workspace Container with BorderGlow Effect */}
      <BorderGlow 
        borderRadius={24} 
        backgroundColor="#07090e" 
        glowColor="250 85 75" 
        glowIntensity={1.2}
        colors={['#818cf8', '#c084fc', '#38bdf8']}
        className="w-full shadow-2xl"
      >
        {/* Workspace App Header Bar */}
        <div className="bg-slate-900/90 border-b border-white/10 px-8 py-5 sm:py-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500/80 inline-block shadow-sm"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500/80 inline-block shadow-sm"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 inline-block shadow-sm"></span>
            </div>
            <div className="h-5 w-[1px] bg-white/10 hidden sm:block"></div>
            <div className="flex items-center gap-3 text-sm font-semibold text-white">
              <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">Project Alpha</span>
              <span className="text-slate-400 text-xs hidden md:inline">/ Sprint 25 (Active)</span>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-white/10 text-xs font-medium text-slate-300">
            <button 
              onClick={() => setActiveTab('kanban')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'kanban' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'hover:text-white'}`}
            >
              Kanban Board
            </button>
            <button 
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'timeline' ? 'bg-indigo-600 text-white shadow-md font-bold' : 'hover:text-white'}`}
            >
              Timeline
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-md font-bold' : 'hover:text-white'}`}
            >
              Velocity Stats
            </button>
          </div>
        </div>

        {/* Workspace Body */}
        <div className="p-8 sm:p-10">
          {activeTab === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* To Do Column */}
              <div className="bg-slate-900/70 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                    <h4 className="text-base font-bold text-slate-200">To Do</h4>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-mono font-bold">2</span>
                </div>
                <div className="space-y-5">
                  {sampleTasks.todo.map(task => (
                    <div key={task.id} className="p-5 rounded-xl bg-slate-800/80 border border-white/5 hover:border-indigo-500/40 transition-all cursor-pointer shadow-md">
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="text-slate-400 text-xs font-semibold">{task.priority} Priority</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-3">{task.title}</h5>
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/5">
                        <span>{task.assignee}</span>
                        <span className="text-emerald-400 font-medium">Due in 3d</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* In Progress Column */}
              <div className="bg-slate-900/70 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <h4 className="text-base font-bold text-slate-200">In Progress</h4>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 font-mono font-bold">2</span>
                </div>
                <div className="space-y-5">
                  {sampleTasks.inProgress.map(task => (
                    <div key={task.id} className="p-5 rounded-xl bg-slate-800/80 border border-amber-500/30 hover:border-amber-500/60 transition-all cursor-pointer shadow-xl shadow-amber-500/5">
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="text-amber-400 text-xs font-bold">{task.priority} Priority</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-3">{task.title}</h5>
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/5">
                        <span>{task.assignee}</span>
                        <span className="text-amber-400 font-bold">⚡ Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completed Column */}
              <div className="bg-slate-900/70 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                    <h4 className="text-base font-bold text-slate-200">Completed</h4>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-emerald-400 font-mono font-bold">2</span>
                </div>
                <div className="space-y-5">
                  {sampleTasks.completed.map(task => (
                    <div key={task.id} className="p-5 rounded-xl bg-slate-800/50 border border-white/5 opacity-85 hover:opacity-100 transition-all cursor-pointer">
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="text-emerald-400 text-xs font-bold">✓ Done</span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-300 mb-3 line-through">{task.title}</h5>
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-white/5">
                        <span>{task.assignee}</span>
                        <span className="text-emerald-400 font-bold">Shipped</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="p-8 sm:p-10 bg-slate-900/60 rounded-2xl border border-white/5 text-center">
              <h4 className="text-xl font-bold text-white mb-3">Gantt & Sprint Timeline Projection</h4>
              <p className="text-slate-300 text-sm max-w-xl mx-auto mb-10">Automated dependency mapping ensures teams stay aligned across milestones with zero overlap.</p>
              <div className="space-y-7 max-w-4xl mx-auto">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span className="font-semibold">Phase 1: Architecture & OAuth Integration</span>
                    <span className="text-emerald-400 font-bold">100% Complete</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden p-0.5">
                    <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full w-full"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span className="font-semibold">Phase 2: WebGL Shader Engine Integration</span>
                    <span className="text-amber-400 font-bold">75% Complete</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden p-0.5">
                    <div className="bg-gradient-to-r from-indigo-500 to-amber-400 h-full rounded-full w-[75%]"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span className="font-semibold">Phase 3: Global Production Deployment</span>
                    <span className="text-indigo-400 font-bold">Upcoming</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden p-0.5">
                    <div className="bg-slate-700 h-full rounded-full w-[25%]"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-8 sm:p-10 bg-slate-900/60 rounded-2xl border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-7 bg-slate-800/70 rounded-2xl border border-white/10">
                  <div className="text-xs font-semibold text-slate-400 mb-2">Average Velocity</div>
                  <div className="text-4xl font-black text-indigo-400">42 pts/sprint</div>
                  <div className="text-emerald-400 text-xs font-bold mt-2">↑ +14% from last sprint</div>
                </div>
                <div className="p-7 bg-slate-800/70 rounded-2xl border border-white/10">
                  <div className="text-xs font-semibold text-slate-400 mb-2">Lead Time to Production</div>
                  <div className="text-4xl font-black text-cyan-400">1.8 Days</div>
                  <div className="text-emerald-400 text-xs font-bold mt-2">⚡ Ultra Fast</div>
                </div>
                <div className="p-7 bg-slate-800/70 rounded-2xl border border-white/10">
                  <div className="text-xs font-semibold text-slate-400 mb-2">Blocker Clearance Rate</div>
                  <div className="text-4xl font-black text-emerald-400">98.4%</div>
                  <div className="text-slate-400 text-xs font-semibold mt-2">Resolved under 2 hrs</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </BorderGlow>
    </section>
  );
}
