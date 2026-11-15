---
name: Insurans.co (Edisi)
description: A calm page around one loud number and one knob. The price comes first, with the NCD control that reprices it, and the logo dot echoes the knob.
colors:
  paper: "#FFFFFF"
  ink: "#000000"
  mute: "#595959"
  line: "#DADADA"
  magenta: "#D0106F"
typography:
  price:
    fontFamily: "Gabarito, Gabarito Fallback, Gabarito Fallback Android, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, calc(var(--fit) / var(--u)), var(--price-max))"
    fontWeight: 800
    lineHeight: 0.8
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Gabarito, Gabarito Fallback, Gabarito Fallback Android, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  headline-desktop:
    fontFamily: "Gabarito, Gabarito Fallback, Gabarito Fallback Android, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  section:
    fontFamily: "Gabarito, Gabarito Fallback, Gabarito Fallback Android, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 800
    lineHeight: 1.2
  title-bar:
    fontFamily: "Gabarito, Gabarito Fallback, Gabarito Fallback Android, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 800
    lineHeight: 1.2
  title-bar-tool:
    fontFamily: "Gabarito, Gabarito Fallback, Gabarito Fallback Android, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 800
    lineHeight: 1.2
  body:
    fontFamily: "Figtree, Figtree Fallback, Figtree Fallback Android, system-ui, -apple-system, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  body-ui:
    fontFamily: "Figtree, Figtree Fallback, Figtree Fallback Android, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  small:
    fontFamily: "Figtree, Figtree Fallback, Figtree Fallback Android, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.25rem
  label:
    fontFamily: "Figtree, Figtree Fallback, Figtree Fallback Android, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.25rem
rounded:
  sm: "4px"
  md: "8px"
  pill: "999px"
spacing:
  s2: "2px"
  s4: "4px"
  s8: "8px"
  s12: "12px"
  s16: "16px"
  s24: "24px"
  s32: "32px"
  s48: "48px"
  s64: "64px"
  s96: "96px"
components:
  button-primary:
    backgroundColor: "{colors.magenta}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "48px"
  button-outline-hover:
    backgroundColor: "{colors.line}"
    textColor: "{colors.ink}"
  title-bar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.title-bar}"
    padding: "8px 16px"
    height: "48px"
  section-heading:
    textColor: "{colors.ink}"
    typography: "{typography.section}"
    padding: "12px 0 0"
  module:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "16px"
  note:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px"
  total-band:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  chip-hover:
    backgroundColor: "{colors.line}"
    textColor: "{colors.ink}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "44px"
  ncd-bar:
    backgroundColor: "{colors.line}"
    rounded: "{rounded.md}"
  ncd-bar-chosen:
    backgroundColor: "{colors.magenta}"
  rail-row-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "4px 12px"
    height: "44px"
  nav-tab-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
---

# Design System: Insurans.co (Edisi)

This file describes what the code on branch `design/tokens-2026-11` ships, derived on 15 Nov 2026 from commit `380fd17` ("rebuild the styles on fixed tokens"). The code wins over any plan. The machine-readable extras (colour ramps, rings, motion, breakpoints, component snippets) are in `.impeccable/design.json`.

Sources of truth in the repo: `tailwind.config.mjs`, the `:root` block and the "Hierarchy on five colours" block at the end of `src/styles/global.css`, `src/styles/edisi-answer.css`, `src/components/edisi-tools/edisi-tools.css`, `src/components/edisi/`, `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/components/CarPhoto.astro`, `src/components/Ikon.astro`, `src/components/Byline.astro`, `src/components/Hero.astro`, `src/components/CtaBand.astro`, `src/layouts/Base.astro`, `public/fonts/`, `public/ikon.svg` and `scripts/design/snap-tokens.py`.

## Tokens

Everything a template can ask for resolves to one of these. Nothing else has a value of its own.

- **Colours, five only:** paper `#FFFFFF`, ink `#000000`, mute `#595959`, line `#DADADA`, magenta `#D0106F`. CSS custom properties `--paper`, `--ink`, `--mute`, `--line`, `--magenta` on `:root`; Tailwind `paper`, `ink`, `mute`, `line`, `magenta`.
- **Spacing scale (px):** 2, 4, 8, 12, 16, 24, 32, 48, 64, 96. Two is an optical nudge only. Tailwind keeps its step names (`p-4`, `gap-6`) but every step snaps to this scale, so `p-5` is 24px, not 20px.
- **Type scale (px):** 14, 16, 18, 22, 28, 36. Weights 400, 600 and 800 only.
- **Radii:** 4px, 8px and pill (999px).
- **Depth:** rings only (a `box-shadow` with no blur). No gradients, no blurred shadows, no backdrop blur (all three removed on 15 Nov 2026).
- **The check:** `python3 scripts/design/snap-tokens.py --check` exits non-zero when any stylesheet in `src/` or any `<style>` block in an `.astro` file has a spacing, font size, weight, radius, colour or shadow off these scales. Without `--check` it rewrites them onto the scale. It leaves values inside `calc()`, `clamp()`, `var()`, `min()`, `max()` and `env()` alone and lists them, and it lists gradients without failing on them.

