# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Pemilik kereta renewing roadtax/insurance** — GSC top queries: "harga insurans kereta axia", "harga insurans kereta persona 1.6", "insurance hilux 2.4", "renew insurans kereta". Situation: annual renew window, on MY mobile, wants a credible number fast then a quote path. [READ from brief §GSC]
- **NCD-confused owners deciding claim-vs-pay** — queries: "cara kira ncd", "cara kira ncd kereta". Situation: post-accident or pre-renew, wants savings math + "patut ke claim?" answer. Second traffic engine: `/tools/ncd-calculator/` 17 clicks, pos 11.2. [READ from brief §GSC]
- **Head-to-head shoppers** — queries: "prudential vs aia", "aia vs prudential" (56 impr, pos 10.5); pages `prudential-vs-aia` pos 9.6, `etiqa-vs-zurich` pos 5.6, `allianz-vs-zurich` pos 4.4. Situation: choosing between two named brands, wants verdict + claim line. [READ from brief §GSC]
- [INFERRED] **Takaful-preferring Muslims** — `takaful kereta` 350/mo + site IA (`/takaful/`, takaful badges); need patuh-Syariah framing, not just price.

## Product Purpose

BM-first static guide that answers "berapa patut saya bayar?" for Malaysian motor insurance/takaful with anggaran premium per model, NCD math, and insurer comparisons — written for rakyat biasa, bukan ejen/broker. Success = model pages rank and convert attention into calculator completions and outbound quote clicks, not policy sales (site sells nothing). [READ from brief §Site + owner positioning in header/footer]

## Positioning

The only MY motor guide that pairs **per-model premium ranges (39 models, NCD 0% vs 55%)** with **NCD decision math ("patut ke claim?")** in conversational BM, citing BNM/PIAM, with explicit bukan-ejen independence. Neighbours (Bjak, PolicyStreet) sell quotes; insurans.co earns the pre-quote question. [READ: data shape from brief; aggregator distinction from `index.astro:192-246` + footer]

## Operating Context

- Annual renew ritual: semak NCD (MyEG/ejen) → banding aggregator (Bjak.my/PolicyStreet) → bayar (FPX/kad) → e-cover note → renew roadtax (JPJ/MyEG/Pos). [READ from `index.astro` renew section]
- 80% MY mobile, WhatsApp-share distribution [INFERRED from share behaviour; 80% figure READ from brief]. Post-tarif-liberalisasi 2017 pricing (insurers set own prices). [READ from `index.astro` info-box]
- Discovery via GSC: model pages pos 6–19 and rising (45→20 avg); hubs under-rank (home pos 44.9, /car-insurance/ 56.4). [READ from brief §GSC]

## Capabilities and Constraints

- Static Astro 6.3, Tailwind 3, no backend; 29 page files, ~106 URLs from `src/data/*.json` (39 models, 16 states, 15 comparisons, 12 companies). `@astrojs/preact` installed, unused. Deployed node→nginx:alpine. [READ from brief §Site/Infra]
- Content: guides unique ~900w with PIAM/BNM citations; programmatic sets thin (`negeri` 1-sentence diff, `perbandingan` 3-field JSON, model pages ~18 unique words). Byline anonymous "Pasukan Editorial". [READ from brief §Content]
- No affiliate disclosure yet; outbound CTAs `rel=noopener`, no `sponsored`; zero dataLayer events; GTM-T3LMP78G live, no consent-mode default. [READ from brief §Analytics]
- YMYL: footer disclaimers present ("maklumat am sahaja"); no `author`/`reviewedBy` on Article; `sameAs: []`; hardcoded schema dates; broken `/og-default.png`; soft-404 `/404.html` 200; missing HSTS/CSP. [READ from brief §SEO/EEAT]
- Broken link `/travel-insurance/` from homepage; sitemap/nginx redirect mismatch. [READ from brief]
- Visual system committed: krim ground, black 2px rules, hard offset shadow, Fraunces + Source Sans 3, hijau/emas/krim tokens, 72ch article. No dark mode by design. [READ from code + audit]

## Brand Commitments

- Name: Insurans.co; lockup: serif `insurans` + hijau `.co` (text only, no mark yet). Taglines: "Bukan ejen. Bukan broker." / "Panduan insurans untuk rakyat Malaysia biasa." [READ from `Base.astro` header/footer]
- Voice: conversational BM with EN code-switch ("Nak renew…?", "Simpan PDF tu", "aggregator macam Bjak.my"); tracked-uppercase hijau labels; `→` link suffix. [READ from pages]
- Undecided: [INFERRED] formal vs colloquial ceiling, takaful-specific register, affiliate-disclosure wording — none confirmed.

## Evidence on Hand

- GSC 90d: 174 clicks / 15,648 impr; Axia page 72 clicks pos 6.7. [READ from brief]
- Ahrefs MY: DR 0, 0 keywords/traffic; 330 spam-testimonial ref domains (no equity). Demand: takaful 9500, insurans kereta 6500, renew 1600. [READ from brief]
- Real data assets: `src/data/car-models.json` (premiums, roadtax, add-ons, risk, tips), `companies.json` (ratings, claim lines), live NCD calculator route. [READ from code]
- Absences future work MUST NOT fabricate: OG image, logo mark, author identities, insurer pricing endorsements, testimonials, benchmarks. [READ from brief + code]

## Product Principles

1. **Answer first, explain second** — the number (range + NCD tier) precedes methodology on every template.
2. **NCD is the product** — every price is a pair (0% vs 55%) plus a claim-vs-pay decision, never a point.
3. **Independence is the moat** — disclose quote paths and paid relationships; never present aggregator links as editorial rank.
4. **Enrich the engine, don't prune it** — the 39 model pages are the traffic; edits raise unique value per page, never delete for tidiness. [READ from brief GSC note]
5. **BM conversational, facts cited** — colloquial register, BNM/PIAM sources, dated estimates.

## Accessibility & Inclusion

- Known: mobile-menu button needs `aria-expanded`/`controls`; skip link missing; desktop nav <44px targets. [READ from audit/brief]
- BM-first, low-jargon audience; no product-specific standard confirmed beyond that. [INFERRED]
