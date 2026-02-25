import Image from 'next/image';
import { companyData } from '@/lib/data';

export default function ProjectsShowcase() {
  return (
    <section id="projects" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-navy-deep mb-4 decorative-line inline-block">
            Selected Projects
          </h2>
          <p className="text-lg text-charcoal max-w-2xl mx-auto mt-6">
            Real work that demonstrates our engineering capabilities
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {companyData.projects.map((project, index) => (
            <div
              key={project.id}
              className="group relative bg-[#faf8ff] rounded-2xl overflow-hidden shadow-xl card-hover animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Project Screenshot */}
              <div className="relative h-72 bg-navy-deep overflow-hidden">
                <Image
                  src={project.image}
                  alt={`Screenshot of ${project.title}`}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-navy-deep opacity-0 group-hover:opacity-20 transition-opacity duration-400" />
              </div>

              {/* Project Info */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-accent-gold uppercase tracking-wider">
                    {project.type}
                  </span>
                </div>

                <h3 className="text-3xl font-display font-bold text-navy-deep mb-4">
                  {project.title}
                </h3>

                <p className="text-charcoal leading-relaxed">
                  {project.description}
                </p>

                {/* View Project Link */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-6 text-navy-primary font-semibold hover:text-accent-gold transition-colors duration-300 group/link"
                >
                  View Project
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover/link:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
