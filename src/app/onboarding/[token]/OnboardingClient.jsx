'use client';

import { useState, useRef, useCallback } from 'react';

const SECTIONS = [
  { id: 'about',         label: 'About' },
  { id: 'inspiration',   label: 'Inspiration' },
  { id: 'brand',         label: 'Brand' },
  { id: 'content',       label: 'Content' },
  { id: 'contact',       label: 'Contact' },
  { id: 'functionality', label: 'Anything else?' },
];


function initForm(brief) {
  const app = brief.founders_five_applications || {};
  return {
    business_description:    brief.business_description    || app.business_description || '',
    ideal_customer:          brief.ideal_customer          || '',
    top_goals:               brief.top_goals               || '',
    differentiator:          brief.differentiator          || '',
    sites_liked: (() => {
      try { const p = JSON.parse(brief.sites_liked); if (Array.isArray(p)) return p; } catch {}
      return [{ url: '', why: '' }, { url: '', why: '' }, { url: '', why: '' }];
    })(),
    has_logo:                brief.has_logo                ?? null,
    logo_url:                brief.logo_url                || '',
    brand_colors_choice:     brief.brand_colors_choice     || '',
    brand_colors_description:brief.brand_colors_description|| '',
    brand_guide_url:         brief.brand_guide_url         || '',
    about_business:          brief.about_business          || app.business_description || '',
    services_products:       brief.services_products       || '',
    testimonials_text:       brief.testimonials_text       || '',
    testimonial_urls:        brief.testimonial_urls        || [],
    photo_urls:              brief.photo_urls              || [],
    phone:                   brief.phone                   || app.whatsapp || '',
    email:                   brief.email                   || app.email    || '',
    whatsapp:                brief.whatsapp                || app.whatsapp || '',
    address:                 brief.address                 || '',
    online_only:             brief.online_only             || false,
    hours:                   brief.hours                   || '',
    instagram:               brief.instagram               || '',
    facebook:                brief.facebook                || '',
    linkedin:                brief.linkedin                || '',
    tiktok:                  brief.tiktok                  || '',
    twitter:                 brief.twitter                 || '',
    youtube:                 brief.youtube                 || '',
    other_social:            brief.other_social            || '',
    has_catalogue:   brief.has_catalogue   ?? null,
    purchase_method: brief.purchase_method || null,
    products: (brief.products && brief.products.length)
      ? brief.products.map(p => ({
          ...p,
          photo_urls: p.photo_urls || (p.photo_url ? [p.photo_url] : []),
        }))
      : Array.from({ length: 5 }, () => ({ name: '', price: '', description: '', photo_urls: [] })),
    other_requests: brief.other_requests || '',
  };
}

function getFileName(path) {
  return path ? path.split('/').pop() : '';
}

