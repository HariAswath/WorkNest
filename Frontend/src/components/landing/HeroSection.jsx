import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PrismShader } from './PrismShader';
import SpecularButton from '../common/SpecularButton';
import { ArrowRight, Sparkles, Play } from 'lucide-react';

export function HeroSection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section
      className="relative min-h-[92vh] sm:min-h-[96vh] flex flex-col justify-center items-center pt-32 pb-20 px-4 overflow-hidden"
      data-purpose="hero-section"
      id="hero"
    >
      {/* Shader & Atmosphere Layer Container */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      >
        <PrismShader />

        {/* Vignette & Smooth Gradient Masks for Seamless Dark Theme Blend */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-[#0d0e12]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0d0e12]/30 to-[#0d0e12] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0d0e12] via-[#0d0e12]/80 to-transparent pointer-events-none" />
      </div>

      {/* Chromatic Light Dispersion Stage Background */}
      <div aria-hidden="true" className="prism-beam-container">
        <div className="prism-light-cone" />
        <div className="prism-beam-left" />
        <div className="prism-beam-right" />
        <div className="prism-beam-floor" />
      </div>

      {/* Centered Hero Foreground Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08] max-w-3xl mb-6">
          A spectrum of tools that power{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
            team velocity
          </span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="text-slate-300 text-base sm:text-lg md:text-xl font-normal max-w-2xl mx-auto leading-relaxed mb-10">
          One unified workspace to plan projects, organize tasks, coordinate teams, and deliver results with crystal clarity.
        </p>

        {/* Dual Button CTAs Side by Side */}
        <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-2xl mx-auto flex-nowrap">
          {user ? (
            <SpecularButton
              onClick={() => navigate('/dashboard')}
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
              Enter Studio Dashboard
            </SpecularButton>
          ) : (
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
              Get started free
            </SpecularButton>
          )}

          <a
            href="#workspace"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-[18px] rounded-[25px] bg-[#16181d]/90 hover:bg-[#232630] text-slate-200 hover:text-white font-semibold text-sm sm:text-base border border-white/10 hover:border-amber-400/30 backdrop-blur-md transition-all duration-200 shadow-sm shrink-0 whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Explore Workspace</span>
          </a>
        </div>
      </div>
    </section>
  );
}
