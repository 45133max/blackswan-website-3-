/* =========================================================
   BlackSwan — solution-3d.js
   Three.js centerpiece for the Solution section.
   - Low-poly wireframe "site model"
   - Particles flowing along a curved path INTO the site
   - 3 glowing nodes light up as scroll progresses (public API)
   - OrbitControls, constrained, gentle idle auto-rotate
   - Mobile / no-WebGL: skip and show static fallback
   Exposes: window.BS.solution3d.setStepProgress(0..1)
            window.BS.solution3d.setActiveStep(index)
   ========================================================= */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Compute env flags locally — this module can execute before/after other scripts.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
window.BS = window.BS || {};

// Perf tier is set synchronously by the inline <script> in index.html <head>,
// then potentially DOWNGRADED to 'reduced' ~1s later after the real-world FPS
// probe finishes. Most of the tier-dependent knobs here (antialias, ambient
// point cloud) can't be toggled after the WebGLRenderer is built — so we
// defer initScene() until the probe has settled (or a safety-net timeout
// fires). By then the user hasn't scrolled to the Solution section anyway,
// so nothing visible is delayed.
// (isReducedTier is read fresh inside initScene(), not at module top-level.)

const canvas = document.getElementById('solution-canvas');
const fallback = document.getElementById('solution-fallback');
const hint = document.querySelector('.solution-canvas-hint');
const wrap = document.querySelector('.solution-canvas-wrap');

function showFallback() {
  if (canvas) canvas.style.display = 'none';
  if (fallback) fallback.hidden = false;
  if (hint) hint.style.display = 'none';
  window.BS = window.BS || {};
  window.BS.solution3d = {
    setStepProgress: () => {},
    setActiveStep: () => {},
    isFallback: true
  };
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}

const isMobile = window.innerWidth < 768;

let sceneBooted = false;
function boot() {
  if (sceneBooted) return;
  sceneBooted = true;
  if (!canvas || !wrap) return;
  if (isMobile || !hasWebGL() || prefersReducedMotion) {
    showFallback();
    return;
  }
  initScene();
}

// Wait for the perf probe to settle so initScene() reads the final tier.
// If the tier decision already happened before this module executed, boot
// immediately; otherwise wait for the event, with a safety-net timeout so
// we never hang if the event never fires.
if (window.BS.tierDecided) {
  boot();
} else {
  window.addEventListener('bs:tier-decided', boot, { once: true });
  setTimeout(boot, 1500);
}

