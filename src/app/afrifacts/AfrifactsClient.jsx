"use client";
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { joinAfrifactsTest } from '@/app/actions/joinAfrifactsTest';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const screens = [
  { src: '/images/afrifacts/screen-feed.png',       alt: 'The AfriFacts daily feed',            tilt: '-3deg' },
  { src: '/images/afrifacts/screen-deep-dive.png',  alt: 'A fact expanded into the full story', tilt: '0deg'  },
  { src: '/images/afrifacts/screen-categories.png', alt: 'Facts across history, business and culture', tilt: '3deg' },
];

const features = [
  {
    title: 'Verified & sourced',
    body:  'Every fact is reviewed and links back to where it came from.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.5l2 2 4-4.5M12 3l7.5 3.2v5c0 4.6-3.1 8.4-7.5 9.8-4.4-1.4-7.5-5.2-7.5-9.8v-5L12 3z" />
      </svg>
    ),
  },
  {
    title: 'Streaks & quizzes',
    body:  'A daily card, a streak to protect, and quizzes to prove you were paying attention.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c.6 3 2.2 4 3.6 5.6A7.5 7.5 0 0119.5 14a7.5 7.5 0 11-15 0c0-2 .8-3.4 1.8-4.6.4 1.2 1.2 2 2.2 2.3C8.2 8.6 9.6 5.4 12 3z" />
      </svg>
    ),
  },
  {
    title: 'Ask about any fact',
    body:  'Tap a card for the full story, then ask follow-up questions right there.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12a8 8 0 01-11.6 7.1L4 20l1-4.2A8 8 0 1120 12z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.8 9.6a2.2 2.2 0 114.2 1c0 1.4-2 1.6-2 3M12 16.2h.01" />
      </svg>
    ),
  },
];

// The Play Store shots are 1080×1920 with the green backdrop, headline and
// device mock baked in. These numbers crop to just the device (which already
// carries its own bezel), so the page's own headline does the talking.
const CROP = {
  aspect: '628 / 1380',
  width:  '171.97%', // 1080 / 628
  left:   '-36.31%', // -228 / 628
  top:    '-31.59%', // -436 / 1380
};

function Phone({ src, alt, tilt }) {
  // If a screenshot is missing, drop the frame instead of showing a broken image.
  const [ok, setOk] = useState(true);
  if (!ok) return null;

  return (
    <div
      className="relative w-[178px] shrink-0 snap-center overflow-hidden rounded-[1.1rem] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.7)] sm:w-[186px]"
      style={{ aspectRatio: CROP.aspect, transform: `rotate(${tilt})` }}
    >
      <Image
        src={src}
        alt={alt}
        width={1080}
        height={1920}
        sizes="360px"
        onError={() => setOk(false)}
        className="absolute h-auto max-w-none"
        style={{ width: CROP.width, left: CROP.left, top: CROP.top }}
      />
    </div>
  );
}

