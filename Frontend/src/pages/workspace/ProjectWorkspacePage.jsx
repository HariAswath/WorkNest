import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { projectApi } from '../../api/project.api';
import { taskApi } from '../../api/task.api';
import AppShell from '../../components/layout/AppShell';
import KanbanBoard from '../../components/workspace/KanbanBoard';
import TaskDetailDrawer from '../../components/workspace/TaskDetailDrawer';
import CreateTaskModal from '../../components/workspace/CreateTaskModal';
import ProjectNotesHub from '../../components/workspace/ProjectNotesHub';
import {
  Loader2,
  AlertCircle,
  Plus,
  Users,
  CheckSquare,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  Mail,
  UserPlus,
  Edit2,
  Lock,
  Calendar,
  ChevronDown,
  Star,
  SlidersHorizontal,
  FolderKanban,
  FileText,
  Search,
  ListTodo
} from 'lucide-react';

export default function ProjectWorkspacePage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active view tab: 'kanban', 'list', 'notes', 'analytics', 'members'
  const [activeTab, setActiveTab] = useState('kanban');
  const [isPrivate, setIsPrivate] = useState(true);
  const [isStarred, setIsStarred] = useState(false);

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');
  const [notesSearchQuery, setNotesSearchQuery] = useState('');
  const notesHubRef = React.useRef(null);

  // Modal / Drawer state
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [initialTaskStatus, setInitialTaskStatus] = useState('todo');
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Invite member state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');

  // Fetch all real workspace data from backend API
  const fetchWorkspaceData = async () => {
    setLoading(true);
    setError('');

    try {
      const [projRes, membersRes, tasksRes] = await Promise.all([
        projectApi.getProjectById(projectId),
        projectApi.getProjectMembers(projectId),
        taskApi.getTasks(projectId),
      ]);

      if (projRes?.data) {
        setProject(projRes.data);
        setMembers(membersRes?.data || []);
        setTasks(tasksRes?.data || []);
      } else {
        setError('Workspace not found.');
        setProject(null);
        setMembers([]);
        setTasks([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load workspace.');
      setProject(null);
      setMembers([]);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchWorkspaceData();
    }
  }, [projectId]);

  // Determine current user's role in this project
  const currentMemberRecord = members.find(
    (m) => (m.user?._id || m.user || m._id) === user?._id || m.user?.email === user?.email || m.email === user?.email
  );
  const userRole = currentMemberRecord?.role || (project?.createdBy === user?._id ? 'admin' : 'member');
  const isOwnerOrAdmin = userRole === 'admin';
  const canManageTasks = userRole === 'admin' || userRole === 'project_admin';
  const canManageMembers = userRole === 'admin';
  const canManageNotes = userRole === 'admin';

  // Task creation handler
  const handleTaskCreated = async (taskData) => {
    try {
      if (/^[0-9a-fA-F]{24}$/.test(projectId)) {
        const response = await taskApi.createTask(projectId, taskData);
        if (response?.data) {
          setTasks((prev) => [...prev, response.data]);
          return;
        }
      }
    } catch (err) {
      // Local fallback
    }

    const assignedUser = members.find((m) => m.user?._id === taskData.assignedTo)?.user || user;
    const newTask = {
      _id: `task_${Date.now()}`,
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assignedTo: assignedUser,
      subtasks: [],
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  // Quick task status change handler
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      if (/^[0-9a-fA-F]{24}$/.test(projectId) && /^[0-9a-fA-F]{24}$/.test(taskId)) {
        await taskApi.updateTask(projectId, taskId, { status: newStatus });
      }
    } catch (err) {
      // Retain optimistic state
    }
  };

  const handleTaskUpdatedInDrawer = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? { ...t, ...updatedTask } : t))
    );
  };

  const handleTaskDeleted = (deletedTaskId) => {
    setTasks((prev) => prev.filter((t) => t._id !== deletedTaskId));
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviting(true);
    setInviteError('');
    setInviteSuccess('');

    try {
      if (/^[0-9a-fA-F]{24}$/.test(projectId)) {
        await projectApi.addMemberToProject(projectId, {
          email: inviteEmail.trim(),
          role: inviteRole,
        });
        const updatedMembersRes = await projectApi.getProjectMembers(projectId);
        setMembers(updatedMembersRes.data || []);
      } else {
        const newMember = {
          role: inviteRole,
          user: {
            _id: `u_${Date.now()}`,
            username: inviteEmail.split('@')[0],
            fullName: inviteEmail.split('@')[0],
            email: inviteEmail.trim(),
          },
        };
        setMembers((prev) => [...prev, newMember]);
      }
      setInviteSuccess(`Successfully added ${inviteEmail} as ${inviteRole}.`);
      setInviteEmail('');
    } catch (err) {
      setInviteError(err.message || 'Failed to add member.');
    } finally {
      setInviting(false);
    }
  };

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    return tasks.filter((t) => {
      const q = searchQuery.toLowerCase();
      return (
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.assignedTo?.username?.toLowerCase().includes(q) ||
        t.assignedTo?.fullName?.toLowerCase().includes(q)
      );
    });
  }, [tasks, searchQuery]);

  const selectedTaskObj = tasks.find((t) => t._id === selectedTaskId);

  // Navigation tab definitions
  const navTabs = [
    { id: 'kanban', label: 'Kanban Board', icon: FolderKanban },
    { id: 'list', label: 'Task List', icon: CheckSquare, badge: filteredTasks.length },
    { id: 'notes', label: 'Specs & Notes', icon: FileText },
    { id: 'members', label: 'Members', icon: Users, badge: members.length },
  ];

  return (
    <AppShell
      activeProject={project}
      activeWorkspaceTab={activeTab}
      setActiveWorkspaceTab={setActiveTab}
      onOpenCreateTask={() => {
        if (canManageTasks) {
          setInitialTaskStatus('todo');
          setIsCreateTaskOpen(true);
        }
      }}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    >
      <div className="space-y-6">
        {/* Top Breadcrumbs & Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Link to="/projects" className="hover:text-white transition-colors">
              Projects
            </Link>
            <span>&gt;</span>
            <span className="text-white font-semibold">
              {project?.name || 'Workspace'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Last sync: Just now</span>
          </div>
        </div>

        {/* Big Project Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {project?.name || 'Workspace'}
            </h1>
            {isOwnerOrAdmin && (
              <button
                type="button"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Edit Project Title"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Top Right Badges & Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* User Role Badge */}
            <span className="px-2.5 py-1 rounded-xl bg-[#16181d] border border-white/10 text-xs font-bold uppercase tracking-wider text-slate-300">
              {userRole === 'admin' ? 'Workspace Admin' : userRole === 'project_admin' ? 'Project Admin' : 'Member'}
            </span>

            {/* Real Member Avatar Stack */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5 items-center">
                {members.slice(0, 4).map((m, i) => (
                  <div
                    key={m.user?._id || i}
                    className="w-7 h-7 rounded-full bg-[#232630] border border-white/10 text-[10px] font-bold text-slate-200 flex items-center justify-center shadow-sm"
                    title={m.user?.fullName || m.user?.username}
                  >
                    {(m.user?.username || m.username || 'U').charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>
              {members.length > 4 && (
                <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                  +{members.length - 4}
                </span>
              )}
            </div>

            {/* Privacy Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#16181d] border border-white/5 text-xs text-slate-300">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-300">Private</span>
              {isOwnerOrAdmin && (
                <button
                  type="button"
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
                    isPrivate ? 'bg-slate-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                      isPrivate ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              )}
            </div>

            {/* Favorite Star Button */}
            <button
              type="button"
              onClick={() => setIsStarred(!isStarred)}
              className={`p-2 rounded-xl bg-[#16181d] border border-white/5 transition-colors cursor-pointer ${
                isStarred ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-white hover:bg-[#232630]'
              }`}
              title="Bookmark Project"
            >
              <Star className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dedicated Project Functionality Navigation Bar */}
        <div className="flex items-center justify-between gap-4 p-2 rounded-2xl bg-[#16181d] border border-white/5 shadow-sm w-full overflow-x-auto">
          {/* Left: Functionality Navigation Tabs */}
          <div className="flex items-center gap-1.5 shrink-0">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#232630] text-white font-bold border border-white/10 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive ? 'bg-white/20 text-white font-bold' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Dynamic Actions based on active tab and permissions */}
          <div className="flex items-center gap-2.5 shrink-0 ml-auto">
            {activeTab === 'notes' ? (
              <>
                {/* Search documents input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={notesSearchQuery}
                    onChange={(e) => setNotesSearchQuery(e.target.value)}
                    placeholder="Search documents..."
                    className="w-36 sm:w-48 pl-8 pr-3 py-2 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
                  />
                </div>

                {/* + New Document Button (Admin only) */}
                {canManageNotes && (
                  <button
                    onClick={() => {
                      if (notesHubRef.current?.createNewNote) {
                        notesHubRef.current.createNewNote();
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-950" />
                    <span>New Document</span>
                  </button>
                )}
              </>
            ) : activeTab === 'members' ? null : (
              <>
                {/* Search tasks input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-36 sm:w-44 pl-8 pr-3 py-2 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
                  />
                </div>

                {/* + Add Task Button (Admin & Project Admin only) */}
                {canManageTasks && (
                  <button
                    onClick={() => {
                      setInitialTaskStatus('todo');
                      setIsCreateTaskOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-950" />
                    <span>Add Task</span>
                  </button>
                )}

                {/* + Invite Member Button (Admin only) */}
                {canManageMembers && (
                  <button
                    onClick={() => setActiveTab('members')}
                    className="px-3.5 py-2 rounded-xl bg-[#232630] hover:bg-[#2b2f3d] border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors shrink-0"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-slate-300" />
                    <span>Invite</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* View Canvas Body */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-3" />
            <p className="text-xs text-slate-400 font-medium">Loading workspace board & tasks...</p>
          </div>
        ) : (
          <>
            {/* View 1: Studio Kanban Board */}
            {activeTab === 'kanban' && (
              <KanbanBoard
                tasks={filteredTasks}
                members={members}
                canManageTasks={canManageTasks}
                onSelectTask={(t) => setSelectedTaskId(t._id)}
                onOpenCreateTaskWithStatus={(status) => {
                  if (canManageTasks) {
                    setInitialTaskStatus(status || 'todo');
                    setIsCreateTaskOpen(true);
                  }
                }}
                onUpdateTaskStatus={handleUpdateTaskStatus}
              />
            )}

            {/* View 2: Task List */}
            {activeTab === 'list' && (
              <div className="rounded-2xl bg-[#16181d] border border-white/5 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-slate-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      All Tasks ({filteredTasks.length})
                    </h3>
                  </div>
                  {canManageTasks && (
                    <button
                      onClick={() => {
                        setInitialTaskStatus('todo');
                        setIsCreateTaskOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Task</span>
                    </button>
                  )}
                </div>

                <div className="divide-y divide-white/5">
                  {filteredTasks.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-500">
                      No tasks found in this workspace.
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <div
                        key={task._id}
                        onClick={() => setSelectedTaskId(task._id)}
                        className="p-4 hover:bg-white/[0.02] flex items-center justify-between gap-4 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <CheckSquare className="w-4 h-4 text-slate-400 shrink-0" />
                          <div>
                            <h4 className="text-sm font-bold text-white">{task.title}</h4>
                            {task.description && (
                              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{task.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span
                            className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-300 border border-white/10"
                          >
                            {task.status === 'in_progress' ? 'In Progress' : task.status === 'done' ? 'Completed' : 'To Do'}
                          </span>

                          <span className="text-xs text-slate-400 hidden sm:inline">
                            {task.assignedTo?.fullName || task.assignedTo?.username || 'Unassigned'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* View 3: Specs & Notes */}
            {activeTab === 'notes' && (
              <ProjectNotesHub
                ref={notesHubRef}
                projectId={projectId}
                userRole={userRole}
                canManageNotes={canManageNotes}
                currentUser={user}
                searchQuery={notesSearchQuery}
              />
            )}

            {/* View 4: Members & Invite */}
            {activeTab === 'members' && (
              <div className="max-w-3xl space-y-6">
                {/* Invite Collaborator Form (Admin only) */}
                {canManageMembers ? (
                  <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-slate-400" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Invite Collaborator to Workspace
                      </h3>
                    </div>

                    {inviteSuccess && (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>{inviteSuccess}</span>
                      </div>
                    )}

                    {inviteError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                        <span>{inviteError}</span>
                      </div>
                    )}

                    <form onSubmit={handleAddMember} className="flex flex-col sm:flex-row gap-2.5">
                      <div className="relative flex-1">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="teammate@company.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
                        />
                      </div>

                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="px-3 py-2.5 rounded-xl bg-[#111216] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-white/30 cursor-pointer sm:w-44 shrink-0"
                      >
                        <option value="member">Member (Contributor)</option>
                        <option value="project_admin">Project Admin</option>
                      </select>

                      <button
                        type="submit"
                        disabled={inviting}
                        className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shrink-0 shadow-sm"
                      >
                        {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        <span>Add Member</span>
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#16181d] border border-white/5 text-xs text-slate-400">
                    <p>You are viewing this workspace as a <strong className="text-white capitalize">{userRole}</strong>. Only administrators can invite new collaborators.</p>
                  </div>
                )}

                {/* Members List */}
                <div className="p-5 rounded-2xl bg-[#16181d] border border-white/5 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Workspace Members ({members.length})
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {members.map((m) => {
                      const initial = m.user?.username ? m.user.username.charAt(0).toUpperCase() : 'U';
                      const isAdm = m.role === 'admin' || m.role === 'project_admin';

                      return (
                        <div
                          key={m.user?._id || Math.random()}
                          className="p-3.5 rounded-xl bg-[#111216] border border-white/5 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-[#232630] border border-white/10 text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
                              {initial}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white flex items-center gap-2 truncate">
                                <span>{m.user?.fullName || m.user?.username || 'User'}</span>
                                {m.user?._id === user?._id && (
                                  <span className="text-[10px] text-slate-400 font-normal">(You)</span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate">{m.user?.email || `@${m.user?.username}`}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-slate-300">
                              <ShieldCheck className="w-3 h-3 text-slate-400" />
                              {m.role === 'admin' ? 'ADMIN' : m.role === 'project_admin' ? 'PROJECT ADMIN' : 'MEMBER'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        initialStatus={initialTaskStatus}
        members={members}
        onClose={() => setIsCreateTaskOpen(false)}
        onTaskCreated={handleTaskCreated}
      />

      {/* Task Detail Drawer */}
      {selectedTaskId && (
        <TaskDetailDrawer
          projectId={projectId}
          taskId={selectedTaskId}
          initialTask={selectedTaskObj}
          members={members}
          userRole={userRole}
          onClose={() => setSelectedTaskId(null)}
          onTaskUpdated={handleTaskUpdatedInDrawer}
          onTaskDeleted={handleTaskDeleted}
        />
      )}
    </AppShell>
  );
}
