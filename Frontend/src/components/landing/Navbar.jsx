import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SpecularButton from '../common/SpecularButton';

export function Navbar() {
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Workspace', href: '#workspace' },
    { name: 'Modules', href: '#modules' },
    { name: 'Features', href: '#features' },
    { name: 'Workflow', href: '#how-it-works' },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    if (href === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-5 inset-x-0 z-50 flex justify-center px-3 sm:px-4 transition-all duration-300">
      <nav className="glass-capsule w-full max-w-5xl rounded-full px-3.5 sm:px-5 py-2 flex items-center justify-between shadow-2xl relative" data-purpose="navigation-bar">
        {/* Brand Logo & Name */}
        <Link aria-label="WorkNest Home" className="flex items-center gap-2.5 group focus:outline-none shrink-0" to="/">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden flex items-center justify-center p-0.5 shadow-sm transition-transform duration-200 group-hover:scale-105 bg-indigo-600/30 border border-indigo-400/30">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span className="text-white text-base sm:text-lg font-bold tracking-tight group-hover:text-indigo-400 transition-colors">WorkNest</span>
        </Link>

        {/* Center Nav Tabs: Home, Workspace, Modules, Features, Workflow */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 text-xs sm:text-sm font-medium text-slate-300 px-2">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-all duration-150 whitespace-nowrap cursor-pointer" 
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Action: Specular Login Tab */}
        <div className="flex items-center shrink-0">
          <SpecularButton 
            onClick={() => navigate('/login')}
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
            Login
          </SpecularButton>
        </div>
      </nav>
    </header>
  );
}
