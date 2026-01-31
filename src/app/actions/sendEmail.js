"use server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData) {
  // Check if API key exists
  if (!process.env.RESEND_API_KEY) {
    console.error("ERROR: RESEND_API_KEY is missing from environment variables.");
    return { success: false, error: "Configuration Error" };
  }

  try {
    const { name, email, company, phone, projectType, budget, message, timeline } = formData;

    const { data, error } = await resend.emails.send({
      from: 'BlueHydra Inquiry <onboarding@resend.dev>', // Keep this exactly as is for testing
      to: ['bluehydra001@gmail.com'],
      subject: `New Project: ${projectType} from ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>New Project Inquiry</h2>
          <hr />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || 'N/A'}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Project Type:</strong> ${projectType}</p>
          <p><strong>Budget Range:</strong> ${budget || 'Not specified'}</p>
          <p><strong>Timeline:</strong> ${timeline || 'Not specified'}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Server Action Exception:", err);
    return { success: false, error: "Internal Server Error" };
  }
}