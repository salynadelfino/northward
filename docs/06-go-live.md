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
| 1.6 | Finish the guide PDF | Salyna | The site offers a document that does not exist yet. |

### 1.7 — The guide form has no data notice

Right now the guide form collects a name, email and phone number and says
nothing about what happens to them. That was a deliberate design decision to
keep the form to four fields, and **it cannot ship that way.**

Minimum fix: one line under the submit button.

```html
<p class="form-note">
  Your details are held by [legal entity name], trading as Northward Care.
  We&rsquo;ll email you the guide and let you know when we publish something new.
  See our <a href="privacy.html">privacy notice</a>.
</p>
```

---

## 2 — Domain and email

1. Buy **northwardcare.com**. Registrar is your choice; Cloudflare Registrar
   sells at cost and has no renewal markup.
2. Point the nameservers at whoever will host DNS (see step 3).
3. **Email**: add `northwardcare.com` as a domain in Microsoft 365 Admin →
   Settings → Domains, and create `hello@northwardcare.com` as a **shared
   mailbox**, not a user mailbox. Shared mailboxes are free, and more than one
   person can work the inbox.
4. **Authenticate the domain before you send anything.** SPF, DKIM and DMARC.
   M365 Admin → Settings → Domains walks you through SPF and DKIM; add DMARC
   manually as a TXT record on `_dmarc.northwardcare.com`:

   ```
   v=DMARC1; p=none; rua=mailto:hello@northwardcare.com; fo=1
   ```

   Start at `p=none`, watch the reports for two weeks, then move to
   `p=quarantine`. Skip this and your confirmation emails land in spam and you
   will wrongly conclude the forms are broken.

---

## 3 — Hosting

The site is static: seven HTML files, one stylesheet, three small scripts, a
few images. No server, no database, no build step. That means hosting is free
and fast.

**Recommended: Cloudflare Pages.**

- Free, with a genuinely good edge presence in India — which matters, because
  that is where every visitor is.
- Connects straight to the GitHub repo. Push to the branch, the site updates.
- Free TLS, automatic HTTP/2 and Brotli, and DDoS protection you do not have
  to think about.

**The Microsoft-estate alternative: Azure Static Web Apps.** Same idea, same
GitHub integration, and it keeps hosting inside the tenancy you already
administer. It is slightly slower from India than Cloudflare's edge and the
free tier is more limited. If your preference is to keep everything in one
place, it is a perfectly good choice — this is a preference call, not a
technical one.

**Not recommended:** SharePoint. It can serve pages, but it cannot serve a
public marketing site at a custom domain with clean URLs, and it will fight you
over every one of those.

### Setting up Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**
2. Pick `salynadelfino/northward`
3. Build settings:
   - Framework preset: **None**
   - Build command: *leave empty*
   - Build output directory: **`site`**
4. Deploy. You get a `*.pages.dev` URL immediately — check it before you point
   the domain.
5. **Custom domains** → add `northwardcare.com` and `www.northwardcare.com`,
   and redirect www to the apex.
6. Add a `_redirects` file if you want clean URLs without `.html` — optional,
   and only worth doing before launch, never after (it changes every URL).

---

## 4 — The e-book: where it lives and how it auto-downloads

**Put the PDF in the repo**, at `site/assets/northward-care-uk-nursing-guide.pdf`.

That is genuinely the right answer here:

- It deploys with the site, so it is on the same CDN edge and downloads fast
  from India.
- `<a download>` works against a same-origin file with no configuration.
- No expiring links, no SharePoint sign-in wall, nothing to break in six months.

**Do this before committing it:**

1. Export at "smallest file size / web" — target under 5 MB. A 30 MB PDF on a
   3G connection is a download nobody finishes.
2. Name the file exactly `northward-care-uk-nursing-guide.pdf`. That name is
   what the nurse sees in their downloads folder and what gets forwarded on.
3. Set the PDF's Title metadata — it becomes the browser tab title when it
   opens in a viewer.

**How the automatic download works, already built:**

`forms.js` handles submit → validate → POST to Power Automate → create a
hidden `<a download>` pointing at `NORTHWARD.guideFile` → click it → swap the
form for a confirmation panel with a manual fallback link. Nothing to wire; it
reads the path from `config.js`.

> **On gating:** the URL is public once someone knows it. That is fine — the
> guide is a free educational asset and the form is the point of contact, not
> a paywall. If you ever need it genuinely gated, Flow 2 can return a
> time-limited Azure Blob SAS link instead. Do not build that now.

---

## 5 — Connect the forms

This is the only code change at go-live, and it is two lines.

1. Build the two flows in `docs/05-register-database.md`.
2. Copy each flow's **HTTP POST URL** from its trigger.
3. Edit `site/config.js`:

```js
window.NORTHWARD = {
  registerEndpoint: 'https://prod-00.uksouth.logic.azure.com:443/workflows/...',
  guideEndpoint:    'https://prod-00.uksouth.logic.azure.com:443/workflows/...',
  guideFile: 'assets/northward-care-uk-nursing-guide.pdf',
  minSeconds: 3
};
```

4. Commit and push. Cloudflare redeploys in under a minute.

**While those URLs are blank the forms stay in preview mode** — they validate
and show the success panel, but send nothing, and say so. So nothing is ever
silently lost.

> Those URLs contain an access signature. They are not secret in a meaningful
> sense — they sit in client-side JavaScript — so **rely on the flow for
> validation, not on the URL being unguessable.** The honeypot and the
> three-second minimum in `forms.js` stop casual bots; the flow's consent check
> stops the rest.

---

## 6 — Analytics

Use **Cloudflare Web Analytics**. Free, cookieless, no consent banner needed,
and one script tag. Add it to each page before `</head>`.

Do not install Google Analytics. It needs a cookie banner, the banner costs
you conversions, and for the first six months the only numbers that matter are
in the Register itself: how many joined, from which `UtmSource`, at what
`Stage`.

Tag every link you post anywhere:

```
https://northwardcare.com/guide.html?utm_source=instagram&utm_medium=bio&utm_campaign=launch
```

`forms.js` already captures those into the submission, so the Register tells
you which post produced which nurse.

---

## 7 — Launch day checklist

- [ ] `config.js` has both endpoints, pushed
- [ ] Submit the Register form yourself, on a real phone, on mobile data
- [ ] Submit the guide form — confirm the PDF actually downloads on Android
      **and** iOS Safari
- [ ] Both records land in the List with the right Status and consent wording
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
