import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  ListTodo,
  FileText,
  BarChart3,
  Users,
  ArrowLeft,
  ShieldCheck,
  Layers,
  Sparkles,
  Settings,
  Plus
} from 'lucide-react';

export default function WorkspaceSidebar({
  project,
  userRole,
  activeTab,
  setActiveTab,
  membersCount = 0,
  tasksCount = 0,
  onOpenCreateTask,
  user,
}) {
  const navigate = useNavigate();
  const isUserAdmin = userRole === 'admin' || userRole === 'project_admin';

  const navItems = [
    { id: 'kanban', label: 'Kanban Board', icon: LayoutGrid, count: tasksCount },
    { id: 'list', label: 'Task List', icon: ListTodo },
    { id: 'notes', label: 'Specs & Notes', icon: FileText },
    { id: 'analytics', label: 'Analytics & Velocity', icon: BarChart3 },
    { id: 'members', label: 'Team Members', icon: Users, count: membersCount },
  ];

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <aside className="w-64 shrink-0 bg-[#0a0d14] border-r border-white/10 flex flex-col justify-between h-screen sticky top-0 z-30 transition-all">
      {/* Top Section */}
      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">
        {/* Back to Workspaces & Brand */}
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-400 hover:text-white transition-all group w-full shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-indigo-400" />
            <span>All Workspaces</span>
          </Link>

          {/* Project Title Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-white/10 shadow-lg">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-inner shadow-black/40">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-sm font-black text-white tracking-tight truncate" title={project?.name}>
                  {project?.name || 'Workspace'}
                </h1>
                <div className="text-[10px] text-slate-400 truncate">
                  {membersCount} {membersCount === 1 ? 'member' : 'members'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                  isUserAdmin
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-slate-800 text-slate-300 border border-white/10'
                }`}
              >
                <ShieldCheck className="w-2.5 h-2.5" />
                {userRole === 'admin'
                  ? 'Admin'
                  : userRole === 'project_admin'
                  ? 'Project Admin'
                  : 'Member'}
              </span>

              <button
                onClick={onOpenCreateTask}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Workspace Views
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400 transition-colors'}`} />
                  <span>{item.label}</span>
                </div>

                {typeof item.count === 'number' && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile Footer */}
      <div className="p-4 border-t border-white/10 bg-slate-950/60">
        <Link
          to="/profile"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-inner">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
              {user?.fullName || user?.username || 'Member'}
            </div>
            <div className="text-[10px] text-slate-500 truncate">@{user?.username || 'user'}</div>
          </div>
          <Settings className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
        </Link>
      </div>
    </aside>
  );
}
