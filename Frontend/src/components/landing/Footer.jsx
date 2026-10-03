import React from 'react';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#0d0e12] pt-16 pb-12 text-sm text-slate-400" data-purpose="site-footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo & Mission Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center p-0.5 bg-[#16181d] border border-white/10">
                <img
                  src="/logo.png"
                  alt="WorkNest Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-white font-bold text-lg">WorkNest</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
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
              <li><a className="hover:text-white transition-colors" href="#workspace">Changelog</a></li>
            </ul>
          </div>

          {/* Links Column 2: Resources */}
          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Resources</h5>
            <ul className="space-y-2 text-xs">
              <li><a className="hover:text-white transition-colors" href="#workspace">Documentation</a></li>
              <li><a className="hover:text-white transition-colors" href="#workspace">API Reference</a></li>
              <li><a className="hover:text-white transition-colors" href="#workspace">Product Guides</a></li>
              <li><a className="hover:text-white transition-colors" href="#workspace">Community</a></li>
              <li><a className="hover:text-white transition-colors" href="#workspace">System Status</a></li>
            </ul>
          </div>

          {/* Links Column 3: Company */}
          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Company</h5>
            <ul className="space-y-2 text-xs">
              <li><a className="hover:text-white transition-colors" href="#workspace">About Us</a></li>
              <li><a className="hover:text-white transition-colors" href="#workspace">Careers</a></li>
              <li><a className="hover:text-white transition-colors" href="#workspace">Privacy Policy</a></li>
              <li><a className="hover:text-white transition-colors" href="#workspace">Terms of Service</a></li>
              <li><a className="hover:text-white transition-colors" href="#workspace">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>Crafted with precision for high-output product engineering.</div>
          <div className="flex items-center space-x-5">
            <span className="hover:text-slate-300 cursor-pointer">Twitter / X</span>
            <span className="hover:text-slate-300 cursor-pointer">GitHub</span>
            <span className="hover:text-slate-300 cursor-pointer">Discord</span>
            <span className="hover:text-slate-300 cursor-pointer">LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
