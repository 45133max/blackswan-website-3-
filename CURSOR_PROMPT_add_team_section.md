# BLACKSWAN WEBSITE REDESIGN — ADD TEAM SECTION

## CONTEXT

**Working folder:** `C:\Users\alber_u5z2z37\OneDrive\Documents\Maastricht IB\BlackSwan 2\BlackSwan Website Redesign\` — this repo is called "BlackSwan Website Redesign" in Cursor's sidebar. Make sure the active agent/session is scoped to this project specifically, not one of the other unrelated repos in the workspace (BARBER123, dincho-bikes, roudabout, Cato by Cato, Boni Rastafari House Proto, etc.).

**Target file:** `BlackSwan Website.dc.html`, directly inside that folder — this is the partner's build, not the earlier vanilla "Website 3" build. Match its existing conventions exactly (inline styles, the color tokens already in use, `'JetBrains Mono'` for eyebrows/labels, the `data-reveal`/`data-reveal-delay` scroll-reveal pattern, and the `grid-template-rows: 0fr → 1fr` accordion technique already used in the Problem section — reuse that exact mechanism, don't invent a new one).

**Insertion point:** add the new `<section id="bs-team">` between the closing `</section>` of `#bs-how` ("Structure — 3 horizontal steps") and the opening `<section id="bs-closing">` ("Closing + CTA"). Team sits right before the final CTA — humanize before asking for contact.

**Roster: 3 founders only** — Moritz Fritz, Noah Heinz, Albert Zapke. Do not include Stefan Ristic or Fouad Zait; they aren't part of this section.

**Interaction pattern:** each founder's card has a "Find out more" toggle, identical mechanism to the Problem section's accordion cards (CSS grid `0fr→1fr` height animation, `ph-plus` icon rotating 45deg on open, label switching between "Find out more" and "Close"). What it reveals here is a short responsibilities blurb per founder, not a stat like the Problem cards.

**Photos:** reference `assets/team/moritz.jpg`, `assets/team/noah.jpg`, `assets/team/albert.jpg`. These aren't supplied yet — Bert will drop them in (the current live site already has usable circular headshots of all three; easiest is to save those three images from the current live site and place them at those paths, rather than shooting new ones). Build the circular photo frame so it displays correctly once those files exist; don't block on their absence.

---

## SECTION HTML

Insert this section:

