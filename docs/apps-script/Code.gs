/**
 * Northward Care — automatic emails.
 *
 * Runs inside the Register spreadsheet. Every few minutes it looks for rows
 * that have not had a confirmation sent, emails the person, emails you a
 * summary, and stamps the row so nobody is ever emailed twice.
 *
 * It polls rather than reacting to changes, because Google's onEdit and
 * onChange triggers do NOT fire for rows written by an API — which is how
 * the website writes them. This is the single most confusing thing about
 * automating a Sheet that a program writes to.
 *
 * Setup is in docs/05-register-database.md.
 */

const CONFIG = {
  siteUrl:   'https://northwardcare.com',
  guidePath: '/assets/northward-care-uk-nursing-guide.pdf',

  // Shown as the sender. Must be an address this account can "send mail as"
  // in Gmail settings, or leave blank to send from the account's own address.
  fromAddress: 'hello@northwardcare.com',
  fromName:    'Northward Care',

  // Where your own "someone just registered" alerts go. Blank to turn off.
  notifyInternal: 'hello@northwardcare.com',

  // Turn candidate emails off while you are testing.
  sendCandidateEmails: true,

  // Safety net: never send more than this in one run.
  maxPerRun: 50
};

/** The one function to put on a time-driven trigger. */
function processNewSubmissions() {
  // Two runs overlapping would email people twice. Only one at a time.
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return;

  try {
    const sent = [];
    sent.push.apply(sent, processTab_('Guide', guideEmail_));
    sent.push.apply(sent, processTab_('Register', registerEmail_));
    if (sent.length) notifyInternal_(sent);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Finds unsent rows on a tab, emails them, stamps them.
 * Columns are located by heading, never by position, so adding a column
 * later cannot silently break this.
 */
function processTab_(tabName, buildEmail) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(tabName);
  if (!sheet) {
    Logger.log('No tab named ' + tabName);
    return [];
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
                       .map(function (h) { return String(h).trim(); });

  // Add the bookkeeping column the first time this runs.
  let sentCol = headers.indexOf('confirmationSent') + 1;
  if (!sentCol) {
    sentCol = headers.length + 1;
    sheet.getRange(1, sentCol).setValue('confirmationSent');
    headers.push('confirmationSent');
  }

  const col = function (name) { return headers.indexOf(name) + 1; };
  const emailCol = col('email');
  if (!emailCol) {
    Logger.log('No email column on ' + tabName);
    return [];
  }

  const rows = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  const done = [];

  for (let i = 0; i < rows.length && done.length < CONFIG.maxPerRun; i++) {
    const row = rows[i];
    const rowNumber = i + 2;

    const address = String(row[emailCol - 1] || '').trim();
    if (!address) continue;
    if (String(row[sentCol - 1] || '').trim()) continue;   // already handled

    const person = {
      name: String(row[col('name') - 1] || '').trim(),
      email: address,
      stage: String(row[col('stage') - 1] || '').trim(),
      tab: tabName
    };

    try {
      if (CONFIG.sendCandidateEmails) {
        const mail = buildEmail(person);
        const options = { name: CONFIG.fromName, htmlBody: mail.html };
        if (CONFIG.fromAddress) options.from = CONFIG.fromAddress;
        GmailApp.sendEmail(person.email, mail.subject, mail.text, options);
      }
      sheet.getRange(rowNumber, sentCol).setValue(new Date());
      done.push(person);
    } catch (err) {
      // Stamp the failure so a bad address does not block every later row,
      // and so you can see what happened without reading the logs.
      sheet.getRange(rowNumber, sentCol).setValue('FAILED: ' + err.message);
      Logger.log('Row ' + rowNumber + ' on ' + tabName + ': ' + err.message);
    }
  }

  return done;
}

/* ---------- the emails ---------------------------------------------- */

function firstName_(full) {
  const n = String(full || '').trim().split(/\s+/)[0];
  return n ? n : 'there';
}

function guideEmail_(person) {
  const link = CONFIG.siteUrl + CONFIG.guidePath;
  const text =
    'Hi ' + firstName_(person.name) + ',\n\n' +
    'Here is your copy of The Indian Nurse’s Guide to Working in the UK:\n' +
    link + '\n\n' +
    'It covers the whole journey — NMC registration, the English requirements, ' +
    'the assessments, finding an employer, sponsorship, and what to expect when you arrive.\n\n' +
    'One thing worth knowing: the guide tells you how the journey works, but it ' +
    'cannot tell you when a role that suits you comes up. That is what the ' +
    'Northward Care Register is for, and it takes about five minutes:\n' +
    CONFIG.siteUrl + '/register.html\n\n' +
    'No cost, and no obligation to move before you are ready.\n\n' +
    'Northward Care\n' + CONFIG.siteUrl;

  return {
    subject: 'Your guide to working in the UK',
    text: text,
    html: htmlWrap_(
      'Here is your guide',
      '<p>Hi ' + esc_(firstName_(person.name)) + ',</p>' +
      '<p>Here is your copy of <strong>The Indian Nurse’s Guide to Working in the UK</strong>.</p>' +
      '<p><a class="btn" href="' + link + '">Download the guide</a></p>' +
      '<p>It covers the whole journey — NMC registration, the English requirements, the ' +
      'assessments, finding an employer, sponsorship, and what to expect when you arrive.</p>' +
      '<p>One thing worth knowing: the guide tells you <em>how</em> the journey works, but it ' +
      'cannot tell you <em>when</em> a role that suits you comes up. That is what the Register ' +
      'is for, and it takes about five minutes.</p>' +
      '<p><a href="' + CONFIG.siteUrl + '/register.html">Join the Northward Care Register</a></p>' +
      '<p class="muted">No cost, and no obligation to move before you are ready.</p>')
  };
}

function registerEmail_(person) {
  const text =
    'Hi ' + firstName_(person.name) + ',\n\n' +
    'You are on the Northward Care Register. Thank you for the detail — the more ' +
    'we know about your profile, the better the match when something relevant comes up.\n\n' +
    'What happens next:\n\n' +
    '1. We review your profile. If anything needs clarifying we will ask once.\n' +
    '2. We keep you informed — new guides, and changes worth knowing about.\n' +
    '3. When a live UK role suits you, we get in touch directly.\n\n' +
    'Being straight with you: there may be nothing suitable for a while. That is ' +
    'normal, and we would rather say so than invent something to keep you engaged. ' +
    'You stay on the Register either way.\n\n' +
    'If you have not read it yet, the free guide covers the whole journey:\n' +
    CONFIG.siteUrl + '/guide.html\n\n' +
    'Northward Care\n' + CONFIG.siteUrl;

  return {
    subject: 'You’re on the Northward Care Register',
    text: text,
    html: htmlWrap_(
      'You’re on the Register',
      '<p>Hi ' + esc_(firstName_(person.name)) + ',</p>' +
      '<p>You are on the Northward Care Register. Thank you for the detail — the more we ' +
      'know about your profile, the better the match when something relevant comes up.</p>' +
      '<h3>What happens next</h3>' +
      '<ol>' +
      '<li>We review your profile. If anything needs clarifying, we will ask once.</li>' +
      '<li>We keep you informed — new guides, and changes worth knowing about.</li>' +
      '<li>When a live UK role suits you, we get in touch directly.</li>' +
      '</ol>' +
      '<p>Being straight with you: there may be nothing suitable for a while. That is normal, ' +
      'and we would rather say so than invent something to keep you engaged. You stay on the ' +
      'Register either way.</p>' +
      '<p>If you have not read it yet, the free guide covers the whole journey.</p>' +
      '<p><a class="btn" href="' + CONFIG.siteUrl + '/guide.html">Get the free guide</a></p>')
  };
}

/* ---------- your own alert ------------------------------------------- */

function notifyInternal_(people) {
  if (!CONFIG.notifyInternal) return;

  const lines = people.map(function (p) {
    return '• ' + (p.name || '(no name)') + ' — ' + p.email +
           ' — ' + p.tab + (p.stage ? ' — ' + p.stage : '');
  });

  const subject = people.length === 1
    ? 'New ' + people[0].tab.toLowerCase() + ' submission: ' + (people[0].name || people[0].email)
    : people.length + ' new submissions';

  GmailApp.sendEmail(CONFIG.notifyInternal, subject,
    lines.join('\n') + '\n\n' + SpreadsheetApp.getActive().getUrl(),
    { name: 'Northward Care' });
}

/* ---------- shared bits ---------------------------------------------- */

function esc_(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function htmlWrap_(title, body) {
  return '<!doctype html><html><body style="margin:0;background:#F7F5F0;padding:28px 16px">' +
    '<div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #E3E6E3;' +
    'border-radius:10px;padding:32px;font:16px/1.6 Helvetica,Arial,sans-serif;color:#16201E">' +
    '<p style="font:600 13px Helvetica,Arial,sans-serif;letter-spacing:.14em;' +
    'text-transform:uppercase;color:#0F6F5C;margin:0 0 14px">Northward Care</p>' +
    '<h1 style="font:700 24px Helvetica,Arial,sans-serif;color:#0A3B33;margin:0 0 18px">' +
    esc_(title) + '</h1>' +
    body.replace(/class="btn"/g,
      'style="display:inline-block;background:#0F6F5C;color:#fff;text-decoration:none;' +
      'font-weight:600;padding:13px 24px;border-radius:8px"') +
    '<p style="margin-top:28px;padding-top:18px;border-top:1px solid #E3E6E3;' +
    'font-size:13px;color:#77837F">Northward Care publishes general information about NMC ' +
    'registration and UK immigration rules. It is not immigration advice. ' +
    'Reply to this email if you would like us to remove your details.</p>' +
    '</div></body></html>';
}

/** Run once by hand to check your setup before turning the trigger on. */
function testSendToMyself() {
  const me = Session.getActiveUser().getEmail();
  const mail = guideEmail_({ name: 'Test Person', email: me });
  const options = { name: CONFIG.fromName, htmlBody: mail.html };
  if (CONFIG.fromAddress) options.from = CONFIG.fromAddress;
  GmailApp.sendEmail(me, '[test] ' + mail.subject, mail.text, options);
  Logger.log('Sent a test to ' + me);
}
