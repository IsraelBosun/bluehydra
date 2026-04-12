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

export default function ServicesOverview() {
  const icons = {
    web: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    mobile: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    custom: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  };

  return (
    <section id="services" className="section-padding bg-white">
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
            What We Do
          </motion.p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-bold text-black tracking-tight leading-tight max-w-md">
              Our Core Services
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 max-w-sm text-sm leading-relaxed">
              Comprehensive software development solutions tailored to your business needs
            </motion.p>
          </div>
        </motion.div>

        {/* Services grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {companyData.services.map((service) => (
            <motion.div
              key={service.id}
              variants={fadeUp}
              className="bg-white p-8 hover:bg-gray-50 transition-colors duration-200 group"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-black mb-6 group-hover:bg-gray-200 transition-colors">
                {icons[service.icon]}
              </div>
              <h3 className="text-lg font-bold text-black mb-3 leading-snug">{service.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
