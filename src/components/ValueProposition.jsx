import { companyData } from '@/lib/data';

export default function ValueProposition() {
  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-navy-deep mb-4 decorative-line inline-block">
            {companyData.valueProposition.title}
          </h2>
          <p className="text-xl text-accent-gray max-w-2xl mx-auto mt-6 font-light italic">
            {companyData.valueProposition.subtitle}
          </p>
        </div>

        {/* Value Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {companyData.valueProposition.points.map((point, index) => (
            <div
              key={index}
              className="relative bg-white rounded-xl p-8 shadow-lg border-l-4 border-accent-gold card-hover opacity-0 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Number Badge */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-navy-primary text-white rounded-full flex items-center justify-center font-display font-bold text-xl shadow-lg">
                {index + 1}
              </div>

              {/* Content */}
              <div className="mt-4">
                <h3 className="text-2xl font-display font-bold text-navy-deep mb-4">
                  {point.title}
                </h3>
                <p className="text-charcoal leading-relaxed">
                  {point.description}
                </p>
              </div>

              {/* Decorative Corner */}
              <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-accent-gold opacity-20 rounded-br-xl"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <a
            href="/contact"
            className="btn-primary text-lg px-10 py-4 inline-flex items-center space-x-3"
          >
            <span>Let's Build Something Great</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}