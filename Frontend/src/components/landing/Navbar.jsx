import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SpecularButton from '../common/SpecularButton';

export function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 transition-all duration-300">
      <nav className="glass-capsule w-full max-w-5xl rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-2xl" data-purpose="navigation-bar">
        {/* Brand Logo & Name */}
        <Link aria-label="WorkNest Home" className="flex items-center gap-3 group focus:outline-none" to="/">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center p-0.5 shadow-sm transition-transform duration-200 group-hover:scale-105 bg-indigo-600/30 border border-indigo-400/30">
            <svg className="w-5 h-5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span className="text-white text-lg font-bold tracking-tight group-hover:text-indigo-400 transition-colors">WorkNest</span>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a className="hover:text-white transition-colors duration-150" href="#workspace">Workspace</a>
          <a className="hover:text-white transition-colors duration-150" href="#modules">Modules</a>
          <a className="hover:text-white transition-colors duration-150" href="#features">Features</a>
          <a className="hover:text-white transition-colors duration-150" href="#how-it-works">Workflow</a>
        </div>

        {/* Right Actions: Sign in & Specular Sign Up Button */}
        <div className="flex items-center gap-3.5">
          <Link className="hidden sm:inline-block text-sm font-medium text-slate-300 hover:text-white transition-colors px-2 py-1.5" to="/login">
            Sign in
          </Link>
          <SpecularButton 
            onClick={() => navigate('/register')}
            size="sm"
            radius={20}
            lineColor="#818cf8"
            baseColor="#4f46e5"
            textColor="#ffffff"
            tint="#ffffff"
            tintOpacity={0.15}
            blur={10}
            intensity={1.2}
            autoAnimate={true}
          >
            Sign up
          </SpecularButton>
        </div>
      </nav>
    </header>
  );
}
