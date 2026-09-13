<!--
Paste the block below as the FIRST message in a fresh Claude Code session
(run at xhigh effort). It is written for Claude Opus 4.8's autonomy + literal
instruction-following: full task/intent/constraints stated upfront so the
session can plan and execute with minimal back-and-forth.
Everything above the line is a note to you, the human; don't paste it.
-->

---

You are the **owner session** for `insurans.co` (BM-first Malaysian insurance guide, Astro 6 static → nginx via Docker, deployed on Coolify). Work at **xhigh effort**. CLAUDE.md, the auto-memory (MEMORY.md), and the `delegate`/`seo-ahrefs`/`seo-content-brief` skills load automatically — read them; the notes below are the specifics that matter so you can start without re-discovery.

## Where things stand (all on `main`, live in production)
Last session expanded the site from motor-only to multi-vertical and deployed it (161 pages). Live and committed:
- Data-backed verticals: `/medical-cards/`, `/critical-illness/` (+ `/senarai-penyakit-kritikal/`), `/travel-insurance/`, `/insurans-online/` (6 platform reviews)
- Calculators: `/tools/kalkulator-roadtax/`, `/tools/kalkulator-coverage-nyawa/`
- Public-scheme vertical: `/bantuan-insurans/` + `/i-lindung/` (mySalam, Tenang, PERKESO)
- Content: `/literasi-kewangan/` (6 articles), `/panduan/` (3 lead-magnets)
- Infra: package manager is **bun** (`bun run check` / `bun run build`); shared title helper at `src/lib/seo.ts`; author/E-E-A-T via `src/lib/schema.ts` `withAuthor` (injects Amir Ariff into any Article schema)

## Your task this session
Enrich the three still-thin, prose-only verticals with the proven data-backed pattern, and build the one calculator that is honestly buildable:
1. **Home insurance** (`/home-insurance/`) — build `src/data/home-insurance.json` + `[slug]` detail pages + upgrade the hub. The **fire/HOHH tariff is public** (verified) → also build a **fire-premium calculator** at `/tools/kalkulator-insurans-rumah/` (`premium = rate × sum insured`; HO 0.090%/0.093%, HH 0.338%, min RM60 + RM10 stamp).
2. **Personal accident** (`/personal-accident/`) — data + detail pages from published PA products/flat prices.
3. **Motorcycle** (`/motorcycle-insurance/`) — data + detail pages; extend the roadtax calculator to motorcycle cc-bands (public JPJ schedule). Motorcycle **third-party/comprehensive premiums are quote-gated → do NOT compute them** (route that intent to outbound partner links).

**The research is already done and committed** — read `docs/content/drafts/thin-verticals-home-pa-motorcycle.md` (GLM-verified facts, sourced, with per-vertical JSON rows and a buildable-vs-quote-gated verdict). Mirror the existing pattern: study `src/pages/medical-cards/{index,[slug]}.astro`, `src/pages/tools/kalkulator-roadtax/index.astro`, and `src/lib/roadtax.ts`.

## Non-negotiable constraints (YMYL)
- **Never fabricate** premiums, limits, payouts, or rankings. Every figure must trace to a public source (insurer PDS/brochure, PIAM tariff, JPJ, BNM, LHDN, gov portal) carried in the row's `sources[]` with an `asAt` date; leave unverifiable fields `null` and hedge in copy. Only public tariffs/formulas (fire, JPJ roadtax) or the user's own inputs may drive a calculator — no insurer premium estimation.
- **Independence**: "bukan ejen, bukan broker". No "best"/"recommended"/blanket product advice; outbound links use CtaBand `relationship: 'unpaid'` (never `sponsored`); status-check intents (gov portals) stay as links, never imitation tools.
- Every new page: exactly one Article + one FAQPage JSON-LD (visible FAQ text == schema), `withAuthor`, canonical, `seo.ts` `buildTitle`/`buildDescription` (unique titles ≤60 incl the " | Insurans.co" suffix Base appends), `EditorialStamp`, and a client-side calculator must give its result container `role="status" aria-live="polite"` with guarded `getElementById`.

## How to work (proven loop — you are the integrator)
- You plan, integrate every worker diff, run verification, and commit. Workers never merge their own output.
- Fan out via `delegate` (load the skill): **GLM 5.3 Flash** = read-only research/web (`-a research`); **Muse Spark 1.3** = BM content + data-row drafting (`-a review -m muse-code/muse-spark-1.3`, cannot write files — returns text); **Luna max** = implementation (`-a impl -w`, always a worktree); **Gemini 3.8 Flash** = review (`-a review`); **Sol xhigh** = deep review (`-a review -m openai-codex/gpt-5.6-sol:xhigh`). Cap 3 concurrent; run builds that touch shared files (nav/footer/homepage) sequentially, or wire those links yourself after. Spawn a worker only when it fans out real parallel work — do trivial edits directly.
- **Ahrefs is owner-only**: worker sessions cannot reach the MCP, so pull keyword/SERP/tariff data yourself and paste it into worker prompts.
- **Review-worker instruction**: tell review workers to "report every issue including low-severity/uncertain — coverage not filtering; a later pass ranks them." (Opus/Gemini/Sol self-filter faithfully otherwise.)
- Provider quota can be strained late in a session; if a review lane 429s on both Gemini and the GLM fallback, do the review yourself rather than stall.
- Integrate a worktree by copying its changed files (use `cp -r` for whole new page dirs — a plain `cp` skips directories), then `bun run check` + `bun run build`, then verify schema counts / 0 `[object Object]` / titles / sitemap, then commit and remove the worktree.

## Verification & done
`bun run check` (0 errors) + `bun run build` clean; each new route in the sitemap with Article + FAQPage; calculators compute correctly against their public test cases (add `testCases` to the data file like `roadtax-rates.json` and check them). Commit per logical unit with the attribution lines from the session's system reminder. Do **not** merge to `main`, push, or deploy without an explicit go-ahead — production deploy on Coolify is a gated action (needs a root API token + `export COOLIFY_TOKEN=…` so `$COOLIFY_TOKEN` expands, then `GET /api/v1/deploy?uuid=s8og48gw8gowkgg44okww4k4`).

Start by reading `docs/content/drafts/thin-verticals-home-pa-motorcycle.md` and the medical-cards/roadtax templates, pull any fresh Ahrefs volumes you want to prioritise, then give me a short plan (verticals + calculators, build order, what you'll delegate) before building.