## Overview

**Creative North Star: "Edisi: the price with a knob"**

Edisi is the name of the redesign. The idea fits in one line: every page leads with the answer (on a car page, the yearly price), and the reader's no-claim discount (NCD, the discount a Malaysian driver earns for each claim-free year, from 0% up to 55%) is a knob that reprices it. The site's logo repeats the idea: the dot of the "i" in the wordmark is the knob, seated at NCD 55% and lifting one step for each lower NCD step the reader has chosen.

The page is calm and nearly monochrome: white paper, black ink, one mid grey for secondary text and control edges, one light grey for hairlines, and one strong colour, magenta, for the one action and the chosen state. Hierarchy comes from weight, rules and a single inverted surface, not from tints. Type is two faces with fixed jobs: Gabarito, heavy and friendly, for the price, headings and title bars; Figtree, at regular weight, for everything else. The site is light mode only.

The frame borrows from the mid-2000s web (three columns with working side rails, boxed modules whose solid title bars state a finding, breadcrumbs, a site-map footer), with modern behaviour: native controls that work without JavaScript, container queries, and motion that only uses transform and opacity.

**Key Characteristics:**
- Answer first: H1, answer box, byline, then intro, on every content template.
- Five colours, two scales, one check that fails on drift.
- One magenta voice: the main button, the chosen state and the logo knob, never as text.
- Black title bars only where a module states a finding; prose sections are ruled headings.
- Works without JavaScript: the NCD control reprices through CSS `:has()`.
- Flat paper: rings and rules, no shadows that blur, no glass.

## Colors

A black-and-white page with one grey for quiet text, one grey for hairlines, and one saturated accent.

### Primary
- **Edisi Magenta** (`magenta`): the main button (`.btn-hijau`, `.ea-btn-p`, `.et-btn`, calculator submit buttons), the border or fill that marks the chosen or focused state (the chosen NCD bar, a checked calculator option, a focused calculator input, the hovered tool card), the logo knob and the NCD knob, radio accent and caret colour, and text selection. Text on magenta is paper only (5.3:1).

### Neutral
- **Ink** (`ink`): all body text and headings, links (underlined), title bars, the 2px rules that start a section, a table head and the yearly total, the current tab and the current model in the rail, focus rings, and the hover state of the main button.
- **Mute** (`mute`): secondary text (captions, source lines, the byline, breadcrumbs, the NCD percentage under each bar, placeholders) and the 1px edge of a control or a module (module border, chips at rest, the masthead and footer rules). 7.0:1 on paper, so it passes as text and as a UI edge.
- **Line** (`line`): 1px hairlines inside a module (rows, table rows, FAQ rows, tab separators), unchosen fills (the NCD bars at rest) and hover fills (rail rows, tabs, chips, the outline button in the answer block). 1.4:1 on paper: decoration only, never text and never the only edge of a control.
- **Paper** (`paper`): the page, every card, module, note, panel, the footer and the photo plate.

### Legacy token names (do not "fix" them)

The old names stay so the templates keep working, but each is only an alias of one of the five. Removed on 15 Nov 2026: the pink, yellow and blue tints, the grey tray and chip fills, warning red, deep magenta and light magenta. Their names now resolve as follows.

| Name | Resolves to |
|---|---|
| CSS `--card`, `--tray`, `--mark`, `--tint-pink`, `--tint-yellow`, `--tint-sky`, `--glass`, `--glass-t`, `--glass-rim`, `--glass-spec` | paper |
| CSS `--chip` | line |
| CSS `--glass-edge` (the edge of the tab capsule and the phone dock) | mute |
| CSS `--ink-2`, `--rule`, `--ghost` | mute |
| CSS `--rule-strong`, `--link`, `--red`, `--focus`, `--mark-ink` | ink |
| CSS `--kick`, `--sel`, `--knob` | magenta |
| Tailwind `edisi.paper/card/tray/pink/yellow/sky` | paper |
| Tailwind `edisi.chip` | line |
| Tailwind `edisi.ink-2`, `edisi.rule` | mute |
| Tailwind `edisi.magenta-deep`, `edisi.red` | ink |
| `hijau-50/100` paper; `hijau-200/300/600` mute; `hijau-400/500` magenta; `hijau-700` to `950` ink | |
| `emas-50/100` paper; `emas-200/300` line; `emas-400` to `600` mute; `emas-700` to `900` ink | |
| `krim-50/100` paper; `krim-200/300` line | |
| `stone-50` paper; `stone-100/200` line; `stone-300` to `600` mute; `stone-700` to `950` ink | |
| `red-50` paper; `red-200` line; `red-700` ink | |
| `verdict.best/good/warn` | paper with a magenta, mute or ink border |
| `font-serif` | Gabarito (no serif is loaded) |
| `shadow-hard` | a 1px mute ring; every other `shadow-*` is none |

