"use client";
import { useState, useEffect, useRef } from 'react';
import { sendApplicationEmail } from '@/app/actions/sendApplication';
import { trackFbEvent } from '@/lib/fbpixel';

const DEADLINE = new Date('2026-06-12T23:59:59');

const SOCIAL_PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'other', label: 'Other' },
];

const INITIAL_FORM = {
  name: '',
  businessName: '',
  businessDescription: '',
  existingWebsite: '',
  socialPlatform: '',
  socialLink: '',
  customers: '',
  whyPick: '',
  whatsapp: '',
  email: '',
};

const faqs = [
  {
    q: "Is it really free?",
    a: "Yes. No hidden fees. No upsells required to get the website you applied for.",
  },
  {
    q: "Do I need to pay for a domain name?",
    a: "Yes, the domain name is your responsibility. We'll walk you through the purchase and handle all the technical setup ourselves.",
  },
  {
    q: "What if I'm not selected?",
    a: "We read every application. If you're not in the Five, we'll still be in touch. Sometimes a smaller starter package is the right fit, and we'll talk through your options.",
  },
  {
    q: "When will I hear back?",
    a: "Within 3 days of the closing date.",
  },
  {
    q: "What if I already have a website?",
    a: "Tell us. Sometimes a rebuild is exactly what's needed.",
  },
  {
    q: "Can I share this with someone?",
    a: "Please do. If you know a business owner this could help, send them the link.",
  },
];

function getTimeLeft(deadline) {
  const diff = deadline - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function useCountdown(deadline) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft(deadline));
    const id = setInterval(() => setTimeLeft(getTimeLeft(deadline)), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return { mounted, timeLeft };
}

const pad = (n) => String(n).padStart(2, '0');

function validateForm(data) {
  const errors = {};
  if (!data.name.trim()) errors.name = 'This field is required';
  if (!data.businessName.trim()) errors.businessName = 'This field is required';
  if (!data.businessDescription.trim()) errors.businessDescription = 'This field is required';
  if (!data.customers.trim()) errors.customers = 'This field is required';
  if (!data.whyPick.trim()) errors.whyPick = 'This field is required';
  if (!data.whatsapp.trim()) {
    errors.whatsapp = 'This field is required';
  } else if (!/^\+?[\d\s\-().]{7,20}$/.test(data.whatsapp.trim())) {
    errors.whatsapp = 'Enter a valid phone number';
  }
  if (!data.email.trim()) {
    errors.email = 'This field is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter a valid email address';
  }
  return errors;
}

