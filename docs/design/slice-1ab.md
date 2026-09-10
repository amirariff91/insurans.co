## 5. Re-cut implementation Slice 1

### Slice 1a — Shell, tokens and font delivery

#### Read only — before editing

- Approved `DESIGN.md`, `.impeccable/design.json`, `PRODUCT.md`; use owner-supplied drafts where not yet committed.
- `package.json`, `yarn.lock`, `astro.config.mjs`.
- `tailwind.config.mjs`, `src/styles/global.css`, `src/layouts/Base.astro`.
- Representative shell consumers: `src/pages/index.astro`, `src/pages/car-insurance/[model].astro`, `src/pages/companies/[slug].astro`.
- Existing `public/fonts/` contents and font licences, if present.

#### Build order

1. Record the approved design contract and sidecar without describing unbuilt components as shipped.
2. Extend `tailwind.config.mjs` with the approved shadow, mobile headline and semantic verdict tokens; preserve incumbent ramps.
3. Modify `src/styles/global.css`: focus, target sizes, reduced motion, reading measure, square geometry and full-rule notes. Retain classes still used by pages.
4. Add licensed, locally served upright WOFF2 assets under `public/fonts/`; preserve Fraunces `SOFT=35`, optical sizing and Source Sans 3 weights.
5. Create `src/components/SiteHeader.astro` and `SiteFooter.astro`; extract existing shell content without changing rating/ranking copy.
6. Create `src/components/Breadcrumbs.astro`; migrate the model/company breadcrumb instances.
7. Modify `src/layouts/Base.astro`: extracted shell, local font declarations/preloads, skip link, labelled landmarks, opaque sticky header and accessible progressive menu.
8. Exercise the shell and font delivery; fix failures before removing superseded shell markup, scripts or font-origin hints.

**Do not:** reorder page answers, change pricing/calculator behavior, remove ratings/rankings, add OG generation, or delete shared CSS that still has callers.

**Verify:** run `npm run build`, then `npm run preview -- --host 127.0.0.1 --port 4321`. Inspect `/`, `/car-insurance/perodua-axia/`, and one generated company page at 390×844 and 1280×900. Check keyboard navigation, no-JS navigation, 400% zoom and the browser Network panel. These commands exist in `package.json`; they have not been run in this read-only revision.

#### Independent-review acceptance criteria

- Build succeeds; shell appears on all three representative routes.
- Header is opaque and sticky; full nav starts at 1024px.
- Menu has correct expanded state, inaccessible closed items, Escape return-focus and usable no-JS navigation.
- Skip link reaches an unobscured main region; breadcrumbs wrap without truncation.
- Standalone targets measure at least 44×44px; visible focus survives filled backgrounds.
- Fonts load from the site origin, without Google Fonts requests; fallback text remains visible.
- No page-wide overflow at 390px or 400% zoom; substantive page content is unchanged.

### Slice 1b — Model answer and calculator handoff

#### Read only — before editing

- Approved `DESIGN.md`, `.impeccable/design.json`, `PRODUCT.md` and revised AnswerCard/provenance contracts.
- Slice 1a’s `tailwind.config.mjs`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/Breadcrumbs.astro`.
- `src/pages/car-insurance/[model].astro`, `src/data/car-models.json`.
- `src/pages/tools/ncd-calculator/index.astro` and any arithmetic modules it actually imports.
- `src/pages/about/index.astro` **or the actual page serving `/about/`**, located before reading.
- `package.json`.

#### Build order

1. Map the existing calculator arithmetic and model fields. Establish one shared module, `src/lib/ncd.ts`, by extracting/reusing existing logic—not creating a parallel formula.
2. Create `Hero.astro`, `AnswerCard.astro` and `EditorialStamp.astro` under `src/components/`, including the specified compact/full contracts and independent provenance states.
3. Create `NcdLadder.astro`: exact six tiers, accessible selector, static no-JS diagram and labelled intermediate simulations.
4. Create `CtaBand.astro`; retain existing quotation destinations and distinguish external navigation from paid relationship status.
5. Reorder `[model].astro`: H1 → full AnswerCard → complete EditorialStamp → remaining content. Keep section IDs and supplied price ranges; remove only the duplicated answer controls/summary.
6. Connect local tier changes to selected annual/monthly outputs and one polite announcement. Preserve the visible 0%/55% reference pair.
7. Extend the calculator for validated `model`/`ncd` query parameters; show the model reference range and request the actual pre-NCD premium rather than inserting a midpoint quote.
8. Exercise the full path; migrate affected arithmetic callers and remove superseded calculation/answer markup only after verification.

**Do not:** invent review dates, source links, paid relationships or prices; silently reconcile stored ranges; remove owner-authored rankings; implement the homepage picker or OG system.

**Verify:** run `npm run build`, then `npm run preview -- --host 127.0.0.1 --port 4321`. Exercise `/car-insurance/perodua-axia/` and `/tools/ncd-calculator/?model=perodua-axia&ncd=38.33`; also test invalid model/tier parameters, every valid tier, no JS, keyboard-only use and the longest model name in the data.

#### Independent-review acceptance criteria

- One AnswerCard and one interactive NCD group exist on the model page at every breakpoint.
- At 390×844, the annual answer, monthly qualification and primary calculator action precede explanatory prose; no clipping or artificial fold enforcement.
- Card qualifier is exact; full stamp follows immediately outside. Schema date never becomes a price-review date.
- Stored 0%/55% values remain unchanged; intermediate simulations use both base endpoints and exact tier values.
- Calculator receives model/tier, labels the reference range and does not treat a midpoint as the user’s premium.
- Invalid handoff values produce a usable calculator with an explicit explanation, not a crash or silent model substitution.
- Static answer, diagram and calculator link work without JS; keyboard updates produce one coherent announcement.
- Existing calculator scenarios still work; modified-contract failures are corrected before completion.

**Revision summary:** updated provenance placement, compact-card contents, content-change authority, sidecar and Slice 1 work packets. **Files touched: none.** Read `package.json` to ground verification commands; no commands, edits or runtime checks performed.
