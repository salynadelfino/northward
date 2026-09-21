# 02 — Global Nurse Force teardown

Notes taken from Global Nurse Force (globalnurseforce.com), the clearest
structural benchmark in this market, and what Northward takes, drops and
changes.

> Their site was not directly reachable from this environment (egress blocked),
> so the structure below is reconstructed from indexed pages and search
> metadata. It is accurate on *which pages exist and how they are grouped* —
> the layer this document is about. Before the next revision, someone should
> open the site on a phone and check the section order and form fields page by
> page. Flagged again in `03-site-structure.md`.

---

## Their structure

```
/                          Home
/about-us                  20+ years · offices USA, UK, UAE, India
                           250+ partner hospitals · 20,000+ nurses placed
/licensing-registration    Hub: end-to-end licensing compliance
  /licensing/uk-nmc          UK NMC: CBT, OSCE, English, H&CW visa
  /licensing/…               NCLEX (USA), NMBI (Ireland), CGFNS, Prometric
/nurse-recruitment         Job listings
  /jobs/{slug}/{id}          Individual vacancy pages
/nurse-in-usa              Destination page — USA
/usa-to-usa                Destination page — US-to-US direct hire
                           (plus equivalents for UK, Germany, Ireland, GCC, Australia)
/clients                   Employer side — "healthcare career solutions"
/faqs                      NCLEX, NMC, NMBI, visa, language exams, fees
/blog/{slug}/{id}          Editorial
/corporate-careers         Their own hiring
```

**The shape:** a many-destinations, many-services agency. Breadth is the
proposition — *wherever you want to go, whatever you need, we do it.* The site
is organised by **regulator** (licensing) and by **destination** (country
pages), with a job board as the conversion surface and trust carried by
volume claims.

---

## What we take

**1. The regulator page as the SEO spine.**
`/licensing/uk-nmc` is their strongest asset: it ranks, it answers a real
query, and it is the page a nurse actually arrives on. Northward's equivalent
is `/route` and its six step pages. This is the single best idea on their site
and we should take it wholesale — one hub, one page per step, each answering
the question a nurse types in.

**2. Grouping content by the step the reader is on, not by service.**
CBT, OSCE and English are separate pages because they are separate moments in
someone's life, months apart, searched separately. Our content pillars in the
playbook already map to this one-to-one.

**3. A dedicated, generous FAQ page.**
Theirs covers registration, visa, exams, fees and living abroad. It is doing
real work — catching long-tail search and pre-empting the DMs. Ours does the
same job plus one thing theirs does not: it answers the closed-routes question
honestly.

**4. An employer-facing page existing at all.**
It signals that there are real employers behind the candidate proposition.
We take the *signal* but not the page — see "the tension" below.

---

## What we drop

**1. Every destination except the UK.**
No USA, Ireland, Germany, GCC, Australia. One corridor. A nurse choosing
between five countries is not our candidate; a nurse who has decided on the UK
and does not know what it costs is. Breadth is their moat and our liability —
it is what makes their site read as an agency and ours read as a school.

**2. The job board and individual vacancy pages.**
We have a register, not a board. Reasons, in order:
- Published vacancies with a "one of 40 places" feel edge toward the guarantee
  language §5 of the guardrails prohibits.
- Live listings decay, and a site full of dead roles destroys the credibility
  the guides build.
- The register *is* the product: "members hear about roles first" is only true
  if roles are not public.

**3. Paid exam preparation and career services.**
GNF sells IELTS/OET prep, CV tailoring and interview training. Northward gives
all three away free. This is the sharpest differentiator we have and it is not
a marketing choice — EAA 1973 s.6 makes charging work-seekers unlawful anyway
(guardrail §4). *The thing our biggest competitor charges for, we publish.*

**4. Volume trust claims.**
"20,000+ nurses placed · 250+ hospitals" is the load-bearing trust device on
their homepage. Northward has no equivalent number and inventing one is
misleading advertising. Replaced — see below.

**5. `/corporate-careers`.** Not now.

---

## What we change

| Their move | Our move | Why |
|---|---|---|
| Trust via placement volume | Trust via **checkable facts** — free always, written from current rules, last-reviewed date on every page | We have no volume; we do have accuracy, and accuracy is verifiable in a way a claimed number is not |
| Licensing help as a **paid service** | The same material as a **free guide library** | Guardrail §4, and it inverts the category |
| Job board as conversion surface | **Guide download (4 fields) → 7-day sequence → register** | A download converts a stranger; a job listing only converts someone already ready |
| Contact form / enquiry | **No live chat, no enquiry form** | Guardrail §3 — an open-ended question box is an individual-advice surface |
| Country pages sell a destination | `/route` pages **teach a process** | Teaching is what earns this audience; selling is what every competitor does |
| Employer page front and centre | Deferred, and never CTC-branded | Brand architecture — see the tension below |

---

## The tension worth naming now

GNF's `/clients` page is doing something real: it proves employers exist. Our
whole proposition ("we work with UK employers who hire nurses") rests on the
same claim, made without the same proof.

We cannot resolve it the way they do, because the employer relationship belongs
to CTC and CTC must not appear anywhere above the footer rule. So, for now:

- **Do** carry the claim as a plain sentence, and evidence it in the only way
  available and honest — *what kinds of employer, in what regions, hiring for
  what bands* (a `/roles` page describing the market, not listing vacancies).
- **Do not** build an employer landing page, name employers, or publish logos
  without written permission from each.
- **Revisit** once there are placed nurses who will go on record.
  A real nurse saying where she works is better proof than a client logo wall,
  and it is proof that belongs to Northward rather than to CTC.

**Decided, September 2026:** no employer page. Instead, a small employer
spotlight on the home page carrying two quotes from providers CTC has worked
with (Evolve in Devon, plus one more). That is better proof than a logo wall
and it belongs to Northward rather than to CTC — but it only works with real,
signed-off words. The slots ship visibly empty rather than filled with
plausible-sounding copy.

---

## Addendum — migrately.ai, September 2026

Charlie flagged [migrately.ai](https://migrately.ai/) as the structural model to
follow: simple, slick, modern, and markedly less word-heavy than what we had.

**I could not open it** — the domain is blocked by this environment's egress
proxy, same as Global Nurse Force. The revision was built from Charlie's
description rather than from the site, so the principles below are his, not
observed:

- Few pages, each with one job
- Few sections per page, and short ones
- Home page reads as "about us" — what we do, who we help — not as a pitch
- Forms live on their own pages, never inline on the home page
- FAQ is its own page

**Worth checking against the real site** before the next revision: their section
rhythm and vertical spacing, how they handle the primary CTA repeat, and whether
they carry social proof above or below the fold. If any of that differs from
what we have built, it is a cheap change now and an expensive one later.
