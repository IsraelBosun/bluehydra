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

function buildWelcomeEmail(email) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f1ece0;font-family:-apple-system,'Segoe UI',sans-serif;">
  <div style="max-width:580px;margin:40px auto;padding:0 16px;">
    <div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.07);">

      <!-- Header -->
      <div style="background:#0b382c;padding:28px 40px;text-align:center;">
        <span style="font-size:22px;font-weight:800;letter-spacing:-0.3px;color:#f6f1e3;">
          Afri<span style="color:#7fd3af;">Facts</span>
        </span>
      </div>

      <!-- Body -->
      <div style="padding:40px;">
        <h1 style="margin:0 0 12px;font-size:26px;font-weight:800;color:#0b382c;line-height:1.2;">
          You're on the tester list 🌍
        </h1>
        <p style="margin:0 0 28px;font-size:15px;color:#555555;line-height:1.7;">
          Thanks for signing up to test <strong>AfriFacts</strong>, a verified fact about Africa,
          every single day. We've saved <strong>${email}</strong> for the closed test.
        </p>

        <!-- What happens next -->
        <h2 style="margin:0 0 14px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#0b382c;">
          What happens next
        </h2>
        <ol style="margin:0 0 28px;padding-left:20px;color:#555555;font-size:15px;line-height:2;">
          <li>We add your email to the tester list on Google Play</li>
          <li>You get a second email with your <strong>opt-in link</strong></li>
          <li>Open that link <strong>on your Android phone</strong> and tap "Become a tester"</li>
          <li>Install AfriFacts from the Play Store and start your streak</li>
        </ol>

        <!-- Important note -->
        <div style="background:#eef7f2;border:1px solid #7fd3af;border-radius:10px;padding:16px 18px;margin:0 0 28px;">
          <p style="margin:0;font-size:14px;color:#0b382c;line-height:1.6;">
            <strong>One thing:</strong> the invite only works for the Google account signed in on
            your phone. If ${email} isn't that account, just reply to this email with the right one
            and we'll swap it.
          </p>
        </div>

        <p style="margin:0;font-size:13px;color:#999999;line-height:1.6;">
          Questions, bugs, or a fact you think we got wrong? Reply to this email. A real person reads it.
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#faf8f2;border-top:1px solid #eeeeee;padding:18px 40px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#bbbbbb;">AfriFacts: verified facts about Africa, one card at a time.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function joinAfrifactsTest({ email, source, website }) {
  // Honeypot: bots fill hidden fields. Look successful, save nothing.
  if (website) return { success: true };

  const emailClean = email?.trim().toLowerCase() ?? '';

  if (!emailClean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  const { error: dbError } = await supabase.from('afrifacts_testers').insert({
    email: emailClean,
    source: source?.trim().slice(0, 60) || null,
  });

  if (dbError) {
    // Already signed up, so treat as success rather than scolding them.
    if (dbError.code === '23505') return { success: true, already: true };
    console.error('AfriFacts tester insert error:', dbError);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }

  try {
    await transporter.sendMail({
      from: `"AfriFacts" <${process.env.GMAIL_USER}>`,
      to: emailClean,
      subject: "You're on the AfriFacts tester list 🌍",
      html: buildWelcomeEmail(emailClean),
    });
  } catch (err) {
    // The signup is saved, so a failed confirmation email shouldn't block them.
    console.error('AfriFacts welcome email error:', err);
  }

  return { success: true };
}
