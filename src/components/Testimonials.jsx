import { companyData } from '@/lib/data';

export default function Testimonials() {
  return (
    <section className="section-padding bg-navy-deep text-white relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-1/3 w-96 h-96 rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4 decorative-line inline-block">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-white/55 max-w-2xl mx-auto mt-6">
            What our clients say about working with us
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {companyData.testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 lg:p-10 border border-white/8 card-hover opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <svg
                  className="w-10 h-10 text-accent-gold opacity-60"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Testimonial Content */}
              <p className="text-lg text-white/75 leading-relaxed mb-8 italic">
                "{testimonial.content}"
              </p>

              {/* Author Info */}
              <div className="flex items-center space-x-4 border-t border-white/10 pt-6">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-gold to-navy-primary flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl font-display font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>

                {/* Author Details */}
                <div>
                  <div className="font-semibold text-white text-lg">
                    {testimonial.name}
                  </div>
                  <div className="text-accent-gold text-sm">
                    {testimonial.role}
                  </div>
                  <div className="text-white/40 text-sm">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-sm px-8 py-4 rounded-full border border-white/10">
            <svg className="w-5 h-5 text-accent-gold" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-white/65 font-medium">98% Client Satisfaction Rate</span>
          </div>
        </div>

      </div>
    </section>
  );
}
