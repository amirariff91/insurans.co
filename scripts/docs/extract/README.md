# Price-table extraction (text layer)

Extraction A of the price tables in the six pilot documents of `src/data/documents.json`, read only from
each PDF's text layer (`pdftotext -layout`). A second, independent extraction is transcribed from page
images; `compare.mjs` checks the two cell by cell. Nothing here is published or used by the site.

```sh
bun run docs:extract -- [--src <pdf folder>] [--out <folder>] [doc-id ...]
bun run docs:compare -- <folder A> <folder B> [--report <file.md>]
```

- `--src` defaults to `$INSURANS_DOCS_SRC`, then `~/.cache/insurans-docs/pilot-2026-11-15`.
- `--out` defaults to `$INSURANS_DOCS_OUT`, then `~/.cache/insurans-docs/extract-a`.
- The compare report defaults to `~/.cache/insurans-docs/compare-report.md`. Exit code 1 means at least
  one cell disagrees or is in one folder only.
- PDFs, text dumps and cell files stay in the scratch folders; do not commit them.

Files: `lib.mjs` (text layer, splitting, self-check), one parser per document, `run.mjs` (runs them all,
writes `<id>.json`), `compare.mjs`.

## Cell format

```json
{ "id": "<register id>", "method": "text", "cells": [
  { "table": "...", "page": 6, "row": "...", "col": "outer > inner", "value": "1,539" } ] }
```

`page` is the file page (1-based), not the printed page number. `value` is the cell text as printed
(commas and decimals kept, `NA`, `N/A` and `Not Applicable` kept as words).

## Self-checks

Every table is checked by `checkTable` in `lib.mjs`: the row labels must be exactly the expected list in
order, the column keys exactly the expected set, every row x column present once, no empty value, and
every value either a number (`1,539`, `86.00`) or a printed NA word. Each parser also checks the headings
and notes it relies on (tax notes, printed page numbers, the "age next birthday" note), so a changed
document stops the run instead of producing quietly wrong cells.

## General naming rules

- Labels are copied as printed, including case (`plan 2`, `TRAVEL SHIELD`) and footnote marks on labels
  (`56*`, `Area 4*`, `5 or more travellers¹`). English version only where the document has two languages.
- Column keys run outermost to innermost, joined by ` > `.
- Captions that only state the unit (`Premium (RM)`, `(RM)` under each header, `Sum Insured (RM)`) are
  left out of column keys. The comparison also drops `(RM)` when it normalises keys.
- "NEW" badges under MSIG column headers are left out (they are labels on a plan, not a column).
- Where a geographic area groups rows, the area goes first in `col` (`Area 1 > ...`).
- A label wrapped over two or three lines is joined with single spaces
  (`Each additional week or part`, `each additional week, up to 26 weeks`, `Insured Only`).

## Per document

### Tune Protect PA Shield (`tune-protect-pa-shield-brochure-072025`), file page 6

| table | rows | columns |
|---|---|---|
| `annual premium without weekly benefits` | `Class 1 & Class 2`, `Class 3` | `Plan 1`, `plan 2`, `Plan 3`, `Plan 4`, `Plan 5` |
| `annual premium with weekly benefits` | same | same |

The "Occupation" line above the rows is a group caption and is not part of the row label. `N/A` cells
(Class 3, Plans 4 and 5) are kept. 20 cells. Figures exclude 8% service tax and RM10 stamp duty (note
on the page). Benefit tables on the same page are not extracted.

### Allianz Travel Easy (`allianz-travel-easy-brochure-en`), file page 1

| table | rows | columns |
|---|---|---|
| `premium adults and children` | `1 - 5 days` ... `23 - 31 days`, `Each additional week or part`, `Annual Plan` | `Domestic`, `Overseas > Asia`, `Overseas > Worldwide` |
| `premium senior citizens` | same without `Annual Plan` (none printed) | same |
| `premium high altitude mountaineering` | `18 - 40 years old`, `41 - 60 years old` | `Asia/Worldwide (per trip)` |
| `premium discount multiple travellers and children` | `5 or more travellers¹`, `Children²` | `Discount (%)` |

The Domestic "Each additional week or part" cell is printed `Not Applicable` over two lines. The two
worked "Scenario" tables (premium before and after discount) are examples, not rates, and are left out.
43 cells.

### Etiqa OneMedical (`etiqa-onemedical-premium-table-jun2026`, `etiqa-onemedical-premium-table-until-may2026`), file page 1

| table | rows | columns |
|---|---|---|
| `annual premium no deductible` | `1–5`, `6 – 10`, ... `51 – 55`, `56*` ... `84*` (40 rows) | `Plan 1`, `Plan 2`, `Plan 3` |
| `annual premium RM1,000 deductible` | same | same |

