"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { companyData } from '@/lib/data';

const FEATURED_COUNT = 5;

const TABS = [
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile Apps' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
};

export default function ProjectsShowcase() {
  const [active, setActive] = useState('web');

  const visible = companyData.projects.filter((p) => !p.hidden);

  const projects = visible
    .filter((p) => (active === 'mobile' ? p.platform === 'mobile' : p.platform !== 'mobile'))
    .slice(0, FEATURED_COUNT);

  return (
    <section id="projects" className="section-padding bg-gray-50 border-y border-gray-200">
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
            Our Work
          </motion.p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-bold text-black tracking-tight leading-tight">
              Selected Projects
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 max-w-sm text-sm leading-relaxed">
              Real work that demonstrates our engineering capabilities
            </motion.p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          role="tablist"
          aria-label="Filter projects by platform"
          className="flex gap-2 mb-10 -mt-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`home-panel-${tab.id}`}
                id={`home-tab-${tab.id}`}
                onClick={() => setActive(tab.id)}
                className={`inline-flex items-center text-sm font-semibold px-5 py-2.5 rounded-lg border transition-colors duration-200 ${
                  isActive
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Projects grid */}
        <motion.div
          key={active}
          role="tabpanel"
          id={`home-panel-${active}`}
          aria-labelledby={`home-tab-${active}`}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={fadeUp}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              <div className="relative h-60 bg-gray-100 overflow-hidden">
                <Image
                  src={project.image}
                  alt={`Screenshot of ${project.title}`}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">{project.type}</p>
                <h3 className="text-xl font-bold text-black mb-2 leading-snug">{project.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{project.description}</p>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-semibold text-black hover:text-gray-500 transition-colors group/link"
                >
                  {project.platform === 'mobile' ? 'View on Google Play' : 'View Project'}
                  <svg className="w-4 h-4 ml-1.5 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View all */}
        <motion.div
          className="mt-12 flex justify-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            View All Projects
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
