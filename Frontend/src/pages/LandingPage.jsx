import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { MetricsRibbon } from '../components/landing/MetricsRibbon';
import { InteractiveWorkspaceShowcase } from '../components/landing/InteractiveWorkspaceShowcase';
import { ProjectFeaturesSection } from '../components/landing/ProjectFeaturesSection';
import { FeaturePillars } from '../components/landing/FeaturePillars';
import { HowItWorks } from '../components/landing/HowItWorks';
import { CallToAction } from '../components/landing/CallToAction';
import { Footer } from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="relative bg-[#07090e] min-h-screen text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white bg-fine-grid">
      <Navbar />
      <main>
        <HeroSection />
        <InteractiveWorkspaceShowcase />
        <MetricsRibbon />
        <ProjectFeaturesSection />
        <FeaturePillars />
        <HowItWorks />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
