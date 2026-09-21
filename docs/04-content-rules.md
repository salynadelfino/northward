# 04 — Content and messaging rules

Page copy now lives in the HTML. This document is the rules that govern it, so
that anyone editing a page writes in the same voice and does not reintroduce
something the structure deliberately removed.

---

## Voice

Plain, specific, warm, unhurried. Numbers and dates rather than adjectives.
Teacherly without being condescending. Talks to a professional, not an
applicant. British-English spelling; nursing vocabulary used correctly (GNM,
BSc Nursing, staff nurse, CBT, Test of Competence, OSCE, PIN, Band 5).

Sentences are short. Sections are shorter than you think they need to be. If a
paragraph can lose a clause, it loses the clause.

## Banned

guaranteed · 100% · limited places · act now · dream job · life-changing
opportunity · unlock · hassle-free · seamless · we will get you a visa ·
anything opening "In your situation…"

## What moved, and why it must not move back

Four things were removed from the home page in the September 2026 revision.
They were not removed for space.

| Removed | Where it went | Why |
|---|---|---|
| The facts / trust strip under the hero | Gone | It front-loaded defensiveness. The page now earns trust by being useful, not by arguing for itself. |
| "Free, always" as a headline claim | FAQ, and one line beside each form | Leading with price makes price the subject. It is a fact about the service, not the proposition. |
| The cost figures and pay figures | The guidebook, and the FAQ | Same reason. Money is what the guidebook is *for*; it is not what the brand is about. |
| The guide library grid | One guidebook, with the rest named as in progress on `/guide` | Six covers where two were real read as padding. One strong asset beats a shelf of coming-soons. |

## Messaging: the register is patient, not urgent

The single most important tonal rule on the site. Everything about the register
says *we will find the right role when it exists*, never *move now*.

**Write:** "We hold your details and come to you when a role fits." ·
"There may be no matching role this month, or next. That is normal." ·
"We would rather introduce you to one role that suits you than five that do not."

**Never write:** "Roles are filling fast" · "Register today to be considered" ·
"Limited vacancies" · anything with a countdown, a place count, or a deadline.

This is a compliance position as much as a tonal one — see
`01-compliance-guardrails.md` §5 — but it is also simply what is true, and the
audience can tell.

## The two forms are different on purpose

| | Guidebook (`/guide`) | Register (`/register`) |
|---|---|---|
| Fields | 4 | 18 |
| What it is | An expression of interest | A candidate record |
| What we ask | Name, email, mobile, stage | Qualification, NMC progress, English, experience, readiness, CV |
| What it earns us | Permission to come back to them | A record we can actually match against |

The guidebook form must never grow. Every field beyond four costs completions,
and at that point we have given the reader nothing yet. The bridge between the
two is the follow-up sequence and the fact that the handbook was good — not a
longer form.

Both forms state plainly that downloading is not the same as registering. People
who think they have already joined the register are the worst outcome of getting
this wrong.

## Placeholders currently in the pages

These are visible in the build and must be resolved before launch. Search for
the square brackets.

- `[legal entity name]` — consent blocks on both forms
- `[retention period]` — consent blocks on both forms
- Employer spotlight on the home page — both quotes are marked
  **Quote to be collected** and styled as unfilled. Evolve (Devon) is named
  because CTC has worked with them; the words are not theirs yet.
  **Do not publish either quote without written permission from the employer,
  and do not write words on their behalf.**
- `https://northward.co` in every canonical and Open Graph tag
- `<meta name="robots" content="noindex">` is on every page. Remove it at launch.

## Accuracy

Every factual claim on the site is checkable, and someone must check it before
launch:

- The six route durations
- The 8 January 2026 B2 change, and that it is separate from the NMC's own
  English requirement
- The 22 July 2025 closure of overseas care worker recruitment
- Any fee or salary figure that appears in the guidebook

Each page carries the date its rules were last reviewed. Keep it honest — a
stale date is better than a false fresh one, and both are worse than a review.
