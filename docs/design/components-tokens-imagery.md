# 3. Component inventory

All components are Astro by default. Only menu, model picker and NCD controls need small progressive-enhancement scripts. No Preact hydration.

Shared contracts:

- `PriceRange = { min: number; max: number }`, MYR/year.
- `EditorialRecord = { articleDate?: ISODate; priceReviewedAt?: ISODate; authorLabel: string; sources: {label, href, scope}[]; methodologyHref: string }`.
- `Verdict = { tone: best|good|warn; label: string; rationale: string; evidenceHref: string }`.
- `Outbound = { label; href; relationship: unpaid|paid|unknown; disclosure?: string }`. Paid relationships require visible disclosure and `rel="sponsored"`; do not equate “external” with “sponsored”.
- Interactive states: visible hover, focus, active; no hover-only information. Disabled applies to controls, not pretend-disabled anchors.

| Component | Props / content | States | Responsive rule | Existing CSS ownership |
|---|---|---|---|---|
| **Hero / AnswerCard** | `Hero`: `title`, `eyebrow?`, `breadcrumbs?`, answer slot. `AnswerCard`: model label, year, 0/55 ranges, selected tier, editorial record, calculator URL, quotation links, `compact` | Reference 55%; selected 0/intermediate/55; provenance complete/missing; JS/no-JS | Single column below 1024px. Desktop Hero may use `1.15fr .85fr`; same card, one DOM instance. No fixed height. | Hero: no existing class; replaces repeated section utilities. AnswerCard supersedes custom home shadow block and model “Ringkasan”; owns its scoped styles, not all `.card-editorial` uses. |
| **PriceRangeBar** | `ranges: [{label,min,max,tone}]`, `unit`, `caption`, `axisMax?` | Normal interval; equal endpoints; absent data → text “Anggaran belum tersedia”, no track | Two labelled tracks full width. Optional graphic omitted in compact first-fold card; text retained. No horizontal scrolling. | **New**; no existing equivalent. Retains `.numeric` for text. |
| **NcdLadder** | `id`, `mode: selector|diagram`, `selectedTier`, optional base range, source/note | Six exact tiers; selected radio; static no-JS diagram; unavailable base still shows percentages | Selector: 3×2 below 640px, six columns above when width permits. Diagram: six rows below 1024px, six ascending steps above. | Replaces the NCD instance of `.table-editorial`; not every table. |
| **Breadcrumbs** | Ordered `{label,href?}[]`, last item current | Current item non-link; ancestor hover/focus | Wrap naturally; 44px link targets. No clipped current model name. | **No global class**; replaces repeated `<nav class="text-sm…">`. |
| **EditorialStamp** | `EditorialRecord`, `scope: article|price|verdict` | Dated/attributed; article-date-only; missing price review/source; never fake reviewed state | Wrap to multiple lines; 14/20 metadata, 44px source links. No pill. | **New**; replaces scattered source/date utility blocks. `.label` remains for short headings only. |
| **FaqItem** | `id`, `question`, answer slot, `open=false` | Native open/closed, keyboard focus; multiple items can stay open | Full width; summary min-height 48px, multiline text; answer indent 0 on mobile, 32px desktop | Moves `.faq-item` rules into component ownership. |
| **CompanyCard** | `name`, `href`, `summary`, `takaful`, optional evidenced verdict, optional verified `claimLine`, scoped price range | Normal; evidence absent → no verdict/rating; phone present → separate `tel:` link | Stacked below 640px; title/content/action row above. One explicit editorial link, no whole-card anchor. | Replaces company uses of `.card-editorial`; removes ranking ordinal utilities. |
| **VerdictBadge** | Evidenced `Verdict` | `best`, `good`, `warn`; missing evidence → omit badge, keep neutral text | Inline wrapping label; rationale beside/below; never truncates to unexplained icon | Replaces `.verdict`, `.verdict-best`, `.verdict-good`; adds warn. |
| **CompareTable** | `caption`, `columns`, `rows`, `kind: facts|comparison`, `source`, optional row verdict | Available/missing cell (“Belum disahkan”); no default sorting/selection | Two-column facts fit. Three-column comparisons use 32/34/34%, wrap at 14/20. More columns: labelled horizontal-scroll region, sticky first column. | Owns `.table-editorial` grammar; migrate each table caller before deleting old class. |
| **CtaBand** | `heading`, `body?`, primary internal `{label,href}`, optional outbound list, disclosure | Internal-only; external options; paid/unpaid/unknown relationship | Stacked, 48px primary and 44px outbound targets below 640px; text/actions columns above | Replaces repeated CTA wrapper utilities; **retains** shared `.btn`, `.btn-hijau`, `.btn-outline` with corrected sizing. |
| **SiteHeader** | Current path, shared navigation items | Current route; menu expanded/collapsed; Escape closes/returns focus; no-JS navigation available | 56px mobile; 64px desktop. Full nav starts at 1024px, not 768px. Opaque sticky background. | No header class exists; extracts `Base.astro` utilities. Retains `.container-wide`. |
| **SiteFooter** | Shared link groups, editorial disclaimer, legal links, year | Link hover/focus; no accordions | Groups stack below 640px; 2-column groups above; 44px standalone links | No footer class exists; extracts `Base.astro` utilities. Retains `.container-wide`. |
| **OgCard** | `variant`, title, subject(s), optional model ranges, review/source status, evidenced verdict | Default/model/company/comparison; priced/unpriced; evidenced/neutral | Fixed 1200×630 artifact; no website responsive behavior. Text must pass fit check; never ellipsise names. | **New**; none. Build-time template sharing tokens, not a client widget. |

