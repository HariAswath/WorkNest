import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  ChevronUp,
  FolderKanban,
  Archive,
  Trash2,
  Plus,
  X
} from 'lucide-react';

export default function ProjectsSidebar({
  projectsList = [],
  activeProject = null,
  onOpenCreateProject = () => {},
  isMobileOpen = false,
  setIsMobileOpen = () => {},
}) {
  const location = useLocation();
  const [scopeTab, setScopeTab] = useState('team');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentOpen, setRecentOpen] = useState(true);

  const currentProjectId = location.pathname.startsWith('/projects/')
    ? location.pathname.split('/')[2]
    : null;

  const realProjects = projectsList.map((item) => {
    const p = item.project || item;
    return {
      _id: p._id,
      name: p.name || 'Workspace',
      taskCount: p.taskCount || p.tasksCount || undefined,
    };
  });

  const filteredProjects = realProjects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={`w-64 shrink-0 h-screen bg-[#16181d] border-r border-white/5 flex flex-col justify-between select-none z-30 transition-transform md:translate-x-0 ${
        isMobileOpen ? 'fixed left-16 top-0 bottom-0 translate-x-0' : 'hidden md:flex'
      }`}
    >
      {/* Top Section */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar p-4 space-y-5">
        {/* Header Title & Mobile Close */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-sm font-bold text-white tracking-tight">Projects</h2>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Team / Personal Pill Switcher */}
        <div className="p-1 rounded-xl bg-[#111216] border border-white/5 grid grid-cols-2 gap-1 text-xs font-medium">
          <button
            onClick={() => setScopeTab('team')}
            className={`py-1.5 rounded-lg transition-colors ${
              scopeTab === 'team'
                ? 'bg-[#232630] text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Team
          </button>
          <button
            onClick={() => setScopeTab('personal')}
            className={`py-1.5 rounded-lg transition-colors ${
              scopeTab === 'personal'
                ? 'bg-[#232630] text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Personal
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#111216] border border-white/5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/20 transition-colors"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 border border-white/10 px-1 py-0.5 rounded">
            ⌘ S
          </span>
        </div>

        {/* Recent Workspaces */}
        <div className="space-y-1.5">
          <div
            onClick={() => setRecentOpen(!recentOpen)}
            className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1 cursor-pointer hover:text-slate-200 transition-colors"
          >
            <span>Workspaces</span>
            {recentOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>

          {recentOpen && (
            <div className="space-y-0.5 pt-1">
              {filteredProjects.length === 0 ? (
                <div className="px-3 py-3 text-xs text-slate-500">
                  {projectsList.length === 0 ? 'No workspaces yet' : 'No matching projects'}
                </div>
              ) : (
                filteredProjects.map((p) => {
                  const isActive = currentProjectId === p._id || activeProject?._id === p._id;
                  return (
                    <Link
                      key={p._id}
                      to={`/projects/${p._id}`}
                      className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-colors ${
                        isActive
                          ? 'bg-[#26282f] text-white font-bold border border-white/10'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate flex items-center gap-1.5 min-w-0">
                        <span className="text-slate-500 text-[11px]">#</span>
                        <span className="truncate">{p.name}</span>
                      </span>

                      {p.taskCount !== undefined && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-white/5 text-slate-400">
                          {p.taskCount}
                        </span>
                      )}
                    </Link>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* All Projects link */}
        <Link
          to="/projects"
          className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors ${
            location.pathname === '/projects'
              ? 'bg-[#232630] text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FolderKanban className="w-4 h-4 text-slate-400" />
          <span>All Projects</span>
        </Link>
      </div>

      {/* Bottom Button: + New Project */}
      <div className="p-4 border-t border-white/5 bg-[#16181d]">
        <button
          type="button"
          onClick={onOpenCreateProject}
          className="w-full py-2.5 px-4 rounded-xl border border-white/10 hover:border-white/20 bg-[#232630] hover:bg-[#2b2f3d] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-slate-300" />
          <span>New Workspace</span>
        </button>
      </div>
    </aside>
  );
}
