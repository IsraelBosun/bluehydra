"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { trackFbEvent } from '@/lib/fbpixel';

const SALE_END = new Date('2026-08-01T00:00:00+01:00'); // midnight WAT end of July 31

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

function getTimeLeft() {
  const diff = SALE_END - Date.now();
  if (diff <= 0) return null;
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState(null);
  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);
  return timeLeft;
}

const plans = [
  {
    id: 'website',
    name: 'Website',
    price: '₦300,000',
    salePrice: '₦150,000',
    tagline: 'For businesses that need a serious online presence.',
    comparison: null,
    features: [
      'Up to 10 pages, custom designed',
      'Mobile-responsive, fast loading',
      'Contact forms + WhatsApp integration',
      'Domain + hosting setup (year 1)',
      'SEO + Google Analytics',
      '30 days post-launch support',
    ],
    delivery: '3 days',
    cta: 'Start the conversation →',
    message: "Hi Bluehydra, I'm interested in the Website package at the 50% off price (₦150,000). Can we talk?",
    featured: false,
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    price: '₦600,000',
    salePrice: '₦300,000',
    tagline: 'For businesses ready to sell online.',
    comparison: "Shopify costs ₦45k–₦120k every month, forever. Pay once. Own it.",
    features: [
      'Everything in Website',
      'Full online store',
      'Paystack / Flutterwave integration',
      'Product management dashboard',
      'Order tracking + email confirmations',
      'Inventory basics + customer accounts',
      '60 days post-launch support',
      '2 rounds of revisions',
      'Training session',
    ],
    delivery: '1–2 weeks',
    cta: 'Start the conversation →',
    message: "Hi Bluehydra, I'm interested in the E-commerce package at the 50% off price (₦300,000). Can we talk?",
    featured: true,
  },
  {
    id: 'custom',
    name: 'Custom Software',
    price: '₦1,200,000',
    salePrice: '₦600,000',
    priceNote: 'Starts at',
    tagline: 'For complex projects: dashboards, APIs, mobile apps, integrations.',
    comparison: null,
    features: [
      'Custom scoping session',
      'Tailored architecture (web, mobile, or both)',
      'API integrations (payments, SMS, WhatsApp, third-party)',
      'User auth + role management',
      'Admin dashboards',
      'Cloud deployment + support options',
    ],
    delivery: null,
    cta: 'Request a quote →',
    message: "Hi Bluehydra, I'd like to discuss a custom software project. I saw the 50% off July promo. Can we schedule a scoping call?",
    featured: false,
  },
];

const faqs = [
  {
    question: "What's NOT included?",
    answer: "Content (text and images), ongoing hosting after year 1 (we can manage this for a small fee), and major redesigns after launch.",
  },
  {
    question: "How long until I see something?",
    answer: "For Website packages, you'll see your first design draft within 24–48 hours. For E-commerce, within 3–5 working days.",
  },
  {
    question: "What if I need changes after launch?",
    answer: "Each tier includes a support window. Beyond that, we offer maintenance plans.",
  },
  {
    question: "Can I pay in installments?",
    answer: "Yes, our standard is 50% upfront and 50% on delivery. For Custom Software, we can structure 3 payments tied to milestones.",
  },
  {
    question: "Do you work with businesses outside Nigeria?",
    answer: "Yes. We work with anyone serious about building good software.",
  },
];

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-[#7c3aed] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function TimeBlock({ value, label }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 min-w-[56px] text-center">
        <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums leading-none">
          {display}
        </span>
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-white/50 mt-1.5">
        {label}
      </span>
    </div>
  );
}

function CountdownBanner() {
  const timeLeft = useCountdown();

  if (!timeLeft) return null;

  return (
    <section className="bg-[#09051e] border-b border-white/10">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col items-center text-center gap-6">

          {/* Label */}
          <div className="inline-flex items-center gap-2 bg-[#7c3aed]/20 border border-[#7c3aed]/40 text-violet-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
            July Promo: Ends midnight July 31
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-1">
              50% off everything
            </h2>
            <p className="text-white/50 text-sm">Lock in the price now. Build at your pace.</p>
          </div>

          {/* Countdown */}
          <div className="flex items-end gap-3 sm:gap-4">
            <TimeBlock value={timeLeft.days}    label="Days"    />
            <span className="text-white/30 text-2xl font-light pb-6">:</span>
            <TimeBlock value={timeLeft.hours}   label="Hours"   />
            <span className="text-white/30 text-2xl font-light pb-6">:</span>
            <TimeBlock value={timeLeft.minutes} label="Minutes" />
            <span className="text-white/30 text-2xl font-light pb-6">:</span>
            <TimeBlock value={timeLeft.seconds} label="Seconds" />
          </div>

        </div>
      </div>
    </section>
  );
}

const WA_NUMBER = '2349133105749';

