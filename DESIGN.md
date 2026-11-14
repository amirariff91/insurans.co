---
name: Insurans.co (Edisi)
description: A calm page around one loud number and one knob. The price comes first, with the NCD control that reprices it, and the logo dot echoes the knob.
colors:
  magenta: "#D0106F"
  magenta-deep: "#A50C58"
  magenta-light: "#E0559B"
  pink: "#FBD3E4"
  pink-pale: "#FDEDF4"
  yellow: "#FFF3B0"
  sky: "#CFE8FA"
  red: "#B8291E"
  ink: "#000000"
  ink-2: "#4A4A4A"
  rule: "#767676"
  ghost: "#949494"
  placeholder: "#595959"
  paper: "#FFFFFF"
  tray: "#F3F3F3"
  chip: "#E9E9E9"
  hairline-grey: "#DADADA"
typography:
  price:
    fontFamily: "Gabarito, Gabarito Fallback, Gabarito Fallback Android, system-ui, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 900
    lineHeight: 0.8
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Gabarito, Gabarito Fallback, Gabarito Fallback Android, system-ui, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 750
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  headline-desktop:
    fontFamily: "Gabarito, Gabarito Fallback, Gabarito Fallback Android, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 750
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  section:
    fontFamily: "Gabarito, Gabarito Fallback, Gabarito Fallback Android, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 750
    lineHeight: 1.12
    letterSpacing: "-0.005em"
  title-bar:
    fontFamily: "Gabarito, Gabarito Fallback, Gabarito Fallback Android, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 800
    lineHeight: 1.2
  body:
    fontFamily: "Figtree, Figtree Fallback, Figtree Fallback Android, system-ui, -apple-system, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  body-ui:
    fontFamily: "Figtree, Figtree Fallback, Figtree Fallback Android, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  small:
    fontFamily: "Figtree, Figtree Fallback, Figtree Fallback Android, system-ui, -apple-system, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.45
  title-bar-tool:
    fontFamily: "Gabarito, Gabarito Fallback, Gabarito Fallback Android, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.2
  label:
    fontFamily: "Figtree, Figtree Fallback, Figtree Fallback Android, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  pill: "9999px"
spacing:
  gutter: "16px"
  module-pad: "14.4px"
  note-pad: "16px"
  note-pad-wide: "20px"
  stack: "40px"
  page-max: "1472px"
components:
  button-primary:
    backgroundColor: "{colors.magenta}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "10px 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.magenta-deep}"
    textColor: "{colors.paper}"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "10px 20px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  title-bar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.title-bar}"
    padding: "8.8px 14.4px"
    height: "48px"
  module:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.lg}"
  note-info:
    backgroundColor: "{colors.sky}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  note-price:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  note-term:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  note-warn:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  note-plain:
    backgroundColor: "{colors.tray}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  total-band:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "9.6px 12px"
---

# Design System: Insurans.co (Edisi)

This file describes the design that the code on branch `feat/edisi` actually ships (derived on 15 Nov 2026 from commit `76ea2aa`). Where the concept notes said something different, the code wins and the difference is listed in "Where the code differs from the concept" at the end. The machine-readable extras (colour ramps, shadows, motion, breakpoints, component snippets) are in `.impeccable/design.json`.

Sources of truth in the repo: `tailwind.config.mjs`, `src/styles/global.css`, `src/styles/edisi-answer.css`, `src/components/edisi-tools/edisi-tools.css`, `src/components/edisi/`, `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/components/CarPhoto.astro`, `src/components/Ikon.astro`, `src/components/Byline.astro`, `src/components/Hero.astro`, `src/components/CtaBand.astro`, `src/layouts/Base.astro`, `public/fonts/` and `public/ikon.svg`.

## Overview

**Creative North Star: "Edisi: the price with a knob"**

