# Northward — website

Northward is a career network connecting Indian healthcare professionals —
nurses, doctors and allied health professionals — with opportunities to build
their careers in the UK.

The site publishes practical guidance on the UK pathway and invites people to
join the **Northward Register**: a professional profile we hold, so we can get
in touch when a relevant UK opportunity comes up.

> Tell us where you are. Tell us where you want to go. We'll let you know when
> the right opportunity comes up.

Northward is not an immigration consultancy, a recruitment agency, a visa
company or a job board. Nothing on the public site says otherwise, and CTC is
never named on it.

## What's here

| Path | What it is |
|---|---|
| `docs/01-compliance-guardrails.md` | The rules every page is constrained by. Read first. |
| `docs/02-gnf-teardown.md` | Global Nurse Force structure, and what we take / drop / change. |
| `docs/03-site-structure.md` | Sitemap, page-by-page section specs, build order. |
| `docs/04-content-rules.md` | Voice, banned phrases, CTA rules, the patience rule, placeholders. |
| `site/*.html` | The nine pages. Static, no build step. |
| `site/styles.css` | Brand tokens (colour, type, spacing) + page styles. |

## Running the page locally

No build step. Open `site/index.html` in a browser, or:

```
cd site && python3 -m http.server 8000
```

## Scope

Nine pages and two conversion mechanisms: the free guide (three fields) and the
Northward Register (a three-step professional profile). What is deliberately
not built — and why — is in `docs/03-site-structure.md`.

Both forms are inert: they say so on the page rather than silently appearing to
work. They are wired up once the register schema is agreed.

## Non-negotiables

Three things constrain every change to this repo. They are not style preferences.

1. **No guarantees.** No "guaranteed job", no "100% visa success", no countdowns,
   no scarcity of any kind.
2. **No individual immigration advice.** General information, and a link to the
   official source. Never "in your situation…".
3. **Nobody is ever charged.** Nothing on this site takes a payment.
4. **No invented people.** No fake testimonials, success stories or team members.
5. **CTC is never named.** Northward stands on its own.

The full list, with the reasoning and the legislation, is in
`docs/01-compliance-guardrails.md`.
