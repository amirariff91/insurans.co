## 1. Revised provenance placement and exact copy

**The card carries one editorial qualifier. The complete EditorialStamp follows immediately outside the card, before specifications, prose or another CTA.** This applies to both homepage and model cards.

The stamp remains in normal document flow. Do not deliberately push it below the fold, collapse it, shrink it or insert spacing to conceal missing records.

### Inside both cards — all provenance states

> Anggaran editorial · **Kaedah & sumber →**

“Kaedah & sumber” links to `/about/`. It describes the editorial method; it does **not** imply that model-specific sources have been recorded.

Keep the separate monthly qualification:

> Setara tahunan ÷ 12; bukan pelan ansuran.

### Immediately below the card — recorded state

```text
Pasukan Editorial · Tarikh artikel: {articleDateBM}
Semakan harga: {priceReviewedAtBM}
Sumber harga: {linkedSource1} · {linkedSource2}
```

- Dates use `D MMM YYYY`, formatted for `ms-MY`.
- Source labels link to the actual supporting documents.
- Price-review date requires an attributable editorial record; an article/schema date cannot populate it.
- Sources must support the price estimate. General BNM/PIAM references are not automatically price sources.

### Immediately below the card — not-recorded state

For the existing model template’s article-date record:

```text
Pasukan Editorial · Tarikh artikel: 14 Feb 2026
Semakan harga: belum direkodkan
Sumber harga: belum direkodkan
```

The article date comes from the existing `dateModified` record, **not evidence of a price review** (`src/pages/car-insurance/[model].astro:43`).

When the article date itself is absent—including a homepage example without an attributable article-date record—use:

```text
Pasukan Editorial · Tarikh artikel: belum direkodkan
Semakan harga: belum direkodkan
Sumber harga: belum direkodkan
```

Evaluate the three fields independently. Recorded source links remain visible even if the price-review date is absent; a recorded review date does not excuse missing source links.

**Unchanged prohibition:** neither state uses a checkmark or “Disemak” inferred from schema metadata.

---

## 2. Revised AnswerCard `compact` contract

`compact` controls **content**, not merely padding or font size.

| Content | Model page: `compact=false` | Homepage: `compact=true` |
|---|---|---|
| Subject and scope | Model, estimate year, komprehensif | “Contoh · {model}” initially; “Pilihan · {model}” after selection; same scope |
| Annual NCD 55% range | Retained | Retained |
| Annual NCD 0% reference | Retained | Retained |
| Monthly equivalent | Retained; follows selected result | **Retained**, always derived from the displayed 55% range |
| Monthly qualification | Retained | Retained verbatim |
| NCD tier selector | Retained with progressive enhancement | **Omitted** |
| Intermediate-tier simulation | Available after tier selection | **Omitted** |
| Primary internal action | **Kira NCD saya →** | **Semak harga model ini →** |
| Outbound quotation heading, links and disclosure | Retained | **Omitted** |
| Editorial qualifier | “Anggaran editorial · Kaedah & sumber →” | Same |
| Full EditorialStamp | Immediately outside/below card | Immediately outside/below card |
| PriceRangeBar graphic | Omitted from first-fold card; available lower down | Omitted |
| Specifications, roadtax total, full NCD diagram | Outside card, later in page | Omitted from card |

Homepage composition:

1. Model picker.
2. One compact AnswerCard.
3. Full EditorialStamp.
4. Secondary link: **Tak pasti NCD? Kira NCD saya →**

The homepage’s later CtaBand owns quotation exits; they are not hidden inside the compact card.

**DOM invariant:** exactly **one AnswerCard instance per page**, on both homepage and model pages. Responsive CSS repositions that instance. No `lg:hidden`/`hidden lg:block` duplicate cards, duplicate radio groups or detached mobile clones.

On model selection, homepage subject, both annual ranges, monthly range, destination and the immediately following stamp update together. Without JS, the SSR example and model-navigation links remain usable.

---

## 3. Revised ratings and rankings disposition

These classifications **supersede the blanket removal instructions** in the earlier brief, draft `DESIGN.md` and Slice 3.

| Content | Classification | Slice/action | Risk of keeping it |
|---|---|---|---|
| Company `AggregateRating` schema, including hardcoded `ratingCount: 100` | **MUST-DO-IN-SLICE** | **Slice 3:** remove the unsupported aggregate-rating object from emitted company JSON-LD. Preserve the underlying editorial rating data. A genuine aggregate may return only with attributable rating population, count and methodology. | The template emits a factual count of 100 that is not derived from an inspected rating dataset. It can represent an editorial score as an aggregate of submitted ratings. Evidence: `src/pages/companies/[slug].astro:34–39`. |
| Visible stars and numeric `/5` scores, including scores repeated in descriptions/sidebar | **DEFER-PENDING-OWNER-DECISION** | No automatic deletion or rescoring. Owner asks the user whether to retain them as explicitly labelled editorial scores with methodology, or retire them. Do not propagate them into new OG cards or new verdict badges meanwhile. | Stars can be read as customer ratings even when intended as editorial judgement; the inspected display does not explain the basis. Evidence: company template’s header/sidebar and description at `:46`. |
| Ordinal company rankings and “best for this model” ordering | **DEFER-PENDING-OWNER-DECISION** | Preserve existing content pending the decision; do not invent a new sort or criterion. Owner asks whether the order is an intentional editorial ranking or directory order. If intentional, require its criterion; if not, remove ordinal/ranking language while retaining entries. | Array position can acquire the appearance of evaluated rank. The model list is generated by `filter(...).slice(0,5)` and repeated across models. Evidence: `src/pages/car-insurance/[model].astro:15,327–342`; `m1.out:50`. |

**Boundary:** numbered renew instructions and NCD years are not rankings and are unaffected.

**Revised design rule:** do not manufacture or newly promote unsupported ratings/rankings. Existing owner-authored visible scores and order require an explicit content decision; unsupported machine-readable aggregate claims are corrected in Slice 3.

---

