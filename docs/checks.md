# Site checks (`bun run check:site`)

One command that verifies a build of insurans.co against live production and against the Edisi design rules.

```sh
bun run build
bun run check:site          # release run: all ten checks must run and pass; exits 1 on any failure or skip
bun run check:site:static   # checks 1-5 only (no browser); same as `node scripts/checks/run.mjs --static`
```

A skipped check is a failure of `check:site`: the release command requires ten completed checks. Use
`check:site:static` (or `CHECKS=1,2,3,4,5`) when you deliberately want only the static checks.

Options (environment variables):

| Variable | Effect |
| --- | --- |
| `DIST=/path/to/dist` | Check another build (default `./dist`). |
| `CHECKS=1,2,8` | Run only these checks (each must run; a skip still fails). Static checks take ~5 s; the full suite ~90 s. |
| `CHROME_PATH=/path/to/chrome` | Chromium or Chrome for checks 6–10 (default `/home/dev/.cache/ms-playwright/chromium-1247/chrome-linux64/chrome`). |
| `PLAYWRIGHT_CORE=/path/to/playwright-core` | playwright-core package to use when the project has none installed. |
| `ALLOWLIST=/path/to/allowlist.json` | Use another allowlist (for example an empty one, to list every difference). |

The runner serves `dist/` itself on a free port. The browser checks use `playwright-core`: from the project if it is
installed, then `PLAYWRIGHT_CORE`, then `/home/dev/.local/lib/node_modules/@playwright/cli/node_modules/playwright-core`.
If the library or Chromium is missing, checks 6–10 are **SKIPPED** and `check:site` exits 1.

Getting a browser on a new machine: `npm i -g playwright-core` (or any playwright-core 1.5x) and point
`PLAYWRIGHT_CORE` at it, then either `npx playwright-core install chromium` (note the printed path) or use an installed
Chrome, and set `CHROME_PATH`. playwright-core is deliberately **not** a project devDependency (November 2026): adding it
changes `bun.lock`, and the Docker build runs `bun install --frozen-lockfile` with dev dependencies; playwright-core
itself downloads no browser on install, so the image would only grow by the package. Whether to add it is an open
owner decision (`docs/handoffs/EDISI_2026-11-15.md`). Requests to
googletagmanager.com, google-analytics.com, googlesyndication.com, fundingchoicesmessages.google.com and
doubleclick.net are always aborted, so no test run reaches analytics or ads.

The static checks parse HTML with `node-html-parser`, which Astro installs as a dependency. If an Astro upgrade drops
it, add it as a devDependency.

## What each check guards

