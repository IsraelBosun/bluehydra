"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { companyData } from '@/lib/data';

export default function Navbar() {
  const [isScrolled, setIsScrolled]         = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Lock body scroll while mobile overlay is open */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* ── Floating Header ──────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div
          className={`mx-auto px-4 transition-all duration-500 ease-in-out ${
            isScrolled ? 'max-w-5xl pt-3' : 'max-w-7xl pt-5'
          }`}
        >
          <div
            className={`flex items-center justify-between pointer-events-auto rounded-2xl transition-all duration-500 ease-in-out ${
              isScrolled
                ? 'bg-[#0c0825]/95 backdrop-blur-2xl border border-white/10 px-5 py-3 shadow-2xl shadow-violet-950/60 ring-1 ring-violet-500/10'
                : 'bg-[#09051e]/45 backdrop-blur-md border border-white/8 px-6 py-4'
            }`}
          >

            {/* ── Logo ─────────────────────────────────────────────────── */}
            <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
              {/* Geometric icon mark */}
              <div className="relative w-9 h-9 flex-shrink-0">
                {/* Outer rotated square — gradient */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 rotate-[8deg] group-hover:rotate-[16deg] transition-transform duration-400 shadow-lg shadow-violet-500/30" />
                {/* Inner white diamond */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3.5 h-3.5 bg-white/90 rounded-sm rotate-45" />
                </div>
              </div>

              {/* Wordmark */}
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-white/90 transition-colors duration-300">
                {companyData.name}
              </span>
            </Link>

            {/* ── Desktop Nav Links ──────────────────────────────────────── */}
            <nav className="hidden md:flex items-center space-x-1 mx-6">
              {companyData.navigation.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-white/60 hover:text-white rounded-xl hover:bg-white/6 transition-all duration-200 group/link"
                >
                  {item.label}
                  {/* Animated gradient underline */}
                  <span className="absolute bottom-1.5 left-4 right-4 h-px bg-gradient-to-r from-violet-400 to-cyan-400 scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                </Link>
              ))}
            </nav>

            {/* ── Desktop CTA ────────────────────────────────────────────── */}
            <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
              {isScrolled ? (
                <Link
                  href="/contact"
                  className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400 transition-all duration-300 shadow-lg shadow-violet-700/30 hover:shadow-violet-600/50 hover:-translate-y-px"
                >
                  Get Started
                </Link>
              ) : (
                <Link
                  href="/contact"
                  className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-white/8 border border-white/18 text-white/85 hover:text-white hover:bg-white/15 hover:border-white/30 transition-all duration-300"
                >
                  Get Started
                </Link>
              )}
            </div>

            {/* ── Mobile Hamburger ───────────────────────────────────────── */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden flex flex-col items-center justify-center w-10 h-10 space-y-1.5 rounded-xl hover:bg-white/8 transition-colors duration-200"
              aria-label="Open navigation menu"
            >
              <span className="w-5 h-px bg-white rounded-full" />
              <span className="w-3.5 h-px bg-white/50 rounded-full self-start ml-[10px]" />
              <span className="w-5 h-px bg-white rounded-full" />
            </button>

          </div>
        </div>
      </header>

      {/* ── Full-Screen Mobile Overlay ────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-400 ease-in-out ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Dark backdrop */}
        <div
          className="absolute inset-0 bg-[#09051e]/98 backdrop-blur-2xl"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Ambient glow orbs */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.20) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-20 right-8 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)' }}
        />

        {/* Menu panel */}
        <div className="relative h-full flex flex-col px-6 py-6">

          {/* Top row: logo + close */}
          <div className="flex items-center justify-between mb-10">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-3"
            >
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 rotate-[8deg]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3.5 h-3.5 bg-white/90 rounded-sm rotate-45" />
                </div>
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                {companyData.name}
              </span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/12 transition-all duration-200"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav links — big & spaced */}
          <nav className="flex-1 flex flex-col justify-center -mt-8 space-y-1">
            {companyData.navigation.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-4 rounded-2xl text-3xl font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200 group"
              >
                <span>{item.label}</span>
                <svg
                  className="w-6 h-6 text-white/20 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-250"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </nav>

          {/* Bottom CTA */}
          <div className="border-t border-white/8 pt-8 space-y-3">
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center w-full bg-gradient-to-r from-violet-600 to-violet-500 text-white font-bold py-4 rounded-2xl hover:from-violet-500 hover:to-violet-400 transition-all duration-300 shadow-xl shadow-violet-700/30 text-base"
            >
              Get Started →
            </Link>
            <p className="text-center text-white/25 text-xs">
              Let's build something great together
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
