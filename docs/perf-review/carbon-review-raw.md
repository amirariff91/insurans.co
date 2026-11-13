# Review of the Core Web Vitals changes (Gemini 4 Carbon high, 13 Nov 2026)

Raw output of a read-only `delegate -a review-max -A none` run against the uncommitted diff.

Verdict: Ship after changes.

Findings (ranked by severity)

1. [Major] src/components/ThirdPartyScripts.astro:55-71 — GTM waits on eager AdSense via window.load, dropping fast bounces, landing attribution on quick click-throughs, and bfcache retries
Consequence: With ads set to eager (src/lib/third-party.ts:36) and analytics set to idle, the async adsbygoogle.js tag in head blocks window.load until AdSense and its early subresources finish or time out. GTM does not start downloading until window.load plus up to 1500 ms of requestIdleCallback, then must sequentially fetch gtm.js (125 KB) and gtag/js (160 KB) (~3-6 s total on mobile 4G, or longer if googlesyndication.com stalls). The visibilitychange hidden fallback (line 69) cannot save tab closes or same-tab navigations because injecting an async gtm.js during document unload cannot complete two sequential script fetches before teardown. Visitors who read the above-the-fold price and leave within ~3-6 s are uncounted; visitors arriving from Google Search who tap a hero CTA within ~3-6 s lose the landing page_view and cta_click, and GA4 starts the session on the second page with document.referrer set to insurans.co (direct attribution). Also, if an unload-triggered gtm.js fetch is aborted as the page enters bfcache, done stays true (line 45) so bfcache restore never retries GTM; and omnibox prerenders are not gated on document.prerendering. Finally, the visibilitychange listener lacks once: true.
Fix: Trigger idle scheduling from DOMContentLoaded (plus a short timer/requestIdleCallback) rather than window.load so slow AdSense cannot block GA4; gate on document.prerendering (wait for prerenderingchange); only mark done or retry on pageshow (event.persisted && !window.google_tag_manager); add once: true to visibilitychange.

