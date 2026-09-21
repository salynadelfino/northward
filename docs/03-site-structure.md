# 03 — Site structure

Northward is a **career network** connecting Indian healthcare professionals with
opportunities to build their careers in the UK. The site is how candidates find
it, learn from it, and join it.

The proposition, in one line:

> Tell us where you are. Tell us where you want to go. We'll let you know when
> the right opportunity comes up.

Northward is not an immigration consultancy, a recruitment agency, a visa
company or a job board, and nothing on the site should read as any of those.
Internally the site is candidate acquisition; **that vocabulary never appears
on it.** No "lead", no "funnel", no "database".

---

## Sitemap

```
index.html          Home — the proposition, the register, the guide, the pathway
opportunities.html  UK Careers — how opportunities work, and any that are live
pathway.html        Your Pathway — the nine stages, with official sources
resources.html      UK Career Hub — the guide, the pathway, FAQs, what's coming
guide.html          The free guide, and the short download form
register.html       Join the Northward Register — three-step profile
about.html          Why Northward exists and what it believes
faqs.html           What we are, cost, the pathway, the Register
contact.html        Email, WhatsApp, and what we cannot advise on
```

Primary navigation is `UK Careers · Your Pathway · Resources · About`, with
**Join the Register** as a button in the header on every page. Contact sits in
the footer.

| Page | Its one job |
|---|---|
| **Home** | Answer "who are these people, what do they do, and does this apply to me" — then offer the Register or the guide. |
| **UK Careers** | Show how opportunities work without implying anyone can apply or that sponsorship is guaranteed. Currently an honest empty state. |
| **Your Pathway** | Prove competence, set expectations, and point at the official authority for everything that changes. |
| **Resources** | Be the reason someone comes back, and the reason search sends them. |
| **Free guide** | Convert a reader into a contactable person for three details. |
| **Join the Register** | Convert a contactable person into a matchable professional profile. |
| **About** | Say why this exists, in a human voice, without a mission statement. |
| **FAQs** | Answer cost, guarantees, the closed care-worker route, and data. |
| **Contact** | Be reachable, and be clear about the advice line. |

---

## Home page flow

Ten sections, in this order. Each earns its place; none repeats another.

| # | Section | What it does |
|---|---|---|
| 1 | **Hero** | *Your UK career could be closer than you think.* Register (primary) and guide (secondary), plus the no-obligation line. Two columns — copy left, photography right. |
| 2 | **Who this is for** | Names the professions. Says explicitly that people who are years away belong here too. |
| 3 | **Where are you now?** | Four self-identifying stages, each routing somewhere different. Ready → opportunities · Preparing → pathway · Exploring → guide · Informed → register. |
| 4 | **How Northward works** | Join → Stay connected → Get matched → Take the next step. Four lines, no elaboration. |
| 5 | **The pathway** | Nine stages in brief, with a link to the full page and the "we are not the authority" line. |
| 6 | **Not ready yet?** | The long-term register proposition. Strategically the most important section on the page. |
| 7 | **UK Career Opportunities** | Honest empty state, and why opportunities reach the Register first. |
| 8 | **No false promises** | Four tenets, plus the line that says the UK is not automatically the right move. |
| 9 | **UK Career Hub** | Three resources, and the route into the content engine. |
| 10 | **Final CTA** | Register (primary), guide (secondary). |

### What was removed in this revision, and why

| Removed | Why |
|---|---|
| "Three things, done well" icon cards | Generic, icon-heavy, and said nothing the flow does not now say better. |
| The employer testimonial spotlight | Replaced by the opportunities section and the transparency tenets. Real quotes go back in when they exist — the markup is in `.quote` and unused. |
| "How we help" as a page | Became **Your Pathway**, which is what it actually was. |
| Nursing-only framing | The audience is Indian healthcare professionals: nurses, doctors, allied health. Care work stays closed and is answered honestly in the FAQ. |
| Cost and salary figures on the home page | They belong in the guide. Leading with money makes money the subject. |

