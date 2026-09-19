---
name: modular-design-system
description: Category-switchable UI design system. Use whenever building, restyling or reviewing any web UI (dashboard, landing page, store, portfolio, blog, docs, or any custom category). Reads the CONFIG block, applies the chosen category preset plus theme tokens (color, font, radius, density, motion, UI library), and produces production-grade, non-generic interfaces. Change one line (`category`) to re-skin the whole site.
---

# Modular Design System (MDS)

One file. One config block. Change `category` and the whole page structure, density, typography scale and motion change with it. Change `look`, `primary`, `radius` and so on to retheme.

---

## 0. Agent protocol (read first)

1. **Read CONFIG** (section 1). It is the source of truth.
2. **Onboarding gate.**
   - If `status: default` and the user has not said "use defaults" or given full requirements → ask the questions in section 2 **once**, in a single message (or a tappable-options tool if available). Max 6 questions. Then write answers into CONFIG and set `status: configured`.
   - If the user's prompt already answers a field → do not re-ask it.
   - If `status: configured` or the user says "defaults" → skip questions and build.
3. **Resolve tokens** with this precedence (highest wins):
   `user's message` > `CONFIG explicit values` > `category defaults (section 5)` > `look defaults (section 3)` > `base tokens (section 4)`.
   A CONFIG value of `auto` means "inherit from the layer below".
4. **Plan → review → build → critique** (section 10). Never skip the plan.
5. **Never output anything on the banned list** (section 9). It is the anti-slop contract.
6. Never touch files outside the design-system directory to "fix" style unless asked. Mount, do not rewrite (section 6).

---

## 1. CONFIG (edit this block)

<!-- CONFIG:START -->
```yaml
status: default            # default | configured
category: landing-marketing # saas-dashboard | landing-marketing | ecommerce | portfolio-blog-docs | custom:<name>
look: minimal-clean         # minimal-clean | dark-bold | soft-glass | playful | editorial | brutalist | custom

# --- Theme (auto = inherit from look/category) ---
mode: auto                  # light | dark | system | auto
primary: auto               # hex e.g. "#5B5BD6" | auto
neutral: auto               # neutral | zinc | slate | stone | gray | auto
font_sans: auto             # any Google/Fontsource family | auto
font_display: auto          # same | any family | auto
font_mono: auto             # any mono family | auto
radius: auto                # sharp | subtle | rounded | soft | pill | auto
density: auto               # compact | comfortable | spacious | auto (category decides)
border: auto                # none | hairline | strong | auto
shadow: auto                # none | subtle | layered | hard | auto
motion: auto                # none | subtle | expressive | auto

# --- Stack ---
framework: vite-react       # vite-react | nextjs | astro | sveltekit | vue | html
css: tailwind-v4            # tailwind-v4 | tailwind-v3 | css-modules | vanilla
ui_library: shadcn/ui       # see suggestions in section 8
icon_library: lucide-react
animation_lib: motion       # motion | css-only | gsap | auto-animate
charts: recharts
tables: "@tanstack/react-table"
forms: react-hook-form+zod

# --- Content ---
copy_tone: plain            # plain | friendly | technical | premium | playful
language: en
extra_notes: ""             # free text: brand, audience, product, constraints
```
<!-- CONFIG:END -->

### Quick presets (copy one line into CONFIG)
| Want | Set |
|---|---|
| Product app | `category: saas-dashboard` |
| Marketing site | `category: landing-marketing` |
| Online store | `category: ecommerce` |
| Blog / docs / portfolio | `category: portfolio-blog-docs` |
| Sharp corners everywhere | `radius: sharp` |
| Fully round controls | `radius: pill` |
| Dark-only | `mode: dark` |
| Own brand color | `primary: "#0EA5A4"` |
| Dense data UI | `density: compact` |
| No animation | `motion: none` |

### Add your own category
Copy the template in section 11, add it to the registry (section 6), and set `category: custom:<name>`.

---

## 2. Onboarding questions (agent asks; humans can answer in CONFIG)

Ask only unanswered ones. Offer the default in brackets.

1. **Category?** SaaS dashboard / Landing / E-commerce / Portfolio-Blog-Docs / other (name it). [landing-marketing]
2. **Look?** Minimal clean / Dark bold / Soft glass / Playful / Editorial / Brutalist. [minimal-clean]
3. **Corners?** Sharp / Subtle / Rounded / Soft / Pill. [rounded]
4. **Brand color and font?** Hex + family, or "you pick". [look default]
5. **Light, dark, or follow system?** [system]
6. **Stack / UI library?** [React + Tailwind + shadcn/ui]
7. *(Only if unknown)* **What is the product, who is the audience, what is the one primary action?** This grounds copy and hero.

