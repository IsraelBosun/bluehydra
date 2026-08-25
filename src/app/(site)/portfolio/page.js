import Link from 'next/link';
import PortfolioGrid from '@/components/PortfolioGrid';

export const metadata = {
  title: 'Portfolio | Bluehydra',
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
            Every project below is a real business we've built for, from e-commerce platforms and consulting websites to compliance advisory and creative studio sites.
          </p>
        </div>
      </section>

      {/* Projects grid */}
      <PortfolioGrid />

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
