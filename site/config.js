/* Northward Care — the only file that changes at go-live.

   The endpoint is a serverless function on this same domain (/api/submit),
   so there is no cross-origin request, no CORS to configure, and no API key
   in the browser. Credentials live in Vercel's environment variables. */
window.NORTHWARD = {

  // Leave blank to keep both forms in preview mode: they validate and show
  // the success state, but send nothing, and say so. See docs/06-go-live.md.
  endpoint: '/api/submit',

  // The guide file, relative to the site root. Must match the file in
  // site/assets exactly — Vercel serves from Linux, so case matters.
  guideFile: 'assets/Northward-Care-Indian-Nurses-Guide-to-Working-in-the-UK.pdf',

  // Anything submitted faster than this is a bot, not a nurse.
  minSeconds: 3
};
