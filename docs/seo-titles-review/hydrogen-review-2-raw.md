# Second review of the title and description changes (Gemini 4 Hydrogen high, 13 Nov 2026)

Raw output of a read-only review run against the uncommitted diff after the first round of fixes. Its three findings (stale write-up, silent lastmod drop, leftover field) were fixed afterwards.

Verdict: ship after changes

All six earlier findings are fixed in dist/ except one leftover field in car-models.json, and the write-up in docs/seo-titles-2026-11.md disagrees with the actual relatedModels diff. No blockers or numerical errors remain.

Findings (ranked by severity)

1. Minor — docs/seo-titles-2026-11.md claims three relatedModels changes, but only two exist in the diff
File: docs/seo-titles-2026-11.md:107-111; src/data/car-models.json (proton-saga)
What is wrong: The doc states toyota-corolla replaced perodua-axia on proton-saga and that 8 pages link to toyota-corolla. In the working tree, only honda-city (line 2053) and toyota-vios (line 2786) changed (replacing mazda-2 with toyota-corolla); proton-saga still lists perodua-axia, and 7 pages link to toyota-corolla (6 models plus /car-insurance/).
Consequence: Stale documentation and inaccurate link-count baseline for the measurement plan. Leaving Saga linked to Axia rather than Corolla is actually better for readers, so the doc should match the data.
Fix: Update docs/seo-titles-2026-11.md to state two relatedModels changes (Vios and City) and 7 inbound pages.

2. Minor — astro.config.mjs sitemap lastmod reader assumes default dist/ and compact HTML/JSON attribute order
File: astro.config.mjs:11-29
What is wrong: pageContentDate() hardcodes ./dist/ instead of reading astro:build:done's output directory, and matches literal property="article:modified_time" content="..." or "dateModified":"...".
Consequence: If outDir, build.format, or Base.astro attribute order/JSON spacing changes later, pageContentDate() returns undefined and silently drops lastmod without failing the build. Current static build works as intended.
Fix: Acceptable for now; optionally assert a non-zero date count or log missing expected paths in serialize().

3. Nit — Leftover descriptionOverride on toyota-corolla-cross
File: src/data/car-models.json:3264
What is wrong: toyota-corolla-cross still has an unused descriptionOverride field alongside the new titleName field (removed on honda-jazz, missed here).
Consequence: Dead data field in car-models.json.
Fix: Delete the descriptionOverride line on toyota-corolla-cross.

Verification of all checklist items

1. Earlier findings in dist/:
- All 39 model titles contain "Anggaran", none contain "±", all 39 lead sentences under H1 include "Semenanjung". Only mercedes-c-class (146 chars) and mercedes-glb (143 chars) drop "Semenanjung" in meta description to stay within 155 chars; acceptable because the lead and #kos-tahunan state Semenanjung.
- NCD title (56 chars) and H1 keep "Insurans"; all 15 comparison titles/H1s keep "insurans" or "takaful" and use "kad perubatan". Hub, NCD-guide, and deductible H1s match their titles.
- New model description wording ("Insurance price & roadtax <Model> <cc> (anggaran, Semenanjung): ...") reads naturally in Malaysian Manglish.
- NCD table moved to top with caption, scope="col", and scope="row"; all 16 calculator DOM IDs verified intact.

2. Number accuracy:
Recomputed all 39 yearly totals from src/data/car-models.json and src/lib/roadtax.ts (calcRoadtax Semenanjung). Every title, description, lead sentence, og:title, twitter:title, JSON-LD headline, and #kos-tahunan matches. "≈" appears on all 13 models whose roadtax has sen; "=" appears on the other 26.

3. Sitemap and links:
dist/sitemap-0.xml contains 179 URLs (identical indexable set to HEAD; 404 and 3 redirects excluded). 167 have valid W3C dates from page data (all <= 2026-11-13, never build time); the 12 undated URLs genuinely lack content dates. mazda-2 retains 4 inbound links (hub, nissan-almera, mazda-3, suzuki-swift); all relatedModels slugs exist.

4. Lengths, checks, build:
All 60 changed pages fit <=60 title and <=155 description chars; 0 duplicates across 179 indexable pages. Canonical, robots, and URLs unchanged. Ran bun install --frozen-lockfile, bun run check (0 errors, 47 pre-existing warnings), and bun run build (180 pages / 183 HTML files).

Could not verify: live SERP rewrites and interactive browser execution of the NCD calculator after moving the table.

Summary: Read-only audit of the 12 modified files and dist/; no files edited or committed. Found 2 minor and 1 nit issue; verified build, typecheck, sitemap dates, link targets, and all 39 model calculations.
