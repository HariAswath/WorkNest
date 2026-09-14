import React, { useState, useEffect } from 'react';
import { X, CheckSquare, AlertCircle, Loader2, User } from 'lucide-react';

export default function CreateTaskModal({
  isOpen,
  onClose,
  onTaskCreated,
  initialStatus = 'todo',
  members = [],
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [assignedTo, setAssignedTo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setStatus(initialStatus || 'todo');
      setAssignedTo('');
      setError('');
    }
  }, [isOpen, initialStatus]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onTaskCreated({
        title: title.trim(),
        description: description.trim(),
        status,
        assignedTo: assignedTo || undefined,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg z-10 p-6 sm:p-7 rounded-3xl bg-[#16181d] border border-white/10 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <CheckSquare className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Create Workspace Task</h3>
              <p className="text-xs text-slate-400">Define milestone task and assignment</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2" htmlFor="taskTitle">
              Task Title <span className="text-slate-400">*</span>
            </label>
            <input
              id="taskTitle"
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement OAuth2 Provider Callback"
              className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-white/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2" htmlFor="taskDesc">
              Description <span className="text-slate-500 text-[10px] lowercase">(optional)</span>
            </label>
            <textarea
              id="taskDesc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Technical notes, acceptance criteria, or endpoint specs..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-white/30 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Initial Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-white/30 cursor-pointer"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Completed</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Assignee
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-white/30 cursor-pointer"
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
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating task...</span>
                </>
              ) : (
                <span>Create Task</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
