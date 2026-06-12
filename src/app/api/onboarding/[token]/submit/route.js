import { supabase } from '@/lib/supabase';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request, { params }) {
  const { token } = await params;

  const { data: brief, error } = await supabase
    .from('founders_five_briefs')
    .select('*, founders_five_applications(*)')
    .eq('token', token)
    .is('submitted_at', null)
    .single();

  if (error || !brief) {
    return Response.json({ error: 'Not found or already submitted' }, { status: 400 });
  }

  await supabase
    .from('founders_five_briefs')
    .update({ submitted_at: new Date().toISOString() })
    .eq('token', token);

  const app = brief.founders_five_applications;
  const founderName = app?.name || 'Unknown';
  const businessName = app?.business_name || 'Unknown';

  const enabledFeatures = Object.entries(brief.features || {})
    .filter(([, v]) => v?.enabled)
    .map(([k]) => k.replace(/_/g, ' '))
    .join(', ') || 'None selected';

  try {
    await transporter.sendMail({
      from: `"Bluehydra" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `New Founders' Five brief — ${businessName}`,
      html: `
        <div style="font-family:sans-serif;padding:24px;color:#333;max-width:600px;">
          <div style="background:#09051e;padding:20px 24px;border-radius:8px 8px 0 0;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#7c3aed;">Bluehydra</p>
            <p style="margin:4px 0 0;font-size:11px;color:#fff;letter-spacing:1px;text-transform:uppercase;">Founders' Five · Brief Submitted</p>
          </div>
          <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
            <p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#111;">${businessName}</p>
            <p style="margin:0 0 20px;font-size:13px;color:#6b7280;">${founderName} · ${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })} WAT</p>
            <hr style="border:none;border-top:1px solid #f3f4f6;margin:0 0 20px;" />

            <h3 style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#7c3aed;margin:0 0 12px;">About</h3>
            <p style="margin:0 0 6px;font-size:13px;"><strong>Description:</strong> ${brief.business_description || '—'}</p>
            <p style="margin:0 0 6px;font-size:13px;"><strong>Ideal customer:</strong> ${brief.ideal_customer || '—'}</p>
            <p style="margin:0 0 6px;font-size:13px;"><strong>Top goals:</strong> ${brief.top_goals || '—'}</p>
            <p style="margin:0 0 20px;font-size:13px;"><strong>Differentiator:</strong> ${brief.differentiator || '—'}</p>

            <h3 style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#7c3aed;margin:0 0 12px;">Inspiration</h3>
            <p style="margin:0 0 6px;font-size:13px;"><strong>Sites liked:</strong> ${brief.sites_liked || '—'}</p>
            <p style="margin:0 0 20px;font-size:13px;"><strong>Sites disliked:</strong> ${brief.sites_disliked || '—'}</p>

            <h3 style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#7c3aed;margin:0 0 12px;">Brand</h3>
            <p style="margin:0 0 6px;font-size:13px;"><strong>Has logo:</strong> ${brief.has_logo === true ? 'Yes' : brief.has_logo === false ? 'No' : '—'}</p>
            <p style="margin:0 0 20px;font-size:13px;"><strong>Colors:</strong> ${brief.brand_colors_choice === 'have' ? brief.brand_colors_description || 'Has specific colours' : brief.brand_colors_choice === 'pick' ? 'Pick for them' : '—'}</p>

            <h3 style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#7c3aed;margin:0 0 12px;">Content</h3>
            <p style="margin:0 0 6px;font-size:13px;"><strong>About:</strong> ${(brief.about_business || '—').substring(0, 200)}${(brief.about_business || '').length > 200 ? '...' : ''}</p>
            <p style="margin:0 0 6px;font-size:13px;"><strong>Services/Products:</strong> ${(brief.services_products || '—').substring(0, 200)}${(brief.services_products || '').length > 200 ? '...' : ''}</p>
            <p style="margin:0 0 6px;font-size:13px;"><strong>Photos uploaded:</strong> ${(brief.photo_urls || []).length}</p>
            <p style="margin:0 0 20px;font-size:13px;"><strong>Testimonial files:</strong> ${(brief.testimonial_urls || []).length}</p>

            <h3 style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#7c3aed;margin:0 0 12px;">Contact</h3>
            <p style="margin:0 0 6px;font-size:13px;"><strong>Phone:</strong> ${brief.phone || '—'}</p>
            <p style="margin:0 0 6px;font-size:13px;"><strong>Email:</strong> ${brief.email || '—'}</p>
            <p style="margin:0 0 6px;font-size:13px;"><strong>WhatsApp:</strong> ${brief.whatsapp || '—'}</p>
            <p style="margin:0 0 20px;font-size:13px;"><strong>Address:</strong> ${brief.online_only ? 'Online only' : (brief.address || '—')}</p>

            <h3 style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#7c3aed;margin:0 0 12px;">Features</h3>
            <p style="margin:0;font-size:13px;">${enabledFeatures}</p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Brief notification email failed:', err.message);
  }

  return Response.json({ ok: true });
}
