import Image from 'next/image';
import Link from 'next/link';
import { companyData } from '@/lib/data';

export const metadata = {
  title: 'Portfolio — Bluehydra',
  description: 'A full look at the web and mobile applications Bluehydra has built for businesses across consulting, e-commerce, finance, fashion, and creative industries.',
};

export default function PortfolioPage() {
  return (
    <main className="pt-16 bg-white">

      {/* Hero */}
      <section className="px-6 lg:px-8 py-24 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-6">
            Our Portfolio
          </p>
          <h1 className="text-5xl lg:text-6xl font-bold text-black tracking-tight leading-tight mb-8">
            Work we're proud to<br />put our name on.
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl">
            Every project below is a real business we've built for — from e-commerce platforms and consulting websites to compliance advisory and creative studio sites.
          </p>
        </div>
      </section>

      {/* Projects grid */}
      <section className="px-6 lg:px-8 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">
          {companyData.projects.filter((p) => !p.hidden).map((project) => (
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
                  View Project
                  <svg className="w-4 h-4 ml-1.5 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-8 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-black tracking-tight mb-5">
            Ready to build something?
          </h2>
          <p className="text-gray-500 text-lg mb-10 max-w-lg mx-auto">
            Tell us about your project. We'll give you an honest assessment and a clear plan.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-[#7c3aed] text-white text-sm font-semibold px-8 py-4 rounded-lg hover:bg-[#6d28d9] transition-colors duration-200"
          >
            Start a Project
          </Link>
        </div>
      </section>

    </main>
  );
}