Edisi is the name of the redesign. The idea fits in one line: every page leads with the answer (on a car page, the yearly price), and the reader's no-claim discount (NCD, the discount a Malaysian driver earns for each claim-free year, from 0% up to 55%) is a knob that reprices it. The site's logo repeats the idea: the dot of the "i" in the wordmark is the knob, seated at NCD 55% and lifting one step for each lower NCD step the reader has chosen.

The page is calm: white paper, black ink, black title bars, and one strong colour, magenta, used sparingly. Three pastel tints each have one job: pink for prices, yellow for totals and policy terms, blue for the car itself, what is covered and explanations. Type is two faces with fixed jobs: Gabarito, heavy and friendly, for the price, headings and title bars; Figtree, at regular weight, for everything else. The site is light mode only.

The frame borrows from the mid-2000s web (three columns with working side rails, boxed modules whose solid title bars state a finding, breadcrumbs, a site-map footer), with modern behaviour: native controls that work without JavaScript, container queries, and motion that only uses transform and opacity.

**Key Characteristics:**
- Answer first: H1, answer box, byline, then intro, on every content template.
- One magenta voice: the main button, the chosen state and the logo knob, never as text on a tint.
- Colour by job: pink is price, yellow is total or term, blue is the car, coverage and explanation.
- Black title bars that state a finding in words already on the page.
- Works without JavaScript: the NCD control reprices through CSS `:has()`.
- Glass only on navigation, never behind reading text.

## Colors

A white-and-black page with one saturated accent and three pastel tints, each with a single job.

### Primary
- **Edisi Magenta** (`magenta`): the main button (`.btn-hijau`, `.ea-btn-p`, `.et-btn`), the border or fill that marks the chosen or focused state (the chosen NCD bar, a checked calculator option, a focused input), the logo knob and the NCD knob. Text on magenta is white only (5.3:1).
- **Deep Magenta** (`magenta-deep`): hover state of the main button.
- **Light Magenta** (`magenta-light`): exists only as the legacy shade `hijau-400`; new work should not use it.

### Secondary (the tints)
- **Price Pink** (`pink`, CSS `--tint-pink`): prices and price working. `.note-price`, `.mod[data-tint="pink"]`, calculator panels (`.et-panel[data-tint="pink"]`), the price highlight in an answer row (`.pa-r[data-role="price"]`).
- **Pale Pink** (`pink-pale`): the legacy shade `hijau-50`, a lighter pink used by older templates through `bg-hijau-50`.
- **Total Yellow** (`yellow`, CSS `--mark` and `--tint-yellow`): yearly totals, limits and policy terms. The yearly total band under the price (`.ea-sum`), `.note-term`, `.pa-r[data-role="term"]`, the highlighted row of the NCD ladder table, the current model in the rail, calculator results, text selection.
- **Explanation Blue** (`sky`, CSS `--tint-sky`): the car (the plate behind a car photo, the name card), what is covered, and explanations. `.note-info`, `.info-box`, `.mod[data-tint="sky"]`.

### Tertiary
- **Warning Red** (`red`): only the heading of a warning (`.note-warn > .note-t`), "not covered" marks (`.mark-no`) and the high flood-risk chip (`.risk-tinggi`). 6.2:1 on white.

### Neutral
- **Ink** (`ink`): all text, links (underlined), title bars, table header bars, focus rings.
- **Ink 2** (`ink-2`): secondary text such as captions and source lines (8.9:1 on white).
- **Rule** (`rule`): borders of modules, chips, inputs at rest, notes (4.5:1 on white, so every border passes the 3:1 UI threshold).
- **Ghost** (`ghost`): the paler track in the logo.
- **Placeholder** (`placeholder`): input placeholder text (7.0:1 on white, at least 5.18:1 on every tint).
- **Paper** (`paper`): the page and card background.
- **Tray** (`tray`): neutral asides (`.note-plain`), the footer, hover fill, rail group headers.
- **Chip** (`chip`): unchosen NCD bars, separators in the phone menu.
- **Hairline Grey** (`hairline-grey`): `stone-200` and `krim-300`, light dividers in older templates.

