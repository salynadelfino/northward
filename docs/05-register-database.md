# 05 — The Register: building the database

The Register is the asset. The website is how people reach it.

Everything below assumes Microsoft 365, because that is what you already run.
No new subscription, no new supplier, no data leaving the tenant.

---

## The shape

```
Website form  →  Power Automate  →  Microsoft List  →  Excel / views
(northwardcare.com)   (validates,      (the Register,      (weekly review)
                       de-dupes,        on SharePoint)
                       emails)
```

**Microsoft List on SharePoint**, not an Excel file. The difference matters:

| | Excel on SharePoint | Microsoft List |
|---|---|---|
| Two people editing at once | Conflicts, lost rows | Fine |
| Per-record permissions | No | Yes |
| Version history per record | No | Yes |
| Attachments (CVs) | Awkward | Built in |
| Power Automate writes | Fragile — breaks on a moved column | Stable |
| Views per stage | Manual filters | Saved views |

You can still open a List in Excel whenever you want to pivot something. You
cannot turn an Excel file into a List once four people have edited it.

**Why not Airtable, Notion or a CRM?** Because the data is UK-and-India
personal data belonging to overseas nationals, and keeping it inside the
tenant you already have a DPA for is a much shorter compliance conversation.
Revisit at a few thousand records, not before.

---

## Step 1 — Create the list

1. SharePoint → your Northward Care site → **New → List → Blank list**
2. Name it **Northward Register**
3. Settings → **List settings → Versioning settings** → turn item version
   history **on**. This is how you evidence what a record said and when.
4. Settings → **Advanced settings → Attachments: Enabled** (for CVs)

## Step 2 — Add the columns

`docs/register-schema.csv` is the full schema — 34 columns, with type,
required flag and choices. Two ways in:

- **By hand**, following the CSV. Takes about 40 minutes and you will
  understand the list afterwards.
- **From Excel**: open the CSV, make a one-row sheet with the column names as
  headers, format as a table, then SharePoint → **New → List → From Excel**.
  Faster, but check every column type afterwards — it guesses, and it guesses
  Number for `YearOfQualification` and Text for the choice fields.

Three things to get right, because they are painful to change later:

- **Title** is mandatory in every List and cannot be removed. Map the
  candidate's full name to it, so the list reads properly.
- **Choice columns** must not allow "fill-in" values. One free-typed
  "Kerela" and your filters stop working.
- **EnglishScores is text, never a number.** Requirements are assessed per
  component; a single overall figure hides the component that failed.

## Step 3 — Views that do the daily work

Create these as saved views. They are the whole operating rhythm.

| View | Filter | Who uses it |
|---|---|---|
| **New this week** | `Status = New` | Daily triage |
| **To qualify** | `Status = Reviewing` | Daily |
| **Ready now** | `Status = Qualified` AND `Stage = Ready now` | Matching against live roles |
| **Preparing** | `Status = Qualified` AND `Stage = Preparing` | The nurture list |
| **Gone quiet** | `LastContacted` older than 90 days AND `Status = Qualified` | Monthly. This is how registers die. |
| **Outside India** | `State = Outside India` | Weekly. A targeting check, not a lead list. |
| **Due for deletion** | `RetentionReviewDate` on or before today | Monthly, and non-negotiable |
| **Guide only** | `Source = guide` | The people to invite onto the Register |

Group **Ready now** by `Speciality`, then by `Experience`. That is the view
you will actually open when an employer says "two ICU nurses, 2+ years".

---

## Step 4 — The flows

Three flows in Power Automate. Build them in this order.

### Flow 1 — Register submission (the important one)

**Trigger:** *When an HTTP request is received*

Request body JSON schema — paste this into the trigger:

```json
{ "type": "object", "properties": {
  "source": {"type":"string"}, "submittedAt": {"type":"string"},
  "name": {"type":"string"}, "email": {"type":"string"},
  "whatsapp": {"type":"string"}, "state": {"type":"string"},
  "qualification": {"type":"string"}, "institution": {"type":"string"},
  "gradyear": {"type":"string"}, "homereg": {"type":"string"},
  "experience": {"type":"string"}, "speciality": {"type":"string"},
  "employer": {"type":"string"}, "stage": {"type":"string"},
  "english": {"type":"string"}, "scores": {"type":"string"},
  "nmc": {"type":"string"}, "timeframe": {"type":"string"},
  "setting": {"type":"string"}, "locations": {"type":"string"},
  "consent": {"type":"boolean"}, "consent_updates": {"type":"boolean"},
  "utm_source": {"type":"string"}, "utm_medium": {"type":"string"},
  "utm_campaign": {"type":"string"}, "referrer": {"type":"string"},
  "page": {"type":"string"}
}}
```

Then:

1. **Condition** — `consent` is `true`. If false, respond 200 and stop. No
   consent, no record.
2. **Get items** on the list, filter `Email eq '<email>'`, top 1. If a record
   exists, **update** it rather than creating a second one. Duplicates are the
   single most common way a register turns into a mess.
3. **Create item** (or update) — map every field. Set `Status` to `New`,
   `ConsentWording` to the exact text the form displayed, and
   `RetentionReviewDate` to `addDays(utcNow(), <retention days>)`.
4. **Send an email (V2)** to the candidate from `hello@northwardcare.com`:
   confirm they are on the Register, say what happens next, and say honestly
   that it may be a while.
5. **Post to Teams** in your Northward channel so someone sees it the same day.
6. **Response** — status 200. The website is waiting on this.

**Set the trigger's response before you test.** A flow with no Response action
leaves the form spinning for 30 seconds.

**CORS:** the Response action needs these headers, or the browser silently
discards the reply:

```
Access-Control-Allow-Origin: https://northwardcare.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

Add a parallel branch at the top: if the request method is `OPTIONS`, respond
200 with those headers and stop. Browsers send that preflight before the POST.

### Flow 2 — Guide download

Same trigger, four fields (`name`, `email`, `phone`, `stage`). Write to the
same list with `Source = guide` and `Status = New`, and email the guide as an
attachment as well — some people fill the form on a phone, lose the download
in their browser, and never come back.

Keep guide records in the same list, not a second one. One person, one row,
whichever door they came through.

### Flow 3 — Weekly digest

Scheduled, Monday morning. Counts by `Status`, by `Stage` and by `UtmSource`,
emailed to you. Five minutes to build and it is the only reporting you need
for the first six months.

---

## Step 5 — The weekly rhythm

| When | What | How long |
|---|---|---|
| Daily | Work **New this week**: check plausibility, chase a missing CV once, set `Status` | 15 min |
| Weekly | Review **Ready now** against live employer requirements | 30 min |
| Monthly | Work **Gone quiet** — send the update even when there is no role | 30 min |
| Monthly | Work **Due for deletion**. Actually delete. | 10 min |
| Quarterly | Re-check every rule stated on the site against the NMC and GOV.UK | 1 hour |

A register that is not contacted decays in about three months. The monthly
update is not marketing; it is what keeps the asset alive.

---

## Data protection, concretely

- **Retention**: set the period, then let the *Due for deletion* view enforce
  it. A period you do not act on is worse than no period at all.
- **Consent evidence**: `ConsentWording` stores the exact words shown at the
  time. If the wording changes, old records keep what they were actually
  shown.
- **CVs** are list attachments, inside the tenant, never a public URL.
- **Access**: give the list to named people, not "Everyone". SharePoint
  defaults are more generous than you expect — check them.
- **Deletion requests**: delete the item, and empty the site recycle bin.
  Items sit there for 93 days otherwise, which is still holding the data.
