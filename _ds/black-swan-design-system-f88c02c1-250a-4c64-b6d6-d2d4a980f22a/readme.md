# Black Swan — Design System

A high-contrast, premium-editorial system for **Black Swan Solutions**. Warm
neutrals carry every surface; a single loud **Signal Orange** is the only
accent — used sparingly and with intent. The mark is a shield + swan crest;
the product voice is calm, precise, and risk-aware.

> **Sources provided to build this system**
> - `uploads/LOGO BLACK SWAN Kopie.png` — primary logo (shield crest + wordmark, copied to `assets/logo-black-swan.png`).
> - `uploads/styleguide.html` — a hand-authored token/component styleguide (German). Every token, color scale, type ramp, spacing/radius/shadow value and component spec here is derived directly from it.
>
> No product codebase, Figma file, or screenshots were provided. The **Signal
> Console** UI kit is an *original, plausible product surface* built to
> exercise the components — not a recreation of an existing product. See
> CAVEATS at the bottom.

---

## Index — what's in this folder

| Path | What |
|---|---|
| `styles.css` | Global entry point. Consumers link **this** file only. `@import`s the token files below. |
| `tokens/colors.css` | Orange + warm-black primitives, status hues. |
| `tokens/typography.css` | Font families, type scale, weights, tracking. |
| `tokens/spacing.css` | 4px spacing grid, radius, elevation, motion. |
| `tokens/semantic.css` | Theme-aware aliases + `[data-theme="dark"]`. |
| `tokens/fonts.css` | Inter + JetBrains Mono (Google Fonts). |
| `components/core/` | Button, Input, Select, Checkbox, Switch, Badge, Alert, Card (+ `.d.ts`, `.prompt.md`, card). |
| `ui_kits/console/` | **Signal Console** — interactive login → dashboard → signal-detail kit. |
| `guidelines/*.card.html` | Foundation specimen cards (Colors, Type, Spacing, Brand). |
| `assets/` | Logo. |
| `SKILL.md` | Agent-Skills entry point for use in Claude Code. |

**Components:** `Button` · `Input` · `Select` · `Checkbox` · `Switch` · `Badge` · `Alert` · `Card`
**UI kits:** `console` (Signal Console)
**Namespace (for cards):** `window.BlackSwanDesignSystem_f88c02`

---

## CONTENT FUNDAMENTALS — how Black Swan writes

The provided styleguide is authored in **German**; product copy should default
to German for the Black Swan audience, with English used for international
surfaces. The two voices share the same rules.

- **Tone:** calm, expert, risk-aware. The brand names itself after "black
  swan" events — rare, high-impact. Copy is confident but never breathless;
  it states what is happening and what to do.
