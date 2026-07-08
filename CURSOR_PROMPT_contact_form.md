# BLACKSWAN WEBSITE REDESIGN — REAL CONTACT FORM (Formspree)

## CONTEXT

**Working folder:** `C:\Users\alber_u5z2z37\OneDrive\Documents\Maastricht IB\BlackSwan 2\BlackSwan Website Redesign\`
**Target file:** `BlackSwan Website.dc.html`

Right now, every "Get in touch" button is a `mailto:{{email}}` link — it just opens the visitor's own email app, if they have one configured. Replace this with a real, working contact form that emails Bert directly, using **Formspree** (free static-site form backend, no server needed).

**Formspree endpoint is live:** `https://formspree.io/f/mvzjyjvb` (form is labeled "Website 3" in the Formspree dashboard, but it's the one to use for this build — Bert confirmed). Use this exact URL as the form's `action` — do not use a placeholder. Bert still needs to double-check, in that form's Settings tab on formspree.io, that the notification email is actually set to `albertjnr.zapke@t-online.de` — that's account-side config, not something this prompt can verify or change.

**Scope confirmed with Bert:**
- All three "Get in touch" buttons (nav, hero, closing section) should lead to the same real form — the form lives in the closing section, and the nav/hero buttons scroll down to it.
- The closing section's separate visible email line (`hello@blackswan-solutions.com`) stays exactly as it is — don't touch it, don't repoint it, that's being handled separately later.

---

## 1. NAV AND HERO "GET IN TOUCH" BUTTONS — BECOME ANCHOR LINKS

Both currently:
```html
<a href="mailto:{{email}}" style="...">Get in touch</a>
```

Change `href="mailto:{{email}}"` to `href="#bs-contact"` on both the nav button and the hero's primary CTA button. Everything else about these buttons (styling, `data-magnetic` if present, etc.) stays the same — this is purely a link-target change. The existing smooth-scroll-to-anchor behavior already used elsewhere on the page (if any) should apply naturally since it's a same-page anchor link; if there's no existing smooth-scroll JS for anchor links, plain browser default anchor-jump is fine, don't add a new smooth-scroll system just for this.

---

## 2. CLOSING SECTION — REPLACE THE CTA BUTTON WITH A REAL FORM

Current closing CTA block (inside `#bs-closing`):
```html
<div data-reveal data-reveal-delay="200" style="margin-top:64px;display:flex;flex-direction:column;align-items:center;gap:16px;">
  <a href="mailto:{{email}}" style="background:#F05A1A;color:#FFFFFF;text-decoration:none;font-weight:700;font-size:17px;padding:16px 34px;border-radius:10px;transition:background 150ms cubic-bezier(.2,0,0,1);" style-hover="background:#C04010;">Get in touch</a>
  <a href="mailto:{{email}}" style="font-family:'JetBrains Mono',monospace;font-size:13px;color:#B0AFA9;text-decoration:none;border-bottom:1px solid rgba(176,175,169,0.35);padding-bottom:2px;transition:color 150ms cubic-bezier(.2,0,0,1),border-color 150ms cubic-bezier(.2,0,0,1);" style-hover="color:#F5F4F0;border-color:#F5F4F0;">{{email}}</a>
  <p style="margin:14px 0 0;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.14em;color:#6B7280;">BROWSER-BASED&nbsp;&nbsp;·&nbsp;&nbsp;EU SERVERS&nbsp;&nbsp;·&nbsp;&nbsp;GDPR-ORIENTED&nbsp;&nbsp;·&nbsp;&nbsp;MULTILINGUAL</p>
</div>
```

**Keep the second `<a>` (the visible `{{email}}` line) and the trust-line `<p>` exactly as they are — do not modify or remove them.** Only the first element (the "Get in touch" button) gets replaced with a form, and give the whole block an id so the nav/hero links can jump to it:

