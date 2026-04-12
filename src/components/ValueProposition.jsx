"use client";
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

export default function ValueProposition() {
  return (
    <section className="section-padding bg-white">
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
            Why Us
          </motion.p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-bold text-black tracking-tight leading-tight max-w-xl">
              {companyData.valueProposition.title}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 max-w-xs text-sm italic">
              {companyData.valueProposition.subtitle}
            </motion.p>
          </div>
        </motion.div>

        {/* Value points grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden mb-14"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {companyData.valueProposition.points.map((point, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="bg-white p-8 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="text-xs font-bold text-gray-200 mb-4 font-mono tracking-widest">0{index + 1}</div>
              <h3 className="text-xl font-bold text-black mb-3 leading-snug">{point.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{point.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <a
            href="/contact"
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#7c3aed] text-white text-sm font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors duration-200 shadow-sm"
          >
            <span>Let's Build Something Great</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