Classes such as `.note-price`, `.mod[data-tint="pink"]` and `.et-panel[data-tint="sky"]` still exist in the markup; they now render as plain paper.

### Named Rules

**The Five Colours Rule.** A new colour is a design change, not a fix. If a template needs a value that is not paper, ink, mute, line or magenta, the snap script will turn it into one of them.

**The Three Magenta Things Rule.** In any first screen, magenta appears on at most three things: the logo knob, the NCD control (its knob and chosen bar count as one), and the one main button. A second action is an outline button (`.ea-btn-o`, `.btn-outline`). `bun run check:site` check 7 warns when a first screen has more than three magenta fills.

**The Line Is Not Ink Rule.** Line is for hairlines and fills only. Text, and the edge that tells a reader something is a control, use mute or ink.

**The Ink Links Rule.** Links are ink and underlined (1px, offset 0.18em). Magenta is never text.

## Typography

**Display Font:** Gabarito (variable; self-hosted `public/fonts/gabarito-var-latin.woff2`, OFL)
**Body Font:** Figtree (variable; self-hosted `public/fonts/figtree-var-latin.woff2`, OFL)

**Character:** Gabarito is heavy and round, and carries the numbers and the headings at 800; Figtree is a plain, open text face at 400. Strong text and labels are 600. Tailwind maps `font-medium`, `font-semibold` and `font-bold` to 600, and `font-extrabold` and `font-black` to 800.

**Fallbacks.** While the web fonts load (`font-display: swap`), text is drawn in a local font scaled to the same width, ascent and descent so the swap does not reflow lines: `Gabarito Fallback` and `Figtree Fallback` (Arial, Liberation Sans or Arimo) and `Gabarito Fallback Android` and `Figtree Fallback Android` (Roboto). The values are in the `@font-face` rules at the top of `src/styles/global.css`; the bold fallbacks are estimated, not measured.

### Hierarchy
- **Price** (Gabarito 800, fitted to its column, line-height 0.8, tabular figures): the big yearly price in the answer block (`.ea-price`). It is sized from the font's advance widths to fill 96% of its container (`--fit: 96cqi`), with a floor of 1.25rem and a cap of 4.5rem on phones and 6rem from 48rem. It is the one fluid size in the type system and the only one above 36px.
- **Headline, the one H1 size** (Gabarito 800, 28px on phones and 36px from 48rem, line-height 1.08): every page H1 uses `.ea-h1`. Check 7 fails a page whose H1 differs from the homepage `.ea-h1`.
- **Section** (Gabarito 800, 22px, line-height 1.2): every H2 in running prose (`.prose-editorial h2`, `.prose-bars h2`, `.h2-bar`, `h2.h2-quiet`) and H3 (`text-headline-sm`, also 22px). H2 and H3 differ by the rule above the H2, not by size.
- **Title bar** (Gabarito 800, 18px, line-height 1.2; 22px in calculators): `.mod-bar`, `.ix-bar`, `.et-bar-t`.
- **Body** (Figtree 400, 18px, line-height 1.6): article prose (`.prose-editorial`). UI and module body text is 16px.
- **Small** (Figtree 400, 14px): tables, the byline, breadcrumbs, the answer-box note, the NCD percentage. Tailwind `text-xs` and `text-sm` are both 14px.
- **Label** (Figtree 600, 14px): `.label`, source lines, captions and the photo credit. Sentence case, no letter-spacing.

### Named Rules

**The Six Sizes Rule.** Text is 14, 16, 18, 22, 28 or 36px. Tailwind's size names all resolve onto these (`text-lg` 18, `text-xl` and `text-2xl` 22, `text-3xl` 28, `text-4xl` and up 36), and the snap script moves any stylesheet size to the nearest step.

**The 14px Floor Rule.** No visible text is under 14px. Check 6 fails any visible text under 14px at 320, 390 and 1280px.

**The One H1 Size Rule.** One H1 per page, always `.ea-h1`. No kicker above it.

## Layout