function CountdownBadge({ timeLeft, mounted }) {
  const isClosed = mounted && !timeLeft;

  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5">
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
        <span className="text-xs font-semibold text-amber-700">Applications open</span>
      </div>
    );
  }

  if (isClosed) {
    return (
      <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
        <span className="text-xs font-semibold text-red-600">Applications are now closed</span>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = timeLeft;
  return (
    <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5">
      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
      <span className="text-xs font-semibold text-amber-700 tabular-nums">
        Closes in {days}d {pad(hours)}h {pad(minutes)}m {pad(seconds)}s
      </span>
    </div>
  );
}

export default function ApplyPage() {
  const { mounted, timeLeft } = useCountdown(DEADLINE);
  const isClosed = mounted && !timeLeft;

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isClosed) return;
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTimeout(() => {
        document.querySelector('.border-red-400')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus(null);
    const result = await sendApplicationEmail(formData);
    setIsSubmitting(false);
    if (result.success) {
      setSubmitStatus('success');
      trackFbEvent('Lead', { content_name: "Founders' Five Application" });
      setFormData(INITIAL_FORM);
      setErrors({});
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setSubmitStatus('error');
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getInputClass = (field) =>
    `w-full px-4 py-3 border ${
      errors[field]
        ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
        : 'border-gray-200 focus:border-black focus:ring-black'
    } rounded-lg text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-all bg-white`;

  const autoGrow = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const labelClass = "block text-sm font-semibold text-black mb-1.5";

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-8 border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-5">
            A programme by Bluehydra · Cohort 01
          </p>
          <h1 className="text-6xl lg:text-7xl font-bold text-black tracking-tight leading-none mb-6">
            The Founders'<br />Five
          </h1>
          <p className="text-xl text-gray-500 mb-6 leading-relaxed">
            Five businesses. One complete website each. No cost.
          </p>
          <div className="mb-10">
            <CountdownBadge timeLeft={timeLeft} mounted={mounted} />
          </div>
          <div>
            {isClosed ? (
              <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-400 text-sm font-semibold px-8 py-4 rounded-lg cursor-not-allowed">
                Applications closed
              </span>
            ) : (
              <button
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 bg-[#7c3aed] text-white text-sm font-semibold px-8 py-4 rounded-lg hover:bg-[#6d28d9] transition-colors duration-200"
              >
                Apply Now (5 spots)
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>


      {/* What you get + Who we're looking for */}
      <section className="py-20 px-6 lg:px-8 border-b border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

          <div className="border border-gray-200 rounded-xl p-8 bg-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">What you get</p>
            <ul className="space-y-4">
              {[
                "A complete custom website, designed and built from scratch",
                "Mobile-responsive, fast, professionally hosted",
                "Domain setup (domain is on you)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                  <span className="text-[#7c3aed] mt-0.5 flex-shrink-0">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-gray-200 rounded-xl p-8 bg-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">Who we're looking for</p>
            <ul className="space-y-6">
              <li className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                <span className="text-[#7c3aed] mt-0.5 flex-shrink-0">→</span>
                <span><strong className="text-black">A real business</strong>: you have a product or service with customers, not just an idea</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                <span className="text-[#7c3aed] mt-0.5 flex-shrink-0">→</span>
                <span><strong className="text-black">Serious ambition</strong>: you're ready to grow, and a proper online presence is part of that plan</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 lg:px-8 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-12">How it works</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Apply", body: "Fill the form below. Takes about 3 minutes." },
              { step: "02", title: "We review", body: "Every application is read. Selected applicants will be contacted." },
              { step: "03", title: "We build", body: "Five businesses chosen. We get to work." },
            ].map(({ step, title, body }) => (
              <div key={step}>
                <div className="w-10 h-10 rounded-full bg-[#ede9fe] flex items-center justify-center mb-5">
                  <span className="text-xs font-bold text-[#7c3aed]">{step}</span>
                </div>
                <h3 className="text-base font-bold text-black mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section ref={formRef} className="py-20 px-6 lg:px-8 border-b border-gray-200 bg-gray-50" id="apply-form">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Apply</p>
          <h2 className="text-4xl font-bold text-black tracking-tight mb-10">Submit your application</h2>

          {isClosed ? (
            <div className="border border-gray-200 rounded-xl p-10 bg-white text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-black mb-2">This programme is now closed</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
                Applications for Cohort 01 are no longer being accepted. Follow us or reach out directly. Cohort 02 will be announced soon.
              </p>
              <a
                href={`https://wa.me/2349133105749?text=${encodeURIComponent("Hi Bluehydra, I missed the Founders' Five. When is Cohort 02?")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackFbEvent('Contact', { content_name: 'Apply Closed WhatsApp' })}
                className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-[#7c3aed] hover:underline"
              >
                Ask about Cohort 02 on WhatsApp →
              </a>
            </div>
          ) : (
            <>
              {submitStatus === 'success' && (
                <div className="mb-8 p-5 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-green-800 text-sm font-semibold mb-0.5">Application received.</p>
                    <p className="text-green-700 text-sm">We'll be in touch within 3 days. Thanks for applying.</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  Something went wrong. Please try again or message us on WhatsApp.
                </div>
              )}

              <div className="border border-gray-200 rounded-xl p-8 bg-white">
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className={labelClass}>Your name <span className="text-red-400 font-normal">*</span></label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={getInputClass('name')} placeholder="Amaka Okonkwo" />
                      {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="businessName" className={labelClass}>Business name <span className="text-red-400 font-normal">*</span></label>
                      <input type="text" id="businessName" name="businessName" value={formData.businessName} onChange={handleChange} className={getInputClass('businessName')} placeholder="Chidi Ventures" />
                      {errors.businessName && <p className="text-xs text-red-500 mt-1.5">{errors.businessName}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="businessDescription" className={labelClass}>What does your business do? <span className="text-red-400 font-normal">*</span></label>
                    <textarea id="businessDescription" name="businessDescription" rows={3} value={formData.businessDescription} onChange={handleChange} onInput={autoGrow} className={`${getInputClass('businessDescription')} resize-none overflow-hidden`} placeholder="A sentence or two about what you sell and who you sell to." />
                    {errors.businessDescription && <p className="text-xs text-red-500 mt-1.5">{errors.businessDescription}</p>}
                  </div>

                  <div>
                    <label htmlFor="existingWebsite" className={labelClass}>Do you have a website already?</label>
                    <input type="text" id="existingWebsite" name="existingWebsite" value={formData.existingWebsite} onChange={handleChange} className={getInputClass('existingWebsite')} placeholder="yoursite.com (or leave blank)" />
                    {errors.existingWebsite && <p className="text-xs text-red-500 mt-1.5">{errors.existingWebsite}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>
                      Social media presence
                    </label>
                    <div className="grid grid-cols-[156px_1fr] gap-3">
                      <div>
                        <select name="socialPlatform" value={formData.socialPlatform} onChange={handleChange} className={getInputClass('socialPlatform')}>
                          <option value="">Platform</option>
                          {SOCIAL_PLATFORMS.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                        {errors.socialPlatform && <p className="text-xs text-red-500 mt-1.5">{errors.socialPlatform}</p>}
                      </div>
                      <div>
                        <input type="text" name="socialLink" value={formData.socialLink} onChange={handleChange} className={getInputClass('socialLink')} placeholder="instagram.com/yourbusiness (or leave blank)" />
                        {errors.socialLink && <p className="text-xs text-red-500 mt-1.5">{errors.socialLink}</p>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="customers" className={labelClass}>Tell us about your customers <span className="text-red-400 font-normal">*</span></label>
                    <textarea id="customers" name="customers" rows={3} value={formData.customers} onChange={handleChange} onInput={autoGrow} className={`${getInputClass('customers')} resize-none overflow-hidden`} placeholder="We just want to understand your business is real." />
                    {errors.customers && <p className="text-xs text-red-500 mt-1.5">{errors.customers}</p>}
                  </div>

                  <div>
                    <label htmlFor="whyPick" className={labelClass}>Why should we pick you? <span className="text-red-400 font-normal">*</span></label>
                    <textarea id="whyPick" name="whyPick" rows={4} value={formData.whyPick} onChange={handleChange} onInput={autoGrow} className={`${getInputClass('whyPick')} resize-none overflow-hidden`} placeholder="What are you working towards? Why does a website matter for you right now?" />
                    {errors.whyPick && <p className="text-xs text-red-500 mt-1.5">{errors.whyPick}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="whatsapp" className={labelClass}>Best WhatsApp number <span className="text-red-400 font-normal">*</span></label>
                      <input type="tel" id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className={getInputClass('whatsapp')} placeholder="+234..." autoComplete="tel" />
                      {errors.whatsapp && <p className="text-xs text-red-500 mt-1.5">{errors.whatsapp}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClass}>Email <span className="text-red-400 font-normal">*</span></label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={getInputClass('email')} placeholder="you@example.com" />
                      {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-[#7c3aed] text-white text-sm font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Submitting...
                        </>
                      ) : 'Submit Application'}
                    </button>
                    <p className="text-xs text-gray-400 text-center mt-3">
                      By submitting, you agree we may follow up by WhatsApp or email about your application.
                    </p>
                  </div>

                </form>
              </div>
            </>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-10">Questions</p>
          <div className="space-y-8">
            {faqs.map(({ q, a }) => (
              <div key={q} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                <h3 className="text-sm font-bold text-black mb-2">{q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
