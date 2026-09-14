import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { projectApi } from '../../api/project.api';
import AppShell from '../../components/layout/AppShell';
import CreateProjectModal from '../../components/dashboard/CreateProjectModal';
import {
  FolderKanban,
  Users,
  Plus,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Trash2,
  Sparkles,
  Loader2,
  AlertCircle,
  Clock,
  MoreVertical,
  SlidersHorizontal
} from 'lucide-react';

export default function ProjectsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'admin', 'member'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await projectApi.getProjects();
      setProjects(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectCreated = async (projectData) => {
    await projectApi.createProject(projectData);
    await fetchProjects();
  };

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this workspace?')) return;

    setDeletingProjectId(projectId);
    try {
      await projectApi.deleteProject(projectId);
      setProjects((prev) => prev.filter((item) => item.project._id !== projectId));
    } catch (err) {
      setProjects((prev) => prev.filter((item) => item.project._id !== projectId));
    } finally {
      setDeletingProjectId(null);
    }
  };

  const filteredProjects = projects.filter((item) => {
    const project = item.project;
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole =
      roleFilter === 'all' ||
      (roleFilter === 'admin' && (item.role === 'admin' || item.role === 'project_admin')) ||
      (roleFilter === 'member' && item.role === 'member');
    return matchesSearch && matchesRole;
  });

  const totalProjects = projects.length;
  const adminProjectsCount = projects.filter(
    (item) => item.role === 'admin' || item.role === 'project_admin'
  ).length;
  const totalMembersAcross = projects.reduce(
    (acc, curr) => acc + (curr.project.members || 1),
    0
  );

  return (
    <AppShell
      projectsList={projects}
      onOpenCreateProject={() => setIsCreateModalOpen(true)}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    >
      <div className="max-w-5xl mx-auto w-full space-y-6 py-2">
        {/* Top Header & Overview Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Link to="/dashboard" className="hover:text-white transition-colors">
                Workspaces
              </Link>
              <span>&gt;</span>
              <span className="text-white font-semibold">All Projects</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Projects & Workspaces Directory
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore, manage, and collaborate across all active engineering workspaces.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#232630] hover:bg-[#2b2f3d] border border-white/10 hover:border-white/20 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>New Workspace</span>
          </button>
        </div>

        {/* Stats Metrics Ribbon — Single Horizontal Row */}
        <div className="grid grid-cols-3 gap-4" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          <div className="p-4 rounded-2xl bg-[#16181d] border border-white/5 flex items-center justify-between shadow-md">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Workspaces</span>
              <div className="text-2xl font-black text-white mt-0.5">{totalProjects}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <FolderKanban className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#16181d] border border-white/5 flex items-center justify-between shadow-md">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Administered Projects</span>
              <div className="text-2xl font-black text-white mt-0.5">{adminProjectsCount}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#16181d] border border-white/5 flex items-center justify-between shadow-md">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Collaborators</span>
              <div className="text-2xl font-black text-white mt-0.5">{totalMembersAcross}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
        </div>

        {/* Filters & Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: `All (${totalProjects})` },
              { id: 'admin', label: `Admin (${adminProjectsCount})` },
              { id: 'member', label: `Member (${totalProjects - adminProjectsCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  roleFilter === tab.id
                    ? 'bg-[#232630] text-white border border-white/10 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing {filteredProjects.length} of {totalProjects} projects
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin mb-3" />
            <p className="text-sm text-slate-400 font-medium">Fetching active workspaces...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-rose-300 text-sm mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchProjects}
              className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}
          >
            {filteredProjects.map((item) => {
              const project = item.project;
              const isOwner = item.role === 'admin';

              return (
                <div
                  key={project._id}
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="p-6 rounded-2xl bg-[#16181d] hover:bg-[#1a1c23] border border-white/5 hover:border-white/15 transition-all shadow-md hover:shadow-xl flex flex-col justify-between group cursor-pointer space-y-4"
                >
                  <div>
                    {/* Header Row: Role Pill & Delete */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                          item.role === 'admin'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : item.role === 'project_admin'
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                            : 'bg-slate-800 text-slate-300 border border-white/10'
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        {item.role === 'admin' ? 'Admin' : item.role === 'project_admin' ? 'Project Admin' : 'Member'}
                      </span>

                      {isOwner && (
                        <button
                          onClick={(e) => handleDeleteProject(e, project._id)}
                          disabled={deletingProjectId === project._id}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete workspace"
                        >
                          {deletingProjectId === project._id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {project.description || 'Collaborative sprint development workspace.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>{project.members || 3} members</span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-300 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all">
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
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
