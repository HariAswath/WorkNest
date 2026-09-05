import React from 'react';
import { useNavigate } from 'react-router-dom';
import SpecularButton from '../common/SpecularButton';

export function CallToAction() {
  const navigate = useNavigate();

  return (
    <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 mb-28" data-purpose="cta-section">
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 text-center shadow-2xl">
        {/* Glow effect inside box */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <h2 className="relative z-10 text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto mb-4">
          Ready to power your team's velocity?
        </h2>
        <p className="relative z-10 text-slate-300 text-base sm:text-lg max-w-xl mx-auto mb-8">
          Join hundreds of teams delivering products faster with crystal clear collaboration.
        </p>
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <SpecularButton
            onClick={() => navigate('/register')}
            size="lg"
            radius={25}
            lineColor="#818cf8"
            baseColor="#4f46e5"
            textColor="#ffffff"
            tint="#ffffff"
            tintOpacity={0.2}
            blur={12}
            intensity={1.5}
            autoAnimate={true}
          >
            Get started for free
          </SpecularButton>
          <a href="#workspace" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-800 text-white font-semibold text-sm border border-white/10 hover:bg-slate-700 transition-all">
            Explore Demo
          </a>
        </div>
        <p className="relative z-10 text-xs text-slate-400 mt-5">No credit card required • Free forever plan available</p>
      </div>
    </section>
  );
}
