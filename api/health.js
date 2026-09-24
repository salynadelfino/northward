/* Setup diagnostic. Visit /api/health in a browser and it reports exactly
 * where the chain is broken, without revealing any secret value.
 *
 * DELETE THIS FILE once the forms are confirmed working — it is a setup aid,
 * not part of the site.
 */

const crypto = require('crypto');

const SHEET_ID = process.env.SHEET_ID;
const SA_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const SA_KEY = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

module.exports = async function handler(req, res) {
  const out = {
    step0_functionIsDeployed: 'yes — you are reading this from the serverless function',
    step1_settingsPresent: {
      SHEET_ID: SHEET_ID ? 'set' : 'MISSING',
      // Shown in full on purpose: it is not a secret (anyone who opens the
      // Sheet's share list can see it), and you need to compare the two.
      GOOGLE_SERVICE_ACCOUNT_EMAIL: SA_EMAIL || 'MISSING',
      GOOGLE_PRIVATE_KEY: SA_KEY ? 'set' : 'MISSING'
    }
  };

  if (!SHEET_ID || !SA_EMAIL || !SA_KEY) {
    out.verdict = 'Add the missing settings in Vercel, then REDEPLOY. New settings do not reach an existing build.';
    return res.status(200).json(out);
  }

  // Step 2 — is the private key actually a key?
  const looksRight = SA_KEY.includes('BEGIN PRIVATE KEY') && SA_KEY.includes('\n');
  out.step2_privateKeyFormat = looksRight
    ? 'looks right'
    : 'WRONG — it should start with -----BEGIN PRIVATE KEY----- and contain line breaks. Re-copy it from the JSON file, keeping the \\n exactly as they appear.';
  if (!looksRight) {
    out.verdict = 'Re-paste GOOGLE_PRIVATE_KEY, then redeploy.';
    return res.status(200).json(out);
  }

  // Step 3 — will Google accept the key?
  let token;
  try {
    const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o))
      .toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const now = Math.floor(Date.now() / 1000);
    const head = b64({ alg: 'RS256', typ: 'JWT' });
    const claim = b64({
      iss: SA_EMAIL, scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token', exp: now + 3600, iat: now
    });
    const sig = b64(crypto.createSign('RSA-SHA256').update(head + '.' + claim).sign(SA_KEY));
    const r = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: head + '.' + claim + '.' + sig
      })
    });
    const j = await r.json();
    if (!j.access_token) throw new Error(j.error_description || j.error || 'no token returned');
    token = j.access_token;
    out.step3_googleAcceptsTheKey = 'yes';
  } catch (e) {
    out.step3_googleAcceptsTheKey = 'NO — ' + String(e.message).slice(0, 200);
    out.verdict = 'Google rejected the credentials. Usually the private key was altered when pasted, or the Google Sheets API is not enabled on the project.';
    return res.status(200).json(out);
  }

  // Step 4 — can it open the Sheet, and are the tabs named correctly?
  try {
    const r = await fetch(
      'https://sheets.googleapis.com/v4/spreadsheets/' + SHEET_ID + '?fields=properties.title,sheets.properties.title',
      { headers: { Authorization: 'Bearer ' + token } }
    );
    const body = await r.text();
    if (!r.ok) {
      out.step4_canOpenTheSheet = 'NO — HTTP ' + r.status;
      out.verdict = r.status === 403
        ? 'The Sheet has not been shared with the service account. Open the Sheet, click Share, paste ' + SA_EMAIL + ' and give it Editor.'
        : r.status === 404
        ? 'No Sheet with that SHEET_ID. Check you copied the code between /d/ and /edit from the Sheet address.'
        : 'Google said: ' + body.slice(0, 200);
      return res.status(200).json(out);
    }
    const data = JSON.parse(body);
    const tabs = (data.sheets || []).map((s) => s.properties.title);
    out.step4_canOpenTheSheet = 'yes — "' + data.properties.title + '"';
    out.step5_tabs = tabs;

    const missing = ['Register', 'Guide'].filter((t) => tabs.indexOf(t) === -1);
    if (missing.length) {
      out.step5_tabNames = 'WRONG — missing a tab named exactly: ' + missing.join(' and ');
      out.verdict = 'Rename your tabs to exactly Register and Guide. Capitals matter and trailing spaces count.';
      return res.status(200).json(out);
    }
    out.step5_tabNames = 'correct';
    out.verdict = 'All good. Submitting a form should now write a row. If it still does not, check Vercel → Logs.';
    return res.status(200).json(out);
  } catch (e) {
    out.step4_canOpenTheSheet = 'NO — ' + String(e.message).slice(0, 200);
    out.verdict = 'Could not reach the Sheet.';
    return res.status(200).json(out);
  }
};
