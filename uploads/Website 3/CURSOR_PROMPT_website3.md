# BLACKSWAN — WEBSITE 3 — FULL BUILD PROMPT (single homepage, "crazy" scroll-cinematic build)

## WHAT THIS IS

Build ONE homepage — no subpages, no nav to other routes. Everything lives on a single, long, scroll-driven `index.html`. This replaces the current live site's content (which is outdated) but should reuse and elevate the visual language of the current/previous build — dark, ember/orange, premium, confident. Nothing here should feel like a generic SaaS template.

**All code, assets, and files go in:**
```
C:\Users\alber_u5z2z37\OneDrive\Documents\Maastricht IB\BlackSwan 2\Website 3\
```

**Stack:** Vanilla HTML/CSS/JS. No React/Next/build step — this must run by opening `index.html` or serving the folder statically (e.g. `npx serve`). Use CDN imports for libraries:
- **GSAP + ScrollTrigger + ScrollToPlugin** (animation/scroll orchestration)
- **Three.js (via ES module CDN + import map)** for the WebGL centerpiece in the Solution section

```html
<!-- In <head>, use an import map for Three.js as ES modules -->
<script type="importmap">
{
  "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
  }
}
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js"></script>
```

Use `OrbitControls` from `three/addons/controls/OrbitControls.js` for the draggable 3D moment in the Solution section.

### File structure
```
Website 3/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js                 ← page load sequence, nav, smooth scroll, cursor glow, magnetic button
│   ├── particle-field.js       ← the chaos→order particle system (2D canvas, spans Hero/Problem/Team/CTA)
│   ├── solution-3d.js          ← Three.js scene for the Solution centerpiece
│   └── scroll-animations.js    ← all GSAP ScrollTrigger wiring
├── assets/
│   ├── svg/
│   │   └── blackswan-logo.svg  ← reuse from current live site: https://blackswan-solutions.com/assets/svg/blackswan-logo.svg (download it, don't recreate it)
│   └── demo/
│       ├── demo-1.jpg          ← REAL product screenshot — Bert will drop this in, see note below
│       ├── demo-2.jpg          ← optional, additional real screenshot
│       └── demo-3.jpg          ← optional, additional real screenshot
└── fonts/                      ← use Google Fonts CDN, no local font files needed
```

