"use client";
import { useEffect, useState } from 'react';
import { companyData } from '@/lib/data';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#09051e]">

      {/* ── Glow Orb Ambience ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary violet orb — top-left */}
        <div
          className="absolute -top-40 left-1/4 w-[650px] h-[650px] rounded-full blur-[130px]"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.28) 0%, transparent 70%)' }}
        />
        {/* Cyan orb — bottom-right */}
        <div
          className="absolute -bottom-40 right-1/4 w-[550px] h-[550px] rounded-full blur-[110px]"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.22) 0%, transparent 70%)' }}
        />
        {/* Small accent orb — center-right */}
        <div
          className="absolute top-1/2 -right-16 w-72 h-72 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)' }}
        />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/5 w-28 h-28 border border-violet-500 opacity-20 rotate-45 animate-float rounded-sm" />
        <div
          className="absolute bottom-1/3 right-1/4 w-20 h-20 border border-cyan-400 opacity-20 rotate-12 animate-float rounded-sm"
          style={{ animationDelay: '1.2s' }}
        />
        <div
          className="absolute top-2/3 left-16 w-12 h-12 border border-violet-300 opacity-15 rounded-full animate-float"
          style={{ animationDelay: '2.4s' }}
        />
        <div
          className="absolute top-1/3 right-1/6 w-6 h-6 bg-cyan-400 opacity-30 rounded-full animate-float"
          style={{ animationDelay: '0.8s' }}
        />
      </div>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32 text-center">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Agency badge */}
          <div className="inline-flex items-center space-x-2 bg-violet-500/10 border border-violet-500/25 text-violet-300 text-sm font-medium px-5 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span>Software Development Agency</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
            {companyData.hero.headline}
            <span className="block text-4xl sm:text-5xl lg:text-6xl gradient-text mt-3">
              {companyData.hero.subheadline}
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-white/55 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            {companyData.hero.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <a
              href="/contact"
              className="btn-primary text-base px-9 py-4 w-full sm:w-auto"
            >
              {companyData.hero.cta.primary}
            </a>
            <button
              onClick={scrollToProjects}
              className="text-base px-9 py-4 w-full sm:w-auto rounded-[0.625rem] font-semibold
                         border-2 border-white/20 text-white/75
                         hover:border-violet-400 hover:text-white hover:bg-violet-500/10
                         transition-all duration-300 cursor-pointer"
            >
              {companyData.hero.cta.secondary}
            </button>
          </div>

          {/* Trust / Metrics */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {companyData.expertise.metrics.map((metric, index) => (
              <div
                key={index}
                className="text-center opacity-0 animate-fade-in"
                style={{ animationDelay: `${0.2 + index * 0.12}s` }}
              >
                <div className="text-4xl lg:text-5xl font-display font-bold text-cyan-400 mb-2">
                  {metric.value}
                </div>
                <div className="text-sm text-white/45 uppercase tracking-widest">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white opacity-25"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