2. [Major] src/pages/tools/ncd-calculator/index.astro:490-491 — WCAG AA contrast failure inside #ncd-result
Consequence: Changing text-stone-400 to text-stone-500 (#78716c) inside #result-breakdown renders 12 px text over bg-hijau-50 (#f0f9f4, line 124), not white. Contrast is 4.47:1 (below the 4.5:1 AA threshold; lines 127, 131, and 482 have the same 4.47:1 pair). Lighthouse missed this because #ncd-result starts with class hidden.
Fix: Use text-stone-600 (#57534e, 7.11:1 on bg-hijau-50) at lines 127, 131, 482, 490, and 491.

3. [Minor] src/pages/tools/ncd-calculator/index.astro:55, src/pages/perbandingan/[slug].astro:104, src/pages/negeri/[state].astro:80, plus 7 files under src/pages/guides/ (cara-turun-premium-insurans-kereta.astro:44, how-to-claim/index.astro:74, insurance-vs-takaful/index.astro:84, insurans-kereta-banjir.astro:66, insurans-komprehensif-vs-pihak-ketiga.astro:59, ncd-explained/index.astro:74, renew-car-insurance/index.astro:74) — Second breadcrumb link still lacks an underline
Consequence: On all 10 three-level hand-written breadcrumbs, Utama now has an underline while the adjacent middle link (Tools, Perbandingan, Negeri, Panduan, Insurans Kereta, Takaful) remains un-underlined text-stone-500 (1.90:1 against stone-400 separators and 2.14:1 against stone-700 current-page text), looking inconsistent and retaining the WCAG 1.4.1 link-in-text-block failure.
Fix: Apply underline decoration-stone-300 underline-offset-2 to the second breadcrumb anchor in all 10 files (or migrate them to Breadcrumbs.astro).

4. [Minor] src/layouts/Base.astro:98-101 — Unnecessary fraunces-600 font preload on 54 of 183 built pages
Consequence: Headings without font-semibold/font-bold inherit weight 400 and match fraunces-500-latin.woff2. Preloading fraunces-600-latin.woff2 alongside fraunces-500 wastes 18 KB of critical-path bandwidth and triggers unused-preload console warnings on 54 built pages (including /guides/*) where weight 600 serif never appears, and is below-the-fold-only on most others.
Fix: Drop the fraunces-600-latin.woff2 preload in Base.astro:98, keeping fraunces-500 and source-sans-3-400.

5. [Minor] src/layouts/Base.astro:139-150 — Speculation rules comment/mobile behavior mismatch and non-HTML paths
Consequence: Moderate eagerness triggers on viewport/scroll heuristics on mobile Chrome (80% of traffic), not touchstart (which is conservative). With inlineStylesheets: 'always' adding ~8.2 KB gzip per HTML response (bringing pages to ~17-21 KB gzip, losing cross-page CSS cache reuse across 180 pages), scrolling dense index pages prefetches ~19 KB documents on mobile data (bounded by Chrome's 2-slot moderate FIFO cap). Also /* does not exclude .xml/.txt/.pdf paths (/sitemap-index.xml is linked). Prefetch does not execute JS, so GA4 and AdSense are unaffected.
Fix: Either switch eagerness to conservative to match the touchstart comment or update the comment, and exclude /*.xml, /*.txt, /*.pdf.

6. [Minor] docs/perf-2026-11.md:25,109-114,125 — Write-up contradicts actual AdSense config
Consequence: The document claims the branch sets ads: 'interaction' and removes adsbygoogle.js from raw HTML, whereas src/lib/third-party.ts:36 sets ads: 'eager'.
Fix: Update docs/perf-2026-11.md to reflect ads: 'eager'.

7. [Nit] src/styles/global.css:117-120,381 and src/components/NcdLadder.astro:24 — Bold fallback width, price selector, and unvalidated CSS interpolation
Consequence: Source Sans 3 Fallback bold (600-700) reuses regular size-adjust 93.76% (~4.4% wider than Source Sans 3 600 against Arial Bold; 89.79% matches). Selector .numeric.font-serif misses src/pages/index.astro:139,148 where .numeric is on the parent grid. NcdLadder.astro:24 interpolates id via set:html into style without validation (safe today across all 39 [a-z0-9-]+ car slugs); if module JS fails with JS enabled, #model-picker and [data-ncd-selector] stay visible but inert.
Fix: Set bold fallback size-adjust to ~90% (adjusting ascent/descent overrides), add .numeric .font-serif, and replace NcdLadder set:html with static [data-ncd-selector]{display:none}.

Other requested checks (clean)
- GTM queuing/Consent/noscript: Consent defaults run synchronously first; gtm.start is pushed synchronously in head; queued dataLayer events (ncd_calculate, ncd_claim_check, cta_click, outbound_click, faq_open) and PV compare_view process in FIFO order once gtm.js loads; Safari without requestIdleCallback falls back to setTimeout(1); noscript iframe remains intact.
- AdSense: All 170 ad-enabled pages emit the identical async crossorigin adsbygoogle.js tag; the same 13 pages omit it; google-adsense-account meta is present; public/ads.txt matches live.
- Copy/SEO/CSP: No changes to copy, numbers, titles, canonicals, robots, or JSON-LD; CSS cascade order and /fonts/* URLs are preserved; no CSP header is deployed.

Verified by running
- bun run check (0 errors, 0 warnings, 46 hints) and bun run build (180 routes / 183 HTML files with redirects and 404).
- Inspected dist/ HTML and gzip sizes for /, /car-insurance/perodua-axia/, /tools/ncd-calculator/, /guides/, /404.html, and all 183 pages; compared live curl responses and ads.txt against dist/.
- Computed exact WCAG 2.1 contrast ratios and unpacked WOFF2/TTF font metrics via @capsizecss/unpack.

Could not verify
- Real-world mobile share of sub-5 s bounces lost before GTM loads (requires server/analytics timing distributions).
- Visual rendering on physical iOS/Android devices and live GTM container internals beyond docs/gtm-import-insurans-events.json.

Summary
Found 2 major, 4 minor, and 1 nit issue across analytics deferral timing, calculator AA contrast, 3-level breadcrumbs, font preloads, speculation rules, and docs drift. Files touched: none (read-only; git status unchanged). Verified via bun run check, bun run build, dist/ vs live curl diffs, contrast math, and WOFF2 metric inspection.