- **Page frame** (`.ep`, `src/styles/edisi-answer.css`): one column on phones in source order main, tools, models. From 48rem: main plus an 18rem tools rail. From 80rem: three columns, a 17rem model rail on the left (sticky), the main column, and a 20rem tools rail. Maximum width `--page-max` (92rem). Side gutter `--gutter`: at least 16px, or the safe-area inset.
- **One frame for other templates:** `.container-article` now shares `.container-wide`'s box (Tailwind `max-w-6xl`, 24px side padding), so an article starts on the same left edge as the page opening. Its children are capped at 72ch, and prose (`.prose-editorial` paragraphs, lists, H3, H4, quotes) never runs wider than 72ch in any container. The shared opening `Hero.astro` places H1, answer, byline and intro in one column; with content in its default slot it becomes a two-track grid from `lg`.
- **Page opening order**: breadcrumbs, H1 (`.ea-h1`), answer box, byline, intro. On model pages the breadcrumb comes first in the DOM but shows below the answer (`.ep-main > .ep-crumbs + .ea { order: -1; }`). The first section heading sits right under the opening with no top margin: the container's padding is the gap.
- **Rhythm** (all on the spacing scale): modules stack 48px apart in `.ep-main`, rails sit 32px from the main column; module bodies pad 16px with 12px gaps; notes pad 16px (24px from 640px); a prose section heading has 48px above it and a 12px pad under its rule.
- **Container queries** (`ea`, `eprail`, `mast`) let prices, rails and the masthead wrap when text is enlarged to 200%.
- **No horizontal page scroll** at 320px: tables scroll inside their own wrapper (`.overflow-x-auto:has(> table)`), long figures break (`overflow-wrap: anywhere` in `main`).

## Elevation & Depth

Flat paper. Depth and grouping come from four devices, in this order of weight:

- **Ink fill:** a module's finding (`.mod-bar`) and the reader's current choice (the current tab, the current model in the rail, an open menu button).
- **2px ink rule:** the start of a prose section, a table head, the yearly total (`.ea-sum`, `.kb-tot`).
- **1px mute edge:** the edge of a control or a module.
- **1px line hairline:** dividers inside a module.

### Shadow Vocabulary

Every `box-shadow` is a ring: zero offset or an inset, zero blur.

- **Edge ring** (`box-shadow: 0 0 0 1px var(--mute)`): Tailwind `shadow-hard`.
- **Control ring** (`box-shadow: inset 0 0 0 1.5px var(--ink)` or `2px` on `.ea-btn-o`): outline buttons, the marker pill, home tiles, the hovered unchosen NCD bar.
- **Capsule edge** (`box-shadow: 0 0 0 1px var(--line)`): the section tabs and the phone dock, on solid paper.
- **Knob ring** (`box-shadow: 0 0 0 2.5px var(--paper), 0 0 0 4px var(--ink)`): the NCD knob.
- **Focus inner ring** (`box-shadow: 0 0 0 2px var(--paper)`): under the focus outline on buttons and inputs.

### Named Rules

**The Rings Only Rule.** No blurred or offset shadow, no gradient, no backdrop blur. The snap script strips any blurred shadow layer and sets `backdrop-filter` to none. Navigation used to be glass; since 15 Nov 2026 the capsule is solid paper with a line edge, and the old `@supports (backdrop-filter)` blocks in `SiteHeader.astro` and `Dock.astro` now set it to none.

**The One Inverted Surface Rule.** The ink bar is for a module that states a finding. Prose sections are ruled headings, and side rails (`.ep-tools`, `.ep-models`, `aside`) do not invert: their module bars render as an ink heading over a line hairline.

## Shapes

Gently rounded rectangles. Modules, notes, tables, cards, buttons, inputs, NCD bars and the photo plate use 8px (`--r-1` and `--r-2` are both 8px; Tailwind `rounded` through `rounded-3xl` are all 8px). 4px is the small step (Tailwind `rounded-sm`, the bars in the calculator charts). Chips, the marker pill, the menu button, the section tabs and the phone dock are full pills (`--r-pill`, 999px). Prose section headings and the yearly total row are square. Borders are 1px mute at rest and turn ink on hover; outline buttons, calculator inputs, warnings and the photo plate use 1.5px to 2px ink. The only round forms are the knob (logo and NCD) and the full stop of ".co" in the wordmark.

## Components

### Buttons
- **Main button** (`.btn-hijau`, `.ea-btn.ea-btn-p`, `.et-btn` and calculator submit buttons): magenta fill, paper text, 8px radius, at least 48px tall. Hover turns it ink. One per screen.
- **Outline button** (`.btn-outline`, `.ea-btn.ea-btn-o`): paper with an ink edge (inset 2px ring on `.ea-btn-o`, 1.5px border on `.btn-outline`); hover fills ink with paper text (`.btn-outline`) or line (`.ea-btn-o`). Use for every second action.
- **Focus**: a 3px ink outline offset 2px on every control; a 2px paper inner ring on buttons and inputs.
- Icons in buttons come from `Ikon` (for example `i-kanan`), never a text arrow.