Existing class evidence: `src/styles/global.css:43–183`. Header/footer extraction points: `src/layouts/Base.astro:102–162`.

**Retained global primitives:** containers, dividers, `.label`, `.info-box`, buttons, `.prose-editorial`, `.numeric`. Scope article-link styling to prose links so it cannot accidentally underline or recolour button components.

# 4. Tokens

**E = existing value/behavior; C = changed application or value; N = new named token.** Existing ramps remain available; the semantic roles below determine permitted component pairings.

## Colour primitives

| Set | Values | Status |
|---|---|---|
| `hijau` | `50 #f0f9f4`, `100 #daf1e4`, `200 #b8e3cc`, `300 #89ceab`, `400 #57b385`, `500 #359968`, `600 #257a52`, `700 #1e6243`, `800 #1b4e37`, `900 #17402e`, `950 #0b241a` | E |
| `emas` | `50 #fdf9ef`, `100 #f9efd3`, `200 #f2dca5`, `300 #eac46d`, `400 #e3ab42`, `500 #d9922b`, `600 #c07321`, `700 #a0551e`, `800 #83441f`, `900 #6c391c` | E |
| `krim` | `50 #FAFAF7`, `100 #F5F4F0`, `200 #ECEAE4`, `300 #DDD9D1` | E |
| Used Tailwind `stone` roles | `50 #fafaf9`, `100 #f5f5f4`, `200 #e7e5e4`, `300 #d6d3d1`, `400 #a8a29e`, `500 #78716c`, `600 #57534e`, `700 #44403c`, `800 #292524`, `900 #1c1917` | E, inherited Tailwind 3 palette |
| `white` | `#ffffff` | E |

Source: `tailwind.config.mjs:7–37`; stone usage throughout `src/styles/global.css`.

## Semantic applications

