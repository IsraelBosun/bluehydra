"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { registerReferrer } from '@/app/actions/registerReferrer';
import { trackFbEvent } from '@/lib/fbpixel';

const SITE_URL = 'https://bluehydralabs.com';
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

function CompactCountdown() {
  const t = useCountdown();
  if (!t) return null;
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <div className="inline-flex items-center gap-2.5 bg-[#09051e] text-white text-xs font-semibold px-4 py-2 rounded-full">
      <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse flex-shrink-0" />
      <span className="text-white/50 uppercase tracking-wider">Ends in</span>
      <span className="tabular-nums">{pad(t.days)}d</span>
      <span className="text-white/30">·</span>
      <span className="tabular-nums">{pad(t.hours)}h</span>
      <span className="text-white/30">·</span>
      <span className="tabular-nums">{pad(t.minutes)}m</span>
      <span className="text-white/30">·</span>
      <span className="tabular-nums">{pad(t.seconds)}s</span>
    </div>
  );
}

const steps = [
  {
    num: '01',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: 'Sign up in 30 seconds',
    body: 'Enter your name, email, and WhatsApp. We generate a unique referral link just for you.',
  },
  {
    num: '02',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
    title: 'Share your link',
    body: 'Post it on your WhatsApp status, drop it in business groups, or send it directly to founders who need a website.',
  },
  {
    num: '03',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Get paid ₦10,000',
    body: "When they make their first deposit, we send you ₦10,000 within 24 hours. No cap — refer more, earn more.",
  },
];

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function SuccessView({ slug }) {
  const [copied, setCopied] = useState(false);
  const referralLink = `${SITE_URL}/pricing?ref=${slug}`;
  const waText = encodeURIComponent(
    `I just joined the Bluehydra referral programme. They're building websites and apps, and you can get 50% off through my link: ${referralLink}`
  );

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard not available
    }
  };

  return (
    <motion.div
      className="max-w-xl mx-auto px-6 lg:px-8 py-20 text-center"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeUp} className="flex justify-center mb-6">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </motion.div>

      <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-bold text-black tracking-tight mb-3">
        You&apos;re in.<br />Here&apos;s your link.
      </motion.h1>
      <motion.p variants={fadeUp} className="text-gray-500 text-base mb-10 leading-relaxed">
        Share this with business owners. Every successful referral earns you{' '}
        <strong className="text-black">₦10,000</strong> — paid within 24 hours of their first deposit.
      </motion.p>

      {/* Link box */}
      <motion.div variants={fadeUp} className="border-2 border-[#7c3aed] rounded-2xl bg-violet-50 p-6 mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-[#7c3aed] mb-3">
          Your personal referral link
        </p>
        <p className="text-base sm:text-lg font-bold text-black break-all mb-5 leading-snug">
          {referralLink}
        </p>
        <button
          onClick={copyLink}
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
            copied ? 'bg-green-500 text-white' : 'bg-[#7c3aed] text-white hover:bg-[#6d28d9]'
          }`}
        >
          {copied ? <><CheckIcon /> Copied!</> : <><CopyIcon /> Copy link</>}
        </button>
      </motion.div>

      <motion.p variants={fadeUp} className="text-xs text-gray-400 mb-10">
        We&apos;ve also sent this to your email. Check your inbox in a minute.
      </motion.p>

      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={`https://wa.me/?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#25d366] text-white text-sm font-semibold rounded-xl hover:bg-[#20bd5a] transition-colors duration-200"
        >
          <WhatsAppIcon />
          Share on WhatsApp
        </a>
        <Link
          href="/pricing"
          className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-200 text-black text-sm font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
        >
          View pricing page
        </Link>
      </motion.div>
    </motion.div>
  );
}

function ReferForm({ onSuccess }) {
  const [fields, setFields] = useState({ name: '', email: '', whatsapp: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: '' }));
    setServerError('');
  };

  const validate = () => {
    const errs = {};
    if (!fields.name.trim()) errs.name = 'Name is required.';
    if (!fields.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errs.email = 'Valid email address required.';
    }
    if (!fields.whatsapp.trim()) errs.whatsapp = 'WhatsApp number is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setServerError('');

    const result = await registerReferrer(fields);
    setSubmitting(false);

    if (result.success) {
      trackFbEvent('Lead', { content_name: 'Referral Signup' });
      onSuccess(result.slug);
    } else {
      setServerError(result.error || 'Something went wrong. Please try again.');
    }
  };

  const inputClass = (key) =>
    `w-full px-4 py-3.5 border rounded-xl text-sm text-black placeholder:text-gray-400 focus:outline-none transition-all bg-white ${
      errors[key]
        ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200'
        : 'border-gray-200 focus:border-black focus:ring-1 focus:ring-black'
    }`;

  return (
    <div className="border border-gray-200 rounded-2xl p-8 lg:p-10 bg-white shadow-sm">
      <h2 className="text-2xl font-bold text-black mb-1">Get your referral link</h2>
      <p className="text-sm text-gray-500 mb-8">Takes 30 seconds. Your link is live immediately.</p>

      {serverError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-black mb-1.5">
            Your name <span className="text-red-400 font-normal">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={fields.name}
            onChange={set('name')}
            className={inputClass('name')}
            placeholder="e.g. Chidi Okonkwo"
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-black mb-1.5">
            Email address <span className="text-red-400 font-normal">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={fields.email}
            onChange={set('email')}
            className={inputClass('email')}
            placeholder="chidi@gmail.com"
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-sm font-semibold text-black mb-1.5">
            WhatsApp number <span className="text-red-400 font-normal">*</span>
          </label>
          <input
            id="whatsapp"
            type="tel"
            value={fields.whatsapp}
            onChange={set('whatsapp')}
            className={inputClass('whatsapp')}
            placeholder="+234 800 000 0000"
          />
          {errors.whatsapp && <p className="mt-1.5 text-xs text-red-500">{errors.whatsapp}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-[#7c3aed] text-white text-sm font-semibold rounded-xl hover:bg-[#6d28d9] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating your link…
            </>
          ) : (
            'Get my referral link →'
          )}
        </button>
      </form>

      <p className="mt-5 text-xs text-gray-400 text-center leading-relaxed">
        By signing up, you agree to receive your referral link by email.
        Promo valid until July 31, 2026.
      </p>
    </div>
  );
}

