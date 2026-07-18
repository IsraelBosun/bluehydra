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
const SITE_URL = 'https://www.bluehydralabs.com';

// ─── Put selected applicant emails here before running "selected" / "not-selected" ───
const SELECTED = [
  'glamorah1@gmail.com',
  'stuchewrld.inc@gmail.com',
  'ademfinancialconsulting@gmail.com',
  'bolarinde.samuel@gmail.com',
  'ogbeidelois001@gmail.com',
  'chisom@smartstartssolutions.com',
  'ojonugwadanieluwada@gmail.com',
  'aishatanaha@gmail.com',
  'oluwatoyinjohn1000@gmail.com',
  'joshuaadedeji2002@gmail.com',
];

// ─── Slug helpers ─────────────────────────────────────────────────────────────

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 30);
}

function supabaseGet(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${path}`);
    https.get({ hostname: url.hostname, path: url.pathname + url.search, headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }, res => {
      let d = '';
      res.on('data', c => (d += c));
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });
}

function supabasePost(path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${path}`);
    const payload = JSON.stringify(body);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        Prefer: 'return=representation',
      },
    };
    const req = https.request(options, res => {
      let d = '';
      res.on('data', c => (d += c));
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(d) }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function findUniqueSlug(baseSlug) {
  const rows = await supabaseGet(`referrers?select=slug&slug=eq.${baseSlug}`);
  if (!rows.length) return baseSlug;
  for (let i = 1; i <= 99; i++) {
    const candidate = `${baseSlug}-${i}`;
    const existing = await supabaseGet(`referrers?select=slug&slug=eq.${candidate}`);
    if (!existing.length) return candidate;
  }
  throw new Error(`Could not find unique slug for ${baseSlug}`);
}

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

function getOrCreateBriefToken(applicationId) {
  return new Promise((resolve, reject) => {
    const getUrl = `${SUPABASE_URL}/rest/v1/founders_five_briefs?select=token&application_id=eq.${applicationId}`;
    https.get(getUrl, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    }, res => {
      let d = '';
      res.on('data', c => (d += c));
      res.on('end', () => {
        const rows = JSON.parse(d);
        if (rows.length) return resolve(rows[0].token);
        // Insert new brief row
        const body = JSON.stringify({ application_id: applicationId });
        const url = new URL(`${SUPABASE_URL}/rest/v1/founders_five_briefs`);
        const options = {
          hostname: url.hostname,
          path: url.pathname,
          method: 'POST',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
            Prefer: 'return=representation',
          },
        };
        const req = https.request(options, res2 => {
          let d2 = '';
          res2.on('data', c => (d2 += c));
          res2.on('end', () => {
            const inserted = JSON.parse(d2);
            resolve(inserted[0].token);
          });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
      });
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

function selectedHtml(name, link) {
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
              Congratulations. <strong>You've been selected as one of the Founders' Five.</strong> We went through every application carefully and yours stood out.
            </p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
              We're ready to start building your site right now. All we need from you is a short brief — your story, what you offer, how you want things to look and feel.
            </p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
              <strong>The sooner you fill this in, the sooner we start.</strong> We're working through briefs in the order we receive them. Every moment counts.
            </p>
            <p style="margin:0 0 32px;font-size:15px;color:#374151;line-height:1.7;">
              Click the button below to open your personal link and get it done today.
            </p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#7c3aed;border-radius:8px;">
                  <a href="${link}" style="display:inline-block;padding:14px 28px;font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.5px;">
                    Fill in your brief →
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;">Or copy this link: ${link}</p>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #f3f4f6;margin:0;" /></td></tr>
        <tr>
          <td style="padding:24px 40px 32px;">
            <p style="margin:0 0 6px;font-size:13px;color:#6b7280;line-height:1.6;">Questions? Message us on <a href="https://wa.me/2349133105749" style="color:#7c3aed;text-decoration:none;">WhatsApp</a>.</p>
            <p style="margin:0 0 6px;font-size:13px;color:#6b7280;line-height:1.6;">Follow us on <a href="https://www.instagram.com/bluehydradev/" style="color:#7c3aed;text-decoration:none;">Instagram</a>.</p>
            <p style="margin:0;font-size:12px;color:#9ca3af;">The Bluehydra Team &middot; bluehydralabs.com</p>
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
              Thank you for applying to the Founders' Five. We genuinely enjoyed reading your application and the decision was tough. Every business that applied had a real story worth telling.
            </p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
              We weren't able to include you in Cohort 01, but we don't want this to be the end.
            </p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
              As a thank you for applying, we're offering you <strong>50% off any of our website packages</strong>. This offer is exclusively for Cohort 01 applicants and won't be available after June. Message us on WhatsApp to claim it and we'll get started.
            </p>
            <p style="margin:0 0 32px;font-size:15px;color:#374151;line-height:1.7;">
              Cohort 02 is also coming. Keep an eye on our Instagram for the announcement.
            </p>
            <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr>
                <td style="background:#7c3aed;border-radius:8px;">
                  <a href="https://wa.me/2349133105749" style="display:inline-block;padding:14px 28px;font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.5px;">
                    Claim your 50% discount
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #f3f4f6;margin:0;" /></td></tr>
        <tr>
          <td style="padding:24px 40px 32px;">
            <p style="margin:0 0 6px;font-size:13px;color:#6b7280;line-height:1.6;">Follow us on <a href="https://www.instagram.com/bluehydradev/" style="color:#7c3aed;text-decoration:none;">Instagram</a> for updates on Cohort 02.</p>
            <p style="margin:0;font-size:12px;color:#9ca3af;">The Bluehydra Team &middot; bluehydralabs.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function generateReferralLinks() {
  if (!SELECTED.length) {
    console.log('Add emails to the SELECTED array first.');
    process.exit(1);
  }

  const applicants = await fetchApplicants();
  const targets = applicants.filter(a => SELECTED.includes(a.email));

  if (!targets.length) {
    console.log('No matching applicants found for the emails in SELECTED.');
    process.exit(0);
  }

  console.log(`Generating referral links for ${targets.length} founders...\n`);

  for (const applicant of targets) {
    const baseSlug = toSlug(applicant.name);
    if (!baseSlug) {
      console.log(`  SKIP  ${applicant.name} — could not generate slug`);
      continue;
    }

    // Check if already in referrers by email
    const existing = await supabaseGet(`referrers?select=slug&email=eq.${encodeURIComponent(applicant.email)}`);
    if (existing.length) {
      const link = `https://bluehydralabs.com/pricing?ref=${existing[0].slug}`;
      console.log(`  SKIP  ${applicant.name} — already has a link: ${link}`);
      continue;
    }

    const slug = await findUniqueSlug(baseSlug);
    const result = await supabasePost('referrers', {
      name: applicant.name,
      email: applicant.email,
      whatsapp: '',
      slug,
    });

    if (result.status === 201) {
      const link = `https://bluehydralabs.com/pricing?ref=${slug}`;
      console.log(`  OK    ${applicant.name} — ${link}`);
    } else {
      console.log(`  ERROR ${applicant.name} — status ${result.status}:`, JSON.stringify(result.body));
    }
  }

  console.log('\nDone.');
}

async function main() {
  const mode = process.argv[2];
  const validModes = ['acknowledge', 'selected', 'not-selected', 'referral-links'];

  if (!validModes.includes(mode)) {
    console.log('Usage: node send-emails.js <acknowledge|selected|not-selected|referral-links>');
    process.exit(1);
  }

  if (mode === 'referral-links') {
    return generateReferralLinks();
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
      const token = await getOrCreateBriefToken(applicant.id);
      const link = `${SITE_URL}/onboarding/${token}`;
      subject = "You're in — Founders' Five, Cohort 01";
      html = selectedHtml(name, link);
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