A one-shot terminal alternative is in section 12.

---

## 3. Look presets (starting points; every value is overridable)

| look | mode | neutral | primary | radius | border | shadow | sans / display | mono | motion |
|---|---|---|---|---|---|---|---|---|---|
| **minimal-clean** *(default)* | system | neutral | `#5B5BD6` | rounded | hairline | subtle | Geist / same | Geist Mono | subtle |
| dark-bold | dark | zinc | `#22D3EE` | subtle | hairline | none | Inter / Space Grotesk | JetBrains Mono | expressive |
| soft-glass | light | slate | `#4F7DF3` | soft | hairline (alpha) | layered | Manrope / same | Geist Mono | subtle |
| playful | light | stone | `#E8447A` | pill | strong | hard | DM Sans / Bricolage Grotesque | DM Mono | expressive |
| editorial | light | stone | user-chosen | sharp | hairline | none | Inter / Newsreader | IBM Plex Mono | subtle |
| brutalist | light | gray | user-chosen | sharp | strong | hard | Space Grotesk / same | JetBrains Mono | none |

`minimal-clean` = Linear / Vercel lineage: near-monochrome neutrals, one accent, hairline borders, tight tracking, no decoration that carries no information.

Rules for `primary`:
- Exactly one brand accent. Semantic colors (success / warning / danger / info) are separate and only used for status.
- Derive: hover = 88% primary + black (`color-mix`), ring = primary at 40% alpha, subtle bg = primary at 8-10% alpha.
- Verify contrast: text on primary ≥ 4.5:1, UI boundaries ≥ 3:1. If it fails, flip the text color, not the accent.
- If the brief names a subject (medical, fintech, kids), pick the accent from that world, not from this table.

---

## 4. Base tokens

### 4.1 Color (light / dark)
```css
:root {
  --brand: #5B5BD6;                 /* from CONFIG.primary, set by provider */
  --background: #FFFFFF;  --foreground: #171717;
  --card: #FFFFFF;        --card-foreground: #171717;
  --popover: #FFFFFF;     --popover-foreground: #171717;
  --muted: #F5F5F5;       --muted-foreground: #6B6B6B;
  --border: #E5E5E5;      --input: #E5E5E5;
  --primary: var(--brand);
  --primary-hover: color-mix(in oklab, var(--brand) 88%, black);
  --primary-foreground: #FFFFFF;
  --secondary: #F5F5F5;   --secondary-foreground: #171717;
  --accent: color-mix(in oklab, var(--brand) 9%, transparent);
  --accent-foreground: var(--foreground);
  --ring: color-mix(in oklab, var(--brand) 40%, transparent);
  --success: #16A34A; --warning: #D97706; --danger: #DC2626; --info: #2563EB;
}
.dark {
  --background: #0A0A0A;  --foreground: #EDEDED;
  --card: #111111;        --card-foreground: #EDEDED;
  --popover: #111111;     --popover-foreground: #EDEDED;
  --muted: #171717;       --muted-foreground: #A1A1A1;
  --border: #262626;      --input: #262626;
  --primary-hover: color-mix(in oklab, var(--brand) 88%, white);
  --secondary: #171717;   --secondary-foreground: #EDEDED;
}
```
Dark mode is designed, not inverted: lower saturation of the accent, raise surface steps by lightness (background < card < popover), keep borders visible.

### 4.2 Radius (hierarchy-aware)
```css
:root { --radius: 0.5rem; }
[data-radius="sharp"]   { --radius: 0; }
[data-radius="subtle"]  { --radius: 0.25rem; }
[data-radius="rounded"] { --radius: 0.5rem; }
[data-radius="soft"]    { --radius: 0.875rem; }
[data-radius="pill"]    { --radius: 1rem; --radius-control: 9999px; }

:root {
  --radius-control: var(--radius);                                 /* buttons, inputs, badges */
  --radius-surface: min(calc(var(--radius) + 4px), 1.5rem);        /* cards, dialogs, popovers */
}
[data-radius="sharp"] { --radius-surface: 0; }
[data-radius="pill"]  { --radius-control: 9999px; --radius-surface: 1.5rem; }
```
Rule: inner radius = outer radius − padding (never equal). Images inside a card use `calc(var(--radius-surface) - padding)`. Avatars are the only always-circular element unless `radius: pill` or `sharp`.

