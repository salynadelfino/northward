# 06 — Going live

Start to finish. Roughly a day of actual work, spread across whatever the
solicitor and the domain registrar take.

**Do the blockers first.** Steps 1–3 are legal and administrative and cannot be
rushed at the end; everything from step 4 is a couple of hours.

---

## 1 — Blockers (start these today)

| # | What | Who | Why it blocks |
|---|---|---|---|
| 1.1 | Solicitor review: the consent wording, the site disclaimer, the FAQ visa answer, and where the line sits between explaining the route and advising an individual | External | Immigration advice is regulated. This one is not optional. |
| 1.2 | Register with the ICO | Charlie | You are about to hold personal data on overseas nationals. |
| 1.3 | Write the privacy notice, publish at `/privacy.html` | Charlie | UK GDPR Article 13. The forms have to point somewhere. |
| 1.4 | Decide the **retention period** | Charlie | Stated on both forms and drives `RetentionReviewDate`. |
| 1.5 | Confirm the **legal entity name** | Charlie | Replaces `[legal entity name]` in the consent block. |
| 1.6 | ~~Finish the guide PDF~~ | Salyna | **Done** — in `site/assets/`, wired up. |

### 1.7 — Data notices

**Done.** The guide form now carries a data notice under the submit button,
and the Register keeps its consent block. Both still contain
`[legal entity name]` and `[retention period]`, which is what 1.4 and 1.5
resolve. Check with:

```
grep -rn "\[legal entity name\]\|\[retention period\]" site/*.html
```

The CV upload field has been removed from the Register. It looked like it
worked and silently discarded the file, which is worse than not offering it.
The form now says a CV will be asked for when a profile is being reviewed.

---

## 2 — Domain and email

1. Buy **northwardcare.com**. Registrar is your choice; Cloudflare Registrar
   sells at cost and has no renewal markup.
2. Point the nameservers at whoever will host DNS (see step 3).
3. **Email**: in the new Northward Google Workspace, add `northwardcare.com`
   as a domain, then create `hello@northwardcare.com` as a **shared inbox**
   (Workspace calls it a Group with collaborative inbox turned on), not a user
   account. It is free and more than one person can work it.
4. **Authenticate the domain before you send anything.** SPF, DKIM and DMARC.
   Google Admin → Apps → Google Workspace → Gmail → Authenticate email gives
   you the DKIM record; add SPF and DMARC as TXT records yourself:

   ```
   @          TXT   v=spf1 include:_spf.google.com ~all
   ```

   ```
   v=DMARC1; p=none; rua=mailto:hello@northwardcare.com; fo=1
   ```

   Start at `p=none`, watch the reports for two weeks, then move to
   `p=quarantine`. Skip this and your confirmation emails land in spam and you
   will wrongly conclude the forms are broken.

---

## 3 — Hosting: Vercel

The site is static — seven HTML files, a stylesheet, three small scripts and a
few images — plus one serverless function for form submissions. Vercel serves
both from the same domain, which is why there is no CORS to configure.

### Set it up

