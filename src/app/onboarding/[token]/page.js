import { supabase } from '@/lib/supabase';
import OnboardingClient from './OnboardingClient';

const TEST_BRIEF = {
  id: 'test',
  token: 'test',
  application_id: 'test',
  submitted_at: null,
  last_saved_at: null,
  business_description: null, ideal_customer: null, top_goals: null, differentiator: null,
  sites_liked: null, sites_disliked: null, has_logo: null, logo_url: null,
  brand_colors_choice: null, brand_colors_description: null, brand_guide_url: null,
  about_business: null, services_products: null, testimonials_text: null,
  testimonial_urls: [], photo_urls: [], phone: null, email: null, whatsapp: null,
  address: null, online_only: false, hours: null, instagram: null, facebook: null,
  linkedin: null, tiktok: null, twitter: null, youtube: null, other_social: null,
  wants_paystack: null, products: [],
  features: {},
  founders_five_applications: {
    name: 'Amaka Okonkwo',
    business_name: 'Honey & Thread',
    business_description: 'We make custom cakes for celebrations in Lagos.',
    whatsapp: '+234 801 234 5678',
    email: 'amaka@honeyandthread.com',
  },
};

export default async function OnboardingPage({ params }) {
  const { token } = await params;

  if (token === 'test') {
    return <OnboardingClient brief={TEST_BRIEF} token="test" initialSignedUrls={{}} />;
  }

  const { data: brief } = await supabase
    .from('founders_five_briefs')
    .select('*, founders_five_applications(*)')
    .eq('token', token)
    .single();

  if (!brief) {
    return (
      <div className="min-h-screen bg-[#09051e] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-[#7c3aed] mb-4">Bluehydra</p>
          <h1 className="text-2xl font-bold text-white mb-3">This link isn't valid</h1>
          <p className="text-sm text-gray-400">If you think this is a mistake, message us on WhatsApp.</p>
          <a
            href="https://wa.me/2349133105749"
            className="inline-block mt-6 text-sm font-semibold text-[#7c3aed] hover:underline"
          >
            Message us →
          </a>
        </div>
      </div>
    );
  }

  const paths = [
    brief.logo_url,
    brief.brand_guide_url,
    ...(brief.testimonial_urls || []),
    ...(brief.photo_urls || []),
  ].filter(Boolean);

  const signedUrls = {};
  for (const path of paths) {
    const { data } = await supabase.storage
      .from('founders_five_briefs')
      .createSignedUrl(path, 3600 * 24);
    if (data) signedUrls[path] = data.signedUrl;
  }

  return <OnboardingClient brief={brief} token={token} initialSignedUrls={signedUrls} />;
}
