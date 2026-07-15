import Link from 'next/link';
import { companyData } from '@/lib/data';

export const metadata = {
  title: 'About | Bluehydra',
  description: 'We are a software development agency building high-performance web and mobile applications for growing businesses.',
};

const values = [
  {
    title: "We write code that lasts",
    description: "Clean architecture, sensible abstractions, documentation that actually helps. We build software your team can maintain and extend without us holding your hand indefinitely.",
  },
  {
    title: "We say what we mean",
    description: "No inflated timelines to pad delivery. No jargon to obscure progress. You'll always know where your project stands and why decisions are being made.",
  },
  {
    title: "We think about your business",
    description: "Every technical choice is weighed against your actual goals. The best solution isn't always the most sophisticated one. It's the one that moves your business forward.",
  },
  {
    title: "We finish what we start",
    description: "Delivery discipline is non-negotiable. We set realistic expectations and then meet them. If something changes, we tell you early, not after the deadline.",
  },
];

export default function AboutPage() {
  return (
    <main className="pt-16 bg-white">

      {/* Hero */}
      <section className="px-6 lg:px-8 py-24 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-6">
            About Bluehydra
          </p>
          <h1 className="text-5xl lg:text-6xl font-bold text-black tracking-tight leading-tight mb-8">
            We build software<br />that works.
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl">
            Bluehydra is a software development agency focused on web and mobile applications for businesses that are serious about growth. We've been doing this for over eight years, across more than 120 projects and 50 clients.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="px-6 lg:px-8 py-20 border-b border-gray-200">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">Who we are</p>
            <div className="space-y-5 text-gray-600 leading-relaxed text-[15px]">
              <p>
                We started Bluehydra with a straightforward conviction: most software agencies over-promise and under-deliver, and businesses, especially growing ones, deserve better than that.
              </p>
              <p>
                So we built an agency around delivery. Not around pitch decks, not around impressive-sounding methodology names. Around getting things shipped, and shipped well.
              </p>
              <p>
                Today we work with businesses across industries, from consulting firms and e-commerce platforms to event organisations and professional service providers. The work varies. The standards don't.
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">What we build</p>
            <ul className="space-y-4">
              {companyData.expertise.focusAreas.map((area) => (
                <li key={area} className="flex items-start gap-3 text-[15px] text-gray-700">
                  <span className="text-[#7c3aed] mt-0.5 flex-shrink-0">→</span>
                  {area}
                </li>
              ))}
              <li className="flex items-start gap-3 text-[15px] text-gray-700">
                <span className="text-[#7c3aed] mt-0.5 flex-shrink-0">→</span>
                API integrations and backend systems
              </li>
              <li className="flex items-start gap-3 text-[15px] text-gray-700">
                <span className="text-[#7c3aed] mt-0.5 flex-shrink-0">→</span>
                Performance audits and technical consulting
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 lg:px-8 py-20 border-b border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-12">How we work</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <div key={v.title} className="bg-white border border-gray-200 rounded-xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-7 h-7 rounded-full bg-[#ede9fe] text-[#7c3aed] text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-sm font-semibold text-black">{v.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects teaser */}
      <section className="px-6 lg:px-8 py-20 border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Our work</p>
            <h2 className="text-3xl font-bold text-black tracking-tight">See what we've built</h2>
            <p className="text-gray-500 mt-3 text-[15px] max-w-md">
              From e-commerce platforms to consulting websites and studio management tools, here's a sample of projects we've delivered.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 bg-[#7c3aed] text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-[#6d28d9] transition-colors duration-200 flex-shrink-0"
          >
            View Projects
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#7c3aed] text-white text-sm font-semibold px-8 py-4 rounded-lg hover:bg-[#6d28d9] transition-colors duration-200"
            >
              Start a Project
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 text-black text-sm font-semibold px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              See Our Work
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