```html
<!-- ============ TEAM ============ -->
<section id="bs-team" data-screen-label="Team — 3 founders" style="background:#0F0F0F;padding:140px 32px 150px;position:relative;overflow:hidden;">
  <div style="max-width:1160px;margin:0 auto;text-align:center;">
    <p data-reveal style="margin:0;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:12px;letter-spacing:0.14em;color:#F05A1A;">THE TEAM</p>
    <h2 data-reveal data-reveal-delay="70" style="margin:18px auto 0;max-width:20ch;font-size:clamp(34px,3.8vw,48px);font-weight:900;letter-spacing:-0.03em;line-height:1.08;color:#FFFFFF;text-wrap:balance;">Three founders. One mission.</h2>
    <p data-reveal data-reveal-delay="140" style="margin:22px auto 0;max-width:58ch;font-size:17px;line-height:1.6;color:#B0AFA9;">We started BlackSwan because the data is clear: companies spend millions on training that nobody remembers. We're building the product we wish existed.</p>
    <p data-reveal data-reveal-delay="200" style="margin:14px 0 0;font-size:14px;font-style:italic;color:#6B7280;">A young team. Fast, focused, and close enough to the problem to actually solve it.</p>

    <div style="margin-top:56px;display:grid;grid-template-columns:repeat(3, 1fr);gap:24px;text-align:left;">

      <!-- Founder 01 — Moritz Fritz -->
      <article data-reveal style="background:#141414;border:1px solid rgba(245,244,240,0.10);border-radius:16px;padding:30px 28px 18px;text-align:center;transition:transform 150ms cubic-bezier(.2,0,0,1),border-color 150ms cubic-bezier(.2,0,0,1);" style-hover="transform:translateY(-2px);border-color:rgba(240,90,26,0.35);">
        <div style="width:96px;height:96px;border-radius:50%;margin:0 auto;overflow:hidden;background:#2A2A2A;">
          <img src="assets/team/moritz.jpg" alt="Moritz Fritz" style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>
        <h3 style="margin:18px 0 4px;font-size:19px;font-weight:800;letter-spacing:-0.01em;color:#FFFFFF;">Moritz Fritz</h3>
        <p style="margin:0;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:11px;letter-spacing:0.14em;color:#F05A1A;">CO-FOUNDER &amp; CEO</p>
        <div style="display:grid;grid-template-rows:{{tm0Rows}};transition:grid-template-rows 300ms cubic-bezier(.2,0,0,1);">
          <div style="overflow:hidden;min-height:0;">
            <div style="border-top:1px solid rgba(245,244,240,0.10);margin-top:18px;padding-top:16px;text-align:left;">
              <p style="margin:0;font-size:13.5px;line-height:1.55;color:#B0AFA9;">Moritz drives go-to-market strategy, comprehensive market research, and problem validation. He makes sure BlackSwan solves the problems enterprise buyers actually pay for. Not theoretical ones.</p>
            </div>
          </div>
        </div>
        <button type="button" onClick="{{tmToggle0}}" aria-expanded="{{tm0Open}}" style="display:flex;align-items:center;gap:8px;margin:16px auto 0;padding:10px 0;background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;font-size:14px;color:#C04010;">
          <i class="ph ph-plus" aria-hidden="true" style="font-size:15px;transition:transform 250ms cubic-bezier(.2,0,0,1);transform:{{tm0IconRot}};"></i>{{tm0Label}}
        </button>
      </article>

      <!-- Founder 02 — Noah Heinz -->
      <article data-reveal data-reveal-delay="90" style="background:#141414;border:1px solid rgba(245,244,240,0.10);border-radius:16px;padding:30px 28px 18px;text-align:center;transition:transform 150ms cubic-bezier(.2,0,0,1),border-color 150ms cubic-bezier(.2,0,0,1);" style-hover="transform:translateY(-2px);border-color:rgba(240,90,26,0.35);">
        <div style="width:96px;height:96px;border-radius:50%;margin:0 auto;overflow:hidden;background:#2A2A2A;">
          <img src="assets/team/noah.jpg" alt="Noah Heinz" style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>
        <h3 style="margin:18px 0 4px;font-size:19px;font-weight:800;letter-spacing:-0.01em;color:#FFFFFF;">Noah Heinz</h3>
        <p style="margin:0;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:11px;letter-spacing:0.14em;color:#F05A1A;">CO-FOUNDER &amp; CEO</p>
        <div style="display:grid;grid-template-rows:{{tm1Rows}};transition:grid-template-rows 300ms cubic-bezier(.2,0,0,1);">
          <div style="overflow:hidden;min-height:0;">
            <div style="border-top:1px solid rgba(245,244,240,0.10);margin-top:18px;padding-top:16px;text-align:left;">
              <p style="margin:0;font-size:13.5px;line-height:1.55;color:#B0AFA9;">Noah leads platform architecture, training engine development, and innovative learning methodologies. He builds the technology behind BlackSwan's adaptive learning system — from diagnostic algorithms to scenario-based training environments.</p>
            </div>
          </div>
        </div>
        <button type="button" onClick="{{tmToggle1}}" aria-expanded="{{tm1Open}}" style="display:flex;align-items:center;gap:8px;margin:16px auto 0;padding:10px 0;background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;font-size:14px;color:#C04010;">
          <i class="ph ph-plus" aria-hidden="true" style="font-size:15px;transition:transform 250ms cubic-bezier(.2,0,0,1);transform:{{tm1IconRot}};"></i>{{tm1Label}}
        </button>
      </article>

      <!-- Founder 03 — Albert Zapke -->
      <article data-reveal data-reveal-delay="180" style="background:#141414;border:1px solid rgba(245,244,240,0.10);border-radius:16px;padding:30px 28px 18px;text-align:center;transition:transform 150ms cubic-bezier(.2,0,0,1),border-color 150ms cubic-bezier(.2,0,0,1);" style-hover="transform:translateY(-2px);border-color:rgba(240,90,26,0.35);">
        <div style="width:96px;height:96px;border-radius:50%;margin:0 auto;overflow:hidden;background:#2A2A2A;">
          <img src="assets/team/albert.jpg" alt="Albert Zapke" style="width:100%;height:100%;object-fit:cover;display:block;">
        </div>
        <h3 style="margin:18px 0 4px;font-size:19px;font-weight:800;letter-spacing:-0.01em;color:#FFFFFF;">Albert Zapke</h3>
        <p style="margin:0;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:11px;letter-spacing:0.14em;color:#F05A1A;">CO-FOUNDER &amp; COO</p>
        <div style="display:grid;grid-template-rows:{{tm2Rows}};transition:grid-template-rows 300ms cubic-bezier(.2,0,0,1);">
          <div style="overflow:hidden;min-height:0;">
            <div style="border-top:1px solid rgba(245,244,240,0.10);margin-top:18px;padding-top:16px;text-align:left;">
              <p style="margin:0;font-size:13.5px;line-height:1.55;color:#B0AFA9;">Albert handles client outreach, brand identity, and business development. He's the bridge between the product and the market — from first conversations with compliance leaders to pilot launches.</p>
            </div>
          </div>
        </div>
        <button type="button" onClick="{{tmToggle2}}" aria-expanded="{{tm2Open}}" style="display:flex;align-items:center;gap:8px;margin:16px auto 0;padding:10px 0;background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;font-size:14px;color:#C04010;">
          <i class="ph ph-plus" aria-hidden="true" style="font-size:15px;transition:transform 250ms cubic-bezier(.2,0,0,1);transform:{{tm2IconRot}};"></i>{{tm2Label}}
        </button>
      </article>

    </div>
  </div>
</section>
```

