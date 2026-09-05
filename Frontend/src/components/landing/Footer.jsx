import React from 'react';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-slate-950/90 pt-16 pb-12 text-sm text-slate-400" data-purpose="site-footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo & Mission Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center p-0.5 bg-indigo-600/30 border border-indigo-400/30">
                <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">WorkNest</span>
            </div>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-4">
              Plan. Collaborate. Deliver. The modern project workspace built for focused teams moving at high velocity.
            </p>
            <div className="text-xs text-slate-500">
              © {new Date().getFullYear()} WorkNest Technologies Inc. All rights reserved.
            </div>
          </div>

          {/* Links Column 1: Product */}
          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Product</h5>
            <ul className="space-y-2 text-xs">
              <li><a className="hover:text-white transition-colors" href="#workspace">Workspace Views</a></li>
              <li><a className="hover:text-white transition-colors" href="#workspace">Kanban Boards</a></li>
              <li><a className="hover:text-white transition-colors" href="#how-it-works">Sprint Analytics</a></li>
              <li><a className="hover:text-white transition-colors" href="#features">Integrations</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Changelog</a></li>
            </ul>
          </div>

          {/* Links Column 2: Resources */}
          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Resources</h5>
            <ul className="space-y-2 text-xs">
              <li><a className="hover:text-white transition-colors" href="#">Documentation</a></li>
              <li><a className="hover:text-white transition-colors" href="#">API Reference</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Product Guides</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Community</a></li>
              <li><a className="hover:text-white transition-colors" href="#">System Status</a></li>
            </ul>
          </div>

          {/* Links Column 3: Company */}
          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Company</h5>
            <ul className="space-y-2 text-xs">
              <li><a className="hover:text-white transition-colors" href="#">About Us</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Careers</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Terms of Service</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>Crafted with precision for high-output product engineering.</div>
          <div className="flex items-center space-x-5">
            <a className="hover:text-slate-300" href="#">Twitter / X</a>
            <a className="hover:text-slate-300" href="#">GitHub</a>
            <a className="hover:text-slate-300" href="#">Discord</a>
            <a className="hover:text-slate-300" href="#">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
