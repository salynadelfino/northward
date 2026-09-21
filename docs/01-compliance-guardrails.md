# 01 — Compliance guardrails

The constraints that shape the site's structure, not just its wording. Every one
of these changes a page, a field or a whole section. Read before editing anything.

Position as at **September 2026**. Re-check against GOV.UK and the NMC before
publishing anything that states a rule — this area moves, and three of the six
items below changed within the last 14 months.

---

## 1. Registered healthcare professions. Never care work.

Overseas recruitment into care worker and senior care worker roles (SOC 6135,
6136) closed on **22 July 2025**, and the skill threshold for sponsored work
rose to RQF 6 (degree). There is no compliant overseas care-worker pipeline
from India.

Registered healthcare professions remain eligible: nurses (NMC), doctors (GMC),
and allied health professions regulated by the HCPC — physiotherapists,
radiographers, biomedical scientists, operating department practitioners,
occupational therapists and others.

**Structural consequence:** the site addresses registered healthcare
professionals. It has no care-work page, guide or SEO. One FAQ answer covers
care work, and only to say the overseas route is closed and why. Eligibility is
always framed as depending on profession, qualification and the rules in force
— never asserted.

## 2. India is green-listed. Most of the surrounding audience is not.

Under the *Code of Practice for the international recruitment of health and
social care personnel*, India is green-listed with a UK–India collaboration
framework, so active recruitment is permitted. Fifty-one countries are
red-listed — Nigeria, Pakistan, Bangladesh and Ghana among them — where active
recruitment is prohibited. A paid ad is active recruitment.

**Structural consequence:**
- Country of residence is a **required field on the registration form**, and it
  sits second, directly under name.
- Paid traffic is geo-targeted to India. No exceptions, no lookalike audiences.
- The register reports on country monthly. Red-list arrivals are a targeting
  bug to fix, not leads to work.

## 3. Immigration advice is regulated

Providing immigration advice or services in the UK is a criminal offence unless
regulated by the Immigration Advice Authority (formerly OISC) or otherwise
exempt. The site must stay strictly on the information side of that line:
general published facts, eligibility screening against published criteria, and
referral.

**Structural consequence:**
- **No live chat widget.** This is the single most important structural
  decision on the site. A chat widget creates an individual-advice surface that
  cannot be staffed or controlled, and it is the fastest route to giving
  regulated advice by accident.
- **No "check my case" / "assess my eligibility" form** that returns a personal
  opinion. If an eligibility checker is ever built, it returns *which published stage you
  are at and what the published next step is* — never "in your situation you
  should apply under…".
- Every guide carries the standing disclaimer in the footer.
- Whoever answers the inbox is briefed on this before the site goes live.

## 4. Candidates are never charged

Section 6 of the Employment Agencies Act 1973 prohibits charging a work-seeker a
fee for finding them work. Sponsors may not recoup sponsorship costs from
workers.

**Structural consequence:** there is no pricing page, no checkout, no paid
course, no "premium" tier, and no payment surface of any kind in this repo.
This is also the site's sharpest differentiator against the incumbents — see
`02-gnf-teardown.md`. It appears as one plain factual line on the form and in
the FAQ, and is not built into a campaign.

## 5. Nothing that sounds like a guarantee

No "guaranteed UK job", no "100% visa success", no "only 20 places left", no
placement-count claim the business cannot evidence.

**Structural consequence:** the site has no vanity-metric trust strip. Global
Nurse Force leads with *20,000+ nurses placed · 250+ hospitals*; Northward
cannot make an equivalent claim and should not try. The trust strip is built
from **checkable facts instead of outcome claims** — free, always; written from
the current rules; last reviewed on a stated date, on every page.

The sentence that is permitted, and converts better anyway:
> We work with UK employers who hire nurses, and our registered members hear
> about roles first.

That is a statement about access, not outcomes.

## 6. Data protection, from day one

The site collects names, contact details, professional histories and CVs from overseas nationals. Before
the form goes live:

- ICO registration complete
- Privacy notice published at `/privacy`, linked in the footer of every page and
  beside the submit button on every form
- Retention period stated, lawful basis recorded, DPIA run
- Consent wording versioned — the register stores **the exact wording shown and
  the timestamp**, not just a `true`

**Structural consequence:** the consent block sits *above* the submit button and
is visible without scrolling past it. The legal entity's name appears in the
privacy notice and in one line of the consent block, and nowhere above the
footer rule. See `03-site-structure.md` § "Where the entity name appears".

## 7. English moved to B2 on 8 January 2026

Skilled Worker applications now require CEFR **B2** across reading, writing,
speaking and listening, up from B1. This is separate from the NMC's own English
requirement, and most Indian nursing graduates have not registered that the visa
bar moved underneath them.

**Structural consequence:** this is not a footnote, it is a homepage section and
the first guide behind the first form. It is the most useful thing the site can
say in month one, and it self-selects candidates who can actually be placed.

---

## The line the site must not cross

Everything the site does is **education, screening and introduction**.
Sponsorship and visa work sits on the employer's side of that line. The brand
teaches generally, screens against published criteria, and introduces. It never
comments on an individual's immigration circumstances — not on a page, not in a
guide, not in a DM.
