# insurans.co — Launch-readiness review (2026-09-10)

Owner: Claude Fable 5.1 (this session). Reviewers: GLM 5.3 Flash (analytics/GSC), Gemini 3.8 Flash (Astro/infra), Muse Spark 1.3 (content/E-E-A-T, design critique, data enrichment), Impeccable audit (owner). Every P0 below was re-verified by the owner against the working tree or the live site.

## Verdict

**Not launch-ready as-is, but close.** The site is indexed, healthy in Search Console, and already earns ~2 clicks/day from car-model pages. Four production defects (soft-404s, dropped security headers, broken social image, non-reproducible Docker builds) and one measurement gap (zero events, no consent default) are being fixed in this run. The content engine (39 model pages) is the asset to invest in; the hubs are the biggest ranking gap.

## Baseline

| Signal | Value |
|---|---|
| GSC 90d (Jun 12 – Sep 9) | 174 clicks, 15,648 impressions, avg position 45 → 20 (last two weeks) |
| Top page | /car-insurance/perodua-axia/ 72 clicks, pos 6.7, 3,039 impr |
| Under-ranking hubs | / pos 44.9 (3,174 impr), /car-insurance/ pos 56.4 (1,795), /companies/ pos 33.6 (699) |
| Indexing | URL Inspection PASS on /, Axia, /negeri/kelantan/; sitemap-index 105 URLs, 0 errors |
| Ahrefs | DR 0, 0 organic keywords; 330 referring domains, ~95% spam anchors (no equity) |
| PageSpeed mobile | Perf 75–76, A11y 95–96, BP 100, SEO 100; LCP 5.1–5.2 s; one contrast failure |
| Impeccable audit | 15/20 Good (homepage); heuristic critique 25/40 on both templates |
| Content scores (claude-blog rubric) | flood guide 74, homepage 69, about 67, model template 62, comparison 51, state 49 |

## P0 — fixed in this run (Slices A1/A2/C)

1. **Soft-404s.** `nginx.conf` `try_files … /404.html` returns 200 for missing URLs; `/404/` is indexed with impressions. Fix: `=404` + `error_page`. (Live-verified: `/nonexistent-page/` → 200.)
2. **Security headers dropped.** `add_header` inside location blocks discards the server-level headers; live homepage carries none. Fix: repeat headers per location, add HSTS + Permissions-Policy.
3. **Broken og:image on every page.** `/og-default.png` referenced by `Base.astro` does not exist; no `twitter:image`, no apple-touch-icon, no manifest. Fix: generated brand assets + absolute og:image URL.
4. **Non-reproducible Docker builds.** Dockerfile ignores `package-lock.json`, runs `npm install`; `packageManager: yarn` contradicts npm. Fix: `npm ci`, `.dockerignore`, drop yarn field.
5. **Zero measurement.** No dataLayer events; GTM loads with no Consent Mode default. Fix: consent default before GTM (Slice A2); event helper + calculator/CTA events (Slice B); GTM tag spec in `docs/gtm-tags.md`.
6. **Homepage title double-brands** (`… — Insurans.co | Insurans.co`, verified in dist). Fix: title guard.
7. **Phantom SearchAction** to `/search?q=` (no route) and **broken card link** to `/travel-insurance/`. Fix: remove / repoint.
8. **Article schema has no author** on ~20 pages; Person exists only on /about/. Fix: shared `withAuthor()` helper injects the editorial Person + publisher.
9. **Wrong insurer claim hotlines.** Nine of twelve stored claim lines did not appear on the insurers' official sites and one used the wrong access code (1-800 vs 1-300); they were about to become tap-to-call links. Fixed: all twelve verified against official pages on 2026-09-10, with source and verified date stored per company; `llms-full.txt` synced.
10. **Secrets in `.claude/settings.local.json`** (Cloudflare + Coolify bearer tokens in allow-rules). Fixed: scrubbed and gitignored. **User action: rotate both tokens.**

## P1 — next (not in this run unless noted)

- **Answer-first model page for mobile.** At 390px the Axia owner sees zero numbers in two viewports (critique §2). Design track delivers an AnswerCard (NCD 55% vs 0%, monthly, tier selector, CTA) under the H1.
- **Hub rewrites** (GLM §5): `/` target "insurans kereta" (6.5k, KD 0), `/car-insurance/` add H2 for "insurans kereta murah" (600, KD 0) + renew section, `/companies/` add claim-hotline table with `tel:` links; concrete title/H1/meta proposals in the GLM report.
- **Model-page enrichment.** Nine enriched BM records (premium by NCD tier and region, year notes, add-on verdicts, 3 model-specific FAQs each) are drafted in the session scratchpad (`enriched-models.json`); items marked `[semak]` need owner fact-check before publishing. Extend to all 39.
- **Named author + reviewer.** YMYL content needs at least one named author and one reviewer with credentials, `/penulis/` profile pages, `author`/`reviewedBy`/`sameAs` on every Article. The editorial-team Person added now is the honest interim, not the end state.
- **Slug mismatches** `/companies/rhi/` (RHB Insurance) and `/companies/kurnia/` (data says Berjaya Sompo) need renames with 301s; regenerate `llms.txt` from data rather than hand-editing.
- **Render-blocking fonts** → Astro Fonts API (self-hosted). Largest lever on the 5.2 s LCP. Design track slice.
- **Preact removal** (unused) and `astro check` in CI; content collections + zod for `src/data`.
- **rel="sponsored"** on Bjak/PolicyStreet CTAs (done in A2) plus visible disclosure copy on every template that links out.

## P2

Hardcoded schema dates (per-record `dateModified`), Tailwind 4 migration, ClientRouter + prefetch (wrap menu script in `astro:page-load`), brotli (needs module), `categories.json` route, README rewrite, disavow file (optional), trim retired AI user-agents in robots.txt, add freshness/legal sections to `llms.txt`, contrast fix for the one failing pair, desktop nav tap height, `.info-box` side-tab border.

## Tracking event spec (from GLM, adopted)

| Event | Where | Params | GA4 key event |
|---|---|---|---|
| ncd_calculate | NCD tier buttons, calculator | base_premium, ncd_pct, premium_after, saving | yes |
| ncd_claim_check | "patut ke claim?" button | repair_cost, excess, ncd_pct, should_claim | yes |
| cta_click | internal CTAs (`data-cta`) | destination, location, text | no |
| outbound_click | Bjak, PolicyStreet, MyEG links | partner, outbound_url, location | yes (once/session) |
| faq_open | `.faq-item` toggle | faq_question, page_type | no |
| compare_view | GTM page-path trigger `^/perbandingan/.+` | company_a, company_b | no |

Consent Mode v2: analytics granted by default for Malaysia (PDPA has no cookie-banner requirement), ads denied, EEA/UK region override to denied. No banner needed until ad tags are added.

## User actions

1. Rotate the Cloudflare and Coolify API tokens.
2. Create the GA4 event tags/triggers in GTM-T3LMP78G per `docs/gtm-tags.md` (written in Slice B) and mark ncd_calculate, ncd_claim_check, outbound_click as key events.
3. After deploy: URL-inspect a garbage URL (expect 404), request removal of `/404/`, request indexing on the three hubs after their rewrites.
4. Decide the named author/reviewer (real people, real credentials) for the E-E-A-T upgrade.
5. Optional: add insurans.co as an Ahrefs project for Site Audit; install Chrome system libs if local Lighthouse runs are wanted (`libatk-1.0` etc.).

## Sources
Worker reports and raw GSC/PSI JSON are in the session scratchpad; Ahrefs and GSC figures were pulled live on 2026-09-10.
