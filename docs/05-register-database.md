# 05 — Where submissions go

```
northwardcare.com  →  /api/submit  →  Google Sheet
  (Vercel static)      (Vercel function)   (Northward Workspace)
```

Both forms post to **one endpoint on your own domain**. The function validates,
then appends a row to a Google Sheet. The `source` field decides which tab.

Because `/api/submit` is the same origin as the site, there is no CORS to
configure — which removes the single most common way this kind of setup
silently fails.

---

## Google Sheets or Supabase?

**Google Sheets. You do not need Supabase.**

| | Google Sheets | Supabase |
|---|---|---|
| Setup | An hour | A day, plus schema migrations |
| Charlie can work in it directly | Yes | No — SQL or a dashboard |
| Filter, sort, pivot, share a view | Native | Build it |
| Cost at your volume | Free | Free tier, then paid |
| Practical ceiling | Fine to ~50,000 rows | Millions |
| Concurrent editing | Fine | N/A |
| Relational integrity | None | Proper |

You are collecting a few hundred to a few thousand nurse profiles a year, and
the people working them live in spreadsheets. Sheets wins on every axis that
matters right now, and the API is stable enough that moving later is a day's
work, not a rewrite.

**Move to Supabase when** you outgrow one of these, not before:
- more than roughly 20,000 rows and filtering gets slow
- you need real relationships — a candidate with many applications to many
  employers, with history
- you need per-record access control finer than "who can open the sheet"
- you want employers logging in to see shortlists

The function is the seam. Swapping `appendRow()` for a Supabase insert is
about fifteen lines, and nothing on the website changes.

**Why not a Google Form?** It cannot do the three-step flow, it cannot be
styled, it breaks the page-to-page feel, and it puts a Google-branded page in
the middle of your funnel. The form you have is better and already built.

---

## Step 1 — The Sheet

In the new Northward Google Workspace, as an account you control (not a
personal one):

1. Create a spreadsheet: **Northward Care — Register**
2. Rename `Sheet1` to **`Register`**, then add a second tab, **`Guide`**.
   The names are case-sensitive and must match exactly.
3. Paste the header rows from `docs/sheet-headers.csv` across row 1 of each
   tab. Fastest way: copy the comma-separated line, paste into A1, then
   **Data → Split text to columns**.
4. **View → Freeze → 1 row.**
5. Format the `submittedAt` column as date-time.

Two tabs rather than one because the field sets barely overlap — a guide row
carried through the Register's 28 columns would be 20 blank cells of noise.
The Register tab is the one that gets worked.

### The columns

Taken straight from `api/submit.js`, which is the source of truth. **Append
only.** Reordering columns makes every historic row shift under the wrong
heading, silently.

| Column | Notes |
|---|---|
| `submittedAt` | Set by the server, not the browser. Do not let anyone edit it. |
| `name` `email` `whatsapp` `state` | WhatsApp stored with country code. |
| `qualification` … `employer` | The professional profile. |
| `stage` `english` `scores` `nmc` `timeframe` | Readiness. `scores` is text — requirements are assessed per component, and a single overall figure hides the one that failed. |
| `setting` `locations` | Preferences. Not binding, a filter hint. |
| `consent` `consentPrivacy` | `consent` false never reaches the sheet; the function rejects it. `consentPrivacy` records agreement to the privacy notice. |
| `consentWording` | The exact words shown at submission. Evidence, not decoration — if the wording changes, old rows keep what they were actually shown. |
| `status` | The only column staff change daily. Defaults to `New`. |
| `utm_*` `referrer` `page` | Where they came from. This is how you learn which post produced which nurse. |

### Status values

`New → Reviewing → Qualified → Introduced → Placed`, plus `On hold`,
`Not suitable`, `Removed`. Set it as a dropdown: select the column →
**Data → Data validation → Dropdown**.

### Views that do the work

Sheets has no saved views, so use **filter views** (Data → Create a filter
view) — they are per-person and do not disturb anyone else's screen.

| Filter view | Filter | When |
|---|---|---|
| New this week | `status = New` | Daily |
| Ready now | `status = Qualified` and `stage` starts "Ready now" | Matching against live roles |
| Preparing | `status = Qualified` and `stage` starts "Preparing" | The nurture list |
| Gone quiet | `status = Qualified`, contacted over 90 days ago | Monthly — this is how registers die |
| Outside India | `state = Outside India` | Weekly. A targeting check, not a lead list. |
| Due for deletion | `submittedAt` older than the retention period | Monthly, non-negotiable |
| Guide only | on the Guide tab | The people to invite onto the Register |

Add a `lastContacted` column by hand at the end when you start working the
list — the function ignores columns it does not know about.

---

> **If your Sheet already exists:** the Register now captures agreement to the
> privacy notice rather than a marketing opt-in. Rename the one header cell
> `consent_updates` to **`consentPrivacy`** on the Register tab. It is the same
> column in the same position, so nothing else moves and existing rows stay put.

## Step 2 — Service account

The function needs to write to the sheet without a human signed in.

