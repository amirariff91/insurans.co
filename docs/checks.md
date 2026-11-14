# Site checks (`bun run check:site`)

One command that verifies a build of insurans.co against live production and against the Edisi design rules.

```sh
bun run build
bun run check:site          # exits 1 on any failure; report in scripts/checks/report.json
```

Options (environment variables):

| Variable | Effect |
| --- | --- |
| `DIST=/path/to/dist` | Check another build (default `./dist`). |
| `CHECKS=1,2,8` | Run only these checks. Static checks take ~3 s; the full suite ~80 s. |
| `CHROME_PATH=/path/to/chrome` | Chromium for checks 6–10 (default `/home/dev/.cache/ms-playwright/chromium-1247/chrome-linux64/chrome`). |

The runner serves `dist/` itself on a free port. The browser checks use `playwright-core`: from the project if it is
installed, otherwise from `/home/dev/.local/lib/node_modules/@playwright/cli/node_modules/playwright-core`. If either
the library or Chromium is missing, checks 6–10 are reported as **SKIPPED**, never as passed. Requests to
googletagmanager.com, google-analytics.com, googlesyndication.com, fundingchoicesmessages.google.com and
doubleclick.net are always aborted, so no test run reaches analytics or ads.

The static checks parse HTML with `node-html-parser`, which Astro installs as a dependency. If an Astro upgrade drops
it, add it as a devDependency.

## What each check guards

| # | Check | Guards | Fails when |
| --- | --- | --- | --- |
| 1 | Contract against live | The redesign must not change facts, prices, titles, structured data, ad gating or indexing. | Compared with `baseline-4dd50a3.json`, per URL: title, meta description, canonical, robots meta, every JSON-LD value (flattened to `Type.path = value`), the set of RM figures and percentages in visible text, phone numbers, and whether AdSense loads. Any difference not in `allowlist.json` fails. A figure that disappears always fails unless allowlisted. |
| 2 | Ads and indexing | AdSense review and indexing. | The set of pages loading `adsbygoogle.js` differs from the baseline (97 pages); a content page lacks the `google-adsense-account` meta; a `negeri/<state>/` page is not `noindex, follow`; the sitemap lists a noindex page or misses an indexable one. |
| 3 | Structure | Accessibility and SEO basics. | Not exactly one `h1`; a skipped heading level; `lang` is not `ms`; an `img` without `alt`, `width` or `height`; duplicate ids; an internal link to a file that is not built, or a `#fragment` with no matching id; JSON-LD that does not parse; FAQPage question or answer text that is not visible verbatim on the page (whitespace-normalised, case-insensitive). |
| 4 | Copy hygiene | Leaks from templates and data. | Visible "TODO", "TBD", "lorem", "undefined", "NaN", "[object", "RM —", a raw `{` or `}`, a doubled full stop, "asAt", "figureVerified"; a bjak.my, policystreet.com or fincrew link outside `/insurans-online/`. **Warnings:** English leftovers ("Free Tool", "Related tools", "Flow:", "Rule of thumb") and ISO dates in visible text. |
| 5 | Photo credits | Licence compliance for `/images/kereta/*.webp`. | A used photo has no author/licence/source record in `src/data/car-photos.json`; a page shows a photo without a credit linking the licence; `/kredit-foto/` does not list a used photo (by its source URL). |
| 6 | Layout | Every page at 320, 390 and 1280 px. | Horizontal page overflow; an element wider than the viewport outside a scroll container; visible text under 14 px (grouped by selector). **Warnings:** tap targets under 44×44 at 390 (inline prose links and the skip link excluded), counted per pattern. |
| 7 | First screen at 390×844 | The Edisi "answer first" rule. One page per template family, plus all 39 model pages and the homepage. | The H1 size differs from the homepage `.ea-h1` size (the report names the CSS rules that set it); the answer box (`.mod` with `.mod-bar`, `PageAnswer`, or the price block) starts below y=844; on model pages a button ends below 844 or the price is within 8 px of the screen edge. **Warnings:** no answer box on the page at all; more than 3 magenta (#D0106F-like) fills in the first screen, counting the NCD selected bar and knob as one control. Per-page counts are in `report.json` (`results[].magenta`). |
| 8 | NCD control | The six-step NCD bars on the homepage and three model pages, JavaScript on and off. | After choosing 0% and 25%, the price, total and saving shown differ from `src/data/car-models.json` (0% and 55% from the data; other steps `round10(NCD0 × (1 − step))`; total adds `roadtaxMin`/`roadtaxMax`, rounded to RM1); a price element shows zero or two values; with JavaScript on, the logo dot does not move. |
| 9 | Calculators | The five calculators. | Any of the 15 fixed cases (NCD, NCD claim, car roadtax, motorcycle roadtax, home, life cover) gives a different result; the NCD calculator does not open at 55% with a visible "Contoh" label; the engine-size parser misreads "1.5", "1496", "2", "0.66" or accepts "15"/"15cc"; with JavaScript off a calculator shows no notice or its submit navigates. |
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
- `field`: `page`, `title`, `description`, `canonical`, `robots`, `ads`, `rm`, `pct`, `phones`, `jsonld`
- `url`: regex on the page path; `path`: regex on the JSON-LD path; `value`: regex on the value (for changes, `old -> new`)
- `reason`: required; say why the difference is intended.

Keep entries narrow (one page family, one field). Never allowlist a `removed` RM figure without the editor's sign-off:
that is a price leaving a page.

## Known limits

- RM figures and percentages are compared as **sets per page**: a figure moved within a page, or repeated fewer times,
  is not detected. Figures are normalised (`RM330 – RM670` = `RM330–670`). Values swapped in by CSS (`data-p*`
  attributes) are not visible text and are covered by check 8 instead.
- Visible text is the HTML body without `script`, `style`, `template` and `svg`; text hidden by CSS still counts, and
  `noscript` content counts.
- Phone numbers are found by Malaysian patterns and `tel:` links; unusual formats can be missed.
- FAQ matching is substring-based on normalised text: markup inside answers (links) is stripped on both sides.
- Check 7 takes the first page (alphabetically) of each family as its representative.
- Check 8 expected values for 25/30/38.33/45% assume rounding to RM10 from the NCD 0% range, as in
  `src/components/edisi/steps.ts`.
- Check 9 fixtures were captured from the merged build (fx-tools review, 2026-11); if a calculator rule changes on
  purpose, update `CALC` in `scripts/checks/browser.mjs`.
- Pre-existing problems that are also in live (4dd50a3) are reported as failures; `report.json` does not mark which
  ones are new. Run with `DIST=<baseline build>` to compare.
