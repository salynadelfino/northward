/* Northward Care — the only file that changes at go-live.
   Everything else is static and needs no edits. */
window.NORTHWARD = {

  // Paste the "HTTP POST URL" from each Power Automate flow trigger.
  // Leave blank and the form stays in preview mode: it validates and shows
  // the success state, but sends nothing. See docs/06-go-live.md.
  registerEndpoint: '',
  guideEndpoint:    '',

  // The file the guide download points at, relative to the site root.
  guideFile: 'assets/northward-care-uk-nursing-guide.pdf',

  // Anything submitted faster than this is a bot, not a nurse.
  minSeconds: 3
};
