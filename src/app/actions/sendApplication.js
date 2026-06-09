"use server";
import nodemailer from 'nodemailer';
import { supabase } from '@/lib/supabase';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendApplicationEmail(formData) {
  const { name, businessName, businessDescription, existingWebsite, socialPlatform, socialLink, customers, whyPick, whatsapp, email } = formData;

  // Save to Supabase
  try {
    const { error: dbError } = await supabase.from('founders_five_applications').insert({
      name,
      business_name: businessName,
      business_description: businessDescription,
      existing_website: existingWebsite || null,
      social_platform: socialPlatform,
      social_link: socialLink,
      customers,
      why_pick: whyPick,
      whatsapp,
      email,
    });
    if (dbError) console.error("Supabase insert error:", dbError);
  } catch (err) {
    console.error("Supabase exception:", err);
  }

  // Send email via Gmail SMTP
  try {
    await transporter.sendMail({
      from: `"Bluehydra Applications" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `New Founders' Five application — ${businessName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px;">
          <h2 style="color: #7c3aed;">New Founders' Five Application</h2>
          <hr style="border-color: #eee;" />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Business Name:</strong> ${businessName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp}</p>
          <p><strong>Existing Website:</strong> ${existingWebsite || 'None'}</p>
          <p><strong>Social Media:</strong> ${socialPlatform} — <a href="${socialLink}">${socialLink}</a></p>
          <p><strong>What does your business do?</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin-bottom: 12px;">
            ${businessDescription.replace(/\n/g, '<br/>')}
          </div>
          <p><strong>Tell us about your customers:</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin-bottom: 12px;">
            ${customers.replace(/\n/g, '<br/>')}
          </div>
          <p><strong>Why should we pick you?</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
            ${whyPick.replace(/\n/g, '<br/>')}
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error("Gmail SMTP error:", err);
    return { success: false, error: "Failed to send email" };
  }
}
