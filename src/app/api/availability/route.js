import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const TIMEZONE = 'Africa/Lagos';
const SLOT_DURATION = 30; // minutes
const WORK_START = 9;     // 9 AM
const WORK_END = 17;      // 5 PM

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
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });
}

function generateSlots(dateStr) {
  const slots = [];
  for (let hour = WORK_START; hour < WORK_END; hour++) {
    for (let min = 0; min < 60; min += SLOT_DURATION) {
      const h = String(hour).padStart(2, '0');
      const m = String(min).padStart(2, '0');
      slots.push(`${h}:${m}`);
    }
  }
  return slots;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date parameter' }, { status: 400 });
  }

  const [year, month, day] = date.split('-').map(Number);
  const dayOfWeek = new Date(year, month - 1, day).getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return NextResponse.json({ slots: [] });
  }

  // Past date check (WAT = UTC+1)
  const now = new Date();
  const todayWAT = new Date(now.getTime() + 60 * 60 * 1000);
  const requestedDate = new Date(`${date}T00:00:00+01:00`);
  if (requestedDate < new Date(todayWAT.toISOString().slice(0, 10) + 'T00:00:00+01:00')) {
    return NextResponse.json({ slots: [] });
  }

  const allSlots = generateSlots(date);

  try {
    const auth = getServiceAccountAuth();
    const calendar = google.calendar({ version: 'v3', auth });

    const timeMin = `${date}T${String(WORK_START).padStart(2, '0')}:00:00+01:00`;
    const timeMax = `${date}T${String(WORK_END).padStart(2, '0')}:00:00+01:00`;

    const freeBusy = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: TIMEZONE,
        items: [{ id: process.env.GOOGLE_CALENDAR_ID }],
      },
    });

    const busyPeriods = freeBusy.data.calendars?.[process.env.GOOGLE_CALENDAR_ID]?.busy ?? [];

    const availableSlots = allSlots.filter((slot) => {
      const [h, m] = slot.split(':').map(Number);
      const slotStart = new Date(`${date}T${slot}:00+01:00`);
      const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION * 60 * 1000);

      return !busyPeriods.some((busy) => {
        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);
        return slotStart < busyEnd && slotEnd > busyStart;
      });
    });

    return NextResponse.json({ slots: availableSlots });
  } catch (err) {
    console.error('Availability error:', err);
    // Fallback: return all slots if calendar fetch fails (non-blocking UX)
    return NextResponse.json({ slots: allSlots, fallback: true });
  }
}