- **Casing:** Sentence case for UI labels and buttons ("New scenario", "Sign
  in to Console"). Reserve ALL-CAPS for short mono overlines/labels with wide
  tracking ("SIGNAL CONSOLE", "OVERVIEW").
- **Person:** address the user as *you* / *Sie* (German); the system speaks in
  the third person about itself ("Model detected a deviation…"). Avoid "we".
- **Verbs:** imperative and specific — *Run scenario*, *Acknowledge*, *Assign*,
  *Filter*. No vague "Learn more" / "Get started" filler.
- **Numbers & units:** precise, mono-set. Scores are integers (0–100); money
  carries the currency symbol (€48.2M); deltas keep their sign (+14, −3).
- **No emoji.** Iconography does the lightweight signalling instead (see
  ICONOGRAPHY). No exclamation marks in system copy.
- **Example overline → headline → lead** (the styleguide's own cover):
  > `DESIGN SYSTEM` · **Black Swan** · "High-contrast, premium-editorial
  > system. Warm neutrals carry the surface; bold signal-orange is the one
  > loud accent — used sparingly and on purpose."

---

## VISUAL FOUNDATIONS

**Color.** Two scales do the work: a **warm Swan-Black neutral ramp**
(`#0F0F0F → #F5F4F0`, slightly warm rather than pure grey) and a single
**Signal Orange** (`#F05A1A`) accent. Orange appears *once* per view — the
primary action, an active nav item, a critical badge. Status hues
(success/warning/danger/info) are reserved strictly for system feedback, never
decoration. Build against the **semantic aliases** (`--primary`, `--card`,
`--foreground`…), which flip under `[data-theme="dark"]`.

**Type.** One family — **Inter** — weighted 400→900. Display is heavy
(800) with tight tracking (−0.03em); body is 400/16px at 1.5 line-height;
overlines are 12px 600 uppercase with wide tracking (.12em) in orange.
**JetBrains Mono** carries code, tokens, IDs, scores and data — anything
tabular. The pairing reads premium-editorial, not techy-neon.

**Spacing & layout.** Strict **4px grid** (`--space-1`…`--space-16`). Generous
outer padding (24–48px on surfaces); dense, scannable tables inside cards.
Sidebars are fixed-width (248px); content scrolls, chrome doesn't.

**Backgrounds.** Flat and quiet — warm off-white (`--background`) in light, near
black in dark. **No gradients on content.** The single permitted gradient is a
soft radial orange glow used decoratively on dark brand panels (e.g. the login
hero) at low opacity. No photographic imagery or textures in the core system;
no repeating patterns.

**Cards & surfaces.** White (`--card`), **1px hairline border**
(`--border`), radius **`--radius-xl` (16px)**, soft `--shadow-sm`. Shadows are
**warm-black tinted** (`rgba(15,15,15,…)`), never pure black, and stay soft —
elevation is gentle (xs→xl). Interactive cards lift 2px with `--shadow-lg` on
hover.

**Corner radii.** sm 4 (inputs inner, chips), md 8 (buttons, inputs), lg 12
(panels, alerts), xl 16 (cards), full (badges, switches, avatars).

**Borders.** Hairline 1px `--border` everywhere; focus replaces it with the
orange ring (`--ring`) plus a 3px translucent halo (`--shadow-focus`).

**Motion.** Fast and decisive — **one duration (150ms)**, **one ease**
(`cubic-bezier(.2,0,0,1)`). Hover = background/opacity shift; press = darker
shade (`--primary-active`), not a bounce; drawers slide 250ms. No looping or
decorative animation.

**Hover / press states.** Buttons darken on hover (`--primary-hover`) and
darken further on press (`--primary-active`); ghost/outline fill with
`--muted`. Nav items brighten text to white on dark. No scale-shrink except the
implicit press-darken.

**Transparency & blur.** Used sparingly: sticky headers use an 85% surface
tint + `backdrop-filter: blur(8px)`; modal scrims are `rgba(15,15,15,.4)`.
Accent tints in dark mode use low-alpha orange (`rgba(240,90,26,.16)`).

**Imagery vibe.** When imagery is used it should be **cool, restrained, and
high-contrast** — the brand is monochrome-leaning with orange as the only warm
note. Avoid saturated, playful, or warm-filtered photography.

---

## ICONOGRAPHY

The provided assets contain **no icon set** — only the logo. The system
therefore standardises on **Phosphor Icons** (regular + fill weights), loaded
from CDN. Phosphor's even, medium-weight stroke matches the clean editorial
feel; it is used at 16–22px, inheriting `currentColor`.

- **Usage:** functional only — nav, actions, status, table affordances. Icons
  never replace a label in primary actions; they sit beside it (`iconLeft`).
- **Weight:** `regular` for UI, `fill` only for the brand bird mark in the
  sidebar/login lockups.
- **No emoji, no unicode-glyph icons** in product surfaces (a couple of arrow
  glyphs appear only in specimen cards for brevity).
- **Logo:** `assets/logo-black-swan.png` (shield crest + "BLACK SWAN /
  SOLUTIONS" wordmark with orange dashes). On dark, reverse it (CSS
  `filter: invert(1)`), shown in the *Logo on dark* brand card.

> ⚠️ **Substitution flagged:** Phosphor is a stand-in. If Black Swan has an
> official icon library, point me at it and I'll swap it in.
> ⚠️ **Fonts:** Inter & JetBrains Mono load from Google Fonts (the families the
> styleguide specifies). If you self-host the binaries, drop them in and I'll
> convert `tokens/fonts.css` to `@font-face` rules.
