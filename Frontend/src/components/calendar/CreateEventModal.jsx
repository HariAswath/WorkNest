import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Sparkles,
  Clock,
  Video,
  Rocket,
  Users,
  AlertTriangle,
  Flag,
  FolderKanban,
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react';

const EVENT_TYPES = [
  { id: 'milestone', name: 'Sprint Milestone', icon: Flag, desc: 'Release target or epic milestone' },
  { id: 'meeting', name: 'Ceremony / Meeting', icon: Video, desc: 'Planning, review, or architecture session' },
  { id: 'release', name: 'Deployment / Release', icon: Rocket, desc: 'Staging rollout or production deploy' },
  { id: 'standup', name: 'Daily Standup', icon: Users, desc: 'Sprint sync & blocker check-in' },
  { id: 'deadline', name: 'Code Freeze / Cutoff', icon: AlertTriangle, desc: 'Hard delivery cut-off deadline' },
];

const COLOR_OPTIONS = [
  { id: 'amber', name: 'Amber Gold', bg: 'bg-amber-400', ring: 'ring-amber-400' },
  { id: 'indigo', name: 'Indigo Electric', bg: 'bg-indigo-500', ring: 'ring-indigo-400' },
  { id: 'emerald', name: 'Emerald Jade', bg: 'bg-emerald-500', ring: 'ring-emerald-400' },
  { id: 'rose', name: 'Rose Crimson', bg: 'bg-rose-500', ring: 'ring-rose-400' },
  { id: 'cyan', name: 'Cyan Quantum', bg: 'bg-cyan-400', ring: 'ring-cyan-400' },
  { id: 'purple', name: 'Violet Neon', bg: 'bg-purple-500', ring: 'ring-purple-400' },
];

export default function CreateEventModal({
  isOpen,
  onClose,
  onEventCreated,
  projects = [],
  initialDate = null,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('milestone');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allDay, setAllDay] = useState(true);
  const [meetingLink, setMeetingLink] = useState('');
  const [selectedColor, setSelectedColor] = useState('amber');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setEventType('milestone');
      setSelectedProjectId('');
      const defaultDate = initialDate
        ? new Date(initialDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
      setStartDate(defaultDate);
      setEndDate(defaultDate);
      setAllDay(true);
      setMeetingLink('');
      setSelectedColor('amber');
      setError('');
    }
  }, [isOpen, initialDate]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Event title is required.');
      return;
    }
    if (!startDate) {
      setError('Start date is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onEventCreated({
        title: title.trim(),
        description: description.trim(),
        eventType,
        project: selectedProjectId || null,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : null,
        allDay,
        meetingLink: meetingLink.trim(),
        color: selectedColor,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to schedule event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#16181d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Schedule Event or Milestone
              </h2>
              <p className="text-xs text-slate-400">
                Plan a sprint delivery, agile ceremony, or deployment cutoff.
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

          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Event Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sprint 3 Demo & Milestone Release"
              className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition-all font-medium"
            />
          </div>

          {/* Event Type Grid */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Schedule Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EVENT_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = eventType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setEventType(type.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#232630] border-amber-400/50 shadow-sm'
                        : 'bg-[#111216] border-white/5 hover:border-white/15 text-slate-400'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-amber-400' : 'text-slate-500'
                      }`}
                    />
                    <span
                      className={`text-xs truncate ${
                        isSelected ? 'text-white font-bold' : 'text-slate-300'
                      }`}
                    >
                      {type.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Target / End Date (Optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50 cursor-pointer"
              />
            </div>
          </div>

          {/* Project & Meeting Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
                <span>Workspace Project</span>
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50 cursor-pointer"
              >
                <option value="">General Workspace Event</option>
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

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-emerald-400" />
                <span>Meeting URL (Optional)</span>
              </label>
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 font-mono transition-all"
              />
            </div>
          </div>

          {/* Color Accent Picker */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Badge Accent Tone
            </label>
            <div className="flex items-center gap-3">
              {COLOR_OPTIONS.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setSelectedColor(col.id)}
                  className={`w-7 h-7 rounded-xl ${col.bg} flex items-center justify-center text-black shadow-md transition-transform cursor-pointer ${
                    selectedColor === col.id ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {selectedColor === col.id && <Check className="w-3.5 h-3.5 text-black" />}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Notes & Agenda
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline meeting agenda, deployment checklist, or release objectives..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 leading-relaxed font-sans transition-all"
            />
          </div>

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
              <span>Schedule Event</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