### Legacy token names (do not "fix" them)

The Tailwind palette keeps the old Kira Hijau names (`hijau`, `emas`, `krim`, `stone`, `verdict`) so the templates keep working. Their values now follow Edisi's roles. New work should use the `edisi.*` names (`bg-edisi-sky`, `text-edisi-ink`) or the CSS custom properties.

| Legacy name | Now means | Value |
|---|---|---|
| `hijau-50`, `hijau-100` | pale pink, pink (price tints) | `#FDEDF4`, `#FBD3E4` |
| `hijau-200`, `hijau-300` | rule grey | `#767676` |
| `hijau-400` | light magenta | `#E0559B` |
| `hijau-500` | magenta | `#D0106F` |
| `hijau-600` | ink 2 (text) | `#4A4A4A` |
| `hijau-700` to `hijau-950` | ink (text) | `#000000` |
| `emas-50`, `emas-100` | yellow tints | `#FFF3B0`, `#FFEB85` |
| `emas-200` to `emas-500` | darker yellows and ochre | `#FFE066`, `#F2CC3A`, `#C9A300`, `#8F7400` |
| `emas-600` to `emas-900` | ink 2 and ink (text) | `#4A4A4A`, `#000000` |
| `krim-50`, `krim-100`, `krim-200`, `krim-300` | paper, tray, chip, hairline grey | `#FFFFFF`, `#F3F3F3`, `#E9E9E9`, `#DADADA` |
| `stone-50` to `stone-950` | a neutral grey ramp; `stone-900` and `stone-950` are ink | `#F6F6F6` to `#000000` |
| `verdict.best/good/warn` | pink with magenta border, chip with rule border, yellow with ink border | see `tailwind.config.mjs` |
| `font-serif` | Gabarito (no serif is loaded) | |
| `.btn-hijau` | the magenta main button | |
| `.accent-hijau-700` | accent colour = magenta (`--sel`) | |
| `shadow-hard` | a soft lifted pane, no longer a hard offset block | |

### Named Rules

**The Three Magenta Things Rule.** In any first screen, magenta appears on at most three things: the logo knob, the NCD control (its knob and chosen bar count as one), and the one main button. A second action is an outline button (`.ea-btn-o`, `.btn-outline`). `bun run check:site` check 7 warns when a first screen has more than three magenta fills.

**The One Job Per Tint Rule.** Pink is price. Yellow is a total or a term. Blue is the car, what is covered, or an explanation. A warning is white with a 2px ink border and a red heading, never yellow.

**The Ink Links Rule.** Links are ink and underlined (1px, offset 0.18em). Magenta and mid-grey are never text on a tint or on a grey chip.

## Typography

**Display Font:** Gabarito (variable, weights 400 to 900; self-hosted `public/fonts/gabarito-var-latin.woff2`, OFL)
**Body Font:** Figtree (variable, weights 300 to 900; self-hosted `public/fonts/figtree-var-latin.woff2`, OFL)

**Character:** Gabarito is heavy and round, and carries the numbers and the headings; Figtree is a plain, open text face at regular weight. Strong text is weight 650.

**Fallbacks.** While the web fonts load (`font-display: swap`), text is drawn in a local font scaled to the same width, ascent and descent so the swap does not reflow lines: `Gabarito Fallback` and `Figtree Fallback` (Arial, Liberation Sans or Arimo) and `Gabarito Fallback Android` and `Figtree Fallback Android` (Roboto). The values are in the `@font-face` rules at the top of `src/styles/global.css`; the bold fallbacks are estimated, not measured.

