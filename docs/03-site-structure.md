# 03 — Site structure

Northward's information architecture, in three tiers. Tier 1 is built in this
repo. Tiers 2 and 3 are specified here so that nothing built now has to be
rebuilt later — but they are deliberately not started.

The organising idea, one line:

> **A school with a register attached.** The guides earn the audience. The
> register is what the audience stays for. Everything on the site is one or the
> other, and anything that is neither does not get built.

---

## Sitemap

```
TIER 1 — build now (week 1)
/                             Home / landing page          ← site/index.html
/thanks                       Post-download confirmation
/privacy                      Privacy notice               ← blocking, legal
/cookies                      Cookie notice

TIER 2 — month 1–3, as the guides ship
/guides                       The library (index)
  /guides/route-handbook        The UK Nursing Route Handbook
  /guides/cost-sheet            The Complete Cost Sheet
  /guides/document-checklist    NMC Document Checklist
  /guides/ielts-or-oet          IELTS vs OET Decision Guide
  /guides/osce                  The OSCE Guide
  /guides/cv-template           UK Nursing CV Template
  /guides/first-90-days         Your First 90 Days in the UK
/route                        The six steps — hub
  /route/english                English: B2, and why it changed
  /route/cbt                    CBT
  /route/test-of-competence     NMC application & ToC invitation
  /route/osce                   OSCE
  /route/visa                   Health & Care Worker visa (information only)
  /route/pin                    PIN and your first ward
/pay                          What a Band 5 nurse actually earns
/register                     Full registration form (standalone)
/about                        Who we are
/faqs                         Full FAQ

TIER 3 — month 3+, only once Tier 2 is earning
/am-i-ready                   Eligibility checker (gate the result, not the quiz)
/tools/salary-calculator      Salary & cost-of-living calculator
/roles                        Who hires international nurses in the UK
/stories                      Placed nurses, on the record, with consent
/blog                         Indexed editorial, seeded from the best guides

NOT BUILT — see docs/02-gnf-teardown.md
  Job board · individual vacancy pages · country pages other than the UK
  Paid courses or services · pricing · checkout · live chat · enquiry form
  Employer landing page · corporate careers
```

---

## The home page, section by section

Full copy is in `04-home-copy.md`; this is the structural spec and the reasoning
for the order. It departs from the playbook §13 ordering in one place — the
guide library moves above the route timeline — for the reason given at §3.