### Chips and pills
- **Jump chips** (`.type-chips a`, from `TypeChips.astro`; also the hub jump links): paper pill, 1px mute border, 44px tall, 16px weight 600; hover gives an ink border on a line fill.
- **Plan chip** (`.plan-chip`): paper pill on a black plan-card bar.
- **Flood-risk chips** (`.risk-tinggi`, `.risk-sederhana`, `.risk-rendah`): all paper; high has ink text and an ink border, medium an ink border, low a mute border. The word carries the level.
- **Verdict badges** (`.verdict-best`, `.verdict-good`, `.verdict-warn`): paper with a magenta, mute or ink border.
- **Marker pill** (`.ea-mark`): the "Contoh" / "Pilihan anda" pill on the NCD control, 1.5px ink ring.

### Modules and title bars
- **Module** (`.mod`, older name `.ix`): paper box, 1px mute border, 8px radius, clipped. `data-tint` is still accepted and renders paper.
- **Title bar** (`.mod-bar`, `.ix-bar`): black bar, paper Gabarito 800 at 18px, at least 48px tall, text only (no icon before the text). The bar states the module's finding as a sentence ("Harga ini lindung 4 perkara. Banjir tak termasuk."), using only words and figures already in the module. In the side rails the same bar renders as an ink heading over a line hairline.
- **Section heading** (`.prose-editorial h2`, `.prose-bars h2`, `.h2-bar`, `h2.h2-quiet`): 22px Gabarito 800 with a 2px ink rule above it and 12px between rule and text. `.prose-bars` and `.h2-bar` no longer make an inverted bar; the class names are kept and render the same ruled heading.
- **Answer box** (`PageAnswer.astro`, classes `.mod.pa`, `.pa-rows`, `.pa-r`, `.pa-note`): one per content template, directly under the H1. The bar (a `<p>`, so the outline keeps its own H2s) states the page's finding. Under it, each optional: a `lead` (one decisive number already on the page, as a large Gabarito numeral with its label, `.pa-lead`), a `sentence` (`.pa-sent`), and label/value rows (`.pa-rows`) split by line hairlines. A value with `role: 'price'` or `role: 'term'` is set at weight 600 with no fill; a value over 40 characters drops under its label (`data-long`).
- **Calculator panel** (`.et .et-panel`, `.et-bar`, `.et-bar-t`, `.et-out`, `.et-wait`, `.et-msg`; `src/components/edisi-tools/edisi-tools.css`): the same black bar on a paper panel; inputs at least 44px with a 1.5px ink border that turns magenta on focus; a checked option gets a magenta border; the result box is paper with a 1.5px ink border; space for the result is reserved so nothing moves when it appears. Every selector is scoped under `.et`.
- **CTA band** (`CtaBand.astro`): a `.mod` with a `.mod-bar` heading and one main button.

### The answer block and NCD control (home and model pages)
- `HomeAnswer.astro` and `ModelAnswer.astro` render `.ea`: the H1, the price (`.ea-price`), one support line (`.ea-sub`), the yearly total (`.ea-sum`), the NCD control (`fieldset.ea-ncd`), the buttons (`.ea-cta`) and then the car photo (`.ea-photo`).
- **Yearly total** (`.ea-sum`): paper band with a 2px ink border, the total in Gabarito 800 at 22px.
- **NCD control**: six native radios (`#ncd-0`, `#ncd-25`, `#ncd-30`, `#ncd-38`, `#ncd-45`, `#ncd-55`; 55% checked in the HTML) drawn as six bars (`.ea-bar`, `.ea-col`) whose heights are the share you pay, labelled in claim-free years (`.ea-y`, 18px) with the percentage below (`.ea-p`, 14px mute). Unchosen bars are line with a 1.5px mute ring; a hovered one gets an ink ring; the chosen bar fills magenta. A knob (`.ea-knob`) rides a track under the bars.
- **One value per price element**: every price is a `.px` element (`Px.astro`) whose text is the NCD 55% value; the other five steps are `data-p0` to `data-p45` attributes. Price switching is CSS-driven, with or without JavaScript: `html:has(#ncd-25:checked) .px[data-p25]` hides the text and shows the attribute through `content: attr()`, and the knob position, price fit and ladder-table highlight switch the same way. `src/scripts/edisi-ncd.ts` is a small enhancement on top: it remembers the step (`localStorage` `edisi.ncd`), plays a short tick on the changed figures, keeps the calculator links on the same step, announces the new price and seats the logo. It never writes a price.
- **Fallback**: all of that sits inside `@supports selector(:has(*))`. Where `:has()` is missing, the bars and marker stay hidden and a static list of all six steps (`.ea-static`) shows instead.
- **NCD calculator** (`/tools/ncd-calculator/`) reuses the control and opens at 55% with the "Contoh" marker. Its bars always show (the calculator needs them); their selected and focus states use the radio's siblings (`input:checked ~ .ea-col`, `:focus-within`), so they work without `:has()`, where the knob is hidden.
- **Phone dock** (`Dock.astro`, below 48rem; home, model pages, car hub, NCD calculator): once the answer block has scrolled away, a solid paper pill with a line edge at the bottom repeats the context on two lines ("Anggaran <car>" truncating, with "NCD x%" never cut; then "RMa–b/tahun", or the calculator's own result) and one "Tukar" button (44px) that returns to the NCD control. With `prefers-reduced-transparency` or `prefers-contrast: more` its edge becomes a 1.5px ink ring. It reads what the page shows (the `data-p*` values or `#result-premium`'s text) and never computes. Rendered `hidden`: without JavaScript it never shows. It steps aside while a native `<dialog>` is open or a consent message is actually visible.