1. [vercel.com](https://vercel.com) → sign in with GitHub → **Add New →
   Project** → import `salynadelfino/northward`
2. Framework preset: **Other**
3. Leave the build command empty. `vercel.json` already sets the output
   directory to `site` — do not override it in the dashboard, or the two will
   disagree.
4. **Deploy.** You get a `*.vercel.app` URL in about thirty seconds. Check it
   before pointing the domain at anything.
5. **Settings → Environment Variables** — add the four from
   `docs/05-register-database.md`, to Production, Preview *and* Development.
   Then **redeploy**: Vercel does not apply new variables to an existing build.
6. **Settings → Domains** → add `northwardcare.com` and `www.northwardcare.com`.
   Vercel gives you the DNS records; add them at your registrar. TLS is
   automatic. Set www to redirect to the apex.

### What is already configured

`vercel.json` in the repo root sets the output directory, security headers
(`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
`Permissions-Policy`) and cache lifetimes — a week for `/assets`, an hour for
CSS and JS, and no-cache for `config.js` so a change to it takes effect at
once.

### Preview deployments

Every push to a non-production branch gets its own URL. Use one to test a
change against the real function before it reaches the live domain. Preview
URLs are public but not indexed.

## 4 — The e-book

**Done.** `Northward-Care-Indian-Nurses-Guide-to-Working-in-the-UK.pdf` is in
`site/assets/` — 617 KB, 37 pages, with its Title metadata set so it names
itself properly when it opens in a viewer.

Uploading it was not quite enough on its own: `config.js` has to point at the
exact filename, **including capitalisation**, because Vercel serves from Linux
where `Northward-Care-…` and `northward-care-…` are different files. That
is now set:

```js
guideFile: 'assets/Northward-Care-Indian-Nurses-Guide-to-Working-in-the-UK.pdf'
```

**How the automatic download works, already built.** On submit `forms.js`
validates, then — still inside the click that caused it — creates a hidden
`<a download>` pointing at `guideFile` and clicks it. Only then does it post
to `/api/submit`, and it shows the confirmation panel whichever way that goes.

Two deliberate choices there:

- **Delivery never depends on logging.** If the Sheet is unreachable the
  reader still gets the guide; we lose a row, not a reader. The panel says so
  quietly and offers the email address.
- **The download fires inside the user gesture.** Browsers allow a download
  started that way far more readily than one fired after an `await`.

The panel also carries an **Open the guide** link with `target="_blank"`. That
is not just a fallback: on iOS Safari a programmatic `<a download>` is
unreliable, and opening the PDF in a tab lets Safari's own viewer handle
saving and sharing. It is the path many phone users will actually take.

> The preview artifact cannot demonstrate this. Its sandbox blocks any
> download a page starts itself, by design. The **Open the guide** button
> works there; the automatic download only works on the real domain.

If you ever rename the PDF, change `config.js` in the same commit. That is the
only place the path appears.

> **On gating:** the URL is guessable once someone has it, and that is fine —
> the guide is a free educational asset and the form is a point of contact,
> not a paywall. If it ever needs to be genuinely gated, the function can
> return a short-lived signed URL instead. Do not build that now.

## 5 — Connect the forms

Both forms post to `/api/submit` on your own domain. There is no endpoint URL
to paste and no key in the browser — the credentials are Vercel environment
variables, read server-side only.

So "connecting the forms" is really just step 3.5 and step 2 of
`docs/05-register-database.md`:

1. Create the Sheet with the two tabs and the header rows
2. Create the service account, download the JSON key, **share the Sheet with
   the service account's email as Editor**
3. Add the environment variables in Vercel and redeploy

`site/config.js` already points at `/api/submit`. Blank it out and both forms
fall back to preview mode — they validate and show the success panel but send
nothing, and say so on screen. Nothing is ever silently lost.

### Testing it

Submit both forms on the live domain, then check:

- a row appears on the right tab, with `submittedAt` and `status = New`
- `consentWording` holds the exact text the form displayed
- the guide PDF actually downloads — **test on Android Chrome and iOS Safari
  separately**, they handle programmatic downloads differently
- a deliberately empty submit shows per-field errors and sends nothing
- Vercel → your project → **Logs** shows the function returning 200

If a submission fails, the form says so and offers the email address rather
than swallowing it. The Vercel log has the real reason.

## 6 — Analytics

Use **Vercel Web Analytics** — it is in the dashboard you are already using,
cookieless, and needs no consent banner. Project → Analytics → Enable, then
add the one script tag it gives you.

Plausible or Cloudflare Web Analytics are equally fine if you would rather the
data sat outside Vercel. All three are cookieless.

Do not install Google Analytics, even though you will now have a Google
Workspace. It needs a cookie consent banner, the banner costs you
conversions, and for the first six months the only numbers that matter are in
the Sheet itself: how many joined, from which `utm_source`, at what `stage`.

Tag every link you post anywhere:

```
https://northwardcare.com/guide.html?utm_source=instagram&utm_medium=bio&utm_campaign=launch
```

`forms.js` captures those into every submission, so the Sheet tells you which
post produced which nurse — without any analytics tool at all.

---

## 7 — Launch day checklist

- [ ] Environment variables set in Vercel, and redeployed after adding them
- [ ] Sheet shared with the service account as Editor
- [ ] Submit the Register form yourself, on a real phone, on mobile data
- [ ] Submit the guide form — confirm the PDF downloads on Android Chrome
      **and** iOS Safari
- [ ] Both rows land on the right tab with `status = New` and the consent wording stored
- [ ] The confirmation emails arrive, and not in spam
- [ ] `[legal entity name]` and `[retention period]` are replaced everywhere
      (`grep -rn "\[" site/*.html`)
- [ ] `privacy.html` exists and every form links to it
- [ ] Google Search Console: add the property, submit `sitemap.xml`
- [ ] Bing Webmaster Tools: same. Bing feeds Copilot and ChatGPT search —
      worth ten minutes.
- [ ] Test the social card by pasting the URL into WhatsApp
- [ ] Check every page on a phone, including the menu and both forms

---

## 8 — First month

| Week | Focus |
|---|---|
| 1 | Publish. Watch the Register fill. Fix whatever the first twenty submissions expose. |
| 2 | First three Career Hub articles at `/resources/<slug>` — NMC registration from India, IELTS vs OET, OSCE preparation. This is what makes the site findable. |
| 3 | Employer quotes, with written permission. Real names on the About page. |
| 4 | Read the data: joins by source, guide→register conversion, qualification rate. Then decide what to double. |

The number that matters at day 30 is not the total. It is whether you can name
the two sources producing your best-matched nurses.