| # | Check | Guards | Fails when |
| --- | --- | --- | --- |
| 1 | Contract against live | The redesign must not change facts, prices, titles, structured data, ad gating or indexing. | Compared with `baseline-a5a1c65.json`, per URL: title, H1, meta description, canonical, robots meta, every JSON-LD value (flattened to `Type.path = value`), the set of RM figures and percentages in visible text (compared by value), phone numbers, and whether AdSense loads. Any difference not explained fails. Explained means: an exact `allowlist.json` entry; an added RM figure on `/`, `/car-insurance/` or a model page that is in the set the NCD control and its derived displays print (computed from `src/data/car-models.json` with the site's own `steps.ts`/`lib/ncd.ts`: six steps' ranges, totals with roadtax, monthly figures, savings, roadtax, special-perils estimate; model pages also list related models' premiums); or a changed FAQ question/answer whose old and new text both equal an entry in `faq-approved.json` for that page and JSON-LD path, and whose new text is the visible FAQ text (see "Approving FAQ wording" below). **Contextual assertions:** every model page and the homepage show, in HTML (what a reader sees without JavaScript) and in the `data-p*` attributes, the six steps' price, total and saving computed from the data; each medical-card and critical-illness plan page's lead equals its record (`annualLimit`; the count that starts "Penyakit yang dilindungi"); the `/insurans-online/` buy-direct table has one row per `direct-online.json` record linking its official URL. |
| 2 | Ads and indexing | AdSense review and indexing. | The set of pages loading `adsbygoogle.js` differs from the baseline (95 pages); a content page lacks the `google-adsense-account` meta; a `negeri/<state>/` page is not `noindex, follow`; the sitemap lists a noindex page or misses an indexable one. |
| 3 | Structure | Accessibility and SEO basics. | Not exactly one `h1`; a skipped heading level; `lang` is not `ms`; an `img` without `alt`, `width` or `height`; duplicate ids; an internal link to a file that is not built, or a `#fragment` with no matching id; JSON-LD that does not parse; FAQPage question or answer text that is not visible verbatim on the page (whitespace-normalised, case-insensitive); a `/terkini/<item>/` page without an outbound https source link (`a[data-source]`, off-site) or without an internal "updates" link (`a[data-updates]`) to a built page. |
| 4 | Copy hygiene | Leaks from templates and data. | Visible "TODO", "TBD", "lorem", "undefined", "NaN", "[object", "RM —", a raw `{` or `}`, a doubled full stop, "asAt", "figureVerified"; a bjak.my, policystreet.com or fincrew link outside `/insurans-online/`. **Warnings:** English leftovers ("Free Tool", "Related tools", "Flow:", "Rule of thumb") and ISO dates in visible text. |
| 5 | Photo credits | Licence compliance for `/images/kereta/*.webp`. | A used photo has no author/licence/source record in `src/data/car-photos.json`; a page shows a photo without a credit linking the licence; `/kredit-foto/` does not list a used photo (by its source URL). |
| 6 | Layout | Every page at 320, 390 and 1280 px. | Horizontal page overflow; an element wider than the viewport outside a scroll container; visible text under 14 px (grouped by selector). **Warnings:** tap targets under 44×44 at 390 (inline prose links and the skip link excluded), counted per pattern. |
| 7 | First screen at 390×844 | The Edisi "answer first" rule. One page per template family, plus all 39 model pages and the homepage. | The H1 size differs from the homepage `.ea-h1` size (the report names the CSS rules that set it); the answer box (`.mod` with `.mod-bar`, `PageAnswer`, or the price block) starts below y=844; on model pages a button ends below 844 or the price is within 8 px of the screen edge. **Warnings:** no answer box on the page at all; more than 3 magenta (#D0106F-like) fills in the first screen, counting the NCD selected bar and knob as one control. Per-page counts are in `report.json` (`results[].magenta`). |
| 8 | NCD control | The six-step NCD bars: JavaScript off on the homepage and all 39 model pages; JavaScript on for the homepage and three model pages. | After choosing each of the six steps, the rendered price, total and saving differ from `carSteps()` in `src/components/edisi/steps.ts` applied to `src/data/car-models.json`; a price element shows zero or two values; with JavaScript on, the logo dot does not move. The rendered value is waited for, not slept on. |
| 9 | Calculators | The six calculators. | Any of the 26 fixed cases (NCD, NCD claim, car roadtax, motorcycle roadtax, home, life cover, and 11 electric-car roadtax cases: 50 → RM20, 130 → RM120, 150 → RM160, 150.1 → RM180, 220 → RM305, 390 → RM965, 1010 → RM14,415, 1200 → RM20,000, "130 kW" → RM120, "10000 kW" → RM20,000, 130 in Langkawi → RM60; the EV amount is matched whole) gives a different result; the EV calculator shows an amount or no message for 0, -5, "abc" or an empty input, or keeps a result after the input changes; with JavaScript off the EV page lacks its 98-row table; the NCD calculator does not open at 55% with a visible "Contoh" label; the engine-size parser misreads "1.5", "1496", "2", "0.66" or accepts "15"/"15cc"; with JavaScript off a calculator shows no notice or its submit navigates. |
| 10 | Console | Runtime errors. | Any page error, console error, failed or 4xx/5xx first-party request (loaded at 1280). |

## Updating the baseline

The baseline is a snapshot of live production. Make a new one only when a new commit goes live:

```sh
C=<live commit>; W=$(mktemp -d)/base
git worktree add --detach "$W" "$C" && ln -s "$PWD/node_modules" "$W/node_modules"
(cd "$W" && bun run build)
node scripts/checks/make-baseline.mjs "$W/dist" "$C"
git rm scripts/checks/baseline-<old>.json   # the runner uses the one baseline-*.json it finds
git worktree remove --force "$W" || git worktree prune
```

After a new baseline, remove allowlist entries that no longer match anything (the runner prints "Unused allowlist
entries").

## Updating the allowlist

`scripts/checks/allowlist.json` holds intended differences from the baseline. An entry matches a check-1 difference
when every field it gives matches:

- `kind`: `pageAdded`, `pageRemoved`, `changed`, `added`, `removed`
- `field`: `page`, `title`, `h1`, `description`, `canonical`, `robots`, `ads`, `rm`, `pct`, `phones`, `jsonld`
- `url`: regex on the page path; `path`: regex on the JSON-LD path; `value`: regex on the value (for changes, `old -> new`)
- `old`, `new`: the exact two sides of a `changed` difference (`null` = absent)
- `values`: the exact list of added or removed values (canonical form, as the report prints them)
- `reason`: required; say why the difference is intended.

Every entry should be exact: `old`/`new` for a change, `values` for a figure, one page. To see every raw difference,
run `ALLOWLIST=<file with "entries": []> CHECKS=1 node scripts/checks/run.mjs` and read `report.json`. Never allowlist a `removed` RM figure without the editor's sign-off:
that is a price leaving a page.

## Approving FAQ wording

`scripts/checks/faq-approved.json` lists every FAQ question and answer whose text differs from the live baseline,
per page URL and JSON-LD path (`FAQPage.mainEntity[n].name` / `.acceptedAnswer.text`), with the exact live text
(`old`) and the exact reviewed text (`new`). Check 1 passes a changed FAQ item only when both sides equal its
entry. Matching figures are not enough: "claim boleh ditolak" changed to "claim boleh diluluskan" has the same
numbers and fails until approved. Entries that match nothing are printed under "Unused allowlist entries".

After editing FAQ text (in the one array the page renders both the visible FAQ and its JSON-LD from), review the
wording, then regenerate the file deliberately:

```sh
bun run build
node scripts/checks/run.mjs --approve-faq   # prints NEW/CHANGED items, rewrites faq-approved.json, runs no checks
git diff scripts/checks/faq-approved.json   # read every changed line before committing
```

`check:site` never passes `--approve-faq`. FAQ items added or removed outright (one side absent) are not covered by
the file; they need an exact `allowlist.json` entry, as do FAQ changes the allowlist already names.

## Known limits

- RM figures and percentages are compared as **sets per page**: a figure moved within a page, or repeated fewer times,
  is not detected, except for the contextual assertions above. Figures are compared by value: `RM330 – RM670`,
  `RM 330-RM 670` and `RM330–670` are one figure; `RM50K-100K` = `RM50,000–100,000`; `RM30 bilion` =
  `RM30,000,000,000`; `RM280.00` = `RM280`; `0.2%–0.5%` keeps both ends. Values swapped in by CSS (`data-p*`
  attributes) are covered by the contextual assertions and check 8.
- Visible text is the HTML body without `script`, `style`, `template` and `svg`; text hidden by CSS still counts, and
  `noscript` content counts.
- Phone numbers are found by Malaysian patterns and `tel:` links; unusual formats can be missed.
- FAQ matching is substring-based on normalised text: markup inside answers (links) is stripped on both sides.
- Check 7 takes the first page (alphabetically) of each family as its representative.
- Checks 1 and 8 compute expected figures by transpiling `src/lib/ncd.ts` and `src/components/edisi/steps.ts` with the
  project's `typescript` at run time (`scripts/checks/site-helpers.mjs`); the special-perils estimate is
  `specialPerilsRange()` in `steps.ts`, the function the model page calls.
- Check 3's Terkini rule accepts any off-site https link in the Sumber list as the source; whether the source is official is
  an editorial check (src/lib/terkini.ts only enforces an https URL).
- Check 9 fixtures were captured from the merged build (fx-tools review, 2026-11; EV cases from JPJ Pekeliling Bil.01/2026); if a calculator rule changes on
  purpose, update `CALC` in `scripts/checks/browser.mjs`.
- Pre-existing problems that are also in live (a5a1c65) are reported as failures; `report.json` does not mark which
  ones are new. Run with `DIST=<baseline build>` to compare.
