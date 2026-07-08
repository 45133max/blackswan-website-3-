# BLACKSWAN WEBSITE REDESIGN — REPLACE LOGO ICON EVERYWHERE

## CONTEXT

**Working folder:** `C:\Users\alber_u5z2z37\OneDrive\Documents\Maastricht IB\BlackSwan 2\BlackSwan Website Redesign\`
**Target file:** `BlackSwan Website.dc.html`

**New logo asset:** `assets/logo.svg` — a real, verified vector trace of the actual brand logo (shield + swan silhouette only, no text, no rule lines), colored to match the site exactly:

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 428 434" width="428" height="434">
  <path d="[shield outline path]" fill="#F5F4F0" fill-rule="evenodd"></path>
  <path d="[swan silhouette path]" fill="#F05A1A" fill-rule="evenodd"></path>
</svg>
```
(Full path data is already in `assets/logo.svg` — reference that file directly rather than retyping the coordinates; the two paths above are exactly what needs to go into each replacement below, just resized via the wrapping `<svg>`'s `width`/`height`/`viewBox`.)

This replaces the current abstract flame/swirl icon (the paths currently starting `M43.4 13.8C36.8 14.9 31...`) everywhere it appears. That old icon is not the real logo and should not remain anywhere in the file after this change.

**Three places to replace:**
1. Nav bar, top-left (small, next to the wordmark)
2. Hero section, the large centered crest
3. Closing section, above "We don't just sell training."

The user explicitly said the replacements can be noticeably bigger than the current icons, not just a like-for-like size swap — use your judgment for what reads well in each spot, erring toward bigger/more present rather than timid.

---

## 1. NAV LOGO (top-left)

Current:
```html
<a href="#bs-hero" aria-label="Black Swan Solutions home" style="display:flex;align-items:center;gap:11px;text-decoration:none;">
  <svg width="26" height="30" viewBox="0 0 200 230" fill="none" aria-hidden="true">
    <path d="M100 12 L174 32 L174 100 C174 152 146 188 100 210 C54 188 26 152 26 100 L26 32 Z" stroke="#F5F4F0" stroke-width="10" fill="none" stroke-linejoin="round"></path>
    <g transform="translate(14.1 23) scale(2.55)">
      <!-- old flame icon paths -->
    </g>
  </svg>
  <span style="display:flex;align-items:baseline;gap:8px;">
    <span style="font-weight:800;font-size:14px;letter-spacing:0.08em;color:#F5F4F0;">BLACK SWAN</span>
    <span style="font-family:'JetBrains Mono',monospace;font-weight:600;font-size:10px;letter-spacing:0.22em;color:#F59A5A;">SOLUTIONS</span>
  </span>
</a>
```

Replace the `<svg>` block only (leave the `<a>` wrapper, the `<span>` wordmark, and the `gap:11px` layout untouched) with the new logo, sized to sit comfortably next to the existing 14px wordmark — around 30-32px tall, width auto-scaled to the new logo's aspect ratio (428:434, close to square):

```html
<svg width="30" height="30" viewBox="0 0 428 434" aria-hidden="true">
  <path d="[shield path from assets/logo.svg]" fill="#F5F4F0" fill-rule="evenodd"></path>
  <path d="[swan path from assets/logo.svg]" fill="#F05A1A" fill-rule="evenodd"></path>
</svg>
```

---

## 2. HERO CREST (large, centered)

Current:
```html
<svg width="148" height="170" viewBox="0 0 200 230" fill="none" role="img" aria-label="Black Swan Solutions crest">
  <path data-anim d="M100 12 L174 32 L174 100 C174 152 146 188 100 210 C54 188 26 152 26 100 L26 32 Z" fill="#141414" stroke="none" style="animation:bsFade 700ms cubic-bezier(.2,0,0,1) 350ms both;"></path>
  <path data-anim d="M100 12 L174 32 L174 100 C174 152 146 188 100 210 C54 188 26 152 26 100 L26 32 Z" stroke="#F5F4F0" stroke-width="6" fill="none" stroke-linejoin="round" stroke-dasharray="560" stroke-dashoffset="560" style="animation:bsDraw 1000ms cubic-bezier(.2,0,0,1) 100ms both;"></path>
  <path data-anim d="M100 24 L164 41 L164 100 C164 146 140 178 100 198 C60 178 36 146 36 100 L36 41 Z" stroke="#F5F4F0" stroke-width="1.5" opacity="0.45" fill="none" stroke-linejoin="round" stroke-dasharray="490" stroke-dashoffset="490" style="animation:bsDraw 900ms cubic-bezier(.2,0,0,1) 400ms both;"></path>
  <g data-anim style="animation:bsRise 750ms cubic-bezier(.2,0,0,1) 650ms both;">
    <g transform="translate(14.1 23) scale(2.55)">
      <!-- old flame icon paths -->
    </g>
  </g>
  <g data-anim transform="translate(14.1 23) scale(2.55)" style="animation:bsFade 400ms cubic-bezier(.2,0,0,1) 1250ms both;">
    <!-- old beak accent -->
  </g>
</svg>
```

This one has a real entrance choreography — a dark shield fill fades in, a shield outline "draws itself" via `stroke-dasharray`/`stroke-dashoffset`, a fainter inner shield outline draws in slightly after, then the icon inside rises and fades in. That draw-on-stroke trick works because the current shield is a *stroked line*, not a filled shape. The new logo's shield is a *filled* shape (two nested boundaries forming the outline via `fill-rule="evenodd"`), so the exact same stroke-dasharray technique doesn't apply directly to it.

**Don't force it — simplify cleanly instead.** Keep the same *rhythm* (something appears first, something more detailed follows, timed similarly to the existing 350ms → 1250ms sequence) but implement it as the new logo's two paths fading/rising in with a slight stagger, reusing the existing `bsFade` and `bsRise` keyframes already defined in the page (don't invent new keyframes):

```html
<svg width="220" height="223" viewBox="0 0 428 434" role="img" aria-label="Black Swan Solutions crest">
  <path data-anim d="[shield path]" fill="#F5F4F0" fill-rule="evenodd" style="animation:bsFade 700ms cubic-bezier(.2,0,0,1) 350ms both;"></path>
  <path data-anim d="[swan path]" fill="#F05A1A" fill-rule="evenodd" style="animation:bsRise 750ms cubic-bezier(.2,0,0,1) 650ms both;"></path>
</svg>
```

Sizing: the user explicitly wants this bigger than the current 148×170 — use roughly 210-230px tall (proportional width per the 428:434 aspect ratio, so close to square) unless that visually overwhelms the space above the "BLACK SWAN" wordmark text that follows it; adjust down slightly only if it collides with the wordmark spacing, otherwise err big.

---

## 3. CLOSING SECTION LOGO

Current:
```html
<svg data-reveal width="56" height="64" viewBox="0 0 200 230" fill="none" aria-hidden="true">
  <path d="M100 12 L174 32 L174 100 C174 152 146 188 100 210 C54 188 26 152 26 100 L26 32 Z" fill="#141414" stroke="#F5F4F0" stroke-width="7" stroke-linejoin="round"></path>
  <g transform="translate(14.1 23) scale(2.55)">
    <!-- old flame icon paths -->
  </g>
</svg>
```

Replace with the new logo, bigger than the current 56×64 — around 90-100px tall reads well as a closing-moment mark above "We don't just sell training." Keep `data-reveal` on the root `<svg>` so it still fades in with the rest of that section's scroll-reveal sequence:

```html
<svg data-reveal width="96" height="97" viewBox="0 0 428 434" aria-hidden="true">
  <path d="[shield path]" fill="#F5F4F0" fill-rule="evenodd"></path>
  <path d="[swan path]" fill="#F05A1A" fill-rule="evenodd"></path>
</svg>
```

---

## GENERAL NOTES

- Pull the actual path `d="..."` data from `assets/logo.svg` directly (it's long — copy it exactly, don't retype/approximate it by hand).
- Every old occurrence of the flame-icon paths (the ones starting `M43.4 13.8C36.8 14.9 31...` and its sibling paths/circle/beak-triangle) should be gone from the file after this change — search the whole file to make sure none are left behind in a spot that got missed.
- Favicon: check if there's a `<link rel="icon">` anywhere referencing the old mark or a separate favicon asset — if one exists, update it to the new logo too; if there isn't one in this file, skip it, don't add a new feature that wasn't asked for.
- Don't touch the wordmark text ("BLACK SWAN" / "SOLUTIONS") anywhere — only the icon graphic changes.

---

## QUALITY CHECKLIST

1. [ ] Nav logo replaced, ~30px tall, sits correctly next to the wordmark with existing spacing intact
2. [ ] Hero crest replaced, sized noticeably bigger than before (~210-230px tall), entrance animation reuses existing `bsFade`/`bsRise` keyframes with a similar staggered feel to the original
3. [ ] Closing section logo replaced, sized bigger than before (~90-100px tall), keeps `data-reveal` scroll-fade behavior
4. [ ] No leftover instances of the old flame-icon path data anywhere in the file
5. [ ] Colors match exactly: shield `#F5F4F0`, swan `#F05A1A` — no accidental color drift
6. [ ] Page still loads and scrolls with no console errors
