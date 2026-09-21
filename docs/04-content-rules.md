# 04 — Voice and content rules

Copy lives in the HTML. This is what governs it.

The test, applied to every sentence before it ships:

> Does this sound like a real, credible Indian career brand — or does it sound
> like AI wrote an overseas recruitment website?

If it is the latter, rewrite it.

---

## Voice

Intelligent · warm · modern · trustworthy · practical · ambitious ·
Indian-aware · straightforward · human.

Write like a knowledgeable person talking to an ambitious Indian healthcare
professional. Short sentences. Be specific. Say what things actually mean.
Avoid unnecessary adjectives. British-English spelling.

**Not:** corporate · overly polished · American · cheesy · inspirational for
its own sake · like an immigration consultancy · like an AI-generated
recruitment website.

## Banned outright

Audit any new copy against this list.

unlock your potential · dream career · brighter future · transform your future ·
empowering healthcare professionals · seamless journey · end-to-end solutions ·
trusted partner · your journey starts here · take the next step towards your
dreams · global opportunities await · unlock a world of possibilities ·
passionate about changing lives · your success is our success · tailored
solutions · holistic support · comprehensive solutions · navigate your journey ·
start your journey · a brighter future

Also banned, because they describe the internal model rather than the
proposition: **lead generation · database · funnel · leads · candidates as
inventory.** People are professionals, and the thing they join is the Register.

Unless a phrase genuinely adds meaning, remove it.

## Calls to action

The primary CTA is **Join the Northward Register**, or "Join the Register"
where the brand name is already on screen. Supporting line:

> Tell us about your experience, qualifications and career goals. When a
> relevant UK opportunity comes up, we'll be in touch.

**Never use:** Apply Now · Submit Your CV · Get Started · Start Your Journey ·
Contact Us (as a primary CTA).

The secondary CTA is **Get the free guide**.

The Register must feel valuable and professional — something a serious person
joins, not somewhere details are collected.

## The patience rule

The most important tonal rule on the site. Everything about the Register says
*we will tell you when the right thing comes up*, never *move now*.

**Write:** "You don't have to be ready to move today." · "There may be nothing
matching for months." · "We would rather know you early than find you late." ·
"We will not invent something to keep you engaged."

**Never:** roles filling fast · limited places · register today to be
considered · countdowns · deadlines · any scarcity device.

This is a compliance position (`01-compliance-guardrails.md` §5) and a
strategic one — we want people who are eighteen months out — and it is also
simply true.

## Do not oversell the UK

The UK is not an automatic upgrade. No exaggerated claims about salary,
lifestyle, career progression, quality of life, immigration or family benefits.

The line the site takes, and it appears on the home page and in the FAQs:

> We help you understand the opportunity so you can decide whether it's right
> for you.

Saying plainly that the UK is the wrong move for some people buys more trust
than any amount of enthusiasm.

## Regulatory content

Registration rules belong to the regulators. Immigration rules belong to the
Home Office. Neither belongs to Northward.

- State how the process **generally** works.
- Link the official source for anything current or time-sensitive — NMC, GMC,
  HCPC, GOV.UK.
- Never present Northward as the legal or regulatory authority.
- Never advise on an individual's position. Not on a page, not in an email,
  not on WhatsApp.

## Social proof

**Do not invent testimonials, success stories or quotes.** Not as placeholder,
not "just for the design".

Until genuine ones exist, trust comes from: a transparent process, useful
guides, honest FAQs, real team information, links to official sources, and an
opportunities page that says "nothing live" rather than showing stale roles.

The `.quote` component is built and unused. Real quotes drop into it once they
exist and consent is on file.

## The two forms

| | Free guide | The Register |
|---|---|---|
| Fields | 3 required, 1 optional | ~20 over three steps |
| Means | An expression of interest | A professional profile |
| Tone | "Three details and it's yours" | "Tell us where you are" |

The guide form must never grow. Both say explicitly that downloading is not
joining the Register.

## Placeholders in the build

Search the square brackets. All must be resolved before launch.

- `[legal entity name]` and `[retention period]` — consent blocks on both forms
- `[WhatsApp business number]` — contact page
- The "Who we are" block on About — real names, or leave it empty. Do not
  invent people.
- The `.media--empty` photography slots — each states what belongs there
- `https://northward.co` in canonical and Open Graph tags
- `<meta name="robots" content="noindex">` on all nine pages

## Accuracy

Everything factual must be checked before launch, and re-checked quarterly:
the pathway stages, the July 2025 closure of overseas care-worker recruitment,
the current English requirements, and every figure in the guide. Where a rule
has moved recently, link the source rather than paraphrasing it.
