---
name: Insurans.co
description: Panduan insurans Malaysia — angka dahulu, bukti berdekatan.
colors:
  krim-50: "#FAFAF7"
  krim-100: "#F5F4F0"
  krim-200: "#ECEAE4"
  krim-300: "#DDD9D1"
  stone-200: "#e7e5e4"
  stone-600: "#57534e"
  stone-700: "#44403c"
  stone-800: "#292524"
  stone-900: "#1c1917"
  white: "#ffffff"
  hijau-50: "#f0f9f4"
  hijau-100: "#daf1e4"
  hijau-700: "#1e6243"
  hijau-800: "#1b4e37"
  hijau-900: "#17402e"
  emas-50: "#fdf9ef"
  emas-100: "#f9efd3"
  emas-200: "#f2dca5"
  emas-800: "#83441f"
typography:
  headline-xl:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "3.5rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline-lg:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "2.5rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline-mobile:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.125
    letterSpacing: "-0.02em"
  headline-md:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  headline-sm:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  price:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  wordmark:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0"
  title:
    fontFamily: "Source Sans 3, system-ui, -apple-system, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0"
  body-reading:
    fontFamily: "Source Sans 3, system-ui, -apple-system, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.555556
    letterSpacing: "0"
  body-ui:
    fontFamily: "Source Sans 3, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  control:
    fontFamily: "Source Sans 3, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0"
  caption:
    fontFamily: "Source Sans 3, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.428571
    letterSpacing: "0"
  label:
    fontFamily: "Source Sans 3, system-ui, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.333333
    letterSpacing: "0.1em"
  verdict-label:
    fontFamily: "Source Sans 3, system-ui, -apple-system, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.333333
    letterSpacing: "0.05em"
rounded:
  none: "0"
spacing:
  "0": "0"
  "0.5": "2px"
  "1": "4px"
  "1.5": "6px"
  "2": "8px"
  "2.5": "10px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "12": "48px"
  "14": "56px"
  "16": "64px"
  "20": "80px"
components:
  button-primary:
    backgroundColor: "{colors.hijau-700}"
    textColor: "{colors.white}"
    typography: "{typography.control}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.hijau-800}"
    textColor: "{colors.white}"
  button-primary-active:
    backgroundColor: "{colors.hijau-900}"
    textColor: "{colors.white}"
  button-outline:
    backgroundColor: "{colors.krim-50}"
    textColor: "{colors.stone-900}"
    typography: "{typography.control}"
    rounded: "{rounded.none}"
    padding: "10px 20px"
  answer-card:
    backgroundColor: "{colors.krim-100}"
    textColor: "{colors.stone-900}"
    rounded: "{rounded.none}"
    padding: "16px"
  verdict-best:
    backgroundColor: "{colors.hijau-100}"
    textColor: "{colors.hijau-800}"
    typography: "{typography.verdict-label}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
  verdict-good:
    backgroundColor: "{colors.krim-200}"
    textColor: "{colors.stone-700}"
    typography: "{typography.verdict-label}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
  verdict-warn:
    backgroundColor: "{colors.emas-100}"
    textColor: "{colors.emas-800}"
    typography: "{typography.verdict-label}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
---

# Design System: Insurans.co

## Overview

**Creative North Star: "Lembaran Semak"**

A practical editorial comparison sheet: cream ground, dark rules,
clear figures and a restrained green action colour. Refine the
incumbent identity; do not replace it with an insurer dashboard or
an official-looking certificate.

Fraunces remains because it is the established display face.
Source Sans 3 carries reading, controls and aligned numeric work.
The system makes estimates and their limitations equally legible.

**Key Characteristics:**
- Answers before explanation.
- Annual ranges, not promotional point prices.
- Square geometry; structural, not ambient, shadows.
- Provenance beside claims.
- One primary internal action per decision block.
- Diagrams instead of decorative photography.

## Colors

Retain the existing hijau, emas and krim ramps in Tailwind.
Frontmatter records the active component colours.

### Primary

- Hijau-700: primary actions and underlined editorial links.
- Hijau-800: hover actions and strong green figures.
- Hijau-900: pressed actions.
- Hijau-100: evidenced positive verdict surface.

### Secondary

