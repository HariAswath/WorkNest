import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { projectApi } from '../../api/project.api';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar';
import CreateProjectModal from '../../components/dashboard/CreateProjectModal';
import SpotlightCard from '../../components/common/SpotlightCard';
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
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'admin', 'member'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState(null);

  // Fetch projects on load
  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await projectApi.getProjects();
      setProjects(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle project creation
  const handleProjectCreated = async (projectData) => {
    const response = await projectApi.createProject(projectData);
    // Refresh project list
    await fetchProjects();
  };

  // Handle project deletion
  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this workspace and all its tasks?')) {
      return;
    }

    setDeletingProjectId(projectId);
    try {
      await projectApi.deleteProject(projectId);
      setProjects((prev) => prev.filter((item) => item.project._id !== projectId));
    } catch (err) {
      alert(err.message || 'Failed to delete project');
    } finally {
      setDeletingProjectId(null);
    }
  };

  // Filter & Search projects
  const filteredProjects = projects.filter((item) => {
    const proj = item.project;
    const matchesSearch =
      proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (proj.description && proj.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const isUserAdmin = item.role === 'admin' || item.role === 'project_admin';
    const matchesRole =
      roleFilter === 'all' ||
      (roleFilter === 'admin' && isUserAdmin) ||
      (roleFilter === 'member' && !isUserAdmin);

    return matchesSearch && matchesRole;
  });

  // Calculate statistics
  const totalProjects = projects.length;
  const adminProjectsCount = projects.filter(
    (item) => item.role === 'admin' || item.role === 'project_admin'
  ).length;
  const totalMembersAcross = projects.reduce(
    (acc, curr) => acc + (curr.project.members || 1),
    0
  );

  return (
    <div className="min-h-screen bg-[#07090e] bg-fine-grid text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-white">
      {/* Dashboard Top Navbar */}
      <DashboardNavbar
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-10">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Engineering Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Welcome back, {user?.username || 'Team Lead'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage your engineering projects, sprint boards, and team workflows.
            </p>
          </div>

          {/* Quick Create CTA */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="self-start md:self-auto px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Workspace</span>
          </button>
        </div>

        {/* Stats Metrics Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">Total Workspaces</span>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">{totalProjects}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FolderKanban className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">Administered Projects</span>
              <div className="text-2xl sm:text-3xl font-black text-purple-400 mt-1">{adminProjectsCount}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">Active Collaborators</span>
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 mt-1">{totalMembersAcross}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filters & Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                roleFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              All Workspaces ({totalProjects})
            </button>
            <button
              onClick={() => setRoleFilter('admin')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                roleFilter === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              Admin ({adminProjectsCount})
            </button>
            <button
              onClick={() => setRoleFilter('member')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                roleFilter === 'member'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              Member ({totalProjects - adminProjectsCount})
            </button>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing {filteredProjects.length} of {totalProjects} projects
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-3" />
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

        {/* Empty State */}
        {!loading && !error && filteredProjects.length === 0 && (
          <div className="py-16 sm:py-24 px-4 text-center rounded-3xl border border-dashed border-white/10 bg-slate-900/30 backdrop-blur-xl flex flex-col items-center justify-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-4 shadow-xl shadow-indigo-600/20">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">No workspaces found</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-sm leading-relaxed">
              {searchQuery
                ? `No projects matching "${searchQuery}". Try adjusting your search query.`
                : 'Create your first project workspace to start collaborating on tasks, sprints, and documentation.'}
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-6 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Workspace</span>
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((item) => {
              const project = item.project;
              const isUserAdmin = item.role === 'admin' || item.role === 'project_admin';
              const formattedDate = project.createdAt
                ? new Date(project.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recent';

              return (
                <SpotlightCard
                  key={project._id}
                  spotlightColor="rgba(99, 102, 241, 0.2)"
                  className="p-6 rounded-2xl bg-slate-900/70 border-white/10 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Header Row: Role Pill & Delete Button */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase ${
                          isUserAdmin
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-slate-800 text-slate-300 border border-white/10'
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        {item.role === 'admin'
                          ? 'Admin'
                          : item.role === 'project_admin'
                          ? 'Project Admin'
                          : 'Member'}
                      </span>

                      {/* Admin Delete Action */}
                      {isUserAdmin && (
                        <button
                          onClick={(e) => handleDeleteProject(e, project._id)}
                          disabled={deletingProjectId === project._id}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors focus:outline-none"
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

                    {/* Project Title */}
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors tracking-tight line-clamp-1 mb-2">
                      {project.name}
                    </h3>

                    {/* Project Description */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-6 min-h-[32px]">
                      {project.description || 'No description provided for this workspace.'}
                    </p>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <Users className="w-3.5 h-3.5 text-indigo-400" />
                        {project.members || 1} {project.members === 1 ? 'member' : 'members'}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1 text-indigo-400 font-semibold text-xs group-hover:translate-x-0.5 transition-transform">
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}
