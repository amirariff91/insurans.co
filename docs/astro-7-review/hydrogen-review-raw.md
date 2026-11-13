# Review of the Astro 7 upgrade (Gemini 4 Hydrogen high, 13 Nov 2026)

Raw output of a read-only review run against the uncommitted diff.

Verdict: Ship.

Findings:
The working-tree change is clean; no blocker, major, or minor issues found. One documentation nit in docs/astro-7-upgrade.md:142: bun audit reports fflate@0.7.3 via satori's own exact pin ("fflate": "0.7.3") alongside @shuding/opentype.js/fflate@0.7.5, and motorcycle-insurance/index.html also gains 3 spaces between adjacent </p><p> block tags (no visual or DOM effect). Neither affects production output.

What I verified by running it:
1. Build and v6 vs v7 output comparison (dist/ vs v6 baseline, all 290 files):
   - Non-HTML files: all 93 files outside _astro/ (including sitemap-index.xml, sitemap-0.xml, robots.txt, llms.txt, llms-full.txt, ads.txt, OG images, fonts) are byte-identical.
   - _astro/ assets: 14 files in both; CSS shrinks 35,745 -> 33,915 bytes; unused Preact renderer chunks change because @astrojs/preact 6 splits client and preact.module, and no HTML page loads them.
   - HTML (183 files = 180 pages + 3 redirect pages): 0 diffs in <title>, <meta> tags, rel="canonical", parsed JSON-LD, internal <a href> multisets, GTM/Consent Mode inline scripts, AdSense external script tags, inline JSON data blocks, normalized DOM tag/attribute structure, and visible text with whitespace stripped.
   - Whitespace and inline JS diffs: 39 car model pages gain whitespace-only text nodes inside flex/grid items in AnswerCard.astro and NcdLadder.astro (ignored by CSS flex/grid layout); motorcycle-insurance/index.html gains 3 inter-block spaces between </p><p>; 10 medical-cards pages replace a newline with spaces via {' '} in src/pages/medical-cards/[slug].astro:123; 180 pages share one Oxc-reminified mobile-menu inline module script with identical logic.
   - Inspected by eye in HTML diffs: index.html, car-insurance/perodua-axia/index.html, tools/ncd-calculator/index.html, tools/kalkulator-insurans-rumah/index.html, medical-cards/aia-a-plus-health-360/index.html, and perbandingan/aia-vs-great-eastern/index.html. All match v6 aside from asset hashes, scoped-style IDs, Oxc menu script minification, and the AnswerCard/medical-card whitespace noted above.

2. src/lib named JSON imports and bundle audit:
   - Repo-wide search confirms single client callers for each modified module: home-insurance-fire.ts (tools/kalkulator-insurans-rumah/index.astro:287), roadtax-motor.ts (tools/kalkulator-roadtax-motosikal/index.astro:273), roadtax.ts (tools/kalkulator-roadtax/index.astro:256). None re-export the JSON objects.
   - Direct Bun execution comparing HEAD vs working-tree implementations of calcFirePremium, calcMotorcycleRoadtax, and calcRoadtax across property types, construction classes, regions, body types, boundary/fractional CCs, and roadtax-rates.json testCases produced identical results.
   - Inspected all _astro/*.js bundles: calculator bundles shrank (home-insurance 3,338 -> 3,264 B, car roadtax 4,552 -> 4,473 B, motor roadtax 3,592 -> 3,485 B) and no bundle contains unused JSON keys (methodologyNote, car-models, etc.).

3. Astro 7 upgrade applicability and compressHTML:
   - Setting compressHTML: true in astro.config.mjs is appropriate to preserve v6 whitespace behavior across templates.
   - Searched src/ for Astro 7 breaking-change surfaces (Astro.glob, ViewTransitions/ClientRouter, astro:transitions, astro:content, astro:db, client:* directives, getContainerRenderer, .md/.mdx, src/fetch.*): none used.
   - Checked node_modules engine constraints: astro 7.4.12 and @astrojs/preact 6.1.6 declare node >=22.23.4 (matches package.json engines.node); @astrojs/compiler-rs 0.5.3 includes linux-x64-musl and linux-arm64-musl bindings for the Dockerfile's oven/bun:1-alpine build.

4. package.json, bun.lock, check, audit, and scope:
   - package.json updates only astro (^7.4.12), @astrojs/preact (^6.1.6), @astrojs/sitemap (^3.7.5), @astrojs/check (^0.9.12), and engines.node.
   - bun.lock diff shows no custom registries, git/tarball URLs, or install-script additions.
   - .astro/content.d.ts is already tracked in git and receives only the Astro 7 LiveContentConfig render overload.
   - bun install --frozen-lockfile: succeeded (no changes, 467 installs).
   - bun run check: 0 errors, 0 warnings, 4 pre-existing hints.
   - bun run build: 180 pages built cleanly.
   - bun audit: 1 vulnerability (1 moderate, fflate@0.7.3 under devDependency satori).

What I could not verify:
- Live Chromium rendering/interactive behavior, Docker build in oven/bun:1-alpine, astro dev server, and production GTM/GA4/AdSense network execution.

Summary: Read-only review complete; no tracked files touched. Verified via bun install --frozen-lockfile, bun run check, bun run build, bun audit, Python HTML/DOM/text/asset diff across all 290 files against the v6 baseline, and direct Bun calculator equivalence tests.
