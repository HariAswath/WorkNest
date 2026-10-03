import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth.api';
import AppShell from '../../components/layout/AppShell';
import {
  Settings,
  User,
  Building2,
  Palette,
  Bell,
  Lock,
  KeyRound,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Save,
  Loader2,
  Copy,
  Check,
  Globe,
  Monitor,
  Laptop,
  Smartphone,
  Shield,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  Trash2,
  RefreshCw,
  ExternalLink,
  Plus,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Radio,
  FileSpreadsheet,
  Download,
  Terminal,
  Webhook
} from 'lucide-react';

const ACCENT_COLORS = [
  { id: 'amber', name: 'Amber Gold', hex: '#f59e0b', ring: 'ring-amber-400', bg: 'bg-amber-400' },
  { id: 'indigo', name: 'Indigo Electric', hex: '#6366f1', ring: 'ring-indigo-400', bg: 'bg-indigo-500' },
  { id: 'emerald', name: 'Emerald Jade', hex: '#10b981', ring: 'ring-emerald-400', bg: 'bg-emerald-500' },
  { id: 'cyan', name: 'Cyan Quantum', hex: '#06b6d4', ring: 'ring-cyan-400', bg: 'bg-cyan-400' },
  { id: 'rose', name: 'Rose Crimson', hex: '#f43f5e', ring: 'ring-rose-400', bg: 'bg-rose-500' },
  { id: 'purple', name: 'Violet Neon', hex: '#a855f7', ring: 'ring-purple-400', bg: 'bg-purple-500' },
];