function initScene() {
  // Read tier at build time — the FPS probe may have flipped 'full' to
  // 'reduced' before we got here.
  const isReducedTier = (window.BS.perfTier || 'full') === 'reduced';

  const renderer = new THREE.WebGLRenderer({
    canvas,
    // MSAA is one of the priciest per-frame costs on integrated GPUs. Off on
    // reduced tier; the scene is already dark + additive so aliasing is muted.
    antialias: !isReducedTier,
    alpha: true,
    powerPreference: 'high-performance'
  });
  // Pin DPR to 1 on reduced tier — high-DPI displays otherwise 4x the pixel
  // count silently. On full tier, keep the usual 2x cap.
  renderer.setPixelRatio(isReducedTier ? 1 : Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x08080a, 0.06);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(6, 4.5, 8);
  camera.lookAt(0, 1, 0);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 0.55);
  key.position.set(5, 8, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xf97316, 0.75);
  rim.position.set(-6, 3, -4);
  scene.add(rim);

  // ---------- Ground plane grid (subtle) ----------
  const gridHelper = new THREE.GridHelper(24, 24, 0x1f1f28, 0x14141c);
  gridHelper.position.y = 0;
  gridHelper.material.opacity = 0.35;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // Ground disc glow
  const discGeo = new THREE.CircleGeometry(6, 64);
  const discMat = new THREE.MeshBasicMaterial({
    color: 0xf97316,
    transparent: true,
    opacity: 0.06,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const disc = new THREE.Mesh(discGeo, discMat);
  disc.rotation.x = -Math.PI / 2;
  disc.position.y = 0.001;
  scene.add(disc);

  // ---------- "Site" — cluster of low-poly wireframe buildings ----------
  const site = new THREE.Group();
  const buildings = [];
  const wireMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.35
  });
  const solidMat = new THREE.MeshStandardMaterial({
    color: 0x14141a,
    roughness: 0.9,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85
  });

  const blueprint = [
    { x: 0,   z: 0,    w: 2.4, d: 2.4, h: 2.2 },
    { x: -2.2, z: 0.8, w: 1.6, d: 1.4, h: 1.4 },
    { x: 1.8, z: -1.2, w: 1.4, d: 1.6, h: 2.8 },
    { x: 2.2, z: 1.8,  w: 1.2, d: 1.2, h: 1.0 },
    { x: -1.6, z: -1.8, w: 1.0, d: 1.4, h: 1.8 }
  ];

  blueprint.forEach((b, i) => {
    const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
    // Solid dark base
    const solid = new THREE.Mesh(geo, solidMat.clone());
    solid.position.set(b.x, b.h / 2, b.z);
    site.add(solid);

    // Wireframe overlay
    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(edges, wireMat.clone());
    line.position.copy(solid.position);
    site.add(line);

    buildings.push({ solid, line, cfg: b });
  });
  scene.add(site);

  // ---------- Scale figure — one small human silhouette next to the buildings
  // Reads as ~0.36 units tall against buildings that range from 1.0 to 2.8
  // units, i.e. roughly 12–36% of a structure's height — the same visual
  // ratio a real person makes against a small-to-mid workplace building.
  // Positioned in the "corridor" between the central building and the
  // front-right building so it isn't occluded from the default camera angle
  // and stays visible through the allowed OrbitControls range.
  {
    const bodyGeo = new THREE.CapsuleGeometry(0.06, 0.14, 4, 8);
    const headGeo = new THREE.SphereGeometry(0.05, 12, 10);
    const figurePos = new THREE.Vector3(1.0, 0.13, 1.4);
    const bodySolid = new THREE.Mesh(bodyGeo, solidMat.clone());
    bodySolid.position.copy(figurePos);
    const headSolid = new THREE.Mesh(headGeo, solidMat.clone());
    headSolid.position.set(figurePos.x, figurePos.y + 0.18, figurePos.z);
    const bodyLine = new THREE.LineSegments(new THREE.EdgesGeometry(bodyGeo), wireMat.clone());
    bodyLine.position.copy(bodySolid.position);
    const headLine = new THREE.LineSegments(new THREE.EdgesGeometry(headGeo), wireMat.clone());
    headLine.position.copy(headSolid.position);
    site.add(bodySolid); site.add(bodyLine);
    site.add(headSolid); site.add(headLine);
  }

  // ---------- Site boundary — dashed rectangle around the building cluster
  // Sized against the actual `blueprint` above. Building extents work out to
  // roughly x=[-3.0, 2.8], z=[-2.5, 2.4]; the rectangle below gives ~0.5
  // units of margin on each side so structures aren't touching the edge.
  // Kept subtle (opacity 0.28) so it complements the ground-glow disc rather
  // than competing with it — the disc still owns the "there's a site here"
  // read, this just gives that site a bounded shape.
  {
    const boundaryPts = [
      new THREE.Vector3(-3.5, 0.015, -3.0),
      new THREE.Vector3( 3.3, 0.015, -3.0),
      new THREE.Vector3( 3.3, 0.015,  3.0),
      new THREE.Vector3(-3.5, 0.015,  3.0),
      new THREE.Vector3(-3.5, 0.015, -3.0)
    ];
    const boundaryGeo = new THREE.BufferGeometry().setFromPoints(boundaryPts);
    const boundaryMat = new THREE.LineDashedMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.28,
      dashSize: 0.25,
      gapSize: 0.15
    });
    const boundary = new THREE.Line(boundaryGeo, boundaryMat);
    boundary.computeLineDistances(); // required for dashed lines to render
    scene.add(boundary);
  }

  // ---------- Nodes (one per step) ----------
  // Each node = small glowing sphere on top of / near a building.
  const nodePositions = [
    new THREE.Vector3(-2.2, 1.4 + 0.2, 0.8),  // node 1 — on second building
    new THREE.Vector3(0, 2.2 + 0.25, 0),      // node 2 — on central building
    new THREE.Vector3(1.8, 2.8 + 0.25, -1.2)  // node 3 — on tall building
  ];

  const nodes = nodePositions.map((pos) => {
    const g = new THREE.Group();

    const coreGeo = new THREE.SphereGeometry(0.14, 24, 20);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.9 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    g.add(core);

    // Halo sprite (simple additive ring)
    const haloGeo = new THREE.SphereGeometry(0.32, 24, 20);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    g.add(halo);

    // Vertical beam-lite line up from base
    const beamGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -pos.y + 0.02, 0),
      new THREE.Vector3(0, 0, 0)
    ]);
    const beamMat = new THREE.LineBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.0 });
    const beam = new THREE.Line(beamGeo, beamMat);
    g.add(beam);

    g.position.copy(pos);
    scene.add(g);

    return { group: g, core, halo, beam, coreMat, haloMat, beamMat, active: 0, target: 0 };
  });

  // ---------- HTML labels for each node (01 / 02 / 03) ----------
  // Absolutely positioned over .solution-canvas-wrap; projected to screen
  // space every frame. Created ONLY here — the showFallback() path never
  // touches this file's initScene(), so no labels appear on the fallback.
  const labelEls = nodes.map((_n, i) => {
    const el = document.createElement('div');
    el.className = 'solution-node-label';
    el.setAttribute('aria-hidden', 'true');
    el.textContent = String(i + 1).padStart(2, '0');
    wrap.appendChild(el);
    return el;
  });
  // Reusable Vector3 for per-frame projection — allocating inside the loop
  // would churn GC at 60fps for what's effectively a static utility.
  const labelProjectVec = new THREE.Vector3();
  const LABEL_OFFSET_Y = -22; // px — floats the badge just above the node's glow

  // ---------- Flow path — a curved catmull-rom from scattered origin into the site ----------
  const pathCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-8, 6, 6),
    new THREE.Vector3(-4, 4, 3),
    new THREE.Vector3(-1, 2.6, 0.6),
    new THREE.Vector3(1.5, 2, -0.4),
    new THREE.Vector3(0, 1.5, 0)
  ], false, 'catmullrom', 0.5);

  // Path visual — thin faint line to hint at trajectory
  {
    const pts = pathCurve.getPoints(80);
    const pgeo = new THREE.BufferGeometry().setFromPoints(pts);
    const pmat = new THREE.LineBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.12
    });
    scene.add(new THREE.Line(pgeo, pmat));
  }

  // Flowing particles along the path. Full-tier cut from 220 -> 160 to trim
  // the per-frame position-recompute + upload cost; reduced-tier cut from
  // 110 -> 90 for the same reason on weaker hardware.
  const FLOW_COUNT = isReducedTier ? 90 : 160;
  const flowPositions = new Float32Array(FLOW_COUNT * 3);
  const flowT = new Float32Array(FLOW_COUNT);   // 0..1 progress along path
  const flowSpeed = new Float32Array(FLOW_COUNT);
  for (let i = 0; i < FLOW_COUNT; i++) {
    flowT[i] = Math.random();
    flowSpeed[i] = 0.05 + Math.random() * 0.14;
    const p = pathCurve.getPoint(flowT[i]);
    flowPositions[i * 3] = p.x;
    flowPositions[i * 3 + 1] = p.y;
    flowPositions[i * 3 + 2] = p.z;
  }

  const flowGeo = new THREE.BufferGeometry();
  flowGeo.setAttribute('position', new THREE.BufferAttribute(flowPositions, 3));

  const flowMat = new THREE.PointsMaterial({
    color: 0xf97316,
    size: 0.08,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const flow = new THREE.Points(flowGeo, flowMat);
  scene.add(flow);

  // ---------- OUT — short outward drift from the tall building (opposite IN) ----------
  // Not a second full curved path — just a brief burst drifting toward the
  // frame's bottom-right so the eye reads "something comes out" after the
  // three in-site steps. Count stays small; respects reduced tier.
  const OUT_COUNT = isReducedTier ? 16 : 28;
  const outOrigin = new THREE.Vector3(1.85, 2.95, -0.55); // top of tallest building cluster
  const outDir = new THREE.Vector3(0.55, 0.42, 0.95).normalize(); // mirror IN direction, shorter
  const outMaxDist = 2.2;
  const outPositions = new Float32Array(OUT_COUNT * 3);
  const outProgress = new Float32Array(OUT_COUNT);   // 0..1 along the short burst
  const outSpeed = new Float32Array(OUT_COUNT);
  const outJitter = new Float32Array(OUT_COUNT * 3); // small lateral spread
  for (let i = 0; i < OUT_COUNT; i++) {
    outProgress[i] = Math.random();
    outSpeed[i] = 0.35 + Math.random() * 0.45;
    outJitter[i * 3]     = (Math.random() - 0.5) * 0.35;
    outJitter[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
    outJitter[i * 3 + 2] = (Math.random() - 0.5) * 0.35;
    outPositions[i * 3] = outOrigin.x;
    outPositions[i * 3 + 1] = outOrigin.y;
    outPositions[i * 3 + 2] = outOrigin.z;
  }
  const outGeo = new THREE.BufferGeometry();
  outGeo.setAttribute('position', new THREE.BufferAttribute(outPositions, 3));
  const outMat = new THREE.PointsMaterial({
    color: 0xfb923c,
    size: 0.065,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const outFlow = new THREE.Points(outGeo, outMat);
  scene.add(outFlow);

  // Subtle OUT emission ring at the origin — a single static mesh, no per-frame cost.
  {
    const ringGeo = new THREE.RingGeometry(0.1, 0.18, 20);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const outRing = new THREE.Mesh(ringGeo, ringMat);
    outRing.position.copy(outOrigin);
    outRing.lookAt(outOrigin.clone().add(outDir));
    scene.add(outRing);
  }

  // ---------- IN / OUT flow labels (HTML overlay, distinct from node badges) ----------
  const inLabelEl = document.createElement('div');
  inLabelEl.className = 'solution-flow-label solution-flow-label--in';
  inLabelEl.setAttribute('aria-hidden', 'true');
  inLabelEl.textContent = 'IN';
  wrap.appendChild(inLabelEl);

  const outLabelEl = document.createElement('div');
  outLabelEl.className = 'solution-flow-label solution-flow-label--out';
  outLabelEl.setAttribute('aria-hidden', 'true');
  outLabelEl.textContent = 'OUT';
  wrap.appendChild(outLabelEl);

  // World anchors for IN/OUT labels — tied to the actual flow geometry.
  const inLabelWorld = pathCurve.getPoint(0.04); // near trail entry (upper-left)
  const outLabelWorld = new THREE.Vector3().copy(outOrigin).addScaledVector(outDir, 0.85);
  outLabelWorld.y += 0.25;

  function projectFlowLabel(worldPos, el, opacity) {
    labelProjectVec.copy(worldPos).project(camera);
    if (labelProjectVec.z < -1 || labelProjectVec.z > 1) {
      el.style.opacity = '0';
      return;
    }
    const x = (labelProjectVec.x * 0.5 + 0.5) * canvas.clientWidth;
    const y = (-labelProjectVec.y * 0.5 + 0.5) * canvas.clientHeight;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    el.style.opacity = String(opacity);
  }

  // Ambient "scattered" particles — static background dust. Skipped entirely
  // on reduced tier (they don't carry meaningful visual weight). Even on full
  // tier we no longer drift them per-frame — the drift was ~1px worth of
  // motion at the cost of a full 260-vertex GPU re-upload every frame — and
  // count is trimmed from 260 -> 180 for a cheaper draw.
  if (!isReducedTier) {
    const AMB_COUNT = 180;
    const ambPositions = new Float32Array(AMB_COUNT * 3);
    for (let i = 0; i < AMB_COUNT; i++) {
      ambPositions[i * 3]     = (Math.random() - 0.5) * 18;
      ambPositions[i * 3 + 1] = Math.random() * 6 + 0.5;
      ambPositions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    const ambGeo = new THREE.BufferGeometry();
    ambGeo.setAttribute('position', new THREE.BufferAttribute(ambPositions, 3));
    const ambMat = new THREE.PointsMaterial({
      color: 0xa1a1aa,
      size: 0.045,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false
    });
    scene.add(new THREE.Points(ambGeo, ambMat));
  }

  // ---------- Controls ----------
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 6.5;
  controls.maxDistance = 13;
  controls.minPolarAngle = Math.PI * 0.18;  // no top-down flip
  controls.maxPolarAngle = Math.PI * 0.5;   // no going below horizon
  controls.rotateSpeed = 0.6;
  controls.target.set(0, 1.1, 0);
  // Auto-rotate implicitly forces a redraw every frame even when nothing else
  // has changed. Disabled on reduced tier — user can still drag to rotate.
  controls.autoRotate = !isReducedTier;
  controls.autoRotateSpeed = 0.6;

  let lastInteract = performance.now();
  controls.addEventListener('start', () => {
    controls.autoRotate = false;
    lastInteract = performance.now();
  });
  controls.addEventListener('end', () => {
    lastInteract = performance.now();
  });

  // ---------- Resize ----------
  function resize() {
    const rect = wrap.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const ro = new ResizeObserver(resize);
  ro.observe(wrap);
  resize();

  // ---------- Loop ----------
  let raf = null;
  let visible = false;
  let running = false;
  let lastT = performance.now();
  let time = 0;

  // Global progress across steps 0..1 (2 = past)
  let stepProgress = 0;
  let activeStep = -1;

  // Flow-particle update throttling: we only recompute + re-upload the flow
  // point-cloud on every OTHER frame. Position updates + needsUpdate=true is a
  // full GPU buffer re-upload; halving that rate is nearly free visually at
  // this speed/count and takes a real bite out of frame time on mid-range
  // hardware. We accumulate dt across skipped frames so motion speed stays
  // constant regardless of the throttle.
  let flowFrameParity = 0;
  let flowPendingDt = 0;

  // Node target intensity is derived from stepProgress OR activeStep.
  function computeNodeTargets() {
    // Convert progress in 0..1 to a wave that lights nodes sequentially.
    // 0..0.33 -> node 0, 0.33..0.66 -> node 1, 0.66..1 -> node 2
    // With a smooth ramp between them so the previous one glows dimly.
    if (activeStep >= 0) {
      nodes.forEach((n, i) => { n.target = i === activeStep ? 1 : (i < activeStep ? 0.35 : 0); });
      return;
    }
    const p = Math.max(0, Math.min(1, stepProgress));
    for (let i = 0; i < nodes.length; i++) {
      const center = (i + 1) / (nodes.length + 1); // 0.25, 0.5, 0.75
      const dist = Math.abs(p - center);
      const val = Math.max(0, 1 - dist * 3.5);
      nodes[i].target = val;
    }
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(60, now - lastT);
    lastT = now;
    time += dt * 0.001;
    if (!running || !visible) return;

    // Auto-rotate resumes after 2s idle (full tier only — reduced tier never
    // auto-rotates so we don't burn frames when the user isn't interacting).
    if (!isReducedTier && !controls.autoRotate && (now - lastInteract) > 2000) {
      controls.autoRotate = true;
    }

    // Update flow particles along the curve — every 2nd frame only. We fold
    // the skipped frame's dt into the next update so speed stays the same.
    flowFrameParity++;
    flowPendingDt += dt * 0.001;
    if ((flowFrameParity & 1) === 0) {
      const pos = flowGeo.attributes.position.array;
      const stepDrive = 0.6 + 0.6 * Math.max(stepProgress, activeStep >= 0 ? (activeStep + 0.5) / 3 : 0);
      const advance = flowPendingDt * stepDrive;
      flowPendingDt = 0;
      for (let i = 0; i < FLOW_COUNT; i++) {
        flowT[i] += flowSpeed[i] * advance;
        if (flowT[i] > 1) flowT[i] -= 1;
        const p = pathCurve.getPoint(flowT[i]);
        // Small jitter to feel like sparks
        const j = 0.04;
        pos[i * 3]     = p.x + (Math.sin(time * 3 + i) * j);
        pos[i * 3 + 1] = p.y + (Math.cos(time * 2.7 + i * 1.3) * j);
        pos[i * 3 + 2] = p.z + (Math.sin(time * 2.4 + i * 0.7) * j);
      }
      flowGeo.attributes.position.needsUpdate = true;
    }

    // OUT burst — small count, cheap enough to update every frame (unlike the
    // larger IN flow cloud which is throttled to every 2nd frame).
    {
      const opos = outGeo.attributes.position.array;
      const stepDrive = 0.5 + 0.5 * Math.max(stepProgress, activeStep >= 0 ? (activeStep + 0.5) / 3 : 0);
      const advance = (dt * 0.001) * stepDrive;
      for (let i = 0; i < OUT_COUNT; i++) {
        outProgress[i] += outSpeed[i] * advance;
        if (outProgress[i] > 1) outProgress[i] = Math.random() * 0.15;
        const t = outProgress[i];
        const fade = 1 - t; // fade as particles travel outward
        const dist = t * outMaxDist;
        opos[i * 3]     = outOrigin.x + outDir.x * dist + outJitter[i * 3] * fade;
        opos[i * 3 + 1] = outOrigin.y + outDir.y * dist + outJitter[i * 3 + 1] * fade + Math.sin(time * 2.5 + i) * 0.03 * fade;
        opos[i * 3 + 2] = outOrigin.z + outDir.z * dist + outJitter[i * 3 + 2] * fade;
      }
      outGeo.attributes.position.needsUpdate = true;
      // OUT emission brightens as later steps activate — mirrors the IN trail.
      outMat.opacity = 0.45 + 0.35 * Math.max(stepProgress, activeStep >= 0 ? (activeStep + 1) / 3 : 0);
    }

    // (Ambient particles are static — no per-frame drift, no re-upload.)

    // Nodes ease toward target
    computeNodeTargets();
    nodes.forEach((n) => {
      n.active += (n.target - n.active) * 0.08;
      const a = n.active;
      const pulse = 0.85 + Math.sin(time * 3 + n.group.position.x) * 0.15 * a;
      n.coreMat.opacity = 0.35 + a * 0.65;
      n.core.scale.setScalar(0.85 + a * 0.5 * pulse);
      n.haloMat.opacity = 0.05 + a * 0.5;
      n.halo.scale.setScalar(1 + a * 0.8 * pulse);
      n.beamMat.opacity = a * 0.4;
    });

    // Subtle site sway
    site.rotation.y = 0; // controlled by autoRotate on camera side
    controls.update();

    // Position the numbered node labels over the 3D scene. Project each
    // node's world position through the (freshly-updated) camera, convert
    // NDC -> pixel coords in the canvas, and set transform + opacity.
    // Opacity ramps from ~0.35 idle to ~1.0 when its matching step is active,
    // reinforcing the visual link with the step cards on the right.
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const el = labelEls[i];
      labelProjectVec.copy(n.group.position).project(camera);
      const inFrustum = labelProjectVec.z >= -1 && labelProjectVec.z <= 1;
      if (!inFrustum) {
        el.style.opacity = '0';
        continue;
      }
      const x = (labelProjectVec.x * 0.5 + 0.5) * cw;
      const y = (-labelProjectVec.y * 0.5 + 0.5) * ch + LABEL_OFFSET_Y;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      el.style.opacity = String(0.35 + n.active * 0.65);
      // Toggle a class instead of restyling every frame so the CSS transition
      // + box-shadow handle the "brighten" pop cleanly.
      const shouldBeActive = n.active > 0.6;
      if (el._isActive !== shouldBeActive) {
        el._isActive = shouldBeActive;
        el.classList.toggle('is-active', shouldBeActive);
      }
    }

    // IN / OUT flow labels — same projection technique as node badges, but
    // visually distinct (rectangular tracked text, not circular pills).
    const flowLabelOpacity = 0.55 + 0.35 * Math.max(stepProgress, activeStep >= 0 ? 0.5 : 0);
    projectFlowLabel(inLabelWorld, inLabelEl, flowLabelOpacity);
    projectFlowLabel(outLabelWorld, outLabelEl, flowLabelOpacity);

    renderer.render(scene, camera);
  }

  function start() {
    if (raf) return;
    lastT = performance.now();
    running = true;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  }

  // Only render when the section is on-screen (perf)
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
  }, { threshold: 0 });
  io.observe(wrap);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (visible) start();
  });

  window.BS = window.BS || {};
  window.BS.solution3d = {
    setStepProgress: (p) => { activeStep = -1; stepProgress = p; },
    setActiveStep: (i) => { activeStep = i; },
    isFallback: false
  };
}
