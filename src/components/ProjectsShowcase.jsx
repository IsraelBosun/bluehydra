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
              className="group relative bg-gray-50 rounded-2xl overflow-hidden shadow-xl card-hover  animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Project Image Placeholder */}
              <div className="relative h-80 bg-gradient-to-br from-navy-primary to-navy-deep overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Decorative Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-lg rotate-12">Hello</div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 border-2 border-white rounded-lg -rotate-6">worldddd</div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white rounded-full"></div>
                  </div>
                  
                  {/* Project Icon */}
                  <div className="relative z-10 text-white">
                    {project.type === 'Web Application' ? (
                      <svg className="w-24 h-24 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-24 h-24 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-accent-gold opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm  font-semibold text-accent-gold uppercase tracking-wider">
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
                  className="inline-flex items-center mt-6 text-navy-primary font-semibold hover:text-accent-gold transition-colors duration-300 group"
                >
                  View Project
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
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