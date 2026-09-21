# 03 — Site structure

Northward is a **career network for nurses**: it helps qualified nurses in
India understand the UK route, and connects them with UK employers who have
live roles. The site is how nurses find it, learn from it, and join it.

The proposition, in one line:

> Tell us where you are. Tell us where you want to go. We'll let you know when
> the right opportunity comes up.

Northward is not an immigration consultancy, a visa service or a job board,
and nothing on the site should read as any of those.
Internally the site is candidate acquisition; **that vocabulary never appears
on it.** No "lead", no "funnel", no "database".

---

## Sitemap

Five pages. Nurses only.

```
index.html      Home — the proposition, the route in brief, the Register
pathway.html    Your Pathway — the eight stages, with official sources
guide.html      The free guide, and a three-field download form
register.html   Join the Northward Register — three-step profile
faqs.html       What we are, the route, the Register
```

Navigation is `Your Pathway · Free Guide · FAQs`, with **Join the Register**
as a button in the header on every page.

### Deliberately not built

**No job board.** Northward does not post vacancies. Roles reach nurses on the
Register directly, which is the whole reason the Register exists — a public
listings page would undercut it, and dead listings destroy the credibility the
guides build.

Also not built: destination pages for other countries, other healthcare
professions, pricing or checkout of any kind, live chat, an open enquiry form,
a resources index (folded into the guide and the pathway), and a blog.

| Page | Its one job |
|---|---|
| **Home** | Answer "who are these people, does this apply to me, and what do I do next" — then offer the Register or the guide. |
| **Your Pathway** | Prove competence, set expectations, cite the NMC and GOV.UK for everything that changes. |
| **Free guide** | Convert a reader into a contactable person for three details. |
| **Register** | Convert a contactable person into a matchable nursing profile. |
| **FAQs** | Answer guarantees, timelines, the OSCE, and what happens to their details. |

---

## Home page flow

Seven sections.

| # | Section | What it does |
|---|---|---|
| 1 | **Hero** | *Your UK career could be closer than you think.* Centred, over a faint contour field. Register (filled) and guide (outlined). |
| 2 | **Who this is for** | Qualified nurses who want to work in the UK. Full stop. Plus a short "what we are not". |
| 3 | **Where are you on the UK route?** | Four stages: ready · preparing · exploring · later. Two route to the Register. |
| 4 | **How Northward works** | Join → Stay connected → Get matched → Take the next step. |
| 5 | **The route** | Six stages in brief, the "we are not the authority" line, link to the full pathway. |
| 6 | **Not ready yet?** | The long-term Register proposition. Strategically the most important section. |
| 7 | **No false promises** | Four tenets, plus the line saying the UK is not automatically the right move. |
| 8 | **Final CTA** | Register (filled), guide (outlined). |

### Removed in this revision

| Removed | Why |
|---|---|
| Doctors and allied health professions | Northward places nurses. Narrowing back is what lets the site write properly about the NMC route. |
| The opportunities / job board page | Not the model. Roles go to the Register. |
| Resources, About and Contact pages | Overbuilt. Their content folded into home, the guide and the footer. Easy to restore. |
| All cost and fee content, and the "unlawful to charge" argument | Defensive, and it made money the subject. The site leads with education and live roles. |
| Hero photography | Replaced with a faint contour field behind centred text. |

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
- **Colour:** one hue worked through its range — jade `#0F6F5C`, pine `#0A3B33`,
  mint `#6FC9AC` on dark grounds, mist `#E4F1ED`, beige paper `#F7F5F0`. There
  is no second accent hue. The primary action is the deepest, most saturated
  green on the page (a `--jade-lift` → `--jade` gradient), and on the dark band
  it inverts to solid mist so the filled/outlined hierarchy reads the same
  everywhere.
- **Hero:** no photography. A faint field of contour arcs — latitude lines
  curving north — sits behind centred text, at 13% opacity over a soft jade
  wash. Decorative, `aria-hidden`, and the only ornament on the site.
- **Mark:** a solid two-tone north needle, jade over pine. No outline, no
  container. Must stay legible at 16px.
- **Mobile:** most of this audience is mobile-only on Indian networks. The Register button is in the header on every page and never
  scrolls away. Budget is under 150KB per page excluding fonts.
- **Forms** post to the register directly. No third-party embed that drops
  cookies before consent.
- **Email:** SPF, DKIM and DMARC before the first send.

---

## SEO

The site is built to become the resource Indian nurses find when they search. Every page has a unique title, meta description, canonical
and Open Graph tags; the home page carries Organization data and the FAQ page
carries FAQPage data.

The content engine is the next thing to build, and it should be article pages
at `/resources/<slug>` — one page per real search, not sections accumulating
on one page. The queries worth owning: NMC registration from India, CBT part B,
OSCE preparation, IELTS vs OET for nurses, UK nurse salary, UK nursing CV,
sponsorship for nurses, moving to the UK as a nurse. Write to answer the
question, not to rank for the phrase.

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

1. The first three article pages, per the SEO note above
2. Genuine nurse stories, once they exist and consent is on file — the `.quote`
   component is built and unused
3. An About page, once there are real names to put on it

### Open items

- [ ] **Open migrately.ai and globalnurseforce.com on a phone** — neither was
      reachable from the build environment, so the structural notes in
      `02-gnf-teardown.md` are second-hand
- [ ] Confirm the domain and social handles are free
- [ ] Agree the retention period, stated on both forms
- [ ] Resolve `[legal entity name]` in both consent blocks
- [ ] Remove `<meta name="robots" content="noindex">` from all five pages and
      swap the `https://northward.co` placeholder in the canonical and OG tags