**Note on the three responsibility blurbs above:** these are final, confirmed copy (Bert's own text, not AI-drafted) — safe to ship as-is, no review pass needed on the wording itself.

---

## COMPONENT STATE — EXTEND, DON'T REPLACE

In the existing `class Component extends DCLogic` block, extend `state` and `renderVals()` with the same helper functions already defined (`rows`, `rot`, `label`) — don't duplicate the helpers, reuse them:

```js
state = { open0: false, open1: false, open2: false, tm0: false, tm1: false, tm2: false };

renderVals() {
  // ...existing email/motionMode/p0-p2 logic stays exactly as-is...
  const rows = (o) => (o ? '1fr' : '0fr');
  const rot = (o) => (o ? 'rotate(45deg)' : 'rotate(0deg)');
  const label = (o) => (o ? 'Close' : 'Find out more');
  return {
    // ...existing returned keys stay...
    tm0Rows: rows(this.state.tm0), tm1Rows: rows(this.state.tm1), tm2Rows: rows(this.state.tm2),
    tm0IconRot: rot(this.state.tm0), tm1IconRot: rot(this.state.tm1), tm2IconRot: rot(this.state.tm2),
    tm0Label: label(this.state.tm0), tm1Label: label(this.state.tm1), tm2Label: label(this.state.tm2),
    tm0Open: this.state.tm0 ? 'true' : 'false',
    tm1Open: this.state.tm1 ? 'true' : 'false',
    tm2Open: this.state.tm2 ? 'true' : 'false',
    tmToggle0: () => this.setState(s => ({ tm0: !s.tm0 })),
    tmToggle1: () => this.setState(s => ({ tm1: !s.tm1 })),
    tmToggle2: () => this.setState(s => ({ tm2: !s.tm2 }))
  };
}
```

No changes needed to `componentDidMount()` — the existing `data-reveal` IntersectionObserver logic already picks up any new element with that attribute automatically, and the scroll-scrub `frame()` loop doesn't need to know about this section at all (it's not scroll-jacked, just a normal reveal-on-scroll section like Problem).

---

## QUALITY CHECKLIST

1. [ ] New `#bs-team` section sits between `#bs-how` and `#bs-closing`
2. [ ] Exactly 3 cards (Moritz, Noah, Albert) — Stefan and Fouad are not present anywhere in this section
3. [ ] Eyebrow, headline, intro line, and italic line all use `data-reveal` and fade in on scroll, consistent with every other section
4. [ ] Each card's "Find out more" toggle uses the same `grid-template-rows: 0fr→1fr` mechanism as the Problem section — no new/different accordion implementation
5. [ ] Icon rotates 45deg and label swaps to "Close" when open, matching Problem section exactly
6. [ ] Circular photo frames render correctly once real image files exist at `assets/team/moritz.jpg`, `noah.jpg`, `albert.jpg` — don't break if they're temporarily missing (broken image icon is acceptable until Bert supplies them; don't add complex fallback logic beyond what's already simple)
7. [ ] Card hover state matches Problem card's hover pattern (subtle lift/border highlight), adapted to the dark card background
8. [ ] `state` and `renderVals()` changes are additive — nothing in the existing Problem-card toggle logic (`open0/1/2`) is touched or renamed
9. [ ] No console errors, page still scrolls/functions normally through the rest of the sections