| Token | Value | Status / rule |
|---|---|---|
| `surface-page` | `krim-50` | E |
| `surface-raised` | `krim-100` | E; answer sheet |
| `surface-input` | `white` | N role, existing colour |
| `ink-strong` / `ink-body` / `ink-muted` | `stone-900` / `stone-800` / `stone-600` | E/E/C; muted replaces 400/500 for essential copy |
| `rule-strong` | `stone-900` | E |
| `rule-subtle` | `stone-200` | E; decorative separators only |
| `control-border` | `stone-600` | N |
| `action` / `action-hover` / `action-active` | `hijau-700` / `hijau-800` / `hijau-900` | E/E/N |
| `action-ink` | `white` | E |
| `selection-bg` / `selection-ink` | `emas-200` / `stone-900` | E |
| `verdict-best-bg/ink/border` | `hijau-100` / `hijau-800` / `hijau-700` | N semantic set; existing best colours |
| `verdict-good-bg/ink/border` | `krim-200` / `stone-700` / `stone-600` | C; neutral, not gold |
| `verdict-warn-bg/ink/border` | `emas-100` / `emas-800` / `emas-800` | N |
| `note-bg/ink/border` | `emas-50` / `stone-700` / `emas-800` | C; full 1px rule |
| `disabled-bg/ink/border` | `krim-200` / `stone-600` / `stone-600` | N; no opacity trick |

“Best” means **best for a stated criterion**, never a site-wide winner inferred from price or array order. Gold is unavailable for popularity, takaful identity or decoration.

## Typography

All sizes below assume 16px root and must be implemented in `rem`. Weights are explicit, not browser-synthesised.

| Token | Family; weight | Size / leading / tracking | Status |
|---|---|---|---|
| `headline-xl` | Fraunces 600 | 56 / 61.6 / −0.02em | E size; desktop homepage only |
| `headline-lg` | Fraunces 600 | 40 / 46 / −0.02em | E |
| `headline-mobile` | Fraunces 600 | 32 / 36 / −0.02em | N; mobile H1 |
| `headline-md` | Fraunces 600 | 30 / 36 / −0.01em | E |
| `headline-sm` | Fraunces 600 | 24 / 30 / −0.01em | E |
| `price` | Fraunces 600 | 32 / 38.4 / −0.01em; 40 / 46 at ≥640px | N role |
| `wordmark` | Fraunces 600 | 20 / 24 / 0; 24 / 30 at ≥640px | E sizes; N explicit leading |
| `title` | Source Sans 3, 600 | 20 / 28 / 0 | N role, existing utility size |
| `body-reading` | Source Sans 3, 400 | 18 / 28 / 0 | C |
| `body-ui` | Source Sans 3, 400 | 16 / 24 / 0 | E size; N role |
| `control` | Source Sans 3, 600 | 16 / 24 / 0 | C from 14px buttons |
| `caption` | Source Sans 3, 400 | 14 / 20 / 0 | C floor for provenance/caveats |
| `label` | Source Sans 3, 700 | 12 / 16 / 0.1em; uppercase | E |
| `verdict-label` | Source Sans 3, 700 | 12 / 16 / 0.05em | E scale; N role |

- Preserve the four existing headline tokens (`tailwind.config.mjs:44–47`).
- Serif for headings and standalone answer amounts; sans for controls, reading, tables and aligned numeric comparisons.
- Self-host WOFF2; `font-display: swap`. Preload the two critical upright faces/subsets, not every weight.
- Fraunces: optical sizing on, `SOFT 35`. Source Sans 3: 400/500/600/700 where required.
- Do not promise a specific Astro font API without checking the installed version’s available integration; self-hosted `@font-face` is sufficient.

## Space, geometry and behavior

