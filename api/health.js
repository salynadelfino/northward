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
    // Strings and objects only — a Buffer here would be JSON-stringified
    // rather than encoded from its bytes. See api/submit.js.
    const b64 = (o) => {
      if (Buffer.isBuffer(o)) throw new TypeError('b64() takes a string or an object, not a Buffer');
      return Buffer.from(typeof o === 'string' ? o : JSON.stringify(o))
        .toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };
    const now = Math.floor(Date.now() / 1000);
    const head = b64({ alg: 'RS256', typ: 'JWT' });
    const claim = b64({
      iss: SA_EMAIL, scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token', exp: now + 3600, iat: now
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
    if (!j.access_token) throw new Error(j.error_description || j.error || 'no token returned');
    token = j.access_token;
    out.step3_googleAcceptsTheKey = 'yes';
  } catch (e) {
    out.step3_googleAcceptsTheKey = 'NO — ' + String(e.message).slice(0, 200);

    // "Invalid JWT Signature" means Google found the account but the
    // signature did not verify. Google publishes each service account's
    // public certificates, so we can say for certain whether this private
    // key belongs to this email.
    try {
      const mine = crypto.createPublicKey(SA_KEY).export({ type: 'spki', format: 'pem' });
      const r = await fetch('https://www.googleapis.com/service_accounts/v1/metadata/x509/' +
                            encodeURIComponent(SA_EMAIL));
      if (r.ok) {
        const certs = await r.json();
        const ids = Object.keys(certs);
        const matches = ids.some((id) => {
          try {
            return crypto.createPublicKey(certs[id]).export({ type: 'spki', format: 'pem' }) === mine;
          } catch (err) { return false; }
        });
        out.step3a_keyBelongsToThisAccount = matches ? 'yes' : 'NO';
        out.step3b_keysGoogleHoldsForThisAccount = ids.length;
        out.verdict = matches
          ? 'The key does belong to this account, so the signature failure is something else — check the server clock or try a freshly downloaded key.'
          : 'MISMATCH. This private key was not issued to ' + SA_EMAIL + '. The two settings have come from different JSON files, or this key has been deleted in Google. Fix: create a new JSON key for that service account, then re-paste BOTH GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY from that one file, and redeploy.';
      } else if (r.status === 404) {
        out.step3a_keyBelongsToThisAccount = 'cannot check — Google has no record of ' + SA_EMAIL;
        out.verdict = 'That service account email does not exist. Re-copy client_email from the JSON key file.';
      } else {
        out.verdict = 'Google rejected the credentials. Re-download the JSON key and re-paste both values from it.';
      }
    } catch (inner) {
      out.step3a_keyBelongsToThisAccount = 'cannot check — the private key will not parse: ' + String(inner.message).slice(0, 120);
      out.verdict = 'The private key value is damaged. Re-paste it from the JSON file, keeping it exactly as it appears.';
    }
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
