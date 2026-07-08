# BLACKSWAN — WEBSITE 3 — SOLUTION 3D DIAGRAM: CONNECT TO IN/OUT + ADD SCALE/PLACE

## CONTEXT

The 3D scene in the Solution section (the wireframe "site" with glowing nodes) is visually cool but doesn't explain itself — confirmed by user testing, not just a hunch. Root causes, diagnosed in chat before this prompt:

1. The IN / OUT list (`.io-block`) directly above the 3D scene already tells the real story in words, but nothing visually ties it to the 3D scene below it — they read as two unrelated things.
2. The 3D scene only shows things flowing IN (the dotted particle trail). There's no visible OUT — the story stops halfway.
3. There's no sense of scale or place — plain dark boxes with no human reference and no site boundary don't read as "a real workplace" on their own.

This prompt covers two fixes only (deliberately not the more expensive "make the buildings themselves more recognizable" option — that's a separate future pass if this isn't enough):

- **Fix A:** visually connect the IN/OUT block to the 3D scene, and give the 3D scene its own visible IN and OUT.
- **Fix B:** add a simple human-scale figure and a site-boundary cue so the model reads as "a real place" at a glance.

---

## FIX A — CONNECT IN → SCENE → OUT

### A1. A connector between `.io-block` and `.solution-stage`

These two blocks are already adjacent siblings in `index.html` (the IO block sits directly above the 3D+steps block), so this can be a simple CSS-only element — no JS position math, no resize handling, works at every breakpoint:

```html
<!-- Between the closing </div> of .io-block and the opening <div class="solution-stage"> -->
<div class="io-connector" aria-hidden="true">
  <span class="io-connector-line"></span>
  <span class="io-connector-label">flows into this</span>
  <span class="io-connector-line"></span>
</div>
```

```css
.io-connector {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 280px;
  margin: 28px auto;
}
.io-connector-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-hover), transparent);
}
.io-connector-label {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  white-space: nowrap;
}
```

Reveal it the same way other `data-reveal` elements in this section fade in (add `data-reveal` to `.io-connector` and it'll pick up the existing scroll-animations.js reveal behavior automatically).

### A2. Give the 3D scene its own visible IN and OUT — don't rely only on the text above

Right now the scene only shows the incoming particle trail (the IN). Add a visible OUT so the scene completes its own story instead of trailing off:

**IN label** — small tag near where the flow trail enters the frame (upper-left, matching the existing `pathCurve` start), in `js/solution-3d.js` alongside the existing node-label HTML overlay approach (or the same technique if node labels from the previous pass are already in place — reuse that pattern):
```js
// One small "IN" tag positioned near the flow path's start point (world coords),
// projected to screen space the same way node labels are (see prior pass).
// Text: "IN" — style it visually distinct from the node number badges (e.g.
// plain small caps text, no circle background) so it doesn't get confused
// with the 01/02/03 node labels.
```

**OUT — this is new geometry, keep it simple.** Add a small glowing "output" marker on the opposite side of the site from where the flow enters — e.g. a small upward/outward-drifting particle or a subtle glowing ring emerging from the tallest building, moving away from the site toward the frame's bottom-right (mirroring the IN trail's direction of travel, just reversed and much shorter/simpler — this isn't a second full curved path, just a short outward drift so the eye reads "something comes out"). Pair it with an "OUT" label using the same small text-tag style as the IN label.

Keep both labels minimal — same visual weight as the node number badges from the previous pass, not competing headline elements. The goal is a visitor's eye can trace: IN (labeled) → site (labeled steps 01/02/03) → OUT (labeled), matching the IN/OUT list above almost 1:1.

---

## FIX B — ADD SCALE AND PLACE

Both additions go in `js/solution-3d.js`, in the same style as the existing low-poly wireframe buildings (`wireMat`/`solidMat`, `0xf97316` accent, consistent proportions) — don't introduce a different visual style.

### B1. A simple human-scale figure

Add one small low-poly figure standing near the building cluster, sized realistically against the buildings (buildings range roughly 1.0–2.8 units tall in the current `blueprint` array — a person should read as roughly 0.3–0.4 units tall by comparison, i.e. clearly small next to the structures). Keep it dead simple — a capsule or stacked-box humanoid silhouette is enough, this does not need articulation or detail:

```js
// Simple scale figure — a stack of two primitives is enough (body + head),
// styled to match the existing wireframe aesthetic (solid dark + wire overlay,
// same materials already defined as wireMat/solidMat).
const figureGeo = new THREE.CapsuleGeometry(0.09, 0.28, 4, 8);
const figureSolid = new THREE.Mesh(figureGeo, solidMat.clone());
figureSolid.position.set(1.0, 0.28, 1.4); // near the building cluster, clear of paths/nodes
const figureEdges = new THREE.EdgesGeometry(figureGeo);
const figureLine = new THREE.LineSegments(figureEdges, wireMat.clone());
figureLine.position.copy(figureSolid.position);
site.add(figureSolid);
site.add(figureLine);
```
Position it somewhere it won't be occluded by camera angle/controls limits (check against `controls.minPolarAngle`/`maxPolarAngle` — it should be visible from the default camera position and through the allowed drag range, not hidden behind a building).

### B2. A site-boundary cue

Keep the existing circular ground-glow disc (it looks good, don't remove it) but add a simple rectangular boundary outline around the building cluster so the ground reads as a bounded site/plot rather than an open glow puddle:

```js
const boundaryPts = [
  new THREE.Vector3(-3.4, 0.01, -3.0), new THREE.Vector3(3.4, 0.01, -3.0),
  new THREE.Vector3(3.4, 0.01, 2.6),   new THREE.Vector3(-3.4, 0.01, 2.6),
  new THREE.Vector3(-3.4, 0.01, -3.0)
];
const boundaryGeo = new THREE.BufferGeometry().setFromPoints(boundaryPts);
const boundaryMat = new THREE.LineDashedMaterial({
  color: 0xf97316, transparent: true, opacity: 0.25, dashSize: 0.25, gapSize: 0.15
});
const boundary = new THREE.Line(boundaryGeo, boundaryMat);
boundary.computeLineDistances(); // required for dashed lines to render correctly
scene.add(boundary);
```
Adjust the rectangle's corners so it comfortably encloses the `blueprint` building positions with a bit of margin (check against the actual `blueprint` array coordinates already in the file — don't just copy these numbers blind, verify against the current building layout).

---

## QUALITY CHECKLIST

1. [ ] A visible connector (line + "flows into this" label) sits between the IN/OUT block and the 3D scene, revealing in sync with the rest of the section
2. [ ] The 3D scene has its own small "IN" label near the flow trail's entry point
3. [ ] The 3D scene has a new, simple "OUT" cue (a short outward drift/glow, opposite side from IN) with its own label
4. [ ] IN/OUT labels are visually distinct from the 01/02/03 node badges (no confusion between the two label types)
5. [ ] A simple human-scale figure stands near the buildings, proportioned so it clearly reads as much smaller than the structures
6. [ ] The figure is visible from the default camera angle and stays visible through the allowed drag range
7. [ ] A dashed rectangular boundary line encloses the building cluster on the ground plane, sized to actually fit around the buildings with reasonable margin
8. [ ] Existing ground-glow disc is untouched/still visible
9. [ ] All of the above respects the existing mobile fallback (hidden when the 3D scene itself is hidden) and reduced-motion/performance-tier behavior — no new always-on effects that weren't accounted for in the tier system
10. [ ] No console errors