```html
<div id="bs-contact" data-reveal data-reveal-delay="200" style="margin-top:64px;display:flex;flex-direction:column;align-items:center;gap:16px;width:100%;">

  <form id="bsContactForm" action="https://formspree.io/f/mvzjyjvb" method="POST" style="display:flex;flex-direction:column;gap:12px;width:100%;max-width:420px;">
    <input type="text" name="name" required placeholder="Name" style="background:#1A1A1A;border:1px solid rgba(245,244,240,0.14);border-radius:8px;padding:13px 16px;font-family:'Inter',sans-serif;font-size:15px;color:#F5F4F0;outline:none;transition:border-color 150ms cubic-bezier(.2,0,0,1);">
    <input type="email" name="email" required placeholder="Email" style="background:#1A1A1A;border:1px solid rgba(245,244,240,0.14);border-radius:8px;padding:13px 16px;font-family:'Inter',sans-serif;font-size:15px;color:#F5F4F0;outline:none;transition:border-color 150ms cubic-bezier(.2,0,0,1);">
    <textarea name="message" required placeholder="Message" rows="4" style="background:#1A1A1A;border:1px solid rgba(245,244,240,0.14);border-radius:8px;padding:13px 16px;font-family:'Inter',sans-serif;font-size:15px;color:#F5F4F0;outline:none;resize:vertical;transition:border-color 150ms cubic-bezier(.2,0,0,1);"></textarea>
    <button type="submit" id="bsContactSubmit" style="background:#F05A1A;color:#FFFFFF;border:none;cursor:pointer;font-weight:700;font-size:17px;padding:16px 34px;border-radius:10px;transition:background 150ms cubic-bezier(.2,0,0,1);">Get in touch</button>
    <p id="bsContactError" style="display:none;margin:0;font-size:13px;color:#F05A1A;text-align:center;">Something went wrong — please try again, or email {{email}} directly.</p>
  </form>

  <div id="bsContactThanks" style="display:none;text-align:center;">
    <p style="margin:0;font-size:19px;font-weight:700;color:#FFFFFF;">Thanks — message sent.</p>
    <p style="margin:8px 0 0;font-size:14px;color:#B0AFA9;">We'll get back to you shortly.</p>
  </div>

  <a href="mailto:{{email}}" style="font-family:'JetBrains Mono',monospace;font-size:13px;color:#B0AFA9;text-decoration:none;border-bottom:1px solid rgba(176,175,169,0.35);padding-bottom:2px;transition:color 150ms cubic-bezier(.2,0,0,1),border-color 150ms cubic-bezier(.2,0,0,1);" style-hover="color:#F5F4F0;border-color:#F5F4F0;">{{email}}</a>
  <p style="margin:14px 0 0;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.14em;color:#6B7280;">BROWSER-BASED&nbsp;&nbsp;·&nbsp;&nbsp;EU SERVERS&nbsp;&nbsp;·&nbsp;&nbsp;GDPR-ORIENTED&nbsp;&nbsp;·&nbsp;&nbsp;MULTILINGUAL</p>
</div>
```

Add a focus style so inputs don't look dead — on `focus`, border color should shift to the accent orange (`#F05A1A`), matching the site's interaction language elsewhere. Add this via a small `<style>` rule (there's already a `<style>` block in `<helmet>` — add to it, don't create a second one):
```css
#bsContactForm input:focus, #bsContactForm textarea:focus { border-color: #F05A1A; }
```

---

## 3. SUBMIT HANDLER — AJAX SUBMISSION, NO PAGE RELOAD

Add this inside `componentDidMount()`, alongside the other DOM wiring already there (reuse the existing `$(id)` helper already defined in that function rather than writing a new one):

```js
const form = $('bsContactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('bsContactSubmit');
    const errEl = $('bsContactError');
    if (errEl) errEl.style.display = 'none';
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.style.display = 'none';
        const thanks = $('bsContactThanks');
        if (thanks) thanks.style.display = 'block';
      } else {
        throw new Error('submit failed');
      }
    } catch (err) {
      if (btn) { btn.disabled = false; btn.textContent = 'Get in touch'; }
      if (errEl) errEl.style.display = 'block';
    }
  });
}
```

This gives a clean experience: button shows "Sending…" while in flight, swaps the whole form for a thank-you message on success (no redirect to Formspree's own page, no page reload), and shows an inline error with a fallback mailto if the request fails for any reason.

---

## QUALITY CHECKLIST

1. [ ] Nav and hero "Get in touch" buttons now link to `#bs-contact` instead of `mailto:`
2. [ ] Closing section's CTA button is now a real form (name, email, message, submit) styled consistently with the rest of the site
3. [ ] The visible `{{email}}` line and the trust-line paragraph are untouched, still present, still correctly positioned
4. [ ] Form submits via fetch/AJAX — no page reload, no redirect to a Formspree-hosted page
5. [ ] Success state replaces the form with a thank-you message; error state shows an inline message with a mailto fallback and re-enables the button
6. [ ] Input focus states use the accent orange border
7. [ ] Form `action` is exactly `https://formspree.io/f/mvzjyjvb` — no placeholder left in the code
8. [ ] No console errors; existing `data-reveal` fade-in behavior on this block still works