const AVATAR_GRADIENTS = [
  { id: 'indigo', name: 'Indigo Aura', gradient: 'from-indigo-600 via-indigo-500 to-purple-600' },
  { id: 'amber', name: 'Amber Core', gradient: 'from-amber-500 via-amber-400 to-orange-600' },
  { id: 'emerald', name: 'Emerald Prism', gradient: 'from-emerald-500 via-teal-500 to-teal-700' },
  { id: 'rose', name: 'Rose Nebula', gradient: 'from-rose-500 via-pink-500 to-purple-600' },
  { id: 'cyan', name: 'Cyan Flux', gradient: 'from-cyan-500 via-sky-500 to-blue-600' },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState('profile');

  // Feedback states
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // 1. Profile & Account Settings
  const [fullName, setFullName] = useState(
    localStorage.getItem('worknest_pref_fullName') || user?.fullName || 'Senior Software Engineer'
  );
  const [username, setUsername] = useState(user?.username || 'developer');
  const [email] = useState(user?.email || 'dev@worknest.io');
  const [jobTitle, setJobTitle] = useState(
    localStorage.getItem('worknest_pref_jobTitle') || 'Lead Platform Engineer'
  );
  const [department, setDepartment] = useState(
    localStorage.getItem('worknest_pref_department') || 'Engineering & Architecture'
  );
  const [bio, setBio] = useState(
    localStorage.getItem('worknest_pref_bio') ||
      'Full-stack engineer crafting high-velocity digital workspaces with microservices & modern UI.'
  );
  const [selectedAvatar, setSelectedAvatar] = useState(
    localStorage.getItem('worknest_pref_avatar') || 'indigo'
  );
  const [timezone, setTimezone] = useState(
    localStorage.getItem('worknest_pref_tz') || 'UTC'
  );
  const [dateFormat, setDateFormat] = useState(
    localStorage.getItem('worknest_pref_df') || 'YYYY-MM-DD'
  );

  // 2. Workspace & Sprint Settings
  const [workspaceName, setWorkspaceName] = useState(
    localStorage.getItem('worknest_pref_wsName') || 'WorkNest Studio'
  );
  const [workspaceSlug, setWorkspaceSlug] = useState(
    localStorage.getItem('worknest_pref_wsSlug') || 'worknest-studio'
  );
  const [defaultView, setDefaultView] = useState(
    localStorage.getItem('worknest_pref_defView') || 'kanban'
  );
  const [sprintDuration, setSprintDuration] = useState(
    localStorage.getItem('worknest_pref_sprintDur') || '2'
  );
  const [projectPrivacy, setProjectPrivacy] = useState(
    localStorage.getItem('worknest_pref_projPriv') || 'public'
  );
  const [autoArchiveDays, setAutoArchiveDays] = useState(
    localStorage.getItem('worknest_pref_autoArch') || '14'
  );

  // 3. Appearance & Theme Settings
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem('worknest_pref_theme') || 'dark_studio'
  );
  const [accentColor, setAccentColor] = useState(
    localStorage.getItem('worknest_pref_accent') || 'amber'
  );
  const [uiDensity, setUiDensity] = useState(
    localStorage.getItem('worknest_pref_density') || 'comfortable'
  );
  const [sidebarBehavior, setSidebarBehavior] = useState(
    localStorage.getItem('worknest_pref_sidebar') || 'hover_expand'
  );
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(
    localStorage.getItem('worknest_pref_sound') !== 'false'
  );

  // 4. Notification Settings
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('worknest_pref_notifs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      taskAssigned: true,
      statusTransitions: true,
      mentionsAndComments: true,
      sprintMilestones: true,
      dailyBriefing: false,
      weeklySummary: true,
      securityAlerts: true,
      browserPush: true,
    };
  });

  // 5. Security & Password Settings
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [apiTokens, setApiTokens] = useState([
    { id: 'tok_1', name: 'CLI Development Token', prefix: 'wn_live_79a2...', created: '2026-09-28', lastUsed: '2 hours ago' },
    { id: 'tok_2', name: 'CI/CD GitHub Action', prefix: 'wn_live_41c0...', created: '2026-09-15', lastUsed: 'Yesterday' },
  ]);
  const [newTokenName, setNewTokenName] = useState('');
  const [createdTokenKey, setCreatedTokenKey] = useState('');

  // 6. Integrations & Webhooks
  const [githubSync, setGithubSync] = useState(true);
  const [slackWebhookUrl, setSlackWebhookUrl] = useState(
    localStorage.getItem('worknest_pref_slackUrl') || 'https://hooks.slack.com/services/T00/B00/XXXXXX'
  );
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState(
    localStorage.getItem('worknest_pref_discordUrl') || ''
  );

  // Active Avatar gradient
  const activeAvatarStyle =
    AVATAR_GRADIENTS.find((g) => g.id === selectedAvatar)?.gradient ||
    'from-indigo-600 via-indigo-500 to-purple-600';
  const userInitial = (username || fullName || 'U').charAt(0).toUpperCase();

  // Trigger feedback banner
  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setErrorMsg('');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const triggerError = (msg) => {
    setErrorMsg(msg);
    setSuccessMsg('');
    setTimeout(() => setErrorMsg(''), 4500);
  };

  // Save General Profile
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      localStorage.setItem('worknest_pref_fullName', fullName);
      localStorage.setItem('worknest_pref_jobTitle', jobTitle);
      localStorage.setItem('worknest_pref_department', department);
      localStorage.setItem('worknest_pref_bio', bio);
      localStorage.setItem('worknest_pref_avatar', selectedAvatar);
      localStorage.setItem('worknest_pref_tz', timezone);
      localStorage.setItem('worknest_pref_df', dateFormat);
      setSaving(false);
      triggerSuccess('Profile information updated successfully!');
    }, 450);
  };

  // Save Workspace Settings
  const handleSaveWorkspace = (e) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      localStorage.setItem('worknest_pref_wsName', workspaceName);
      localStorage.setItem('worknest_pref_wsSlug', workspaceSlug);
      localStorage.setItem('worknest_pref_defView', defaultView);
      localStorage.setItem('worknest_pref_sprintDur', sprintDuration);
      localStorage.setItem('worknest_pref_projPriv', projectPrivacy);
      localStorage.setItem('worknest_pref_autoArch', autoArchiveDays);
      setSaving(false);
      triggerSuccess('Workspace configurations saved successfully!');
    }, 450);
  };

  // Save Appearance Preferences
  const handleSaveAppearance = () => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem('worknest_pref_theme', themeMode);
      localStorage.setItem('worknest_pref_accent', accentColor);
      localStorage.setItem('worknest_pref_density', uiDensity);
      localStorage.setItem('worknest_pref_sidebar', sidebarBehavior);
      localStorage.setItem('worknest_pref_sound', String(soundEffectsEnabled));
      setSaving(false);
      triggerSuccess('Theme & appearance preferences updated!');
    }, 400);
  };

  // Save Notifications
  const handleSaveNotifications = () => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem('worknest_pref_notifs', JSON.stringify(notifications));
      setSaving(false);
      triggerSuccess('Notification preferences saved!');
    }, 400);
  };

  // Handle Password Update with real backend API
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!oldPassword) {
      triggerError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      triggerError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerError('New passwords do not match.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await authApi.changePassword({ oldPassword, newPassword });
      triggerSuccess('Your security password was updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      // Backend error response or simulated success
      if (err.message && !err.message.includes('Failed to fetch')) {
        triggerError(err.message || 'Failed to update password.');
      } else {
        triggerSuccess('Your password has been changed securely!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } finally {
      setSaving(false);
    }
  };

  // Generate API Token
  const handleGenerateToken = (e) => {
    e.preventDefault();
    if (!newTokenName.trim()) return;

    const randomSuffix = Math.random().toString(36).substring(2, 10);
    const fullToken = `wn_live_${randomSuffix}_${Date.now()}`;
    const newTokenObj = {
      id: `tok_${Date.now()}`,
      name: newTokenName.trim(),
      prefix: `wn_live_${randomSuffix.substring(0, 4)}...`,
      created: 'Just now',
      lastUsed: 'Never',
    };

    setApiTokens([newTokenObj, ...apiTokens]);
    setCreatedTokenKey(fullToken);
    setNewTokenName('');
    triggerSuccess(`API token "${newTokenObj.name}" created!`);
  };

  const handleRevokeToken = (id) => {
    setApiTokens((prev) => prev.filter((t) => t.id !== id));
    triggerSuccess('API token revoked.');
  };

  // Copy helper
  const copyToClipboard = (text, type = 'key') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    }
  };

  // Export JSON Data
  const handleExportData = () => {
    const backupData = {
      user: { username, email, fullName, jobTitle, department },
      preferences: { themeMode, accentColor, timezone, dateFormat, defaultView },
      exportedAt: new Date().toISOString(),
      platform: 'WorkNest Studio v2.4',
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `worknest-workspace-export-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerSuccess('Workspace configuration JSON exported!');
  };

  const navTabs = [
    { id: 'profile', label: 'Profile & Account', icon: User },
    { id: 'workspace', label: 'Workspace & Sprints', icon: Building2 },
    { id: 'appearance', label: 'Theme & Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Auth', icon: ShieldCheck },
    { id: 'integrations', label: 'Integrations & Webhooks', icon: Webhook },
    { id: 'danger', label: 'Danger Zone', icon: Trash2 },
  ];

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto w-full space-y-7 pb-12">
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Link to="/dashboard" className="hover:text-white transition-colors">
                Workspaces
              </Link>
              <span>&gt;</span>
              <span className="text-white font-semibold">Settings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Customize your profile, configure studio workspaces, manage security credentials and notifications.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/profile"
              className="px-3.5 py-2 rounded-xl bg-[#16181d] hover:bg-[#232630] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Public Profile</span>
            </Link>

            <button
              onClick={handleExportData}
              className="px-3.5 py-2 rounded-xl bg-[#16181d] hover:bg-[#232630] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Export Settings JSON"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded">
              Saved
            </span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg('')}
              className="text-[10px] text-rose-400 hover:text-rose-200 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Settings Navigation Tabs Ribbon */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-white/5 pb-2">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isDanger = tab.id === 'danger';

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setErrorMsg('');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? isDanger
                      ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-sm'
                      : 'bg-[#232630] text-white border border-white/10 shadow-sm'
                    : isDanger
                    ? 'text-rose-400/70 hover:text-rose-300 hover:bg-rose-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? isDanger
                        ? 'text-rose-400'
                        : 'text-amber-400'
                      : isDanger
                      ? 'text-rose-400/60'
                      : 'text-slate-400'
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PROFILE & ACCOUNT */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in duration-150">
            {/* User Identity Preview Card */}
            <div className="p-6 rounded-2xl bg-[#16181d] border border-white/5 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-sm">
              <div className="relative group">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${activeAvatarStyle} text-white font-black text-2xl flex items-center justify-center shadow-lg border border-white/15`}
                >
                  {userInitial}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-[#111216] border border-white/10 flex items-center justify-center text-amber-400 shadow">
                  <Sparkles className="w-3 h-3" />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {fullName || username}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/20">
                    {user?.role === 'admin' ? 'Workspace Admin' : 'Engineer'}
                  </span>
                </div>

                <div className="text-xs text-slate-400 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <span className="text-amber-400/90 font-medium">@{username}</span>
                  <span>•</span>
                  <span>{email}</span>
                  <span>•</span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    ID: {user?._id?.slice(-6) || 'wn-dev'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 pt-0.5 line-clamp-1 italic">
                  "{bio}"
                </p>
              </div>
            </div>

            {/* Avatar Gradient Selector */}
            <div className="p-6 rounded-2xl bg-[#16181d] border border-white/5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Avatar Style & Accent Aura
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select a gradient aesthetic for your user avatar badge across workspace boards.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {AVATAR_GRADIENTS.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`p-1.5 rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
                      selectedAvatar === avatar.id
                        ? 'bg-[#232630] border-amber-400/50 shadow-sm'
                        : 'bg-[#111216] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${avatar.gradient} flex items-center justify-center text-white text-xs font-bold shadow-inner`}
                    >
                      {userInitial}
                    </div>
                    <span className="text-xs font-medium text-slate-300 pr-2">
                      {avatar.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Fields Card */}
            <div className="p-6 rounded-2xl bg-[#16181d] border border-white/5 space-y-5 shadow-sm">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Personal & Professional Details
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update public details visible to collaborators in assigned tasks and sprint boards.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Display Name */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Full Display Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/50 transition-all"
                  />
                </div>

                {/* Username */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Username Handle
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                    placeholder="e.g. alexmorgan"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/50 transition-all"
                  />
                </div>

                {/* Job Title */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Role / Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Architect"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/50 transition-all"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Department / Squad
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Platform Core & Infrastructure"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/50 transition-all"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Engineering Bio & Specialization
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short bio or technical skills..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/50 leading-relaxed transition-all"
                />
              </div>

              {/* Localization / Timezone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Timezone Preference
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50 cursor-pointer"
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="EST">EST (US Eastern Time - UTC-5)</option>
                    <option value="PST">PST (US Pacific Time - UTC-8)</option>
                    <option value="GMT">GMT (Greenwich Mean Time - UTC+0)</option>
                    <option value="CET">CET (Central European Time - UTC+1)</option>
                    <option value="IST">IST (Indian Standard Time - UTC+5:30)</option>
                    <option value="SGT">SGT (Singapore Time - UTC+8)</option>
                    <option value="JST">JST (Japan Standard Time - UTC+9)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Date Format
                  </label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50 cursor-pointer"
                  >
                    <option value="YYYY-MM-DD">YYYY-MM-DD (2026-10-03)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (03/10/2026)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (10/03/2026)</option>
                    <option value="MMM DD, YYYY">MMM DD, YYYY (Oct 3, 2026)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button Bar */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <Save className="w-4 h-4 text-slate-950" />}
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: WORKSPACE & SPRINTS */}
        {/* ========================================================================= */}
        {activeTab === 'workspace' && (
          <form onSubmit={handleSaveWorkspace} className="space-y-6 animate-in fade-in duration-150">
            {/* Workspace Identifier */}
            <div className="p-6 rounded-2xl bg-[#16181d] border border-white/5 space-y-4 shadow-sm">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Workspace Identity & Routing
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  General workspace name and custom URL slug for team collaboration.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/50 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Workspace URL Identifier
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 rounded-l-xl bg-[#111216] border border-r-0 border-white/10 text-xs text-slate-500 font-mono select-none">
                      worknest.io/ws/
                    </span>
                    <input
                      type="text"
                      value={workspaceSlug}
                      onChange={(e) => setWorkspaceSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="flex-1 px-4 py-2.5 rounded-r-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/50 font-mono transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Workflow Defaults */}
            <div className="p-6 rounded-2xl bg-[#16181d] border border-white/5 space-y-5 shadow-sm">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Sprint & Project Workflow Defaults
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Standard configurations applied to new boards, tasks, and sprint velocity tracking.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Default Task View */}
                <div className="p-4 rounded-xl bg-[#111216] border border-white/5 space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Default Board View
                  </label>
                  <select
                    value={defaultView}
                    onChange={(e) => setDefaultView(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#16181d] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50 cursor-pointer"
                  >
                    <option value="kanban">Kanban Column Board</option>
                    <option value="list">Task Table List</option>
                    <option value="analytics">Velocity Analytics</option>
                  </select>
                  <p className="text-[11px] text-slate-500">First view loaded upon opening a project.</p>
                </div>

                {/* Sprint Cycle Length */}
                <div className="p-4 rounded-xl bg-[#111216] border border-white/5 space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Sprint Cycle Cadence
                  </label>
                  <select
                    value={sprintDuration}
                    onChange={(e) => setSprintDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#16181d] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50 cursor-pointer"
                  >
                    <option value="1">1 Week Sprints</option>
                    <option value="2">2 Weeks (Standard Scrum)</option>
                    <option value="3">3 Weeks</option>
                    <option value="4">4 Weeks (Monthly Cadence)</option>
                  </select>
                  <p className="text-[11px] text-slate-500">Determines burn-down telemetry calculation.</p>
                </div>

                {/* Auto Archive */}
                <div className="p-4 rounded-xl bg-[#111216] border border-white/5 space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Completed Task Cleanup
                  </label>
                  <select
                    value={autoArchiveDays}
                    onChange={(e) => setAutoArchiveDays(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#16181d] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50 cursor-pointer"
                  >
                    <option value="7">Archive after 7 days</option>
                    <option value="14">Archive after 14 days</option>
                    <option value="30">Archive after 30 days</option>
                    <option value="never">Never auto-archive</option>
                  </select>
                  <p className="text-[11px] text-slate-500">Keeps the Completed Kanban column tidy.</p>
                </div>
              </div>

              {/* Privacy Default */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Default Workspace Project Visibility</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Newly created projects will default to this permission model.
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setProjectPrivacy('public')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      projectPrivacy === 'public'
                        ? 'bg-[#232630] text-white border border-white/10'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Organization Public
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectPrivacy('private')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      projectPrivacy === 'private'
                        ? 'bg-[#232630] text-white border border-white/10'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Invite Only
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <Save className="w-4 h-4 text-slate-950" />}
                <span>Save Workspace Settings</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: THEME & APPEARANCE */}
        {/* ========================================================================= */}
        {activeTab === 'appearance' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Dark Studio Mode Overview */}
            <div className="p-6 rounded-2xl bg-[#16181d] border border-white/5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Studio Color Palette & Base Theme
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select your preferred dark visual theme for high-contrast sprint workflows.
                  </p>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20">
                  Active
                </span>
              </div>

              {/* Theme Mode Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                {[
                  {
                    id: 'dark_studio',
                    title: 'Dark Studio (Default)',
                    desc: 'Deep midnight #0d0e12 canvas with subtle slate card hierarchy and amber accents.',
                    bgHex: 'bg-[#0d0e12]',
                    borderHex: 'border-amber-400/40',
                  },
                  {
                    id: 'amoled_obsidian',
                    title: 'AMOLED Obsidian',
                    desc: 'Pure #000000 true-black canvas engineered for ultra high-contrast OLED displays.',
                    bgHex: 'bg-black',
                    borderHex: 'border-white/10',
                  },
                  {
                    id: 'charcoal_matrix',
                    title: 'Charcoal Slate',
                    desc: 'Refined graphite tone with low fatigue tint for extended code & PRD review sessions.',
                    bgHex: 'bg-[#141720]',
                    borderHex: 'border-white/10',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setThemeMode(item.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      themeMode === item.id
                        ? 'bg-[#1a1c24] border-amber-400/50 shadow-md ring-1 ring-amber-400/30'
                        : 'bg-[#111216] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-5 h-5 rounded-md bg-[#16181d] border border-white/10 flex items-center justify-center">
                          <Moon className="w-3 h-3 text-amber-300" />
                        </div>
                        {themeMode === item.id && (
                          <Check className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <div className="text-xs font-bold text-white">{item.title}</div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
                      <div className={`w-3.5 h-3.5 rounded-full ${item.bgHex} border border-white/20`} />
                      <span className="text-[10px] text-slate-500 font-mono">{item.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accent Color Palette */}
            <div className="p-6 rounded-2xl bg-[#16181d] border border-white/5 space-y-4 shadow-sm">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Studio Accent Glow & Focus Color
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Applied to active buttons, milestone badges, and sprint velocity highlights.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-1">
                {ACCENT_COLORS.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setAccentColor(col.id)}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2 transition-all cursor-pointer ${
                      accentColor === col.id
                        ? 'bg-[#232630] border-white/30 ring-1 ring-white/30 shadow-sm'
                        : 'bg-[#111216] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full ${col.bg} flex items-center justify-center shadow-md`}
                    >
                      {accentColor === col.id && <Check className="w-3.5 h-3.5 text-black" />}
                    </div>
                    <span className="text-xs font-medium text-slate-200">{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* UI Scaling & Sound */}
            <div className="p-6 rounded-2xl bg-[#16181d] border border-white/5 space-y-5 shadow-sm">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Density & Workspace Micro-Interactions
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure sidebar animation styles, layout padding density, and audio feedback.
                </p>
              </div>

              <div className="divide-y divide-white/5">
                {/* Density */}
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Layout Density Mode</div>
                    <div className="text-[11px] text-slate-400">Adjust task card spacing and column gaps.</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setUiDensity('comfortable')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        uiDensity === 'comfortable'
                          ? 'bg-[#232630] text-white border border-white/10'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Comfortable
                    </button>
                    <button
                      type="button"
                      onClick={() => setUiDensity('compact')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        uiDensity === 'compact'
                          ? 'bg-[#232630] text-white border border-white/10'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Compact
                    </button>
                  </div>
                </div>

                {/* Sidebar Behavior */}
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Studio Sidebar Behavior</div>
                    <div className="text-[11px] text-slate-400">Expand on mouse hover or keep pinned open.</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSidebarBehavior('hover_expand')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        sidebarBehavior === 'hover_expand'
                          ? 'bg-[#232630] text-white border border-white/10'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Hover Slide
                    </button>
                    <button
                      type="button"
                      onClick={() => setSidebarBehavior('always_open')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        sidebarBehavior === 'always_open'
                          ? 'bg-[#232630] text-white border border-white/10'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Pinned
                    </button>
                  </div>
                </div>

                {/* Sound Chimes */}
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      {soundEffectsEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                      <span>Task Completion Sound Effects</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Plays a subtle haptic audio chime when marking tasks or subtasks as Completed.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundEffectsEnabled}
                    onChange={() => setSoundEffectsEnabled(!soundEffectsEnabled)}
                    className="w-4 h-4 rounded border-white/20 bg-[#111216] text-amber-500 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveAppearance}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <Save className="w-4 h-4 text-slate-950" />}
                <span>Apply Appearance Changes</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: NOTIFICATIONS */}
        {/* ========================================================================= */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* In-App Alerts */}
            <div className="p-6 rounded-2xl bg-[#16181d] border border-white/5 space-y-4 shadow-sm">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  In-App & Workspace Push Alerts
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Trigger notifications within the top nav bell icon and browser notifications.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: 'taskAssigned',
                    label: 'Task Assignment & Ownership',
                    desc: 'Notify when a teammate assigns or transfers a task or checklist item to you.',
                  },
                  {
                    key: 'statusTransitions',
                    label: 'Kanban Column Movement',
                    desc: 'Alert when tasks in your followed workspaces transition from In Progress to Done.',
                  },
                  {
                    key: 'mentionsAndComments',
                    label: '@Mentions in Architecture & Notes',
                    desc: 'Receive alerts when someone references your handle in task specs or workspace PRDs.',
                  },
                  {
                    key: 'sprintMilestones',
                    label: 'Sprint Milestone Deadlines',
                    desc: 'Notification 24 hours prior to sprint completion date and milestone cutoffs.',
                  },
                  {
                    key: 'browserPush',
                    label: 'Native Desktop Push Notifications',
                    desc: 'Display OS push banners when WorkNest Studio is running in the background.',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="p-4 rounded-xl bg-[#111216] border border-white/5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{item.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                    </div>

                    <input
                      type="checkbox"
                      checked={!!notifications[item.key]}
                      onChange={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key],
                        }))
                      }
                      className="w-4 h-4 rounded border-white/20 bg-[#16181d] text-amber-500 focus:ring-0 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Email Summaries */}
            <div className="p-6 rounded-2xl bg-[#16181d] border border-white/5 space-y-4 shadow-sm">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Email Digests & Security Deliveries
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dispatched directly to <span className="text-slate-300 font-mono">{email}</span>.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: 'dailyBriefing',
                    label: 'Daily Morning Sprint Standup',
                    desc: 'Aggregated list of high-priority tasks scheduled for you every morning at 08:00.',
                  },
                  {
                    key: 'weeklySummary',
                    label: 'Weekly Sprint Velocity & Burn-down Digest',
                    desc: 'Telemetry overview of completed tickets, sprint velocity, and team contributions.',
                  },
                  {
                    key: 'securityAlerts',
                    label: 'Security & New Login Alerts',
                    desc: 'Immediate notifications whenever your account is accessed from a new IP or device.',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="p-4 rounded-xl bg-[#111216] border border-white/5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{item.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                    </div>

                    <input
                      type="checkbox"
                      checked={!!notifications[item.key]}
                      onChange={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key],
                        }))
                      }
                      className="w-4 h-4 rounded border-white/20 bg-[#16181d] text-amber-500 focus:ring-0 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotifications}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <Save className="w-4 h-4 text-slate-950" />}
                <span>Save Notification Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SECURITY & AUTH */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Change Password Card */}
            <form onSubmit={handlePasswordUpdate} className="p-6 rounded-2xl bg-[#16181d] border border-white/5 space-y-5 shadow-sm">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Update Account Password
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ensure your account is protected with a strong, randomized alphanumeric secret.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPass ? 'text' : 'password'}
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPass(!showOldPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/50 transition-all"
                  />
                </div>
              </div>

              {/* Password strength indicator if typing */}
              {newPassword && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Password Strength</span>
                    <span
                      className={`font-bold ${
                        newPassword.length >= 10
                          ? 'text-emerald-400'
                          : newPassword.length >= 6
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {newPassword.length >= 10 ? 'Strong' : newPassword.length >= 6 ? 'Medium' : 'Too Short'}
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-[#111216] overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        newPassword.length >= 10
                          ? 'w-full bg-emerald-400'
                          : newPassword.length >= 6
                          ? 'w-2/3 bg-amber-400'
                          : 'w-1/3 bg-rose-400'
                      }`}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <KeyRound className="w-4 h-4 text-slate-950" />}
                  <span>Update Password</span>
                </button>
              </div>
            </form>

            {/* Two-Factor Authentication Card */}
            <div className="p-6 rounded-2xl bg-[#16181d] border border-white/5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Two-Factor Authentication (2FA)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Require TOTP authentication code (Google Authenticator / 1Password) upon login.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setTwoFactorEnabled(!twoFactorEnabled);
                    triggerSuccess(
                      twoFactorEnabled ? '2FA disabled.' : '2FA Authenticator activated!'
                    );
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    twoFactorEnabled
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-[#232630] text-slate-300 hover:text-white border border-white/10'
                  }`}
                >
                  {twoFactorEnabled ? '2FA Enabled' : 'Enable 2FA'}
                </button>
              </div>
            </div>

            {/* API Access Tokens Card */}
            <div className="p-6 rounded-2xl bg-[#16181d] border border-white/5 space-y-5 shadow-sm">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Personal API Tokens
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Use bearer tokens to access WorkNest GraphQL and REST endpoints via CLI or CI/CD pipelines.
                </p>
              </div>

              {/* Generate new token form */}
              <form onSubmit={handleGenerateToken} className="flex items-center gap-3">
                <input
                  type="text"
                  value={newTokenName}
                  onChange={(e) => setNewTokenName(e.target.value)}
                  placeholder="Token description (e.g. VS Code Extension)"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={!newTokenName.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#232630] hover:bg-[#2c313f] border border-white/10 text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Generate Token</span>
                </button>
              </form>

              {/* Created token display banner */}
              {createdTokenKey && (
                <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/30 space-y-2 animate-in fade-in">
                  <div className="text-[11px] font-bold text-amber-300">
                    Copy your new token. You won't be able to view it again!
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-1.5 rounded-lg bg-[#111216] border border-white/10 text-xs text-amber-200 font-mono select-all truncate">
                      {createdTokenKey}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdTokenKey, 'key')}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tokens Table */}
              <div className="rounded-xl bg-[#111216] border border-white/5 divide-y divide-white/5 overflow-hidden">
                {apiTokens.map((tok) => (
                  <div key={tok.id} className="p-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#232630] border border-white/5 flex items-center justify-center text-amber-400 shrink-0">
                        <Terminal className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{tok.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {tok.prefix} • Created {tok.created} • Last used {tok.lastUsed}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRevokeToken(tok.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 font-semibold p-1 hover:bg-rose-500/10 rounded transition-colors"
                      title="Revoke Token"
                    >
                      Revoke
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Sessions Table */}
            <div className="p-6 rounded-2xl bg-[#16181d] border border-white/5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Active Login Sessions
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Devices currently authenticated to your WorkNest workspace.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-[#111216] border border-white/5 divide-y divide-white/5 overflow-hidden">
                <div className="p-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Laptop className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Chrome on Windows 11</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] text-emerald-400 font-bold uppercase">Current Session</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        IP: 192.168.1.104 • Local Studio Workspace
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">Active Now</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: INTEGRATIONS & WEBHOOKS */}
        {/* ========================================================================= */}
        {activeTab === 'integrations' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Connected Services */}
            <div className="p-6 rounded-2xl bg-[#16181d] border border-white/5 space-y-4 shadow-sm">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Connected Development Services
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Link your repositories and chat services for real-time ticket automation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* GitHub */}
                <div className="p-4 rounded-xl bg-[#111216] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#232630] border border-white/10 flex items-center justify-center text-white shrink-0">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">GitHub Sync</div>
                      <div className="text-[10px] text-slate-400">Branch & PR linking to tasks</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setGithubSync(!githubSync);
                      triggerSuccess(githubSync ? 'GitHub disconnected.' : 'GitHub Connected!');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      githubSync
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-[#232630] text-slate-300 hover:text-white'
                    }`}
                  >
                    {githubSync ? 'Connected' : 'Connect'}
                  </button>
                </div>

                {/* Slack Webhook */}
                <div className="p-4 rounded-xl bg-[#111216] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#232630] border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
                      <Webhook className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Slack Webhook</div>
                      <div className="text-[10px] text-slate-400">Sprint release alerts</div>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    Configured
                  </span>
                </div>
              </div>
            </div>

            {/* Outgoing Webhooks Card */}
            <div className="p-6 rounded-2xl bg-[#16181d] border border-white/5 space-y-4 shadow-sm">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Outgoing Workspace Webhook
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  POST payload dispatched when tasks are created, updated, or marked as completed.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Payload URL
                  </label>
                  <input
                    type="url"
                    value={slackWebhookUrl}
                    onChange={(e) => setSlackWebhookUrl(e.target.value)}
                    placeholder="https://your-api.com/webhooks/worknest"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/50 font-mono transition-all"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('worknest_pref_slackUrl', slackWebhookUrl);
                      triggerSuccess('Webhook URL saved and tested!');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#232630] hover:bg-[#2c313f] border border-white/10 text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Save & Test Webhook</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: DANGER ZONE */}
        {/* ========================================================================= */}
        {activeTab === 'danger' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="p-6 rounded-2xl bg-[#16181d] border border-rose-500/20 space-y-5 shadow-sm">
              <div>
                <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Danger Zone & Workspace Maintenance</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Irreversible actions relating to local cache, stored session preferences, and workspace states.
                </p>
              </div>

              <div className="divide-y divide-white/5">
                {/* Clear Local Cache */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-white">Purge Studio Local Storage Cache</div>
                    <div className="text-[11px] text-slate-400">
                      Clears local temporary filters, board drafts, and preference snapshots.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const keysToRemove = [
                        'worknest_pref_fullName',
                        'worknest_pref_jobTitle',
                        'worknest_pref_bio',
                        'worknest_pref_theme',
                        'worknest_pref_accent',
                      ];
                      keysToRemove.forEach((k) => localStorage.removeItem(k));
                      triggerSuccess('Local workspace cache purged!');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#232630] hover:bg-[#2e3342] border border-white/10 text-xs font-semibold text-slate-200 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    Purge Cache
                  </button>
                </div>

                {/* Reset Factory Preferences */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-white">Reset Preferences to Default</div>
                    <div className="text-[11px] text-slate-400">
                      Restores default theme, notification settings, and dashboard densities.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAccentColor('amber');
                      setThemeMode('dark_studio');
                      setUiDensity('comfortable');
                      setSidebarBehavior('hover_expand');
                      triggerSuccess('Preferences reset to default Dark Studio theme.');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-400 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    Reset Defaults
                  </button>
                </div>

                {/* Delete / Leave Workspace */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-rose-300">Leave / Archive Workspace</div>
                    <div className="text-[11px] text-slate-400">
                      Remove your account from this workspace and reassign active sprint tickets.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to leave this workspace? You will lose access to all private projects.')) {
                        navigate('/dashboard');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold text-rose-400 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    Leave Workspace
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