### Logo
- The wordmark is an inline SVG in `SiteHeader.astro` (`.wm-svg`, `.ins-word`, `.ins-knob`), so its colours come from the page tokens. The knob rests seated at NCD 55%. For each lower step it rises 80 units (`translateY(calc(var(--ins-stop, 0) * -80px))`, stops 0 to 5 for 55%, 45%, 38.33%, 30%, 25% and 0%). Under the knob a paler slider track (`.ins-ghost`, `--ghost`, now mute) rides up with it, so at every step the knob sits on a track; at 55% the true logo shows. Once a step has been chosen, an "NCD x%" label (`.wm-ncd`, with a screen-reader text) sits over the logo. The step is read from the `localStorage` key `edisi.ncd` before first paint (inline script in `SiteHeader.astro`) and then updated through one shared function, `seatLogo()` in `src/scripts/edisi-logo.ts`, used by the home/model NCD control and the NCD calculator. It is display only, not a control; a tap anywhere on the wordmark goes home.
- The masthead tag "Bukan ejen. Bukan broker." shows from 48rem on every page.

### Car photo and name card (`CarPhoto.astro`)
- A Wikimedia Commons cut-out of the Malaysian-market car (`.cp`, `.cp-img`) with its credit line (`.cp-credit`, 14px): "Foto: author, licence, diubah suai", the author linked to the source, the licence to its deed, "diubah suai" to `/kredit-foto/#slug`. An AI-retouched photo carries the manifest's wording instead. Data: `src/data/car-photos.json`.
- In the answer block the cut-out sits on a paper plate with a 2px ink border (`.ea-photo .cp-img`), capped at 9rem tall on phones and 12rem from 48rem, below the buttons.
- A model without a photo gets a name card (`.cp-card`) in the same slot: paper with a 2px ink border, brand and model in Gabarito 800 fitted to the card, segment and engine size, and no pictogram. No "photo missing" wording.
- Guide illustrations (`/images/guides/`) render in greyscale, so they read as ink like the car photos.

### Icons (`Ikon.astro`)
- An icon must do a job. Keep: the arrow or chevron that marks a link row or an expandable `<summary>` (open/closed); `i-luar` on links that leave the site; `i-amaran` on a genuine warning note; one icon inside a primary calculator button; the header menu/close and the phone dock control; the homepage type tiles (they tell the types apart); the car glyph standing in for a missing car photo.
- Never decorate: no icon before a title bar (`.mod-bar`, `.mod-lab`, `.ix-bar`, `.et-bar`), an h2/h3, a step heading, a fact or row in an answer box, a table cell, a byline or date, a footer or rail link, or a row that already has a car thumbnail, brand or insurer logo. Removing one leaves no gap: the text sits where the icon was.
- The set is Phosphor Icons, Bold weight (MIT; licence in `public/ikon-LICENSE.txt`, credited on `/kredit-foto/`). Paths are copied unchanged from the official repository, never redrawn by hand. Single colour: every icon is `currentColor` and takes its text colour (paper on a black bar), with no magenta dot or second colour.
- One sprite, `public/ikon.svg`, with 18 symbols (256 viewBox, each notes its Phosphor name); the valid ids are in `src/data/ikon-names.json` and an unknown name fails the build. Remove a symbol from both when nothing uses it. Without `label` the icon is decorative (`aria-hidden`); keep a visible word beside it. Default size 20px; type tiles 22px, chevrons in link rows 16 to 18px.

