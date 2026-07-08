# BLACKSWAN WEBSITE REDESIGN — MAKE MOBILE-FRIENDLY, ZERO DESKTOP CHANGES

## CONTEXT

**Working folder:** `C:\Users\alber_u5z2z37\OneDrive\Documents\Maastricht IB\BlackSwan 2\BlackSwan Website Redesign\`
**Target file:** `BlackSwan Website.dc.html`

**Hard constraint, more important than anything else in this prompt: the desktop/laptop experience must not change in any way — not visually, not behaviorally, not timing-wise.** Every single change below must be scoped so it only applies below a `768px` breakpoint. The technique: add a small number of new `id`/`class` hooks where none exist yet (listed exactly below — don't invent your own naming), then add ONE new `@media (max-width: 768px) { ... }` block to the existing `<style>` tag already in `<helmet>` (don't create a second `<style>` block). Because this file uses inline `style="..."` attributes almost everywhere, the media-query rules need `!important` to win against them — that's expected and correct here, not a hack to avoid.

Also gate the two scroll-jacking JS blocks (funnel scrub, horizontal steps scrub) behind a mobile check so they don't run at all below 768px — CSS alone isn't enough, because the JS would otherwise keep writing inline `transform`/`opacity` values onto elements that are no longer pinned, causing visual glitches on top of the CSS fix.

Currently, on mobile, three things are broken:
1. The Problem cards (and the Team cards, if `#bs-team` exists in the file by the time you run this) are forced into 3 equal columns — squeezed unreadably narrow on a phone.
2. The "Solution" funnel section relies on `position: sticky` + scroll-driven JS math — fragile/broken on mobile (address bar resize, touch scroll behavior, iOS Safari quirks with `100vh`).
3. The "How it's built" horizontal-scroll-jacked section has the exact same problem, plus its 3 steps are laid out `300vw` wide side by side — completely unusable on a touch screen.

Fix: below 768px, both scroll-jacked sections un-pin and become normal vertically-stacked content (no pinning, no horizontal translation, no scroll-scrubbed opacity) — everything just becomes visible and flows top to bottom like a normal page. Above 768px, nothing changes.

---

## 1. ADD THESE IDS/CLASSES (small, safe, additive edits — don't change any existing attributes, just add the new one alongside)

- On the Problem cards' grid container (`style="margin-top:56px;display:grid;grid-template-columns:repeat(3, 1fr);gap:24px;align-items:start;"`), add `class="bs-grid-3"`.
- On the Team cards' grid container, if `#bs-team` exists in the file (`style="margin-top:56px;display:grid;grid-template-columns:repeat(3, 1fr);gap:24px;text-align:left;"`), add `class="bs-grid-3"` there too — same class, reused.
- On the sticky wrapper `<div>` directly inside `#bs-solution` (the one with `style="position:sticky;top:0;height:100vh;overflow:hidden;display:flex;flex-direction:column;align-items:center;padding:84px 32px 28px;box-sizing:border-box;"`), add `id="bsSolutionSticky"`.
- On the sticky wrapper `<div>` directly inside `#bs-how` (`style="position:sticky;top:0;height:100vh;overflow:hidden;"`), add `id="bsHowSticky"`.
- On the floating "HOW IT'S BUILT" header block inside that sticky wrapper (`style="position:absolute;top:56px;left:0;right:0;text-align:center;z-index:3;pointer-events:none;"`), add `id="bsHowHeader"`.
- On the step-indicator wrapper at the bottom of `#bs-how` (`style="position:absolute;bottom:34px;left:0;right:0;display:flex;justify-content:center;gap:18px;z-index:3;"`), add `id="bsStepIndicator"`.

---

## 2. NEW MEDIA QUERY — ADD TO THE EXISTING `<style>` BLOCK IN `<helmet>`