**IMPORTANT — real product screenshots:** The `/assets/demo/` folder needs real screenshots of the actual working product ("Bridge Safety Patrol" browser-based training demo) dropped in by Bert before this is run — these are NOT to be invented, mocked up, or AI-generated. If the images aren't there yet when you (Cursor) run this, build the Solution section's demo showcase to gracefully use whatever image files exist in `/assets/demo/` (loop over `demo-1.jpg`, `demo-2.jpg`, `demo-3.jpg`, skip any that don't exist) rather than hard-failing or placeholder-boxing it.

---

## DESIGN SYSTEM (reuse exactly — this is the aesthetic Bert already loves)

```css
:root {
  --bg-primary: #0A0A0A;
  --bg-secondary: #111111;
  --bg-elevated: #1A1A1A;
  --bg-glass: rgba(255,255,255,0.03);

  --accent-primary: #F97316;
  --accent-secondary: #FB923C;
  --accent-glow: rgba(249,115,22,0.15);

  --text-primary: #FFFFFF;
  --text-secondary: #A1A1AA;
  --text-tertiary: #52525B;

  --border-subtle: rgba(255,255,255,0.06);
  --border-hover: rgba(255,255,255,0.12);

  --glow-orange: 0 0 60px rgba(249,115,22,0.2);
  --glow-white: 0 0 40px rgba(255,255,255,0.05);
}
```

**Typography:** Space Grotesk (headlines, 700-900 weight) + Inter (body, 400-600 weight), via Google Fonts CDN with `<link rel="preconnect">` for fast load. H1 ~72px/900, H2 ~48px/800, body ~17-18px/400 at `--text-secondary`.

**Layout:** max content width 1200px centered, section vertical padding ~160px (generous — let it breathe), card border-radius 16px, buttons pill-shaped (border-radius 100px), grid gaps 32px. Subtle background grid pattern site-wide:
```css
body::before {
  content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
  background-image:
    linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
  background-size: 80px 80px;
}
```

Nav bar: fixed top, transparent → blurred dark on scroll, logo + wordmark left, single "Get in Touch" pill button right (no other nav links needed — one-page site, nothing to link to).

---

## THE CORE CONCEPT: CHAOS → ORDER

The whole page is told through one continuous particle system that visibly organizes itself as the user scrolls — because that transformation IS the product pitch: fragmented, ever-changing regulation becomes structured, provable training. This is not decoration bolted onto content; each beat below is keyed to the section's actual meaning.

**Beat 1 — Hero:** particles scattered, drifting with no order. Headline ignites into place letter-by-letter (like embers catching), synced with particles beginning to stir. Cursor nearby gently repels particles.

**Beat 2 — Problem:** particles clump into three loose, unstable, flickering clusters, one drifting behind each of the three problem cards. Restless, not resolved — visually matches "the ground keeps moving."

**Beat 3 — Solution (the centerpiece):** this is where 2D particles hand off to an actual interactive 3D WebGL scene. Glowing fragments flow along a curved path into a rotating low-poly/wireframe environment (evoking the "digital model of your own site" idea), which the user can drag to rotate (OrbitControls, constrained — no zoom-through, gentle auto-rotate when idle). Nodes light up on it as the 3-step process animates. This resolves into the REAL PRODUCT SCREENSHOTS (from `/assets/demo/`), presented inside a stylized browser/device frame that materializes out of the 3D scene — the actual "Bridge Safety Patrol" demo, framed as proof, not concept art.

**Beat 4 — Team:** particles settle into a calm, slow-orbiting constellation of 5 points, one per team member. Hover a node → brightens, reveals name/role. Big tonal shift from the energy of Beat 3 — deliberately calmer.

**Beat 5 — Closing CTA:** everything resolves into the BlackSwan swan-flame mark, full screen, static and complete. Magnetic CTA button with ember-trail hover.

Use **pinned scroll sections** (GSAP ScrollTrigger with `pin: true`) for Beats 1, 3, and 5 so each holds in place while its animation plays out, then releases into normal scroll. Beats 2 and 4 can be normal-scroll with triggered card/node entrances.

---

## SECTION-BY-SECTION SPEC

### 1. HERO
- Full viewport height, pinned during its intro animation.
- Canvas `#particle-canvas` full-bleed background, `pointer-events: none`, chaos state on load.
- Content, centered:
```
[Label] AI-SUPPORTED SAFETY & COMPLIANCE TRAINING
[H1] Safety training that stays current, sticks, and proves itself.
[Subhead] Live regulation turned into role-specific 3D training, delivered inside a model of your own site — with a per-worker audit trail traceable to the exact rule.
[CTA — primary pill button] Get in Touch
[Trust line, small text below] Browser-based · EU Servers · GDPR-oriented · Multilingual
```
- H1 renders via per-character `<span>` reveal (opacity 0 → 1, y:20→0, stagger ~20ms), timed to start ~1s after particles begin stirring.
- The em-dash accent word or key phrase can pick up `--accent-primary` color for emphasis (design judgment call — don't overdo it, one phrase max).

### 2. THE PROBLEM
- Section label: `THE PROBLEM`
- Headline: `Safety training fails in three ways at once.`
- Intro line: `Companies invest heavily in mandatory training. The real issue isn't effort — it's that most training documents attendance, not competence, while the ground underneath it keeps moving.`
- Three cards, each igniting (small ember flare) as it scrolls into view, staggered ~150ms apart:

**Card 1 — The law moves. Training doesn't.**
Rules change constantly across EU, national, and company-level standards. Training decks and PDFs get updated on a vendor's publishing schedule — so employees end up training on yesterday's regulation. The moment a rule changes, that training is already out of date.

**Card 2 — It doesn't stick.**
Roughly 90% of what's learned in a slide-based session is forgotten within 24 hours (Ebbinghaus forgetting curve). Knowledge fades long before it's needed on the floor — so training rarely changes behavior in the moment a hazard actually appears.

**Card 3 — It's rebuilt by hand, every time.**
Courses are built manually, mapped to each role, and rebuilt from scratch whenever a rule changes. Safety and HR teams lose weeks producing and updating content — time that isn't spent reducing risk on the floor.

- Below the cards, one grounded proof line (not a stat wall):
`Germany recorded over 730,000 reportable workplace accidents in 2025 — roughly 2,000 a day. And since December 2025, NIS2 makes cybersecurity training a personal, non-delegable duty for management, not just IT.`

### 3. THE SOLUTION (biggest section — most build effort goes here)
- Section label: `THE SOLUTION`
- Headline: `From live regulation to provable competence — automatically.`
- Intro: `One system, end to end: live rules in, a provable 3D training out. Raw regulation becomes a playable, self-updating training built inside a model of the customer's own site — with a certificate for every worker, every time.`

**Input → Output block** (simple two-column or before/after layout):
```
IN: Laws, standards & internal company rules · Incident reports & real industry cases · The customer's own 3D site model
OUT: A playable 3D training, adapted per role · Training that refreshes itself the moment a rule changes · A per-worker audit trail and certificate
```

**Three-step process** (this is what the 3D scene visualizes/animates alongside):
```
1. Self-updating database — Built on current regulation across EU, national, and company rules — and it refreshes itself automatically the moment a rule changes.
2. Learning that's built to be remembered — Teach → practice under realistic pressure → spaced repetition, adapted to each person — so it's not seen once and forgotten, but retained until it's actually needed.
3. Deploy and auto-certify — Delivered inside a 3D model of the customer's real site. A certificate is generated and saved automatically for every worker, traceable back to the exact rule they were trained on.
```

**Quality control line:** `AI runs the pipeline end to end. The one human checkpoint: before a new customer's training catalog goes live, a safety expert certifies it covers every required area.`

**"What this means in practice" — 6 short bullet points** (can be a simple icon+text list, not heavy cards):
```
- Always current — no one trains on an outdated rule
- Runs in the browser, in 3D — no headsets, no IT rollout
- Every session is auditable back to the exact rule and article
- Trains inside the real environment — a model of the customer's own site, not a generic stage
- Role-specific — a welder, a driver, and a supervisor don't get the same training
- Handles overlapping EU, national, and company rules at once, automatically
```

**Two outcome blurbs** (side by side, simple):
```
For your team: Learn by doing, in a model of your own workplace. Role-specific, not generic. Training you actually remember when it matters.

For HR & safety leadership: Training that stays current without manual rebuilding. Full visibility into who's trained on what. Audit-ready proof of competence — not just proof of completion.
```

**"See it in action" — real demo showcase (sub-section, near the end of Solution):**
- Headline: `This isn't a concept. It's running.`
- Loop over image files in `/assets/demo/` (demo-1.jpg, demo-2.jpg, demo-3.jpg — skip missing ones), display in a stylized frame (browser chrome or simple device bezel matching the dark/orange aesthetic — do NOT use a generic white browser mockup, keep it dark-themed).
- No caption naming any specific client. Fine to caption generically, e.g. `Actual in-browser 3D training — hazard detection on a live construction site.`
- If more than one image, a simple horizontal carousel/gallery (arrows or dot nav), no autoplay carousel tricks — let the user control it.

**Three.js scene behavior (`solution-3d.js`):**
- Triggered/pinned when Solution section is ~30% into view.
- Scene: particles flow from a scattered state along a curved path into a low-poly wireframe environment (a stylized building/site — doesn't need to be photorealistic, geometric/abstract is fine and more "premium tech" than literal).
- `OrbitControls` enabled but constrained: no zoom past reasonable bounds, no full free-fly — gentle rotate limits so it can't be spun into confusion.
- When idle (no drag for ~2s), auto-rotate slowly resumes.
- As the 3-step text scrolls, nodes on the 3D object light up in sync (use `ScrollTrigger` `onUpdate` to drive scene state via scroll progress — same pattern as a scroll-scrubbed timeline).
- On mobile / low-power devices: **disable the interactive 3D entirely**, replace with a pre-rendered looping video/GIF or a static high-quality image of the same scene, plus the same text content. Detect via `window.innerWidth < 768` OR a basic WebGL capability check; don't ship a broken/laggy 3D scene on phones.

### 4. THE TEAM
- Section label: `THE TEAM`
- Headline: `Five people, one mission.`
- Intro: `We started BlackSwan because the data is clear: companies spend millions on training that nobody remembers. We're building the product we wish existed.`
- Five nodes in a slow-orbiting constellation layout (or, as a simpler fallback if the constellation is too complex to get right: a clean 5-up card/photo grid with the same hover-brighten interaction). Use whichever you can execute with more polish — a mediocre constellation is worse than a crisp grid with one nice hover effect.
```
- Moritz Fritz — Co-CEO — Market research & client outreach
- Noah Heinz — Co-CEO — Product & go-to-market
- Albert Zapke — COO — Operations & delivery
- Stefan Ristic — Game Design & Gamification — ex-EA Sports, Cologne
- Fouad Zait — Data Scientist & AI Engineer — AI, RAG & agents background
```
- No photos exist yet for the two new team members (Stefan, Fouad) — use a simple placeholder avatar (initials on a dark circle, accent-colored ring) for anyone without a photo file in `/assets/team/`. Don't block the build waiting for photos.

### 5. CLOSING CTA
- Particles/3D fully resolve into the BlackSwan swan-flame mark (reuse the actual logo SVG, don't redraw it from particles pixel-by-pixel — simplest robust approach: particles converge toward the logo's bounding shape/silhouette, then crossfade to the crisp real SVG on top once assembled).
- Content:
```
[H2] Move from mandatory training to real competence.
[Line] Proof of competence, not proof of completion.
[CTA — large pill button] Get in Touch
[Trust line] Browser-based · EU Servers · GDPR-oriented · Multilingual
```
- Magnetic button (pulls toward cursor within ~200px, max 30% pull) with a pulsing orange glow (`box-shadow` breathing animation) and a small ember-particle trail on hover.
- Footer below, minimal: `© 2026 Black Swan Solution UG (haftungsbeschränkt)` + `Impressum | Datenschutz | Kontakt` links, text-tertiary, small.

---

## MICRO-INTERACTIONS (apply site-wide)

- **Cursor glow:** a large (~600px), very faint (6% opacity) orange radial gradient div that follows the mouse everywhere. Disabled on touch devices.
- **Card tilt on hover:** Problem cards get a subtle 3D tilt following cursor position within the card (max ~5deg), plus a soft radial highlight at the cursor position. Reset smoothly on mouse-leave.
- **Ember flare on entrance:** when Problem cards / bullet points ignite into view, a brief small particle burst or glow pulse at the icon, not just a fade-in.
- **Magnetic CTA buttons:** any primary CTA button pulls toward nearby cursor (see Closing CTA spec above) — apply the same behavior to the Hero's CTA too.

---

## PAGE LOAD SEQUENCE

```
0.0s — everything hidden, particles scattered on canvas
0.3s — nav fades in
0.5s — particles begin stirring
1.0s — hero label fades in
1.2s — hero headline characters stagger in
2.0s — subhead fades in
2.3s — CTA + trust line fade/slide in
```

## MOBILE & ACCESSIBILITY (required, not optional)

- Below 768px: reduce particle counts (~800 vs ~1800 desktop), disable connecting lines between particles, disable the interactive 3D scene (swap for static image/video per Section 3 spec), disable cursor glow / tilt / magnetic effects (no mouse on touch), pinned-scroll sections should un-pin gracefully (test this specifically — pinned sections are the most common mobile-breakage point).
- Respect `prefers-reduced-motion`: disable all non-essential animation, hide particle canvases, keep content fully readable and static.
- All tap targets ≥ 44×44px. No horizontal scroll at any breakpoint (375px, 768px, 1440px minimum test widths).

## PERFORMANCE

- `requestAnimationFrame` only, never `setInterval`, for any canvas/WebGL loop.
- Pause the particle/3D render loop when its section is scrolled fully out of view.
- Target 60fps on a modern laptop for the 2D particle system; for the Three.js scene, keep polycount low (this is meant to look like clean geometric/wireframe design, not a realistic render — that constraint helps performance too).
- Lazy-init the Three.js scene only when the Solution section is close to viewport, not on page load.

---

## QUALITY CHECKLIST

1. [ ] Single `index.html`, no other routes/pages
2. [ ] Particles scatter on load, visibly transform in character across Hero → Problem → Solution → Team → CTA
3. [ ] Hero headline reveals character-by-character, synced to particle stirring
4. [ ] Problem section: 3 cards ignite in on scroll, one grounded proof line beneath, no stat-wall
5. [ ] Solution section: 3D scene loads, is draggable (OrbitControls, constrained), nodes light up in sync with the 3-step text as user scrolls
6. [ ] Solution section: real demo screenshots from `/assets/demo/` are shown in a dark-themed frame, no invented mockups, no client name visible/captioned
7. [ ] Team section: 5 people shown (constellation or clean grid — whichever executes better), placeholder avatars for anyone without a photo
8. [ ] Closing CTA: particles/3D resolve into the real logo SVG, magnetic button with glow + ember trail
9. [ ] Cursor glow, card tilt, and magnetic buttons work on desktop, are fully disabled on touch/mobile
10. [ ] Mobile (375px): no 3D, no cursor effects, pinned sections un-pin cleanly, no horizontal scroll
11. [ ] `prefers-reduced-motion` disables animation site-wide without breaking layout/readability
12. [ ] 60fps scroll performance on a modern laptop; no jank
13. [ ] No console errors
14. [ ] "Get in Touch" buttons are real (mailto: or a simple contact anchor — ask Bert for the destination email/form if not obvious)

---

## OPEN ITEMS FOR BERT (not for Cursor to guess)

- Drop real screenshots into `/assets/demo/` before running this (demo-1.jpg, demo-2.jpg, demo-3.jpg — genericized, no client name visible, matching what's already agreed).
- Team photos for Stefan Ristic and Fouad Zait, if/when available, go in `/assets/team/`.
- Confirm the destination for "Get in Touch" (email address vs. a simple contact form vs. mailto link).
- German (DE) version was intentionally left out of this build to keep scope shippable — add as a follow-up pass once the English version is validated, reusing the EN/DE toggle pattern from the previous site build if desired.
