import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { projectApi } from '../../api/project.api';
import { taskApi } from '../../api/task.api';
import AppShell from '../../components/layout/AppShell';
import {
  User,
  ShieldCheck,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  CheckSquare,
  KeyRound,
  Bell,
  Palette,
  ArrowLeft,
  ArrowRight,
  Settings,
  FolderKanban,
  Activity,
  Briefcase
} from 'lucide-react';

const AVATAR_PRESETS = [
  { id: 'indigo', name: 'Indigo Aura', gradient: 'from-indigo-600 via-indigo-500 to-purple-600' },
  { id: 'amber', name: 'Amber Core', gradient: 'from-amber-500 via-amber-400 to-orange-600' },
  { id: 'emerald', name: 'Emerald Prism', gradient: 'from-emerald-500 via-teal-500 to-teal-700' },
  { id: 'rose', name: 'Rose Nebula', gradient: 'from-rose-500 via-pink-500 to-purple-600' },
  { id: 'cyan', name: 'Cyan Flux', gradient: 'from-cyan-500 via-sky-500 to-blue-600' },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stored profile fields
  const fullName =
    localStorage.getItem('worknest_pref_fullName') || user?.fullName || 'Senior Software Engineer';
  const username = user?.username || 'developer';
  const email = user?.email || 'dev@worknest.io';
  const jobTitle =
    localStorage.getItem('worknest_pref_jobTitle') || 'Lead Platform Engineer';
  const department =
    localStorage.getItem('worknest_pref_department') || 'Engineering & Architecture';
  const bio =
    localStorage.getItem('worknest_pref_bio') ||
    'Full-stack engineer crafting high-velocity digital workspaces with microservices & modern UI.';
  const selectedAvatar = localStorage.getItem('worknest_pref_avatar') || 'indigo';

  const activeGradient =
    AVATAR_PRESETS.find((p) => p.id === selectedAvatar)?.gradient ||
    'from-indigo-600 via-indigo-500 to-purple-600';
  const userInitial = (username || 'U').charAt(0).toUpperCase();

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
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
          const all = nested.flat();
          // Filter tasks assigned to current user or active in general
          const mine = all.filter(
            (t) =>
              t.assignedTo?._id === user?._id ||
              t.assignedTo?.username === user?.username ||
              !t.assignedTo
          );
          setAssignedTasks(mine.length > 0 ? mine : all);
        }
      } catch {
        // Fallback gracefully
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  const completedCount = assignedTasks.filter(
    (t) => (t.status || '').toLowerCase() === 'done' || (t.status || '').toLowerCase() === 'completed'
  ).length;
  const inProgressCount = assignedTasks.filter(
    (t) => (t.status || '').toLowerCase() === 'in_progress'
  ).length;
  const velocityRate = assignedTasks.length > 0 ? Math.round((completedCount / assignedTasks.length) * 100) : 85;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto w-full space-y-7 pb-12">
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Link to="/dashboard" className="hover:text-white transition-colors">
                Workspaces
              </Link>
              <span>&gt;</span>
              <span className="text-white font-semibold">User Profile</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Developer Profile
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Public workspace profile, engineering velocity telemetry, and active sprint assignments.
            </p>
          </div>

          <Link
            to="/settings"
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <Settings className="w-3.5 h-3.5 text-slate-950" />
            <span>Edit Profile & Settings</span>
          </Link>
        </div>

        {/* Profile Identity Card */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#16181d] border border-white/5 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm">
          {/* Avatar Ring */}
          <div className="relative group shrink-0">
            <div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${activeGradient} text-white font-black text-3xl flex items-center justify-center shadow-lg border border-white/15`}
            >
              {userInitial}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-[#111216] border border-white/10 flex items-center justify-center text-amber-400 shadow">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {fullName}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/20">
                {user?.role === 'admin' ? 'Workspace Admin' : 'Full-Stack Member'}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400">
              <span className="text-amber-400/90 font-medium">@{username}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-slate-500" />
                {jobTitle}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-500" />
                {department}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-500" />
                {email}
              </span>
            </div>

            <p className="text-xs text-slate-300 pt-1 leading-relaxed max-w-3xl">
              {bio}
            </p>
          </div>
        </div>

        {/* 3 Metrics Cards */}
        <div
          className="grid grid-cols-3 gap-4"
          style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
        >
          <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 flex flex-col justify-between shadow-sm min-h-[100px]">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                TOTAL WORKSPACES
              </span>
              <FolderKanban className="w-4 h-4 text-amber-400/80" />
            </div>
            <div className="text-3xl font-black text-white mt-3">
              {projects.length}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 flex flex-col justify-between shadow-sm min-h-[100px]">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                ACTIVE TASKS
              </span>
              <CheckSquare className="w-4 h-4 text-indigo-400/80" />
            </div>
            <div className="text-3xl font-black text-white mt-3">
              {assignedTasks.length}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 flex flex-col justify-between shadow-sm min-h-[100px]">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                VELOCITY SCORE
              </span>
              <Activity className="w-4 h-4 text-emerald-400/80" />
            </div>
            <div className="text-3xl font-black text-white mt-3">
              {velocityRate}%
            </div>
          </div>
        </div>

        {/* Active Assignments List */}
        <div className="space-y-3.5 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white tracking-tight">Active Task Assignments</h2>
            <Link
              to="/projects"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {assignedTasks.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#16181d] border border-white/5 text-xs text-slate-400">
              No tasks currently assigned.
            </div>
          ) : (
            <div className="rounded-2xl bg-[#16181d] border border-white/5 divide-y divide-white/5 overflow-hidden">
              {assignedTasks.slice(0, 6).map((task) => {
                const statusLabel =
                  (task.status || 'todo').toLowerCase() === 'in_progress'
                    ? 'In Progress'
                    : (task.status || 'todo').toLowerCase() === 'done' || (task.status || 'todo').toLowerCase() === 'completed'
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
                        <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                          {task.title}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          in {task.projectName || 'Workspace'}
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
      </div>
    </AppShell>
  );
}

function Building2(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v8" />
      <path d="M18 9h2a2 2 0 0 1 2 2v11" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
