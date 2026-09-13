import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Plus, Search, LogOut, User, LayoutGrid, Bell, ChevronDown, Sparkles } from 'lucide-react';

export default function DashboardNavbar({ onOpenCreateModal, searchQuery, setSearchQuery }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-40 bg-[#07090e]/80 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Links */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-3 group focus:outline-none shrink-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center p-0.5 shadow-sm transition-transform duration-200 group-hover:scale-105 bg-indigo-600/30 border border-indigo-400/30">
              <svg className="w-5 h-5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="text-white text-lg font-bold tracking-tight group-hover:text-indigo-400 transition-colors">WorkNest</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs sm:text-sm font-medium">
            <Link
              to="/dashboard"
              className="px-3 py-1.5 rounded-lg bg-white/5 text-white font-semibold transition-colors flex items-center gap-1.5"
            >
              <LayoutGrid className="w-4 h-4 text-indigo-400" />
              Projects
            </Link>
            <Link
              to="/"
              className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Landing
            </Link>
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden sm:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by name or description..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        {/* Right: Actions & User Dropdown */}
        <div className="flex items-center gap-3">
          {/* New Project CTA Button */}
          <button
            onClick={onOpenCreateModal}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Project</span>
            <span className="sm:hidden">New</span>
          </button>

          {/* User Profile Avatar / Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all focus:outline-none cursor-pointer"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                {userInitial}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-tight">
                  {user?.username || 'Member'}
                </span>
                <span className="text-[10px] text-slate-400 leading-tight">
                  {user?.email ? user.email.slice(0, 18) + (user.email.length > 18 ? '...' : '') : ''}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2.5 border-b border-white/5 mb-1.5">
                  <div className="text-xs font-bold text-white">{user?.username}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-semibold text-indigo-300">
                    <Sparkles className="w-2.5 h-2.5" />
                    Verified Workspace
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
