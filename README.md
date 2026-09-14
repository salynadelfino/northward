# Northward — website

Northward is the India-facing candidate brand: free education on the UK nursing
route (NMC → PIN) for registered nurses in India, plus a free register that puts
those nurses in front of UK employers who are hiring.

This repo holds the site's information architecture, page copy and the v1
landing page. It is derived from the *Two Front Doors* launch playbook, narrowed
to a single corridor: **India → UK, registered nurses only.**

## What's here

| Path | What it is |
|---|---|
| `docs/01-compliance-guardrails.md` | The rules every page is constrained by. Read first. |
| `docs/02-gnf-teardown.md` | Global Nurse Force structure, and what we take / drop / change. |
| `docs/03-site-structure.md` | Sitemap, page-by-page section specs, build order. |
| `docs/04-home-copy.md` | Section-by-section copy for the v1 landing page. |
| `site/index.html` | The v1 landing page. Static, no build step. |
| `site/styles.css` | Brand tokens (colour, type, spacing) + page styles. |

## Running the page locally

No build step. Open `site/index.html` in a browser, or:

```
cd site && python3 -m http.server 8000
```

## Scope of v1

One page, one form, two guides behind it. Everything in `docs/03-site-structure.md`
marked **Tier 2** or **Tier 3** is deliberately not built yet — see the build
order at the end of that document for why.

## Non-negotiables

Three things constrain every change to this repo. They are not style preferences.

1. **No guarantees.** No "guaranteed job", no "100% visa success", no countdowns.
2. **No individual immigration advice.** General published information only.
3. **Candidates are never charged.** Nothing on this site takes a payment.

The full list, with the reasoning and the legislation, is in
`docs/01-compliance-guardrails.md`.
