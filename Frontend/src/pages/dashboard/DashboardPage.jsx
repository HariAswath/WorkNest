import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { projectApi } from '../../api/project.api';
import { taskApi } from '../../api/task.api';
import AppShell from '../../components/layout/AppShell';
import CreateProjectModal from '../../components/dashboard/CreateProjectModal';
import {
  FolderKanban,
  CheckSquare,
  Users,
  Plus,
  ArrowRight,
  User,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch real projects and their real tasks
  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await projectApi.getProjects();
      const projectList = response.data || [];
      setProjects(projectList);

      if (projectList.length > 0) {
        const taskPromises = projectList.map(async (item) => {
          const p = item.project || item;
          if (!p?._id) return [];
          try {
            const tRes = await taskApi.getTasks(p._id);
            const tList = tRes.data || [];
            return tList.map((t) => ({
              ...t,
              projectName: p.name,
              projectId: p._id,
            }));
          } catch {
            return [];
          }
        });

        const nested = await Promise.all(taskPromises);
        setAllTasks(nested.flat());
      } else {
        setAllTasks([]);
      }
    } catch (err) {
      setError(err.message || 'Unable to load workspace data');
      setProjects([]);
      setAllTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleProjectCreated = async (projectData) => {
    await projectApi.createProject(projectData);
    await fetchDashboardData();
  };

  const totalProjects = projects.length;
  const inProgressCount = allTasks.filter(
    (t) => (t.status || '').toLowerCase() === 'in_progress'
  ).length;
  const totalActiveTasks = allTasks.length;

  return (
    <AppShell
      projectsList={projects}
      onOpenCreateProject={() => setIsCreateModalOpen(true)}
    >
      <div className="max-w-5xl mx-auto w-full space-y-7">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              General overview of your workspaces and active tasks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/projects"
              className="px-4 py-2 rounded-xl bg-[#16181d] hover:bg-[#232630] border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
            >
              All Projects
            </Link>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>New Workspace</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-3" />
            <p className="text-xs text-slate-400">Loading dashboard...</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchDashboardData}
              className="px-3 py-1 rounded bg-rose-500/20 text-rose-200 text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* 3 Metrics Cards in Single Horizontal Row */}
            <div
              className="grid grid-cols-3 gap-4"
              style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
            >
              {/* Card 1: Total Workspaces */}
              <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 flex flex-col justify-between shadow-sm min-h-[100px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    TOTAL WORKSPACES
                  </span>
                  <FolderKanban className="w-4 h-4 text-amber-400/80" />
                </div>
                <div className="text-3xl font-black text-white mt-3">
                  {totalProjects}
                </div>
              </div>

              {/* Card 2: Tasks in Progress */}
              <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 flex flex-col justify-between shadow-sm min-h-[100px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    TASKS IN PROGRESS
                  </span>
                  <CheckSquare className="w-4 h-4 text-indigo-400/80" />
                </div>
                <div className="text-3xl font-black text-white mt-3">
                  {inProgressCount}
                </div>
              </div>

              {/* Card 3: Total Active Tasks */}
              <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 flex flex-col justify-between shadow-sm min-h-[100px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    TOTAL ACTIVE TASKS
                  </span>
                  <Users className="w-4 h-4 text-emerald-400/80" />
                </div>
                <div className="text-3xl font-black text-white mt-3">
                  {totalActiveTasks}
                </div>
              </div>
            </div>

            {/* Section 1: Your Workspaces */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white tracking-tight">Your Workspaces</h2>
                <Link
                  to="/projects"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {projects.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-[#16181d] border border-white/5 text-xs text-slate-400">
                  <p>No workspaces created yet.</p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-3 px-3.5 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Workspace</span>
                  </button>
                </div>
              ) : (
                <div
                  className="grid grid-cols-3 gap-4"
                  style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
                >
                  {projects.slice(0, 3).map((item) => {
                    const project = item.project || item;
                    const isAdm = item.role === 'admin' || item.role === 'project_admin';

                    return (
                      <div
                        key={project._id}
                        onClick={() => navigate(`/projects/${project._id}`)}
                        className="p-5 rounded-2xl bg-[#16181d] hover:bg-[#1a1c23] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between shadow-sm hover:shadow-md cursor-pointer group min-h-[160px] space-y-4"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-300 bg-[#232630] px-2 py-0.5 rounded border border-white/5">
                              {isAdm ? 'ADMIN' : 'MEMBER'}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                          </div>

                          <h3 className="text-base font-bold text-white mt-3 group-hover:text-slate-200 transition-colors line-clamp-1">
                            {project.name}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2 italic leading-relaxed">
                            {project.description || 'No description provided.'}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <User className="w-3 h-3 text-slate-500" />
                            <span>{project.members || 1} member</span>
                          </span>
                          <span className="text-xs text-slate-400 group-hover:text-white transition-colors">
                            Open Board &gt;
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section 2: Tasks In Progress */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white tracking-tight">Tasks In Progress</h2>
                <Link
                  to="/projects"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {allTasks.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-[#16181d] border border-white/5 text-xs text-slate-500">
                  No active tasks found.
                </div>
              ) : (
                <div className="rounded-2xl bg-[#16181d] border border-white/5 divide-y divide-white/5 overflow-hidden">
                  {allTasks.slice(0, 5).map((task) => {
                    const statusLabel =
                      (task.status || 'todo').toLowerCase() === 'in_progress'
                        ? 'In Progress'
                        : (task.status || 'todo').toLowerCase() === 'done'
                        ? 'Completed'
                        : 'To Do';

                    return (
                      <div
                        key={task._id}
                        onClick={() => navigate(`/projects/${task.projectId}`)}
                        className="p-4 hover:bg-white/[0.02] flex items-center justify-between gap-4 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#232630] border border-white/5 flex items-center justify-center text-slate-300 shrink-0">
                            <CheckSquare className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white group-hover:text-slate-200 transition-colors truncate">
                              {task.title}
                            </h4>
                            <span className="text-[11px] text-slate-400">
                              in {task.projectName}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-[#232630] border border-white/5 text-slate-300">
                            {statusLabel}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </AppShell>
  );
}