### 4.3 Spacing, density, sizing
4px base grid: `4 8 12 16 20 24 32 40 48 64 80 96 128`.
```css
[data-density="compact"]     { --control-h: 2rem;   --row-h: 2rem;   --pad: 0.75rem; --gap: 0.75rem; --section-y: 3rem; }
[data-density="comfortable"] { --control-h: 2.5rem; --row-h: 2.75rem; --pad: 1rem;   --gap: 1rem;    --section-y: 5rem; }
[data-density="spacious"]    { --control-h: 3rem;   --row-h: 3.5rem; --pad: 1.5rem; --gap: 1.5rem;  --section-y: 8rem; }
```
Minimum touch target 44×44 px on touch devices regardless of density (extend hit area with padding or pseudo-element).

### 4.4 Border and shadow
```css
[data-border="none"]     { --bw: 0; }
[data-border="hairline"] { --bw: 1px; }
[data-border="strong"]   { --bw: 2px; --border: var(--foreground); }

[data-shadow="none"]    { --shadow-1: none; --shadow-2: none; }
[data-shadow="subtle"]  { --shadow-1: 0 1px 2px rgb(0 0 0 / .05); --shadow-2: 0 4px 12px rgb(0 0 0 / .08); }
[data-shadow="layered"] { --shadow-1: 0 1px 1px rgb(0 0 0 / .04), 0 2px 4px rgb(0 0 0 / .04);
                          --shadow-2: 0 2px 2px rgb(0 0 0 / .04), 0 8px 16px rgb(0 0 0 / .06), 0 24px 48px rgb(0 0 0 / .06); }
[data-shadow="hard"]    { --shadow-1: 3px 3px 0 var(--foreground); --shadow-2: 6px 6px 0 var(--foreground); }
```
Use border **or** shadow to separate a surface, rarely both. Shadow only on floating layers (menus, dialogs, drawers) in `minimal-clean`.

### 4.5 Typography
- One family, or two clearly distinct. Max 2 font files loaded above the fold. `font-display: swap`, preload the primary.
- Scale (px / line-height / tracking): `12/16/0`, `13/18/0`, `14/20/0`, `16/24/0`, `18/28/-0.01em`, `20/28/-0.01em`, `24/32/-0.02em`, `30/36/-0.02em`, `36/40/-0.025em`, `48/52/-0.03em`, `60/64/-0.03em`, `72/76/-0.035em`.
- Weights: 400 body, 500 UI labels, 600 headings. Avoid 700+ except display in `playful` / `brutalist`.
- Measure: body ≤ 70ch, headings ≤ 22ch, UI copy ≤ 45ch.
- Tabular numerals (`font-variant-numeric: tabular-nums`) in tables, prices, stats.
- Serif body gets +0.05 line-height over sans.
- Fluid display: `clamp(2.5rem, 1.5rem + 4vw, 4.5rem)`.

### 4.6 Motion
```css
:root {
  --ease-out: cubic-bezier(0.2, 0, 0, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --dur-instant: 100ms; --dur-fast: 150ms; --dur-base: 200ms; --dur-slow: 300ms; --dur-scene: 500ms;
}
[data-motion="none"]       { --dur-instant: 0ms; --dur-fast: 0ms; --dur-base: 0ms; --dur-slow: 0ms; --dur-scene: 0ms; }
[data-motion="expressive"] { --dur-base: 250ms; --dur-slow: 400ms; --dur-scene: 700ms; }
@media (prefers-reduced-motion: reduce) { *,*::before,*::after { animation-duration: .01ms !important; transition-duration: .01ms !important; scroll-behavior: auto !important; } }
```
Rules:
- Animate `transform` and `opacity` only. Never width/height/top/left/box-shadow spreads on large areas.
- Motion answers an action (open, expand, confirm, reorder) or draws attention **once**. No ambient motion on every section or card.
- Press feedback: `scale(.98)` in `--dur-instant`. Menus/popovers 120-150ms, dialogs/sheets 200ms, page/scene 300-500ms.
- Exit is faster than enter (≈ 70%).
- Prefer skeletons that match final layout over spinners. Spinners only for sub-second inline actions.
- Use the View Transitions API for route/page changes where supported, with graceful fallback.
- Smooth-scroll libraries (Lenis etc.) only if the brief asks; they hurt accessibility and INP.

