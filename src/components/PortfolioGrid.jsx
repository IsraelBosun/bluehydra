"use client";
import { useState } from 'react';
import Image from 'next/image';
import { companyData } from '@/lib/data';

const TABS = [
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile Apps' },
];

export default function PortfolioGrid() {
  const [active, setActive] = useState('web');

  const visible = companyData.projects.filter((p) => !p.hidden);

  const projects = visible.filter((p) =>
    active === 'mobile' ? p.platform === 'mobile' : p.platform !== 'mobile'
  );

  return (
    <section className="px-6 lg:px-8 py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        {/* Tabs */}
        <div role="tablist" aria-label="Filter projects by platform" className="flex gap-2 mb-10">
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
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
        </div>

        {/* Projects grid */}
        <div
          role="tabpanel"
          id={`panel-${active}`}
          aria-labelledby={`tab-${active}`}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          {projects.map((project) => (
            <div
              key={project.id}
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
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
