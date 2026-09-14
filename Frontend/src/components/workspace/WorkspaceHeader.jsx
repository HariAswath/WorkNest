import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  LayoutGrid,
  ListTodo,
  FileText,
  Users,
  Plus,
  ShieldCheck,
  Sparkles,
  Layers,
  BarChart3
} from 'lucide-react';

export default function WorkspaceHeader({
  project,
  userRole,
  activeTab,
  setActiveTab,
  onOpenCreateTask,
  membersCount = 0,
}) {
  const isUserAdmin = userRole === 'admin' || userRole === 'project_admin';

  return (
    <div className="bg-[#07090e]/90 backdrop-blur-xl border-b border-white/10 pt-4 pb-2 px-4 sm:px-8 sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto">
        {/* Top Breadcrumb & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all group shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-indigo-400" />
              Workspaces
            </Link>

            <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

            {/* Project Title & Role Pill */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400 font-bold text-xs shadow-inner">
                <Layers className="w-4 h-4" />
              </div>
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight truncate max-w-xs sm:max-w-md">
                {project?.name || 'Loading Workspace...'}
              </h1>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isUserAdmin
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-slate-800 text-slate-300 border border-white/10'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                {userRole === 'admin'
                  ? 'Admin'
                  : userRole === 'project_admin'
                  ? 'Project Admin'
                  : 'Member'}
              </span>
            </div>
          </div>

          {/* Right Action: "+ New Task" */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenCreateTask}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar border-t border-white/5 pt-2">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'kanban'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Kanban Board</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'list'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>Task List</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Specs & Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics & Velocity</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'members'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Team Members ({membersCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
