'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { companyData } from '@/lib/data';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

export default function Testimonials() {
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const total = companyData.testimonials.length;

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const handleScroll = () => {
      const cardWidth = slider.scrollWidth / total;
      const index = Math.round(slider.scrollLeft / cardWidth);
      setActiveIndex(Math.min(index, total - 1));
    };
    slider.addEventListener('scroll', handleScroll, { passive: true });
    return () => slider.removeEventListener('scroll', handleScroll);
  }, [total]);

  const scrollTo = (index) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const cardWidth = slider.scrollWidth / total;
    slider.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
  };

  return (
    <section className="section-padding bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="mb-16"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Testimonials
          </motion.p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-bold text-black tracking-tight leading-tight">
              Trusted by Industry Leaders
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-sm max-w-xs">
              What our clients say about working with us
            </motion.p>
          </div>
        </motion.div>

        {/* Slider / Grid */}
        <motion.div
          ref={sliderRef}
          className="
            flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4
            lg:grid lg:grid-cols-2 lg:overflow-x-visible lg:snap-none lg:pb-0
            [&::-webkit-scrollbar]:hidden
          "
          style={{ scrollbarWidth: 'none' }}
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {companyData.testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={fadeUp}
              className="snap-start shrink-0 w-[85vw] sm:w-[70vw] lg:w-auto lg:shrink
                         bg-white border border-gray-200 rounded-xl p-6 flex flex-col
                         hover:border-gray-300 hover:shadow-sm transition-all duration-200"
            >
              <svg className="w-6 h-6 text-gray-200 mb-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-gray-700 text-sm leading-relaxed mb-6 flex-1">
                "{testimonial.content}"
              </p>
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white">{testimonial.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-black">{testimonial.name}</div>
                  <div className="text-xs text-gray-400">{testimonial.role}</div>
                  {testimonial.link ? (
                    <a
                      href={testimonial.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#7c3aed] font-medium underline underline-offset-2 decoration-[#7c3aed]/40 hover:decoration-[#7c3aed] transition-colors"
                    >
                      {testimonial.company}
                      <svg className="w-2.5 h-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4-4m0 0h-6m6 0v6M11 4H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4" />
                      </svg>
                    </a>
                  ) : (
                    <div className="text-xs text-gray-400">{testimonial.company}</div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Dot indicators — mobile only */}
        <div className="flex justify-center gap-2 mt-6 lg:hidden">
          {companyData.testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-6 h-2 bg-black' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Trust badge */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="inline-flex items-center space-x-2 border border-gray-200 bg-white px-6 py-3 rounded-full shadow-sm">
            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600 text-sm font-medium">98% Client Satisfaction Rate</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
