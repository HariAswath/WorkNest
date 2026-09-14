import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { projectApi } from '../../api/project.api';
import { taskApi } from '../../api/task.api';
import AppShell from '../../components/layout/AppShell';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  CheckSquare,
  Layers,
  FolderKanban,
  Loader2,
  AlertCircle,
  Filter
} from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('all');

  // Fetch real projects and their tasks
  const fetchAnalyticsData = async () => {
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
      setError(err.message || 'Unable to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  // Filter tasks by selected project
  const filteredTasks = useMemo(() => {
    if (selectedProjectId === 'all') return allTasks;
    return allTasks.filter((t) => t.projectId === selectedProjectId);
  }, [allTasks, selectedProjectId]);

  // Compute Metrics
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(
    (t) => (t.status || '').toLowerCase() === 'done' || (t.status || '').toLowerCase() === 'completed'
  ).length;
  const inProgressTasks = filteredTasks.filter(
    (t) => (t.status || '').toLowerCase() === 'in_progress'
  ).length;
  const todoTasks = filteredTasks.filter(
    (t) => (t.status || '').toLowerCase() === 'todo' || !t.status
  ).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Priority counts
  const highPriority = filteredTasks.filter((t) => (t.priority || '').toLowerCase() === 'high').length;
  const mediumPriority = filteredTasks.filter(
    (t) => (t.priority || '').toLowerCase() === 'medium' || !t.priority
  ).length;
  const lowPriority = filteredTasks.filter((t) => (t.priority || '').toLowerCase() === 'low').length;

  // Subtasks metrics
  const subtaskMetrics = useMemo(() => {
    let totalSubtasks = 0;
    let completedSubtasks = 0;
    filteredTasks.forEach((t) => {
      if (t.subtasks && Array.isArray(t.subtasks)) {
        totalSubtasks += t.subtasks.length;
        completedSubtasks += t.subtasks.filter((s) => s.isCompleted || s.completed).length;
      }
    });
    const rate = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
    return { totalSubtasks, completedSubtasks, rate };
  }, [filteredTasks]);

  // Contributor workload map
  const contributorWorkload = useMemo(() => {
    const map = {};
    filteredTasks.forEach((t) => {
      const u = t.assignedTo;
      const key = u?._id || u?.email || u?.username || 'Unassigned';
      const name = u?.fullName || u?.username || (key === 'Unassigned' ? 'Unassigned' : 'Contributor');
      if (!map[key]) {
        map[key] = {
          name,
          username: u?.username || 'user',
          total: 0,
          completed: 0,
          inProgress: 0,
        };
      }
      map[key].total += 1;
      const st = (t.status || '').toLowerCase();
      if (st === 'done' || st === 'completed') {
        map[key].completed += 1;
      } else if (st === 'in_progress') {
        map[key].inProgress += 1;
      }
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [filteredTasks]);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto w-full space-y-7">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Analytics
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Performance metrics, velocity, and workload distribution across your workspaces.
            </p>
          </div>

          {/* Project Filter Selector */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#16181d] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-white/30 cursor-pointer"
            >
              <option value="all">All Workspaces ({projects.length})</option>
              {projects.map((item) => {
                const p = item.project || item;
                return (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-3" />
            <p className="text-xs text-slate-400">Loading analytics metrics...</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchAnalyticsData}
              className="px-3 py-1 rounded bg-rose-500/20 text-rose-200 text-xs font-semibold cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 4 Metric Cards */}
            <div
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
            >
              {/* Card 1: Total Tasks */}
              <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 flex flex-col justify-between shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    TOTAL TASKS
                  </span>
                  <FolderKanban className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-3xl font-black text-white">{totalTasks}</div>
                <div className="text-[11px] text-slate-400 pt-1">
                  Across {selectedProjectId === 'all' ? `${projects.length} workspaces` : 'selected workspace'}
                </div>
              </div>

              {/* Card 2: In Progress */}
              <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 flex flex-col justify-between shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    IN PROGRESS
                  </span>
                  <Clock className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-3xl font-black text-white">{inProgressTasks}</div>
                <div className="text-[11px] text-slate-400 pt-1">Active items currently in flight</div>
              </div>

              {/* Card 3: Completion Rate */}
              <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 flex flex-col justify-between shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    COMPLETION RATE
                  </span>
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-3xl font-black text-white">{completionRate}%</div>
                <div className="w-full h-1.5 rounded-full bg-[#111216] overflow-hidden mt-1">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between pt-1">
                  <span>{completedTasks} completed</span>
                  <span>{totalTasks} total</span>
                </div>
              </div>

              {/* Card 4: Subtasks Resolved */}
              <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 flex flex-col justify-between shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    SUBTASK RESOLUTION
                  </span>
                  <CheckSquare className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-3xl font-black text-white">
                  {subtaskMetrics.completedSubtasks} / {subtaskMetrics.totalSubtasks}
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  {subtaskMetrics.rate}% checklists checked
                </div>
              </div>
            </div>

            {/* Pipeline & Priority Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Pipeline & Priority (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Status Pipeline Breakdown */}
                <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-slate-400" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Status Pipeline
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400">{totalTasks} Total Tasks</span>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-3 rounded-full bg-[#111216] overflow-hidden flex gap-0.5 mb-5">
                    {todoTasks > 0 && (
                      <div
                        title={`To Do: ${todoTasks}`}
                        className="bg-slate-600 h-full transition-all"
                        style={{ width: `${(todoTasks / (totalTasks || 1)) * 100}%` }}
                      />
                    )}
                    {inProgressTasks > 0 && (
                      <div
                        title={`In Progress: ${inProgressTasks}`}
                        className="bg-slate-300 h-full transition-all"
                        style={{ width: `${(inProgressTasks / (totalTasks || 1)) * 100}%` }}
                      />
                    )}
                    {completedTasks > 0 && (
                      <div
                        title={`Completed: ${completedTasks}`}
                        className="bg-emerald-500 h-full transition-all"
                        style={{ width: `${(completedTasks / (totalTasks || 1)) * 100}%` }}
                      />
                    )}
                  </div>

                  {/* 3 Status Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#111216] border border-white/5 text-center">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        To Do
                      </div>
                      <div className="text-lg font-black text-white">{todoTasks}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {totalTasks > 0 ? Math.round((todoTasks / totalTasks) * 100) : 0}%
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#111216] border border-white/5 text-center">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        In Progress
                      </div>
                      <div className="text-lg font-black text-white">{inProgressTasks}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0}%
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#111216] border border-white/5 text-center">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Completed
                      </div>
                      <div className="text-lg font-black text-white">{completedTasks}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Priority Breakdown */}
                <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-slate-400" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Priority Distribution
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {/* High */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-300 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-400" /> High Priority
                        </span>
                        <span className="font-mono text-slate-400 text-xs">{highPriority} tasks</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#111216] overflow-hidden">
                        <div
                          className="h-full bg-rose-400 rounded-full transition-all"
                          style={{ width: `${totalTasks > 0 ? (highPriority / totalTasks) * 100 : 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Medium */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-300 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400" /> Medium Priority
                        </span>
                        <span className="font-mono text-slate-400 text-xs">{mediumPriority} tasks</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#111216] overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all"
                          style={{ width: `${totalTasks > 0 ? (mediumPriority / totalTasks) * 100 : 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Low */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-300 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-slate-500" /> Low Priority
                        </span>
                        <span className="font-mono text-slate-400 text-xs">{lowPriority} tasks</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#111216] overflow-hidden">
                        <div
                          className="h-full bg-slate-500 rounded-full transition-all"
                          style={{ width: `${totalTasks > 0 ? (lowPriority / totalTasks) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contributor Workload (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Contributor Workload
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400">{contributorWorkload.length} Assignees</span>
                  </div>

                  <div className="space-y-3 max-h-[480px] overflow-y-auto no-scrollbar pr-1">
                    {contributorWorkload.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-500">
                        No assigned tasks found.
                      </div>
                    ) : (
                      contributorWorkload.map((item, idx) => {
                        const initial = item.name.charAt(0).toUpperCase();
                        const rate = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;

                        return (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-[#111216] border border-white/5 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-[#232630] border border-white/10 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                                  {initial}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-white">{item.name}</div>
                                  <div className="text-[10px] text-slate-400">@{item.username}</div>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-xs font-semibold text-slate-200">
                                  {item.total} Tasks
                                </div>
                                <div className="text-[10px] text-slate-400">{item.completed} Done</div>
                              </div>
                            </div>

                            {/* Workload bar */}
                            <div className="w-full h-1.5 rounded-full bg-[#16181d] overflow-hidden">
                              <div
                                className="h-full bg-white rounded-full transition-all"
                                style={{ width: `${rate}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
