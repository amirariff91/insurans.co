# 2. Mobile answer-first layouts

**Target frame: 390 × 844 CSS px**, excluding browser chrome. These are layout specifications, not measured screenshots. No fixed-height clipping: longer model names and larger text may move the editorial stamp into viewport two.

Page gutters: 20px. Content width: 350px. Header: 56px plus its 2px bottom rule. AnswerCard: 16px internal padding.

## Price and provenance bindings

Wireframe symbols are **data bindings, not example prices**:

| Symbol | Binding |
|---|---|
| `A55–B55` | `car.premiumNCD55Min` through `car.premiumNCD55Max` |
| `A0–B0` | `car.premiumNCD0Min` through `car.premiumNCD0Max` |
| `M55–N55` | Those 55% endpoints divided by 12, rounded as the existing FAQ does |
| `D` | Confirmed price-review date; absent until editorial evidence exists |
| `S` | Specific price-source links; never implied BNM/PIAM endorsement |

The allowed template reads establish these field names but not Axia’s literal JSON prices. Do not invent them.

## Model page: viewport one

```text
┌──────────────────────────────────────┐
│ [i-mark] insurans.co       [ Menu ≡ ] │ 56px
├══════════════════════════════════════┤
│ Utama › Insurans Kereta › Axia        │ wrap; no ellipsis
│                                      │
│ Harga insurans                       │ H1 32/36, Fraunces
│ Perodua Axia                         │ year in metadata,
│                                      │ not another H1 line
│ ┌──────────────────────────────────┐ │
│ │ ANGGARAN KOMPREHENSIF · 2026      │ │
│ │ NCD 55%                          │ │
│ │ RM A55–B55 / tahun               │ │ 32/38.4
│ │ ≈ RM M55–N55 / bulan             │ │
│ │ Setara tahunan ÷ 12;             │ │
│ │ bukan pelan ansuran.             │ │
│ │ ──────────────────────────────── │ │
│ │ Tanpa NCD (0%)     RM A0–B0      │ │
│ │ Julat rujukan, bukan quotation.  │ │
│ │                                  │ │
│ │ Pilih NCD — contoh bermula 55%   │ │ fieldset/legend
│ │ [ 0%  ] [ 25% ] [ 30%    ]       │ │
│ │ [38.33%] [45% ] [● 55%   ]       │ │ 44px targets
│ │                                  │ │
│ │ [       Kira NCD saya →        ] │ │ 48px; green
│ │                                  │ │
│ │ Dapatkan quotation · Laman luar │ │
│ │ [ Bjak.my ↗ ] [ PolicyStreet ↗ ] │ │ 44px; outlined
│ │ Quotation/pembelian dibuat      │ │
│ │ di laman mereka, bukan di sini. │ │
│ └──────────────────────────────────┘ │ hard shadow
│                                      │
│ Pasukan Editorial · Tarikh artikel:   │
│ 14 Feb 2026*                          │
│ Semakan harga: belum direkodkan       │
│ Sumber harga: belum direkodkan        │
│ Metodologi & sumber →                │ /about/
└──────────────────────────────────────┘
```

`*` The existing model schema contains `2026-02-14`, but that is **not evidence of a price review** (`src/pages/car-insurance/[model].astro:43`). The honest missing-provenance presentation above is the shipping state until records are supplied. Once verified, replace the two missing lines with:

> Semakan harga: **D** · Sumber harga: **S**

Do not show “Disemak” with a checkmark merely because a schema date exists.

## Model page: viewport two

```text
┌──────────────────────────────────────┐
│ [i-mark] insurans.co       [ Menu ≡ ] │ sticky header
├══════════════════════════════════════┤
│ [Editorial stamp continues if needed]│
│                                      │
│ Apa yang termasuk?                   │ H2 30/36
│ Komprehensif; nilai pasaran           │
│ {marketValueRange}.                  │
│ Roadtax dan add-ons ditunjuk asing.  │
│                                      │
│ Kos tahunan anggaran                 │
│ Insurans · NCD 55%      RM A55–B55   │
│ Roadtax                 RM R0–R1    │
│ ════════════════════════════════════ │
│ Jumlah                 RM T0–T1     │
│ {roadtaxNote}; tidak termasuk add-ons│
│                                      │
│ ▸ Butiran model & andaian harga      │ native details
│   Enjin / varian / tahun / nilai     │
│                                      │
│ NCD: dari 0% hingga 55%               │
│ Tahun tanpa claim   NCD   Baki asas  │
│ 0 ─────────────────  0%      100%   │
│ 1 ────────────────  25%       75%   │
│ 2 ───────────────   30%       70%   │
│ 3 ─────────────     38.33%    61.67% │
│ 4 ───────────       45%       55%   │
│ 5+ ─────────        55%       45%   │
│                                      │
│ Nota: sesetengah tuntutan boleh      │
│ menjejaskan NCD. Semak jenis         │
│ tuntutan dan syarat polisi.          │
│ Panduan NCD →                        │
└──────────────────────────────────────┘
```