### Hierarchy
- **Price** (Gabarito 900, fitted to its column, line-height 0.8, tabular figures): the big yearly price in the answer block (`.ea-price`). It is sized from the font's advance widths to fill 96% of its container (`--fit: 96cqi`), with a floor of 1.25rem and a cap of 4.5rem on phones and 6rem from 48rem.
- **Headline, the one H1 size** (Gabarito 750, 1.625rem on phones and 2rem from 48rem, line-height 1.08): every page H1 uses `.ea-h1`. Check 7 fails a page whose H1 differs from the homepage `.ea-h1`.
- **Section** (Gabarito 750, `text-headline-md` 1.75rem): H2 in running prose (`.prose-editorial h2`) when the article does not opt into title bars. H3 uses `text-headline-sm` (1.375rem).
- **Title bar** (Gabarito 800, 1.125rem, line-height 1.2; 1.25rem in calculators): `.mod-bar`, `.ix-bar`, `.h2-bar`, `.prose-bars h2`, `.et-bar-t`.
- **Body** (Figtree 400, 1.0625rem, line-height 1.6): article prose (`.prose-editorial`). UI text and module body text is 1rem.
- **Small** (Figtree 400, 0.9375rem): rail rows, tables, plan cards, footer small print, chips.
- **Label** (Figtree 600, 0.875rem): `.label`, source lines (`.ix-src`, `.et-src`), captions and the photo credit. Sentence case, no letter-spacing.

### Named Rules

**The 14px Floor Rule.** No visible text is under 14px. `text-xs` is remapped to 0.875rem in `tailwind.config.mjs`, footnote markers are 0.875rem, and check 6 fails any visible text under 14px at 320, 390 and 1280px.

**The One H1 Size Rule.** One H1 per page, always `.ea-h1`. No kicker above it.

## Layout

- **Page frame** (`.ep`, `src/styles/edisi-answer.css`): one column on phones in source order main, tools, models. From 48rem: main plus an 18rem tools rail. From 80rem: three columns, a 17rem model rail on the left (sticky), the main column, and a 20rem tools rail. Maximum width `--page-max` (92rem). Side gutter `--gutter`: at least 1rem, or the safe-area inset.
- **Other templates** use `.container-wide` (Tailwind `max-w-6xl`) and `.container-article` (72ch) with `px-5 sm:px-6`. The shared opening `Hero.astro` places H1, answer, byline and intro in one column; with content in its default slot it becomes a two-track grid from `lg`.
- **Page opening order**: breadcrumbs, H1 (`.ea-h1`), answer box, byline, intro. On model pages the breadcrumb comes first in the DOM but shows below the answer (`.ep-main > .ep-crumbs + .ea { order: -1; }`).
- **Rhythm**: modules stack with 2.5rem gaps in `.ep-main`; module bodies pad 0.9rem with 0.75rem gaps; notes pad 1rem (1.25rem from 640px).
- **Container queries** (`ea`, `eprail`, `mast`) let prices, rails and the masthead wrap when text is enlarged to 200%.
- **No horizontal page scroll** at 320px: tables scroll inside their own wrapper (`.overflow-x-auto:has(> table)`), long figures break (`overflow-wrap: anywhere` in `main`).

## Elevation & Depth

Flat by default. Depth comes from black title bars, 1px rule borders and tints, not shadows.

### Shadow Vocabulary
- **Lifted pane** (`box-shadow: 0 12px 28px -14px rgb(0 0 0 / 0.5), 0 0 0 1px rgb(0 0 0 / 0.16)`): Tailwind `shadow-hard`, used for the few lifted surfaces.
- **Glass capsule** (navigation only): the desktop section tabs (`.tabs ul` in `SiteHeader.astro`) are a pill of `--glass` white with an edge, rim and specular inset; from 70rem it becomes sticky and, where supported, `backdrop-filter: blur(16px) saturate(180%)` over `--glass-t` (0.8 white).
- **Menu drop** (`0 12px 24px -12px rgb(0 0 0 / 0.4)`): the no-JavaScript phone menu panel.
- **Total band inset** (`inset 0 0 0 1px rgb(0 0 0 / 0.35)`): the yellow total under the price.