| Family | Complete approved values | Status |
|---|---|---|
| Spacing steps | `0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80px` | E Tailwind steps; N documented whitelist |
| Page gutters | 20px below 640; 24px above | E |
| Card padding | 16px below 640; 24px above | C from 20px mobile |
| Control gap | 8px | N role |
| Section gap | 40px mobile; 64px desktop | C |
| Wide container | 1152px border-box, centred, includes gutters | E |
| Reading measure | Maximum 72ch, constrained by parent | E token, C enforcement |
| Breakpoints | `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536px` | E Tailwind defaults |
| Header/nav breakpoint | Full navigation at 1024px | C |
| Radius | **0 everywhere**: cards, buttons, fields, badges, notes | C: removes incidental rounded variants |
| Rules | Structural 2px; separators/notes 1px; controls 2px | E structural; C control/note standard |
| `shadow-hard` | `8px 8px 0 0 #1c1917` | N token; E exact appearance |
| `shadow-none` | `none` | E |
| `duration-instant` | `0ms`—number updates, menu, details | N |
| `duration-feedback` | `150ms`—colour/border only | E |
| `ease-feedback` | `ease-out` | E |
| Reduced motion | All duration 0; `scroll-behavior:auto` | N |
| Focus | 2px `stone-900` outline, 2px offset; 2px cream separation against filled controls | C from hijau-500 |
| Anchor offset | Header’s actual height + 16px | N |
| Target size | 44×44 minimum; primary controls 48px high | C |
| Layers | content 0; sticky header 50; skip link 60 | E header; N explicit contract |

No other shadows, radii, animated transforms, skeletons or entrance motion.

# 5. Imagery and identity plan

## Logo mark: boxed editorial “i”

**Do not use a shield or tick.** Either could imply insurer status, regulatory approval or verified pricing.

SVG master:

- `viewBox="0 0 32 32"`.
- Outer square: `x=1, y=1, width=30, height=30`, fill `krim-50`, stroke `stone-900`, width 2, square joins.
- Stem: filled `stone-900` rectangle `x=14, y=14, width=4, height=11`.
- Serif foot: filled `stone-900` rectangle `x=10, y=24, width=12, height=2`.
- Dot: filled `hijau-700` square `x=14, y=7, width=4, height=4`.
- No shadow within the mark.
- Header: 24px mark, 8px gap, existing wordmark. Footer: 32px mark.
- Use non-scaling outer stroke for the small web mark.
- Link accessible name: “Insurans.co — Utama”; adjacent mark SVG is decorative.
- Clear space: at least one dot-width on all sides, outside the outer square.

A 16px favicon is pixel-hinted separately: 1px frame, 2×2 dot at `(7,3)`, 2×6 stem at `(7,7)`, 6×1 foot at `(5,12)`.

## OG system

**1200×630 PNG**, generated at build time from the same content records as HTML. No runtime image service.

Shared frame:

- Background `krim-50`.
- Safe content rectangle: `x=64..1136`, `y=48..574`.
- Top row: mark 40×40 at `(64,48)`; wordmark beside it; category label aligned right.
- 2px rule at `y=112`.
- Main title area: `x=64, y=148, width=1072`, maximum three lines.
- Footer rule at `y=522`.
- Footer: `insurans.co · Bukan ejen. Bukan broker.` left; verified date/status right.
- Source Sans 3 for labels/caveats; Fraunces for subject/title.
- Title sizing steps: 64 → 56 → 48px, selected by build-time fit measurement. If a model has a price, reserve a separate 72px amount line.
- Never crop, ellipsise a company name, or reduce disclaimer text below 24px.
- PNG budget: ≤250KB each; opaque background.
- Metadata: absolute image URL, width/height, `og:image:alt`, `twitter:image`.

