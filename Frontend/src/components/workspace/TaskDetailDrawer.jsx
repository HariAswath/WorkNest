import React, { useState, useEffect } from 'react';
import { taskApi } from '../../api/task.api';
import {
  X,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  User,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  Loader2,
  CheckSquare,
  AlertCircle
} from 'lucide-react';

export default function TaskDetailDrawer({
  projectId,
  taskId,
  initialTask = null,
  onClose,
  onTaskUpdated,
  onTaskDeleted,
  members = [],
  userRole,
  canManageTasks: propCanManageTasks,
}) {
  const [task, setTask] = useState(initialTask);
  const [loading, setLoading] = useState(!initialTask);
  const [error, setError] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [updating, setUpdating] = useState(false);

  const canManageTasks = propCanManageTasks !== undefined
    ? propCanManageTasks
    : (userRole === 'admin' || userRole === 'project_admin');
  const isUserAdmin = userRole === 'admin';

  // Fetch complete task with subtasks
  const fetchTaskDetails = async () => {
    if (!initialTask) setLoading(true);
    setError('');

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(projectId) && /^[0-9a-fA-F]{24}$/.test(taskId);

    if (isMongoId) {
      try {
        const response = await taskApi.getTaskById(projectId, taskId);
        if (response?.data) {
          setTask(response.data);
          setLoading(false);
          return;
        }
      } catch (err) {
        // Fallback
      }
    }

    if (initialTask) {
      setTask(initialTask);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId, initialTask]);

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    setTask((prev) => ({ ...prev, status: newStatus }));
    onTaskUpdated({ ...(task || initialTask), status: newStatus });

    if (/^[0-9a-fA-F]{24}$/.test(projectId) && /^[0-9a-fA-F]{24}$/.test(taskId)) {
      try {
        await taskApi.updateTask(projectId, taskId, { status: newStatus });
      } catch (err) {
        // Ignored in demo mode
      }
    }
  };

  // Handle assignee change
  const handleAssigneeChange = async (newAssigneeId) => {
    const updatedUser = members.find((m) => m.user._id === newAssigneeId)?.user || null;
    setTask((prev) => ({ ...prev, assignedTo: updatedUser }));
    onTaskUpdated({ ...(task || initialTask), assignedTo: updatedUser });

    if (/^[0-9a-fA-F]{24}$/.test(projectId) && /^[0-9a-fA-F]{24}$/.test(taskId)) {
      try {
        await taskApi.updateTask(projectId, taskId, {
          assignedTo: newAssigneeId || null,
        });
      } catch (err) {
        // Ignored in demo mode
      }
    }
  };

  // Handle adding a subtask
  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    setAddingSubtask(true);
    const newSt = {
      _id: `st_${Date.now()}`,
      title: newSubtaskTitle.trim(),
      isCompleted: false,
    };

    if (/^[0-9a-fA-F]{24}$/.test(projectId) && /^[0-9a-fA-F]{24}$/.test(taskId)) {
      try {
        const response = await taskApi.createSubTask(projectId, taskId, {
          title: newSubtaskTitle.trim(),
        });
        if (response?.data) {
          const updated = {
            ...task,
            subtasks: [...(task.subtasks || []), response.data],
          };
          setTask(updated);
          onTaskUpdated(updated);
          setNewSubtaskTitle('');
          setAddingSubtask(false);
          return;
        }
      } catch (err) {
        // Fallback below
      }
    }

    const updated = {
      ...task,
      subtasks: [...(task?.subtasks || []), newSt],
    };
    setTask(updated);
    onTaskUpdated(updated);
    setNewSubtaskTitle('');
    setAddingSubtask(false);
  };

  // Handle toggling subtask completion
  const handleToggleSubtask = async (subTaskId, currentStatus) => {
    const updatedSubtasks = (task?.subtasks || []).map((st) =>
      st._id === subTaskId ? { ...st, isCompleted: !currentStatus } : st
    );
    const updated = { ...task, subtasks: updatedSubtasks };
    setTask(updated);
    onTaskUpdated(updated);

    if (/^[0-9a-fA-F]{24}$/.test(projectId) && /^[0-9a-fA-F]{24}$/.test(subTaskId)) {
      try {
        await taskApi.updateSubTask(projectId, subTaskId, {
          isCompleted: !currentStatus,
        });
      } catch (err) {
        // Ignored in demo
      }
    }
  };

  // Handle deleting subtask
  const handleDeleteSubtask = async (subTaskId) => {
    const updatedSubtasks = (task?.subtasks || []).filter((st) => st._id !== subTaskId);
    const updated = { ...task, subtasks: updatedSubtasks };
    setTask(updated);
    onTaskUpdated(updated);

    if (/^[0-9a-fA-F]{24}$/.test(projectId) && /^[0-9a-fA-F]{24}$/.test(subTaskId)) {
      try {
        await taskApi.deleteSubTask(projectId, subTaskId);
      } catch (err) {
        // Ignored in demo
      }
    }
  };

  // Handle task deletion
  const handleDeleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskApi.deleteTask(projectId, taskId);
      onTaskDeleted(taskId);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to delete task');
    }
  };

  // Subtask progress calculation
  const subtasks = task?.subtasks || [];
  const completedCount = subtasks.filter((st) => st.isCompleted).length;
  const progressPercent =
    subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-Over Drawer */}
      <div className="relative w-full max-w-xl bg-[#16181d] border-l border-white/5 shadow-2xl z-10 flex flex-col h-full animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Task Specification & Execution
            </span>
          </div>

          <div className="flex items-center gap-2">
            {canManageTasks && (
              <button
                type="button"
                onClick={handleDeleteTask}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-3" />
            <p className="text-xs text-slate-400">Loading task details...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-rose-300">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                {task?.title}
              </h2>
            </div>

            {/* Stage & Assignee Attributes */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#111216] border border-white/5">
              {/* Status Display/Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Workflow Status
                </label>
                {canManageTasks ? (
                  <select
                    value={task?.status || 'todo'}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#16181d] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-white/30 cursor-pointer"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Completed</option>
                  </select>
                ) : (
                  <div className="w-full px-3 py-2 rounded-xl bg-[#16181d] border border-white/5 text-xs font-semibold text-slate-200 flex items-center justify-between">
                    <span className="capitalize">
                      {task?.status === 'done' ? 'Completed' : task?.status === 'in_progress' ? 'In Progress' : 'To Do'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Fixed</span>
                  </div>
                )}
              </div>

              {/* Assignee Display/Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Assignee
                </label>
                {canManageTasks ? (
                  <select
                    value={task?.assignedTo?._id || ''}
                    onChange={(e) => handleAssigneeChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#16181d] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-white/30 cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {members.map((m) => {
                      const userId = m.user?._id || m._id;
                      const userName = m.user?.username || m.username;
                      const userRole = m.role || 'member';
                      return (
                        <option key={userId} value={userId}>
                          {userName} ({userRole})
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <div className="w-full px-3 py-2 rounded-xl bg-[#16181d] border border-white/5 text-xs font-semibold text-slate-200 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">
                      {task?.assignedTo?.fullName || task?.assignedTo?.username || 'Unassigned'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Description & Specifications
              </h4>
              <div className="p-4 rounded-xl bg-[#111216] border border-white/5 text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {task?.description || 'No description provided for this task.'}
              </div>
            </div>

            {/* Subtasks Section */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-slate-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Subtask Checklist ({completedCount}/{subtasks.length})
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {progressPercent}% Done
                </span>
              </div>

              {/* Monochromatic Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Subtask Items List */}
              <div className="space-y-2">
                {subtasks.length === 0 && !canManageTasks && (
                  <div className="p-4 rounded-xl bg-[#111216] border border-dashed border-white/5 text-center text-xs text-slate-500">
                    No subtasks defined for this task.
                  </div>
                )}

                {subtasks.map((st) => (
                  <div
                    key={st._id}
                    className="p-3 rounded-xl bg-[#111216] border border-white/5 flex items-center justify-between gap-3 group hover:border-white/15 transition-colors"
                  >
                    {/* Toggle button enabled for all roles including Member */}
                    <button
                      type="button"
                      onClick={() => handleToggleSubtask(st._id, st.isCompleted)}
                      className="flex items-center gap-3 text-left flex-1 focus:outline-none cursor-pointer"
                      title="Click to toggle subtask completion"
                    >
                      {st.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-white" />
                      )}
                      <span
                        className={`text-xs ${
                          st.isCompleted ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {st.title}
                      </span>
                    </button>

                    {/* Delete Subtask only for Admin / Project Admin */}
                    {canManageTasks && (
                      <button
                        type="button"
                        onClick={() => handleDeleteSubtask(st._id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity cursor-pointer"
                        title="Delete subtask"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Subtask Form (Admin & Project Admin only) */}
              {canManageTasks && (
                <form onSubmit={handleAddSubtask} className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Add a new checklist step..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
                  />
                  <button
                    type="submit"
                    disabled={addingSubtask || !newSubtaskTitle.trim()}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-sm shrink-0"
                  >
                    {addingSubtask ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                    <span>Add</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