### 4.7 Layout
Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`. Mobile-first.
Containers: `narrow 640`, `prose 720`, `default 1152`, `wide 1280`, `fluid 100%`. z-index scale: `base 0`, `sticky 10`, `dropdown 20`, `overlay 30`, `modal 40`, `toast 50`.

---

## 5. Category presets

Each preset defines: defaults, shell, required parts, patterns, motion, performance, content rules, and what to avoid. All values can be overridden by CONFIG.

### 5.1 `saas-dashboard`
**Purpose:** repeat daily use, speed, scanning, trust in data.
**Defaults:** `density: compact`, base font 14px, `motion: subtle`, container `fluid`, radius from look, border-separated surfaces (no shadows on static cards).
**Shell:**
```
┌──────────┬─────────────────────────────────┐
│ Sidebar  │ Topbar: breadcrumb   ⌘K   user  │
│ 240/56px ├─────────────────────────────────┤
│ collapsi │ Page header: title · primary act │
│ ble      │ Filters / tabs                   │
│          │ Content grid (12 col, gap 16)    │
└──────────┴─────────────────────────────────┘
```
Mobile: sidebar becomes `Sheet`; topbar keeps search and one action.
**Required parts:** collapsible sidebar with grouped nav and active state, command palette (`Command`, ⌘K), breadcrumbs, page header (title + one primary action), data table, filters, empty/loading/error/no-permission states for every data view, settings layout (left sub-nav + form sections), toasts (`sonner`), confirm dialogs for destructive actions, keyboard shortcuts with visible hints.
**Data table:** sticky header, sortable columns, column visibility, row selection with bulk-action bar, inline row actions in a `DropdownMenu`, pagination or virtualization (>100 rows), saved views, resizable/pinned columns only when needed, right-aligned tabular numbers, truncation with tooltip.
**Stats/KPIs:** max 4 per row, value + label + delta only. Sparkline only when trend is the point. Do not clone one decorated card four times with icons in tinted squares.
**Charts:** ≤ 5 series, direct labels over legends, one highlight color + neutrals, axis labels with units, accessible tooltips, no 3D, no gradient fills by default.
**Forms:** inline validation on blur, error text under field, disabled → loading → success states, autosave where possible, unsaved-changes guard.
**Motion:** functional only (menus, sheets, row expand, toast, optimistic updates). No entrance animation on page load.
**Performance:** route-level code splitting, lazy-load charts/editors, virtualize long lists, optimistic mutations, `staleTime` caching with TanStack Query, no layout shift on data load (reserve skeleton dimensions).
**shadcn install:** `sidebar button input select checkbox switch tabs table dropdown-menu dialog sheet popover command tooltip badge skeleton sonner breadcrumb form separator scroll-area`.
**Avoid:** hero sections, marketing copy, big illustrations, gradient cards, decorative motion, hidden primary actions.

### 5.2 `landing-marketing`
**Purpose:** one visitor, one decision, one primary action.
**Defaults:** `density: spacious`, base 16px, display up to 72px, container `default (1152)`, `motion: subtle`, section rhythm `--section-y`.
**Shell:**
```
[ slim sticky nav: logo · 3-5 links · 1 CTA ]
[ hero: headline + 1 primary CTA + proof + real product visual ]
[ proof ][ value sections ][ how it works ][ pricing ][ FAQ ][ final CTA ][ footer ]
```
**Hero rule:** open with the most characteristic thing in the subject's world: real product UI, a live/interactive demo, a concrete result, or a strong image. Not a stat-plus-gradient default unless it is truly the best option. One primary CTA, one optional secondary. Above the fold on a 1440×800 and 390×844 viewport.
**Section library (choose by content, not by habit):**
- Proof: real logos, real numbers, real quotes with attribution. If none exist, omit the section. Never invent them.
- Value: alternate layouts (text-left/visual-right, then reversed, then a wide feature). Bento grids only when tiles differ in content weight.
- How it works: numbered markers **only** for a true sequence.
- Pricing: ≤ 3 tiers, monthly/annual toggle, highlight one tier, feature list with checks, FAQ beneath.
- FAQ: `Accordion`, answers ≤ 3 sentences.
- Final CTA: restate the outcome, one button.
**Type:** display 48-72px (clamp), tracking tight, ≤ 22ch, left-aligned by default; center only short hero/CTA blocks. Body 18px in hero sub, ≤ 60ch.
**Motion:** ONE orchestrated page-load moment (e.g., hero visual settling in) plus at most one scroll-linked element. Everything else static except user-triggered states.
**Performance:** LCP element is static and preloaded (`priority`), no autoplay heavy video above the fold, AVIF/WebP with explicit dimensions, fonts ≤ 2, third-party scripts deferred, target Lighthouse ≥ 95.
**SEO/conversion:** one `<h1>`, semantic sections, meta + OG image, JSON-LD (`Organization`/`Product`), sticky CTA on mobile only if the page is long.
**shadcn install:** `button badge accordion tabs card navigation-menu sheet separator input`.
**Avoid:** centered-everything, three identical icon cards, gradient blobs, fake stats, carousel of testimonials, cookie-banner-sized nav, more than one primary CTA per viewport.

### 5.3 `ecommerce`
**Purpose:** find → trust → add to cart → pay, with minimum friction.
**Defaults:** `density: comfortable`, base 15-16px, container `wide (1280)`, `motion: subtle`, image-forward, neutral chrome so product photography carries color.
**Shell:**
```
[ announcement (optional, dismissible) ]
[ header: logo · search(predictive) · account · cart(count) ]
[ category nav / mega menu ]
PLP: [ filters (sidebar → drawer on mobile) | sort · count | grid 2/3/4 ]
PDP: [ gallery (thumbs + zoom) | sticky buy box ] + details, reviews, related
Cart drawer → Checkout (single page) → Confirmation
```
**Product card:** consistent image ratio (4:5 or 1:1), name, price (with compare-at if discounted), optional rating, quick-add on hover/focus and always visible on touch. No layout shift on hover.
**PLP:** filter state in the URL (shareable, back-button safe), active-filter chips, result count, sort, "load more" or pagination (not infinite scroll without a footer escape), skeleton grid matching final columns.
**PDP:** gallery with keyboard/zoom, variant selectors (swatch for color, segmented for size, disabled + reason for out-of-stock), price near CTA, delivery/returns line, sticky add-to-cart on mobile, reviews summary + list, related items. Show stock honestly.
**Cart/checkout:** cart in `Sheet`, editable quantity, subtotal/shipping/tax clarity, guest checkout, address autocomplete, express pay slot, inline validation, trust cues (returns, secure payment) near the pay button, order summary always visible on desktop.
**Formatting:** `Intl.NumberFormat` for currency, tabular numbers, locale-aware dates.
**Motion:** add-to-cart confirmation (button state + cart count), drawer, image zoom. Nothing else.
**Performance:** first gallery image `priority`, responsive `srcset`, lazy below fold, optimistic cart, prefetch PDP on card hover/intent, JSON-LD `Product` + `Offer`, `BreadcrumbList`.
**shadcn install:** `button card badge sheet dialog drawer select radio-group checkbox slider accordion tabs carousel input form skeleton toggle-group pagination breadcrumb`.
**Avoid:** modal popups on load, infinite scroll without footer access, fake urgency timers, hidden costs until the last step, low-quality placeholder gray boxes.

### 5.4 `portfolio-blog-docs`
Three sub-modes; pick with `extra_notes: "mode=docs"` (default `blog`).
**Shared defaults:** `density: comfortable`, reading-first typography: body 17-18px, line-height 1.65, measure 62-70ch, headings 600, `motion: none|subtle`. Static generation, near-zero client JS.

**blog**
```
[ nav ] [ index: title · date · reading time · excerpt ]
Article: [ title · meta ][ prose column 720 ][ TOC (xl) ][ related · newsletter ]
```
Requires: readable prose styles (`@tailwindcss/typography` or custom), code blocks (Shiki, server-rendered), heading anchors, reading time, RSS, OG images, tags, dark mode.

**docs**
```
[ topbar: logo · search ⌘K · version · theme ]
[ left nav (tree) | content (prose 720) | right TOC ]
[ prev / next ][ edit on GitHub ]
```
Requires: MDX, `Command` search, callouts (note/tip/warning), tabs for multi-language snippets, copy-button code blocks with filename + line highlight, breadcrumb, sticky in-page TOC with scrollspy, versioning, mobile nav in `Sheet`.

**portfolio**
```
[ nav: name · work · about · contact ]
[ intro: who + what + 1 link ][ selected work: real projects ][ about ][ contact ]
Case study: context → role → problem → process → outcome (real visuals + real numbers)
```
Requires: project index with meaningful thumbnails, case-study template, downloadable CV, working contact method, personal typographic voice. Distinctive is the goal here: take one aesthetic risk, keep the rest quiet.

**Performance:** SSG/ISR, images optimized and dimensioned, no client JS for static prose, fonts ≤ 2, page weight < 200KB excluding images.
**shadcn install:** `button badge command tabs sheet separator scroll-area breadcrumb navigation-menu`.
**Avoid:** carousels of screenshots, "Hi, I'm ___ 👋" heroes, skill-percentage bars, infinite-scroll blog, walls of text without hierarchy, unlabelled icons.

---

## 6. Mounting architecture (modular)

```
design-system/
  SKILL.md                 # this file (config + rules)
  design.config.ts         # generated from CONFIG (or hand-edited)
  tokens.css               # sections 4.1-4.6
  registry.ts              # category → layout + defaults
  provider.tsx             # sets data-attrs + brand var
  layouts/
    saas-dashboard.tsx
    landing-marketing.tsx
    ecommerce.tsx
    portfolio-blog-docs.tsx
  components/               # shadcn + your wrappers only
