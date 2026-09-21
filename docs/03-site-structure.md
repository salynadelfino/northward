# 03 — Site structure

Northward's information architecture. Everything described here is built in
this repo; what is deliberately left out is listed below, with the reasoning,
so nothing gets quietly added back.

The organising idea, one line:

> **A school with a register attached.** The guides earn the audience. The
> register is what the audience stays for. Everything on the site is one or the
> other, and anything that is neither does not get built.

---

## Sitemap

Five pages. Each has one job, and no page does two.

```
index.html          Home — what Northward is and what it does
how-we-help.html    The route, who it is for, and what happens after you register
guide.html          The handbook, and the 4-field download form
register.html       The 18-field registration form
faqs.html           Cost, the route, and what we do with your details
```

| Page | Its one job |
|---|---|
| **Home** | Answer "who are these people and what do they do" in under a minute, and offer the guidebook. |
| **How we help** | Prove competence (the route) and set expectations (we are patient, not urgent). Ends in the register. |
| **Free guidebook** | Convert a reader into a contactable person, for four details. |
| **Join the register** | Convert a contactable person into a matchable candidate record. |
| **FAQs** | Catch the objection, the long-tail search, and the question we must answer honestly (cost, guarantees, care work). |

### Deliberately not built

Job board · individual vacancy pages · destination pages for other countries ·
paid courses, pricing or checkout · live chat · an open enquiry form ·
an employer landing page · a guide library index · a blog (not yet).

Reasoning for the first six is in `02-gnf-teardown.md`. The library and the blog
are deferred, not rejected — see "Build order".

---

## Home page, section by section

Five sections. The count is the point: the previous version had eleven and read
as a document rather than a site.

| # | Section | What it does |
|---|---|---|
| 1 | **Hero** | One line on what this is, then two actions — download the guidebook (primary), join the register (secondary). Centred; there is no photography to anchor a right-hand column. |
| 2 | **What we do** | Three cards: we teach the route · we connect nurses with employers · we stay with you. This is the "About Us" the home page exists to be. |
| 3 | **The guidebook** | One asset, given real weight — cover, what is inside, one button. |
| 4 | **Who we work with** | Employer spotlight. Two quote slots, currently unfilled and visibly marked as such. |
| 5 | **CTA band** | Join the register / download the guidebook. |

Removed from the home page in this revision, and why, is in
`04-content-rules.md` § "What moved, and why it must not move back".

---

## How we help, section by section

| # | Section | What it does |
|---|---|---|
| 1 | **Hero** | Frames the two halves: we teach for free, and we match patiently. |
| 2 | **Who this is for** | Four nurse types, one line each. Self-qualification before any form. |
| 3 | **The route** | Six steps with realistic durations and a sentence on each. The proof-of-competence block. |
| 4 | **After you register** | Three steps carrying the patient-matching message. |
| 5 | **CTA band** | Join the register. |

---

## Two forms, deliberately different sizes

| | Guidebook form | Registration form |
|---|---|---|
| Page | `guide.html` | `register.html` |
| Fields | **4** — name, email, mobile, stage | **18** — playbook §09 schema |
| Means | An expression of interest | A candidate record |
| Consent | Mailing list only, and says so | Holding details for role matching |

Both consent blocks sit above the submit button and are visible without
scrolling past it. Both state that downloading is not the same as registering.

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

- Static HTML, one CSS file, five pages. No framework, no build step, and no
  JavaScript beyond the inert-form notice. Hosts anywhere.
- **Fonts:** two faces, no serif — **Archivo** (headings, 500/600/700) and
  **Public Sans** (body). Both on Google Fonts and both in Canva, so Salyna's
  assets match the site. Figures use `font-variant-numeric: tabular-nums`
  rather than a third face.
- **Mark:** a solid two-tone north needle, jade over pine. No outline, no
  container, no gradient. It sits at 26px in the header and must stay legible
  as a 16px favicon — test it there before any change.
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
2. ICO registration, and a privacy notice published somewhere the consent block
   can point at
3. Domain, SPF/DKIM/DMARC
4. Register schema agreed with Aditya, and both forms tested end to end **on a
   real phone**
5. The Route Handbook itself written — the site currently offers a document
   that does not exist

**Week 1** — the five pages, both forms wired up, the handbook, and the
follow-up email sequence.

**Weeks 2–4** — nothing new on the site. Content, outreach, and the first
hundred candidates. Spending week three adding pages is the failure mode the
playbook's "can come later" list exists to prevent.

**Month 2 onward** — in this order, and only as each earns its place:

1. **Employer quotes** into the spotlight, once two employers have given
   written permission. This is the highest-value single change on the site.
2. **A second and third guide**, which is when `/guide` becomes a library index
   rather than one page.
3. **Route step pages** — `/route/english`, `/route/cbt`, `/route/osce` and so
   on. This is the search-traffic play, and it is worth doing properly or not
   at all: a half-built route hub is worse than none.
4. **A blog**, seeded from whichever guides perform.

### Open items

- [ ] **Open migrately.ai and globalnurseforce.com on a phone** and check this
      build against both — neither was reachable from the build environment, so
      the structural notes are second-hand. See the addendum in
      `02-gnf-teardown.md`.
- [ ] Collect and get written sign-off on the two employer quotes (Evolve,
      Devon, plus one more)
- [ ] Confirm `northward.co` / `.co.uk` and the four social handles are free
- [ ] Agree the retention period so it can be stated on both forms
- [ ] Agree who is named as the sender on candidate email
- [ ] Decide where the privacy notice lives, given the footer links were
      removed — the consent blocks still have to point somewhere (guardrail §6)
- [ ] Remove `<meta name="robots" content="noindex">` from all five pages at
      launch, and swap the `https://northward.co` placeholder in the canonical
      and Open Graph tags