- Emas-100 with emas-800: caution and limitations.
- Emas-50: explanatory notes.
- Emas-200 with stone-900: text selection.

### Neutral

- Krim-50: page background.
- Krim-100: answer sheet and footer.
- Krim-200: neutral verdict and disabled surfaces.
- White: input surfaces.
- Stone-900: headings, strong rules and focus.
- Stone-800: body.
- Stone-700: secondary reading.
- Stone-600: essential metadata and control boundaries.
- Stone-200: decorative separators only.

**The Evidence Rule.** Colour cannot manufacture a verdict.
Best requires a named criterion, rationale and evidence link.
Good is neutral. Warn is gold. Takaful is a textual product attribute,
not a verdict colour.

## Typography

**Display:** Fraunces, Georgia, serif; optical sizing enabled,
SOFT axis 35.

**Body and controls:** Source Sans 3, system-ui, -apple-system,
sans-serif.

Self-host WOFF2 with font-display: swap. Do not add a third font.

### Hierarchy

Use the frontmatter scale. Mobile H1 is 32/36; desktop H1 is 40/46.
Only a spacious desktop homepage may use 56/61.6.

Standalone prices are 32/38.4, rising to 40/46 at 640px.
Wordmark is 20/24, rising to 24/30 at 640px.
H2 is 30/36; H3 is 24/30.

Reading copy is 18/28. UI copy and controls are 16/24.
Essential captions and caveats are at least 14/20.
12/16 uppercase labels are for short category labels only.

**The Number Rule.** Tables and changing calculations use Source
Sans 3 with tabular lining figures. Annual MYR ranges lead; monthly
equivalents explicitly say they are annual amounts divided by 12,
not instalment offers. Preserve 38.33% NCD precision.

Use ms-MY numeric formatting. Keep each monetary endpoint intact;
allow a long range to wrap after its dash.

## Layout

Wide container: 1152px border-box, centred.
Gutters: 20px below 640px, 24px above.
Reading measure: no more than 72ch.
Card padding: 16px mobile, 24px from 640px.
Section spacing: 40px mobile, 64px desktop.

Use Tailwind breakpoints: 640, 768, 1024, 1280 and 1536px.
Full header navigation begins at 1024px.

Mobile is one content column. Desktop may use an answer/text split
or reading column with secondary sidebar. A responsive layout must
not duplicate interactive answer controls.

Header is opaque and sticky: 56px mobile, 64px desktop, plus its
2px bottom rule. Anchor/focus offset is actual header height + 16px.

No fixed-height text containers. No page-wide overflow at 320px or
400% zoom. A genuinely wide table may scroll inside its own labelled
region.

## Elevation & Depth

Rules carry structure. Most surfaces are flat. One principal answer
sheet per surface may use the hard offset shadow.

### Shadow Vocabulary

- hard: `8px 8px 0 0 #1c1917`.
- none: `none`.

No blur, soft shadow, gradient, glass or hover translation.
Reserve room for the hard shadow without clipping it.

Colour and border feedback: 150ms ease-out.
Numbers, menu disclosure and details update immediately.
Reduced motion removes transitions and smooth scrolling.

Focus: 2px stone-900 outline, 2px offset, with a 2px cream separation
against filled controls. Focus must not be clipped.

Record shadow, motion, focus and breakpoint extensions in
`.impeccable/design.json`; do not invent unsupported token-schema
properties in this frontmatter.

## Shapes

All radii are zero: cards, buttons, inputs, badges and notes.
Structural rules and control borders are 2px.
Separators and labelled notes use a full 1px rule.

The logo mark is a boxed editorial i, not a shield or approval tick.
Risk glyphs use a 24px canvas and 2px line.
Every meaningful glyph has a visible text label.

## Components

### Buttons

Primary: hijau-700 with white text, minimum height 48px.
Hover: hijau-800. Active: hijau-900.
Outlined secondary: cream, stone-900 text and 2px border.
Outlined hover: stone-900 with white text.
Every standalone target is at least 44×44px; target gaps are 8px.

Use links for navigation and buttons for local actions.
One primary internal action per decision block.
Outbound quotation choices are separately labelled and disclosed.
Paid links require visible paid-relationship wording and sponsored
link semantics.

### Hero and AnswerCard

