import { supabase } from '@/lib/supabase';

export async function GET(request, { params }) {
  const { token } = await params;

  const { data: brief, error } = await supabase
    .from('founders_five_briefs')
    .select('*, founders_five_applications(*)')
    .eq('token', token)
    .single();

  if (error || !brief) {
    return Response.json({ error: 'Not found' }, { status: 404 });
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
      .from('founders-briefs')
      .createSignedUrl(path, 3600 * 24);
    if (data) signedUrls[path] = data.signedUrl;
  }

  return Response.json({ brief, signedUrls });
}

export async function PATCH(request, { params }) {
  const { token } = await params;
  const updates = await request.json();

  const { error } = await supabase
    .from('founders_five_briefs')
    .update({ ...updates, last_saved_at: new Date().toISOString() })
    .eq('token', token)
    .is('submitted_at', null);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
