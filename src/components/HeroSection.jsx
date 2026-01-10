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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-navy-primary opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-gold opacity-5 rounded-full blur-3xl"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-navy-primary opacity-10 rotate-45 animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border-2 border-accent-gold opacity-10 rotate-12 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-navy-deep mb-6 leading-tight">
            {companyData.hero.headline}
            <span className="block text-4xl sm:text-5xl lg:text-6xl gradient-text mt-2">
              {companyData.hero.subheadline}
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-charcoal max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            {companyData.hero.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="/contact"
              className="btn-primary text-base px-8 py-4 w-full sm:w-auto"
            >
              {companyData.hero.cta.primary}
            </a>
            <button
              onClick={scrollToProjects}
              className="btn-secondary text-base px-8 py-4 w-full sm:w-auto"
            >
              {companyData.hero.cta.secondary}
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {companyData.expertise.metrics.map((metric, index) => (
              <div
                key={index}
                className="text-center opacity-0 animate-fade-in"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="text-4xl lg:text-5xl font-display font-bold text-navy-primary mb-2">
                  {metric.value}
                </div>
                <div className="text-sm text-accent-gray uppercase tracking-wider">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-navy-primary opacity-50"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}