# Document register

`src/data/documents.json` is the back-office record of insurers' official documents: one row per PDF the site relies on. It says which file a fact came from, what the file printed as its date or version when we read it, and whether it holds a price table. It is the base for later work (page citations, checked price tables, "what changed" notes). Nothing on the site renders it yet.

The design is in the expansion plan (`docs/handoffs/expansion-2026-11/document-library.md` in the main checkout).

## Rules

- **Link, never host.** The site states facts and links to the insurer's own copy. Insurers' PDFs are never committed, copied into `public/` or served by the site.
- **PDFs live outside the repository.** Downloads for checking go under `~/.cache/insurans-docs/` (or another folder outside the repo), together with text extracts and watch reports. None of these are committed.
- **A person records the printed version.** `printedVersion` is copied exactly as printed, after reading the first and last pages. Every insurer formats it differently; a file name, a PDF's metadata date or an HTTP header is not a printed version. If nothing is printed, it is `null` and `notes` says what else dates the file.
- **Headers are not a change signal.** Some hosts (Etiqa) send the deployment time as `Last-Modified` for every file. Change is judged by size and SHA-256, and by the product page's list of PDF links.
- **Never edit a row to hide a revision.** When a document is revised, add a new row, set the old row's `status` to `replaced` and point the new row's `supersedes` at it.
- Fetch politely: a normal browser user agent, at most two requests a second to one host.

## Fields

| Field | Meaning |
|---|---|
| `id` | Stable slug for the row; never reused. |
| `line` | Product line, the plan file's name in `src/data/` (`medical-cards`, `travel-insurance`, …). |
| `insurer` | Brand as the site writes it (Etiqa, Zurich, Tune Protect). |
| `entity` | The licensed entity, as the plan data gives it. |
| `plan` | The product the document belongs to. |
| `planSlug` | The plan record's `slug` in `src/data/<line>.json`, where one exists. |
| `type` | `pds`, `brochure`, `wording`, `price-table` or `flyer`. |
| `language` | `en`, `ms`, `en+ms` (both in one file), `zh` or `other`. |
| `url` | The insurer's copy (https). |
| `productPage` | The insurer's page that links the document. |
| `printedVersion` | The date or version exactly as printed, or `null` if none is printed. |
| `printedVersionPage` | `{ file, printed }`: the file page it was read on, and the printed page label where the document has one. |
| `retrieved` | ISO date the file was fetched and measured. |
| `sha256`, `bytes` | Fingerprint and size of the file as fetched. |
| `pages` | Page count from `pdfinfo`. |
| `textLayer` | `true` if `pdftotext` returns text, `false` for a scan. |
| `priceTable` | See below. |
| `priceTablePages` | `{ file: [..], printed: [..] or null }`: file page numbers, and printed labels where they differ. |
| `status` | `live`, `replaced` (a newer row supersedes it), `dead` (no longer loads) or `archived-copy` (only an archive copy is used). |
| `supersedes` | `id` of the older row this one replaces, if any. |
| `notes` | One short plain sentence where something needs saying. |

## What each `priceTable` value means

- `full`: a complete price or contribution list that a reader's own case can be looked up in (by age, plan, area, duration).
- `example`: a single worked illustration ("you must pay RM86 for Area 1"), not a list.
- `template`: a blank form with placeholders such as `RM[your contribution]`.
- `none`: no prices.

A person decides this by reading the pages. Price tables are not extracted here; that is a separate step with its own checks.

## Commands

- `bun run docs:validate` checks required fields, allowed values, unique ids, https URLs, hashes, ISO dates, that `planSlug` exists in its plan file and that `supersedes` points at a row. Exit code 1 on any problem.
- `bun run docs:watch [--out <file.md>]` fetches every `live` row's product page and document, and writes a Markdown report of changed hashes or sizes, documents that no longer load, PDF links on a product page that are not registered, and registered documents no longer linked. The default report path is under `~/.cache/insurans-docs/watch/`; it refuses a path inside the repository. It never downloads into the repo and never edits `documents.json`.
