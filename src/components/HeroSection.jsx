"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { companyData } from '@/lib/data';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #d4d4d4 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_40%,white_100%)]" />

      {/* Content */}
      <motion.div
        className="relative max-w-5xl mx-auto px-6 lg:px-8 py-36 text-center"
        variants={stagger}
        initial="hidden"
        animate={mounted ? "show" : "hidden"}
      >
        {/* Badge */}
        <motion.div variants={fadeUp} className="inline-flex items-center space-x-2 border border-gray-200 bg-white text-gray-500 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest shadow-sm">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span>Software Development Agency</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-black leading-[1.04] tracking-tight mb-4">
          {companyData.hero.headline}
        </motion.h1>
        <motion.h2 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-300 leading-[1.04] tracking-tight mb-8">
          {companyData.hero.subheadline}
        </motion.h2>

        {/* Description */}
        <motion.p variants={fadeUp} className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          {companyData.hero.description}
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/contact"
            className="w-full sm:w-auto px-8 py-3 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow-sm"
          >
            {companyData.hero.cta.primary}
          </a>
          <button
            onClick={scrollToProjects}
            className="w-full sm:w-auto px-8 py-3 border border-gray-300 text-gray-700 bg-white text-sm font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
          >
            {companyData.hero.cta.secondary}
          </button>
        </motion.div>

        {/* Metrics */}
        <motion.div
          variants={stagger}
          className="mt-20 flex flex-col sm:flex-row items-stretch max-w-lg mx-auto border border-gray-200 rounded-xl overflow-hidden shadow-sm"
        >
          {companyData.expertise.metrics.map((metric, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className={`flex-1 py-6 px-6 text-center bg-white ${
                index < companyData.expertise.metrics.length - 1
                  ? 'border-b sm:border-b-0 sm:border-r border-gray-200'
                  : ''
              }`}
            >
              <div className="text-3xl font-bold text-black mb-1">{metric.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <svg className="w-5 h-5 text-gray-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
