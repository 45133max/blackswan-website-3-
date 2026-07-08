# BLACKSWAN — WEBSITE 3 — PERFORMANCE / BUGFIX PASS

## CONTEXT

The site is functionally complete and matches the original build spec (`CURSOR_PROMPT_website3.md`) — all content, sections, and animation systems are in place. On real hardware (desktop browser, foregrounded tab) it's reported as buggy: stuttering / low frame rate, and moments where things pause or get stuck. This isn't one bug — it's several concurrent systems (2D particle canvas, WebGL 3D scene, multiple global mousemove listeners, scroll-triggered state changes) all running at once without any coordination or performance budget. "It's too much running at the same time" is the correct diagnosis.

**Three fixes have already been made directly in the codebase** (in `js/particle-field.js` and `js/main.js`) — don't revert these, build on top of them:

1. **Removed a duplicate section-state detector.** `particle-field.js` had its own `IntersectionObserver` deciding when to switch particle states (chaos → clusters → transfer → constellation → logo), running *at the same time* as `scroll-animations.js`'s `ScrollTrigger`-based version. Two independent systems were both calling `setState()` near section boundaries, sometimes disagreeing, causing the particle system to flip-flop/thrash mid-scroll. The `IntersectionObserver` fallback now only runs if GSAP/ScrollTrigger failed to load at all; otherwise ScrollTrigger is the single source of truth.
2. **Fixed per-frame allocation in the particle connecting-line grid.** The 2D particle system rebuilt a spatial grid (`new Array(cols*rows)` plus a fresh `[]` per populated cell) on *every single animation frame* at 60fps. That's continuous garbage generation, which triggers periodic GC pauses — a classic cause of the exact "random little freeze" pattern being reported. The grid is now built once per resize and its buckets are cleared (`.length = 0`) and reused every frame instead of reallocated.
3. **Consolidated the magnetic-button cursor tracking.** There are 3 buttons with `data-magnetic` (nav CTA, hero CTA, closing CTA). Each one had its *own* `window.addEventListener('mousemove', ...)` that called `getBoundingClientRect()` on every single mouse-movement event, anywhere on the page — `getBoundingClientRect()` forces a synchronous layout read. That's 2-3 forced layout reads per mouse-move event, continuously, whether or not the cursor was anywhere near a button. This is now one shared `mousemove` listener; each button's bounding rect is cached and only recomputed on resize/scroll (via a single rAF-queued refresh), not on every pointer move.

Re-test after these three before assuming more work is needed — they were the highest-probability causes. If it's still janky, here's what's left to tighten up.

---

## REMAINING WORK

### 1. Card-tilt has the same rect-read pattern, smaller blast radius
`initCardTilt()` in `main.js` calls `card.getBoundingClientRect()` on every `mousemove` event *on the card itself* (not the whole window), so it's bounded to whenever the cursor is over one of the 3 problem cards — lower impact than the magnetic-button bug, but the same fix applies for consistency: cache the rect on `mouseenter` (or on scroll/resize), don't recompute it on every move inside the card.

### 2. Two heavy render loops run concurrently during the Solution section
While the Solution section is in view, the 2D particle canvas (`particle-field.js`) is still simulating full physics for ~1600 (desktop) particles every frame — even though `globalAlpha` has faded toward 0 and nothing from it is visually drawn once fully faded. Check `js/particle-field.js`'s `tick()`: once `globalAlpha < 0.005 && targetGlobalAlpha === 0`, it already skips drawing — confirm it's also skipping the *entire* per-particle physics loop (wander/target-pull/cursor-repel math for ~1600 particles) during that state, not just the draw calls, so the 2D system is doing effectively nothing while the WebGL scene owns the section. If the physics loop still runs while faded, gate it behind the same early-return.

### 3. GPU buffer re-uploads every frame in the 3D scene
In `js/solution-3d.js`, the `flow` (220 points) and `amb` (260 points) point clouds call `.needsUpdate = true` on their full position buffer every single frame, forcing a re-upload to the GPU each time. This is probably fine on modern hardware but is worth a real check on a mid-range laptop (not just whatever machine you're developing on) — if there's still visible jank specifically while the 3D scene is active/being dragged, try updating these buffers only every 2nd frame (halves the upload rate, motion will still read as smooth at this point count and speed) and measure again before doing anything more invasive.

### 4. No performance budget / capability check
Right now the only branch is mobile vs. desktop (`window.innerWidth < 768`). A mid-range or older desktop/laptop gets the full experience — full particle count, full 3D scene, all micro-interactions — same as a high-end machine. Add a lightweight one-time capability check on load (e.g. a lightweight rAF-based FPS sample over the first ~1 second, and/or checking `navigator.hardwareConcurrency`) that drops into a "reduced" tier on weaker hardware: fewer particles, disable card-tilt/cursor-glow, and/or disable the 3D scene's `antialias`/auto-rotate. Don't overbuild this — a simple two-tier system (full / reduced) is enough, not a complex adaptive quality system.

### 5. Testing instruction — this matters as much as the code changes
Test by actually scrolling at a normal human pace through the entire page **while moving the mouse around** (that combination — scroll + cursor movement + a section transition happening — is what surfaces jank; sitting still and just scrolling, or just wiggling the mouse without scrolling, will both look fine and hide the real problem). Test on whatever is the least powerful machine available, not just the primary dev machine — a fix that looks smooth on a high-end laptop can still stutter badly on ordinary hardware, which is the actual audience for this site.

---

## QUALITY CHECKLIST FOR THIS PASS

1. [ ] Confirm only one system (ScrollTrigger) drives particle section-state changes when GSAP is available
2. [ ] Confirm the particle connecting-line grid is not reallocated per frame (check for `new Array` inside `tick()`/the render loop — there should be none)
3. [ ] Confirm magnetic buttons use cached rects, not per-mousemove `getBoundingClientRect()`
4. [ ] Card tilt uses cached/throttled rects
5. [ ] 2D particle physics loop fully idles (not just stops drawing) once faded out during the Solution section
6. [ ] Scroll + mouse-move test on a mid-range machine shows no stutter/freeze through the full page
7. [ ] Mobile behavior unchanged (still no 3D scene, still reduced particle count, still no cursor-dependent effects)
8. [ ] No console errors
