"use server";
import nodemailer from 'nodemailer';
import { supabase } from '@/lib/supabase';

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

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 30);
}

async function findUniqueSlug(baseSlug) {
  const { data } = await supabase
    .from('referrers')
    .select('id')
    .eq('slug', baseSlug)
    .maybeSingle();

  if (!data) return baseSlug;

  for (let i = 1; i <= 99; i++) {
    const candidate = `${baseSlug}-${i}`;
    const { data: existing } = await supabase
      .from('referrers')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle();
    if (!existing) return candidate;
  }

  throw new Error('Could not generate unique slug');
}

function buildReferralEmail(name, slug) {
  const link = `https://bluehydralabs.com/pricing?ref=${slug}`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,'Segoe UI',sans-serif;">
  <div style="max-width:580px;margin:40px auto;padding:0 16px;">
    <div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.07);">

      <!-- Header -->
      <div style="background:#09051e;padding:28px 40px;text-align:center;">
        <span style="font-size:22px;font-weight:900;letter-spacing:-0.5px;color:#ffffff;">
          Blue<span style="color:#a78bfa;">hydra</span>
        </span>
      </div>

      <!-- Body -->
      <div style="padding:40px;">
        <h1 style="margin:0 0 12px;font-size:28px;font-weight:800;color:#09051e;line-height:1.15;">
          Your referral link is live 🎉
        </h1>
        <p style="margin:0 0 28px;font-size:15px;color:#555555;line-height:1.7;">
          Hi <strong>${name}</strong>, welcome to the Bluehydra referral programme. Here's everything you need to start earning.
        </p>

        <!-- Link box -->
        <div style="background:#f3f0ff;border:2px solid #7c3aed;border-radius:12px;padding:22px 24px;margin:0 0 36px;text-align:center;">
          <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;">
            Your Personal Referral Link
          </p>
          <a href="${link}" style="font-size:16px;font-weight:700;color:#09051e;text-decoration:none;word-break:break-all;">
            ${link}
          </a>
        </div>

        <!-- How it works -->
        <h2 style="margin:0 0 14px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#09051e;">
          How it works
        </h2>
        <ul style="margin:0 0 28px;padding-left:20px;color:#555555;font-size:15px;line-height:2;">
          <li>Anyone who messages us through your link gets <strong>50% off</strong> Website or E-commerce</li>
          <li>You earn <strong style="color:#7c3aed;">₦10,000 cash</strong> per successful referral</li>
          <li>No cap — refer 5 businesses, earn ₦50,000</li>
          <li>We pay within <strong>24 hours</strong> of their first deposit</li>
        </ul>

        <!-- What to do next -->
        <h2 style="margin:0 0 14px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#09051e;">
          What to do next
        </h2>
        <ol style="margin:0 0 36px;padding-left:20px;color:#555555;font-size:15px;line-height:2;">
          <li>Post about Bluehydra to your WhatsApp status with your link in the caption</li>
          <li>Share it in WhatsApp groups where business owners hang out</li>
          <li>When friends ask "who built that?" — send them your link, not just a number</li>
        </ol>

        <!-- CTA button -->
        <div style="text-align:center;margin:0 0 32px;">
          <a href="${link}"
            style="display:inline-block;background:#7c3aed;color:#ffffff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;">
            View your referral page →
          </a>
        </div>

        <!-- Deadline -->
        <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:14px 18px;margin:0 0 24px;">
          <p style="margin:0;font-size:13px;font-weight:600;color:#92400e;">
            ⏰ Offer ends June 30, 2026. Refer early, get paid early.
          </p>
        </div>

        <p style="margin:0;font-size:13px;color:#999999;line-height:1.6;">
          Questions? Reply to this email or WhatsApp us at <strong>+234 913 310 5749</strong>.
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f8f8f8;border-top:1px solid #eeeeee;padding:18px 40px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#bbbbbb;">— The Bluehydra team · bluehydralabs.com</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function registerReferrer({ name, email, whatsapp }) {
  const nameClean = name?.trim() ?? '';
  const emailClean = email?.trim().toLowerCase() ?? '';
  const waClean = whatsapp?.trim() ?? '';

  if (!nameClean) return { success: false, error: 'Name is required.' };
  if (!emailClean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!waClean) return { success: false, error: 'WhatsApp number is required.' };

  const baseSlug = toSlug(nameClean);
  if (!baseSlug) return { success: false, error: 'Please enter a valid name.' };

  let slug;
  try {
    slug = await findUniqueSlug(baseSlug);
  } catch {
    return { success: false, error: 'Unable to generate a unique link. Please try again.' };
  }

  const { error: dbError } = await supabase.from('referrers').insert({
    name: nameClean,
    email: emailClean,
    whatsapp: waClean,
    slug,
  });

  if (dbError) {
    console.error('Supabase insert error:', dbError);
    if (dbError.code === '23505') {
      return { success: false, error: 'This email is already registered. Check your inbox for your referral link.' };
    }
    return { success: false, error: 'Something went wrong. Please try again.' };
  }

  try {
    await transporter.sendMail({
      from: `"Bluehydra" <${process.env.GMAIL_USER}>`,
      to: emailClean,
      subject: 'Your Bluehydra referral link is ready 🎉',
      html: buildReferralEmail(nameClean, slug),
    });
    await supabase
      .from('referrers')
      .update({ email_sent_at: new Date().toISOString() })
      .eq('slug', slug);
  } catch (err) {
    console.error('Referral email send error:', err);
  }

  return { success: true, slug };
}