```

**design.config.ts** (mirror of CONFIG; agent regenerates it whenever CONFIG changes)
```ts
export const config = {
  category: "landing-marketing",
  look: "minimal-clean",
  mode: "auto", primary: "auto", radius: "auto", density: "auto",
  border: "auto", shadow: "auto", motion: "auto",
  fontSans: "auto", fontDisplay: "auto", fontMono: "auto",
} as const;
```

**registry.ts**
```ts
import { lazy } from "react";

export const looks = {
  "minimal-clean": { mode: "system", primary: "#5B5BD6", radius: "rounded", border: "hairline", shadow: "subtle", motion: "subtle" },
  "dark-bold":     { mode: "dark",   primary: "#22D3EE", radius: "subtle",  border: "hairline", shadow: "none",   motion: "expressive" },
  "soft-glass":    { mode: "light",  primary: "#4F7DF3", radius: "soft",    border: "hairline", shadow: "layered", motion: "subtle" },
  "playful":       { mode: "light",  primary: "#E8447A", radius: "pill",    border: "strong",   shadow: "hard",   motion: "expressive" },
  "editorial":     { mode: "light",  primary: "#1F4FD8", radius: "sharp",   border: "hairline", shadow: "none",   motion: "subtle" },
  "brutalist":     { mode: "light",  primary: "#111111", radius: "sharp",   border: "strong",   shadow: "hard",   motion: "none" },
} as const;

