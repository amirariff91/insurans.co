## Slice 2 — Homepage discovery and the complete model reading path

1. Create `src/components/ModelPicker.astro`; modify `src/pages/index.astro` for the specified first viewport and progressive model selection.
2. Create `src/components/PriceRangeBar.astro`; use shared numeric formatting and the reference ranges from Slice 1.
3. Create `src/components/CompareTable.astro` and `FaqItem.astro`; migrate home/model tables and FAQ instances.
4. Complete the full diagram mode in `NcdLadder.astro`; reuse it in the calculator explanation without duplicating controls.
5. Create `src/components/RiskGlyph.astro`; modify the model risk section to use labelled glyphs, source status and the specified reading order.
6. Modify model add-on/tips/ownership-cost presentation; preserve model-specific data and fix only substantiated content claims. Do not repeat “all claims reset NCD” or imply flood cover is universally included.
7. Replace the model’s generic “best insurer” list with neutral links to `/companies/` and `/perbandingan/`; remove its ordinal ranking.
8. Move homepage counts below the task; remove the broken travel card; consolidate quotation exits into CtaBand with actual relationship metadata.
9. Verify model-picker changes update title, both ranges, monthly amount, provenance and URL together; test slow/no JS and no page-wide horizontal overflow.
10. Verify actual homepage first viewport at 390×844, mobile range/ladder readability and screen-reader output. Then remove superseded homepage/model class uses and duplicate arithmetic/markup.

## Slice 3 — Company/comparison trust and complete identity distribution

1. Create `src/components/CompanyCard.astro` and `VerdictBadge.astro`; migrate `src/pages/companies/[slug].astro`, company listings and homepage directory.
2. Inspect and modify `src/pages/perbandingan/[slug].astro` and its index for equal-weight brand comparison, CompareTable and evidence-gated verdicts.
3. Inspect `src/data/companies.json` and `src/data/comparisons.json`; add verified claim-line/provenance fields, not invented scores. Remove unsupported visible ratings and `aggregateRating` claims from affected templates.
4. Complete company answer hierarchy: H1 → scoped verdict/limitations → verified claim line → editorial stamp → products/pros/cons → external quotation route.
5. Create `public/logo-mark.svg` and the favicon/touch/manifest family from the specified geometry; wire them in `Base.astro`.
6. Create a build-time `OgCard` template and generator under `scripts/`; update the existing package build command so assets exist before the final static output is packaged.
7. Generate `/og-default.png` and all model/company/comparison variants; modify `Base.astro` and corresponding pages for absolute image URLs, alt text, image dimensions and Twitter image metadata.
8. Migrate remaining occurrences across `src/pages/**/*.astro` of the extracted FAQ/table/verdict/company-card contracts; preserve `.card-editorial` only where a genuinely generic non-company card remains.
9. Verify actual company and comparison pages on mobile/desktop, `tel:` links, paid/unpaid disclosure states, missing evidence, long names and comparison-table keyboard scrolling.
10. Verify generated OG files visually at 1200×630 and reduced preview size; inspect metadata and confirm every referenced asset exists in built output.
11. After verification, remove obsolete CSS/classes and generation intermediates; reconcile `DESIGN.md`, its sidecar and component documentation with what shipped.

