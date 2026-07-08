/* =========================================================
   BlackSwan — particle-field.js
   Chaos -> order 2D particle system spanning Hero, Problem,
   Team, CTA (fades under Solution to hand off to 3D).
   Exposes: window.BS.particles.setState(name)
     States: 'chaos' | 'clusters' | 'transfer' | 'constellation' | 'logo'
   ========================================================= */

(function () {
  'use strict';

  // Compute env flags locally so this script doesn't depend on load order.
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  // Ensure the global namespace exists for other scripts to consume our API.
  window.BS = window.BS || {};

  // Perf tier is set synchronously by the inline <script> in index.html <head>.
  // On 'reduced', we cut particle count and drop the connecting-line pass
  // entirely — those are the two heaviest per-frame costs in this system.
  // NOTE: this can be flipped later by the FPS probe firing 'bs:tier-downgraded'
  // after ~1s. That's why it's a `let` and why CFG/DPR are rebuildable below.
  let isReducedTier = (window.BS.perfTier || 'full') === 'reduced';

  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  if (prefersReducedMotion) {
    canvas.style.display = 'none';
    // Still publish a no-op API so other scripts don't error.
    window.BS.particles = { setState: () => {}, get state() { return 'off'; } };
    return;
  }

  const ctx = canvas.getContext('2d', { alpha: true });

  // CFG is rebuilt whenever the tier changes (initial + after the FPS probe
  // downgrades us). All tier-dependent knobs live here in one place so a
  // rebuild only has to Object.assign the new values in and resize + rescale
  // the particle pool.
  function buildCFG() {
    return {
      // Three-way count: mobile (small screen), reduced (weak hardware), full.
      // Reduced further from prior pass — the previous 1600/900/600 was still
      // heavy on real hardware; this is the new baseline.
      count: isMobile ? 400 : (isReducedTier ? 500 : 1000),
      baseAlpha: isMobile ? 0.55 : 0.65,
      color: '#F97316',
      colorSoft: '249,115,22',
      // Connecting lines are the single most expensive part of this system
      // (O(n) per bucket-neighbor pair, per frame). Off on mobile AND on
      // reduced-tier desktops.
      connectLines: !isMobile && !isReducedTier,
      // Tighter neighbor radius: cost scales quadratically with radius (each
      // particle checks ~π·r² area of neighbors), so 90 → 70 is meaningfully
      // cheaper, not marginally.
      connectDist: (!isMobile && !isReducedTier) ? 70 : 0,
      connectAlpha: 0.04,
      cursorRepelRadius: 140,
      cursorRepelForce: 0.9
    };
  }
  let CFG = buildCFG();

  // DPR is read fresh inside resize() rather than cached, so a tier change
  // (which changes the cap from 2 to 1.25) takes effect on the next resize().
  function currentDPR() {
    return Math.min(window.devicePixelRatio || 1, isReducedTier ? 1.25 : 2);
  }

  let W = 0, H = 0;
  let particles = [];
  let state = 'chaos';
  let stirred = false;
  let stirAmount = 0;      // 0 -> 1 over ~1.2s once 'bs:stir' fires
  let running = true;
  let visible = true;
  let globalAlpha = 1;     // fade during Solution
  let targetGlobalAlpha = 1;

  // Cluster centers (Problem beat) — updated on section resize
  let clusters = [];
  // Constellation targets (Team beat)
  let constellationTargets = [];
  // Logo silhouette targets (CTA beat)
  let logoTargets = [];
  let logoReady = false;

  // Spatial grid for connecting-line lookup — allocated once per resize,
  // reused (buckets cleared, not reallocated) every frame. Allocating a
  // fresh Array + per-cell arrays every frame at 60fps was generating enough
  // garbage to trigger periodic GC pauses — that's the main source of the
  // stutter/hitching people were seeing.
  let gridCols = 0, gridRows = 0, gridCell = 0;
  let gridBuckets = [];       // pool of reusable arrays, one per cell
  let gridActiveCount = [];   // how many entries are "live" in each bucket this frame

  /* -------------------- Sizing -------------------- */
  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    const dpr = currentDPR();
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    updateClusters();
    updateConstellation();
    buildGridPool();
    // Logo targets are pre-sampled in normalized space and rescaled on demand
  }

  /* -------------------- Spatial grid pool (built once per resize) -------------------- */
  function buildGridPool() {
    if (!CFG.connectLines || !CFG.connectDist) return;
    gridCell = CFG.connectDist;
    gridCols = Math.ceil(W / gridCell) + 1;
    gridRows = Math.ceil(H / gridCell) + 1;
    const total = gridCols * gridRows;
    gridBuckets = new Array(total);
    gridActiveCount = new Array(total).fill(0);
    for (let i = 0; i < total; i++) gridBuckets[i] = [];
  }

  /* -------------------- Particles -------------------- */
  function makeOneParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      tx: 0, ty: 0,             // target position (for ordered states)
      useTarget: 0,             // 0..1 blend: 0 = pure chaos wander, 1 = strong pull to target
      pull: 0.018 + Math.random() * 0.02,
      size: Math.random() * 1.4 + 0.4,
      hueOffset: Math.random() * 20 - 10,
      seed: Math.random() * Math.PI * 2
    };
  }
  function makeParticles() {
    particles.length = 0;
    for (let i = 0; i < CFG.count; i++) particles.push(makeOneParticle());
  }

  /* -------------------- Cluster centers (Problem) -------------------- */
  function updateClusters() {
    // Position clusters loosely where the 3 problem cards live.
    const cards = document.querySelectorAll('.problem-card');
    clusters = [];
    if (!cards.length) {
      // Fallback: three centers spread across the viewport width
      for (let i = 0; i < 3; i++) {
        clusters.push({
          x: W * (0.25 + i * 0.25),
          y: H * 0.5,
          r: Math.min(W, H) * 0.14
        });
      }
      return;
    }
    cards.forEach((card) => {
      const r = card.getBoundingClientRect();
      // Cluster center = card center, but coords are viewport-based
      clusters.push({
        x: r.left + r.width / 2,
        y: r.top + r.height / 2,
        r: Math.min(r.width, r.height) * 0.55
      });
    });
  }

  /* -------------------- Constellation targets (Team) -------------------- */
  function updateConstellation() {
    constellationTargets = [];
    const cards = document.querySelectorAll('.team-card');
    if (!cards.length) return;
    cards.forEach((card) => {
      const avatar = card.querySelector('.team-avatar');
      const rEl = (avatar || card).getBoundingClientRect();
      constellationTargets.push({
        cx: rEl.left + rEl.width / 2,
        cy: rEl.top + rEl.height / 2,
        r: Math.max(60, rEl.width * 0.9)
      });
    });
  }

  /* -------------------- Logo silhouette sampling -------------------- */
  function loadLogoTargets() {
    // Rasterize the SVG logo, then sample opaque pixel positions.
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const sample = document.createElement('canvas');
      const S = 128;
      sample.width = S; sample.height = S;
      const sctx = sample.getContext('2d');
      sctx.drawImage(img, 0, 0, S, S);
      const data = sctx.getImageData(0, 0, S, S).data;
      const points = [];
      // Focus on strong-alpha pixels (skip the dark rounded-rect background alpha)
      // The logo's opaque orange flame + swan silhouette is what we want.
      for (let y = 0; y < S; y += 2) {
        for (let x = 0; x < S; x += 2) {
          const i = (y * S + x) * 4;
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          if (a < 20) continue;
          // Prefer orange-ish or bright pixels; exclude the very dark background rect
          const bright = (r + g + b) / 3;
          if (bright < 30) continue; // skip near-black background of the rounded-rect
          // Normalize to [-0.5..0.5]
          points.push({ nx: (x / S) - 0.5, ny: (y / S) - 0.5 });
        }
      }
      logoTargets = points;
      logoReady = true;
      if (state === 'logo') applyState('logo');
    };
    img.onerror = () => { /* logo unavailable — logo state falls back to a ring */ };
    img.src = 'assets/svg/blackswan-logo.svg';
  }

  /* -------------------- State application -------------------- */
  function applyState(name) {
    state = name;

    if (name === 'chaos') {
      particles.forEach((p) => { p.useTarget = 0; });
      targetGlobalAlpha = 1;
      return;
    }

    if (name === 'clusters') {
      updateClusters();
      // Assign each particle to one of the 3 clusters with a random offset within radius
      const n = clusters.length || 3;
      particles.forEach((p, i) => {
        const c = clusters[i % n];
        const a = Math.random() * Math.PI * 2;
        const dr = Math.pow(Math.random(), 0.6) * c.r;
        p.tx = c.x + Math.cos(a) * dr;
        p.ty = c.y + Math.sin(a) * dr;
        p.useTarget = 0.7;
        p.pull = 0.02 + Math.random() * 0.03;
      });
      targetGlobalAlpha = 1;
      return;
    }

    if (name === 'transfer') {
      // Fade the 2D field down so the 3D scene owns the visual center.
      targetGlobalAlpha = 0;
      return;
    }

    if (name === 'constellation') {
      updateConstellation();
      const n = constellationTargets.length || 5;
      particles.forEach((p, i) => {
        const c = constellationTargets[i % n];
        const a = Math.random() * Math.PI * 2;
        const dr = c.r * (0.6 + Math.random() * 0.5);
        p.tx = c.cx + Math.cos(a) * dr;
        p.ty = c.cy + Math.sin(a) * dr;
        p.useTarget = 0.85;
        p.pull = 0.014 + Math.random() * 0.02;
        p.orbitSeed = a;
        p.orbitR = dr;
      });
      targetGlobalAlpha = 1;
      return;
    }

    if (name === 'logo') {
      targetGlobalAlpha = 1;
      const cx = W / 2;
      const cy = H / 2;
      // Choose a size that fits nicely centered
      const scale = Math.min(W, H) * 0.42;

      if (logoReady && logoTargets.length) {
        particles.forEach((p, i) => {
          const t = logoTargets[i % logoTargets.length];
          // Small jitter for organic edge
          const jx = (Math.random() - 0.5) * 4;
          const jy = (Math.random() - 0.5) * 4;
          p.tx = cx + t.nx * scale + jx;
          p.ty = cy + t.ny * scale + jy;
          p.useTarget = 0.95;
          p.pull = 0.022 + Math.random() * 0.02;
        });
      } else {
        // Fallback: ring/oval
        particles.forEach((p, i) => {
          const a = (i / particles.length) * Math.PI * 2;
          p.tx = cx + Math.cos(a) * scale * 0.5;
          p.ty = cy + Math.sin(a) * scale * 0.5;
          p.useTarget = 0.9;
          p.pull = 0.02;
        });
      }
      return;
    }
  }

  /* -------------------- Animation loop -------------------- */
  let raf = null;
  let lastT = performance.now();
  let time = 0;

  function tick(now) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(40, now - lastT);
    lastT = now;
    time += dt * 0.001;

    if (!visible || !running) return;

    // Global alpha ease (for transfer fade).
    globalAlpha += (targetGlobalAlpha - globalAlpha) * 0.06;

    // Full idle: once we're mostly faded AND the target is fully off (i.e.
    // the Solution section is active), skip the ENTIRE frame — no per-particle
    // wander/target-pull/cursor-repel math, no lines, no draw calls. This is
    // the correct behaviour while the WebGL scene owns the visual center; we'd
    // otherwise be running full physics for ~900–1600 invisible particles.
    // The threshold is bumped up from 0.005 to 0.05 so we start idling ~1
    // frame earlier — imperceptible visually but frees CPU sooner.
    if (targetGlobalAlpha === 0 && globalAlpha < 0.05) {
      ctx.clearRect(0, 0, W, H);
      return;
    }

    // Stir ramp-up
    if (stirred && stirAmount < 1) stirAmount = Math.min(1, stirAmount + dt / 1200);

    // Cursor for repel
    const cursor = window.BS && window.BS.cursor;

    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    const wanderStrength = 0.06 + 0.16 * stirAmount;
    const drag = 0.965;

    // Use the pre-built spatial grid pool only if we're drawing lines (perf).
    // Buckets are reused across frames (length reset to 0) instead of being
    // reallocated — avoids per-frame GC churn from ~200+ tiny array allocations.
    const drawLines = CFG.connectLines && CFG.connectDist > 0 && (state === 'chaos' || state === 'constellation') && gridBuckets.length;
    const cell = gridCell;
    const cols = gridCols;
    const rows = gridRows;
    if (drawLines) {
      for (let i = 0; i < gridBuckets.length; i++) gridBuckets[i].length = 0;
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Gentle noise-ish wander
      const nx = Math.sin(time * 0.6 + p.seed) * 0.5 + Math.cos(time * 0.4 + p.seed * 1.7) * 0.5;
      const ny = Math.cos(time * 0.7 + p.seed * 0.9) * 0.5 + Math.sin(time * 0.5 + p.seed * 1.3) * 0.5;
      p.vx += nx * wanderStrength * (1 - p.useTarget * 0.7) * 0.02;
      p.vy += ny * wanderStrength * (1 - p.useTarget * 0.7) * 0.02;

      // Target pull
      if (p.useTarget > 0) {
        p.vx += (p.tx - p.x) * p.pull * p.useTarget;
        p.vy += (p.ty - p.y) * p.pull * p.useTarget;
      }

      // Cursor repel
      if (cursor) {
        const dx = p.x - cursor.x;
        const dy = p.y - cursor.y;
        const d2 = dx * dx + dy * dy;
        const r2 = CFG.cursorRepelRadius * CFG.cursorRepelRadius;
        if (d2 < r2 && d2 > 1) {
          const d = Math.sqrt(d2);
          const f = (1 - d / CFG.cursorRepelRadius) * CFG.cursorRepelForce;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
      }

      p.vx *= drag;
      p.vy *= drag;
      p.x += p.vx;
      p.y += p.vy;

      // Wrap only in chaos state; otherwise clamp softly
      if (state === 'chaos') {
        if (p.x < -10) p.x = W + 10;
        else if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        else if (p.y > H + 10) p.y = -10;
      } else {
        if (p.x < -20) { p.x = -20; p.vx *= -0.4; }
        else if (p.x > W + 20) { p.x = W + 20; p.vx *= -0.4; }
        if (p.y < -20) { p.y = -20; p.vy *= -0.4; }
        else if (p.y > H + 20) { p.y = H + 20; p.vy *= -0.4; }
      }

      if (drawLines) {
        const gx = Math.max(0, Math.min(cols - 1, Math.floor(p.x / cell)));
        const gy = Math.max(0, Math.min(rows - 1, Math.floor(p.y / cell)));
        const idx = gy * cols + gx;
        gridBuckets[idx].push(p);
      }

      // Draw the particle
      const a = CFG.baseAlpha * globalAlpha * (0.6 + p.useTarget * 0.4);
      ctx.fillStyle = `rgba(${CFG.colorSoft},${a})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw connecting lines (chaos + constellation only)
    if (drawLines) {
      ctx.lineWidth = 0.6;
      const maxD2 = cell * cell;
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const bucket = gridBuckets[gy * cols + gx];
          if (!bucket || !bucket.length) continue;
          for (let dgy = 0; dgy <= 1; dgy++) {
            for (let dgx = -1; dgx <= 1; dgx++) {
              if (dgy === 0 && dgx < 0) continue;
              const nx2 = gx + dgx, ny2 = gy + dgy;
              if (nx2 < 0 || nx2 >= cols || ny2 >= rows) continue;
              const other = gridBuckets[ny2 * cols + nx2];
              if (!other || !other.length) continue;
              for (let a = 0; a < bucket.length; a++) {
                const pa = bucket[a];
                const startB = (bucket === other) ? a + 1 : 0;
                for (let b = startB; b < other.length; b++) {
                  const pb = other[b];
                  const dx = pa.x - pb.x;
                  const dy = pa.y - pb.y;
                  const d2 = dx * dx + dy * dy;
                  if (d2 > maxD2) continue;
                  const alpha = (1 - d2 / maxD2) * CFG.connectAlpha * globalAlpha;
                  ctx.strokeStyle = `rgba(${CFG.colorSoft},${alpha})`;
                  ctx.beginPath();
                  ctx.moveTo(pa.x, pa.y);
                  ctx.lineTo(pb.x, pb.y);
                  ctx.stroke();
                }
              }
            }
          }
        }
      }
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  /* -------------------- Visibility / lifecycle -------------------- */
  function initVisibility() {
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
    });
  }

  /* -------------------- Wire up -------------------- */
  function init() {
    resize();
    makeParticles();
    loadLogoTargets();
    initVisibility();

    // Handle DOM/window resize
    let resizeRAF = null;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeRAF);
      resizeRAF = requestAnimationFrame(() => {
        resize();
        // Recompute state-specific targets that depend on layout
        if (state === 'clusters' || state === 'constellation' || state === 'logo') {
          applyState(state);
        }
      });
    });

    // Kick things off
    raf = requestAnimationFrame(tick);

    // Once the load sequence dispatches 'bs:stir', particles start moving more.
    window.addEventListener('bs:stir', () => {
      stirred = true;
    });

    // Perf-tier downgrade after real-world FPS probe. Rebuild CFG in place,
    // resize (which rebuilds the grid pool at the new connectDist / DPR),
    // and rescale the particle pool. We trim/extend the existing array
    // rather than regenerating to avoid a visible pop mid-animation.
    window.addEventListener('bs:tier-downgraded', () => {
      isReducedTier = true;
      Object.assign(CFG, buildCFG());
      resize();
      if (particles.length > CFG.count) {
        particles.length = CFG.count;
      } else {
        while (particles.length < CFG.count) particles.push(makeOneParticle());
      }
      // If we're in a state whose targets were assigned per-particle, reassign
      // so any newly-added particles get proper targets.
      if (state === 'clusters' || state === 'constellation' || state === 'logo') {
        applyState(state);
      }
    });

    // Fallback: even without stir, add a tiny motion after a moment
    setTimeout(() => { stirred = true; }, 2200);

    // Section-state detection: scroll-animations.js owns this via ScrollTrigger
    // when GSAP is available (precise, scroll-position-driven, no double-firing).
    // Only run this IntersectionObserver fallback when GSAP/ScrollTrigger failed
    // to load — running BOTH at once caused the two systems to fight near section
    // boundaries (each flipping particle targets independently), which is what
    // produced the stutter/hitch when scrolling through the page.
    const hasScrollTrigger = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
    if (!hasScrollTrigger) {
      const io = new IntersectionObserver((entries) => {
        // Pick the entry with the largest intersection ratio
        let best = null;
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
        });
        if (best) {
          const s = best.target.getAttribute('data-particle-state');
          if (s) applyState(s);
        }
      }, { threshold: [0.35, 0.6] });
      document.querySelectorAll('[data-particle-state]').forEach((el) => io.observe(el));
    }
  }

  // Public API
  window.BS.particles = {
    setState: (name) => applyState(name),
    get state() { return state; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
