# BLACKSWAN WEBSITE REDESIGN — REMOVE FOOTER AND VISIBLE EMAIL LINE

## CONTEXT

**Working folder:** `C:\Users\alber_u5z2z37\OneDrive\Documents\Maastricht IB\BlackSwan 2\BlackSwan Website Redesign\`
**Target file:** `BlackSwan Website.dc.html`

Two removals, both inside `#bs-closing` near the end of the file:

1. The visible `{{email}}` line under the contact form (the "hello@blackswan-solutions.com" text link) — remove entirely.
2. The whole `<footer>` block below it — the "© 2026 Black Swan Solution UG (haftungsbeschränkt)" copyright line and the "Impressum / Datenschutz / Kontakt" nav — remove entirely.

Nothing else in that area changes — the form itself, the "Thanks — message sent" state, and the trust line ("BROWSER-BASED · EU SERVERS · GDPR-ORIENTED · MULTILINGUAL") all stay exactly as they are.

---

## 1. REMOVE THE VISIBLE EMAIL LINE

Find this line, inside the `#bs-contact` div, right after the form/thanks block and right before the trust-line `<p>`:

```html
<a href="mailto:{{email}}" style="font-family:'JetBrains Mono',monospace;font-size:13px;color:#B0AFA9;text-decoration:none;border-bottom:1px solid rgba(176,175,169,0.35);padding-bottom:2px;transition:color 150ms cubic-bezier(.2,0,0,1),border-color 150ms cubic-bezier(.2,0,0,1);" style-hover="color:#F5F4F0;border-color:#F5F4F0;">{{email}}</a>
```

Delete this line completely. The trust-line `<p>` right after it stays.

---

## 2. REMOVE THE FOOTER

Find this whole block, right after `#bs-contact`'s closing `</div>` and the section's closing `</div>`, still inside `<section id="bs-closing">`:

```html
<footer style="position:relative;margin-top:110px;border-top:1px solid rgba(245,244,240,0.12);">
  <div style="max-width:1160px;margin:0 auto;padding:26px 32px 32px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
    <p style="margin:0;font-size:12.5px;color:#6B7280;">© 2026 Black Swan Solution UG (haftungsbeschränkt)</p>
    <nav aria-label="Legal" style="display:flex;gap:20px;">
      <a href="#" style="font-size:12.5px;color:#B0AFA9;text-decoration:none;" style-hover="color:#F5F4F0;">Impressum</a>
      <a href="#" style="font-size:12.5px;color:#B0AFA9;text-decoration:none;" style-hover="color:#F5F4F0;">Datenschutz</a>
      <a href="mailto:{{email}}" style="font-size:12.5px;color:#B0AFA9;text-decoration:none;" style-hover="color:#F5F4F0;">Kontakt</a>
    </nav>
  </div>
</footer>
```

Delete the entire `<footer>...</footer>` block.

**After deleting it, add bottom breathing room where the footer used to be** — the footer's own spacing (`margin-top:110px` plus its padding) was the only thing giving the page room to end gracefully below the trust line. Without it the page will feel like it stops abruptly. Add `padding-bottom: 120px;` (or similar, use your judgment for what looks balanced) to `<section id="bs-closing">` itself so the page still has a proper amount of space after the trust line before the page ends.

---

## QUALITY CHECKLIST

1. [ ] Visible `{{email}}` link under the contact form is gone
2. [ ] Entire `<footer>` element (copyright line + Impressum/Datenschutz/Kontakt nav) is gone — nothing legal/footer-related remains anywhere on the page
3. [ ] Contact form, thank-you state, and trust line are untouched and still work correctly
4. [ ] Page ends with reasonable bottom spacing below the trust line, not an abrupt cutoff
5. [ ] No leftover empty `<footer>` tags or dangling closing tags from the removal
6. [ ] No console errors