export const categories = {
  "saas-dashboard":      { density: "compact",     motion: "subtle", Layout: lazy(() => import("./layouts/saas-dashboard")) },
  "landing-marketing":   { density: "spacious",    motion: "subtle", Layout: lazy(() => import("./layouts/landing-marketing")) },
  "ecommerce":           { density: "comfortable", motion: "subtle", Layout: lazy(() => import("./layouts/ecommerce")) },
  "portfolio-blog-docs": { density: "comfortable", motion: "none",   Layout: lazy(() => import("./layouts/portfolio-blog-docs")) },
} as const;
```

**provider.tsx**
```tsx
import { config } from "./design.config";
import { categories, looks } from "./registry";

const pick = <T,>(v: T | "auto", ...fallbacks: T[]) => (v !== "auto" ? v : fallbacks.find(Boolean)) as T;

export function resolve() {
  const cat = categories[config.category];
  const look = looks[config.look];
  return {
    "data-category": config.category,
    "data-radius":  pick(config.radius,  look.radius),
    "data-density": pick(config.density, cat.density),
    "data-border":  pick(config.border,  look.border),
    "data-shadow":  pick(config.shadow,  look.shadow),
    "data-motion":  pick(config.motion,  cat.motion, look.motion),
    style: { "--brand": pick(config.primary, look.primary) } as React.CSSProperties,
  };
}

// Next.js: <html lang="en" {...resolve()}>   |   Vite: apply in main.tsx
export function DesignSystem({ children }: { children: React.ReactNode }) {
  const { style, ...attrs } = resolve();
  Object.entries(attrs).forEach(([k, v]) => document.documentElement.setAttribute(k, String(v)));
  Object.entries(style).forEach(([k, v]) => document.documentElement.style.setProperty(k, String(v)));
  const { Layout } = categories[config.category];
  return <Layout>{children}</Layout>;
}
```
Switching category = change `config.category` (or the CONFIG line, then regenerate). Pages import content components; **layouts own structure**, so the same content re-flows into a different shell.

**Tailwind v4 mapping (`globals.css`)**
```css
@import "tailwindcss";
@import "./design-system/tokens.css";

