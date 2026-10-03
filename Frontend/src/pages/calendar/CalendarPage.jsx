import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { calendarApi } from '../../api/calendar.api';
import { projectApi } from '../../api/project.api';
import { taskApi } from '../../api/task.api';
import AppShell from '../../components/layout/AppShell';
import CreateEventModal from '../../components/calendar/CreateEventModal';
import EventDetailDrawer from '../../components/calendar/EventDetailDrawer';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  CheckSquare,
  Flag,
  Video,
  Rocket,
  Users,
  AlertTriangle,
  FolderKanban,
  Clock,
  Sparkles,
  Layers,
  LayoutGrid,
  List,
  Loader2,
  AlertCircle
} from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const { user } = useAuth();

  // Navigation State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'timeline'
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [selectedEventType, setSelectedEventType] = useState('all');

  // Data State
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals & Drawers
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const [selectedItemForDrawer, setSelectedItemForDrawer] = useState(null);

  // Fetch Projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await projectApi.getProjects();
        setProjects(res.data || []);
      } catch {
        setProjects([]);
      }
    };
    loadProjects();
  }, []);

  // Fetch Schedule Data
  const fetchSchedule = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await calendarApi.getSchedule({
        project: selectedProjectId !== 'all' ? selectedProjectId : undefined,
      });

      if (res?.data) {
        setEvents(res.data.events || []);
        setTasks(res.data.tasks || []);
      }
    } catch (err) {
      setError(err.message || 'Unable to load schedule data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [selectedProjectId]);

  // Handle Event Creation
  const handleEventCreated = async (eventData) => {
    await calendarApi.createEvent(eventData);
    await fetchSchedule();
  };

  // Handle Event Delete
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await calendarApi.deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
      setSelectedItemForDrawer(null);
    } catch (err) {
      alert(err.message || 'Failed to delete event');
    }
  };

  // Handle Task Status Update directly from Drawer
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await taskApi.updateTask(taskId, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );
      if (selectedItemForDrawer?.data?._id === taskId) {
        setSelectedItemForDrawer((prev) => ({
          ...prev,
          data: { ...prev.data, status: newStatus },
        }));
      }
    } catch (err) {
      alert(err.message || 'Failed to update task');
    }
  };

  // Calendar Date Math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const jumpToToday = () => {
    setCurrentDate(new Date());
  };

  // Generate Month Grid Matrix
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = totalDaysInPrevMonth - i;
      const dateObj = new Date(year, month - 1, d);
      days.push({
        dateNumber: d,
        dateObj,
        isCurrentMonth: false,
        dateString: dateObj.toISOString().split('T')[0],
      });
    }

    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const dateObj = new Date(year, month, i);
      days.push({
        dateNumber: i,
        dateObj,
        isCurrentMonth: true,
        dateString: dateObj.toISOString().split('T')[0],
      });
    }

    // Next month padding days to complete grid (42 cells: 6 weeks)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const dateObj = new Date(year, month + 1, i);
      days.push({
        dateNumber: i,
        dateObj,
        isCurrentMonth: false,
        dateString: dateObj.toISOString().split('T')[0],
      });
    }

    return days;
  }, [year, month]);

  // Today string for comparison
  const todayString = new Date().toISOString().split('T')[0];

  // Map events and tasks by date string
  const itemsByDate = useMemo(() => {
    const map = {};

    // Map Events
    events.forEach((ev) => {
      if (selectedEventType !== 'all' && ev.eventType !== selectedEventType) return;
      if (ev.startDate) {
        const key = new Date(ev.startDate).toISOString().split('T')[0];
        if (!map[key]) map[key] = [];
        map[key].push({ itemType: 'event', data: ev });
      }
    });

    // Map Tasks (by dueDate or createdAt)
    tasks.forEach((t) => {
      const dateSource = t.dueDate || t.createdAt;
      if (dateSource) {
        const key = new Date(dateSource).toISOString().split('T')[0];
        if (!map[key]) map[key] = [];
        map[key].push({ itemType: 'task', data: t });
      }
    });

    return map;
  }, [events, tasks, selectedEventType]);

  // Metrics
  const totalEventsCount = events.length;
  const totalTasksCount = tasks.length;
  const upcomingMilestonesCount = events.filter((e) => e.eventType === 'milestone').length;

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto w-full space-y-6 pb-12">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Link to="/dashboard" className="hover:text-white transition-colors">
                Workspaces
              </Link>
              <span>&gt;</span>
              <span className="text-white font-semibold">Sprint Calendar</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Calendar & Schedule</span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Sprint milestone dates, agile ceremonies, release targets, and task due dates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setModalDate(new Date());
                setIsCreateModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Schedule Event</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Ribbon Cards */}
        <div className="grid grid-cols-3 gap-4" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          <div className="p-4 rounded-2xl bg-[#16181d] border border-white/5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                SCHEDULED EVENTS
              </span>
              <div className="text-2xl font-black text-white mt-1">{totalEventsCount}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <CalendarIcon className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#16181d] border border-white/5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                SPRINT MILESTONES
              </span>
              <div className="text-2xl font-black text-white mt-1">{upcomingMilestonesCount}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Flag className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#16181d] border border-white/5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                DELIVERABLE TASKS
              </span>
              <div className="text-2xl font-black text-white mt-1">{totalTasksCount}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckSquare className="w-4.5 h-4.5" />
            </div>
          </div>
        </div>

        {/* Calendar Controls & Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-[#16181d] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          {/* Left: Navigation Month & Jump Today */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-xl bg-[#111216] hover:bg-[#1f222b] border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={nextMonth}
                className="p-1.5 rounded-xl bg-[#111216] hover:bg-[#1f222b] border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-base sm:text-lg font-black text-white tracking-tight min-w-[170px]">
              {MONTH_NAMES[month]} {year}
            </h2>

            <button
              onClick={jumpToToday}
              className="px-3 py-1 rounded-lg bg-[#232630] hover:bg-[#2c313f] border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Today
            </button>
          </div>

          {/* Right: View Mode & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter by Project */}
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#111216] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-amber-400/50 cursor-pointer"
            >
              <option value="all">All Projects ({projects.length})</option>
              {projects.map((item) => {
                const p = item.project || item;
                return (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                );
              })}
            </select>

            {/* Filter by Event Type */}
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#111216] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-amber-400/50 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="milestone">Milestones</option>
              <option value="meeting">Meetings & Standups</option>
              <option value="release">Releases & Deploys</option>
              <option value="deadline">Deadlines</option>
            </select>

            {/* View Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-[#111216] border border-white/10">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'month'
                    ? 'bg-[#232630] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Month Grid
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'timeline'
                    ? 'bg-[#232630] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Schedule List
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-center rounded-3xl bg-[#16181d] border border-white/5">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-3" />
            <p className="text-xs text-slate-400">Loading sprint calendar matrix...</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchSchedule}
              className="px-3 py-1 rounded bg-rose-500/20 text-rose-200 text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        ) : viewMode === 'month' ? (
          /* ========================================================================= */
          /* VIEW 1: MONTH MATRIX GRID */
          /* ========================================================================= */
          <div className="rounded-3xl bg-[#16181d] border border-white/5 shadow-2xl overflow-hidden">
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-white/5 text-center bg-[#111216]/80">
              {DAYS_OF_WEEK.map((d, idx) => (
                <div
                  key={d}
                  className={`py-3 text-[11px] font-bold uppercase tracking-wider ${
                    idx === 0 || idx === 6 ? 'text-slate-500' : 'text-slate-300'
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Matrix Cells */}
            <div className="grid grid-cols-7 divide-x divide-y divide-white/5">
              {calendarDays.map((cell, idx) => {
                const isToday = cell.dateString === todayString;
                const items = itemsByDate[cell.dateString] || [];
                const hasItems = items.length > 0;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setModalDate(cell.dateObj);
                      setIsCreateModalOpen(true);
                    }}
                    className={`min-h-[115px] sm:min-h-[135px] p-2 sm:p-2.5 transition-colors flex flex-col justify-between group cursor-pointer relative ${
                      !cell.isCurrentMonth
                        ? 'bg-[#111216]/40 text-slate-600'
                        : isToday
                        ? 'bg-amber-400/[0.04] ring-1 ring-inset ring-amber-400/40'
                        : 'bg-[#16181d] hover:bg-[#1a1d25]'
                    }`}
                  >
                    {/* Top Cell Row: Day Number & Today indicator */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center font-mono ${
                          isToday
                            ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                            : cell.isCurrentMonth
                            ? 'text-slate-300 group-hover:text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        {cell.dateNumber}
                      </span>

                      {/* Quick Add icon on hover */}
                      <span className="opacity-0 group-hover:opacity-100 text-[10px] text-amber-400 font-bold transition-opacity">
                        + Add
                      </span>
                    </div>

                    {/* Events & Tasks Pills Stack */}
                    <div className="space-y-1 my-1 flex-1 overflow-hidden">
                      {items.slice(0, 3).map((item, itemIdx) => {
                        if (item.itemType === 'event') {
                          const ev = item.data;
                          return (
                            <div
                              key={itemIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItemForDrawer(item);
                              }}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 truncate shadow-xs transition-transform hover:scale-[1.02] cursor-pointer ${
                                ev.eventType === 'milestone'
                                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                  : ev.eventType === 'meeting'
                                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                  : ev.eventType === 'release'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              }`}
                              title={ev.title}
                            >
                              {ev.eventType === 'milestone' ? (
                                <Flag className="w-2.5 h-2.5 shrink-0" />
                              ) : ev.eventType === 'meeting' ? (
                                <Video className="w-2.5 h-2.5 shrink-0" />
                              ) : (
                                <Rocket className="w-2.5 h-2.5 shrink-0" />
                              )}
                              <span className="truncate">{ev.title}</span>
                            </div>
                          );
                        } else {
                          const t = item.data;
                          const isDone = (t.status || '').toLowerCase() === 'done';
                          return (
                            <div
                              key={itemIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItemForDrawer(item);
                              }}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1.5 truncate border transition-transform hover:scale-[1.02] cursor-pointer ${
                                isDone
                                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/20 line-through opacity-70'
                                  : 'bg-[#111216] text-slate-200 border-white/10 hover:border-white/20'
                              }`}
                              title={t.title}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  isDone
                                    ? 'bg-emerald-400'
                                    : (t.priority || '').toLowerCase() === 'high'
                                    ? 'bg-rose-400'
                                    : 'bg-amber-400'
                                }`}
                              />
                              <span className="truncate">{t.title}</span>
                            </div>
                          );
                        }
                      })}

                      {items.length > 3 && (
                        <div className="text-[9px] font-bold text-slate-400 pl-1">
                          +{items.length - 3} more items
                        </div>
                      )}
                    </div>

                    {/* Bottom Load indicator */}
                    <div className="flex items-center gap-1">
                      {hasItems && (
                        <div className="flex items-center gap-0.5">
                          {items.slice(0, 4).map((_, i) => (
                            <div
                              key={i}
                              className="w-1 h-1 rounded-full bg-amber-400/80"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: TIMELINE / SCHEDULE LIST */
          /* ========================================================================= */
          <div className="space-y-4">
            <div className="rounded-3xl bg-[#16181d] border border-white/5 divide-y divide-white/5 overflow-hidden shadow-xl">
              {events.length === 0 && tasks.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400">
                  No events or tasks scheduled for this period.
                </div>
              ) : (
                [...events.map((e) => ({ itemType: 'event', data: e })), ...tasks.map((t) => ({ itemType: 'task', data: t }))]
                  .sort((a, b) => {
                    const dateA = new Date(a.data.startDate || a.data.dueDate || a.data.createdAt);
                    const dateB = new Date(b.data.startDate || b.data.dueDate || b.data.createdAt);
                    return dateA - dateB;
                  })
                  .map((item, idx) => {
                    const isTask = item.itemType === 'task';
                    const data = item.data;
                    const dateStr = new Date(
                      data.startDate || data.dueDate || data.createdAt
                    ).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    });

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedItemForDrawer(item)}
                        className="p-4 sm:p-5 hover:bg-white/[0.02] flex items-center justify-between gap-4 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-2xl bg-[#111216] border border-white/5 flex flex-col items-center justify-center text-center shrink-0">
                            <span className="text-[9px] uppercase font-bold text-amber-400">
                              {dateStr.split(' ')[0]}
                            </span>
                            <span className="text-xs font-black text-white font-mono">
                              {dateStr.split(' ')[2]}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`px-2 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                                  isTask
                                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                    : 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                                }`}
                              >
                                {isTask ? 'Sprint Task' : data.eventType || 'Event'}
                              </span>

                              {data.project?.name && (
                                <span className="text-[11px] text-slate-400">
                                  in {data.project.name}
                                </span>
                              )}
                            </div>

                            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                              {data.title}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {data.meetingLink && (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
                              <Video className="w-3 h-3" />
                              <span className="hidden sm:inline">Call Link</span>
                            </span>
                          )}

                          <span className="text-xs font-medium text-slate-400 font-mono">
                            {dateStr}
                          </span>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onEventCreated={handleEventCreated}
        projects={projects}
        initialDate={modalDate}
      />

      {/* Event / Task Detail Slide Drawer */}
      <EventDetailDrawer
        selectedItem={selectedItemForDrawer}
        onClose={() => setSelectedItemForDrawer(null)}
        onDeleteEvent={handleDeleteEvent}
        onUpdateTaskStatus={handleUpdateTaskStatus}
        currentUserId={user?._id}
      />
    </AppShell>
  );
}
