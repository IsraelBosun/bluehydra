"use client";
import { useState } from 'react';
import { companyData } from '@/lib/data';
import { sendContactEmail } from '@/app/actions/sendEmail';
import BookingWidget from '@/components/BookingWidget';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectType: '',
    budget: '',
    message: '',
    timeline: ''
  });

  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [submitStatus, setSubmitStatus]   = useState(null); // 'success' | 'error' | null

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const result = await sendContactEmail(formData);
    setIsSubmitting(false);

    if (result.success) {
      setSubmitStatus('success');
      setFormData({ name: '', email: '', company: '', phone: '', projectType: '', budget: '', message: '', timeline: '' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSubmitStatus('error');
    }
  };

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-white";
  const labelClass = "block text-sm font-semibold text-black mb-1.5";

  return (
    <div className="min-h-screen bg-white">

      {/* Page header */}
      <section className="pt-32 pb-12 px-6 lg:px-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Contact
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-black tracking-tight leading-tight max-w-2xl">
              Let's Build Something Exceptional
            </h1>
            <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
              Ready to transform your ideas into reality? Get in touch with our team to discuss your project.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Contact form */}
            <div className="lg:col-span-2">
              <div className="border border-gray-200 rounded-xl p-8 lg:p-10 bg-white">
                <h2 className="text-2xl font-bold text-black mb-2">Start Your Project</h2>
                <p className="text-sm text-gray-500 mb-8">Fill in the details below and we'll get back to you within 24 hours.</p>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-800 text-sm font-medium">Thank you! Your message has been sent to our inbox.</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    Something went wrong. Please try again or message us on WhatsApp.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className={labelClass}>Full Name <span className="text-red-400 font-normal">*</span></label>
                      <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className={inputClass} placeholder="John Doe" />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClass}>Email Address <span className="text-red-400 font-normal">*</span></label>
                      <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="john@company.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="company" className={labelClass}>Company Name</label>
                      <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className={inputClass} placeholder="Your Company" />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelClass}>Phone Number</label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+234 000 000 0000" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="projectType" className={labelClass}>Project Type <span className="text-red-400 font-normal">*</span></label>
                      <select id="projectType" name="projectType" required value={formData.projectType} onChange={handleChange} className={inputClass}>
                        <option value="">Select a type</option>
                        <option value="web">Web Application</option>
                        <option value="mobile">Mobile Application</option>
                        <option value="custom">Custom Software</option>
                        <option value="consulting">Consulting</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="budget" className={labelClass}>Budget Range</label>
                      <select id="budget" name="budget" value={formData.budget} onChange={handleChange} className={inputClass}>
                        <option value="">Select a range</option>
                        <option value="150-200k">₦150,000 – ₦200,000</option>
                        <option value="200-250k">₦200,000 – ₦250,000</option>
                        <option value="250-300k">₦250,000 – ₦300,000</option>
                        <option value="300k+">₦300,000+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="timeline" className={labelClass}>Project Timeline</label>
                    <select id="timeline" name="timeline" value={formData.timeline} onChange={handleChange} className={inputClass}>
                      <option value="">Select timeline</option>
                      <option value="asap">ASAP</option>
                      <option value="1-3months">1–3 months</option>
                      <option value="3-6months">3–6 months</option>
                      <option value="6+months">6+ months</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className={labelClass}>Project Details <span className="text-red-400 font-normal">*</span></label>
                    <textarea id="message" name="message" required rows={5} value={formData.message} onChange={handleChange} className={`${inputClass} resize-none`} placeholder="Tell us about your project goals, technical requirements, and any specific features you need..." />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#7c3aed] text-white text-sm font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending Inquiry...
                      </>
                    ) : 'Submit Project Inquiry'}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">

              {/* Contact info */}
              <div className="border border-gray-200 rounded-xl p-6 bg-white">
                <h3 className="text-base font-bold text-black mb-5">Contact Information</h3>
                <div className="space-y-5">
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Email</div>
                      <a href={`mailto:${companyData.contact.email}`} className="text-sm text-black hover:text-gray-500 transition-colors break-all">
                        {companyData.contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Phone</div>
                      <a href={`tel:${companyData.contact.phone}`} className="text-sm text-black hover:text-gray-500 transition-colors">
                        {companyData.contact.phone}
                      </a>
                    </div>
                  </div>

                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="border border-gray-200 rounded-xl p-6 bg-white">
                <h3 className="text-base font-bold text-black mb-2">Prefer a quick chat?</h3>
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                  Send us a WhatsApp message to discuss your project. Typically responded to in a few minutes.
                </p>
                <a
                  href={`https://wa.me/${companyData.contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent("Hello BlueHydra, I'm interested in starting a project...")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full gap-2 border border-gray-200 text-black text-sm font-semibold px-5 py-3 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>

              {/* Response time note */}
              <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-black">Typically responds within a few hours</span>
                </div>
                <p className="text-xs text-gray-400 pl-4">
                  We review all inquiries promptly and will reach out to schedule an introductory call.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="book" className="py-16 px-6 lg:px-8 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Book a Call
            </p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <h2 className="text-4xl font-bold text-black tracking-tight">
                Or Schedule a Time Directly
              </h2>
              <p className="text-gray-500 text-sm max-w-sm">
                Pick a slot that works for you and we'll send a calendar invite straight to your inbox.
              </p>
            </div>
          </div>
          <div className="max-w-md mx-auto lg:mx-0">
            <BookingWidget />
          </div>
        </div>
      </section>

    </div>
  );
}
