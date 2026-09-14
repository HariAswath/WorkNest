import React, { useState, useMemo } from 'react';
import {
  Plus,
  MoreVertical,
  Calendar,
  CheckSquare,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  User,
  Users,
  LayoutGrid,
  Columns,
  Layers,
  Filter,
  Check
} from 'lucide-react';

export default function KanbanBoard({
  tasks = [],
  members = [],
  canManageTasks = true,
  onSelectTask,
  onOpenCreateTaskWithStatus,
  onUpdateTaskStatus,
}) {
  // Member filter: 'all' or specific member ID / 'unassigned'
  const [selectedMemberFilter, setSelectedMemberFilter] = useState('all');

  const columns = [
    {
      id: 'todo',
      title: 'To Do',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
    },
    {
      id: 'done',
      title: 'Completed',
    },
  ];

  // Helpers to safely extract member info
  const getMemberId = (m) => m?.user?._id || m?._id || (typeof m === 'string' ? m : null);
  const getMemberName = (m) => m?.user?.fullName || m?.fullName || m?.user?.username || m?.username || 'Member';
  const getMemberUsername = (m) => m?.user?.username || m?.username || '';
  const getMemberRole = (m) => (m?.role || 'MEMBER').toUpperCase();

  // Helper to get task assignee ID
  const getTaskAssigneeId = (task) => {
    if (!task?.assignedTo) return 'unassigned';
    if (typeof task.assignedTo === 'string') return task.assignedTo;
    return task.assignedTo._id || task.assignedTo.id || 'unassigned';
  };

  // Helper to get task assignee display name
  const getTaskAssigneeName = (task) => {
    if (!task?.assignedTo) return 'Unassigned';
    if (typeof task.assignedTo === 'string') return 'Assigned Member';
    return task.assignedTo.fullName || task.assignedTo.username || 'Assigned Member';
  };

  // Calculate detailed per-member statistics and task buckets
  const memberMetrics = useMemo(() => {
    const memberMap = new Map();

    members.forEach((m) => {
      const id = getMemberId(m);
      if (id) {
        memberMap.set(id, {
          id,
          name: getMemberName(m),
          username: getMemberUsername(m),
          role: getMemberRole(m),
          avatarLetter: (getMemberName(m) || 'U').charAt(0).toUpperCase(),
          totalTasks: 0,
          todoTasks: 0,
          inProgressTasks: 0,
          completedTasks: 0,
          subtasksTotal: 0,
          subtasksDone: 0,
          tasks: [],
        });
      }
    });

    let unassignedBucket = {
      id: 'unassigned',
      name: 'Unassigned',
      username: 'unassigned',
      role: 'OPEN POOL',
      avatarLetter: '?',
      totalTasks: 0,
      todoTasks: 0,
      inProgressTasks: 0,
      completedTasks: 0,
      subtasksTotal: 0,
      subtasksDone: 0,
      tasks: [],
    };

    tasks.forEach((task) => {
      const assigneeId = getTaskAssigneeId(task);
      const status = (task.status || 'todo').toLowerCase();
      const subtasks = task.subtasks || [];
      const subtaskDone = subtasks.filter((s) => s.isCompleted || s.completed).length;

      let memberObj = memberMap.get(assigneeId);
      if (!memberObj && assigneeId !== 'unassigned') {
        const name = getTaskAssigneeName(task);
        memberObj = {
          id: assigneeId,
          name: name,
          username: task.assignedTo?.username || '',
          role: 'MEMBER',
          avatarLetter: (name || 'U').charAt(0).toUpperCase(),
          totalTasks: 0,
          todoTasks: 0,
          inProgressTasks: 0,
          completedTasks: 0,
          subtasksTotal: 0,
          subtasksDone: 0,
          tasks: [],
        };
        memberMap.set(assigneeId, memberObj);
      }

      const target = memberObj || unassignedBucket;
      target.totalTasks += 1;
      target.tasks.push(task);
      target.subtasksTotal += subtasks.length;
      target.subtasksDone += subtaskDone;

      if (status === 'done' || status === 'completed') {
        target.completedTasks += 1;
      } else if (status === 'in_progress') {
        target.inProgressTasks += 1;
      } else {
        target.todoTasks += 1;
      }
    });

    const list = Array.from(memberMap.values());
    if (unassignedBucket.totalTasks > 0) {
      list.push(unassignedBucket);
    }

    return list.map((m) => {
      const completionPercent = m.totalTasks > 0 ? Math.round((m.completedTasks / m.totalTasks) * 100) : 0;
      const pendingTasks = m.todoTasks + m.inProgressTasks;
      return {
        ...m,
        completionPercent,
        pendingTasks,
      };
    });
  }, [members, tasks]);

  // Overall Board Completion Stats
  const overallStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => (t.status || 'todo').toLowerCase() === 'done').length;
    const inProgress = tasks.filter((t) => (t.status || 'todo').toLowerCase() === 'in_progress').length;
    const todo = tasks.filter((t) => (t.status || 'todo').toLowerCase() === 'todo').length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, todo, percent };
  }, [tasks]);

  // Filter tasks based on selected member filter
  const displayedTasks = useMemo(() => {
    if (selectedMemberFilter === 'all') return tasks;
    return tasks.filter((t) => getTaskAssigneeId(t) === selectedMemberFilter);
  }, [tasks, selectedMemberFilter]);

  const getTasksByStatus = (status) => {
    return displayedTasks.filter((t) => (t.status || 'todo').toLowerCase() === status.toLowerCase());
  };

  const selectedMemberName = useMemo(() => {
    if (selectedMemberFilter === 'all') return 'All Members';
    const found = memberMetrics.find((m) => m.id === selectedMemberFilter);
    return found ? found.name : 'Selected Member';
  }, [selectedMemberFilter, memberMetrics]);

  return (
    <div className="w-full space-y-7 select-none">
      {/* ========================================================================= */}
      {/* 1. TOP METRICS ROW: 4 Cards in a single row */}
      {/* ========================================================================= */}
      <div
        className="grid grid-cols-4 gap-4 w-full"
        style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
      >
        {/* Card 1: Total Members */}
        <div className="rounded-2xl bg-[#16181d] border border-white/5 p-5 flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              TOTAL MEMBERS
            </span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {members.length || 1}
          </div>
        </div>

        {/* Card 2: Total Tasks */}
        <div className="rounded-2xl bg-[#16181d] border border-white/5 p-5 flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              TOTAL TASKS
            </span>
            <CheckSquare className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {overallStats.total}
          </div>
        </div>

        {/* Card 3: Tasks In Progress */}
        <div className="rounded-2xl bg-[#16181d] border border-white/5 p-5 flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              TASKS IN PROGRESS
            </span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {overallStats.inProgress}
          </div>
        </div>

        {/* Card 4: Completed Tasks */}
        <div className="rounded-2xl bg-[#16181d] border border-white/5 p-5 flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              COMPLETED TASKS
            </span>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white tracking-tight">
              {overallStats.completed}
            </span>
            <span className="text-xs font-mono font-semibold text-slate-400">
              {overallStats.percent}% Done
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TEAM MEMBERS WORKLOAD & PROGRESS (Exact layout of 'Your Workspaces') */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-white tracking-tight">
            Team Workload & Progress
          </h2>
          {selectedMemberFilter !== 'all' ? (
            <button
              type="button"
              onClick={() => setSelectedMemberFilter('all')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Show All Members</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-xs text-slate-500 font-mono">
              {memberMetrics.length} Members
            </span>
          )}
        </div>

        {/* Member Cards Grid with Compact Width Limit */}
        <div
          className="grid gap-4 w-full"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 320px))',
          }}
        >
          {memberMetrics.map((m) => {
            const isSelected = selectedMemberFilter === m.id;

            return (
              <div
                key={m.id}
                onClick={() => setSelectedMemberFilter(isSelected ? 'all' : m.id)}
                className={`w-full rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between space-y-3.5 ${
                  isSelected
                    ? 'bg-[#1c1f26] border-white/30 shadow-md ring-1 ring-white/20'
                    : 'bg-[#16181d] border-white/5 hover:border-white/15 hover:bg-[#1a1d24]'
                }`}
              >
                {/* Top Row: Role Badge + Arrow */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                    {m.role}
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? 'text-white translate-x-0.5' : 'text-slate-500'
                    }`}
                  />
                </div>

                {/* Middle: Member Name & Completion Info */}
                <div>
                  <h3 className="text-xs font-bold text-white tracking-tight truncate">
                    {m.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {m.totalTasks === 0
                      ? 'No tasks assigned'
                      : `${m.completedTasks} of ${m.totalTasks} tasks done (${m.completionPercent}%)`}
                  </p>

                  {/* Clean Monochromatic Progress Bar */}
                  {m.totalTasks > 0 && (
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-2.5">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${m.completionPercent}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Bottom Row: Pending count & Filter trigger */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3 h-3 text-slate-500" />
                    <span>{m.pendingTasks} to do</span>
                  </div>
                  <span className={isSelected ? 'text-white font-semibold text-[11px]' : 'text-slate-500 text-[11px]'}>
                    {isSelected ? 'Active Filter ✓' : 'Filter Tasks >'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. KANBAN COLUMNS SECTION */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white tracking-tight">
              Kanban Board
            </h2>
            {selectedMemberFilter !== 'all' && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                Filtered: {selectedMemberName}
              </span>
            )}
          </div>
        </div>

        {/* 3 Columns evenly spaced in a 3-column grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start w-full"
          style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
        >
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);

            return (
              <div key={column.id} className="flex flex-col space-y-3 w-full min-w-0">
                {/* Column Header */}
                <div className="flex items-center justify-between px-1 pb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">{column.title}</h3>
                    <span className="text-[10px] font-mono text-slate-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                      {columnTasks.length}
                    </span>
                  </div>

                  {canManageTasks && (
                    <button
                      type="button"
                      onClick={() => onOpenCreateTaskWithStatus(column.id)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                      title={`Add task to ${column.title}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Tasks Column Well */}
                <div className="space-y-3 min-h-[160px] flex flex-col">
                  {columnTasks.length === 0 ? (
                    canManageTasks ? (
                      <div
                        onClick={() => onOpenCreateTaskWithStatus(column.id)}
                        className="p-6 text-center rounded-2xl border border-dashed border-white/10 hover:border-white/20 bg-[#16181d]/40 hover:bg-[#16181d] text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer flex flex-col items-center justify-center gap-1.5 min-h-[140px] w-full"
                      >
                        <Plus className="w-4 h-4 opacity-50 mb-0.5" />
                        <span className="text-xs font-medium">No tasks in {column.title}</span>
                        <span className="text-[10px] text-slate-600">
                          {selectedMemberFilter !== 'all' ? 'for this member' : '+ Add new task'}
                        </span>
                      </div>
                    ) : (
                      <div className="p-6 text-center rounded-2xl border border-dashed border-white/5 bg-[#16181d]/30 text-xs text-slate-500 flex flex-col items-center justify-center gap-1 min-h-[140px] w-full">
                        <span className="text-xs font-medium text-slate-400">No tasks in {column.title}</span>
                        <span className="text-[10px] text-slate-600">
                          {selectedMemberFilter !== 'all' ? 'for this member' : 'No items in this stage'}
                        </span>
                      </div>
                    )
                  ) : (
                    columnTasks.map((task) => {
                      const priority = (task.priority || 'medium').toLowerCase();
                      const subtasks = task.subtasks || [];
                      const subtaskCount = subtasks.length;
                      const subtaskDone = subtasks.filter((s) => s.isCompleted || s.completed).length;
                      const subtaskPercent = subtaskCount > 0 ? Math.round((subtaskDone / subtaskCount) * 100) : 0;
                      const assigneeName = getTaskAssigneeName(task);

                      return (
                        <div
                          key={task._id}
                          onClick={() => onSelectTask(task)}
                          className="p-4 rounded-2xl bg-[#16181d] hover:bg-[#1d1f27] border border-white/5 hover:border-white/15 transition-all shadow-sm hover:shadow-md cursor-pointer group space-y-3 w-full"
                        >
                          {/* Top Meta Row: Priority Badge + More Menu */}
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider bg-white/5 border border-white/10 text-slate-300">
                              {priority}
                            </span>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectTask(task);
                              }}
                              className="text-slate-500 hover:text-white transition-colors"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Title & Description */}
                          <div>
                            <h4 className="text-xs font-semibold text-white group-hover:text-slate-200 transition-colors leading-snug">
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                {task.description}
                              </p>
                            )}
                          </div>

                          {/* Subtask Counter if any */}
                          {subtaskCount > 0 && (
                            <div className="space-y-1 pt-1">
                              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                                <div className="flex items-center gap-1.5">
                                  <CheckSquare className="w-3 h-3 text-slate-500" />
                                  <span>{subtaskDone}/{subtaskCount} subtasks</span>
                                </div>
                                <span className="text-slate-500">{subtaskPercent}%</span>
                              </div>
                              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-slate-300 rounded-full transition-all"
                                  style={{ width: `${subtaskPercent}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Bottom Row: Member Assignee & Stage switcher */}
                          <div className="flex items-center justify-between pt-2.5 border-t border-white/5 text-[11px] text-slate-400">
                            <div className="flex items-center gap-1.5 truncate max-w-[140px]">
                              <User className="w-3 h-3 text-slate-500 shrink-0" />
                              <span className="truncate text-slate-300 text-[11px] font-medium">
                                {assigneeName}
                              </span>
                            </div>

                            {/* Stage Transition Arrows (Admin & Project Admin only) */}
                            {canManageTasks ? (
                              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                {column.id !== 'todo' && (
                                  <button
                                    onClick={() =>
                                      onUpdateTaskStatus(
                                        task._id,
                                        column.id === 'done' ? 'in_progress' : 'todo'
                                      )
                                    }
                                    className="p-1 rounded text-slate-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                    title="Move back"
                                  >
                                    <ArrowLeft className="w-3 h-3" />
                                  </button>
                                )}

                                {column.id !== 'done' && (
                                  <button
                                    onClick={() =>
                                      onUpdateTaskStatus(
                                        task._id,
                                        column.id === 'todo' ? 'in_progress' : 'done'
                                      )
                                    }
                                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                    title="Move forward"
                                  >
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors">
                                <span>View</span>
                                <ArrowRight className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