@theme inline {
  --color-background: var(--background);  --color-foreground: var(--foreground);
  --color-card: var(--card);              --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);          --color-ring: var(--ring);
  --color-primary: var(--primary);        --color-primary-foreground: var(--primary-foreground);
  --color-accent: var(--accent);
  --radius-sm: max(0px, calc(var(--radius) - 4px));
  --radius-md: max(0px, calc(var(--radius) - 2px));
  --radius-lg: var(--radius);
  --radius-xl: var(--radius-surface);
  --font-sans: var(--font-sans-stack);
  --font-mono: var(--font-mono-stack);
}
```
Buttons/inputs use `rounded-[--radius-control]`; cards/dialogs use `rounded-xl`. Set `--font-sans-stack` from CONFIG (with system fallback stack).

**Setup commands**
```bash
npx shadcn@latest init
npx shadcn@latest add <components from the active category>
npm i lucide-react motion @tanstack/react-table recharts react-hook-form zod
npm i @fontsource-variable/geist @fontsource-variable/geist-mono   # default fonts (or next/font)
```

---

## 7. Component behavior baseline (all categories)

- Every interactive element has: default, hover, focus-visible, active, disabled, loading. Focus ring = `--ring`, 2px, offset 2px, never removed.
- Buttons: one primary per view, verb-first labels, height `--control-h`, radius `--radius-control`. Icon-only buttons have `aria-label` + tooltip.
- Inputs: visible label (not placeholder-only), helper/error text, `autocomplete`, correct `type`/`inputmode`.
- Overlays: focus trap, `Esc` closes, return focus, scroll lock, backdrop click closes non-destructive ones.
- Tables: real `<table>` semantics, sortable headers announced, sticky header.
- Toasts: for confirmation of completed actions only, ≤ 5s, with undo if reversible. Errors that block work go inline.
- Empty states: what this is + the single action to fill it. Error states: what happened + how to fix. Never blame the user, never apologize.
- Loading: skeleton matching final layout; progress bar for known duration.
- Icons: one library, one stroke width (1.5-2px), 16/20/24 sizes, no emoji as UI icons.
- Images: `alt` describing content (empty alt for decorative), explicit dimensions, aspect-ratio boxes.
- Dark mode: tested on every screen, no pure `#000` on `#FFF` extremes for large text blocks.

---

## 8. Suggestions (pick from these for CONFIG)

**UI libraries:** shadcn/ui *(default)*, Radix Themes, Base UI, Ark UI / Park UI, Mantine, HeroUI, Chakra UI, Headless UI, MUI, Ant Design, daisyUI. Accent/animated blocks (Magic UI, Aceternity) only for one hero moment. Dashboards: Tremor blocks. Component collections: Origin UI, Untitled UI (check license).
**Icons:** lucide-react *(default)*, Phosphor, Tabler, Radix Icons, Heroicons, Remix Icon, Iconoir.
**Fonts, sans:** Geist, Inter, Inter Tight, Manrope, DM Sans, Plus Jakarta Sans, Instrument Sans, Onest, Figtree, Public Sans. **Display:** Space Grotesk, Bricolage Grotesque, Sora, Syne, Unbounded. **Serif:** Newsreader, Fraunces, Source Serif 4, Literata, Instrument Serif. **Mono:** Geist Mono, JetBrains Mono, IBM Plex Mono, DM Mono, Fira Code.
**Animation:** motion (Framer Motion), CSS only, GSAP (timelines, scroll), auto-animate (list transitions), View Transitions API.
**Charts:** Recharts, Tremor, visx, Nivo, ECharts, uPlot (huge data), Chart.js.
**Tables:** TanStack Table, AG Grid (enterprise grids), react-virtual (virtualization).
**Forms:** react-hook-form + zod, TanStack Form, Conform (server actions).
**Data/state:** TanStack Query, SWR, Zustand, nuqs (URL state).
**Docs/content:** MDX, Contentlayer alternatives (Velite), Fumadocs, Nextra, Starlight (Astro), Shiki.
**Categories catalog (not yet built-in; add via section 11):** mobile-web app, admin/CRUD, AI chat / assistant, fintech / banking, social feed, marketplace, booking / travel, real estate, education / LMS, healthcare portal, media / streaming, community / forum, events / ticketing, restaurant / menu, nonprofit / donate, developer tools / API portal, changelog / status page, auth & onboarding flows, settings / account center, email templates, internal tool / Kanban, analytics / BI, CRM, help center / support.
**Common UX patterns to reach for:** command palette, optimistic UI, undo over confirm, progressive disclosure, inline editing, saved views, skeleton loading, empty-state CTAs, keyboard shortcuts, breadcrumbs, sticky action bars, URL-driven state, responsive tables → cards, stepper for true sequences.

---

## 9. Anti-slop contract (banned unless the brief explicitly asks)

