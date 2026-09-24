/* Northward Care — form submissions.
 *
 * Runs on Vercel at /api/submit, i.e. the same origin as the site, so there
 * is no CORS to configure and nothing for a browser to block. Appends one row
 * to a Google Sheet.
 *
 * Zero dependencies on purpose: the Google service-account JWT is signed with
 * node:crypto and the Sheets REST API is called with fetch. No node_modules,
 * fast cold starts, nothing to keep patched.
 *
 * Environment variables (Vercel → Settings → Environment Variables):
 *   SHEET_ID                      the id from the sheet's URL
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL  ...@....iam.gserviceaccount.com
 *   GOOGLE_PRIVATE_KEY            the private_key from the JSON key file
 *   NOTIFY_WEBHOOK                optional — a Chat/Slack webhook for alerts
 */

const crypto = require('crypto');

const SHEET_ID = process.env.SHEET_ID;
const SA_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
// Vercel stores newlines escaped; restore them or the key will not parse.
const SA_KEY = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

/* Column order per tab. Append only — never reorder, or historic rows shift
   under their headings. Adding a column means adding it at the end here and
   in the sheet. */
const TABS = {
  register: {
    tab: 'Register',
    columns: ['submittedAt','name','email','whatsapp','state','qualification','institution',
              'gradyear','homereg','experience','speciality','employer','stage','english',
              'scores','nmc','timeframe','setting','locations','consent','consentPrivacy',
              'consentWording','status','utm_source','utm_medium','utm_campaign','referrer','page']
  },
  guide: {
    tab: 'Guide',
    columns: ['submittedAt','name','email','phone','stage','status',
              'utm_source','utm_medium','utm_campaign','referrer','page']
  }
};

const REQUIRED = {
  register: ['name','email','whatsapp','state','qualification','gradyear','homereg',
             'experience','stage','english','nmc','timeframe'],
  guide: ['name','email','stage']
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const MAX_FIELD = 2000;

let cachedToken = null; // survives warm invocations

async function accessToken() {
  if (cachedToken && cachedToken.expires > Date.now() + 60000) return cachedToken.value;

  // Strings and objects only. A Buffer passed here would be JSON-stringified
  // into '{"type":"Buffer","data":[...]}' rather than encoded from its bytes,
  // which is how the signature silently became invalid. Sign with
  // .sign(key, 'base64url') instead of routing the Buffer through here.
  const b64 = (o) => {
    if (Buffer.isBuffer(o)) throw new TypeError('b64() takes a string or an object, not a Buffer');
    return Buffer.from(typeof o === 'string' ? o : JSON.stringify(o))
      .toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const now = Math.floor(Date.now() / 1000);
  const head = b64({ alg: 'RS256', typ: 'JWT' });
  const claim = b64({
    iss: SA_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  });
  // sign() returns a Buffer. It must be base64url-encoded from its bytes —
    // passing it through the JSON-based b64() helper encodes the string
    // '{"type":"Buffer","data":[...]}' instead, which Google rejects as an
    // invalid signature while every other part of the request looks correct.
    const sig = crypto.createSign('RSA-SHA256').update(head + '.' + claim).sign(SA_KEY, 'base64url');

  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: head + '.' + claim + '.' + sig
    })
  });
  const j = await r.json();
  if (!j.access_token) throw new Error('Google token failed: ' + JSON.stringify(j).slice(0, 300));

  cachedToken = { value: j.access_token, expires: Date.now() + (j.expires_in - 120) * 1000 };
  return cachedToken.value;
}

async function appendRow(tab, values) {
  const token = await accessToken();
  const url = 'https://sheets.googleapis.com/v4/spreadsheets/' + SHEET_ID +
              '/values/' + encodeURIComponent(tab + '!A1') +
              ':append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS';
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [values] })
  });
  if (!r.ok) throw new Error('Sheets append failed: ' + r.status + ' ' + (await r.text()).slice(0, 300));
}

async function notify(text) {
  if (!process.env.NOTIFY_WEBHOOK) return;
  try {
    await fetch(process.env.NOTIFY_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
  } catch (e) { /* a failed notification must never fail a submission */ }
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

    // The honeypot. Accept the request so the bot sees success, store nothing.
    if (body.website) return res.status(200).json({ ok: true });

    const spec = TABS[body.source];
    if (!spec) return res.status(400).json({ error: 'Unknown source' });

    // Trim and cap everything before it can reach a cell.
    const clean = {};
    for (const [k, v] of Object.entries(body)) {
      clean[k] = typeof v === 'string' ? v.trim().slice(0, MAX_FIELD) : v;
    }

    const missing = REQUIRED[body.source].filter((f) => !clean[f]);
    if (missing.length) return res.status(400).json({ error: 'Missing required fields', fields: missing });
    if (!EMAIL_RE.test(clean.email)) return res.status(400).json({ error: 'Invalid email' });

    // No consent, no record. This is the whole lawful basis.
    if (body.source === 'register' && clean.consent !== true) {
      return res.status(400).json({ error: 'Consent is required' });
    }

    clean.submittedAt = new Date().toISOString();
    clean.status = 'New';
    // Store the wording the person was actually shown, not a pointer to it.
    if (body.source === 'register' && !clean.consentWording) {
      clean.consentWording = 'Add me to the Northward Care Register, and contact me about UK roles that suit my profile.';
    }

    // A leading apostrophe or = would be read as a formula by Sheets.
    const row = spec.columns.map((c) => {
      const v = clean[c];
      if (v === undefined || v === null) return '';
      const s = typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v);
      return /^[=+\-@]/.test(s) ? "'" + s : s;
    });

    await appendRow(spec.tab, row);
    await notify('New ' + body.source + ' submission: ' + clean.name + ' (' + clean.email + ')');

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('submit failed:', err && err.message);
    return res.status(500).json({ error: 'Could not save that. Please try again.' });
  }
};
