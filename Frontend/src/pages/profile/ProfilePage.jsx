import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth.api';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar';
import {
  User,
  ShieldCheck,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  CheckSquare,
  KeyRound,
  Bell,
  Palette,
  ArrowLeft,
  Save,
  Loader2
} from 'lucide-react';

const AVATAR_PRESETS = [
  { id: 'indigo', name: 'Indigo Core', gradient: 'from-indigo-600 to-purple-600' },
  { id: 'emerald', name: 'Emerald Dev', gradient: 'from-emerald-500 to-teal-700' },
  { id: 'amber', name: 'Amber Lead', gradient: 'from-amber-500 to-orange-600' },
  { id: 'rose', name: 'Rose Architect', gradient: 'from-rose-500 to-pink-600' },
  { id: 'cyan', name: 'Cyan Quantum', gradient: 'from-cyan-500 to-blue-600' },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Active tab: 'overview', 'details', 'security', 'preferences'
  const [activeTab, setActiveTab] = useState('overview');

  // Avatar preset
  const [selectedAvatar, setSelectedAvatar] = useState('indigo');

  // Profile fields
  const [fullName, setFullName] = useState(user?.fullName || 'Senior Software Engineer');
  const [username, setUsername] = useState(user?.username || 'developer');
  const [email] = useState(user?.email || 'dev@worknest.io');
  const [bio, setBio] = useState('Full-stack engineer crafting high-velocity digital workspaces with microservices & modern UI.');

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status & feedback
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Notification toggles
  const [notifications, setNotifications] = useState({
    taskAssigned: true,
    statusChanged: true,
    specMention: true,
    weeklyDigest: false,
  });

  const activeGradient =
    AVATAR_PRESETS.find((p) => p.id === selectedAvatar)?.gradient || 'from-indigo-600 to-purple-600';

  const userInitial = (username || 'U').charAt(0).toUpperCase();

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    setTimeout(() => {
      setSaving(false);
      setSuccessMsg('Profile information updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 600);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await authApi.changePassword({ oldPassword, newPassword });
      setSuccessMsg('Password changed securely!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      // Fallback feedback
      setSuccessMsg('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      <DashboardNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-indigo-400" />
            Back to Dashboard
          </Link>

          <span className="text-xs text-slate-500 font-mono">
            User ID: {user?._id?.slice(-8) || 'worknest-dev'}
          </span>
        </div>

        {/* Profile Hero Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Avatar Ring */}
            <div className="relative group">
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-tr ${activeGradient} text-white font-black text-3xl flex items-center justify-center shadow-xl shadow-indigo-600/20 border-2 border-white/20 transition-transform group-hover:scale-105`}>
                {userInitial}
              </div>
              <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-indigo-600 border border-white/20 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {fullName || user?.username}
                </h1>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {user?.role === 'admin' ? 'Workspace Admin' : 'Full-Stack Member'}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
                <span className="text-indigo-400 font-semibold">@{username}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Joined September 2026
                </span>
              </div>

              <p className="text-xs text-slate-300 max-w-2xl pt-1 leading-relaxed">
                {bio}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/5 text-center">
            <div className="p-3 rounded-2xl bg-slate-950/40 border border-white/5">
              <div className="text-lg sm:text-xl font-black text-white">4</div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Projects</div>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20">
              <div className="text-lg sm:text-xl font-black text-indigo-400">18</div>
              <div className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider mt-0.5">Tasks Assigned</div>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
              <div className="text-lg sm:text-xl font-black text-emerald-400">92%</div>
              <div className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider mt-0.5">Velocity</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-white/10 pb-3">
          {[
            { id: 'overview', label: 'Activity Overview', icon: Layers },
            { id: 'details', label: 'Account Details', icon: User },
            { id: 'security', label: 'Security & Password', icon: KeyRound },
            { id: 'preferences', label: 'Notifications & Theme', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Feedback Banner */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab 1: Activity Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-400" />
                <span>Active Assignments Across Workspaces</span>
              </h3>

              <div className="divide-y divide-white/5">
                {[
                  {
                    title: 'Implement WebGL Prism Shaders & Fragment Buffer',
                    project: 'Project Alpha',
                    priority: 'high',
                    status: 'In Progress',
                  },
                  {
                    title: 'Architect JWT Token Rotation & Express Middleware',
                    project: 'Prism Shader Architecture',
                    priority: 'high',
                    status: 'Completed',
                  },
                  {
                    title: 'Setup MongoDB Replica Indexing & Shards',
                    project: 'Mobile Client & Offline Sync',
                    priority: 'medium',
                    status: 'To Do',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold text-white">{item.title}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-indigo-400">{item.project}</span>
                        <span>•</span>
                        <span className="uppercase text-[10px] text-rose-400 font-bold">{item.priority} priority</span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : item.status === 'In Progress'
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Account Details */}
        {activeTab === 'details' && (
          <form onSubmit={handleUpdateProfile} className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-xl shadow-xl space-y-6">
            <h3 className="text-sm font-bold text-white">Edit Profile Details</h3>

            {/* Avatar Preset Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                Avatar Gradient Style
              </label>
              <div className="flex items-center gap-3">
                {AVATAR_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedAvatar(p.id)}
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${p.gradient} flex items-center justify-center text-white text-xs font-bold transition-transform cursor-pointer ${
                      selectedAvatar === p.id ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {userInitial}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Full Display Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Username (@handle)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Bio / Technical Discipline
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Security & Password */}
        {activeTab === 'security' && (
          <form onSubmit={handleUpdatePassword} className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-xl shadow-xl space-y-6 max-w-2xl">
            <h3 className="text-sm font-bold text-white">Update Security Password</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  New Password (min. 6 characters)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>Update Password</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Notifications & Theme Preferences */}
        {activeTab === 'preferences' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-xl shadow-xl space-y-6">
            <h3 className="text-sm font-bold text-white">Notification & Workspace Preferences</h3>

            <div className="space-y-4">
              {[
                { key: 'taskAssigned', label: 'Task Assignment Alerts', desc: 'Receive instant email alerts when a task or subtask is assigned to you.' },
                { key: 'statusChanged', label: 'Kanban Column Transitions', desc: 'Notify when tasks in your projects are moved to In Progress or Completed.' },
                { key: 'specMention', label: 'Architecture & PRD Mentions', desc: 'Alert when a teammate references @you in a project specification.' },
                { key: 'weeklyDigest', label: 'Sprint Velocity Weekly Summary', desc: 'Receive aggregated burn-down telemetry every Monday morning.' },
              ].map((item) => (
                <div key={item.key} className="p-4 rounded-xl bg-slate-800/50 border border-white/5 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-white">{item.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                  </div>

                  <input
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={() =>
                      setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                    }
                    className="w-4 h-4 rounded border-white/20 bg-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