### Named Rules

**The Glass Is Navigation Rule.** Blur is used only on the floating navigation capsule. Nothing with reading text sits on a blurred layer. Under `prefers-reduced-transparency: reduce` or `prefers-contrast: more` the capsule turns solid white with a 1.5px ink ring.

## Shapes

Gently rounded rectangles. Modules, notes, tables, cards and buttons use 8px (`--r-2`, `rounded-lg`); inputs, calculator buttons and NCD bars use 6px (`--r-1`); chips, pills, the menu button and the section tabs are full pills (`--r-pill`). Borders are 1px `rule` at rest and turn ink on hover; warnings, the photo plate and outline buttons use 1.5px to 2px ink. The only round forms are the knob (logo and NCD) and the full stop of ".co" in the wordmark.

## Components

### Buttons
- **Main button** (`.btn-hijau`, `.ea-btn.ea-btn-p`, `.et-btn` and calculator submit buttons): magenta fill, white text, 8px radius (6px in calculators), at least 48px tall. Hover turns deep magenta. One per screen.
- **Outline button** (`.btn-outline`, `.ea-btn.ea-btn-o`): white with an ink border (inset 2px on `.ea-btn-o`); hover fills ink with white text (`.btn-outline`) or tray (`.ea-btn-o`). Use for every second action.
- **Focus**: a 3px ink outline offset 2px on every control; a 2px white inner ring on buttons and inputs.
- Icons in buttons come from `Ikon` (for example `i-kanan`), never a text arrow.

### Chips and pills
- **Jump chips** (`.type-chips a`, from `TypeChips.astro`): white pill, 1px rule border, 44px tall, weight 600; hover gives an ink border on tray.
- **Plan chip** (`.plan-chip`): white pill on a black plan-card bar.
- **Flood-risk chips** (`.risk-tinggi`, `.risk-sederhana`, `.risk-rendah`): red text and border for high, yellow with ink border for medium, tray for low.
- **Verdict badges** (`.verdict-best`, `.verdict-good`, `.verdict-warn`).
- **Marker pill** (`.ea-mark`): the "Contoh" / "Pilihan anda" pill on the NCD control, ink inset ring.

### Modules and title bars
- **Module** (`.mod`, older name `.ix`): white box, 1px rule border, 8px radius, clipped; tint with `data-tint="pink|sky|yellow"`.
- **Title bar** (`.mod-bar`, `.ix-bar`): black bar, white Gabarito 800, at least 3rem tall, optional `Ikon` before the text. The bar states the module's finding as a sentence ("Harga ini lindung 4 perkara. Banjir tak termasuk."), using only words and figures already in the module. In articles, `.prose-bars` turns H2s into the same bar (`.h2-bar` for a single heading).
- **Answer box** (`PageAnswer.astro`, classes `.mod.pa`, `.pa-rows`, `.pa-r`, `.pa-note`): one per content template, directly under the H1. The bar (a `<p>`, so the outline keeps its own H2s) states the page's finding; two to four label/value rows hold the facts. `role: 'price'` highlights the value pink, `role: 'term'` yellow; a value over 40 characters drops the highlight and sits as plain text (`data-long`).
- **Calculator panel** (`.et .et-panel`, `.et-bar`, `.et-bar-t`, `.et-out`, `.et-wait`, `.et-msg`; `src/components/edisi-tools/edisi-tools.css`): the same black bar on a white or pink panel; inputs at least 44px with a 1.5px ink border; the result box is yellow with an ink border; space for the result is reserved so nothing moves when it appears. Every selector is scoped under `.et`.
- **CTA band** (`CtaBand.astro`): a `.mod` with a `.mod-bar` heading and one main button.

