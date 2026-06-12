/**
 * Founders' Five — bulk email sender
 *
 * Usage:
 *   node send-emails.js acknowledge   → send acknowledgement to all applicants
 *   node send-emails.js selected      → send "you're in" to selected applicants
 *   node send-emails.js not-selected  → send "not this time" to remaining applicants
 *
 * Edit the SELECTED array below before running selected / not-selected.
 * Requires .env.local to have GMAIL_USER, GMAIL_APP_PASSWORD, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 */

const nodemailer = require('nodemailer');
const https = require('https');

// ─── Config ───────────────────────────────────────────────────────────────────

require('fs').readdirSync('.').includes('.env.local') && (() => {
  require('fs').readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
  });
})();

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

// ─── Put selected applicant emails here before running "selected" / "not-selected" ───
const SELECTED = [
  // 'email@example.com',
];

// ─── Supabase helpers ──────────────────────────────────────────────────────────

function fetchApplicants() {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/founders_five_applications?select=id,name,email,acknowledge_sent_at,results_sent_at`);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    };
    https.get(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function markSent(id, column) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/founders_five_applications?id=eq.${id}`);
    const body = JSON.stringify({ [column]: new Date().toISOString() });
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        Prefer: 'return=minimal',
      },
    };
    const req = https.request(options, res => {
      res.on('data', () => {});
      res.on('end', resolve);
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── Mailer ────────────────────────────────────────────────────────────────────

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  family: 4,
  auth: { user: GMAIL_USER, pass: GMAIL_PASS },
});

