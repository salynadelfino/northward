# Northward Care — website

Northward Care is a career network for nurses: it helps qualified nurses in India
understand the UK route, and connects them with UK employers who have live
roles.

The site publishes practical guidance on the UK pathway and invites people to
join the **Northward Care Register**: a professional profile we hold, so we can get
in touch when a relevant UK opportunity comes up.

> Tell us where you are. Tell us where you want to go. We'll let you know when
> the right opportunity comes up.

Northward Care is not an immigration consultancy, a recruitment agency, a visa
company or a job board. Nothing on the public site says otherwise, and CTC is
never named on it.

## What's here

| Path | What it is |
|---|---|
| `docs/01-compliance-guardrails.md` | The rules every page is constrained by. Read first. |
| `docs/02-gnf-teardown.md` | Global Nurse Force structure, and what we take / drop / change. |
| `docs/03-site-structure.md` | Sitemap, page-by-page section specs, build order. |
| `docs/04-content-rules.md` | Voice, banned phrases, CTA rules, the patience rule, placeholders. |
| `site/*.html` | The six pages plus a 404. Static, no build step. |
| `site/config.js` | **The only file that changes at go-live** — form endpoints. |
| `site/site.js` | Mobile menu, page transitions, scroll reveal, the register stepper. |
| `site/forms.js` | Validation, submission, the guide auto-download. |
| `docs/05-register-database.md` | Building the Register in Microsoft Lists + Power Automate. |
| `docs/06-go-live.md` | Hosting, domain, email, the e-book, launch checklist. |
| `docs/register-schema.csv` | The Register's 34 columns, importable. |
| `site/styles.css` | Brand tokens (colour, type, spacing) + page styles. |

## Going live

Read `docs/06-go-live.md`. The short version: the blockers are legal
(solicitor, ICO, privacy notice, retention period), hosting is Cloudflare
Pages pointed at `site/`, and connecting the forms is two lines in
`site/config.js`.

While those endpoints are blank both forms stay in preview mode — they
validate and show the success state but send nothing, and say so.

## Running the page locally

No build step. Open `site/index.html` in a browser, or:

```
cd site && python3 -m http.server 8000
```

## Scope

Six pages and two conversion mechanisms: the free guide (three fields) and
the Register (a three-step nursing profile). There is no job board —
roles reach nurses on the Register directly. What is deliberately
not built — and why — is in `docs/03-site-structure.md`.

Both forms are inert: they say so on the page rather than silently appearing to
work. They are wired up once the register schema is agreed.

## Non-negotiables

Three things constrain every change to this repo. They are not style preferences.

1. **No guarantees.** No "guaranteed job", no "100% visa success", no countdowns,
   no scarcity of any kind.
2. **No individual immigration advice.** General information, and a link to the
   official source. Never "in your situation…".
3. **Nurses only**, and no job board.
4. **Never discuss fees** — not ours, not the principle. It makes the brand
   sound defensive. Lead with education and live roles.
5. **No invented people.** No fake testimonials, success stories or team members.
6. **CTC is never named.** Northward Care stands on its own.

The full list, with the reasoning and the legislation, is in
`docs/01-compliance-guardrails.md`.