function waLink(message, ref) {
  const text = ref ? `${message} (Referred by: ${ref})` : message;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export default function PricingClient() {
  const [openFaq, setOpenFaq] = useState(null);
  const ref = useSearchParams().get('ref');

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden border-b border-gray-100">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #d4d4d4 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,transparent_50%,white_100%)]" />

        <motion.div
          className="relative max-w-3xl mx-auto text-center"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
            Pricing
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black tracking-tight leading-[1.04] mb-5">
            Simple pricing.<br />
            <span className="text-[#7c3aed]">Real software.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-gray-500 leading-relaxed mb-8 max-w-xl mx-auto">
            Three tiers. No hidden fees. Half down to start, half on delivery.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Countdown Banner ──────────────────────────────────────────── */}
      <CountdownBanner />

      {/* ── Pricing Cards ─────────────────────────────────────────────── */}
      <section className="section-padding px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                variants={fadeUp}
                className={`relative rounded-2xl border bg-white flex flex-col ${
                  plan.featured
                    ? 'border-violet-300 shadow-[0_4px_32px_rgba(124,58,237,0.10)]'
                    : 'border-gray-200 shadow-sm'
                }`}
              >
                {/* 50% OFF ribbon */}
                <div className="absolute -top-3 right-5">
                  <span className="inline-flex items-center bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm tracking-wide">
                    50% OFF
                  </span>
                </div>

                <div className="p-8 flex flex-col flex-1">

                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                    {plan.name}
                  </p>

                  {/* Price block */}
                  <div className="mb-6">
                    {plan.priceNote && (
                      <p className="text-sm text-gray-400 mb-1">{plan.priceNote}</p>
                    )}
                    {/* Sale price */}
                    <div className={`text-4xl lg:text-5xl font-bold tracking-tight leading-none mb-1.5 ${
                      plan.featured ? 'text-[#7c3aed]' : 'text-black'
                    }`}>
                      {plan.salePrice}
                    </div>
                    {/* Original price struck through */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400 line-through">{plan.price}</span>
                      <span className="text-xs font-semibold text-red-500">Save 50%</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {plan.tagline}
                  </p>

                  {plan.comparison && (
                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2.5 mb-4">
                      <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0110 2v8H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38zM14 10h5.657a1 1 0 01.707 1.707l-7 7a1 1 0 01-1.414-1.414L15.586 13H14a1 1 0 01-1-1V2a1 1 0 011.3-.954z" clipRule="evenodd" />
                      </svg>
                      <p className="text-xs font-medium text-amber-700 leading-snug">{plan.comparison}</p>
                    </div>
                  )}

                  <div className="border-t border-gray-100 mb-6" />

                  <ul className="space-y-3.5 flex-1 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600 leading-snug">
                        <CheckIcon />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={`flex items-center gap-2 mb-6 px-4 py-2.5 rounded-lg ${
                    plan.featured ? 'bg-violet-50' : 'bg-gray-50'
                  }`}>
                    <svg
                      className={`w-3.5 h-3.5 flex-shrink-0 ${plan.featured ? 'text-[#7c3aed]' : 'text-gray-400'}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className={`text-xs font-semibold ${plan.featured ? 'text-[#7c3aed]' : 'text-gray-500'}`}>
                      {plan.delivery ? `Delivery: ${plan.delivery}` : 'Timeline: depends on project scope'}
                    </span>
                  </div>

                  <a
                    href={waLink(plan.message, ref)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackFbEvent('Contact', { content_name: `Pricing WhatsApp: ${plan.name}` })}
                    className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      plan.featured
                        ? 'bg-[#7c3aed] text-white hover:bg-[#6d28d9] shadow-sm'
                        : 'border border-gray-200 text-black hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <WhatsAppIcon />
                    {plan.cta}
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            className="text-center text-xs text-gray-400 mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            All prices are in Nigerian Naira (NGN). Sale ends midnight July 31, 2026. VAT may apply.
          </motion.p>
        </div>
      </section>

      {/* ── Payment Terms ─────────────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-8 border-t border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 text-center">
              Payment
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-black text-center mb-12 tracking-tight">
              How payment works
            </motion.h2>
            <motion.div
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden"
            >
              {[
                { num: '01', heading: '50% upfront', body: 'Pay half to kick off the project and lock in your start date.' },
                { num: '02', heading: '50% on delivery', body: 'Pay the balance when we hand over the final product.' },
                { num: '03', heading: 'Easy payment', body: "Bank transfer or card payment. We'll send details once we align on scope." },
              ].map((item) => (
                <motion.div key={item.num} variants={fadeUp} className="bg-white px-8 py-8">
                  <div className="text-2xl font-bold text-[#7c3aed] mb-3">{item.num}</div>
                  <h3 className="text-base font-bold text-black mb-2">{item.heading}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="section-padding px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
              FAQ
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-bold text-black tracking-tight mb-12">
              Common questions
            </motion.h2>
            <motion.div variants={stagger} className="divide-y divide-gray-100">
              {faqs.map((faq, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-5 text-left group"
                    aria-expanded={openFaq === i}
                  >
                    <h3 className="text-base font-semibold text-black pr-6 group-hover:text-[#7c3aed] transition-colors duration-150">
                      {faq.question}
                    </h3>
                    <span className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-200 ${
                      openFaq === i ? 'bg-[#7c3aed] border-[#7c3aed]' : 'bg-white border-gray-200'
                    }`}>
                      <svg
                        className={`w-3 h-3 transition-transform duration-200 ${openFaq === i ? 'rotate-45 text-white' : 'text-gray-400'}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Closing CTA ───────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-8 bg-[#09051e] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#7c3aed] opacity-[0.08] rounded-full blur-3xl" />
        </div>
        <motion.div
          className="relative max-w-xl mx-auto text-center"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-5">
            Not sure which<br />tier fits?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-400 text-lg leading-relaxed mb-10">
            Send us a WhatsApp message, we'll figure it out together.
          </motion.p>
          <motion.div variants={fadeUp}>
            <a
              href={waLink("Hi Bluehydra, I'm not sure which tier fits my business. Can you help me decide?", ref)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackFbEvent('Contact', { content_name: 'Pricing WhatsApp: Not Sure' })}
              className="inline-flex items-center gap-2.5 bg-[#7c3aed] text-white text-sm font-semibold px-8 py-4 rounded-xl hover:bg-[#6d28d9] transition-colors duration-200 shadow-lg shadow-violet-900/40"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Message us on WhatsApp →
            </a>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}
