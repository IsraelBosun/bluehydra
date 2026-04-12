"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { companyData } from '@/lib/data';
import LogoMark from '@/components/LogoMark';

export default function Navbar() {
  const [isScrolled, setIsScrolled]             = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm'
            : 'bg-transparent'
        }`}
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2.5 group flex-shrink-0">
              <LogoMark size={32} />
              <span className="font-bold text-base tracking-tight text-black">
                {companyData.name}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-1 mx-6">
              {companyData.navigation.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-[#7c3aed] rounded-lg hover:bg-violet-50 transition-all duration-150 font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:block flex-shrink-0">
              <Link
                href="/contact"
                className="px-4 py-2 text-sm font-semibold bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors duration-200"
              >
                Get Started
              </Link>
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center space-y-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Open navigation menu"
            >
              <span className="w-5 h-px bg-black rounded-full" />
              <span className="w-3.5 h-px bg-black/40 rounded-full self-start ml-2" />
              <span className="w-5 h-px bg-black rounded-full" />
            </button>

          </div>
        </div>
      </motion.header>

      {/* Mobile Overlay */}
      <motion.div
        className="fixed inset-0 z-[60] pointer-events-none"
        initial={false}
        animate={isMobileMenuOpen ? { opacity: 1, pointerEvents: 'auto' } : { opacity: 0, pointerEvents: 'none' }}
        transition={{ duration: 0.25 }}
      >
        <div className="absolute inset-0 bg-white" onClick={() => setIsMobileMenuOpen(false)} />

        <div className="relative h-full flex flex-col px-6 py-6">

          {/* Top row */}
          <div className="flex items-center justify-between mb-10">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2.5">
              <LogoMark size={32} />
              <span className="font-bold text-base tracking-tight text-black">{companyData.name}</span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 flex flex-col justify-center space-y-1">
            {companyData.navigation.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-4 rounded-xl text-2xl font-semibold text-gray-800 hover:bg-gray-50 transition-colors group"
              >
                <span>{item.label}</span>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </nav>

          {/* Bottom CTA */}
          <div className="border-t border-gray-100 pt-6">
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center w-full bg-[#7c3aed] text-white font-semibold py-4 rounded-xl hover:bg-[#6d28d9] transition-colors text-base"
            >
              Get Started →
            </Link>
          </div>

        </div>
      </motion.div>
    </>
  );
}