export default function OnboardingClient({ brief, token, initialSignedUrls = {} }) {
  const app = brief.founders_five_applications || {};
  const firstName = (app.name || '').split(' ')[0] || 'there';
  const businessName = app.business_name || 'your business';

  const [screen, setScreen]           = useState(brief.submitted_at ? 'submitted' : 'welcome');
  const [sectionIdx, setSectionIdx]   = useState(0);
  const [form, setForm]               = useState(() => initForm(brief));
  const [saveState, setSaveState]     = useState('idle');
  const [uploading, setUploading]     = useState({});
  const [signedUrls, setSignedUrls]   = useState(initialSignedUrls);
  const [showConfirm, setShowConfirm]       = useState(false);
  const [domainAgreed, setDomainAgreed]     = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  const saveTimer = useRef(null);
  const sectionKey = useRef(0);

  const scheduleAutosave = useCallback((updates) => {
    clearTimeout(saveTimer.current);
    setSaveState('saving');
    saveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/onboarding/${token}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        setSaveState(res.ok ? 'saved' : 'error');
        if (res.ok) setTimeout(() => setSaveState('idle'), 2500);
      } catch {
        setSaveState('error');
      }
    }, 800);
  }, [token]);

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    scheduleAutosave({ [field]: value });
  }

  function handleProduct(index, field, value) {
    setForm(prev => {
      const updated = prev.products.map((p, i) => i === index ? { ...p, [field]: value } : p);
      scheduleAutosave({ products: updated });
      return { ...prev, products: updated };
    });
  }

  async function handleProductPhoto(productIndex, file) {
    const key = `product_photo_${productIndex}`;
    setUploading(prev => ({ ...prev, [key]: true }));
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('field', `product_${productIndex}`);
      const res = await fetch(`/api/onboarding/${token}/upload`, { method: 'POST', body: fd });
      const { path, signedUrl, error } = await res.json();
      if (error) { alert(error); return; }
      if (signedUrl) setSignedUrls(prev => ({ ...prev, [path]: signedUrl }));
      setForm(prev => {
        const updated = prev.products.map((p, i) =>
          i === productIndex ? { ...p, photo_urls: [...(p.photo_urls || []), path] } : p
        );
        scheduleAutosave({ products: updated });
        return { ...prev, products: updated };
      });
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }));
    }
  }

  function removeProductPhoto(productIndex, path) {
    setForm(prev => {
      const updated = prev.products.map((p, i) =>
        i === productIndex ? { ...p, photo_urls: (p.photo_urls || []).filter(u => u !== path) } : p
      );
      scheduleAutosave({ products: updated });
      return { ...prev, products: updated };
    });
  }

  async function handleUpload(fieldName, file, isArray = false) {
    setUploading(prev => ({ ...prev, [fieldName]: true }));
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('field', fieldName);
      const res = await fetch(`/api/onboarding/${token}/upload`, { method: 'POST', body: fd });
      const { path, signedUrl, error } = await res.json();
      if (error) { alert(error); return; }
      if (signedUrl) setSignedUrls(prev => ({ ...prev, [path]: signedUrl }));
      if (isArray) {
        setForm(prev => {
          const arr = [...(prev[fieldName] || []), path];
          scheduleAutosave({ [fieldName]: arr });
          return { ...prev, [fieldName]: arr };
        });
      } else {
        handleChange(fieldName, path);
      }
    } finally {
      setUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  }

  function removeFile(fieldName, path, isArray = false) {
    if (isArray) {
      setForm(prev => {
        const arr = prev[fieldName].filter(p => p !== path);
        scheduleAutosave({ [fieldName]: arr });
        return { ...prev, [fieldName]: arr };
      });
    } else {
      handleChange(fieldName, '');
    }
  }

  function goToSection(idx) {
    sectionKey.current += 1;
    setSectionIdx(idx);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/onboarding/${token}/submit`, { method: 'POST' });
      if (res.ok) { setShowConfirm(false); setScreen('submitted'); }
      else alert('Something went wrong. Please try again or message us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Shared styles ───────────────────────────────────────────────────────────
  const input    = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/10 transition-all bg-white';
  const textarea = `${input} resize-none`;
  const label    = 'block text-sm font-semibold text-black mb-2';
  const hint     = 'text-xs text-gray-400 mt-1.5 leading-relaxed';
  const fieldWrap = 'space-y-1.5';

  function FileUpload({ fieldName, accept = 'image/*,.pdf', label: lbl, sublabel }) {
    const isUploading = uploading[fieldName];
    const filePath = form[fieldName];
    const fileUrl = signedUrls[filePath];
    return (
      <div>
        {!filePath ? (
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-[#7c3aed]/50 hover:bg-[#7c3aed]/[0.02] transition-all group">
            <input type="file" className="sr-only" accept={accept} disabled={isUploading}
              onChange={e => { if (e.target.files[0]) handleUpload(fieldName, e.target.files[0]); }} />
            {isUploading ? (
              <svg className="w-5 h-5 text-[#7c3aed] animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-300 group-hover:text-[#7c3aed] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            )}
            <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors font-medium">{isUploading ? 'Uploading...' : lbl}</span>
            {sublabel && <span className="text-xs text-gray-400">{sublabel}</span>}
          </label>
        ) : (
          <div className="flex items-center gap-3 px-4 py-3 bg-[#7c3aed]/5 border border-[#7c3aed]/20 rounded-xl">
            {fileUrl && filePath.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) ? (
              <img src={fileUrl} alt="" className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 bg-[#7c3aed]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#7c3aed]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
            )}
            <span className="text-sm text-gray-700 flex-1 truncate font-medium">{getFileName(filePath)}</span>
            <button type="button" onClick={() => removeFile(fieldName, filePath)}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  }

  function MultiFileUpload({ fieldName, accept = 'image/*,.pdf', addLabel, sublabel, imageGrid = false }) {
    const paths = form[fieldName] || [];
    const isUploading = uploading[fieldName];
    return (
      <div className="space-y-2">
        {paths.length > 0 && (
          <div className={imageGrid ? 'grid grid-cols-2 sm:grid-cols-3 gap-2' : 'space-y-2'}>
            {paths.map(path => {
              const url = signedUrls[path];
              const isImage = path.match(/\.(jpg|jpeg|png|webp|gif)$/i);
              return imageGrid ? (
                <div key={path} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
                  {url && isImage
                    ? <img src={url} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 px-2 text-center">{getFileName(path)}</div>}
                  <button type="button" onClick={() => removeFile(fieldName, path, true)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div key={path} className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span className="text-sm text-gray-700 flex-1 truncate">{getFileName(path)}</span>
                  <button type="button" onClick={() => removeFile(fieldName, path, true)}
                    className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <label className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-xl cursor-pointer transition-all group
          ${isUploading ? 'border-[#7c3aed]/30 bg-[#7c3aed]/5' : 'border-gray-200 hover:border-[#7c3aed]/40 hover:bg-[#7c3aed]/[0.02]'}
          ${paths.length > 0 ? 'py-4' : 'py-8 flex-col'}`}>
          <input type="file" className="sr-only" accept={accept} multiple disabled={isUploading}
            onChange={e => {
              const current = form[fieldName]?.length || 0;
              const cap = fieldName === 'photo_urls' ? 20 : 999;
              const files = Array.from(e.target.files || []).slice(0, cap - current);
              if (files.length < (e.target.files?.length || 0)) alert(`You can upload a maximum of ${cap} photos.`);
              files.forEach(f => handleUpload(fieldName, f, true));
              e.target.value = '';
            }} />
          {isUploading ? (
            <svg className="w-4 h-4 text-[#7c3aed] animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-400 group-hover:text-[#7c3aed] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          )}
          <span className="text-sm text-gray-500 font-medium group-hover:text-gray-700 transition-colors">
            {isUploading ? 'Uploading...' : addLabel}
          </span>
          {paths.length === 0 && sublabel && <span className="text-xs text-gray-400">{sublabel}</span>}
        </label>
      </div>
    );
  }

  // ─── Welcome screen ───────────────────────────────────────────────────────────
  if (screen === 'welcome') {
    return (
      <div className="min-h-screen bg-[#09051e] flex flex-col">
        <div className="px-6 py-5 border-b border-white/5">
          <p className="text-xs font-bold tracking-widest uppercase text-white">Bluehydra</p>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="max-w-lg w-full">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#7c3aed] mb-6">
              Founders' Five · Cohort 01
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-3">
              Welcome, {firstName}.
            </h1>
            <p className="text-lg text-gray-400 mb-10 leading-relaxed">
              You're one of the Founders' Five. We're genuinely excited to build for <span className="text-white font-medium">{businessName}</span>.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 space-y-4">
              {[
                ['Saves automatically', 'Your answers save as you type — pick up where you left off if you need a break.'],
                ['Have your photos ready', 'Gather photos of your work, products, or space — the more the better.'],
                ['No content, no site', 'We build from what you give us. The more you share, the better the site.'],
                ['First brief in, first site built', 'We work through briefs in the order we receive them. The sooner you submit, the sooner we start on yours.'],
              ].map(([title, body]) => (
                <div key={title} className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="text-sm text-gray-400 mt-0.5 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setScreen('form')}
              className="inline-flex items-center gap-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-4 rounded-xl transition-colors text-sm"
            >
              Let's start
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Thank you screen ─────────────────────────────────────────────────────────
  if (screen === 'submitted') {
    return (
      <div className="min-h-screen bg-[#09051e] flex flex-col">
        <div className="px-6 py-5 border-b border-white/5">
          <p className="text-xs font-bold tracking-widest uppercase text-white">Bluehydra</p>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="max-w-lg w-full">
            <div className="w-12 h-12 rounded-2xl bg-[#7c3aed]/20 border border-[#7c3aed]/30 flex items-center justify-center mb-8">
              <svg className="w-6 h-6 text-[#7c3aed]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#7c3aed] mb-4">Brief received</p>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Thanks, {firstName}.<br />We've got everything.
            </h1>
            <p className="text-gray-400 leading-relaxed mb-10">
              Here's what happens next.
            </p>
            <div className="space-y-5 mb-10">
              {[
                ['Within 48 hours', 'We\'ll review your brief carefully.'],
                ['We\'ll reach out', 'Expect a message on WhatsApp to align on any questions before we start.'],
                ['Then we build', 'Expect 3–4 weeks to delivery from the kickoff.'],
              ].map(([title, body], i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full border border-[#7c3aed]/40 text-[#7c3aed] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="https://wa.me/2349133105749"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#7c3aed] hover:underline"
            >
              Message us on WhatsApp →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ─── Section renderers ────────────────────────────────────────────────────────
  function renderAbout() {
    return (
      <div className="space-y-6">
        <div className={fieldWrap}>
          <label className={label}>Who is your ideal customer?</label>
          <p className={hint}>Be specific — age, location, what they care about.</p>
          <textarea rows={3} className={textarea} value={form.ideal_customer}
            onChange={e => handleChange('ideal_customer', e.target.value)}
            placeholder="Women aged 25–45 in Lagos and Abuja, planning birthdays or weddings." />
        </div>
        <div className={fieldWrap}>
          <label className={label}>What are the top 3 things you want a visitor to do on your website?</label>
          <p className={hint}>Examples: call you, book an appointment, see your work, buy a product.</p>
          <textarea rows={3} className={textarea} value={form.top_goals}
            onChange={e => handleChange('top_goals', e.target.value)}
            placeholder="1. See our work&#10;2. Place an order&#10;3. Contact us on WhatsApp" />
        </div>
        <div className={fieldWrap}>
          <label className={label}>What makes you different from your competitors?</label>
          <textarea rows={3} className={textarea} value={form.differentiator}
            onChange={e => handleChange('differentiator', e.target.value)}
            placeholder="We use local ingredients and every cake is custom-designed." />
        </div>
      </div>
    );
  }

  function renderInspiration() {
    function updateSite(index, field, value) {
      const updated = form.sites_liked.map((s, i) => i === index ? { ...s, [field]: value } : s);
      handleChange('sites_liked', updated);
    }
    return (
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <p className="text-sm text-amber-800 leading-relaxed">They don't have to be in your industry. We care about your taste — layout, colours, the overall feeling.</p>
        </div>
        {[0, 1, 2].map(i => (
          <div key={i} className="border border-gray-200 rounded-xl p-5 space-y-3">
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400">Site {i + 1}</p>
            <div className={fieldWrap}>
              <label className={label}>URL</label>
              <input className={input} value={form.sites_liked[i]?.url || ''}
                onChange={e => updateSite(i, 'url', e.target.value)}
                placeholder="https://paystack.com" />
            </div>
            <div className={fieldWrap}>
              <label className={label}>What do you like about it?</label>
              <textarea rows={2} className={textarea} value={form.sites_liked[i]?.why || ''}
                onChange={e => updateSite(i, 'why', e.target.value)}
                placeholder="Clean layout, bold typography, feels premium..." />
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderBrand() {
    return (
      <div className="space-y-6">
        <div className={fieldWrap}>
          <label className={label}>Do you have a logo?</label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[['true', 'Yes, I have one'], ['false', 'No, I don\'t']].map(([val, lbl]) => (
              <button key={val} type="button"
                onClick={() => handleChange('has_logo', val === 'true')}
                className={`px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all text-left
                  ${String(form.has_logo) === val
                    ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}>
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {form.has_logo === true && (
          <div className={fieldWrap}>
            <label className={label}>Upload your logo</label>
            <p className={hint}>PNG, JPG, SVG, or PDF. Max 10MB.</p>
            <FileUpload fieldName="logo_url" accept="image/*,.pdf,.ai" lbl="Upload logo" sublabel="PNG, JPG, SVG, PDF, AI" />
          </div>
        )}

        {form.has_logo === false && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-sm text-blue-800">No problem. We'll create a simple wordmark based on your business name and the sites you liked.</p>
          </div>
        )}

        <div className={fieldWrap}>
          <label className={label}>Brand colours</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {[
              ['have', 'I have specific colours'],
              ['pick', 'Pick for me based on my inspiration sites'],
            ].map(([val, lbl]) => (
              <button key={val} type="button"
                onClick={() => handleChange('brand_colors_choice', val)}
                className={`px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all text-left
                  ${form.brand_colors_choice === val
                    ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}>
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {form.brand_colors_choice === 'have' && (
          <div className="space-y-4">
            <div className={fieldWrap}>
              <label className={label}>Describe your colours</label>
              <p className={hint}>Hex codes, names, or just describe them ("navy blue and gold").</p>
              <textarea rows={2} className={textarea} value={form.brand_colors_description}
                onChange={e => handleChange('brand_colors_description', e.target.value)}
                placeholder="#1a1a2e and #e94560 — dark navy with a red accent" />
            </div>
            <div className={fieldWrap}>
              <label className={label}>Brand guide (optional)</label>
              <FileUpload fieldName="brand_guide_url" accept="image/*,.pdf" lbl="Upload brand guide" sublabel="PDF or image, max 10MB" />
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderContent() {
    const hasCatalogue = form.has_catalogue === true;
    const needsPaystack = hasCatalogue && (form.purchase_method === 'paystack' || form.purchase_method === 'both');

    function ProductCard({ product, i }) {
      const photoKey = `product_photo_${i}`;
      const photos = product.photo_urls || [];
      const canAddMore = photos.length < 10;
      return (
        <div className="border border-gray-200 rounded-xl p-5 space-y-4">
          <p className="text-xs font-bold tracking-widest uppercase text-gray-400">Item {i + 1}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className={fieldWrap}>
              <label className={label}>Name</label>
              <input className={input} value={product.name}
                onChange={e => handleProduct(i, 'name', e.target.value)}
                placeholder="Birthday cake" />
            </div>
            <div className={fieldWrap}>
              <label className={label}>Price</label>
              <input className={input} value={product.price}
                onChange={e => handleProduct(i, 'price', e.target.value)}
                placeholder="From ₦25,000" />
            </div>
          </div>
          <div className={fieldWrap}>
            <label className={label}>Description</label>
            <textarea rows={2} className={textarea} value={product.description}
              onChange={e => handleProduct(i, 'description', e.target.value)}
              placeholder="Custom designed, feeds 20–25 people..." />
          </div>
          <div className={fieldWrap}>
            <label className={label}>
              Photos
              <span className="text-xs text-gray-400 font-normal ml-2">{photos.length} / 10</span>
            </label>
            {photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">
                {photos.map(path => {
                  const url = signedUrls[path];
                  return (
                    <div key={path} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                      {url
                        ? <img src={url} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">{getFileName(path)}</div>}
                      <button type="button" onClick={() => removeProductPhoto(i, path)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {canAddMore && (
              <label className={`flex items-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all group
                ${uploading[photoKey] ? 'border-[#7c3aed]/30 bg-[#7c3aed]/5' : 'border-gray-200 hover:border-[#7c3aed]/40 hover:bg-[#7c3aed]/[0.02]'}`}>
                <input type="file" className="sr-only" accept="image/*" multiple disabled={uploading[photoKey]}
                  onChange={e => {
                    const files = Array.from(e.target.files || []).slice(0, 10 - photos.length);
                    if (files.length < (e.target.files?.length || 0)) alert('Max 10 photos per product.');
                    files.forEach(f => handleProductPhoto(i, f));
                    e.target.value = '';
                  }} />
                {uploading[photoKey]
                  ? <svg className="w-4 h-4 text-[#7c3aed] animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  : <svg className="w-4 h-4 text-gray-400 group-hover:text-[#7c3aed] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                }
                <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors font-medium">
                  {uploading[photoKey] ? 'Uploading...' : photos.length > 0 ? 'Add more photos' : 'Upload photos'}
                </span>
              </label>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">

        {/* About — everyone */}
        <div className={fieldWrap}>
          <label className={label}>About your business</label>
          <p className={hint}>2–3 paragraphs in your own words — this goes directly on your site. We've started you off with what you told us in your application; expand it freely.</p>
          <textarea rows={6} className={textarea} value={form.about_business}
            onChange={e => handleChange('about_business', e.target.value)}
            placeholder="We started Honey & Thread in 2019 from a small studio in Ibadan..." />
        </div>

        {/* Catalogue question — everyone */}
        <div className={fieldWrap}>
          <label className={label}>Is this an e-commerce site?</label>
          <p className={hint}>Will customers browse your products and place orders directly on the site?</p>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[['true', 'Yes — I want to sell online'], ['false', 'No — it\'s a portfolio / showcase site']].map(([val, lbl]) => (
              <button key={val} type="button"
                onClick={() => handleChange('has_catalogue', val === 'true')}
                className={`px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all text-left
                  ${String(form.has_catalogue) === val
                    ? 'border-[#7c3aed] bg-[#7c3aed]/5 text-[#7c3aed]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}>
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* No catalogue → free-text description of offerings */}
        {form.has_catalogue === false && (
          <div className={fieldWrap}>
            <label className={label}>What do you offer?</label>
            <p className={hint}>Describe your products or services. Include prices where you can — "starts from ₦X" or "on request" is fine.</p>
            <textarea rows={5} className={textarea} value={form.services_products}
              onChange={e => handleChange('services_products', e.target.value)}
              placeholder={`Brand identity design\nWedding photography & videography\nSocial media content creation`} />
          </div>
        )}

        {/* If catalogue → how do customers buy? */}
        {hasCatalogue && (
          <div className={fieldWrap}>
            <label className={label}>How should customers complete their order?</label>
            <div className="space-y-2 mt-2">
              {[
                ['paystack',  'Pay directly on the site',   'Powered by Paystack — requires a registered business'],
                ['whatsapp',  'Order via WhatsApp',          'They tap a button and message you directly'],
                ['both',      'Both options',                'Customers choose — pay online or message you on WhatsApp'],
              ].map(([val, lbl, sub]) => (
                <button key={val} type="button"
                  onClick={() => handleChange('purchase_method', val)}
                  className={`w-full flex items-start gap-4 px-4 py-3.5 rounded-xl border text-left transition-all
                    ${form.purchase_method === val
                      ? 'border-[#7c3aed] bg-[#7c3aed]/5'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors
                    ${form.purchase_method === val ? 'border-[#7c3aed]' : 'border-gray-300'}`}>
                    {form.purchase_method === val && <div className="w-2 h-2 rounded-full bg-[#7c3aed]" />}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${form.purchase_method === val ? 'text-[#7c3aed]' : 'text-black'}`}>{lbl}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                  </div>
                </button>
              ))}
            </div>
            {needsPaystack && (
              <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <p className="text-sm text-amber-800 leading-relaxed">
                  <strong>Heads up:</strong> Paystack requires a registered business to go live. We'll confirm this with you before we build.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Catalogue items */}
        {hasCatalogue && (
          <div className={fieldWrap}>
            <label className={label}>Your products / services</label>
            <p className={hint}>Fill in all 5. Add up to 10 photos per item.</p>
            <div className="space-y-4 mt-2">
              {form.products.map((product, i) => (
                <ProductCard key={i} product={product} i={i} />
              ))}
            </div>
          </div>
        )}

        {/* Testimonials — everyone */}
        <div className={fieldWrap}>
          <label className={label}>Customer testimonials</label>
          <p className={hint}>Paste reviews here — WhatsApp messages, Google reviews, DMs, anything. 3–5 is ideal.</p>
          <textarea rows={4} className={textarea} value={form.testimonials_text}
            onChange={e => handleChange('testimonials_text', e.target.value)}
            placeholder={`"Absolutely loved the result — exactly what I asked for." — Temi A.\n"Delivered on time and exceeded my expectations." — Chidi O.`} />
        </div>

        {/* Photos — everyone */}
        <div className={fieldWrap}>
          <label className={label}>Portfolio / work photos</label>
          <p className={hint}>Up to 20 photos. Use your best, clearest shots — phone photos are fine if well-lit.</p>
          <MultiFileUpload
            fieldName="photo_urls"
            accept="image/*"
            addLabel="Add photos"
            sublabel="JPG, PNG, WebP — up to 20 photos"
            imageGrid
          />
          {(form.photo_urls || []).length > 0 && (
            <p className="text-xs text-gray-400 mt-2">{form.photo_urls.length} / 20 photos uploaded</p>
          )}
        </div>

      </div>
    );
  }

  function renderContact() {
    const socialFields = [
      { field: 'instagram', label: 'Instagram', placeholder: 'instagram.com/yourbusiness' },
      { field: 'facebook',  label: 'Facebook',  placeholder: 'facebook.com/yourbusiness' },
      { field: 'linkedin',  label: 'LinkedIn',  placeholder: 'linkedin.com/company/...' },
      { field: 'tiktok',    label: 'TikTok',    placeholder: 'tiktok.com/@yourbusiness' },
      { field: 'twitter',   label: 'Twitter / X', placeholder: 'x.com/yourbusiness' },
      { field: 'youtube',   label: 'YouTube',   placeholder: 'youtube.com/@yourbusiness' },
      { field: 'other_social', label: 'Other',  placeholder: 'Any other platform' },
    ];
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className={fieldWrap}>
            <label className={label}>Phone</label>
            <input className={input} value={form.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="+234 801 234 5678" />
          </div>
          <div className={fieldWrap}>
            <label className={label}>Email</label>
            <input className={input} type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} placeholder="hello@yourbusiness.com" />
          </div>
        </div>
        <div className={fieldWrap}>
          <label className={label}>WhatsApp number <span className="text-gray-400 font-normal text-xs ml-1">if different from phone</span></label>
          <input className={input} value={form.whatsapp} onChange={e => handleChange('whatsapp', e.target.value)} placeholder="+234 801 234 5678" />
        </div>
        <div className={fieldWrap}>
          <label className={label}>Physical address</label>
          <div className="flex items-center gap-3 mb-3">
            <button type="button"
              onClick={() => handleChange('online_only', !form.online_only)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${form.online_only ? 'text-[#7c3aed]' : 'text-gray-500'}`}>
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${form.online_only ? 'border-[#7c3aed] bg-[#7c3aed]' : 'border-gray-300'}`}>
                {form.online_only && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
              </div>
              Online only — no physical address
            </button>
          </div>
          {!form.online_only && (
            <textarea rows={2} className={textarea} value={form.address}
              onChange={e => handleChange('address', e.target.value)}
              placeholder="12 Allen Avenue, Ikeja, Lagos" />
          )}
        </div>
        <div className={fieldWrap}>
          <label className={label}>Hours of operation <span className="text-gray-400 font-normal text-xs ml-1">optional</span></label>
          <input className={input} value={form.hours} onChange={e => handleChange('hours', e.target.value)} placeholder="Mon–Sat 9am–6pm" />
        </div>
        <div>
          <label className={label}>Social media <span className="text-gray-400 font-normal text-xs ml-1">add any that apply</span></label>
          <div className="space-y-3 mt-2">
            {socialFields.map(({ field, label: lbl, placeholder }) => (
              <div key={field} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-400 w-20 flex-shrink-0">{lbl}</span>
                <input className={input} value={form[field]} onChange={e => handleChange(field, e.target.value)} placeholder={placeholder} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderFunctionality() {
    return (
      <div className="space-y-6">
        <div className={fieldWrap}>
          <label className={label}>Is there anything else you'd like on your site?</label>
          <p className={hint}>Any features, ideas, or requests — big or small. If you're not sure, just describe what you want visitors to be able to do.</p>
          <textarea rows={6} className={textarea} value={form.other_requests}
            onChange={e => handleChange('other_requests', e.target.value)}
            placeholder="e.g. I'd like a WhatsApp chat button, a gallery of my past work, and a booking form for consultations..." />
        </div>
      </div>
    );
  }

  const sectionRenderers = [renderAbout, renderInspiration, renderBrand, renderContent, renderContact, renderFunctionality];
  const isLastSection = sectionIdx === SECTIONS.length - 1;

  // ─── Save indicator ───────────────────────────────────────────────────────────
  function SaveIndicator() {
    if (saveState === 'idle') return null;
    return (
      <div className={`flex items-center gap-1.5 text-xs font-medium transition-all ${saveState === 'saving' ? 'text-gray-400' : saveState === 'saved' ? 'text-green-600' : 'text-red-500'}`}>
        {saveState === 'saving' && <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
        {saveState === 'saved' && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
        {saveState === 'saving' ? 'Saving...' : saveState === 'saved' ? 'Saved' : 'Save failed'}
      </div>
    );
  }

  // ─── Form screen ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <p className="text-xs font-bold tracking-widest uppercase text-[#7c3aed]">Bluehydra</p>
          <SaveIndicator />
        </div>

        {/* Progress strip */}
        <div className="max-w-2xl mx-auto px-6 pb-4 pt-1">
          <div className="flex items-center gap-1">
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goToSection(i)}
                className="flex-1 group flex flex-col items-center gap-1.5"
              >
                <div className={`h-1 w-full rounded-full transition-all duration-300 ${
                  i < sectionIdx ? 'bg-[#7c3aed]' : i === sectionIdx ? 'bg-[#7c3aed]' : 'bg-gray-200 group-hover:bg-gray-300'
                }`} />
                <span className={`text-[10px] font-semibold transition-colors hidden sm:block ${
                  i === sectionIdx ? 'text-[#7c3aed]' : i < sectionIdx ? 'text-gray-400' : 'text-gray-300'
                }`}>{s.label}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-1 sm:hidden">
            <span className="text-xs font-semibold text-[#7c3aed]">{SECTIONS[sectionIdx].label}</span>
            <span className="text-xs text-gray-400">{sectionIdx + 1} of {SECTIONS.length}</span>
          </div>
        </div>
      </div>

      {/* Section content */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-6 py-10">
        <div key={`section-${sectionIdx}`} style={{ animation: 'fadeIn 0.25s ease-out' }}>
          <p className="text-xs font-bold tracking-widest uppercase text-[#7c3aed] mb-2">
            {String(sectionIdx + 1).padStart(2, '0')} / {SECTIONS.length}
          </p>
          <h2 className="text-2xl font-bold text-black mb-8">{SECTIONS[sectionIdx].label}</h2>
          {sectionRenderers[sectionIdx]()}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => goToSection(sectionIdx - 1)}
            disabled={sectionIdx === 0}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black disabled:opacity-0 disabled:pointer-events-none transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>

          {isLastSection ? (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Submit brief
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => goToSection(sectionIdx + 1)}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Continue
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { if (!submitting) { setShowConfirm(false); setDomainAgreed(false); } }} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8" style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-[#7c3aed]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-black mb-2">Before you submit — check everything.</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Once you submit, your brief is <strong className="text-black">locked and cannot be edited</strong>. Go back through each section and make sure everything is correct — your details, photos, and any requests.
            </p>
            <button
              type="button"
              onClick={() => setDomainAgreed(v => !v)}
              className={`w-full flex items-start gap-3 px-4 py-4 rounded-xl border text-left transition-all mb-7 ${domainAgreed ? 'border-[#7c3aed] bg-[#7c3aed]/5' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${domainAgreed ? 'border-[#7c3aed] bg-[#7c3aed]' : 'border-gray-300'}`}>
                {domainAgreed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                I understand I need to purchase a domain name for my site <span className="text-black font-medium">(~₦5,000–₦15,000/yr)</span>. I can buy it from anywhere — Namecheap, GoDaddy, or any registrar. Bluehydra does not profit from this; they just need me to own one to point to my site.
              </p>
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setShowConfirm(false); setDomainAgreed(false); }}
                disabled={submitting}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Go back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !domainAgreed}
                className="flex-1 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Submitting...
                  </>
                ) : 'Submit brief'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