function firstName(fullName) {
  return fullName.trim().split(' ')[0];
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Email templates ───────────────────────────────────────────────────────────

function acknowledgeHtml(name) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr>
          <td style="background:#09051e;padding:32px 40px;">
            <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#7c3aed;">Bluehydra</p>
            <p style="margin:6px 0 0;font-size:11px;color:#ffffff;letter-spacing:1px;text-transform:uppercase;">Founders' Five &middot; Cohort 01</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="margin:0 0 20px;font-size:15px;color:#111827;line-height:1.6;">Hi ${name},</p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
              We've received your application for the <strong>Founders' Five</strong> - thank you for taking the time to apply.
            </p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
              We read every submission carefully. Applications close on <strong>June 12</strong>, and you'll hear back from us within 3 days of that date, whether you've been selected or not.
            </p>
            <p style="margin:0 0 32px;font-size:15px;color:#374151;line-height:1.7;">
              In the meantime, sit tight. If you have any urgent questions, you can reach us on WhatsApp.
            </p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#09051e;border-radius:8px;">
                  <a href="https://wa.me/2349133105749" style="display:inline-block;padding:14px 28px;font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.5px;">
                    Message us on WhatsApp
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #f3f4f6;margin:0;" /></td></tr>
        <tr>
          <td style="padding:24px 40px 32px;">
            <p style="margin:0 0 4px;font-size:13px;color:#6b7280;line-height:1.6;">The Bluehydra Team</p>
            <p style="margin:0;font-size:12px;color:#9ca3af;">bluehydralabs.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function selectedHtml(name) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr>
          <td style="background:#09051e;padding:32px 40px;">
            <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#7c3aed;">Bluehydra</p>
            <p style="margin:6px 0 0;font-size:11px;color:#ffffff;letter-spacing:1px;text-transform:uppercase;">Founders' Five &middot; Cohort 01</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="margin:0 0 20px;font-size:15px;color:#111827;line-height:1.6;">Hi ${name},</p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
              We have some great news - <strong>your business has been selected</strong> for the Founders' Five, Cohort 01.
            </p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
              Out of all the applications we received, yours stood out. We're excited to build your website.
            </p>
            <p style="margin:0 0 32px;font-size:15px;color:#374151;line-height:1.7;">
              We'll be reaching out via WhatsApp shortly to kick things off. Keep an eye on your messages.
            </p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#7c3aed;border-radius:8px;">
                  <a href="https://wa.me/2349133105749" style="display:inline-block;padding:14px 28px;font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.5px;">
                    Message us on WhatsApp
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #f3f4f6;margin:0;" /></td></tr>
        <tr>
          <td style="padding:24px 40px 32px;">
            <p style="margin:0 0 4px;font-size:13px;color:#6b7280;line-height:1.6;">The Bluehydra Team</p>
            <p style="margin:0;font-size:12px;color:#9ca3af;">bluehydralabs.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function notSelectedHtml(name) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr>
          <td style="background:#09051e;padding:32px 40px;">
            <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#7c3aed;">Bluehydra</p>
            <p style="margin:6px 0 0;font-size:11px;color:#ffffff;letter-spacing:1px;text-transform:uppercase;">Founders' Five &middot; Cohort 01</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="margin:0 0 20px;font-size:15px;color:#111827;line-height:1.6;">Hi ${name},</p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
              Thank you for applying to the Founders' Five. We genuinely enjoyed reading your application.
            </p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
              Unfortunately, we weren't able to include you in Cohort 01. The decision was tough - every application we received came from a real business with a real story.
            </p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
              This isn't the end though. Cohort 02 is coming, and we'd love to stay in touch. If you'd like to talk through other options in the meantime, reach out on WhatsApp.
            </p>
            <p style="margin:0 0 32px;font-size:15px;color:#374151;line-height:1.7;">
              Thank you again for trusting us with your story.
            </p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#09051e;border-radius:8px;">
                  <a href="https://wa.me/2349133105749" style="display:inline-block;padding:14px 28px;font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.5px;">
                    Stay in touch on WhatsApp
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #f3f4f6;margin:0;" /></td></tr>
        <tr>
          <td style="padding:24px 40px 32px;">
            <p style="margin:0 0 4px;font-size:13px;color:#6b7280;line-height:1.6;">The Bluehydra Team</p>
            <p style="margin:0;font-size:12px;color:#9ca3af;">bluehydralabs.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const mode = process.argv[2];
  const validModes = ['acknowledge', 'selected', 'not-selected'];

  if (!validModes.includes(mode)) {
    console.log('Usage: node send-emails.js <acknowledge|selected|not-selected>');
    process.exit(1);
  }

  const applicants = await fetchApplicants();
  console.log(`Fetched ${applicants.length} applicants from Supabase.`);

  let targets = [];

  const trackColumn = mode === 'acknowledge' ? 'acknowledge_sent_at' : 'results_sent_at';

  if (mode === 'acknowledge') {
    targets = applicants.filter(a => !a.acknowledge_sent_at);
  } else if (mode === 'selected') {
    if (!SELECTED.length) { console.log('Add emails to the SELECTED array first.'); process.exit(1); }
    targets = applicants.filter(a => SELECTED.includes(a.email) && !a.results_sent_at);
  } else if (mode === 'not-selected') {
    if (!SELECTED.length) { console.log('Add emails to the SELECTED array first.'); process.exit(1); }
    targets = applicants.filter(a => !SELECTED.includes(a.email) && !a.results_sent_at);
  }

  const skipped = applicants.length - targets.length;
  if (skipped > 0) console.log(`Skipping ${skipped} already emailed.\n`);

  if (targets.length === 0) {
    console.log('Nothing to send - everyone in this group has already been emailed.');
    process.exit(0);
  }

  console.log(`Sending "${mode}" email to ${targets.length} recipients...\n`);

  for (const applicant of targets) {
    const name = firstName(applicant.name);
    let html, subject;

    if (mode === 'acknowledge') {
      subject = "We've received your application - Founders' Five, Cohort 01";
      html = acknowledgeHtml(name);
    } else if (mode === 'selected') {
      subject = "You've been selected - Founders' Five, Cohort 01";
      html = selectedHtml(name);
    } else {
      subject = "Your Founders' Five application - Cohort 01";
      html = notSelectedHtml(name);
    }

    await transporter.sendMail({
      from: `"Bluehydra" <${GMAIL_USER}>`,
      to: applicant.email,
      subject,
      html,
    });

    await markSent(applicant.id, trackColumn);
    console.log(`Sent to ${applicant.name} - ${applicant.email}`);
    await sleep(2000);
  }

  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