| Template | Text slots and layout | Colour rules |
|---|---|---|
| **Default** | Category “Panduan insurans Malaysia”; title “Semak harga kereta. Faham NCD.”; supporting line “Anggaran premium · Perbandingan · Kalkulator NCD” | Cream field, stone title, hijau accent. No generic sample price. |
| **Per-model** | `{fullName}`; dominant `{55% annual range}`; “NCD 55% · Anggaran setahun”; secondary “Tanpa NCD: {0% range}”; “Bukan quotation” | 55% amount hijau-800; 0% stone-700. No plotted midpoint or monthly headline. Missing provenance gets plain “Semakan harga belum direkodkan”. |
| **Per-company** | `{name}`; `{fullName}` if distinct; “Produk, kelebihan & cara claim”; one verified, short editorial conclusion if available | Neutral cream/stone. Evidenced verdict may use a small semantic badge. No insurer logos, stars, invented endorsements or company-specific recolouring. |
| **Per-comparison** | `{companyA}` / “vs” / `{companyB}`; supporting “Perbandingan harga, perlindungan & claim”; optional evidenced criterion-specific verdict | Equal typographic weight and space for both names. A winner gets colour only when supported; otherwise both neutral. |

Paths:

- `/og-default.png`
- `/og/car-insurance/{slug}.png`
- `/og/companies/{slug}.png`
- `/og/perbandingan/{slug}.png`

Sharing compatibility justifies the asset. A claim that WhatsApp is the dominant channel is unnecessary and unverified.

## NCD ladder diagram

Separate two ideas: **discount percentage** and **remaining base-premium fraction**. Do not draw an unexplained staircase that could mean either.

- Six ordered entries: 0 years/0%; 1/25%; 2/30%; 3/38.33%; 4/45%; 5+/55%.
- Remaining fractions: 100%, 75%, 70%, 61.67%, 55%, 45%.
- Mobile: six rows, minimum 48px each; year label left, percentage centre, remaining-base bar and text right/below.
- Desktop: six ascending steps whose heights encode discount on a 0–55% scale. Every step still prints both percentage values.
- Non-selected entries: neutral outlines. Final 55% step: `hijau-100` with `hijau-800` text. Selected entry: 2px hijau-700 frame plus explicit “Dipilih”.
- Claim-risk note beneath in the warning palette. No universal “one claim resets NCD” assertion.
- Semantic ordered list is primary. Decorative SVG/CSS bars are `aria-hidden`; no duplicate screen-reader narration.
- Diagram is not a screenshot image and does not require download/share controls.
- PriceRangeBar uses a **common annual-MYR axis** for its two tracks: zero to the largest upper endpoint, rounded upward to the next RM100. Each track marks `[min,max]`; labels remain readable without the graphic.
- Do **not** put a monthly tick on an annual axis. Monthly equivalence is separate text.

## Risk glyphs

Shared `viewBox="0 0 24 24"`, 2px `currentColor` stroke, round caps/joins, no filled background tile. Display at 24px; always accompanied by a text label.

- **Theft:** padlock body `rect(5,10,14,11)`; shackle from `(8,10)` to `(8,7)`, semicircular arch to `(16,7)`, down to `(16,10)`; keyhole vertical `(12,14)` to `(12,17)`.
- **Repair:** open spanner head in upper-right, handle down-left; path points `(21,3)→(17,7)→(14,4)→(18,1)`, open-jaw outline continuing into a handle ending at `(4,20)`; fit all visible strokes inside a 2px safe inset when finalising coordinates. No gear or animated rotation.
- **Claim frequency:** axis `(4,4)→(4,20)→(21,20)`; three vertical strokes at `x=8,13,18`, starting `y=14,10,6`. These are an icon, not a data chart.
- **Important note:** plain outlined circle centred `(12,12)`, radius 9; vertical `i` stem and dot. No approval tick.

The glyphs identify categories. They do not encode the risk rating by themselves.

## Favicons

Generate from the same master:

- `favicon.svg`
- `favicon.ico`: 16/32/48px
- `apple-touch-icon.png`: 180px
- `icon-192.png`, `icon-512.png`
- `icon-maskable-512.png`: mark within the central 60%, cream extends to edges
- `site.webmanifest`: name/short name, icons, `start_url:"/"`, `display:"browser"`, cream background/theme colour

No offline/PWA capability is implied.

**Magnific / photoreal imagery: none.** Neither upscaling nor photoreal cars clarify a price range, NCD assumption, claim line or source. No stock photography and no AI-rendered cars anywhere in this system.

