# BLACKSWAN — WEBSITE 3 — SOLUTION SECTION: SCROLL PACING + DIAGRAM CLARITY

## CONTEXT

Two pieces of feedback on the Solution section's pinned 3D step-through, from actually using the live site:

1. **Too much scrolling per step.** Right now it takes a long, sustained scroll to move from step 01 to 02 to 03, and the section won't release into normal scroll until all three are done. The idea is good, just needs to be tighter — closer to "one scroll gesture advances one step" than a long scrub.
2. **The 3D diagram is cool but unclear.** A first-time visitor has no way to know what they're looking at or what the glowing dots mean. It needs a lightweight way to explain itself in place, without turning it into a wall of text.

---

## FIX 1 — SHORTEN + SNAP THE PINNED STEP-THROUGH

In `js/scroll-animations.js`, find the Solution pin setup:

```js
ScrollTrigger.create({
  trigger: stage,
  start: 'top top+=80',
  end: () => `+=${window.innerHeight * (stepCount + 0.6)}`,
  pin: true,
  pinSpacing: true,
  anticipatePin: 1,
  scrub: 0.35,
  onUpdate: (self) => { ... }
  ...
});
```

For 3 steps, `end` currently works out to `window.innerHeight * 3.6` — i.e. roughly 3.6 full viewport-heights of scrolling to get through all three steps. Cut that down and add snapping so the section advances in clean, discrete jumps instead of a long continuous scrub:

```js
ScrollTrigger.create({
  trigger: stage,
  start: 'top top+=80',
  end: () => `+=${window.innerHeight * (stepCount * 0.55 + 0.25)}`,  // ~1.9vh total for 3 steps, was ~3.6vh
  pin: true,
  pinSpacing: true,
  anticipatePin: 1,
  scrub: 0.5,
  snap: {
    snapTo: 1 / (stepCount - 1),   // snaps to 0, 0.5, 1 for 3 steps
    duration: { min: 0.2, max: 0.45 },
    ease: 'power1.inOut',
    delay: 0.05
  },
  onUpdate: (self) => { ... }  // keep existing logic here
  ...
});
```

Notes:
- The exact multiplier (`0.55`) is a starting point, not gospel — the goal is "a single normal scroll gesture (one wheel tick, one trackpad swipe) reliably advances one step." Tune it up or down after testing on a real trackpad and a real mouse wheel, they behave differently.
- `snap` needs GSAP's `ScrollTrigger` snap feature (already available since `ScrollTrigger.min.js` is loaded) — no new dependency.
- Keep the existing `onUpdate` step-activation logic (`activeIdx` calculation, `.is-active` toggling, `window.BS.solution3d.setStepProgress(p)`) exactly as-is — only the `end` distance and the addition of `snap` change.
- Re-test the mobile branch (the non-pinned, IntersectionObserver-based step reveal further down in the same file) — it's untouched by this change and should still work, just confirm nothing regressed.

---

## FIX 2 — MAKE THE 3D DIAGRAM EXPLAIN ITSELF

Two additions, both lightweight — don't turn this into a legend/tooltip system.

### 2a. A one-line caption that tells the visitor what they're looking at

Add a short caption inside `.solution-canvas-wrap` (or directly above/below it — wherever reads cleanest without crowding the "Drag to rotate" hint), styled small and muted like the other secondary text on the page:

```html
<p class="solution-canvas-caption">A live 3D model of your site — the glowing points mark where each step below happens.</p>
```
Position it so it's clearly associated with the 3D frame (e.g. directly above the canvas, or as a caption bar under it) but doesn't compete with "Drag to rotate" for attention — that hint should stay focused on the interaction, this new line explains the concept.

### 2b. Number the glowing nodes to match the step list (01 / 02 / 03)

Right now the three glowing nodes in `js/solution-3d.js` are unlabeled spheres — the only link to the step cards on the right is timing (a node brightens when its step is active), which isn't enough for a visitor to parse at a glance. Add a small floating label at each node showing its matching number (`01`, `02`, `03` — same numerals already used in `.step-num` on the step cards), so the connection is immediate and visual, not inferred.

Implementation approach — project each node's 3D position to 2D screen space every frame and position an HTML label over the canvas (standard Three.js technique, don't try to render text inside WebGL):

```js
// One HTML label per node, absolutely positioned over .solution-canvas-wrap
// (create these once, outside the render loop; update their left/top every frame)
const labelEls = nodes.map((n, i) => {
  const el = document.createElement('div');
  el.className = 'solution-node-label';
  el.textContent = String(i + 1).padStart(2, '0');
  wrap.appendChild(el);
  return el;
});

// Inside the existing frame() loop, after controls.update():
const tmpVec = new THREE.Vector3();
nodes.forEach((n, i) => {
  tmpVec.copy(n.group.position).project(camera);
  const x = (tmpVec.x * 0.5 + 0.5) * canvas.clientWidth;
  const y = (-tmpVec.y * 0.5 + 0.5) * canvas.clientHeight;
  labelEls[i].style.transform = `translate(${x}px, ${y}px)`;
  labelEls[i].style.opacity = String(0.3 + n.active * 0.7);  // brighter when its step is active
});
```

```css
.solution-canvas-wrap { position: relative; } /* should already be relative — confirm */
.solution-node-label {
  position: absolute;
  top: 0; left: 0;
  transform: translate(-50%, -50%);
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  color: var(--accent-primary);
  background: rgba(10,10,10,0.65);
  border: 1px solid rgba(249,115,22,0.4);
  border-radius: 100px;
  width: 22px; height: 22px;
  display: flex; align-items: center; justify-content: center;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
```

Keep it purely visual/informational (`pointer-events: none`) — don't make these clickable or add hover states, that's scope creep for what's meant to be a quick "oh, that's what the dots mean" moment.

Also make sure these labels are hidden/removed entirely in the mobile fallback state (`solution-fallback`) — they only make sense next to the live 3D scene.

---

## QUALITY CHECKLIST

1. [ ] Scrolling through the 3 Solution steps takes noticeably less scroll distance than before (~1.9 viewport-heights total instead of ~3.6)
2. [ ] Scroll snaps cleanly to each step (0 / 0.5 / 1 progress) rather than leaving the user stuck at an in-between state
3. [ ] Section still releases into normal scroll correctly after step 3
4. [ ] Mobile (non-pinned) step reveal still works, unaffected
5. [ ] A short caption near the 3D frame explains what it is, without crowding "Drag to rotate"
6. [ ] Each glowing node shows a small `01`/`02`/`03` label matching the step cards, brightening when that step is active
7. [ ] Node labels are hidden on the mobile/no-WebGL fallback
8. [ ] No console errors, no layout shift/jank introduced by the label positioning code
