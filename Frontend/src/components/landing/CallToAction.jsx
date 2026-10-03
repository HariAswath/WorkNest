import React from 'react';
import { useNavigate } from 'react-router-dom';
import SpecularButton from '../common/SpecularButton';

export function CallToAction() {
  const navigate = useNavigate();

  return (
    <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 mb-28" data-purpose="cta-section">
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-[#1c1f28] via-[#16181d] to-[#111216] border border-amber-500/30 text-center shadow-2xl shadow-black/80">
        {/* Glow effect inside box */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <h2 className="relative z-10 text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto mb-4">
          Ready to power your team's velocity?
        </h2>
        <p className="relative z-10 text-slate-300 text-base sm:text-lg max-w-xl mx-auto mb-8">
          Join hundreds of teams delivering products faster with crystal clear collaboration.
        </p>
        <div className="relative z-10 flex flex-row items-center justify-center gap-3 sm:gap-4 flex-nowrap">
          <SpecularButton
            onClick={() => navigate('/register')}
            size="lg"
            radius={25}
            lineColor="#fef3c7"
            baseColor="#f59e0b"
            textColor="#020617"
            tint="#ffffff"
            tintOpacity={0.25}
            blur={12}
            intensity={1.5}
            autoAnimate={true}
            className="shrink-0"
          >
            Get started for free
          </SpecularButton>
          <a
            href="#workspace"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-[18px] rounded-[25px] bg-[#111216] text-white font-semibold text-sm sm:text-base border border-white/10 hover:bg-[#1a1d24] transition-all shrink-0 whitespace-nowrap"
          >
            Explore Demo
          </a>
        </div>
        <p className="relative z-10 text-xs text-slate-400 mt-5">No credit card required • Free forever plan available</p>
      </div>
    </section>
  );
}