export default function AfrifactsClient({ source }) {
  const [email, setEmail]     = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus]   = useState('idle'); // idle | loading | done
  const [error, setError]     = useState('');
  const [logoOk, setLogoOk]   = useState(true);

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === 'loading') return;

    setError('');
    setStatus('loading');

    const res = await joinAfrifactsTest({ email, website, source });

    if (res.success) {
      setStatus('done');
    } else {
      setError(res.error);
      setStatus('idle');
    }
  }

  return (
    <div className="af-page relative min-h-screen overflow-hidden bg-[#0b382c] text-[#f6f1e3]">

      {/* Dashed vertical strokes, lifted from the app's brand backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(to bottom, #0b382c 0 10px, transparent 10px 30px),
            repeating-linear-gradient(to right, rgba(214,182,106,0.16) 0 2px, transparent 2px 46px)
          `,
        }}
      />
      {/* Warm glow behind the form so the CTA sits in the brightest spot */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[720px] max-w-[140vw] -translate-x-1/2 rounded-full opacity-40 blur-[110px]"
        style={{ background: 'radial-gradient(circle, #1c6b4f 0%, transparent 70%)' }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-2xl px-6 pt-14 pb-16 sm:pt-20"
      >
        {/* ─── Brand ─────────────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="flex flex-col items-center text-center">
          {logoOk && (
            <Image
              src="/images/afrifacts/logo.png"
              alt=""
              width={128}
              height={128}
              priority
              onError={() => setLogoOk(false)}
              className="w-16 h-16 rounded-2xl bg-[#f6f1e3] p-1.5"
            />
          )}
          <p className="mt-4 af-display text-2xl font-bold tracking-tight">AfriFacts</p>
          <span className="mt-3 block h-[3px] w-12 rounded-full bg-[#7fd3af]" />
        </motion.div>

        {/* ─── Headline ──────────────────────────────────────────────────── */}
        <motion.h1
          variants={fadeUp}
          className="mt-10 text-center af-display text-[2rem] leading-[1.15] font-bold text-[#f6f1e3] sm:text-[2.6rem]"
        >
          Be one of the first to test AfriFacts
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-5 max-w-md text-center text-[15px] leading-relaxed text-[#f6f1e3]/70"
        >
          A verified fact about Africa, every single day. We're opening a small closed test on
          Android. Drop your email and we'll send you the invite.
        </motion.p>

        {/* ─── Form / success ────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="mt-9">
          {status === 'done' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-[#7fd3af]/35 bg-[#7fd3af]/10 p-6 text-center sm:p-8"
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#7fd3af] text-[#0b382c]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </div>
              <p className="mt-4 af-display text-2xl font-bold">You're in.</p>
              <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-[#f6f1e3]/75">
                Watch your inbox. We'll send your Play Store invite link within 24 hours. Open it
                on your phone, tap <span className="text-[#f6f1e3]">"Become a tester"</span>, then install.
              </p>
              <p className="mt-5 text-xs text-[#f6f1e3]/45">
                Nothing after a day? Check spam, or just reply to our email.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-[#f6f1e3]/12 bg-[#0e4436]/80 p-5 backdrop-blur-sm sm:p-6"
            >
              <label
                htmlFor="af-email"
                className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#7fd3af]"
              >
                Your Google Play email
              </label>

              <input
                id="af-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                placeholder="you@gmail.com"
                className={`mt-2.5 w-full rounded-xl border bg-[#082c22] px-4 py-3.5 text-[15px] text-[#f6f1e3] outline-none transition placeholder:text-[#f6f1e3]/30 focus:border-[#7fd3af] ${
                  error ? 'border-[#e8836b]' : 'border-[#f6f1e3]/15'
                }`}
              />

              {/* Honeypot: hidden from people, catnip for bots */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                aria-hidden="true"
                className="absolute h-0 w-0 opacity-0"
              />

              {error ? (
                <p className="mt-2 text-[13px] text-[#f0a08c]">{error}</p>
              ) : (
                <p className="mt-2.5 text-[13px] leading-relaxed text-[#f6f1e3]/50">
                  Use the Google account signed in on your Android phone. That's the one Play needs
                  to let you in.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7fd3af] px-6 py-3.5 text-[15px] font-bold text-[#08281f] transition hover:bg-[#95dcbd] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'loading' ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#08281f]/30 border-t-[#08281f]" />
                    Adding you…
                  </>
                ) : (
                  'Send me the test link'
                )}
              </button>

              <p className="mt-3.5 text-center text-[12px] text-[#f6f1e3]/40">
                Android only for now · One email, no spam · Limited spots
              </p>
            </form>
          )}
        </motion.div>

        {/* ─── Proof ─────────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          className="af-strip -mx-6 mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:mx-0 sm:justify-center sm:gap-4 sm:overflow-visible sm:px-0"
        >
          {screens.map((s) => (
            <Phone key={s.src} {...s} />
          ))}
        </motion.div>

        {/* ─── What you get ──────────────────────────────────────────────── */}
        <motion.ul variants={fadeUp} className="mt-14 grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <li key={f.title} className="text-center sm:text-left">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#7fd3af]/15 text-[#7fd3af]">
                {f.icon}
              </span>
              <p className="mt-3 text-[15px] font-bold">{f.title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#f6f1e3]/55">{f.body}</p>
            </li>
          ))}
        </motion.ul>

        {/* ─── Footer ────────────────────────────────────────────────────── */}
        <motion.p variants={fadeUp} className="mt-16 text-center text-[12px] text-[#f6f1e3]/35">
          AfriFacts: verified facts about Africa, one card at a time.
          <br className="sm:hidden" />
          <span className="hidden sm:inline"> · </span>
          Built by{' '}
          <a href="https://bluehydralabs.com" className="underline underline-offset-2 hover:text-[#f6f1e3]/60">
            Bluehydra Labs
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