### The answer block and NCD control (home and model pages)
- `HomeAnswer.astro` and `ModelAnswer.astro` render `.ea`: the H1, the price (`.ea-price`), one support line (`.ea-sub`), the yellow yearly total (`.ea-sum`), the NCD control (`fieldset.ea-ncd`), the buttons (`.ea-cta`) and then the car photo (`.ea-photo`).
- **NCD control**: six native radios (`#ncd-0`, `#ncd-25`, `#ncd-30`, `#ncd-38`, `#ncd-45`, `#ncd-55`; 55% checked in the HTML) drawn as six bars (`.ea-bar`, `.ea-col`) whose heights are the share you pay, labelled in claim-free years (`.ea-y`) with the percentage below (`.ea-p`). A knob (`.ea-knob`) rides a track under the bars. The chosen bar fills magenta.
- **One value per price element**: every price is a `.px` element (`Px.astro`) whose text is the NCD 55% value; the other five steps are `data-p0` to `data-p45` attributes. With JavaScript, `src/scripts/edisi-ncd.ts` swaps the text. Without JavaScript, `html:has(#ncd-25:checked) .px[data-p25]` hides the text and shows the attribute through `content: attr()`, and the knob position, price fit and ladder-table highlight switch the same way.
- **Fallback**: all of that sits inside `@supports selector(:has(*))`. Where `:has()` is missing, the bars and marker stay hidden and a static list of all six steps (`.ea-static`) shows instead.
- **NCD calculator** (`/tools/ncd-calculator/`) reuses the control and opens at 55% with the "Contoh" marker.

### Logo
- The wordmark is an inline SVG in `SiteHeader.astro` (`.wm-svg`, `.ins-word`, `.ins-knob`), so its colours come from the page tokens. The knob rests seated at NCD 55%. For each lower step it rises 80 units (`translateY(calc(var(--ins-stop, 0) * -80px))`, stops 0 to 5 for 55%, 45%, 38.33%, 30%, 25% and 0%). The step is read from the `localStorage` key `edisi.ncd` before first paint and updated by `edisi-ncd.ts`. It is display only, not a control; a tap anywhere on the wordmark goes home.
- The masthead tag "Bukan ejen. Bukan broker." shows from 48rem on every page.

### Car photo and name card (`CarPhoto.astro`)
- A Wikimedia Commons cut-out of the Malaysian-market car (`.cp`, `.cp-img`) with its credit line (`.cp-credit`, 14px): "Foto: author, licence, diubah suai", the author linked to the source, the licence to its deed, "diubah suai" to `/kredit-foto/#slug`. An AI-retouched photo carries the manifest's wording instead. Data: `src/data/car-photos.json`.
- In the answer block the cut-out sits on a sky plate with a 2px ink border (`.ea-photo .cp-img`), capped at 9rem tall on phones and 12rem from 48rem, below the buttons.
- A model without a photo gets a name card (`.cp-card`) in the same slot: sky background, brand and model in Gabarito 800 fitted to the card, segment and engine size, and the `i-kereta` pictogram. No "photo missing" wording.

### Icons (`Ikon.astro`)
- One sprite, `public/ikon.svg`, with 47 symbols; the valid ids are in `src/data/ikon-names.json` and an unknown name fails the build. Names are Malay with an `i-` prefix: `i-kereta`, `i-banjir`, `i-lindung`, `i-kalkulator`, `i-roadtax`, `i-kanan`, `i-amaran` and so on.
- Without `label` the icon is decorative (`aria-hidden`); keep a visible word beside it. With `label` it gets `role="img"` and a title. Default size 20px.

### Notes
- `.note-warn`: white, 2px ink border, red heading (`.note-t`). Warnings and exclusions.
- `.note-term`: yellow, ink border. Totals, limits and policy terms only.
- `.note-info`: blue. Explanations, short answers, what is covered. `.info-box` is the older blue box.
- `.note-price`: pink. Price examples and working.
- `.note-plain`: tray. Neutral asides and disclaimers.