| # | Section | Job it does | Notes |
|---|---|---|---|
| 1 | **Hero** | Say what this is in one line, and offer the one thing worth clicking | One primary CTA only (*Get the free Route Handbook*). Register is a quiet secondary link, not a competing button. |
| 2 | **Trust strip** | Replace GNF's volume claims with checkable facts | Free always · written from current NMC and GOV.UK rules · last reviewed date · we never charge candidates. Four short facts, no numbers we cannot evidence. |
| 3 | **Free guides** | The reason the page exists | Grid of covers. Each opens the **four-field** download form. Placed above the route because this is what converts and what people return for — the playbook flags the same swap. |
| 4 | **The route** | Prove competence faster than any claim could | Six steps as a horizontal timeline with realistic durations. The most valuable single block on the page; on mobile it stacks to a vertical list and must stay legible. |
| 5 | **What changed** | Urgency without manufacturing any | The 8 January 2026 B2 change, and July 2025 closures. Links to the English guide. This is the section that produces registration spikes. |
| 6 | **Costs & pay** | Answer the question nobody else answers | Two honest figures and a link into the cost sheet and pay guide. Monospaced numerals — figures set like a document read as true. |
| 7 | **Who this is for** | Self-qualification | Four candidate types as short bullets: final-year student, recent graduate, experienced nurse, already mid-NMC. Improves lead quality before a single field is filled. |
| 8 | **Why register / How it works** | Convert the reader who is ready now | Four reasons + four steps (register → we check → you're on the register → we introduce you when a role matches). |
| 9 | **Register form** | The conversion surface | Embedded on the page, never a link out. **Consent block above the submit button, visible without scrolling past it.** |
| 10 | **FAQ** | Catch the objection and the long-tail search | Six questions. Two of them are *Do you charge?* (no) and *Do you guarantee a job?* (no). |
| 11 | **Footer** | The legal layer | Privacy, cookies, retention period, removal address, ICO number, entity name, regulated-advice disclaimer. |

### Two forms, deliberately different sizes

| | Download form | Registration form |
|---|---|---|
| Where | Behind every guide cover (§3) | Section 9, and `/register` at Tier 2 |
| Fields | **4** — name, email, WhatsApp, stage | **18** — playbook §09 schema |
| Asks for | Nothing that needs justifying | Qualification, NMC stage, English status, experience, CV |
| Why | Every field beyond four costs completions, and at this point we have given them nothing yet | By now they have had a 20-page handbook and six days of useful email; the ask is earned |

The bridge between them is the seven-day email sequence, not a bigger form.
Target conversion download → full registration is 15–30%. **If it comes in
under 15%, the day-7 email is the problem, not the guide.**

---

## Where the entity name appears

Under Article 13 UK GDPR, a person handing over their details must be told who
the controller is and who their data will be shared with, at the moment they
hand it over. So the legal entity is named in exactly two places:

1. The privacy notice at `/privacy`
2. One line inside the consent block on each form

Nowhere else. Not in the header, the hero, the about page, the guides, the email
sender name, the footer tagline or any social bio. Candidate-facing email comes
from `hello@northward.co`, never a CTC address.

This is a footer link and one line of small print. It is not the brand, and
nobody browsing, downloading or reading encounters it.

---

## Technical shape

Deliberately boring, because none of this is where the value is.

- **Tier 1:** static HTML + one CSS file. No framework, no build step, no
  JavaScript beyond form handling and the FAQ disclosure. Hosts anywhere.
- **Fonts:** Google Fonts — Newsreader (display), Public Sans (body), IBM Plex
  Mono (figures). All free, all available inside Canva so Salyna's assets match
  the site exactly.
- **Forms:** post to the register directly (Airtable / SharePoint list — decision
  with Aditya). No third-party form embed that drops its own cookies before
  consent.
- **Analytics:** privacy-first and cookieless, or none at all in month one.
  Source tagging happens in the register via UTM captured into a hidden field,
  which is the number that actually matters.
- **Email:** SPF, DKIM and DMARC configured on the domain **before the first
  send**. Skipping this puts the whole seven-day sequence in spam and produces a
  confident, wrong conclusion that the guides do not work.
- **Performance budget:** the audience is mobile-first on Indian networks.
  Under 150KB for the landing page excluding fonts, no hero video, no carousel
  library, images lazy-loaded and served at 2× at most.

---

## Build order

**Blocking before anything goes live** — these gate the launch, not the design:

1. Solicitor review of the consent wording, the disclaimer and the funnel, for
   the regulated-advice line (guardrail §3)
2. ICO registration + privacy notice published
3. Domain, SPF/DKIM/DMARC
4. Register schema agreed with Aditya, and the form tested end to end **on a
   real phone**

**Week 1** — Tier 1: landing page, both forms, the Route Handbook and the Cost
Sheet, the seven-day sequence, `/privacy`, `/cookies`, `/thanks`.

**Weeks 2–4** — nothing new on the site. Content, outreach and the first
hundred candidates. The temptation to spend week three on `/about` is the
failure mode the playbook's "can come later" list exists to prevent.

**Month 2–3** — Tier 2, one guide page at a time as each guide ships. `/route`
and its six children go up together, because a half-built route hub is worse
than none.

**Month 3+** — Tier 3, and only once Tier 2 is producing search traffic.

### Open items

- [ ] **Open globalnurseforce.com on a phone** and check section order and form
      fields against `02-gnf-teardown.md` — it was reconstructed from indexed
      pages, not visited.
- [ ] Confirm `northward.co` / `.co.uk` and the four social handles are free
- [ ] Decide the employer-enquiry question in `02-gnf-teardown.md`
      (recommendation: out of scope, one footer line)
- [ ] Agree the retention period so it can be stated on the form
- [ ] Agree who is named as the sender on candidate email
