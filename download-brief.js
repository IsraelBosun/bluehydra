const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

require('fs').readFileSync('.env.local','utf8').split('\n').forEach(line=>{const[k,...r]=line.split('=');if(k&&r.length)process.env[k.trim()]=r.join('=').trim();});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function get(reqUrl, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(reqUrl, { headers }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

function download(fileUrl, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(fileUrl, res => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        file.close();
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', e => { fs.unlink(dest, () => {}); reject(e); });
  });
}

function signedUrl(storagePath) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ expiresIn: 86400 });
    const encoded = storagePath.split('/').map(encodeURIComponent).join('/');
    const reqUrl = new URL(`${SUPABASE_URL}/storage/v1/object/sign/founders_five_briefs/${encoded}`);
    const options = {
      hostname: reqUrl.hostname,
      path: reqUrl.pathname,
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(d);
          resolve(json.signedURL ? `${SUPABASE_URL}/storage/v1${json.signedURL}` : null);
        } catch { resolve(null); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const token = process.argv[2];
  if (!token) { console.log('Usage: node download-brief.js <token>'); process.exit(1); }

  const raw = await get(
    `${SUPABASE_URL}/rest/v1/founders_five_briefs?token=eq.${token}&select=*,founders_five_applications(*)`,
    { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  );
  const [brief] = JSON.parse(raw);
  if (!brief) { console.log('Brief not found.'); process.exit(1); }

  const app = brief.founders_five_applications || {};
  const folderName = (app.business_name || app.name || token).replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_');
  const outDir = path.join('downloads', folderName);
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(path.join(outDir, 'photos'), { recursive: true });
  fs.mkdirSync(path.join(outDir, 'products'), { recursive: true });

  // ── Text summary ──────────────────────────────────────────────────────────
  const lines = [
    `BRIEF SUMMARY — ${app.business_name || ''}`,
    `Submitted: ${brief.submitted_at}`,
    '',
    '── APPLICANT ────────────────────────────',
    `Name:           ${app.name || '—'}`,
    `Email:          ${app.email || '—'}`,
    `WhatsApp:       ${app.whatsapp || '—'}`,
    '',
    '── ABOUT ────────────────────────────────',
    `Description:    ${brief.business_description || '—'}`,
    `Ideal customer: ${brief.ideal_customer || '—'}`,
    `Top goals:      ${brief.top_goals || '—'}`,
    `Differentiator: ${brief.differentiator || '—'}`,
    '',
    '── INSPIRATION ──────────────────────────',
    ...((() => { try { return JSON.parse(brief.sites_liked) } catch { return brief.sites_liked || [] } })().map((s, i) => `Site ${i+1}: ${s.url || '—'} — ${s.why || '—'}`)),
    '',
    '── BRAND ────────────────────────────────',
    `Has logo:       ${brief.has_logo === true ? 'Yes' : brief.has_logo === false ? 'No' : '—'}`,
    `Colours:        ${brief.brand_colors_choice === 'have' ? brief.brand_colors_description : brief.brand_colors_choice === 'pick' ? 'Pick for them' : '—'}`,
    '',
    '── CONTENT ──────────────────────────────',
    `About:          ${brief.about_business || '—'}`,
    `E-commerce:     ${brief.has_catalogue === true ? 'Yes' : brief.has_catalogue === false ? 'No' : '—'}`,
    `Services:       ${brief.services_products || '—'}`,
    `Testimonials:   ${brief.testimonials_text || '—'}`,
    '',
    '── CONTACT ──────────────────────────────',
    `Phone:          ${brief.phone || '—'}`,
    `Email:          ${brief.email || '—'}`,
    `WhatsApp:       ${brief.whatsapp || '—'}`,
    `Address:        ${brief.online_only ? 'Online only' : (brief.address || '—')}`,
    `Hours:          ${brief.hours || '—'}`,
    `Instagram:      ${brief.instagram || '—'}`,
    `Facebook:       ${brief.facebook || '—'}`,
    `LinkedIn:       ${brief.linkedin || '—'}`,
    `TikTok:         ${brief.tiktok || '—'}`,
    `Twitter:        ${brief.twitter || '—'}`,
    `YouTube:        ${brief.youtube || '—'}`,
    `Other social:   ${brief.other_social || '—'}`,
    '',
    '── ANYTHING ELSE ────────────────────────',
    brief.other_requests || '—',
  ];

  if (brief.has_catalogue && brief.products?.length) {
    lines.push('', '── PRODUCTS ─────────────────────────────');
    brief.products.forEach((p, i) => {
      if (p.name || p.price || p.description) {
        lines.push(`Product ${i+1}: ${p.name || '—'} | ${p.price || '—'} | ${p.description || '—'}`);
      }
    });
  }

  fs.writeFileSync(path.join(outDir, 'brief.txt'), lines.join('\n'), 'utf8');
  console.log('✓ brief.txt written');

  // ── Files ────────────────────────────────────────────────────────────────
  const filePaths = [
    brief.logo_url        && { path: brief.logo_url,        dest: path.join(outDir, 'logo' + path.extname(brief.logo_url)) },
    brief.brand_guide_url && { path: brief.brand_guide_url, dest: path.join(outDir, 'brand_guide' + path.extname(brief.brand_guide_url)) },
    ...(brief.photo_urls || []).map((p, i) => ({ path: p, dest: path.join(outDir, 'photos', `photo_${i+1}${path.extname(p)}`) })),
    ...(brief.testimonial_urls || []).map((p, i) => ({ path: p, dest: path.join(outDir, `testimonial_${i+1}${path.extname(p)}`) })),
    ...(brief.products || []).flatMap((prod, pi) =>
      (prod.photo_urls || []).map((p, fi) => ({ path: p, dest: path.join(outDir, 'products', `product_${pi+1}_photo_${fi+1}${path.extname(p)}`) }))
    ),
  ].filter(Boolean);

  for (const f of filePaths) {
    try {
      const signed = await signedUrl(f.path);
      if (!signed) { console.log(`✗ Could not sign: ${f.path}`); continue; }
      await download(signed, f.dest);
      console.log(`✓ ${path.basename(f.dest)}`);
    } catch (e) {
      console.log(`✗ Failed: ${f.path} — ${e.message}`);
    }
  }

  console.log(`\nAll done. Files saved to: ${outDir}`);
}

main();