### Tables
- `.table-editorial` and prose tables: black header row with white Gabarito bold, 0.7rem by 0.85rem cells, 1px light row rules, tabular figures. A table sits in `.overflow-x-auto`, which gets a rule border and scrolls on its own.
- **Plan cards on phones** (`table.plan-table`, below 48rem): each body row becomes a card with a black title bar (first cell, plus `[data-sub]` provider and `[data-chip]` chip cells); every other cell shows its column name from `data-label` and sits in a two-up grid (`[data-wide]` spans both). Because changing `display` strips table semantics in some browsers, the markup carries explicit roles (`role="table"`, `rowgroup`, `row`, `columnheader`, `cell`).
- **NCD ladder** (`.work`): the same radio group as rows; the chosen row turns yellow.

### FAQ and disclosures
- `.faq-item` (and bare `<details>` in prose): hairline bottom rule, 48px summary row, a CSS chevron on the right that turns on open (150ms). Answers max 62ch.
- `.baca`: a "read more" disclosure inside modules, with an `Ikon` that turns 180 degrees.

### Navigation
- **Masthead** (`.mast`): logo left; on phones a pill "Menu" button with a `<details>` fallback without JavaScript (`.menu-nojs`); from 48rem section tabs (`.tabs`), the current tab filled ink.
- **Breadcrumbs** (`Breadcrumbs.astro`, `nav[aria-label="Jejak navigasi"]`): small text above the H1 (below the answer on model pages).
- **Rails** (`ModelRail.astro`, `ToolsRail.astro`): `.mod` boxes; the model list (`.mlist`) rows are 44px, the current model yellow.
- **Footer** (`SiteFooter.astro`, `.foot`): tray background, site map in columns, the "Tetapan privasi" button (`[data-privacy-settings]`).

### Byline (`Byline.astro`)
"Oleh Amir Ariff, Pengasas & Editor. Dikemaskini <date>", small ink-2 text, the name linked to `/penulis/amir-ariff/` with padding for a 44px target. It sits after the answer box.

### Print
`@media print` in `global.css` hides the masthead, menus, footer map, privacy button, ads, iframes, rails, breadcrumbs and the NCD control; drops the grids to one column; prints tinted panels and title bars black on white with a black rule; opens collapsed `<details>` where supported; prints the URL after external links; avoids breaks inside notes, cards, modules, figures and table rows.

## Motion

Transform and opacity only, ease-out `--ease-out` (`cubic-bezier(0.23, 1, 0.32, 1)`), all 260ms or less: price digits tick in (`.tick`, 260ms); the NCD knob slides between stops (180ms); bars change fill (150ms); the logo knob rises (220ms); chevrons turn (150ms); buttons and tabs change colour (150ms); a pressed NCD bar scales to 0.97. Under `prefers-reduced-motion: reduce` all transitions and animations drop to 0ms, except the price tick, which becomes a 120ms opacity fade.

## Accessibility

