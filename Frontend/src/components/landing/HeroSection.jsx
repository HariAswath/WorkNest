import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrismShader } from './PrismShader';
import SpecularButton from '../common/SpecularButton';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[92vh] sm:min-h-[96vh] flex flex-col justify-center items-center pt-32 pb-20 px-4 overflow-hidden" data-purpose="hero-section">
      {/* Shader & Atmosphere Layer Container */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <PrismShader />
        
        {/* Vignette & Smooth Gradient Masks for Seamless Dark Theme Blend */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/40 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#07090e]/30 to-[#07090e] pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#07090e] via-[#07090e]/80 to-transparent pointer-events-none"></div>
      </div>

      {/* Chromatic Light Dispersion Stage Background */}
      <div aria-hidden="true" className="prism-beam-container">
        <div className="prism-light-cone"></div>
        <div className="prism-beam-left"></div>
        <div className="prism-beam-right"></div>
        <div className="prism-beam-floor"></div>
      </div>

      {/* Centered Hero Foreground Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Translucent Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-md mb-8 text-xs font-medium text-slate-300 shadow-inner hover:border-white/20 transition-all cursor-pointer">
          <span className="bg-white text-slate-900 font-bold px-2 py-0.5 rounded-full text-[10px] tracking-wide uppercase">NEW</span>
          <span className="text-slate-200">WorkNest 3.0 Prism Architecture</span>
          <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08] max-w-3xl mb-6">
          A spectrum of tools that power team velocity
        </h1>

        {/* Supporting Subtitle */}
        <p className="text-slate-300 text-base sm:text-lg md:text-xl font-normal max-w-2xl mx-auto leading-relaxed mb-10">
          One unified workspace to plan projects, organize tasks, coordinate teams, and deliver results with crystal clarity.
        </p>

        {/* Dual Button CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <SpecularButton
            onClick={() => navigate('/register')}
            size="lg"
            radius={25}
            lineColor="#ffffff"
            baseColor="#4f46e5"
            textColor="#ffffff"
            tint="#ffffff"
            tintOpacity={0.2}
            blur={12}
            intensity={1.5}
            autoAnimate={true}
          >
            Get started free
          </SpecularButton>
          <a href="#workspace" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 font-semibold text-sm border border-white/10 backdrop-blur-md transition-all duration-200 hover:border-white/20">
            Explore Workspace
          </a>
        </div>
      </div>
    </section>
  );
}