The rows are age next birthday (header "Age Next Birthday (ANB)"); the first label is printed `1–5`
without spaces, the others with spaced en dashes. `*` = "Applicable for renewal only". Male and female
share one table (title says "(Male & Female)"). File page 2 has only the notes. 240 cells per file.

### Kaotim MediKad (`kaotim-medikad-pds-en-29072026`), file pages 8 to 11 (printed "Appendix of PDS, Page 5 to 8 of 8")

| table | file page | what it is |
|---|---|---|
| `annual contribution MediKad` | 8 | the plan, yearly |
| `monthly contribution MediKad` | 9 | the plan, monthly |
| `annual contribution MediBooster` | 10 | the top-up, yearly |
| `monthly contribution MediBooster` | 11 | the top-up, monthly |

Rows: `6 - 10`, `11 - 15`, ... `56 - 59`, then `60` ... `84` (36 rows; age next birthday). Columns:
`MALE > Standard`, `MALE > Pro`, `MALE > Max`, `FEMALE > Standard`, `FEMALE > Pro`, `FEMALE > Max`.
864 cells. Every monthly figure is the annual figure times 0.092 (checked across all 432 pairs), which
supports the reading of both.

### Zurich Z-Travel International (`zurich-z-travel-international-premium-20250701`), file pages 1 and 2 (English)

| table | file page |
|---|---|
| `premium without Section G Covid-19 benefits` | 1 |
| `additional premium Section G Covid-19 benefits` | 2 (optional add-on, paid on top of page 1) |

Rows: `1 - 5 days`, `6 - 10 days`, `11 - 15 days`, `16 - 20 days`,
`each additional week, up to 26 weeks`, `Annual Trip`. Columns: `Area N > <Plan> > <type>` for
`Area 1`..`Area 3`, `Silver Plan`, `Gold Plan`, `Diamond Plan` and `Individual`, `Individual & Spouse`,
`Family`, `Senior`. On the `Annual Trip` row one merged `NA` spans Individual & Spouse and Family in each
plan; it is written as `NA` in both columns. 216 cells per table.

### MSIG Travel SafeGuard (`msig-travel-safeguard-brochure`), English file pages 12 to 16, 18, 19 (printed 11 to 15, 17, 18)

| table | file page | rows | columns |
|---|---|---|---|
| `single trip insured only` | 12 | `1 - 5 days`, `6 - 10 days`, `11 - 18 days`, `19 - 31 days`, `Each additional week` | `Area N > BELOW 65 YEARS OLD > TRAVEL SHIELD`/`TRAVEL MAX`, `Area N > 65 - 80 YEARS OLD > TRAVEL SHIELD`/`TRAVEL MAX`/`GOLDEN JOY`, N = `Area 1`, `Area 2`, `Area 3`, `Area 4*` |
| `single trip insured & spouse` | 13 | same | same |
| `single trip family` | 14 | same | `Area N > BELOW 65 YEARS OLD > TRAVEL SHIELD`/`TRAVEL MAX` |
| `annual cover` | 15 | `Area 1`, `Area 2`, `Area 3` | the five plan columns without area |
| `alternative transport top-up single trip` | 16 (add-on) | `Insured Only`, `Insured & Spouse`, `Family` | `AREA 1`/`AREA 2 & 3`/`AREA 4` `> Plan 1..3` |
| `alternative transport top-up annual cover` | 16 (add-on) | `Insured Only` | `AREA 1`/`AREA 2 & 3` `> Plan 1..3` |
| `cruise benefit per cruise trip` | 18 (add-on) | `Insured Only`, `Insured & Spouse`, `Family` | `Area 1..3 > PLAN 1`/`PLAN 2` |
| `cruise benefit per cruise trip annual cover` | 18 (add-on) | `Insured Only` | same |
| `golf benefit single trip` | 19 (add-on; the benefit list is on page 18) | the five durations | `Area 1-3`/`Area 4*` `> BELOW 65 YEARS OLD > INSURED ONLY`/`INSURED & SPOUSE`/`FAMILY`, `> 65 - 80 YEARS OLD > INSURED ONLY`/`INSURED & SPOUSE` |
| `golf benefit annual cover` | 19 (add-on) | `Insured Only` | `BELOW 65 YEARS OLD`, `65 - 80 YEARS OLD` |

364 cells. The age-band spans (which plan columns sit under "BELOW 65" and "65 - 80", and that golf
`FAMILY` sits under "BELOW 65") are read from text positions, not from ruled cells; see the hand-back
for the risk. Area 4 and all annual-cover figures include 8% service tax; Areas 1 to 3 single-trip
figures do not. RM10 stamp duty is extra on all of them.
