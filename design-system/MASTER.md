# STREETCREED — Design System MASTER

> Single source of truth for the STREETCREED premium fashion e-commerce experience.
> Generated following the UI/UX Pro Max workflow: design system first, interface second.
> Every page spec in `design-system/pages/` inherits from this file. Do not invent new
> tokens per page — extend this file instead.

---

## 1. Brand

- **Name:** STREETCREED (placeholder — rename in `src/lib/seo.ts`, one place)
- **Personality:** Luxury · Modern · Editorial · Minimal · Confident · Cinematic
- **Voice:** Short, assured sentences. No exclamation marks in UI copy. Numbers and
  materials over adjectives ("Italian merino, 320gsm" beats "super soft").
- **Feel:** A high-end fashion editorial that happens to sell. Calm, expensive,
  intentional. Never bouncy, chaotic, or game-like.

## 2. Color Palette

Warm-neutral base with a single deep accent. No gradients in UI surfaces.

| Token | Hex | Usage |
|---|---|---|
| `--color-ink` | `#141310` | Primary text, headlines, footer bg |
| `--color-ink-soft` | `#3E3B35` | Secondary text |
| `--color-mist` | `#7A756B` | Muted text, captions, placeholders |
| `--color-paper` | `#FAF8F4` | Page background |
| `--color-bone` | `#F1ECE3` | Section alternation, cards on paper |
| `--color-linen` | `#E5DED1` | Borders on light surfaces, image placeholders |
| `--color-line` | `#DDD6C9` | Hairline dividers |
| `--color-accent` | `#6E4F2A` | Bronze — links hover, badges, small highlights only |
| `--color-accent-deep` | `#4A3419` | Accent pressed state |
| `--color-success` | `#2F5D3A` | In-stock, success |
| `--color-error` | `#9C2B2B` | Errors, sale price |
| `--color-white` | `#FFFFFF` | Cards, inputs |

Rules: accent is a spice, never a surface. Sale/error red is the only saturated color
besides product photography. Dark sections use `ink` bg with `paper` text.

## 3. Typography

| Role | Font | Notes |
|---|---|---|
| Display | "Cormorant Garamond", serif | Headlines, hero, editorial. Light/regular weight, tight leading (1.02–1.1), letter-spacing -0.01em |
| Sans (UI/body) | "Inter", system fallback | Body, UI, navigation. 400/500/600 |
| Eyebrow/label | Inter, 11px, uppercase, tracking 0.18em | Section eyebrows, badges, table headers |

Type scale (rem): display 4.5/3.5/2.75 · h1 3 · h2 2.25 · h3 1.5 · lead 1.125 ·
body 1 · small 0.875 · micro 0.75. Line-height: body 1.6, display 1.05.

Rules: headlines are sentence case, never ALL CAPS (eyebrows only). Prices use
tabular figures. Max body line length ~68ch.

## 4. Spacing & Layout

- Base unit 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Container: max 1440px, padding-inline 24px (mobile) / 48px (≥1024px).
- Section rhythm: 96px desktop / 64px mobile vertical padding.
- Editorial grid: 12 cols desktop, asymmetric splits (7/5, 8/4) preferred over 6/6.
- Product grid: 2 cols mobile, 3 cols ≥768px, 4 cols ≥1280px. Gap 24/32px.
- Border radius: 0 on editorial surfaces (sharp = premium). 2px max on inputs/buttons.
  Pills only for filter chips and badges.

## 5. Components

- **Buttons:** Primary = ink bg, paper text, uppercase 12px tracking 0.14em,
  padding 16×32, hover → accent-deep bg, 200ms. Secondary = 1px ink border,
  transparent bg, hover fills ink. Text link = underline offset 4px, hover accent.
  Min touch target 44px. Focus-visible: 2px accent outline, offset 2px.
- **Inputs:** bone bg, 1px line border, 12px padding, label above (micro caps),
  error = error border + message below. Never placeholder-only labels.
- **Product card:** image 3:4, bone placeholder, hover = second image crossfade +
  image scale 1.04 (600ms), quick-add bar slides up. Name (sans 500), category
  (micro caps mist), price row. Wishlist heart top-right, 40px target.
- **Badges:** micro caps, 1px border or bone bg — "New", "Bestseller", "Low stock".
- **Header:** announcement bar (ink, paper text, rotating messages) + sticky main
  bar, transparent over hero → paper bg + hairline after scroll. Nav: Women, Men,
  Collections, Journal, About. Icons: search, account, wishlist, bag w/ count.
- **Footer:** ink bg, 4 cols (Shop / Company / Support / Newsletter), legal row.
- **Drawer/Overlay:** cart drawer right, search overlay full-screen. Backdrop
  ink/40 + blur 2px. Slide 320ms cubic-bezier(0.32, 0.72, 0, 1). Esc closes,
  focus trapped, body scroll locked.
- **Toast:** bottom-left, ink bg, auto-dismiss 3.2s, role="status".

## 6. Motion Strategy

- Easing: `cubic-bezier(0.32, 0.72, 0, 1)` (ease-out-expo family) everywhere.
- Durations: micro 160ms · standard 240ms · drawer/overlay 320ms · image 600ms.
- Scroll reveal: IntersectionObserver, translateY(16px)+opacity → 0, 700ms,
  stagger 60ms within a group. Once only.
- Page transition: content fades/slides 8px on route change (template.tsx).
- Marquee: announcement/editorial marquee 30s linear, pause on hover.
- `prefers-reduced-motion`: disable reveals, marquee, and smooth scroll.
- Motion communicates hierarchy/state/continuity — never decoration for its own sake.

## 7. Imagery

- Product: 3:4, bone background or soft daylight, model + flat-lay pair per product.
- Editorial: 4:5 or 16:10, cinematic crop, warm grade matching palette.
- All images: descriptive alt text, `loading="lazy"` below fold, explicit
  width/height or aspect-ratio to prevent CLS. Next/Image with `sizes` set.

## 8. Accessibility (WCAG 2.2 AA)

- Contrast: ink on paper 14.2:1; mist only for ≥14px non-essential text.
- Every interactive element keyboard-reachable, visible focus ring.
- aria-labels on icon buttons; aria-expanded/controls on drawer & menus;
  role=dialog + aria-modal on overlays; skip-to-content link.
- Forms: labels, described-by errors, autocomplete attributes.
- Touch targets ≥44px. Color never the only signal (stock state has text).

## 9. Responsive Behavior

- Breakpoints: 640 / 768 / 1024 / 1280 / 1536.
- Mobile: bottom-safe padding, filters become full-screen sheet, product grid 2 col,
  header collapses to menu drawer, cart drawer full-width ≤480px.
- Type: display scales via clamp() — hero 2.75rem → 4.5rem.

## 10. States (every component, every page)

Loading (skeleton shimmer in bone/linen), empty (editorial message + CTA),
error (message + retry), success (toast + inline confirmation). No spinners
except button-inline submit states.

## 11. SEO

Unique title/description per route (template: `%s — STREETCREED`), OpenGraph +
Twitter cards, canonical URLs, Product/Offer JSON-LD on PDP, BreadcrumbList,
sitemap.xml + robots.txt generated from the catalog, semantic landmarks,
one h1 per page.