---

## The two conversion mechanisms

| | Free guide (`guide.html`) | The Register (`register.html`) |
|---|---|---|
| Fields | 3 required, 1 optional | ~20 across three steps |
| Means | An expression of interest | A professional profile |
| Asks | Name, email, profession, WhatsApp | Location, qualification, experience, speciality, employer type, English, UK registration progress, timeframe, preferences, CV |
| Consent | Mailing list only | Register, and contact about matching roles |

Both say explicitly that **downloading the guide does not join the Register.**
People who believe they have already joined are the worst outcome of getting
this wrong.

The Register uses progressive disclosure — three steps, each a real category
rather than an arbitrary split — so it reads as building a career profile
rather than filling in a marketing form. Step 1 alone is enough to contact
someone, so a partial completion is still worth having once the form is wired
up. **Persist step 1 on "Continue", not only on final submit.**

---

## Where the entity name appears

Under Article 13 UK GDPR, a person handing over their details must be told who
the controller is. The legal entity is therefore named in exactly two places:
the consent block on each of the two forms, and the privacy notice.

Nowhere else. Not in the header, the hero, About, the guide, the email sender
name or any social bio. **CTC is never named anywhere on this site.** Candidate
email comes from `hello@northward.co`.

---

## Technical shape

- Static HTML, one CSS file, nine pages. No framework, no build step. The only
  JavaScript is the register stepper and the inert-form notices.
- **Fonts:** Archivo (headings) and Public Sans (body). No serif. Figures use
  `font-variant-numeric: tabular-nums` rather than a third face.
- **Mark:** a solid two-tone north needle, jade over pine. No outline, no
  container. Must stay legible at 16px.
- **Photography:** `.media` slots are built and marked. Real photographs drop
  straight in — Indian healthcare professionals, real working environments,
  eye level, unposed. No stock handshakes, no nurses smiling at laptops.
- **Mobile:** a significant share of this audience is mobile-only on Indian
  networks. The Register button is in the header on every page and never
  scrolls away. Budget is under 150KB per page excluding fonts.
- **Forms** post to the register directly. No third-party embed that drops
  cookies before consent.
- **Email:** SPF, DKIM and DMARC before the first send.

---

## SEO

The site is built to become the resource Indian healthcare professionals find
when they search. Every page has a unique title, meta description, canonical
and Open Graph tags; the home page carries Organization data and the FAQ page
carries FAQPage data.

The content engine is `resources.html`. Planned articles are listed there and
map to real searches — NMC registration from India, CBT, OSCE, IELTS vs OET,
UK nurse salary, GMC route, HCPC route, sponsorship. **Each becomes its own
page at `/resources/<slug>`; do not let them accumulate as sections on one
page.** Write to answer the question, not to rank for the phrase.

---

## Build order

**Blocking before launch:**

1. Solicitor review of the consent wording, the disclaimer and the contact
   page, for the regulated-advice line (guardrail §3)
2. ICO registration, and a privacy notice for the consent blocks to point at
3. Domain, SPF/DKIM/DMARC
4. Register schema agreed with Aditya; both forms tested end to end on a phone
5. The guide itself written — the site currently offers a document that does
   not exist

**Then, in order:**

1. Real photography into the `.media` slots
2. The first three Career Hub articles
3. Real team detail on About
4. Genuine candidate stories, once they exist and consent is on file
5. Live opportunities, when there are any

### Open items

- [ ] **Open migrately.ai and globalnurseforce.com on a phone** — neither was
      reachable from the build environment, so the structural notes in
      `02-gnf-teardown.md` are second-hand
- [ ] WhatsApp business number for the contact page (currently a placeholder)
- [ ] Confirm the domain and social handles are free
- [ ] Agree the retention period, stated on both forms
- [ ] Resolve `[legal entity name]` in both consent blocks
- [ ] Remove `<meta name="robots" content="noindex">` from all nine pages and
      swap the `https://northward.co` placeholder in the canonical and OG tags