- **Contrast (AA; ratios computed by the concept's `warna.py` for these same token values):** ink on paper 21:1; ink-2 on paper 8.9:1; ink on pink 15.5:1, on yellow 18.7:1, on sky 16.6:1, on tray 18.9:1, on chip 17.3:1; white on magenta 5.3:1; red on paper 6.2:1, on pink 4.6:1; rule on paper 4.5:1 (UI); placeholder 7.0:1 on paper (from the comment in `global.css`).
- **Targets:** every control and standalone link is at least 44 by 44px (links inside running text excepted): `.tap-link`, rail rows, table header links, footnote markers.
- **Focus:** a visible 3px ink ring with 2px offset; on black bars it is white (`--focus-on-dark`).
- **No blur behind text;** glass falls back to solid (see Elevation).
- **200% text:** container queries and `overflow-wrap` keep prices, rails, the masthead and plan cards inside the screen when text is enlarged.
- **Without JavaScript:** the NCD control, the phone menu and the FAQ all work; calculators show a notice.

## Content rules that are part of the design

- A title bar or answer box adds no new fact: every word and figure in it must already be on the page.
- Every estimated price is labelled "Anggaran" with the date it was checked.
- Every car photo carries its credit line and appears on `/kredit-foto/`.
- No stories, no price feed, no "Terkini" strip and no dark mode on this branch (the concept had them; they are not built).
- Light mode only for now (`color-scheme: light`).

## Do's and Don'ts

### Do:
- **Do** open every content page with H1 (`.ea-h1`), the answer box, the byline, then the intro.
- **Do** keep magenta to three things in the first screen: logo knob, NCD control, one main button.
- **Do** give each tint its one job: pink price, yellow total or term, blue car, coverage or explanation.
- **Do** write title bars as a finding, using only words already in the module.
- **Do** keep one value per price element (`.px` with `data-p*`), so the HTML says one thing.
- **Do** keep the 14px floor and 44px targets.

### Don't:
- **Don't** put an all-caps kicker or a label above the H1 or above content.
- **Don't** build meta strings out of middle dots ("Sedan · 1.5L · 2024").
- **Don't** make every block an identical rounded card; use modules with title bars, rows and tables.
- **Don't** use text arrows ("→") as decoration on links; use `Ikon` (`i-kanan`) or nothing.
- **Don't** put magenta or grey text on a tint or a grey chip, or make a warning yellow.
- **Don't** blur anything behind reading text.
- **Don't** rename the legacy tokens (`hijau-*`, `emas-*`, `krim-*`, `stone-*`, `.btn-hijau`, `font-serif`) without changing every template that uses them.

## Where the code differs from the concept

The concept is `docs/eeat-revamp-2026-11/round4/concepts/edisi/system.md` and `round4/logo-slider/README.md` in the temporary `insurans.co-eeat` worktree. The code wins; these are the differences found on 15 Nov 2026.

1. **Logo knob.** Concept: the logo is a `role="slider"` control with keyboard and drag. Code: display only; it follows the reader's remembered NCD and a tap goes home.
2. **Colour worlds and dark mode.** Concept: eleven colour worlds and a dark variant. Code: magenta, light only.
3. **Price size.** Concept: capped at 72px on phones and 104px wide. Code: 4.5rem (72px) and 6rem (96px).
4. **Not built:** the glass price pane, the phone dock and pane switch, stories, "Kereta sekelas", "Selak harga", the "Terkini" strip (it is on branch `feat/terkini`), the utility row. There is no `EXTRAS` flag in the code on this branch: these features are simply absent.
5. **Photo plate.** Concept: a hard offset shadow. Code: a 2px ink border, no shadow.
6. **Byline.** Concept: "Disunting dan disemak oleh Amir Ariff" with the editor's photo and an AI-assistance line. Code: "Oleh Amir Ariff, Pengasas & Editor. Dikemaskini <date>", no photo.
7. **Name card.** Concept: hidden from assistive technology. Code: `role="img"` with the model's full name.
8. **Magenta roles.** The comment in `tailwind.config.mjs` lists four uses (main button, chosen or focused borders, logo knob, chosen bar); the first-screen limit of three is enforced only as a warning in check 7.
9. **Middle-dot meta strings remain** in `CarPhoto.astro` (name card), `ModelAnswer.astro`, `HomeAnswer.astro` and `ToolsRail.astro`, against the do-not list.
10. **A decorative text arrow remains** in `src/pages/motorcycle-insurance/index.astro` (the roadtax calculator link). Other arrows in prose mean "leads to" inside a sentence.
11. **Under the 14px floor:** the plan-card column labels (`table.plan-table > tbody > tr > td::before`) are 0.8125rem (13px). They are CSS generated content, which check 6 may not measure.
12. **Two pinks.** `hijau-50` (`#FDEDF4`) is lighter than the price pink (`#FBD3E4`); older templates use it.
