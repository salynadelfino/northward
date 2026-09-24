# 03 — Site structure

Northward Care is a **career network for nurses**: it helps qualified nurses in
India understand the UK route, and connects them with UK employers who have
live roles. The site is how nurses find it, learn from it, and join it.

The proposition, in one line:

> Tell us where you are. Tell us where you want to go. We'll let you know when
> the right opportunity comes up.

Northward Care is not an immigration consultancy, a visa service or a job board,
and nothing on the site should read as any of those.
Internally the site is candidate acquisition; **that vocabulary never appears
on it.** No "lead", no "funnel", no "database".

---

## Sitemap

Six pages. Nurses only.

```
index.html      Home — the proposition, who it's for, the Register
journey.html    The Journey — eight stages as accordions, with official sources
guide.html      The free guide; submitting the form starts the download
register.html   Join the Register — three-step profile
about.html      Why we exist, who we are, how we work
faqs.html       What we are, the route, the Register
```

Navigation is `The Journey · Free Guide · About · FAQs`, with **Join the
Register** as a button in the header on every page.

### Deliberately not built

**No job board.** Northward Care does not post vacancies. Roles reach nurses on
the Register directly, which is the whole reason the Register exists.

Also not built: other countries, other healthcare professions, pricing or
checkout, live chat, an open enquiry form, and a blog.

| Page | Its one job |
|---|---|
| **Home** | Answer "who are these people, does this apply to me, what do I do next" — then offer the Register or the guide. |
| **The Journey** | Reassure, then prove competence. Cites the NMC and GOV.UK for everything that changes. |
| **Free guide** | Convert a reader into a contactable person. The download fires on submit. |
| **Register** | Convert a contactable person into a matchable nursing profile. |
| **About** | Who we are, why we exist, how we work — three bands, ending in a 2×2 infographic. |
| **FAQs** | Guarantees, timelines, the OSCE, the advice line, and data. |

---

## Home page flow

Six sections. Deliberately short — the detail lives on The Journey and About.

| # | Section | What it does |
|---|---|---|
| 1 | **Hero** | *Your UK career could be closer than you think.* Centred over a drifting contour field. Register (filled) and guide (outlined). No disclaimer line. |
| 2 | **Who this is for** | Qualified nurses who want to work in the UK. Settings kept general — hospitals, nursing homes, community teams, specialist services. The "not a job board" point is woven into the copy, not boxed out. |
| 3 | **Where are you on the UK route?** | Four stages: ready · preparing · exploring · later. Two route to the Register. |
| 4 | **How Northward Care works** | Join → Stay connected → Get matched → Take the next step. |
| 5 | **Not ready yet?** | The long-term Register proposition. Strategically the most important section. |
| 6 | **Final CTA** | Register (filled), guide (outlined). |

### Removed from the home page in this revision

| Removed | Where it went |
|---|---|
| The "No obligation to move" line under the hero buttons | Gone. It undercut the hero. |
| The "What we are not" box | Folded into the copy as one clause. |
| The route summary | The Journey owns it. The home page links there from the stage cards. |
| "How we work" / the tenets | Moved to About. |
| "We will also tell you when the UK is not the answer" | Cut. It still appears, softened, in the FAQ. |

---

## Where the entity name appears

Under Article 13 UK GDPR, a person handing over their details must be told who
the controller is. The legal entity is therefore named in exactly two places:
the consent block on the Register, the privacy paragraph on the guide form,
and the privacy notice itself.

Nowhere else. Not in the header, the hero, About, the guide, the email sender
name or any social bio. **CTC is never named anywhere on this site.** Candidate
email comes from `hello@northwardcare.com`.

---

## Technical shape

- Static HTML, one CSS file, one small JS file, six pages. No framework and
  no build step.
- **Fonts:** Archivo (headings) and Public Sans (body). No serif. Figures use
  `font-variant-numeric: tabular-nums` rather than a third face.
- **Colour:** one hue worked through its range — jade `#0F6F5C`, pine `#0A3B33`,
  mint `#6FC9AC` on dark grounds, mist `#E4F1ED`, beige paper `#F7F5F0`. There
  is no second accent hue. The primary action is the deepest, most saturated
  green on the page (a `--jade-lift` → `--jade` gradient), and on the dark band
  it inverts to solid mist so the filled/outlined hierarchy reads the same
  everywhere.
- **Hero:** no photography. A faint field of contour arcs — latitude lines
  curving north — sits behind centred text at 13% opacity over a soft jade
  wash, drifting over 52 seconds. Decorative, `aria-hidden`, the only ornament
  on the site.
- **Motion** lives in `site.js` and the motion block at the end of `styles.css`:
  a page fade in and out between pages, a staggered hero entrance, scroll
  reveal, and hover movement on buttons, cards, arrow links and nav items.

  Three rules it must keep obeying:
  1. **Nothing is ever permanently hidden.** Content is only hidden when the
     `js` class is set *and* the viewer has not asked for reduced motion, and
     `site.js` reveals everything unconditionally after 1.4s. Without
     JavaScript the page renders complete.
  2. **`prefers-reduced-motion` disables all of it** — the fade, the drift, the
     reveal and every hover transform.
  3. **Every page lands at the top.** `history.scrollRestoration` is set in the
     inline head script, before the browser can restore anything, and `site.js`
     then forces the top at three moments a stale offset can survive: script
     run, `load`, and a `pageshow` out of the bfcache. When the site is
     embedded in a preview iframe the surrounding page owns the scroll, so
     `documentElement.scrollIntoView()` is also called — the one request that
     reaches an ancestor frame.
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

0. **A data notice on the guide form.** It currently has none — no checkbox and
   no privacy line. UK GDPR Article 13 requires one at the point of collection.
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
      swap the `https://northwardcare.com` placeholder in the canonical and OG tags