# 6. Accessibility and typography rules

## Approved contrast pairs

Approximate sRGB WCAG contrast ratios, rounded to one decimal. These are palette calculations, **not a browser accessibility audit**; implementation must verify computed colours, opacity and font rendering.

| Foreground / background | Approx. ratio | Use |
|---|---:|---|
| `stone-900 #1c1917` / `krim-50 #FAFAF7` | **16.8:1** | Headings, rules, focus |
| `stone-800 #292524` / `krim-50` | **14.5:1** | Body |
| `stone-700 #44403c` / `krim-50` | **9.8:1** | Secondary reading |
| `stone-600 #57534e` / `krim-50` | **7.3:1** | Metadata |
| `hijau-700 #1e6243` / `krim-50` | **7.0:1** | Links |
| `white #ffffff` / `hijau-700` | **7.3:1** | Primary button |
| `white` / `hijau-800 #1b4e37` | **9.6:1** | Button hover |
| `hijau-800` / `hijau-100 #daf1e4` | **8.1:1** | Best verdict |
| `stone-700` / `krim-200 #ECEAE4` | **8.5:1** | Good verdict |
| `emas-800 #83441f` / `emas-100 #f9efd3` | **6.5:1** | Warning verdict |
| `stone-900` / `emas-200 #f2dca5` | **13.0:1** | Text selection |

- Essential text: ≥4.5:1. Meaningful controls/graphics: ≥3:1.
- `stone-200` separators are decorative; never the only visible input boundary.
- No stone-400 metadata, low-opacity disclaimers or white text on emas.
- Verdict text and rationale carry meaning independently of colour.

## Interaction and semantics

- WCAG 2.2 AA target. Every standalone interactive target at least 44×44px; primary controls 48px high; 8px gaps.
- Visible skip link on focus, before the header; `main id="main-content" tabindex="-1"`.
- Label navigation landmarks; `aria-current="page"` on active links.
- Menu is a disclosure, not a modal. `aria-expanded`, `aria-controls`, Escape close, focus returned to trigger. Closed links must not remain tabbable.
- Preserve native select, radio group, details and table semantics.
- New-tab links explicitly say so; default quotation links open in the same tab, enabling ordinary Back navigation.
- Paid quotation links receive `rel="sponsored"` and visible relationship wording. `noopener` applies when opening another tab.
- No consent, affiliate or independence claims invented by UI defaults.
- At 320px and 400% zoom: no page-wide horizontal scrolling. Wide comparison tables may scroll within a labelled, keyboard-focusable region.
- Sticky header must not obscure focused elements or fragment targets.

## BM typography and numerals

- `lang="ms"` remains.
- Reading text: 18/28; aim for roughly **35–45 characters per line on the 350px mobile measure**, subject to actual font metrics. Desktop maximum 72ch.
- Left-align; no justification, manual non-breaking paragraphs or automatic hyphenation.
- Short labels may be uppercase; provenance and multiword controls remain sentence case.
- Use familiar BM labels consistently across mobile and desktop; do not append a second EN navigation vocabulary only on mobile.
- Expand technical terms at first substantive use: “NCD (diskaun tanpa tuntutan)”, “komprehensif”, “perlindungan tambahan”.
- Monetary formatting: `Intl.NumberFormat('ms-MY')`, integer MYR for estimates, en dash for ranges; `RM` separated with a non-breaking space from each amount token.
- Annual amounts are primary. Monthly amounts always say “setara tahunan ÷ 12; bukan pelan ansuran”.
- Tabular lining figures for tables, calculations and changing outputs. Source Sans 3 is the aligned numeric face; no monospace font dependency.
- Do not force an entire long range onto one line. Keep each endpoint intact, allow a break after the dash.
- Keep 38.33% computational precision. Never use a visually shortened “38%” tier.

