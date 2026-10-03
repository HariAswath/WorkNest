import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { discussionApi } from '../../api/discussion.api';
import { projectApi } from '../../api/project.api';
import AppShell from '../../components/layout/AppShell';
import CreateDiscussionModal from '../../components/discussions/CreateDiscussionModal';
import {
  MessageSquare,
  Hash,
  Search,
  Plus,
  Pin,
  PinOff,
  Trash2,
  Send,
  Sparkles,
  CheckSquare,
  FolderKanban,
  Tag,
  Clock,
  ThumbsUp,
  Flame,
  Lightbulb,
  Heart,
  Rocket,
  Eye,
  Loader2,
  AlertCircle,
  CornerDownRight,
  MoreVertical,
  Filter,
  User,
  ArrowRight
} from 'lucide-react';

const CHANNELS = [
  { id: 'all', name: 'All Discussions', icon: MessageSquare },
  { id: 'general', name: 'general', desc: 'Workspace chatter & team queries' },
  { id: 'architecture', name: 'architecture', desc: 'RFCs, system design & tech stack decisions' },
  { id: 'sprint-planning', name: 'sprint-planning', desc: 'Iteration scopes & milestones' },
  { id: 'announcements', name: 'announcements', desc: 'Official product updates' },
  { id: 'qa-bugs', name: 'qa-bugs', desc: 'Triage & bug investigations' },
  { id: 'random', name: 'random', desc: 'Casual chatter & watercooler' },
];

const QUICK_REACTION_EMOJIS = ['👍', '🚀', '🔥', '💡', '❤️', '👀'];

