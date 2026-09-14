import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutGrid,
  FolderKanban,
  BarChart2,
  MessageSquare,
  Calendar,
  Bell,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Moon
} from 'lucide-react';

export default function Sidebar({ onOpenNotifications = () => {} }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isDashboard = location.pathname === '/dashboard';
  const isProjects = location.pathname === '/projects' || location.pathname.startsWith('/projects/');
  const isAnalytics = location.pathname === '/analytics';
  const isProfile = location.pathname === '/profile';
  const isSettings = location.pathname === '/settings';

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  const navLinks = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutGrid,
      isActive: isDashboard,
      badge: null,
    },
    {
      to: '/projects',
      label: 'Projects',
      icon: FolderKanban,
      isActive: isProjects,
      badge: null,
    },
    {
      to: '/analytics',
      label: 'Analytics',
      icon: BarChart2,
      isActive: isAnalytics,
      badge: null,
    },
    {
      to: '/dashboard',
      label: 'Discussions',
      icon: MessageSquare,
      isActive: false,
      badge: null,
    },
    {
      to: '#',
      label: 'Calendar',
      icon: Calendar,
      isActive: false,
      badge: null,
    },
    {
      to: '#',
      label: 'Notifications',
      icon: Bell,
      isActive: false,
      badge: null,
      hasDot: false,
      onClick: onOpenNotifications,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      isActive: isSettings,
      badge: null,
    },
    {
      to: '/profile',
      label: 'User Profile',
      icon: User,
      isActive: isProfile,
      badge: null,
    },
  ];

  return (
    <div
      className="relative shrink-0 h-screen select-none z-50 w-16"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sliding Sidebar Panel on Hover */}
      <aside
        className={`absolute top-0 left-0 bottom-0 bg-[#111216] border-r border-white/5 flex flex-col justify-between py-5 transition-all duration-300 ease-in-out ${
          isHovered
            ? 'w-64 shadow-2xl shadow-black/90 px-3.5 bg-[#111216]/98 backdrop-blur-2xl'
            : 'w-16 px-0 items-center'
        }`}
      >
        {/* Top Section: Brand & Nav */}
        <div className="flex flex-col gap-6 w-full">
          {/* Brand Logo & Name */}
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 group transition-all ${
              isHovered ? 'px-2' : 'justify-center'
            }`}
            title="WorkNest Studio"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-white/20 to-white/5 border border-white/10 flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-105 transition-transform">
              <svg
                className="w-4.5 h-4.5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 18V9a7 7 0 0 1 14 0v9" />
                <circle cx="11" cy="11" r="2" />
              </svg>
            </div>

            {isHovered && (
              <div className="flex flex-col min-w-0 animate-in fade-in duration-200">
                <span className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                  WorkNest
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </span>
                <span className="text-[10px] text-slate-500 font-medium truncate">
                  Studio Workspace
                </span>
              </div>
            )}
          </Link>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1 w-full">
            {navLinks.map((item, idx) => {
              const Icon = item.icon;
              const content = (
                <div
                  className={`w-full h-9 rounded-xl flex items-center transition-all cursor-pointer ${
                    isHovered ? 'px-3 justify-between' : 'justify-center'
                  } ${
                    item.isActive
                      ? 'bg-[#1e222d] text-white font-semibold border border-white/10 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={!isHovered ? item.label : undefined}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                      {item.hasDot && !isHovered && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#111216]" />
                      )}
                    </div>

                    {isHovered && (
                      <span className="text-xs truncate animate-in fade-in duration-200">
                        {item.label}
                      </span>
                    )}
                  </div>

                  {isHovered && item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        item.badge === 'NEW'
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              );

              return item.onClick ? (
                <button
                  key={idx}
                  type="button"
                  onClick={item.onClick}
                  className="w-full text-left focus:outline-none"
                >
                  {content}
                </button>
              ) : (
                <Link key={idx} to={item.to} className="w-full focus:outline-none">
                  {content}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Profile, Help, Sign Out, Dark Studio */}
        <div className="flex flex-col gap-1.5 w-full pt-4 border-t border-white/5">
          {/* User profile card (expanded on hover) */}
          {isHovered ? (
            <Link
              to="/profile"
              className="px-3 py-2 rounded-xl bg-[#16181d] hover:bg-[#1e2129] border border-white/5 flex items-center gap-2.5 mb-1 transition-colors animate-in fade-in duration-200"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-inner shrink-0">
                {userInitial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">
                  {user?.username || user?.fullName || 'User'}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {user?.email || `@${user?.username}`}
                </div>
              </div>
            </Link>
          ) : (
            <Link
              to="/profile"
              className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-inner mx-auto mb-1 hover:ring-2 hover:ring-white/20 transition-all"
              title={user?.username || 'User Profile'}
            >
              {userInitial}
            </Link>
          )}

          {/* Help & Support */}
          <button
            type="button"
            className={`w-full h-8 rounded-xl flex items-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer ${
              isHovered ? 'px-3 gap-3 justify-start' : 'justify-center'
            }`}
            title={!isHovered ? 'Help & Support' : undefined}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            {isHovered && (
              <span className="text-xs font-medium animate-in fade-in duration-200">
                Help & Support
              </span>
            )}
          </button>

          {/* Sign Out */}
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full h-8 rounded-xl flex items-center text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer ${
              isHovered ? 'px-3 gap-3 justify-start' : 'justify-center'
            }`}
            title={!isHovered ? 'Sign Out' : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {isHovered && (
              <span className="text-xs font-medium animate-in fade-in duration-200">
                Sign Out
              </span>
            )}
          </button>

          {/* Dark Studio Pill Toggle */}
          <div
            className={`rounded-xl bg-[#16181d] border border-white/5 flex items-center text-slate-300 mt-1 ${
              isHovered ? 'h-9 px-3 justify-between' : 'h-8 w-8 justify-center mx-auto'
            }`}
            title="Dark Studio Theme"
          >
            <div className="flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              {isHovered && (
                <span className="text-xs font-medium text-slate-300 animate-in fade-in duration-200">
                  Dark Studio
                </span>
              )}
            </div>
            {isHovered && (
              <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                ACTIVE
              </span>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
