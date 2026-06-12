import { supabase } from '@/lib/supabase';

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'application/pdf',
];
const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(request, { params }) {
  const { token } = await params;

  const { data: brief } = await supabase
    .from('founders_five_briefs')
    .select('id')
    .eq('token', token)
    .is('submitted_at', null)
    .single();

  if (!brief) {
    return Response.json({ error: 'Not found or already submitted' }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const field = formData.get('field') || 'misc';

  if (!file) return Response.json({ error: 'No file provided' }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return Response.json({ error: 'File type not supported. Use JPG, PNG, WebP, GIF, SVG or PDF.' }, { status: 400 });
  if (file.size > MAX_SIZE) return Response.json({ error: 'File too large — max 10MB.' }, { status: 400 });

  const ext = file.name.split('.').pop().toLowerCase();
  const path = `${token}/${field}/${Date.now()}.${ext}`;
  const buffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from('founders-briefs')
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (uploadError) return Response.json({ error: uploadError.message }, { status: 500 });

  const { data: signed } = await supabase.storage
    .from('founders-briefs')
    .createSignedUrl(path, 3600 * 24);

  return Response.json({ path, signedUrl: signed?.signedUrl });
}
