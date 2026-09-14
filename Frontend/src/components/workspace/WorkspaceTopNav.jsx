import React from 'react';
import { Search, Plus, Sparkles, Filter, CheckSquare } from 'lucide-react';

export default function WorkspaceTopNav({
  project,
  tasksCount = 0,
  searchQuery = '',
  setSearchQuery = () => {},
  onOpenCreateTask,
  activeTabLabel = 'Kanban Board',
}) {
  return (
    <header className="h-16 px-6 border-b border-white/10 bg-[#07090e]/80 backdrop-blur-xl flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Current View Title & Task Count */}
      <div className="flex items-center gap-3">
        <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
          {activeTabLabel}
        </h2>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
          {tasksCount} {tasksCount === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {/* Right: Quick Search & New Task CTA */}
      <div className="flex items-center gap-3">
        <div className="relative w-48 sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks in workspace..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        <button
          onClick={onOpenCreateTask}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
