# Review of the title and description changes (Gemini 4 Hydrogen high, 13 Nov 2026)

Raw output of a read-only `delegate -a review -A none` run against the uncommitted diff.

Verdict: ship after changes

Findings (ranked by severity)

1. Major — Roadtax region (Peninsular Malaysia only) omitted from model titles, descriptions, and above-the-fold leads
File: src/pages/car-insurance/[model].astro:64-78,134-140
What is wrong: Roadtax and yearly totals use Peninsular Malaysia (Semenanjung) rates, which are nearly double Sabah/Sarawak on >1.6L non-saloons (e.g. Hilux 2.8: RM1,248 Semenanjung vs RM686.40 Sabah/Sarawak; CX-5 2.5: RM830.40 vs RM457.72). Neither the title, meta description, nor Hero lead paragraph mentions Semenanjung; the qualification only appears in the footnote under #kos-tahunan.
Consequence: Sabah/Sarawak owners searching roadtax or yearly cost see inflated Peninsular figures in search snippets and above the fold without regional qualification.
Fix: Add "Semenanjung" to the Hero lead ("Anggaran setahun (Semenanjung) untuk ...") and, where character budget permits, in the meta description.

2. Major — "±RM..." title fallback is ambiguous as an estimate disclaimer and mathematically awkward with a range
File: src/pages/car-insurance/[model].astro:66
What is wrong: Three models (toyota-corolla-cross, mercedes-c-class, honda-jazz) fall back to "Insurans & Roadtax <Model>: ±RM<min>–<max>". Combining "±" with a min–max range reads like "+/-" tolerance rather than "Anggaran" (estimate).
Consequence: Weakens the estimate signal required on every price-bearing title and looks odd in SERPs.
Fix: Replace "±" by trimming static words instead ("Insurans & Roadtax <Model>: Angg. RM..." or shortening "Mercedes-Benz" to "Mercedes" in searchName; for Jazz, "Insurans & Roadtax Honda Jazz/City HB: Anggaran RM840–1,620" is 58 chars).

3. Major — NCD page drops "Insurans" from both <title> and <h1>; 7 comparison pages drop "Insurans"/"Takaful"
File: src/pages/tools/ncd-calculator/index.astro:44,62; src/data/comparisons.json (allianz-vs-zurich, tokio-marine-vs-msig, tokio-marine-vs-allianz, berjaya-sompo-vs-lonpac, etiqa-vs-zurich, aia-vs-great-eastern, aia-vs-msig)
What is wrong: NCD title/H1 ("Jadual NCD Kereta 2026 (0–55%) & Kalkulator NCD") lost "Insurans", and siteSuffix={false} removes "Insurans.co" too. Seven comparison pages also dropped "insurans"/"takaful" from both <title> and <h1>, and four AIA comparisons use English "Medical Card" in titleHook while the page body only uses "kad perubatan".
Consequence: Risks losing rankings for "kalkulator ncd insurans kereta" and "insurans <A> vs <B>" queries, while Google is likely to append "| Insurans.co" (and truncate 58–60 char titles) or rewrite mismatched titles on /car-insurance/ (H1 "Panduan Insurans Kereta Malaysia..."), /guides/ncd-explained/, and /literasi-kewangan/deductible-co-insurance/.
Fix: Keep "Insurans" in the NCD H1 or title, include "Insurans" or "Takaful" where missing in comparison hooks, and align the /car-insurance/ hub H1 with its new roadtax/39-model title.

4. Minor — "Anggaran insurance price & roadtax ..." reads clunky/repetitive in Malay
File: src/pages/car-insurance/[model].astro:75-76
What is wrong: Putting "Anggaran insurance price & roadtax <Model> <CC>: insurans RM... + roadtax RM..." mixes English "insurance price" into Malay syntax and repeats "insurans" three words later.
Consequence: Reads as keyword insertion rather than natural Malaysian BM/Manglish.
Fix: Reword to "Anggaran harga insurans & roadtax <Model> <CC> (insurance price): insurans RM... + roadtax RM..." or "Insurance price & roadtax <Model> <CC> (anggaran): ...".

5. Minor — Sen rounding not noted in inline lead/description equations
File: src/pages/car-insurance/[model].astro:50-52,75-76,136-138
What is wrong: Roadtax shows sen (e.g. RM376.50, RM793.60) while total rounds via Math.round(). On 6 models (civic, c-class, triton, tucson, sportage), inline equations read e.g. "2,340 + 376.50 = 2,717" without noting rounding above the fold.
Fix: Acceptable since #kos-tahunan explains rounding; optionally replace "=" with "≈" in the lead/description.

6. Nit — NCD table rows lack scope="row"; leftover descriptionOverride in car-models.json
File: src/pages/tools/ncd-calculator/index.astro:96-131; src/data/car-models.json:6731
What is wrong: First-column cells in the moved NCD table use <td> instead of <th scope="row">; Honda Jazz still has an unused descriptionOverride field.

Suggested rewordings
- /tools/ncd-calculator/ title (56 chars): "Jadual NCD Kereta 2026 (0–55%) & Kalkulator Insurans NCD"
- /car-insurance/toyota-corolla-cross/ title (56 chars): "Insurans & Roadtax Corolla Cross: Anggaran RM1,699–2,699"
- /car-insurance/mercedes-c-class/ title (55 chars): "Insurans & Roadtax Mercedes C-Class: Anggaran RM2,620–5,740" (59 chars)
- /car-insurance/honda-jazz/ title (58 chars): "Insurans & Roadtax Honda Jazz/City HB: Anggaran RM840–1,620" (59 chars)
- Model description template: "Insurance price & roadtax <Model> <CC> (anggaran Semenanjung): insurans RM... + roadtax RM... = RM... setahun (NCD 55%)."

Verified by running
- `bun install --frozen-lockfile`, `bun run check` (0 errors; 47 pre-existing warnings), `bun run build` (180 pages, 183 HTML files including 3 redirect stubs, 179 URLs in dist/sitemap-0.xml).
- Recomputed all 39 models' roadtax via calcRoadtax(), yearly NCD 55% totals, engine sizes, <title>/og:title/twitter:title/JSON-LD headline/H1/lead/#kos-tahunan alignment, character lengths (all 60 changed pages <=60 title, <=155 description), duplicates (0), siteSuffix side effects (0 unintended pages), and all 15 comparison claims against comparisons.json and companies.json (all factually supported).

Could not verify
- Live SERP behavior/title rewrites, historical baseline sitemap/title diff against live production, and interactive browser execution of the NCD calculator after moving the table (script selectors verified statically).

Summary: Read-only audit of 11 modified files plus docs/seo-titles-2026-11.md; no source files edited or committed. Found 3 major, 2 minor, and 1 nit issue; verified build, typecheck, and all 180 generated pages in dist/.
