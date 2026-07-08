/* =========================================================
   BlackSwan — main.js
   Load sequence, nav, cursor glow, magnetic buttons, tilt,
   hero character split, smooth scroll, team avatars, demo gallery.
   ========================================================= */

(function () {
  'use strict';

  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  // Expose environment flags globally for other scripts.
  window.BS = window.BS || {};
  window.BS.env = { isTouch, prefersReducedMotion, isMobile };

  // Perf tier is set synchronously by the inline <script> in index.html <head>
  // BEFORE any deferred script runs. If that inline block was somehow removed,
  // default to 'full' so behavior matches the pre-tiering build.
  const perfTier = window.BS.perfTier || 'full';
  const isReducedTier = perfTier === 'reduced';

  /* -------------------- Character-split for hero title -------------------- */
  function splitHeroTitle() {
    const title = document.querySelector('.hero-title[data-split-char]');
    if (!title) return;

    // Walk child nodes preserving the .accent span
    const walk = (node) => {
      const out = document.createDocumentFragment();
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent;
          for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            if (ch === ' ') {
              out.appendChild(document.createTextNode(' '));
            } else {
              const span = document.createElement('span');
              span.setAttribute('data-char', '');
              span.textContent = ch;
              out.appendChild(span);
            }
          }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const clone = child.cloneNode(false);
          clone.appendChild(walk(child));
          out.appendChild(clone);
        }
      });
      return out;
    };

    const frag = walk(title);
    title.innerHTML = '';
    title.appendChild(frag);
  }

  /* -------------------- Page load sequence -------------------- */
  function runLoadSequence() {
    const nav = document.getElementById('nav');
    const chars = document.querySelectorAll('.hero-title [data-char]');
    const step1 = document.querySelector('[data-load-step="1"]');
    const step3 = document.querySelector('[data-load-step="3"]');
    const step4Els = document.querySelectorAll('[data-load-step="4"]');

    if (prefersReducedMotion) {
      // Instantly reveal everything
      if (nav) nav.style.opacity = '1';
      if (step1) step1.style.opacity = '1';
      chars.forEach((c) => { c.style.opacity = '1'; c.style.transform = 'none'; });
      if (step3) step3.style.opacity = '1';
      step4Els.forEach((el) => { el.style.opacity = '1'; });
      return;
    }

    const hasGSAP = typeof window.gsap !== 'undefined';

    if (hasGSAP) {
      const tl = window.gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (nav) tl.fromTo(nav, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.6 }, 0.3);
      if (step1) tl.fromTo(step1, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 1.0);
      if (chars.length) {
        tl.to(chars, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.02,
          ease: 'power3.out'
        }, 1.2);
      }
      if (step3) tl.fromTo(step3, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 2.0);
      if (step4Els.length) {
        tl.fromTo(step4Els, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 2.3);
      }
    } else {
      // GSAP not loaded — fall back to CSS transitions manually
      setTimeout(() => { if (nav) nav.style.opacity = '1'; }, 300);
      setTimeout(() => { if (step1) { step1.style.transition = 'opacity 0.6s, transform 0.6s'; step1.style.opacity = '1'; step1.style.transform = 'none'; } }, 1000);
      setTimeout(() => {
        chars.forEach((c, i) => {
          c.style.transition = 'opacity 0.6s, transform 0.6s';
          setTimeout(() => { c.style.opacity = '1'; c.style.transform = 'none'; }, i * 20);
        });
      }, 1200);
      setTimeout(() => { if (step3) { step3.style.transition = 'opacity 0.7s, transform 0.7s'; step3.style.opacity = '1'; step3.style.transform = 'none'; } }, 2000);
      setTimeout(() => {
        step4Els.forEach((el, i) => {
          el.style.transition = 'opacity 0.7s, transform 0.7s';
          setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'none'; }, i * 80);
        });
      }, 2300);
    }

    // Signal to particle-field: start stirring at ~0.5s
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('bs:stir'));
    }, 500);
  }

  /* -------------------- Nav scroll state -------------------- */
  function initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const update = () => {
      if (window.scrollY > 32) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* -------------------- Smooth in-page scroll -------------------- */
  function initSmoothScroll() {
    const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollToPlugin !== 'undefined';
    if (hasGSAP) window.gsap.registerPlugin(window.ScrollToPlugin);

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (hasGSAP) {
        window.gsap.to(window, {
          duration: prefersReducedMotion ? 0 : 1.1,
          scrollTo: { y: target, offsetY: 40, autoKill: true },
          ease: 'power3.inOut'
        });
      } else {
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  }

  /* -------------------- Cursor glow -------------------- */
  function initCursorGlow() {
    if (isTouch || prefersReducedMotion) return;
    const glow = document.querySelector('.cursor-glow');
    if (!glow) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let raf = null;
    let active = false;

    const loop = () => {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      glow.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!active) {
        active = true;
        glow.classList.add('is-active');
        loop();
      }
      // Broadcast cursor for particle repel
      window.BS.cursor = { x: e.clientX, y: e.clientY };
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      glow.classList.remove('is-active');
    });
  }

  /* -------------------- Magnetic buttons -------------------- */
  // Previously each button read getBoundingClientRect() on every single
  // window mousemove event (i.e. on every pixel of mouse movement anywhere
  // on the page, for every magnetic button, all the time). getBoundingClientRect
  // forces a synchronous layout read, and doing it 2-3x per mousemove event at
  // mouse-report frequency was a real source of the stutter. Fix: cache each
  // button's center and only recompute it on resize/scroll (cheap, infrequent),
  // and track cursor position via one shared listener instead of one per button.
  function initMagneticButtons() {
    if (isTouch || prefersReducedMotion) return;
    const buttons = document.querySelectorAll('[data-magnetic]');
    if (!buttons.length) return;
    const strength = 0.3;   // 30% max pull
    const radius = 200;     // px influence radius

    const items = Array.prototype.map.call(buttons, (btn) => ({
      btn,
      label: btn.querySelector('.btn-label'),
      bcx: 0, bcy: 0,
      cx: 0, cy: 0, tx: 0, ty: 0,
      raf: null
    }));

    function refreshRects() {
      items.forEach((it) => {
        const rect = it.btn.getBoundingClientRect();
        it.bcx = rect.left + rect.width / 2;
        it.bcy = rect.top + rect.height / 2;
      });
    }
    refreshRects();

    let refreshQueued = false;
    const queueRefresh = () => {
      if (refreshQueued) return;
      refreshQueued = true;
      requestAnimationFrame(() => { refreshRects(); refreshQueued = false; });
    };
    window.addEventListener('resize', queueRefresh, { passive: true });
    window.addEventListener('scroll', queueRefresh, { passive: true });

    function loopFor(it) {
      it.cx += (it.tx - it.cx) * 0.18;
      it.cy += (it.ty - it.cy) * 0.18;
      it.btn.style.transform = `translate3d(${it.cx}px, ${it.cy}px, 0)`;
      if (it.label) it.label.style.transform = `translate3d(${it.cx * 0.4}px, ${it.cy * 0.4}px, 0)`;
      if (Math.abs(it.cx - it.tx) < 0.1 && Math.abs(it.cy - it.ty) < 0.1) {
        it.raf = null;
        return;
      }
      it.raf = requestAnimationFrame(() => loopFor(it));
    }

    window.addEventListener('mousemove', (e) => {
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const dx = e.clientX - it.bcx;
        const dy = e.clientY - it.bcy;
        const dist = Math.hypot(dx, dy);
        if (dist < radius) {
          const falloff = 1 - dist / radius;
          it.tx = dx * strength * falloff;
          it.ty = dy * strength * falloff;
        } else {
          it.tx = 0; it.ty = 0;
        }
        if (!it.raf) it.raf = requestAnimationFrame(() => loopFor(it));
      }
    }, { passive: true });

    items.forEach((it) => {
      it.btn.addEventListener('mouseleave', () => {
        it.tx = 0; it.ty = 0;
        if (!it.raf) it.raf = requestAnimationFrame(() => loopFor(it));
      });
    });
  }

  /* -------------------- Card tilt on hover -------------------- */
  // Same rect-read pattern the magnetic-button fix targeted, smaller scope:
  // pointermove was calling getBoundingClientRect() per event while hovering a
  // card. That's a synchronous layout read per event; multiplied by mouse-report
  // frequency inside the card, it added up. Fix: cache rect on mouseenter, and
  // refresh caches via a rAF-queued single pass on scroll/resize.
  function initCardTilt() {
    if (isTouch || prefersReducedMotion) return;
    if (isReducedTier) return; // tilt is pure decoration — first thing to drop
    const cards = document.querySelectorAll('.tilt-card');
    if (!cards.length) return;
    const maxTilt = 5; // degrees

    const items = Array.prototype.map.call(cards, (card) => ({
      card,
      glow: card.querySelector('.card-glow'),
      rectLeft: 0, rectTop: 0, rectW: 1, rectH: 1,
      hovering: false,
      raf: null
    }));

    function refreshRect(it) {
      const r = it.card.getBoundingClientRect();
      it.rectLeft = r.left;
      it.rectTop = r.top;
      it.rectW = r.width || 1;
      it.rectH = r.height || 1;
    }

    // Only refresh rects for currently-hovered cards on scroll/resize. Nothing
    // else needs an up-to-date rect (no card is being tilted while un-hovered).
    let refreshQueued = false;
    function queueRefreshHovered() {
      if (refreshQueued) return;
      refreshQueued = true;
      requestAnimationFrame(() => {
        refreshQueued = false;
        for (let i = 0; i < items.length; i++) if (items[i].hovering) refreshRect(items[i]);
      });
    }
    window.addEventListener('scroll', queueRefreshHovered, { passive: true });
    window.addEventListener('resize', queueRefreshHovered, { passive: true });

    items.forEach((it) => {
      it.card.addEventListener('mouseenter', () => {
        it.hovering = true;
        refreshRect(it);
      });
      it.card.addEventListener('mousemove', (e) => {
        const x = e.clientX - it.rectLeft;
        const y = e.clientY - it.rectTop;
        const nx = (x / it.rectW) - 0.5;
        const ny = (y / it.rectH) - 0.5;
        cancelAnimationFrame(it.raf);
        it.raf = requestAnimationFrame(() => {
          it.card.style.transform = `perspective(900px) rotateY(${nx * maxTilt}deg) rotateX(${-ny * maxTilt}deg) translateZ(0)`;
          if (it.glow) {
            it.glow.style.left = `${x}px`;
            it.glow.style.top = `${y}px`;
          }
        });
      });
      it.card.addEventListener('mouseleave', () => {
        it.hovering = false;
        cancelAnimationFrame(it.raf);
        it.raf = requestAnimationFrame(() => { it.card.style.transform = ''; });
      });
    });
  }

  /* -------------------- Team avatar photo detection -------------------- */
  function initTeamAvatars() {
    document.querySelectorAll('.team-avatar').forEach((el) => {
      const src = el.getAttribute('data-photo');
      const initials = el.getAttribute('data-initials') || '';
      // Default: show initials
      el.textContent = initials;
      if (!src) return;
      const img = new Image();
      img.onload = () => {
        el.style.backgroundImage = `url("${src}")`;
        el.classList.add('has-photo');
        el.textContent = '';
      };
      img.onerror = () => { /* keep initials */ };
      img.src = src;
    });
  }

  /* -------------------- Demo gallery -------------------- */
  function initDemoGallery() {
    const viewport = document.getElementById('demo-viewport');
    const empty = document.getElementById('demo-empty');
    const controls = document.getElementById('demo-controls');
    const dotsEl = document.getElementById('demo-dots');
    if (!viewport) return;

    const candidates = [
      'assets/demo/demo-1.jpg',
      'assets/demo/demo-2.jpg',
      'assets/demo/demo-3.jpg',
      'assets/demo/demo-1.png',
      'assets/demo/demo-2.png',
      'assets/demo/demo-3.png',
      'assets/demo/demo-1.webp',
      'assets/demo/demo-2.webp',
      'assets/demo/demo-3.webp'
    ];

    const checked = candidates.map((src) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ src, ok: true, img });
      img.onerror = () => resolve({ src, ok: false });
      img.src = src;
    }));

    Promise.all(checked).then((results) => {
      // Deduplicate to one per demo-N regardless of extension (prefer first ok in the ordered list)
      const seen = new Set();
      const ok = [];
      results.forEach((r) => {
        if (!r.ok) return;
        const m = r.src.match(/demo-(\d+)/);
        const key = m ? m[1] : r.src;
        if (seen.has(key)) return;
        seen.add(key);
        ok.push(r);
      });

      if (!ok.length) return; // keep the placeholder empty state

      if (empty) empty.remove();

      ok.forEach((r, i) => {
        const slide = document.createElement('div');
        slide.className = 'demo-slide' + (i === 0 ? ' is-active' : '');
        slide.setAttribute('data-slide', String(i));
        const img = document.createElement('img');
        img.src = r.src;
        img.alt = 'Bridge Safety Patrol — in-browser 3D training screenshot';
        img.loading = 'lazy';
        img.decoding = 'async';
        slide.appendChild(img);
        viewport.appendChild(slide);
      });

      if (ok.length < 2) return; // no controls needed

      if (controls) controls.hidden = false;

      let index = 0;
      const slides = viewport.querySelectorAll('.demo-slide');

      const dotEls = [];
      if (dotsEl) {
        ok.forEach((_, i) => {
          const b = document.createElement('button');
          b.setAttribute('aria-label', `Go to screenshot ${i + 1}`);
          if (i === 0) b.classList.add('is-active');
          b.addEventListener('click', () => go(i));
          dotsEl.appendChild(b);
          dotEls.push(b);
        });
      }

      const go = (n) => {
        index = (n + slides.length) % slides.length;
        slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
        dotEls.forEach((d, i) => d.classList.toggle('is-active', i === index));
      };

      const prev = controls && controls.querySelector('[data-demo-prev]');
      const next = controls && controls.querySelector('[data-demo-next]');
      if (prev) prev.addEventListener('click', () => go(index - 1));
      if (next) next.addEventListener('click', () => go(index + 1));
    });
  }

  /* -------------------- Init -------------------- */
  function init() {
    splitHeroTitle();
    initTeamAvatars();
    initDemoGallery();
    initNavScroll();
    initSmoothScroll();
    initCursorGlow();
    initMagneticButtons();
    initCardTilt();

    // Fire load sequence once fonts settle for cleaner staggered reveal
    let ranOnce = false;
    const runOnce = () => { if (ranOnce) return; ranOnce = true; runLoadSequence(); };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(runOnce);
      setTimeout(runOnce, 800); // fallback if fonts.ready hangs
    } else {
      runOnce();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