export default function ReferClient() {
  const [slug, setSlug] = useState(null);

  return (
    <div className="min-h-screen bg-white">

      <AnimatePresence mode="wait">
        {slug ? (

          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="pt-28 pb-20">
              <SuccessView slug={slug} />
            </div>
          </motion.div>

        ) : (

          <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

            {/* ── Hero ─────────────────────────────────────────────────── */}
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
                <motion.div variants={fadeUp} className="inline-flex items-center space-x-2 border border-gray-200 bg-white text-gray-500 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest shadow-sm">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span>Referral Programme · July 2026</span>
                </motion.div>

                <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black tracking-tight leading-[1.04] mb-5">
                  Refer. Earn.<br />
                  <span className="text-[#7c3aed]">Repeat.</span>
                </motion.h1>

                <motion.p variants={fadeUp} className="text-xl text-gray-500 leading-relaxed mb-4 max-w-xl mx-auto">
                  Earn <strong className="text-black">₦10,000 cash</strong> for every business you refer to Bluehydra — July only.
                </motion.p>

                <motion.p variants={fadeUp} className="text-sm text-gray-400 mb-6">
                  Your friends get 50% off. You get paid. Everyone wins.
                </motion.p>

                {/* Compact countdown */}
                <motion.div variants={fadeUp}>
                  <CompactCountdown />
                </motion.div>
              </motion.div>
            </section>

            {/* ── How it works ─────────────────────────────────────────── */}
            <section className="section-padding px-6 lg:px-8 bg-gray-50 border-b border-gray-100">
              <div className="max-w-5xl mx-auto">
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                >
                  <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 text-center">
                    How it works
                  </motion.p>
                  <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-black text-center mb-14 tracking-tight">
                    Three steps to your first ₦10k
                  </motion.h2>

                  <motion.div
                    variants={stagger}
                    className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden"
                  >
                    {steps.map((step) => (
                      <motion.div key={step.num} variants={fadeUp} className="bg-white p-8 group">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-black group-hover:bg-gray-200 transition-colors flex-shrink-0">
                            {step.icon}
                          </div>
                          <span className="text-2xl font-bold text-[#7c3aed]">{step.num}</span>
                        </div>
                        <h3 className="text-base font-bold text-black mb-2">{step.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{step.body}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* ── Form ─────────────────────────────────────────────────── */}
            <section className="section-padding px-6 lg:px-8">
              <div className="max-w-5xl mx-auto">
                <motion.div
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
                  variants={stagger}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                >
                  {/* Left — value props */}
                  <motion.div variants={fadeUp}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                      The deal
                    </p>
                    <h2 className="text-4xl font-bold text-black tracking-tight leading-tight mb-8">
                      Start earning today.
                    </h2>

                    <div className="space-y-6">
                      {[
                        { label: 'You earn', value: '₦10,000 per referral — no cap' },
                        { label: 'They get', value: '50% off Website or E-commerce' },
                        { label: 'Payment', value: 'Within 24 hrs of their first deposit' },
                        { label: 'Promo ends', value: 'July 31, 2026 at midnight' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-start gap-4">
                          <div className="w-1 h-10 bg-[#7c3aed] rounded-full flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">{item.label}</p>
                            <p className="text-base font-semibold text-black">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 border border-gray-200 rounded-xl p-5 bg-white">
                      <p className="text-sm font-semibold text-black mb-1">Questions first?</p>
                      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                        Chat with us on WhatsApp before signing up.
                      </p>
                      <a
                        href="https://wa.me/2349133105749?text=Hi%20Bluehydra%2C%20I%27d%20like%20to%20know%20more%20about%20the%20referral%20programme."
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackFbEvent('Contact', { content_name: 'Refer WhatsApp' })}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-[#7c3aed] transition-colors"
                      >
                        <WhatsAppIcon />
                        Chat on WhatsApp
                        <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </motion.div>

                  {/* Right — form */}
                  <motion.div variants={fadeUp}>
                    <ReferForm onSuccess={setSlug} />
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* ── Closing CTA ──────────────────────────────────────────── */}
            <section className="py-20 px-6 lg:px-8 bg-[#09051e] relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#7c3aed] opacity-[0.08] rounded-full blur-3xl" />
              </div>
              <motion.div
                className="relative max-w-xl mx-auto text-center"
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
              >
                <motion.h2 variants={fadeUp} className="text-4xl font-bold text-white tracking-tight mb-4">
                  Every referral you don&apos;t send<br />is ₦10,000 you didn&apos;t earn.
                </motion.h2>
                <motion.p variants={fadeUp} className="text-gray-400 mb-8 text-lg">
                  Takes 30 seconds. Promo closes July 31.
                </motion.p>
                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="#refer-form"
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 bg-[#7c3aed] text-white text-sm font-semibold px-8 py-4 rounded-xl hover:bg-[#6d28d9] transition-colors duration-200 shadow-lg shadow-violet-900/40"
                  >
                    Sign up now →
                  </a>
                  <CompactCountdown />
                </motion.div>
              </motion.div>
            </section>

          </motion.div>

        )}
      </AnimatePresence>

    </div>
  );
}
