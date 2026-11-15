# insurans.co

An independent, Bahasa-Malaysia-first guide to Malaysian insurance and road tax prices. Static site built with Astro 7 and Tailwind 3, run with bun. Production is https://insurans.co.

## Quick start

```sh
bun install            # dependencies
bun run dev            # local dev server at http://localhost:4321
bun run build          # static build into ./dist (about 180 pages)
bun run check          # astro check: TypeScript and template errors; must show 0 errors
bun run check:site     # ten site checks against a build (run after bun run build); all ten must run
bun run check:site:static  # checks 1-5 only, no browser
bun run preview        # serve ./dist locally
```

`bun run check:site` compares the build with live production and with the design rules: facts and prices, ads and indexing, structure, copy, photo credits, layout at 320/390/1280px, the first phone screen, the NCD control, the calculators and console errors. What each check guards, its options and how to update its baseline and allowlist are in `docs/checks.md`. Checks 6 to 10 need playwright-core and a Chromium; when either is missing they are SKIPPED and `check:site` fails. Point `CHROME_PATH` at a Chromium or Chrome binary and, if the project has no playwright-core, `PLAYWRIGHT_CORE` at an installed copy (see `docs/checks.md`). `check:site:static` runs only the browser-free checks 1 to 5.

Other scripts: `bun run assets:brand` and `bun run assets:og` (brand and share images), `bun run data:merge-enriched` (model data). `python3 scripts/ads-gate-audit.py dist /tmp/ads-gate.json` (build folder, then the JSON report to write) reports pages that load ads while failing the content gate (see `PRODUCT.md`).

## Deploy

Coolify builds the `main` branch from the `Dockerfile` (bun build, then nginx serving `dist/` with `nginx.conf`). A deploy is a manual trigger in Coolify; pushing to `main` does not deploy by itself. Merge to `main` only what has passed `bun run build && bun run check && bun run check:site`.

## Where things are

- `src/pages/` routes, `src/components/` (Edisi components in `src/components/edisi/`), `src/layouts/Base.astro` (head, consent, ads opt-in), `src/data/*.json` (models, companies, plans, rates), `src/styles/` (global and Edisi CSS), `public/` (fonts, icon sprite, car photos).
- `PRODUCT.md`: who runs the site, independence, audience, YMYL, ads and consent rules, what is not built.
- `DESIGN.md` and `.impeccable/design.json`: the Edisi design system as shipped.
- `docs/gaya-bahasa.md`: the Malay house style for all copy.
- `docs/checks.md`: the site checks.
- `docs/handoffs/`: hand-off notes between work sessions; the latest is `docs/handoffs/EDISI_2026-11-15.md`.
- `docs/gtm-tags.md`, `docs/perf-2026-11.md`, `docs/seo-titles-2026-11.md`, `docs/astro-7-upgrade.md`: topic notes.