### Notes
All notes are paper, 8px radius, ink text; the edge says what kind they are.
- `.note-warn`: 2px ink border, ink heading (`.note-t`, 600). Warnings and exclusions.
- `.note-term`: 1px ink border. Totals, limits and policy terms.
- `.note-info`, `.note-price`, `.note-plain`, `.info-box`: 1px mute border. Explanations, price working, neutral asides.

### Tables
- `.table-editorial` and prose tables: a paper head with ink Gabarito bold text and a 2px ink rule under it, 12px cells, 1px line row rules, tabular figures. A table sits in `.overflow-x-auto`, which gets a mute border and scrolls on its own.
- **Plan cards on phones** (`table.plan-table`, below 48rem): each body row becomes a card with a black title bar (first cell, plus `[data-sub]` provider and `[data-chip]` chip cells); every other cell shows its column name from `data-label` and sits in a two-up grid (`[data-wide]` spans both). Because changing `display` strips table semantics in some browsers, the markup carries explicit roles (`role="table"`, `rowgroup`, `row`, `columnheader`, `cell`).
- **NCD ladder** (`.work`): the same radio group as rows. The chosen row still takes `--mark`, which is now paper, so it is not visibly marked (see the last section).
- **Yearly total row** (`.kb-r.kb-tot`): square, a 2px ink rule above, weight 600.

### FAQ and disclosures
- `.faq-item` (and bare `<details>` in prose): line bottom rule, 48px summary row, a CSS chevron on the right that turns on open (150ms). Answers max 62ch.
- `.baca`: a "read more" disclosure inside modules, with an `Ikon` that turns 180 degrees.

### Navigation
- **Masthead** (`.mast`): paper with a 1px mute rule under it; logo left; on phones a pill "Menu" button (ink when open) with a `<details>` fallback without JavaScript (`.menu-nojs`); from 48rem section tabs (`.tabs`).
- **Section tabs**: a pill capsule of solid paper with a 1px line edge, line separators between tabs, 44px tabs at 16px weight 600. The current tab is an ink pill; hover is a line fill. From 70rem the capsule is sticky 8px from the top.
- **Breadcrumbs** (`Breadcrumbs.astro`, `nav[aria-label="Jejak navigasi"]`): 14px mute text above the H1 (below the answer on model pages).
- **Rails** (`ModelRail.astro`, `ToolsRail.astro`): `.mod` boxes that do not invert. The model list (`.mlist`) rows are 44px with a line rule between them; hover is a line fill; the current model is an ink row with paper text.
- **Footer** (`SiteFooter.astro`, `.foot`): paper with a 1px mute rule above, site map in columns, the "Tetapan privasi" button (`[data-privacy-settings]`).

### Byline (`Byline.astro`)
"Oleh Amir Ariff, Pengasas & Editor. Dikemas kini <date>", 14px mute text, the name linked to `/penulis/amir-ariff/` in ink with padding for a 44px target. It sits after the answer box.

### Print
`@media print` in `global.css` hides the masthead, menus, footer map, privacy button, ads, iframes, rails, breadcrumbs and the NCD control; drops the grids to one column; prints title bars ink on paper with a 2px ink rule; opens collapsed `<details>` where supported; prints the URL after external links; avoids breaks inside notes, cards, modules, figures and table rows.

## Motion

Transform and opacity only, ease-out `--ease-out` (`cubic-bezier(0.23, 1, 0.32, 1)`), all 260ms or less: price digits tick in (`.tick`, 260ms); the NCD knob slides between stops (180ms); bars change fill (150ms); the logo knob rises (220ms); the phone dock slides up (200ms); chevrons turn (150ms); buttons, chips and tabs change colour (150ms); a pressed NCD bar scales to 0.97. Under `prefers-reduced-motion: reduce` all transitions and animations drop to 0ms, except the price tick, which becomes a 120ms opacity fade.

## Accessibility

- **Contrast (AA):** ink on paper 21:1; mute on paper 7.0:1; ink on line 15.0:1; mute on line 5.0:1; paper on magenta 5.3:1. Line on paper is 1.4:1, which is why it is never text or the only edge of a control.
- **Targets:** every control and standalone link is at least 44 by 44px (links inside running text excepted): `.tap-link`, rail rows, table header links, footnote markers.
- **Focus:** a visible 3px ink ring with 2px offset; on black bars it is paper (`--focus-on-dark`); on the current (ink) tab it is magenta.
- **No blur anywhere;** with `prefers-reduced-transparency` or `prefers-contrast: more` the tab capsule and the dock take a 1.5px ink ring.
- **200% text:** container queries and `overflow-wrap` keep prices, rails, the masthead and plan cards inside the screen when text is enlarged.
- **Without JavaScript:** the NCD control, the phone menu and the FAQ all work; calculators show a notice.

## Content rules that are part of the design

