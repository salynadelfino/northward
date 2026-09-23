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

Write like a knowledgeable person talking to an ambitious Indian nurse. Short sentences. Be specific. Say what things actually mean.
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
inventory.** People are nurses, and the thing they join is the Register.

And banned because it makes the brand sound defensive: **any discussion of
fees, of the site being free, or of it being unlawful to charge for work.**
The only permitted use of "free" is "the free guide", where it describes the
guide. See `01-compliance-guardrails.md` §4.

Unless a phrase genuinely adds meaning, remove it.

## Calls to action

The primary CTA is **Join the Register**, or "Join the Register"
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

## Nurses only

Northward Care places nurses. Not doctors, not allied health, not care workers.
Copy says "nurses", never "healthcare professionals" — the second is vaguer
and it is not what we do. The narrow scope is a strength: it is what lets the
site write specifically about the NMC route, the CBT and the OSCE instead of
generically about everything.

There is also no job board. Roles reach nurses on the Register directly.
Never write copy that implies vacancies are browsable here.

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
Home Office. Neither belongs to Northward Care.

- State how the process **generally** works.
- Link the official source for anything current or time-sensitive — NMC, GMC,
  HCPC, GOV.UK.
- Never present Northward Care as the legal or regulatory authority.
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
| Means | An expression of interest | A nursing profile |
| Tone | "Fill this in and it downloads" | "Tell us where you are" |
| Consent | **No checkbox.** Submitting starts the download. | Explicit checkbox. |

The guide form must never grow. Both say explicitly that downloading is not
joining the Register.

**On the missing checkbox:** the guide form now has no consent tickbox, by
decision — the download is the transaction and a checkbox in front of it is
friction. The privacy paragraph stays and must keep saying who holds the data,
for how long, and that we will be in touch. Before launch, confirm with the
solicitor which lawful basis covers the follow-up email, since consent is no
longer being captured as a positive act. See `01-compliance-guardrails.md` §6.

## Placeholders in the build

Search the square brackets. All must be resolved before launch.

- `[legal entity name]` and `[retention period]` — consent blocks on both forms
- `https://northwardcare.com` in canonical and Open Graph tags
- `<meta name="robots" content="noindex">` on all five pages

## Accuracy

Everything factual must be checked before launch, and re-checked quarterly:
the eight pathway stages, the current NMC and Home Office English
requirements, and anything stated in the guide. Where a rule
has moved recently, link the source rather than paraphrasing it.
