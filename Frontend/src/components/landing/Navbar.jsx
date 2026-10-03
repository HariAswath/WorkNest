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
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden flex items-center justify-center p-0.5 shadow-sm transition-transform duration-200 group-hover:scale-105 bg-white/5 border border-white/10">
            <img
              src="/logo.png"
              alt="WorkNest Logo"
              className="w-full h-full object-contain"
            />
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
