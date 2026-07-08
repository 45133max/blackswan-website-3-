# BLACKSWAN — WEBSITE 3 — REDUCE PARTICLE LOAD (still laggy on real hardware)

## CONTEXT

The previous performance pass (`CURSOR_PROMPT_performance_fixes.md`) is in and helped — the duplicate state-detector, the grid-allocation fix, the magnetic-button rect caching, and a two-tier `full`/`reduced` performance system (`window.BS.perfTier`, set in `index.html`'s `<head>`) are all in place and working as intended.

It's still laggy on Bert's real machine. Checked the current tier heuristic:

```js
var cores = navigator.hardwareConcurrency || 8;
var mem = navigator.deviceMemory || 8;
var mobile = window.innerWidth < 768;
var reduced = mobile || cores <= 4 || mem <= 4;
window.BS.perfTier = reduced ? 'reduced' : 'full';
```

This is a static, coarse guess — it qualifies plenty of ordinary laptops as `full` tier (which still runs 1600 2D particles with connecting lines, plus a 220+260-point Three.js scene with antialiasing and auto-rotate) even when the machine can't actually sustain that in real time. Core count and RAM don't reliably predict real-time graphics performance — integrated GPUs, high-DPI/high-res displays, thermal throttling, and background load all matter more and none of them are being checked. That mismatch is very likely why it still feels heavy even on a "full tier" machine. Fix this two ways: cut the baseline counts further (the direct ask), and make tier assignment based on a real measurement instead of a guess (the durable fix).

---

## 1. CUT PARTICLE COUNTS FURTHER (do this regardless of the tier-detection fix)

In `js/particle-field.js`, change the `CFG.count` values:

```js
// Current:
count: isMobile ? 600 : (isReducedTier ? 900 : 1600),
// Change to:
count: isMobile ? 400 : (isReducedTier ? 500 : 1000),
```

Also tighten the connecting-line pass — it's already flagged in the code comments as the single most expensive part of this system:

```js
// Current:
connectDist: (!isMobile && !isReducedTier) ? 90 : 0,
// Change to:
connectDist: (!isMobile && !isReducedTier) ? 70 : 0,
```

A smaller `connectDist` shrinks the neighbor-search radius, which cuts the number of line-distance checks per frame quadratically-ish, not just linearly — this is a bigger win than it looks.

In `js/solution-3d.js`, cut the **full-tier** point counts too (right now only `reduced` tier gets a cut — `full` still runs the original 220+260):

```js
// Current:
const FLOW_COUNT = isReducedTier ? 110 : 220;
// Change to:
const FLOW_COUNT = isReducedTier ? 90 : 160;
```
```js
// Current (ambient cloud is skipped entirely on reduced tier already — just cut the full-tier count):
const AMB_COUNT = 260;
// Change to:
const AMB_COUNT = 180;
```

## 2. REPLACE THE STATIC TIER GUESS WITH A REAL MEASUREMENT

Keep the existing static check as a fast first pass (mobile / low core+mem still goes straight to `reduced`), but add a short real-world FPS probe that can downgrade a machine the static check called `full` if it's actually struggling. Do this in `index.html`'s perf-tier script, or move the probe into `main.js` if that's cleaner — whichever fits the existing structure better, but it needs to run and settle **before** `particle-field.js` and `solution-3d.js` read `window.BS.perfTier` at their own init time (currently both read it once, synchronously, at script start — so either delay their init until the probe resolves, or have them re-check/rebuild if the tier flips shortly after load; pick whichever is less invasive to the existing code).

Approach:
```js
// After the existing static check sets window.BS.perfTier, sample real frame
// timing for ~1 second using requestAnimationFrame deltas. If the average
// frame time indicates well under ~45fps, downgrade full -> reduced (never
// upgrade reduced -> full from this probe; the static check already covers
// the obvious low-end cases).
function probeAndAdjust() {
  if (window.BS.perfTier !== 'full') return; // already reduced, nothing to do
  let frames = 0, start = performance.now(), last = start;
  function sample(now) {
    frames++;
    const elapsed = now - start;
    if (elapsed < 900) {
      requestAnimationFrame(sample);
      return;
    }
    const avgFps = frames / (elapsed / 1000);
    if (avgFps < 45) {
      window.BS.perfTier = 'reduced';
      window.dispatchEvent(new CustomEvent('bs:tier-downgraded'));
    }
  }
  requestAnimationFrame(sample);
}
```

Have `particle-field.js` and `solution-3d.js` listen for `bs:tier-downgraded` and rebuild themselves at the reduced-tier settings if it fires after they've already initialized (simplest approach: on that event, just re-run each module's own init/setup function with the now-updated `isReducedTier` value — don't build a whole new dynamic-reconfiguration system for this, a one-time rebuild-on-downgrade is enough).

## 3. TESTING

After both changes: reload on Bert's actual machine, scroll the full page while moving the mouse, and check DevTools Performance tab for a real FPS reading across the whole scroll — don't eyeball it. If it's still below ~50fps sustained on his machine even at the new lower counts, that's a signal to drop the numbers further rather than add more tiers/complexity — simpler and fewer particles beats a more elaborate system here.

---

## QUALITY CHECKLIST

1. [ ] `full` tier particle count is 1000 (was 1600), `reduced` is 500 (was 900), mobile is 400 (was 600)
2. [ ] `connectDist` is 70 on full tier (was 90)
3. [ ] Three.js `FLOW_COUNT` is 160 on full tier (was 220), `AMB_COUNT` is 180 (was 260)
4. [ ] A real FPS probe runs after the static tier check and can downgrade `full` → `reduced` (never the reverse)
5. [ ] Both `particle-field.js` and `solution-3d.js` respond correctly if the tier downgrades shortly after their own init
6. [ ] Verified with DevTools Performance tab (not just eyeballing) that sustained FPS is meaningfully better on Bert's machine during scroll + mouse movement
7. [ ] Mobile and already-reduced-tier behavior unchanged
8. [ ] No console errors
