import React, { useState } from 'react';
import Sidebar from './Sidebar';

export default function AppShell({
  children,
  activeProject = null,
  projectsList = [],
  onOpenCreateProject = () => {},
  onOpenCreateTask = null,
  searchQuery = '',
  setSearchQuery = () => {},
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d0e12] text-slate-100 flex font-sans selection:bg-amber-500/30 selection:text-white antialiased overflow-hidden">
      {/* 1. Left Persistent Sidebar */}
      <Sidebar
        onOpenNotifications={() => setNotificationsOpen(!notificationsOpen)}
      />

      {/* 2. Main Studio Workspace Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#0d0e12]">
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-8 lg:p-10">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Notifications Popover if toggled */}
      {notificationsOpen && (
        <div className="fixed top-16 left-64 z-50 w-80 rounded-2xl bg-[#16181d] border border-white/10 shadow-2xl p-4 animate-in fade-in slide-in-from-left-2">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
            <span className="text-xs font-bold text-white">Notifications</span>
            <button
              onClick={() => setNotificationsOpen(false)}
              className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold"
            >
              Close
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-[#111216] border border-white/5 text-slate-300">
              <div className="font-bold text-white text-xs">Sprint Milestone Active</div>
              <div className="text-[11px] text-slate-400 mt-1">
                All workspace boards are up to date.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