One H1. Price answers precede descriptive prose.
The answer sheet prints annual scope, reference NCD 55% versus 0%,
monthly equivalence and an estimate caveat.

55% starts as an explicitly labelled example, never detected user
data. Intermediate tiers are labelled simulations on the 0% base
range. Do not silently overwrite supplied 55% reference estimates.

Keep a single interactive card in the DOM.
Missing provenance remains visible as missing, not a review badge.

### PriceRangeBar and NcdLadder

Range graphics share an annual-MYR scale and label both endpoints.
Do not mix monthly and annual ticks on one axis.

NCD tiers are 0, 25, 30, 38.33, 45 and 55%.
Selector: native radios, 3×2 on narrow screens.
Diagram: six mobile rows, six desktop steps.
Labels distinguish discount from remaining base-premium fraction.

Without JavaScript, show meaningful static values and working links;
do not expose non-functional controls.

### EditorialStamp and VerdictBadge

Separate article date, price-review date and sources by claim scope.
Never convert a schema date into “Disemak”.
Never use BNM/PIAM references to imply endorsement of model prices.

A verdict requires criterion, rationale and evidence.
Without those, show neutral editorial text and omit the badge.
No invented author identity, testimonial, star rating or rating count.

### CompanyCard and CompareTable

CompanyCard is an article with an explicit title/action link.
Claim telephone links are separate actions.
Do not make a whole paragraph/card one anchor.

Tables have captions and scoped headers.
Two-column facts fit without scrolling.
Three-column comparisons use 32/34/34% widths and wrap.
Wider tables use a labelled, keyboard-accessible scroll region.
Missing values read “Belum disahkan”, never zero.

### FaqItem and Notes

FAQ uses native details/summary with a 48px minimum summary target.
Multiple answers may remain open.
Plus/minus decoration is hidden from assistive technology.

Notes use a full border and an explicit label.
No left-tab alert styling and no essential 12px disclaimer copy.

### Navigation

SiteHeader and SiteFooter share one BM navigation vocabulary.
Menu is a disclosure with expanded state and controls relationship;
Escape closes it and restores trigger focus.
Provide usable navigation without JavaScript.

Breadcrumb ancestors are links; the current page is plain text.
Wrap rather than truncate.
Include a skip link and labelled navigation landmarks.

### CtaBand

Internal calculation/comparison action is primary.
Quotation choices identify the outside destination before activation.
Do not claim a commercial relationship is absent when it is unknown.

### OgCard and Identity Assets

OG variants: default, model, company and comparison.
Canvas is 1200×630 with a cream field, dark rule and stable wordmark.
Use the same content/provenance records as visible HTML.
Names must fit without ellipsis.
No unsupported rating, winner or price claim in social previews.

Use the boxed-i mark for header, footer and favicon family.
No stock photography, AI-rendered cars or photoreal upscaling.

## Do's and Don'ts

### Do:
- Do preserve the incumbent colours and font pairing.
- Do put scope, assumptions and source status beside estimates.
- Do retain readable HTML when JavaScript or fonts fail.
- Do use 44px targets and 48px primary controls.
- Do use text and shape as well as colour for state.
- Do verify long BM names, all six NCD tiers and 400% zoom.
- Do keep route-specific layouts and data contracts in surface briefs.

### Don't:
- Don't style unverified claims as audited facts.
- Don't imply insurance is sold by Insurans.co.
- Don't rank companies by array order.
- Don't use gold for “good” or takaful identity.
- Don't duplicate interactive mobile/desktop summaries.
- Don't conceal the first answer beneath decorative navigation.
- Don't use rounded cards, blurry shadows or stock imagery.
- Don't shrink caveats to make the first viewport fit.

## Decisions (2026-09-10)

- Direction: refine and extend the incumbent identity ("Lembaran Semak"); no replacement world.
- Existing editorial /5 scores on company pages stay, relabelled "Skor editorial" with a methodology link; the unsupported `AggregateRating` (`ratingCount: 100`) is removed from JSON-LD.
- Ordinal rankings and "terbaik untuk model" wording are removed; company entries remain as neutral links to `/companies/` and `/perbandingan/`.
- No stock photography, AI-rendered cars, or photoreal upscaling anywhere. All imagery is SVG or build-time generated from tokens.
