import { companyData } from '@/lib/data';

export default function ExpertiseStrip() {
  return (
    <section id="about" className="section-padding bg-navy-deep text-white relative overflow-hidden">

      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Title & Description */}
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-white decorative-line">
              {companyData.expertise.title}
            </h2>
            <p className="text-lg text-white/65 leading-relaxed">
              {companyData.expertise.description}
            </p>
          </div>

          {/* Right: Focus Areas */}
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-semibold text-accent-gold mb-6">
              Core Focus Areas
            </h3>
            <ul className="space-y-4">
              {companyData.expertise.focusAreas.map((area, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-4 text-white/85 opacity-0 animate-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-2 h-2 bg-accent-gold rounded-full" />
                  <span className="text-lg font-medium">{area}</span>
                </li>
              ))}
            </ul>

            {/* Metrics */}
            <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              {companyData.expertise.metrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-display font-bold text-accent-gold mb-1">
                    {metric.value}
                  </div>
                  <div className="text-xs text-white/45 uppercase tracking-wider">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
