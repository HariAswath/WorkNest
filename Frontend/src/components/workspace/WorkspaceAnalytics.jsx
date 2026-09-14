import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  CheckSquare,
  Sparkles,
  Layers,
  ArrowUpRight,
  Flame,
  PieChart
} from 'lucide-react';

export default function WorkspaceAnalytics({ project, tasks = [], members = [] }) {
  // Compute analytics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done' || t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const todoTasks = tasks.filter((t) => t.status === 'todo' || !t.status).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Priority counts
  const highPriority = tasks.filter((t) => t.priority === 'high').length;
  const mediumPriority = tasks.filter((t) => t.priority === 'medium' || !t.priority).length;
  const lowPriority = tasks.filter((t) => t.priority === 'low').length;

  // Aggregate subtasks count & completion
  const subtaskMetrics = useMemo(() => {
    let totalSubtasks = 0;
    let completedSubtasks = 0;
    tasks.forEach((t) => {
      if (t.subtasks && Array.isArray(t.subtasks)) {
        totalSubtasks += t.subtasks.length;
        completedSubtasks += t.subtasks.filter((s) => s.isCompleted || s.completed).length;
      }
    });
    const rate = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
    return { totalSubtasks, completedSubtasks, rate };
  }, [tasks]);

  // Workload per member
  const memberWorkload = useMemo(() => {
    const workloadMap = {};
    members.forEach((m) => {
      const uId = m.user?._id || 'unknown';
      workloadMap[uId] = {
        member: m,
        total: 0,
        completed: 0,
        inProgress: 0,
      };
    });

    tasks.forEach((t) => {
      const uId = t.assignedTo?._id;
      if (uId && workloadMap[uId]) {
        workloadMap[uId].total += 1;
        if (t.status === 'done' || t.status === 'completed') {
          workloadMap[uId].completed += 1;
        } else if (t.status === 'in_progress') {
          workloadMap[uId].inProgress += 1;
        }
      }
    });

    return Object.values(workloadMap);
  }, [members, tasks]);

  // Sprint health rating
  const sprintHealth = useMemo(() => {
    if (totalTasks === 0) return { score: 100, label: 'Optimal', color: 'emerald' };
    if (completionRate >= 70) return { score: 94, label: 'Velocity High', color: 'emerald' };
    if (completionRate >= 40) return { score: 82, label: 'On Track', color: 'slate' };
    if (inProgressTasks > todoTasks) return { score: 75, label: 'Active Progress', color: 'slate' };
    return { score: 65, label: 'Needs Momentum', color: 'slate' };
  }, [totalTasks, completionRate, inProgressTasks, todoTasks]);

  return (
    <div className="space-y-6">
      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completion Velocity */}
        <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">COMPLETION RATE</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-black text-white">{completionRate}%</div>
          <div className="w-full h-1.5 rounded-full bg-[#111216] overflow-hidden">
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

        {/* Tasks in Flight */}
        <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">IN PROGRESS</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-black text-white">{inProgressTasks}</div>
          <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
            Active items currently in progress.
          </p>
        </div>

        {/* Subtask Checklists */}
        <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">SUBTASKS RESOLVED</span>
            <CheckSquare className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {subtaskMetrics.completedSubtasks} / {subtaskMetrics.totalSubtasks}
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#111216] overflow-hidden">
            <div
              className="h-full bg-slate-300 rounded-full transition-all duration-500"
              style={{ width: `${subtaskMetrics.rate}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 pt-1">{subtaskMetrics.rate}% checklist resolution</div>
        </div>

        {/* Active Team */}
        <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TEAM MEMBERS</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-black text-white">{members.length}</div>
          <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
            Active collaborators in workspace.
          </p>
        </div>
      </div>

      {/* Main Charts & Visual Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Pipeline Distribution & Priority Matrix (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Status Pipeline Breakdown */}
          <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Status Pipeline</h3>
              </div>
              <span className="text-xs text-slate-400">{totalTasks} Total Tasks</span>
            </div>

            {/* Visual Stacked Bar */}
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

            {/* Pipeline Step Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#111216] border border-white/5 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">To Do</div>
                <div className="text-lg font-black text-white">{todoTasks}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {totalTasks > 0 ? Math.round((todoTasks / totalTasks) * 100) : 0}%
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111216] border border-white/5 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">In Progress</div>
                <div className="text-lg font-black text-white">{inProgressTasks}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0}%
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111216] border border-white/5 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Completed</div>
                <div className="text-lg font-black text-white">{completedTasks}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>

          {/* Priority Severity Breakdown */}
          <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Priority Distribution</h3>
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

        {/* Right Column: Contributor & Workload Distribution (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Contributor Workload</h3>
              </div>
              <span className="text-xs text-slate-400">{members.length} Members</span>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto no-scrollbar pr-1">
              {memberWorkload.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">No member data recorded.</div>
              ) : (
                memberWorkload.map((item, idx) => {
                  const m = item.member;
                  const name = m.user?.fullName || m.user?.username || 'Contributor';
                  const initial = name.charAt(0).toUpperCase();
                  const rate = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;

                  return (
                    <div
                      key={m.user?._id || idx}
                      className="p-3.5 rounded-xl bg-[#111216] border border-white/5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#232630] border border-white/10 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                            {initial}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{name}</div>
                            <div className="text-[10px] text-slate-400">@{m.user?.username || 'member'}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-semibold text-slate-200">{item.total} Tasks</div>
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
  );
}