export default function DiscussionsPage() {
  const { user } = useAuth();

  // State
  const [discussions, setDiscussions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);

  // Replies state
  const [replies, setReplies] = useState([]);
  const [replyInput, setReplyInput] = useState('');
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);

  // Feedback & modals
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const repliesEndRef = useRef(null);

  // Fetch discussions
  const fetchDiscussions = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await discussionApi.getDiscussions({
        channel: selectedChannel,
        project: selectedProjectId !== 'all' ? selectedProjectId : undefined,
        tag: selectedTag || undefined,
        search: searchQuery || undefined,
      });

      const list = response.data || [];
      setDiscussions(list);

      // Auto select first discussion if none selected or if selected one was deleted
      if (list.length > 0) {
        if (!selectedDiscussion || !list.some((d) => d._id === selectedDiscussion._id)) {
          setSelectedDiscussion(list[0]);
        } else {
          // Refresh selected discussion with latest data
          const updated = list.find((d) => d._id === selectedDiscussion._id);
          if (updated) setSelectedDiscussion(updated);
        }
      } else {
        setSelectedDiscussion(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to load discussions');
      setDiscussions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects list for filter & modal
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

  // Refetch when filters change
  useEffect(() => {
    fetchDiscussions();
  }, [selectedChannel, selectedProjectId, selectedTag, searchQuery]);

  // Fetch replies when selected discussion changes
  useEffect(() => {
    if (!selectedDiscussion?._id) {
      setReplies([]);
      return;
    }

    const loadReplies = async () => {
      setLoadingReplies(true);
      try {
        const res = await discussionApi.getReplies(selectedDiscussion._id);
        setReplies(res.data || []);
      } catch {
        setReplies([]);
      } finally {
        setLoadingReplies(false);
      }
    };

    loadReplies();
  }, [selectedDiscussion?._id]);

  // Create new discussion
  const handleDiscussionCreated = async (payload) => {
    const res = await discussionApi.createDiscussion(payload);
    await fetchDiscussions();
    if (res?.data) {
      setSelectedDiscussion(res.data);
    }
  };

  // Submit reply
  const handleSendReply = async (e) => {
    e?.preventDefault();
    if (!replyInput.trim() || !selectedDiscussion?._id) return;

    setSubmittingReply(true);
    try {
      const res = await discussionApi.createReply(selectedDiscussion._id, {
        content: replyInput.trim(),
      });

      if (res?.data) {
        setReplies((prev) => [...prev, res.data]);
        setReplyInput('');

        // Increment reply count locally
        setDiscussions((prev) =>
          prev.map((d) =>
            d._id === selectedDiscussion._id
              ? { ...d, repliesCount: (d.repliesCount || 0) + 1, lastReplyAt: new Date().toISOString() }
              : d
          )
        );

        setTimeout(() => {
          repliesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      alert(err.message || 'Failed to send reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  // Toggle Reaction on discussion
  const handleToggleDiscussionReaction = async (emoji) => {
    if (!selectedDiscussion?._id) return;
    try {
      const res = await discussionApi.toggleDiscussionReaction(
        selectedDiscussion._id,
        emoji
      );
      if (res?.data) {
        setSelectedDiscussion((prev) => ({ ...prev, reactions: res.data }));
        setDiscussions((prev) =>
          prev.map((d) =>
            d._id === selectedDiscussion._id ? { ...d, reactions: res.data } : d
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Reaction on reply
  const handleToggleReplyReaction = async (replyId, emoji) => {
    try {
      const res = await discussionApi.toggleReplyReaction(replyId, emoji);
      if (res?.data) {
        setReplies((prev) =>
          prev.map((r) => (r._id === replyId ? { ...r, reactions: res.data } : r))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Pin
  const handleTogglePin = async () => {
    if (!selectedDiscussion?._id) return;
    try {
      const res = await discussionApi.togglePinDiscussion(selectedDiscussion._id);
      const isPinned = res.data?.isPinned;
      setSelectedDiscussion((prev) => ({ ...prev, isPinned }));
      setDiscussions((prev) =>
        prev
          .map((d) => (d._id === selectedDiscussion._id ? { ...d, isPinned } : d))
          .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
      );
    } catch (err) {
      alert(err.message || 'Failed to pin discussion');
    }
  };

  // Delete Discussion
  const handleDeleteDiscussion = async () => {
    if (!selectedDiscussion?._id) return;
    if (!window.confirm('Are you sure you want to delete this discussion thread?')) return;

    try {
      await discussionApi.deleteDiscussion(selectedDiscussion._id);
      setDiscussions((prev) => prev.filter((d) => d._id !== selectedDiscussion._id));
      setSelectedDiscussion(null);
    } catch (err) {
      alert(err.message || 'Failed to delete discussion');
    }
  };

  // Delete Reply
  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('Delete this reply?')) return;
    try {
      await discussionApi.deleteReply(selectedDiscussion._id, replyId);
      setReplies((prev) => prev.filter((r) => r._id !== replyId));
      setDiscussions((prev) =>
        prev.map((d) =>
          d._id === selectedDiscussion._id
            ? { ...d, repliesCount: Math.max(0, (d.repliesCount || 1) - 1) }
            : d
        )
      );
    } catch (err) {
      alert(err.message || 'Failed to delete reply');
    }
  };

  // Unique tags list
  const availableTags = useMemo(() => {
    const set = new Set();
    discussions.forEach((d) => {
      (d.tags || []).forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [discussions]);

  const isAuthorOrAdmin =
    selectedDiscussion?.author?._id === user?._id || user?.role === 'admin';

  // Format relative time helper
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'just now';
    const d = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now - d) / 1000);
    if (diffSec < 60) return 'just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto w-full space-y-6 pb-8">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Link to="/dashboard" className="hover:text-white transition-colors">
                Workspaces
              </Link>
              <span>&gt;</span>
              <span className="text-white font-semibold">Discussions & Channels</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Discussions</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Threaded engineering topics, architecture proposals, and asynchronous sprint standups.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>New Discussion</span>
            </button>
          </div>
        </div>

        {/* 3-Column Architecture Canvas Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[640px] items-start">
          {/* ========================================================================= */}
          {/* COLUMN 1: Channels & Tags Rail (3 Cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-3 space-y-4">
            {/* Channels Card */}
            <div className="p-4 rounded-2xl bg-[#16181d] border border-white/5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  CHANNELS
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {CHANNELS.length - 1} topics
                </span>
              </div>

              <div className="space-y-1">
                {CHANNELS.map((ch) => {
                  const isActive = selectedChannel === ch.id;
                  const count =
                    ch.id === 'all'
                      ? discussions.length
                      : discussions.filter((d) => d.channel === ch.id).length;

                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setSelectedChannel(ch.id);
                        setSelectedTag('');
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer group ${
                        isActive
                          ? 'bg-[#232630] text-white border border-white/10 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {ch.id === 'all' ? (
                          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Hash
                            className={`w-3.5 h-3.5 ${
                              isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'
                            }`}
                          />
                        )}
                        <span className="truncate">{ch.name}</span>
                      </div>

                      {count > 0 && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                            isActive
                              ? 'bg-amber-400/20 text-amber-300'
                              : 'bg-[#111216] text-slate-500'
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter by Project */}
            <div className="p-4 rounded-2xl bg-[#16181d] border border-white/5 space-y-2.5 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 block">
                FILTER BY PROJECT
              </span>

              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#111216] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50 cursor-pointer"
              >
                <option value="all">All Workspace Projects</option>
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

            {/* Tags Cloud */}
            {availableTags.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#16181d] border border-white/5 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    POPULAR TAGS
                  </span>
                  {selectedTag && (
                    <button
                      onClick={() => setSelectedTag('')}
                      className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {availableTags.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTag(selectedTag === t ? '' : t)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
                        selectedTag === t
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-[#111216] text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      #{t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* COLUMN 2: Discussion Threads List Feed (4 Cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, tags, or RFCs..."
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[#16181d] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition-all shadow-sm"
              />
            </div>

            {/* List State */}
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-center rounded-2xl bg-[#16181d] border border-white/5">
                <Loader2 className="w-7 h-7 text-amber-400 animate-spin mb-2.5" />
                <p className="text-xs text-slate-400">Loading discussions...</p>
              </div>
            ) : discussions.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#16181d] border border-white/5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white">No discussions found</div>
                <p className="text-[11px] text-slate-400">
                  Be the first to create a topic in #{selectedChannel !== 'all' ? selectedChannel : 'general'}.
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-slate-950 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Start Topic</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[700px] overflow-y-auto no-scrollbar pr-0.5">
                {discussions.map((item) => {
                  const isSelected = selectedDiscussion?._id === item._id;
                  const authorName = item.author?.fullName || item.author?.username || 'Member';
                  const initial = authorName.charAt(0).toUpperCase();

                  return (
                    <div
                      key={item._id}
                      onClick={() => setSelectedDiscussion(item)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 group relative ${
                        isSelected
                          ? 'bg-[#1a1c24] border-amber-400/40 shadow-md ring-1 ring-amber-400/20'
                          : 'bg-[#16181d] hover:bg-[#1a1c23] border-white/5 hover:border-white/15'
                      }`}
                    >
                      {/* Pinned pill or Channel */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {item.isPinned && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/30">
                              <Pin className="w-2.5 h-2.5 fill-amber-300" />
                              Pinned
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-slate-400 bg-[#111216] px-2 py-0.5 rounded border border-white/5">
                            #{item.channel || 'general'}
                          </span>
                        </div>

                        <span className="text-[10px] text-slate-500 font-mono">
                          {formatTimeAgo(item.lastReplyAt || item.createdAt)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className={`text-xs font-bold transition-colors line-clamp-2 ${
                          isSelected ? 'text-amber-300' : 'text-white group-hover:text-slate-200'
                        }`}
                      >
                        {item.title}
                      </h3>

                      {/* Preview Snippet */}
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>

                      {/* Footer Info */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-[10px] flex items-center justify-center shadow-inner">
                            {initial}
                          </div>
                          <span className="text-slate-300 truncate max-w-[110px]">{authorName}</span>
                        </div>

                        <div className="flex items-center gap-3 text-slate-400 font-mono text-[10px]">
                          {item.reactions && item.reactions.length > 0 && (
                            <span className="flex items-center gap-1 text-slate-300">
                              {item.reactions[0].emoji} {item.reactions.reduce((a, c) => a + c.users.length, 0)}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-slate-500" />
                            {item.repliesCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* COLUMN 3: Active Thread Conversation Panel (5 Cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-4">
            {selectedDiscussion ? (
              <div className="p-6 rounded-3xl bg-[#16181d] border border-white/5 shadow-xl flex flex-col justify-between min-h-[640px] space-y-5">
                {/* Thread Top Bar */}
                <div className="space-y-4 pb-4 border-b border-white/5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-[#111216] border border-white/10 text-amber-400">
                        #{selectedDiscussion.channel}
                      </span>
                      {selectedDiscussion.project && (
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 truncate max-w-[160px]">
                          {selectedDiscussion.project.name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleTogglePin}
                        className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                          selectedDiscussion.isPinned
                            ? 'bg-amber-400/20 border-amber-400/30 text-amber-300'
                            : 'bg-[#111216] border-white/5 text-slate-400 hover:text-white'
                        }`}
                        title={selectedDiscussion.isPinned ? 'Unpin thread' : 'Pin thread'}
                      >
                        {selectedDiscussion.isPinned ? (
                          <PinOff className="w-4 h-4" />
                        ) : (
                          <Pin className="w-4 h-4" />
                        )}
                      </button>

                      {isAuthorOrAdmin && (
                        <button
                          onClick={handleDeleteDiscussion}
                          className="p-1.5 rounded-xl bg-[#111216] border border-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete thread"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
                    {selectedDiscussion.title}
                  </h2>

                  {/* Author Header Row */}
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow">
                        {(selectedDiscussion.author?.fullName || selectedDiscussion.author?.username || 'U')
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs leading-tight">
                          {selectedDiscussion.author?.fullName || selectedDiscussion.author?.username || 'Member'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono leading-tight">
                          @{selectedDiscussion.author?.username || 'user'} • {formatTimeAgo(selectedDiscussion.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Full Body / Markdown Content */}
                  <div className="text-xs text-slate-200 leading-relaxed space-y-2 whitespace-pre-line bg-[#111216]/60 p-4 rounded-2xl border border-white/5 font-sans">
                    {selectedDiscussion.content}
                  </div>

                  {/* Linked Tasks (if any) */}
                  {selectedDiscussion.linkedTasks && selectedDiscussion.linkedTasks.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <CheckSquare className="w-3 h-3 text-amber-400" />
                        <span>LINKED SPRINT TASKS</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedDiscussion.linkedTasks.map((t) => (
                          <div
                            key={t._id}
                            className="px-2.5 py-1 rounded-xl bg-[#111216] border border-white/10 text-xs text-slate-200 flex items-center gap-2 shadow-sm"
                          >
                            <span className="truncate max-w-[160px] font-medium">{t.title}</span>
                            <span className="text-[9px] uppercase font-bold text-amber-300 bg-amber-400/10 px-1.5 py-0.2 rounded">
                              {t.status || 'todo'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reactions Bar */}
                  <div className="flex items-center gap-2 pt-2">
                    {QUICK_REACTION_EMOJIS.map((emoji) => {
                      const reactionObj = selectedDiscussion.reactions?.find((r) => r.emoji === emoji);
                      const count = reactionObj?.users?.length || 0;
                      const hasReacted = reactionObj?.users?.some(
                        (u) => (u._id || u) === user?._id
                      );

                      return (
                        <button
                          key={emoji}
                          onClick={() => handleToggleDiscussionReaction(emoji)}
                          className={`px-2.5 py-1 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                            hasReacted
                              ? 'bg-amber-400/20 border border-amber-400/40 text-white font-bold'
                              : 'bg-[#111216] hover:bg-[#1a1c23] border border-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{emoji}</span>
                          {count > 0 && <span className="text-[10px] font-mono">{count}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Replies Feed */}
                <div className="space-y-3.5 flex-1 max-h-[320px] overflow-y-auto no-scrollbar pr-1">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    <span>Replies ({replies.length})</span>
                  </div>

                  {loadingReplies ? (
                    <div className="py-8 text-center text-xs text-slate-500">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-amber-400 mb-1.5" />
                      <span>Loading discussion thread...</span>
                    </div>
                  ) : replies.length === 0 ? (
                    <div className="p-6 text-center rounded-2xl bg-[#111216] border border-white/5 text-xs text-slate-500">
                      No replies in this thread yet. Be the first to chime in!
                    </div>
                  ) : (
                    replies.map((reply) => {
                      const rAuthor = reply.author?.fullName || reply.author?.username || 'Member';
                      const rInitial = rAuthor.charAt(0).toUpperCase();
                      const isReplyAuthor = reply.author?._id === user?._id || user?.role === 'admin';

                      return (
                        <div
                          key={reply._id}
                          className="p-3.5 rounded-2xl bg-[#111216] border border-white/5 space-y-2 group relative"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-[#232630] border border-white/10 text-white font-bold text-[10px] flex items-center justify-center">
                                {rInitial}
                              </div>
                              <span className="font-bold text-white text-xs">{rAuthor}</span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {formatTimeAgo(reply.createdAt)}
                              </span>
                            </div>

                            {isReplyAuthor && (
                              <button
                                onClick={() => handleDeleteReply(reply._id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                                title="Delete reply"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <p className="text-xs text-slate-300 pl-8 leading-relaxed whitespace-pre-line">
                            {reply.content}
                          </p>

                          {/* Quick Emoji Reaction on Reply */}
                          <div className="pl-8 flex items-center gap-1.5 pt-1">
                            {['👍', '🚀', '❤️'].map((em) => {
                              const rObj = reply.reactions?.find((x) => x.emoji === em);
                              const cnt = rObj?.users?.length || 0;
                              const userReacted = rObj?.users?.some(
                                (u) => (u._id || u) === user?._id
                              );

                              return (
                                <button
                                  key={em}
                                  onClick={() => handleToggleReplyReaction(reply._id, em)}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] flex items-center gap-1 transition-all cursor-pointer ${
                                    userReacted
                                      ? 'bg-amber-400/20 text-white border border-amber-400/30'
                                      : 'bg-[#16181d] text-slate-500 hover:text-white border border-white/5'
                                  }`}
                                >
                                  <span>{em}</span>
                                  {cnt > 0 && <span>{cnt}</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={repliesEndRef} />
                </div>

                {/* Reply Composer Form */}
                <form
                  onSubmit={handleSendReply}
                  className="pt-3 border-t border-white/5 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    placeholder={`Reply to #${selectedDiscussion.channel}...`}
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition-all font-sans"
                  />

                  <button
                    type="submit"
                    disabled={!replyInput.trim() || submittingReply}
                    className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shrink-0"
                  >
                    {submittingReply ? (
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    ) : (
                      <Send className="w-3.5 h-3.5 text-slate-950" />
                    )}
                    <span>Send</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-[#16181d] border border-white/5 min-h-[640px] flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#111216] border border-white/5 flex items-center justify-center text-slate-500">
                  <MessageSquare className="w-7 h-7 text-amber-400/60" />
                </div>
                <h3 className="text-sm font-bold text-white">Select a Discussion</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Choose any channel topic from the feed on the left to read specs, contribute replies, or react.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Discussion Modal */}
      <CreateDiscussionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onDiscussionCreated={handleDiscussionCreated}
        projects={projects}
        initialChannel={selectedChannel !== 'all' ? selectedChannel : 'general'}
      />
    </AppShell>
  );
}