```css
@media (max-width: 768px) {

  /* 3-column card grids become single column */
  .bs-grid-3 {
    grid-template-columns: 1fr !important;
  }

  /* Funnel section: un-pin, let it flow normally */
  #bs-solution {
    height: auto !important;
  }
  #bsSolutionSticky {
    position: static !important;
    height: auto !important;
    overflow: visible !important;
    padding: 64px 24px 48px !important;
  }
  #bsChipRow {
    flex-wrap: wrap !important;
    justify-content: center !important;
  }
  #bsFunnel {
    width: min(320px, 80%) !important;
  }
  #bsOut {
    opacity: 1 !important;
    transform: none !important;
    margin-top: 32px !important;
  }

  /* How-it's-built section: un-pin, stack the 3 steps vertically */
  #bs-how {
    height: auto !important;
  }
  #bsHowSticky {
    position: static !important;
    height: auto !important;
    overflow: visible !important;
  }
  #bsHowHeader {
    position: static !important;
    padding: 56px 24px 0 !important;
  }
  #bsTrack {
    width: 100% !important;
    flex-direction: column !important;
  }
  #bsTrack > div {
    width: 100% !important;
    height: auto !important;
    padding: 48px 24px !important;
  }
  #bsPc0, #bsPc1, #bsPc2 {
    opacity: 1 !important;
    transform: none !important;
    grid-template-columns: 1fr !important;
    gap: 32px !important;
  }
  #bsStepIndicator {
    display: none !important;
  }
}
```

A few of these values (padding numbers, `#bsFunnel` width) are reasonable starting points, not exact requirements — adjust them if something looks visually off once rendered, the important thing is the structural fix (single column, un-pinned, no horizontal overflow), not these exact pixel values.

---

## 3. JS — SKIP THE SCROLL-JACKING LOGIC ON MOBILE

Inside `componentDidMount()`, near the top where `reduced` is already computed, add a sibling mobile check:

```js
const isMobile = w.matchMedia && w.matchMedia('(max-width: 768px)').matches;
```

Then wrap the two scroll-scrub blocks inside the `frame()` function so they're skipped entirely on mobile — find:

```js
// ---- Funnel scrub ----
if (solution) {
  ...
}
```
and
```js
// ---- Horizontal steps ----
if (how && track) {
  ...
}
```

Change both conditions to also require `!isMobile`:
```js
if (solution && !isMobile) {
  ...
}
```
```js
if (how && track && !isMobile) {
  ...
}
```

Leave the nav chrome logic (the `if (nav) {...}` block at the top of `frame()`) untouched — that one's fine on mobile as-is, it's just a background/blur toggle on scroll, not part of the pinning problem.

---

## 4. QUICK CHECK — NAV ON NARROW SCREENS

Take a look at the nav bar (logo + "BLACK SWAN SOLUTIONS" wordmark on the left, "Get in touch" button on the right) at a 375px viewport width. If it overflows or wraps awkwardly, add a small additional rule inside the same media query to tighten it up (e.g. reduce the `gap`/padding, or shrink the wordmark font-size slightly) — but only touch this if it's actually broken; if it already fits fine at 375px, leave it alone.

---

## QUALITY CHECKLIST

1. [ ] **Desktop (1440px and above): pixel-identical to before this change — verify by comparing before/after screenshots.** This is the top priority; if anything looks different above 768px, that's a bug, not an acceptable tradeoff.
2. [ ] Mobile (375px): Problem cards stack in a single column, fully readable
3. [ ] Mobile: Team cards (if present) stack in a single column
4. [ ] Mobile: funnel section is no longer pinned — IN chips wrap instead of overflowing, funnel SVG is appropriately sized, OUT card is visible without needing to scroll-trigger it
5. [ ] Mobile: "how it's built" section is no longer pinned — all 3 steps stack vertically, fully visible, no `300vw` horizontal overflow, no clipped/cut-off content
6. [ ] Mobile: step-indicator dots (bottom of the how-it's-built section) are hidden, since they only make sense during the desktop pinned/scrubbed experience
7. [ ] Mobile: nav doesn't overflow or wrap awkwardly at 375px
8. [ ] No horizontal scrollbar anywhere on mobile at any point on the page
9. [ ] No console errors on either desktop or mobile
10. [ ] Test at 375px (small phone), 768px (the breakpoint edge itself — should look like the mobile version, not desktop), and 1440px (desktop, must be unchanged)
