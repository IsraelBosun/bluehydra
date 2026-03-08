import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const TIMEZONE = 'Africa/Lagos';
const SLOT_DURATION = 30;

function getServiceAccountAuth() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !privateKey) {
    throw new Error('Missing Google service account credentials');
  }
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/calendar.events'],
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { date, time, name, email, note } = body;

  // Validation
  if (!date || !time || !name || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
  }
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return NextResponse.json({ error: 'Invalid time format' }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }
  if (name.length > 100 || (note && note.length > 1000)) {
    return NextResponse.json({ error: 'Input too long' }, { status: 400 });
  }

  const startDateTime = `${date}T${time}:00+01:00`;
  const endDate = new Date(new Date(startDateTime).getTime() + SLOT_DURATION * 60 * 1000);
  const endDateTime = endDate.toISOString();

  // Prevent past bookings
  if (new Date(startDateTime) < new Date()) {
    return NextResponse.json({ error: 'Cannot book a slot in the past' }, { status: 400 });
  }

  try {
    const auth = getServiceAccountAuth();
    const calendar = google.calendar({ version: 'v3', auth });

    const event = {
      summary: `Consultation — ${name}`,
      description: `Client Email: ${email}${note ? `\nNotes: ${note}` : ''}`,
      start: { dateTime: startDateTime, timeZone: TIMEZONE },
      end: { dateTime: endDateTime, timeZone: TIMEZONE },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
    });

    // Send confirmation email to client via Resend
    const [month, day, year] = [
      new Date(startDateTime).toLocaleString('en-NG', { month: 'long', timeZone: TIMEZONE }),
      new Date(startDateTime).toLocaleString('en-NG', { day: 'numeric', timeZone: TIMEZONE }),
      new Date(startDateTime).toLocaleString('en-NG', { year: 'numeric', timeZone: TIMEZONE }),
    ];
    const displayTime = new Date(startDateTime).toLocaleString('en-NG', {
      hour: 'numeric', minute: '2-digit', hour12: true, timeZone: TIMEZONE,
    });

    await resend.emails.send({
      from: 'Bluehydra <onboarding@resend.dev>',
      to: [email],
      subject: `Your consultation is confirmed — ${month} ${day}, ${year}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;color:#1e1b4b;">
          <h2 style="margin-bottom:8px;">Booking Confirmed</h2>
          <p style="color:#555;margin-bottom:24px;">Hi ${name}, your free consultation with Bluehydra is booked.</p>
          <div style="background:#faf8ff;border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin-bottom:24px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="color:#888;padding:6px 0;width:80px;">Date</td><td style="font-weight:600;">${month} ${day}, ${year}</td></tr>
              <tr><td style="color:#888;padding:6px 0;">Time</td><td style="font-weight:600;">${displayTime} WAT</td></tr>
              <tr><td style="color:#888;padding:6px 0;">Duration</td><td style="font-weight:600;">30 minutes</td></tr>
              ${note ? `<tr><td style="color:#888;padding:6px 0;vertical-align:top;">Notes</td><td>${note}</td></tr>` : ''}
            </table>
          </div>
          <p style="color:#555;font-size:14px;">We will reach out shortly with a meeting link. In the meantime, feel free to reply to this email with any questions.</p>
          <p style="margin-top:32px;color:#555;font-size:14px;">— The Bluehydra Team</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      eventId: response.data.id,
      booking: { date, time, name, email },
    });
  } catch (err) {
    console.error('Booking error:', err);
    return NextResponse.json({ error: 'Failed to create booking. Please try again.' }, { status: 500 });
  }
}
