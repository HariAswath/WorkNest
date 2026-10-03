import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Calendar,
  Clock,
  Video,
  ExternalLink,
  Trash2,
  CheckSquare,
  FolderKanban,
  Flag,
  Rocket,
  Users,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  User,
  CheckCircle2
} from 'lucide-react';

const EVENT_TYPE_MAP = {
  milestone: { label: 'Sprint Milestone', icon: Flag, color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  meeting: { label: 'Agile Meeting', icon: Video, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  release: { label: 'Deployment Release', icon: Rocket, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  standup: { label: 'Daily Standup', icon: Users, color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' },
  deadline: { label: 'Hard Deadline', icon: AlertTriangle, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
};

export default function EventDetailDrawer({
  selectedItem,
  onClose,
  onDeleteEvent,
  onUpdateTaskStatus,
  currentUserId,
}) {
  const navigate = useNavigate();

  if (!selectedItem) return null;

  const isTask = selectedItem.itemType === 'task';
  const data = selectedItem.data;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not scheduled';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md h-full bg-[#16181d] border-l border-white/10 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          {/* Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isTask ? 'SPRINT TASK DETAIL' : 'CALENDAR SCHEDULE DETAIL'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!isTask && onDeleteEvent && (
                <button
                  onClick={() => onDeleteEvent(data._id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TASK VIEW */}
          {/* ========================================================================= */}
          {isTask ? (
            <div className="space-y-5">
              {/* Task Title & Project */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                    <CheckSquare className="w-3 h-3 text-indigo-400" />
                    <span>Active Task</span>
                  </span>

                  {data.project?.name && (
                    <span className="text-xs text-slate-400 font-medium">
                      in {data.project.name}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-black text-white tracking-tight leading-snug">
                  {data.title}
                </h2>
              </div>

              {/* Status Switcher */}
              <div className="p-4 rounded-2xl bg-[#111216] border border-white/5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  TASK STATUS
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'todo', label: 'To Do' },
                    { id: 'in_progress', label: 'In Progress' },
                    { id: 'done', label: 'Completed' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => onUpdateTaskStatus && onUpdateTaskStatus(data._id, st.id)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        (data.status || 'todo').toLowerCase() === st.id
                          ? st.id === 'done'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                            : st.id === 'in_progress'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                            : 'bg-slate-700 text-white border border-white/20'
                          : 'bg-[#16181d] text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#111216] border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>DUE DATE</span>
                  </span>
                  <div className="text-xs font-bold text-white">
                    {formatDate(data.dueDate || data.createdAt)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#111216] border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    PRIORITY
                  </span>
                  <div className="text-xs font-bold uppercase text-amber-400">
                    {data.priority || 'Medium'} Priority
                  </div>
                </div>
              </div>

              {/* Assignee Card */}
              <div className="p-4 rounded-xl bg-[#111216] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow">
                    {(data.assignedTo?.fullName || data.assignedTo?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      {data.assignedTo?.fullName || data.assignedTo?.username || 'Unassigned'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      @{data.assignedTo?.username || 'nobody'}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-500">Assignee</span>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  TASK DESCRIPTION
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#111216] p-3.5 rounded-xl border border-white/5">
                  {data.description || 'No detailed description provided for this task.'}
                </p>
              </div>

              {/* Open Project CTA */}
              {data.project?._id && (
                <button
                  type="button"
                  onClick={() => navigate(`/projects/${data.project._id}`)}
                  className="w-full py-2.5 rounded-xl bg-[#232630] hover:bg-[#2c313f] border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Open Kanban Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            /* ========================================================================= */
            /* EVENT / MILESTONE VIEW */
            /* ========================================================================= */
            <div className="space-y-5">
              {/* Event Badge & Title */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const conf = EVENT_TYPE_MAP[data.eventType] || EVENT_TYPE_MAP.milestone;
                    const Icon = conf.icon;
                    return (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${conf.color}`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{conf.label}</span>
                      </span>
                    );
                  })()}

                  {data.project?.name && (
                    <span className="text-xs text-slate-400 font-medium truncate max-w-[180px]">
                      in {data.project.name}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-black text-white tracking-tight leading-snug">
                  {data.title}
                </h2>
              </div>

              {/* Date Box */}
              <div className="p-4 rounded-2xl bg-[#111216] border border-white/5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>SCHEDULED DATE & TIME</span>
                </span>
                <div className="text-sm font-bold text-white">
                  {formatDate(data.startDate)}
                  {data.endDate && ` - ${formatDate(data.endDate)}`}
                </div>
                <div className="text-[11px] text-slate-400">
                  {data.allDay ? 'All-Day Schedule' : 'Timed Event'}
                </div>
              </div>

              {/* Video Meeting Call Button */}
              {data.meetingLink && (
                <a
                  href={data.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md group cursor-pointer"
                >
                  <Video className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Join Video Call ({data.meetingLink.replace(/^https?:\/\//, '').slice(0, 24)}...)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                </a>
              )}

              {/* Description & Agenda */}
              {data.description && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    AGENDA & SPECIFICATIONS
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-[#111216] p-3.5 rounded-xl border border-white/5 whitespace-pre-line">
                    {data.description}
                  </p>
                </div>
              )}

              {/* Creator Tag */}
              <div className="p-3.5 rounded-xl bg-[#111216] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#232630] border border-white/10 text-white font-bold text-xs flex items-center justify-center">
                    {(data.createdBy?.fullName || data.createdBy?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-white">
                      {data.createdBy?.fullName || data.createdBy?.username || 'Workspace Member'}
                    </span>
                    <span className="text-slate-500 text-[10px] block font-mono">
                      Scheduled organizer
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  Organizer
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#111216] hover:bg-[#1a1c23] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Close Detail
          </button>
        </div>
      </div>
    </div>
  );
}