- A title bar or answer box adds no new fact: every word and figure in it must already be on the page.
- Every estimated price is labelled "Anggaran" with the date it was checked.
- Every car photo carries its credit line and appears on `/kredit-foto/`.
- No stories, no price feed and no dark mode (the concept had them; they are not built). "Terkini" is built as a small update stream: `/terkini/`, one page per item, an RSS feed, and a quiet rail (`TerkiniRail`, `.mod-lab` style) low on the homepage and model pages.
- Light mode only for now (`color-scheme: light`).

## Do's and Don'ts

### Do:
- **Do** open every content page with H1 (`.ea-h1`), the answer box, the byline, then the intro.
- **Do** use only paper, ink, mute, line and magenta, and only the spacing (2 to 96px) and type (14 to 36px) scales; run `python3 scripts/design/snap-tokens.py --check` before committing a style change.
- **Do** keep magenta to three things in the first screen: logo knob, NCD control, one main button.
- **Do** show hierarchy with weight and rules: a 2px ink rule for a section, a table head or the yearly total; an ink bar only for a module's finding.
- **Do** write title bars as a finding, using only words already in the module.
- **Do** use a line fill or an ink inversion for hover.
- **Do** keep one value per price element (`.px` with `data-p*`), so the HTML says one thing.
- **Do** keep the 14px floor, 44px targets and the 72ch prose measure.

### Don't:
- **Don't** bring back a tint to mark a kind of content (price, total, explanation); the old pink, yellow and blue tints were removed on 15 Nov 2026.
- **Don't** use a gradient, a blurred or offset shadow, or a backdrop blur (removed on 15 Nov 2026); depth is rings only.
- **Don't** invert a side rail or a prose section heading.
- **Don't** set text, or the only edge of a control, in line grey.
- **Don't** put an all-caps kicker or a label above the H1 or above content.
- **Don't** build meta strings out of middle dots ("Sedan · 1.5L · 2024").
- **Don't** make every block an identical rounded card; use modules with title bars, rows and tables.
- **Don't** use text arrows ("→") as decoration on links; use `Ikon` (`i-kanan`) or nothing.
- **Don't** rename the legacy tokens (`hijau-*`, `emas-*`, `krim-*`, `stone-*`, `.btn-hijau`, `font-serif`) without changing every template that uses them.

## Where the code differs from the concept and the brief

The Edisi concept is `docs/eeat-revamp-2026-11/round4/concepts/edisi/system.md` and `round4/logo-slider/README.md` in the temporary `insurans.co-eeat` worktree. The code wins; these are the differences found on 15 Nov 2026.

1. **Logo knob.** Concept: the logo is a `role="slider"` control with keyboard and drag. Code: display only; it follows the reader's remembered NCD and a tap goes home.
2. **Colour worlds and dark mode.** Concept: eleven colour worlds and a dark variant. Code: five colours, light only.
3. **Price size.** Concept: capped at 72px on phones and 104px wide. Code: 4.5rem (72px) and 6rem (96px), weight 800.
4. **Not built:** the glass price pane, the pane switch, stories, "Kereta sekelas", "Selak harga", the utility row. "Terkini" is built as a quiet rail and its own pages. The phone dock is built, in a simpler form than the concept (a two-line context pill with one action).
5. **Photo plate.** Concept: a hard offset shadow. Code: a 2px ink border, no shadow.
6. **Byline.** Concept: "Disunting dan disemak oleh Amir Ariff" with the editor's photo and an AI-assistance line. Code: "Oleh Amir Ariff, Pengasas & Editor. Dikemas kini <date>", no photo.
7. **Name card.** Concept: hidden from assistive technology. Code: `role="img"` with the model's full name.
8. **A second fluid size.** The token rebuild says the fitted price is the only fluid size. The car name card (`.cp-card-name`) is also fitted: `clamp(1.5rem, calc(110cqi / var(--fit)), 2.75rem)`, up to 44px, off the type scale. The snap script lists it and does not fail on it.
9. **What the check covers.** The snap script checks stylesheets and `<style>` blocks only. Tailwind classes in templates are held to the scales by `tailwind.config.mjs`, not by the script, and values inside `calc()`, `clamp()` and `var()` are reported, not failed.
10. **Middle-dot meta strings remain** in `CarPhoto.astro` (name card), `ModelAnswer.astro`, `HomeAnswer.astro` and `ToolsRail.astro`, against the do-not list.
11. **A decorative text arrow remains** in `src/pages/motorcycle-insurance/index.astro` (the roadtax calculator link). Other arrows in prose mean "leads to" inside a sentence.
12. **14px floor:** the plan-card column labels (`table.plan-table > tbody > tr > td::before`) are 0.875rem (14px), at the floor. They are CSS generated content, which check 6 may not measure.
