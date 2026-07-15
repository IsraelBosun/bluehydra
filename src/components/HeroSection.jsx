"use client";
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';
import Image from 'next/image';
import { companyData } from '@/lib/data';
import { trackFbEvent } from '@/lib/fbpixel';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

const heroStats = [
  { value: "10+", label: "Projects delivered" },
  { value: "10+", label: "Clients served" },
  { value: "98%", label: "Satisfaction" },
];

// Featured screenshots for the hero — same set on desktop (fanned) and mobile (grid)
const heroProjects = [
  companyData.projects.find((p) => p.title === "The Word Impact Network Event Website"),
  companyData.projects.find((p) => p.title === "STUCHEWRLD"),
  companyData.projects.find((p) => p.title === "The Ankara Closet"),
  companyData.projects.find((p) => p.title === "Toausib Consulting"),
].filter(Boolean);

function ProjectCard({ project, width, height }) {
  return (
    <div className={`relative flex-shrink-0 ${width} bg-white border border-gray-200 rounded-2xl overflow-hidden`}>
      <BrowserDots />
      <div className={`relative ${height} bg-gray-100`}>
        <Image
          src={project.image}
          alt={`Screenshot of ${project.title}`}
          fill
          className="object-cover object-top pointer-events-none"
          sizes="320px"
        />
      </div>
      <div className="px-3 py-2.5 border-t border-gray-100">
        <p className="text-xs font-bold text-black truncate">{project.title}</p>
      </div>
    </div>
  );
}

// Continuous right-to-left marquee that auto-scrolls via rAF and pauses while
// the user drags. The project list is rendered twice back-to-back and the
// drag range is clamped to exactly one set's width so the loop stays seamless.
function ProjectMarquee({ projects, duration, cardWidth, cardHeight }) {
  const items = [...projects, ...projects];
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const x = useMotionValue(0);
  const [setWidth, setSetWidth] = useState(0);

  useEffect(() => {
    if (trackRef.current) {
      setSetWidth(trackRef.current.scrollWidth / 2);
    }
  }, [projects]);

  useAnimationFrame((t, delta) => {
    if (isDragging.current || !setWidth) return;
    const pxPerMs = setWidth / (duration * 1000);
    let next = x.get() - pxPerMs * delta;
    if (next <= -setWidth) next += setWidth;
    x.set(next);
  });

  return (
    <div className="overflow-hidden cursor-grab active:cursor-grabbing">
      <motion.div
        ref={trackRef}
        className="flex gap-4 w-max"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -setWidth, right: 0 }}
        dragElastic={0}
        onDragStart={() => { isDragging.current = true; }}
        onDragEnd={() => { isDragging.current = false; }}
      >
        {items.map((project, i) => (
          <ProjectCard key={`${project.id}-${i}`} project={project} width={cardWidth} height={cardHeight} />
        ))}
      </motion.div>
    </div>
  );
}

function WhatsAppIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function BrowserDots() {
  return (
    <div className="flex items-center gap-1.5 h-8 px-3 bg-gray-50 border-b border-gray-100">
      <span className="w-2 h-2 rounded-full bg-red-300" />
      <span className="w-2 h-2 rounded-full bg-yellow-300" />
      <span className="w-2 h-2 rounded-full bg-green-300" />
    </div>
  );
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const waLink = `https://wa.me/${companyData.contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent("Hi Bluehydra! I'm interested in getting a website for my business.")}`;

  return (
    <section className="relative overflow-hidden bg-white">

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #d4d4d4 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_40%,white_100%)]" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: copy */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={mounted ? "show" : "hidden"}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center space-x-2 border border-gray-200 bg-white text-gray-500 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest shadow-sm">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span>Web &amp; app development for Nigerian businesses</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-bold text-black leading-[1.04] tracking-tight mb-8">
              Websites &amp; apps that grow{' '}
              <span className="text-[#7c3aed]">your business</span>
            </motion.h1>

            {/* Description */}
            <motion.p variants={fadeUp} className="text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              We build fast, professional websites and online stores, like the ones you just saw. Quick turnaround, no long timelines.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 mb-16">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackFbEvent('Contact', { content_name: 'Hero WhatsApp' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#7c3aed] text-white text-sm font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors duration-200 shadow-sm"
              >
                <WhatsAppIcon />
                Chat on WhatsApp
              </a>
              <button
                onClick={scrollToProjects}
                className="w-full sm:w-auto px-8 py-3 border border-gray-300 text-gray-700 bg-white text-sm font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                See our work
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={stagger} className="flex items-start justify-center lg:justify-start gap-10">
              {heroStats.map((stat, index) => (
                <motion.div key={index} variants={fadeUp}>
                  <div className="text-2xl sm:text-3xl font-bold text-black mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: continuously sliding project screenshots (desktop only) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={mounted ? "show" : "hidden"}
            className="hidden lg:flex items-center"
          >
            <ProjectMarquee projects={heroProjects} duration={26} cardWidth="w-72" cardHeight="h-48" />
          </motion.div>
        </div>

        {/* Mobile: sliding recent-work strip underneath */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={mounted ? "show" : "hidden"}
          className="lg:hidden mt-10"
        >
          <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 text-center">
            Recent Works
          </motion.p>
          <motion.div variants={fadeUp} className="-mx-6">
            <ProjectMarquee projects={heroProjects} duration={20} cardWidth="w-52" cardHeight="h-32" />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <svg className="w-5 h-5 text-gray-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
