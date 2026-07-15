"use client";
import { motion } from 'framer-motion';
import { companyData } from '@/lib/data';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

const slideLeft = {
  hidden: { opacity: 0, x: -24 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

const slideRight = {
  hidden: { opacity: 0, x: 24 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09 } },
};

export default function ExpertiseStrip() {
  return (
    <section id="about" className="section-padding bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <motion.div
            className="space-y-6"
            variants={slideLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">About Us</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-black leading-tight tracking-tight">
              {companyData.expertise.title}
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              {companyData.expertise.description}
            </p>
          </motion.div>

          {/* Right */}
          <motion.div
            className="space-y-8"
            variants={slideRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">Core Focus</p>
              <motion.ul className="space-y-3" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
                {companyData.expertise.focusAreas.map((area, index) => (
                  <motion.li key={index} variants={fadeUp} className="flex items-center space-x-3 text-gray-700">
                    <svg className="w-4 h-4 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-base font-medium">{area}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
