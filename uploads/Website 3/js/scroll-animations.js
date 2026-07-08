/* =========================================================
   BlackSwan — scroll-animations.js
   GSAP ScrollTrigger orchestration:
   - Reveals for [data-reveal]
   - Problem cards ignite-in
   - Practice list bullets fade-in
   - Team cards fade-in
   - Solution: pinned step-through with 3D-scene step lighting
   - Particle state broadcast per section
   - Logo lockup reveal at CTA
   ========================================================= */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  function boot() {
    if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
      // GSAP failed to load — fall back to IntersectionObserver-based reveals
      fallbackReveals();
      return;
    }

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion) {
      document.querySelectorAll('[data-reveal], .problem-card, .team-card, .practice-list li, .logo-lockup')
        .forEach((el) => el.classList.add('is-visible'));
      return;
    }

    // ---------- Generic reveals ----------
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => el.classList.add('is-visible')
      });
    });

    // ---------- Problem cards ignite-in (staggered ~150ms) ----------
    const problemCards = document.querySelectorAll('.problem-card');
    if (problemCards.length) {
      ScrollTrigger.create({
        trigger: '.problem-grid',
        start: 'top 78%',
        once: true,
        onEnter: () => {
          problemCards.forEach((card, i) => {
            setTimeout(() => card.classList.add('is-visible'), i * 150);
          });
        }
      });
    }

    // ---------- Practice list bullets ----------
    const bullets = document.querySelectorAll('.practice-list li');
    if (bullets.length) {
      ScrollTrigger.create({
        trigger: '.practice-list',
        start: 'top 82%',
        once: true,
        onEnter: () => {
          bullets.forEach((li, i) => {
            setTimeout(() => li.classList.add('is-visible'), i * 80);
          });
        }
      });
    }

    // ---------- Team cards ----------
    const teamCards = document.querySelectorAll('.team-card');
    if (teamCards.length) {
      ScrollTrigger.create({
        trigger: '.team-grid',
        start: 'top 82%',
        once: true,
        onEnter: () => {
          teamCards.forEach((card, i) => {
            setTimeout(() => card.classList.add('is-visible'), i * 100);
          });
        }
      });
    }

    // ---------- Logo lockup reveal ----------
    const logo = document.querySelector('.logo-lockup');
    if (logo) {
      ScrollTrigger.create({
        trigger: logo,
        start: 'top 80%',
        once: true,
        onEnter: () => logo.classList.add('is-visible')
      });
    }

    // ---------- Particle state broadcast (in addition to IO in particle-field.js) ----------
    document.querySelectorAll('[data-particle-state]').forEach((sec) => {
      const state = sec.getAttribute('data-particle-state');
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => window.BS && window.BS.particles && window.BS.particles.setState(state),
        onEnterBack: () => window.BS && window.BS.particles && window.BS.particles.setState(state)
      });
    });

    // ---------- Solution: pinned step-through ----------
    const stage = document.querySelector('.solution-stage');
    const steps = document.querySelectorAll('.step');
    if (stage && steps.length) {
      const stepCount = steps.length;

      // On desktop only: pin the stage while the user steps through the process.
      // On mobile: no pin; reveal steps as they enter view (avoids the classic
      // mobile pinned-scroll-breakage problem).
      if (!isMobile) {
        // Pinned distance was previously stepCount + 0.6 (~3.6 viewport heights
        // for 3 steps) — that felt like a long scrub. Tightened to
        // stepCount * 0.55 + 0.25 (~1.9vh total for 3 steps), and snapped so
        // each scroll gesture cleanly advances one step instead of leaving the
        // user parked at an in-between fraction. Tune 0.55 further if a real
        // trackpad-vs-wheel test suggests one input feels too aggressive.
        ScrollTrigger.create({
          trigger: stage,
          start: 'top top+=80',
          end: () => `+=${window.innerHeight * (stepCount * 0.55 + 0.25)}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.5,
          snap: {
            snapTo: 1 / (stepCount - 1),   // 0, 0.5, 1 for 3 steps
            duration: { min: 0.2, max: 0.45 },
            ease: 'power1.inOut',
            delay: 0.05
          },
          onUpdate: (self) => {
            const p = self.progress;              // 0..1 across the pinned span
            // Choose active step from progress with soft edges
            let activeIdx = Math.min(stepCount - 1, Math.floor(p * stepCount * 0.98));
            // Boost first step so it lights immediately, not blank
            if (p < 0.02) activeIdx = 0;
            steps.forEach((s, i) => s.classList.toggle('is-active', i === activeIdx));
            if (window.BS && window.BS.solution3d) {
              window.BS.solution3d.setStepProgress(p);
            }
          },
          onLeaveBack: () => {
            steps.forEach((s) => s.classList.remove('is-active'));
          }
        });
      } else {
        // Mobile: step entrances via IO
        steps.forEach((step, i) => {
          ScrollTrigger.create({
            trigger: step,
            start: 'top 75%',
            onEnter: () => {
              steps.forEach((s, j) => s.classList.toggle('is-active', j === i));
              if (window.BS && window.BS.solution3d) {
                window.BS.solution3d.setActiveStep(i);
              }
            },
            onEnterBack: () => {
              steps.forEach((s, j) => s.classList.toggle('is-active', j === i));
              if (window.BS && window.BS.solution3d) {
                window.BS.solution3d.setActiveStep(i);
              }
            }
          });
        });
      }
    }

    // Refresh ScrollTrigger after fonts load — measurement can shift.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  function fallbackReveals() {
    // No GSAP available (e.g. offline / CDN blocked). Show everything gracefully.
    const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 }) : null;

    const targets = document.querySelectorAll('[data-reveal], .problem-card, .team-card, .practice-list li, .logo-lockup');
    if (io) targets.forEach((el) => io.observe(el));
    else targets.forEach((el) => el.classList.add('is-visible'));

    // Also light the first step so the section doesn't look broken
    const first = document.querySelector('.step');
    if (first) first.classList.add('is-active');
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    boot();
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();
