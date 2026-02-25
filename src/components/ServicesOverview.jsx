import { companyData } from '@/lib/data';

export default function ServicesOverview() {
  const icons = {
    web: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    mobile: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    custom: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  };

  /* Subtle per-card accent colors cycling through violet → cyan → indigo */
  const cardAccents = [
    { icon: 'bg-violet-100 text-violet-600', bar: 'from-violet-500 to-violet-300', ring: 'hover:border-violet-200' },
    { icon: 'bg-cyan-100 text-cyan-600',     bar: 'from-cyan-500 to-cyan-300',     ring: 'hover:border-cyan-200'   },
    { icon: 'bg-indigo-100 text-indigo-600', bar: 'from-indigo-500 to-indigo-300', ring: 'hover:border-indigo-200' },
  ];

  return (
    <section id="services" className="section-padding bg-[#faf8ff]">
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
          {companyData.services.map((service, index) => {
            const accent = cardAccents[index % cardAccents.length];
            return (
              <div
                key={service.id}
                className={`bg-white rounded-2xl p-8 shadow-md card-hover border border-gray-100 ${accent.ring} transition-colors duration-300 animate-scale-in`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Icon */}
                <div className={`mb-6 w-14 h-14 rounded-xl flex items-center justify-center ${accent.icon}`}>
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

                {/* Accent bar */}
                <div className={`mt-6 w-12 h-1 rounded-full bg-gradient-to-r ${accent.bar}`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