Layout & structure
- Identical rounded cards with an icon in a tinted square, repeated 3× or 6× as "features".
- One radius/shadow applied to everything regardless of hierarchy; shadow + border + gradient stacked together.
- Centered-everything pages; long centered paragraphs.
- Numbered `01 / 02 / 03` markers on content that is not a sequence.
- Fade-and-slide-up on every section; hover-lift on every card; ambient floating/pulsing elements.
- Glassmorphism/blur everywhere (max 1-2 floating surfaces in `soft-glass`).

Color & type
- Purple→blue gradient hero, gradient text on headings, gradient washes or floating blurred orbs as decoration.
- Warm cream + serif + terracotta accent; near-black + single acid accent; broadsheet hairline-and-zero-radius columns, unless the look was chosen.
- Tinted near-black used as a stand-in for "black" without a reason; low-contrast gray body text.
- ALL-CAPS tracked eyebrow above every heading; one accented word/italic in a headline; `WORD — fragment` labels; middle-dot meta strings; `→` appended to every link/button; monospace for every small label.
- More than one accent color; more than two families.

Content
- Lorem ipsum, "Acme Inc", stock names, fake logos, invented stats ("10,000+ teams"), fake testimonials, AI-sounding filler (*elevate, seamless, unleash, supercharge, revolutionize, next-generation, all-in-one*).
- Emoji as icons or bullets; gray placeholder rectangles as images (use real, generated-to-fit, or clearly marked slots).

Craft
- Untouched shadcn defaults: always set tokens (color, radius, type, spacing) so the result is not recognizable as the stock kit.
- Spinners everywhere; toasts for errors that block work; disabled buttons with no reason.
- Dark mode as an afterthought; missing empty/error/loading states; no keyboard focus.

Spend boldness in **one** place per page (the hero visual, one type treatment, one interaction). Everything else stays quiet and disciplined. Before finishing, remove one accessory.

---

## 10. Build process (mandatory)

1. **Ground it.** State one concrete subject, audience and primary job. If unknown and not in CONFIG `extra_notes`, propose one and confirm.
2. **Plan (compact).**
   - Color: 4-6 named hex values (background, surface, text, muted, border, accent, + semantic).
   - Type: families, roles, scale used.
   - Layout: 1-sentence concept + ASCII wireframe for desktop and mobile; alignment decision.
   - Principles: what makes this page specific.
3. **Review against the brief and section 9.** If any part is what you'd produce for any similar page, revise it and say what changed and why.
4. **Build** with the registry/provider (section 6). Real content and real states. Mind CSS specificity (avoid `.section` vs element selectors cancelling padding/margin).
5. **Critique.** Screenshot at 390, 768, 1440 if possible. Run the checklist:

**Quality floor**
- [ ] Responsive 320 → 1920, no horizontal scroll
- [ ] Keyboard-only path works; focus always visible; logical tab order
- [ ] Contrast AA (4.5:1 text, 3:1 UI); not color-only meaning
- [ ] `prefers-reduced-motion` and `prefers-color-scheme` respected
- [ ] Semantic HTML, landmarks, one `h1`, labeled controls, alt text
- [ ] Empty, loading, error, offline (where relevant) states exist
- [ ] LCP < 2.5s, INP < 200ms, CLS < 0.1; initial JS < 170KB gz per route
- [ ] Fonts ≤ 2 files above fold; images sized + modern format + lazy below fold
- [ ] Only `transform`/`opacity` animated; ≤ 1 orchestrated intro
- [ ] Zero items from section 9
- [ ] Switching `category` in CONFIG re-flows the site without editing page content

---

## 11. Template: add a new category

```md
### X.Y `<category-id>`
**Purpose:** (one job, one user)
**Defaults:** density / base font / container / motion / border-vs-shadow
**Shell:** (ASCII wireframe, desktop + mobile behavior)
**Required parts:** (components, states, patterns)
**Type & color notes:** (scale changes, accent usage)
**Motion:** (only what answers an action; one orchestrated moment max)
**Performance:** (budgets, loading strategy, caching)
**Content rules:** (voice, real data, formatting)
**shadcn install:** `...`
**Avoid:** (category-specific slop)
```
Then: add `layouts/<category-id>.tsx`, add an entry to `categories` in `registry.ts`, set `category: custom:<category-id>` in CONFIG.

---

## 12. Optional: configure on download (terminal)

Run `node scripts/configure.mjs SKILL.md`. Press Enter to keep the shown default. It rewrites the CONFIG block and sets `status: configured`.


Agents without a terminal: use section 2 instead.

---

## 13. Changelog
- v1.0 initial: 4 categories, 6 looks, token system, registry/provider mounting, anti-slop contract, onboarding.
