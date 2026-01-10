import { companyData } from '@/lib/data';

export default function ServicesOverview() {
  const icons = {
    web: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    mobile: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    custom: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  };

  return (
    <section id="services" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-navy-deep mb-4 decorative-line inline-block">
            Our Core Services
          </h2>
          <p className="text-lg text-charcoal max-w-2xl mx-auto mt-6">
            Comprehensive software development solutions tailored to your business needs
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companyData.services.map((service, index) => (
            <div
              key={service.id}
              className="bg-white rounded-xl p-8 shadow-lg card-hover border border-gray-100 opacity-0 animate-scale-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Icon */}
              <div className="mb-6 text-navy-primary">
                {icons[service.icon]}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-display font-bold text-navy-deep mb-4">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-charcoal leading-relaxed">
                {service.description}
              </p>

              {/* Decorative Element */}
              <div className="mt-6 w-12 h-1 bg-gradient-to-r from-accent-gold to-transparent"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}