1. [console.cloud.google.com](https://console.cloud.google.com) → create a
   project, **Northward Care**.
2. **APIs & Services → Library → Google Sheets API → Enable.**
3. **APIs & Services → Credentials → Create credentials → Service account.**
   Name it `northward-forms`. No roles needed — access comes from sharing the
   sheet, not from IAM.
4. Open the service account → **Keys → Add key → Create new key → JSON.**
   Download it. This file is a password; do not commit it or email it.
5. Open the Sheet → **Share** → paste the service account's email
   (`northward-forms@….iam.gserviceaccount.com`) → **Editor** → uncheck
   "Notify people" → Share.

That last step is the one people miss. Without it every write returns 403.

---

## Step 3 — Environment variables

Vercel → your project → **Settings → Environment Variables**. Add to
Production, Preview and Development:

| Name | Value |
|---|---|
| `SHEET_ID` | The long id in the sheet's URL, between `/d/` and `/edit` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `client_email` from the JSON key |
| `GOOGLE_PRIVATE_KEY` | `private_key` from the JSON key — **paste it whole**, including the BEGIN/END lines |
| `NOTIFY_WEBHOOK` | Optional. A Google Chat or Slack incoming webhook. |

On the private key: the JSON file has it with `\n` escapes. Paste it exactly
as it appears there, quotes and all if that is what you copy. The function
converts `\n` back to real newlines. If you get
`error:1E08010C:DECODER routines::unsupported`, the newlines are the problem.

Redeploy after adding variables — Vercel does not apply them to an existing
build.

---

## Step 4 — Automatic emails

The website writes the row. A script attached to the Sheet sends the emails —
one to the person who filled the form, one to you.

It lives in the repo at **`docs/apps-script/Code.gs`** so it is version
controlled rather than only existing inside Google.

### Why a script on the Sheet, and not the website

Sending from `hello@northwardcare.com` needs an account that owns that
address. The Vercel function has no Google identity of its own, so it would
need either domain-wide delegation (fiddly) or a third-party sending service
(another vendor, another set of DNS records). A script running inside your
Workspace just sends, as you.

### The trap that costs people an afternoon

**Google's `onEdit` and `onChange` triggers do not fire for rows written by an
API.** They only respond to a person typing in the Sheet. Since the website
writes through the Sheets API, an `onChange` trigger sits there doing nothing
and looks broken.

So the script **polls**: it runs every few minutes, finds rows that have not
been emailed yet, emails them, and stamps a `confirmationSent` column so
nobody is ever emailed twice. That column is created automatically the first
time it runs.

### Setting it up

1. Open the Sheet → **Extensions → Apps Script**
2. Delete whatever is in `Code.gs` and paste in the contents of
   `docs/apps-script/Code.gs`
3. Edit the `CONFIG` block at the top — the site address, and where your own
   alerts should go
4. **Save**, then choose `testSendToMyself` from the function dropdown and
   click **Run**. Approve the permissions when asked. Check your inbox.
5. When that looks right: **Triggers** (the clock icon) → **Add trigger**
   - Function: `processNewSubmissions`
   - Event source: **Time-driven**
   - Type: **Minutes timer**, every **5 minutes**
6. Submit a form on the live site and wait a few minutes

Every minute is allowed if you want it faster. Five is plenty — the guide
downloads instantly anyway, so the email is a follow-up rather than the
delivery.

### Sending from hello@ rather than your own address

By default the email comes from whichever account owns the script. To send as
`hello@northwardcare.com`:

1. Gmail → **Settings → Accounts → Send mail as → Add another email address**
2. Add `hello@northwardcare.com` and verify it (you need to be able to receive
   at that address — if it is a Group, make sure you are a member)
3. Leave `fromAddress` in `CONFIG` set to it

If verification is not possible, blank out `fromAddress` and emails go from
your own address. Not ideal, but it works from day one.

### What the emails say

**Guide** — the download link again (people lose the browser download),
what is inside, and a nudge towards the Register.

**Register** — confirmation, three numbered steps for what happens next, and
an honest line that there may be nothing suitable for a while. That last part
is deliberate: it is the same promise the site makes, and breaking it in the
first email would undo the thing the whole brand is built on.

Both carry the standing disclaimer and a line about how to be removed.

**Your own alert** batches whatever came in during that run, so five
submissions in five minutes is one email rather than five.

### If something goes wrong

A row that fails gets `FAILED: <reason>` written into `confirmationSent`
rather than being left blank. That way one bad address cannot block every row
behind it, and you can see what happened in the Sheet without opening the
script logs.

Gmail on Workspace allows around 1,500 recipients a day, which is far beyond
anything this will reach.

## The weekly rhythm

| When | What | How long |
|---|---|---|
| Daily | Work **New this week** — check plausibility, set `status` | 15 min |
| Weekly | Review **Ready now** against live employer requirements | 30 min |
| Monthly | Work **Gone quiet** — send the update even when there is no role | 30 min |
| Monthly | Work **Due for deletion**. Actually delete. | 10 min |
| Quarterly | Re-check every rule stated on the site against the NMC and GOV.UK | 1 hour |

A register nobody contacts decays in about three months. The monthly update is
not marketing; it is what keeps the asset alive.

---

## Data protection

- **Access**: share the Sheet with named people only. Never "anyone with the
  link", not even view-only — it holds names, contact details and career
  histories of identifiable people.
- **Retention**: set the period, then let the *Due for deletion* view enforce
  it. A period nobody acts on is worse than none.
- **Deletion requests**: delete the row, and empty the Sheet's trash. Rows sit
  recoverable otherwise, which is still holding the data.
- **Formula injection** is handled — the function prefixes anything starting
  `=`, `+`, `-` or `@` with an apostrophe, so a submitted `=HYPERLINK(...)`
  lands as text rather than executing in your spreadsheet.
- **CVs** are not collected by the function. The upload field is on the form
  but files are not sent; ask for a CV by email once someone is being
  reviewed. Handling uploads properly needs storage and virus scanning, and it
  is not worth it for a field most people skip.
