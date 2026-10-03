import React, { useState, useEffect } from 'react';
import {
  X,
  MessageSquare,
  Sparkles,
  Hash,
  Tag,
  Link2,
  FolderKanban,
  CheckSquare,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { taskApi } from '../../api/task.api';

const CHANNELS = [
  { id: 'general', name: 'general', desc: 'Company-wide topics and workspace chatter' },
  { id: 'architecture', name: 'architecture', desc: 'RFCs, system design, and tech stack decisions' },
  { id: 'sprint-planning', name: 'sprint-planning', desc: 'Iteration scopes, milestones, and deliverables' },
  { id: 'announcements', name: 'announcements', desc: 'Official product releases and milestone updates' },
  { id: 'qa-bugs', name: 'qa-bugs', desc: 'Bug investigations, regression triage, and fixes' },
  { id: 'random', name: 'random', desc: 'Casual banter, engineering memes, and watercooler' },
];

export default function CreateDiscussionModal({
  isOpen,
  onClose,
  onDiscussionCreated,
  projects = [],
  initialChannel = 'general',
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [channel, setChannel] = useState(initialChannel || 'general');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [projectTasks, setProjectTasks] = useState([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setContent('');
      setChannel(initialChannel || 'general');
      setSelectedProjectId('');
      setTagsInput('');
      setSelectedTaskIds([]);
      setError('');
    }
  }, [isOpen, initialChannel]);

  // Load tasks if a project is selected
  useEffect(() => {
    if (!selectedProjectId) {
      setProjectTasks([]);
      setSelectedTaskIds([]);
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await taskApi.getTasks(selectedProjectId);
        setProjectTasks(res.data || []);
      } catch {
        setProjectTasks([]);
      }
    };
    fetchTasks();
  }, [selectedProjectId]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a discussion topic title.');
      return;
    }
    if (!content.trim()) {
      setError('Please provide the discussion content.');
      return;
    }

    setLoading(true);
    setError('');

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    try {
      await onDiscussionCreated({
        title: title.trim(),
        content: content.trim(),
        channel,
        project: selectedProjectId || null,
        tags: parsedTags,
        linkedTasks: selectedTaskIds,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to publish discussion thread');
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#16181d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <MessageSquare className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Start a New Discussion
              </h2>
              <p className="text-xs text-slate-400">
                Post an architectural proposal, team query, or sprint update.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Channel Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-amber-400" />
                <span>Discussion Channel</span>
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50 cursor-pointer"
              >
                {CHANNELS.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    #{ch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Related Project (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
                <span>Workspace Project (Optional)</span>
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50 cursor-pointer"
              >
                <option value="">General Workspace (No specific project)</option>
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

          {/* Topic Title */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Discussion Topic Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. RFC: Migrating real-time task sync to WebSockets vs Server-Sent Events"
              className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition-all font-medium"
            />
          </div>

          {/* Content / Body */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Body & Context (Markdown Supported)
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                Supports **bold**, `code`, lists
              </span>
            </div>
            <textarea
              rows={6}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide background, technical reasoning, open questions, or team recommendations..."
              className="w-full px-4 py-3 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 leading-relaxed font-sans transition-all"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              <span>Tags (comma-separated)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. rfc, backend, architecture, database"
              className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 font-mono transition-all"
            />
          </div>

          {/* Task Linking (if project selected) */}
          {selectedProjectId && projectTasks.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Link Related Project Tasks</span>
              </label>
              <div className="max-h-36 overflow-y-auto rounded-xl bg-[#111216] border border-white/5 p-2 space-y-1.5 no-scrollbar">
                {projectTasks.map((task) => {
                  const isSelected = selectedTaskIds.includes(task._id);
                  return (
                    <div
                      key={task._id}
                      onClick={() => toggleTaskSelection(task._id)}
                      className={`p-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-amber-400/15 border border-amber-400/30 text-white font-semibold'
                          : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <CheckSquare
                          className={`w-3.5 h-3.5 ${
                            isSelected ? 'text-amber-400' : 'text-slate-500'
                          }`}
                        />
                        <span className="truncate">{task.title}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {task.status || 'todo'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#111216] hover:bg-[#1a1c23] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <Sparkles className="w-4 h-4 text-slate-950" />
              )}
              <span>Publish Discussion</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