Then, in order:

1. Model-specific add-ons, with coverage exclusions made explicit.
2. Risk profile: theft, repair cost, claim frequency, source/limitations note.
3. Model-specific savings tips.
4. Neutral directory/comparison links—not the same “best five” ranking on every model.
5. Model FAQs.
6. Related models with explicit title links and labelled price pairs.
7. Closing CtaBand.
8. SiteFooter.

### NCD interaction contract

- Initial state is **an example at 55%**, never a detected personal NCD.
- Selecting a tier changes the selected-price output, monthly equivalent and the NCD value passed to the calculator.
- Keep the supplied **0% and 55% reference pair visible**; for an intermediate tier, add a clearly labelled “Simulasi NCD {tier}” result.
- Intermediate simulations use both 0% endpoints × `(1 − tier/100)`, rounding only for display. Use **38.33%**, not 38%. The existing template already uses 38.33% (`[model].astro:28`).
- Supplied 55% reference values are not silently replaced by `0% × 0.45`. The data may have different estimation/rounding assumptions; their consistency was **not verified** in this read scope.
- Explain intermediate outputs as simplified calculations on the base estimate; do not imply taxes, add-ons or every premium component receive NCD.
- No loading animation: calculation is local. One polite, atomic live announcement states tier + annual result.
- No automatic scrolling, persistence, inferred personalisation or price animation.
- Without JS, retain the reference pair, monthly answer, full static ladder and working calculator link. Do not leave inert radio controls looking functional.
- Calculator handoff: extend the existing calculator to accept `model=<slug>&ncd=<tier>`. Show a labelled model-reference range; ask for the actual pre-NCD premium. **Do not prefill a fictitious quote using the midpoint.**

## Homepage: first viewport

```text
┌──────────────────────────────────────┐
│ [i-mark] insurans.co       [ Menu ≡ ] │
├══════════════════════════════════════┤
│ PANDUAN INSURANS MALAYSIA             │
│                                      │
│ Berapa insurans                      │ H1 32/36
│ kereta anda?                         │
│ Bukan ejen. Bukan broker.             │
│                                      │
│ Model kereta                         │ visible label
│ [ Perodua Axia                    ▾ ]│ native select, 48px
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ CONTOH · PERODUA AXIA             │ │
│ │ NCD 55%                          │ │
│ │ RM A55–B55 / tahun               │ │
│ │ Tanpa NCD: RM A0–B0              │ │
│ │ ≈ RM M55–N55 / bulan             │ │
│ │ Setara tahunan ÷ 12; bukan       │ │
│ │ pelan ansuran. Anggaran sahaja. │ │
│ │                                  │ │
│ │ [    Semak harga model ini →    ] │ │ primary internal
│ └──────────────────────────────────┘ │
│                                      │
│ Tak pasti NCD? Kira NCD saya →       │ secondary link, 44px
│ Semakan harga: belum direkodkan       │
│ Metodologi & sumber →                │
│                                      │
│ Pilih antara dua syarikat?            │ next section begins
└──────────────────────────────────────┘
```

- Axia is the explicitly labelled default example because it leads observed model traffic—not because this review establishes it as Malaysia’s most popular car (`brief.md:32`).
- Select options: manufacturer groups, model names alphabetically within each group.
- Selection updates model name, both ranges, monthly equivalent, provenance and destination together.
- Embed only required model-picker fields, not the full risk/tips data.
- Progressive enhancement: SSR answer plus real model links; reveal the selector only when its handler is ready. Without JS, show Axia/Myvi/Saga/Vios links and “Semua model”.
- No external quotation button in the first homepage viewport. It appears in a later, labelled CtaBand after the model/tool choice.
- Lower-page order: comparisons → model directory → NCD explanation → neutral company directory → renew steps/quotation exits → FAQs → other existing categories.

