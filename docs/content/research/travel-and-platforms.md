Research complete. No repo files modified (read-only; only `src/pages/car-insurance/[model].astro` and `src/data/companies.json` were read, to match house style: BM-first copy, `slug/name/fullName/type/takaful/digitalPlatform/products/keyFact/sources` + date-stamped verification fields, kebab-case slugs, `products` vocabulary `car/motorcycle/health/life/travel/home/personal-accident`).

# A) TRAVEL INSURANCE — per-plan facts

Verified 2026-09-12. Null = not publicly verifiable; do not invent. "add-on" = COVID covered only as a paid/optional extension.

| Insurer | Plan | Trip type | Medical limit | COVID | Cancellation | Region tiers | Verified how |
|---|---|---|---|---|---|---|---|
| Etiqa | TripCare 360 Insurance / Takaful | single | null (quote-gated, no public table) | add-on | yes (baggage/cancellation section) | domestik + antarabangsa ("any country") | Page read directly |
| Zurich | Z-Travel Insurance (International) / Lite | single + annual | Lite Basic RM100k · VIP RM300k · Silver RM300k · Gold RM500k · Diamond unlimited; Evacuation RM1m (Lite) / unlimited | add-on (Covid-19 Optional Add-On) | yes — **not included in Lite**; RM20k–RM30k on full plans | Area 1 (Asia/Oceania list), Area 2 (Worldwide excl. Canada/Mongolia/Nepal/Tibet/USA), Area 3 (Worldwide) | Page read directly, benefit table transcribed |
| Zurich (Takaful) | Zurich Travel Takaful (Shopee channel) | single + annual (international) | null | yes (illness incl. COVID, physician-treated) | yes | Domestik (≥50km dari rumah), SEA, Asia, Asia/Eropah/Afrika/Amerika Selatan/Oceania, Worldwide | Shopee Help Centre read directly |
| Allianz | Allianz Travel Insurance (Shopee channel) | single | null — allianz.com.my returned HTTP 403; limits unverified | yes, **fully-vaccinated travellers only** | yes (deposit/trip cancellation + curtailment) | Domestik, Asia (list incl. Australia/Japan), Worldwide excl. sanctioned/war countries | Shopee Help Centre read directly |
| Tune Protect | AirAsia Travel Protection (Lite / Plus) | single + annual | [INFERENCE from source page] ~RM100,000 COVID medical on selected routes | Plus: yes · Lite: no | yes (Plus, if hospitalized due to COVID) | null | Search summaries of tuneprotect.com + airasia support pages; **re-verify before publish** |
| Generali | SmartTraveller Enhanced | single + annual | "up to RM300,000+" (third-party: wise.com; PDS exists on partner CDN) | add-on ("Pandemic Cover – Overseas Trips only" rider) | yes | null | Search + ICBC-hosted PDS PDFs; generali.com.my pages exist but not directly read |
| MSIG | Travel SafeGuard / TravelRight Plus | single | null | null (not confirmed) | yes | null | Policy-wording PDF + insurnet via search |

### Draft JSON rows (travel)

```json
[
  {
    "slug": "etiqa-tripcare-360",
    "insurer": "Etiqa",
    "planName": "TripCare 360 Insurance / Takaful",
    "tripType": "single",
    "medicalCoverLimit": null,
    "covidCovered": "add-on",
    "tripCancellation": "yes",
    "regionTiers": ["Malaysia (domestik)", "Antarabangsa"],
    "standoutFeature": "Rebat 25% beli online; auto-payout penerbangan lewat 2 jam+; satu harga untuk 2 dewasa + 10 kanak-kanak; cashless hospital admission overseas (Guarantee Letter)",
    "sources": ["https://www.etiqa.com.my/travel/tripcare-360-insurance", "https://edp.etiqa.com/edp/tripcare360/my/insurance/quotation"],
    "asAt": "2026-09-12"
  },
  {
    "slug": "zurich-z-travel-international",
    "insurer": "Zurich General Insurance Malaysia Berhad",
    "planName": "Z-Travel Insurance (International) / Z-Travel Lite",
    "tripType": "single|annual",
    "medicalCoverLimit": "Lite Basic RM100,000; VIP RM300,000; Silver RM300,000; Gold RM500,000; Diamond unlimited",
    "covidCovered": "add-on",
    "tripCancellation": "yes (tiada dalam Lite)",
    "regionTiers": ["Area 1: Asia & Oceania terpilih", "Area 2: Worldwide excl. Kanada/Mongolia/Nepal/Tibet/USA", "Area 3: Worldwide"],
    "standoutFeature": "Lite dijual online sahaja; perlindungan sukan amatur termasuk scuba, winter sports, bungee jump; evakuasi perubatan unlimited pada plan penuh",
    "sources": ["https://www.zurich.com.my/insurance-products/protection/for-my-travel/z-travel-insurance-international", "https://www.zurich.com.my/-/media-assets/project/zurich-headless/malaysia/docs/insurance-products/policy-wordings/zgimb-z-travel-insurance-international-pw.pdf"],
    "asAt": "2026-09-12"
  },
  {
    "slug": "zurich-travel-takaful",
    "insurer": "Zurich General Takaful Malaysia Berhad",
    "planName": "Zurich Travel Takaful",
    "tripType": "single|annual",
    "medicalCoverLimit": null,
    "covidCovered": "yes",
    "tripCancellation": "yes",
    "regionTiers": ["Domestik (≥50km dari rumah)", "Southeast Asia", "Asia", "Asia/Eropah/Afrika/Amerika Selatan/Oceania", "Worldwide"],
    "standoutFeature": "Takaful; pembatalan polisi tahunan dikira prorata 40%–100% ikut tempoh berkuat kuasa",
    "sources": ["https://help.shopee.com.my/portal/4/article/145752", "https://www.zurich.com.my/takaful-products/protection/for-my-travel/zurich-travel-takaful"],
    "asAt": "2026-09-12"
  },
  {
    "slug": "allianz-travel-insurance",
    "insurer": "Allianz General Insurance Company (Malaysia) Berhad",
    "planName": "Allianz Travel Insurance (Shopee channel)",
    "tripType": "single",
    "medicalCoverLimit": null,
    "covidCovered": "yes (pelancong divaksin penuh sahaja)",
    "tripCancellation": "yes",
    "regionTiers": ["Domestik", "Asia", "Worldwide (excl. Israel, Iran, Syria, Belarus, Cuba, DRC, Korea Utara, Somalia, Sudan, South Sudan, Zimbabwe & negara dikenakan sekatan)"],
    "standoutFeature": "Coverage bermula dari rumah/tempat kerja; tamat 24 jam selepas ketibaan balik Malaysia",
    "sources": ["https://help.shopee.com.my/portal/4/article/145752"],
    "asAt": "2026-09-12"
  },
  {
    "slug": "tune-protect-travel-airasia",
    "insurer": "Tune Protect Malaysia",
    "planName": "AirAsia Travel Protection (Lite / Plus)",
    "tripType": "single|annual",
    "medicalCoverLimit": "RM100,000 (COVID medical, laluan terpilih — perlu disemak semula)",
    "covidCovered": "Plus: yes · Lite: no",
    "tripCancellation": "yes (Plus)",
    "regionTiers": null,
    "standoutFeature": "Dijual inline semasa checkout tiket AirAsia (AirAsia MOVE app/web)",
    "sources": ["https://www.tuneprotect.com/airasia/covidtravelpass/my/", "https://support.airasia.com/s/article/AirAsia-Travel-Insurance-Travel-Comprehensive-Plan"],
    "asAt": "2026-09-12"
  },
  {
    "slug": "generali-smarttraveller-enhanced",
    "insurer": "Generali Insurance Malaysia Berhad",
    "planName": "SmartTraveller Enhanced",
    "tripType": "single|annual",
    "medicalCoverLimit": "sehingga RM300,000+ (sumber pihak ketiga; sahkan PDS)",
    "covidCovered": "add-on (Pandemic Cover, perjalanan luar negara sahaja)",
    "tripCancellation": "yes",
    "regionTiers": null,
    "standoutFeature": "Emergency medical evacuation dilaporkan unlimited bergantung tier; ada varian domestik (SmartTraveller Easy)",
    "sources": ["https://www.generali.com.my/commerce/travel-insurance/summary-of-benefits", "https://www.affinalways.com/smarttraveller-enhanced-single-trip-plan", "https://wise.com/my/blog/generali-travel-insurance"],
    "asAt": "2026-09-12"
  },
  {
    "slug": "msig-travel-safeguard",
    "insurer": "MSIG Insurance (Malaysia) Bhd",
    "planName": "Travel SafeGuard / TravelRight Plus",
    "tripType": "single",
    "medicalCoverLimit": null,
    "covidCovered": null,
    "tripCancellation": "yes",
    "regionTiers": null,
    "standoutFeature": "Evakuasi & repatriasi WAJIB diselaraskan melalui hotline 24-jam (+603-2166 3080); polisi tidak membayar evakuasi dari Malaysia ke destinasi asing",
    "sources": ["https://takeiteasy.msig.com.my/spa-assets/travelAddOnResource/Travel%20SafeGuard%20-%20Policy%20Wording_Single_No%20SD@16.06.26.pdf", "https://www.insurnet.com.my/home/travel-insurance-TRP.php?default=Default"],
    "asAt": "2026-09-12"
  }
]
```

## Travel — what to compare (cited)

- **Evakuasi vs repatriasi ialah dua faedah berlainan** — evakuasi ke hospital terdekat yang mampu rawan; repatriasi balik Malaysia selepas stabil; repatriasi jenazah berasingan. Angka besar "RM1 million" selalunya gabungan — semak sub-cap. Chubb Travel Insurance Malaysia explainer; Allianz page (via RinggitPlus summary).
- **Pre-approval wajib**: hampir semua polisi MY perlukan evakuasi diselaraskan oleh hotline bantuan 24-jam insurer; susun sendiri (contoh sewa helikopter) = claim ditolak. MSIG policy wording mengecualikan evakuasi *dari* Malaysia; PIAM nasihat simpan nombor hotline fizikal + digital — [piam.org.my/insurance-101/individual/travel](https://piam.org.my/insurance-101/individual/travel/), MSIG PW PDF above.
- **Schengen visa = syarat bukan pilihan**: minimum **€30,000 (~RM150k)** perubatan + repatriasi, sah di **semua** negeri Schengen, cover sepanjang tempoh visa; sijil perlu ditunjuk dalam permohonan visa. — [schengen.europ-assistance.com](https://schengen.europ-assistance.com/en/what-insurance-do-you-need-schengen-visa-0), [axa-schengen.com](https://www.axa-schengen.com/en/travel-insurance/benefits/30000-euro-coverage), [oravisa.com](https://oravisa.com/blog/schengen-visa-travel-insurance-requirements/)
- **COVID adalah "add-on vs standard" — berbeza ikut plan**: Zurich Z-Travel & Etiqa TripCare = optional add-on; Generali = "Pandemic Cover" rider (overseas only); Allianz (Shopee) = built-in **tapi hanya untuk fully-vaccinated**; Tune Protect Lite tiada COVID. Non-obvious: Allianz COVID claim perlukan diagnosis disahkan oleh doktor + laporan perubatan/lab — [Shopee Help 145752](https://help.shopee.com.my/portal/4/article/145752).
- **Ambang delay berbeza tajam**: Zurich bayar delay min. **6 jam**; Etiqa auto-payout mulai **2 jam** (dan tiada bayaran jika delay diumumkan ≥12 jam awal) — bandingkan threshold, bukan hanya jumlah. — Zurich Z-Travel page; Etiqa TripCare page.
- **Domestik pun ada ambang jarak**: Zurich Travel Takaful domestik hanya aktif jika perjalanan **≥50 km dari rumah** (tidak termasuk pergi-balik kerja). — Shopee Help 145752.
- **Pembatalan polisi tahunan bukan refund penuh**: Zurich takaful annual — in-force ≤2 bulan = caj 40% kontribusi, >6 bulan = 100%. — Shopee Help 145752.
- **Eksklusif kurang diketahui**: TripCare 360 mengecualikan perjalanan **Haji**; Zurich mengecualikan zon peperangan dan menampung sukan amatur (scuba/winter/bungee) dalam plan penuh. — Etiqa & Zurich product pages.

# B) PLATFORMS / COMPETITORS

## FWD Malaysia (fwd.com.my)
- **What it is**: direct digital **insurer + takaful operator** — FWD Insurance Berhad (conventional) and FWD Takaful Berhad (family takaful). Agentless "Buy Online" funnel, e-policy via email.
- **What you can buy online**: life/term (i-FlexCover), critical illness (i-Protect), medical card (i-Med), term takaful incl. **FWD i-Lindung** (payable via EPF) — fwd.com.my/buy-online (title/meta verified; page body is JS-gated) + [imoney.my/articles/fwd-takaful-fwd-protect-direct-takaful-online](https://www.imoney.my/articles/fwd-takaful-fwd-protect-direct-takaful-online) (read 2026-09-12).
- **Model**: direct insurer (not aggregator). **No standalone retail travel insurance/takaful found on fwd.com.my** — two independent checks found none; FWDAssist is only an assistance program for medical policyholders. Flag: FWD body page was JS-rendered (only meta verified) — confirm product list before publishing.
- **Consumer caveat**: online lineup is narrower than agent channel; travel vertical should treat FWD as "tiada produk travel berasingan (disemak 2026-09-12)".

Suggested row:
```json
{
  "slug": "fwd",
  "name": "FWD",
  "type": "conventional",
  "digitalPlatform": "FWD Buy Online (fwd.com.my)",
  "products": ["life", "critical-illness", "health"],
  "keyFact": "Insurans & takaful beli terus online tanpa ejen (term/CI/medical + FWD i-Lindung via EPF); tiada produk travel berasingan ditemui pada fwd.com.my (disemak 12 Sep 2026).",
  "sources": ["https://www.fwd.com.my/buy-online/", "https://www.imoney.my/articles/fwd-takaful-fwd-protect-direct-takaful-online"]
}
```

## Shopee / ShopeePay Insurance
- **What it is**: in-app insurance & takaful **marketplace** inside Shopee/ShopeePay, run via SeaMoney's agency entity (MoneeInsure Agency Malaysia); Shopee is not the insurer.
- **What you can buy**: Allianz Travel Insurance (conventional) + Zurich Travel Takaful (single & annual international) — verified in Shopee Help Centre article 145752; car/motor takaful (Takaful IKHLAS, Zurich, Allianz), personal accident, Zurich Wallet Protection (e-wallet fraud) — [shopeepay.com.my/en/insurance](https://shopeepay.com.my/en/insurance), [fintechnews.my/47657](https://fintechnews.my/47657/islamic-fintech/shopee-takaful-motor-insurance/), [zurich.com.my news 2025-05-14](https://www.zurich.com.my/about-zurich/zurich-in-the-news/2025/2025-05-14).
- **Standout**: SPayLater installments 3–12 months, structured shariah-compliant for takaful ([ringgitplus.com](https://ringgitplus.com/en/blog/insurance/shopeepay-and-zurich-launch-shariah-compliant-travel-takaful-for-malaysian-travellers.html)); e-policy in "My Policies"; group-booking discounts.
- **Caveats**: COVID cover on Allianz plan restricted to fully-vaccinated; annual-takaful cancellation penalty table 40–100%. Marketing price points "RM3/day domestik, RM15.99/day antarabangsa" come from the JS-only landing page ([shopee.com.my/m/travel-insurance](https://shopee.com.my/m/travel-insurance)) which returned only a loading spinner on direct read — **unverified, check in-app before quoting**.

```json
{
  "slug": "shopee",
  "name": "Shopee Insurance",
  "type": "marketplace",
  "digitalPlatform": "Shopee & ShopeePay app (Insurance tab)",
  "products": ["travel", "car", "motorcycle", "personal-accident"],
  "keyFact": "Marketplace dalam Shopee/ShopeePay: travel insurance Allianz + Zurich Travel Takaful (single & annual), motor takaful Takaful IKHLAS, PA & wallet protection; bayar boleh ansur SPayLater 3–12 bulan. Shopee bukan penginsurans — hanya ejen digital.",
  "sources": ["https://help.shopee.com.my/portal/4/article/145752", "https://shopeepay.com.my/en/insurance", "https://fintechnews.my/47657/islamic-fintech/shopee-takaful-motor-insurance/", "https://www.zurich.com.my/about-zurich/zurich-in-the-news/2025/2025-05-14"]
}
```

## Bjak.my
- **What it is**: online **aggregator** for motor insurance/takaful comparison + purchase, NCD auto-pulled, add-ons (windscreen, special perils), installment options; travel vertical at bjak.my/en/travel comparing Etiqa, Zurich, Allianz, Tokio Marine, MSIG, RHB, Tune Protect, Berjaya Sompo ([bjak.my/en/travel](https://bjak.my/en/travel) — via search, page not directly read).
- **Standout**: free optional road tax renewal service bundled at checkout (BNM-approved Financial Adviser & Islamic Financial Adviser).
- **Consumer caveat (load-bearing)**: JPJ publicly stated (6 May 2024) Bjak was **not authorised** for road-tax renewal, with no MySikap integration and complaints about validity-date updates; Bjak responded it's a free private initiative, primary focus auto insurance ([fintechnews.my/44093](https://fintechnews.my/44093/various/bjak-not-approved-for-road-tax-renewals-seeks-to-address-jpj-concerns/) — read directly 2026-09-12). Current 2026 status of that dispute unresolved in sources; e-LKM via MyJPJ is the official free channel.

```json
{
  "slug": "bjak",
  "name": "Bjak",
  "type": "aggregator",
  "digitalPlatform": "bjak.my",
  "products": ["car", "motorcycle", "travel", "roadtax"],
  "keyFact": "Aggregator terbesar untuk motor: compare 10+ insurer, NCD auto-check, ansuran premium, roadtax 'percuma' sebagai servis optional. JPJ menyatakan (Mei 2024) Bjak tiada kebenaran rasmi untuk renew roadtax & tiada integrasi MySikap — rujuk MyJPJ untuk saluran rasmi.",
  "sources": ["https://bjak.my/en", "https://bjak.my/en/travel", "https://fintechnews.my/44093/various/bjak-not-approved-for-road-tax-renewals-seeks-to-address-jpj-concerns/"]
}
```

## PolicyStreet
- **What it is**: BNM-approved digital aggregator + corporate financial adviser & insurtech (Series C backed by BlueOrchard, per [fintechnews.my/59602](https://fintechnews.my/59602/insurtech-malaysia/policystreet-series-c-blueorchard/) — read via search).
- **What you can buy/renew**: car insurance & takaful comparison (10+ motor insurers, conventional + takaful, comprehensive/TPFT/TP), road tax renewal in same transaction, Drive+ membership perks (roadtax rebates, waived fees, installments, cashback), BNPL via Atome; PA & gig-worker cover; SME/employee benefits; embedded partnerships (Carsome CARE loan-protection).
- **Standout**: strongest loyalty/rebate engine of the local aggregators (Drive+).
- **Caveats**: "40+ providers" figure is secondary-source only; **travel insurance availability on policystreet.com.my not directly verified** — verify before listing travel products for PolicyStreet.

```json
{
  "slug": "policystreet",
  "name": "PolicyStreet",
  "type": "aggregator",
  "digitalPlatform": "policystreet.com.my",
  "products": ["car", "motorcycle", "personal-accident", "roadtax"],
  "keyFact": "Aggregator BNM-approved dengan keahlian Drive+ (rebate roadtax, ansuran tanpa faedah, cashback renew); boleh bayar melalui Atome BNPL. Travel insurance belum disahkan di laman konsumen (perlu semak).",
  "sources": ["https://policystreet.com.my/compare-car-insurance", "https://fintechnews.my/59602/insurtech-malaysia/policystreet-series-c-blueorchard/", "https://www.insurancebusinessmag.com/asia/news/technology/policystreet-rolls-out-new-perks-with-big-savings-on-road-tax-and-insurance-523399.aspx"]
}
```

## MyEG
- **What it is**: listed e-government services company (not an insurer); authorised JPJ partner for road tax (LKM) renewal + insurance quotation comparison.
- **What you can buy/renew**: car & motorcycle insurance quotes from multiple brands, road tax renewal (digital or physical courier), JPJ/PDRM summons settlement — [myeg.com.my/services/compare](https://www.myeg.com.my/services/compare), [myeg.com.my/services/jpj](https://www.myeg.com.my/services/jpj), [malaysia.gov.my road tax page](https://www.malaysia.gov.my/en/categories/transportation/vehicle-license/renewing-motor-vehicle-licenses-road-tax) (search-verified; myeg.com.my/services/compare returned 403 on direct read).
- **Standout**: deepest JPJ/government integration (summonses, PUSPAKOM status).
- **Caveats**: charges a service fee (≈RM2.75, help.myeg.com.my "what are the charges" — snippet-level only, **re-verify**) plus courier for physical stickers; travel insurance not offered (not found).
- Notable positioning: MyEG named by JPJ among **official** channels vs Bjak's disputed service — same fintechnews.my/44093 source.

```json
{
  "slug": "myeg",
  "name": "MyEG",
  "type": "marketplace",
  "digitalPlatform": "myeg.com.my",
  "products": ["car", "motorcycle", "roadtax"],
  "keyFact": "Ejen JPJ rasmi: renew roadtax + settle samanan + beli insurans motor dalam satu platform; ada yuran servis (~RM2.75) & pos kurier untuk stiker fizikal. Bukan insurer, bukan travel provider.",
  "sources": ["https://www.myeg.com.my/services/compare", "https://www.myeg.com.my/services/jpj", "https://help.myeg.com.my/portal/en/kb/articles/what-are-the-charges", "https://fintechnews.my/44093/various/bjak-not-approved-for-road-tax-renewals-seeks-to-address-jpj-concerns/"]
}
```

## Kaotim
- **What it is**: **digital takaful platform/brand owned by Takaful Malaysia** (Syarikat Takaful Malaysia Keluarga Berhad / Am Berhad) — direct channel, not an aggregator. Verified: [kaotim.my](https://kaotim.my/) (read directly 2026-09-12), [Takaful Malaysia launch PR](https://www.takaful-malaysia.com.my/en/news/takaful-malaysia-unveils-kaotim-a-new-digital-platform-offering-an-affordable-medical-card-for-malaysians/), Legasi launch via [The Star, 2024-07-29](https://www.thestar.com.my/metro/metro-news/2024/07/29/takaful-malaysia-launches-kaotim-legasi).
- **What you can buy**: Kaotim Car (10% instant discount, 0% installment plan, RM15,000 complimentary PA), Kaotim Motor (10% discount, complimentary 30 km towing), Kaotim MediKad medical takaful (cashless admission, annual limit up to RM1.1m with MediBooster rider, RM100/day government-hospital allowance), Kaotim Legasi hibah from RM30/month, instant approval, no medical check-up. App live (iOS/Android). Hotline 1-300-80-2525.
- **Model**: direct insurer-owned digital brand (like Kaotim ≈ "Etiqa Online for Takaful Malaysia").
- **No travel product** — not found on kaotim.my; flag if the travel vertical wants a Kaotim entry (exclude it there).

```json
{
  "slug": "kaotim",
  "name": "Kaotim",
  "type": "takaful",
  "digitalPlatform": "kaotim.my + Kaotim app",
  "products": ["car", "motorcycle", "health", "life"],
  "keyFact": "Platform takaful digital milik Takaful Malaysia: MediKad (annual limit sehingga RM1.1m dengan rider MediBooster), Car/Motor (diskaun 10% + PA RM15,000 percuma), Legasi hibah dari RM30/bulan. Semua takaful, tiada produk travel.",
  "sources": ["https://kaotim.my/", "https://www.takaful-malaysia.com.my/en/news/takaful-malaysia-unveils-kaotim-a-new-digital-platform-offering-an-affordable-medical-card-for-malaysians/", "https://www.takaful-malaysia.com.my/en/news/kaotim-the-digital-platform-and-brand-by-takaful-malaysia-introduces-online-car-and-motorcycle-protection-plans/", "https://www.thestar.com.my/metro/metro-news/2024/07/29/takaful-malaysia-launches-kaotim-legasi"]
}
```

# SOURCES (all read 2026-09-12)

**Read directly (highest confidence)**
1. https://www.zurich.com.my/insurance-products/protection/for-my-travel/z-travel-insurance-international (full benefit table, regions, COVID add-on)
2. https://www.etiqa.com.my/travel/tripcare-360-insurance (rebate, add-ons, exclusions, family pricing)
3. https://help.shopee.com.my/portal/4/article/145752 (Allianz Travel + Zurich Travel Takaful terms on Shopee)
4. https://kaotim.my/ (product cards, perks, hotline)
5. https://www.fwd.com.my/buy-online/ (title/meta only; body JS-gated)
6. https://fintechnews.my/44093/various/bjak-not-approved-for-road-tax-renewals-seeks-to-address-jpj-concerns/
7. https://www.zurich.com.my/-/media-assets/project/zurich-headless/malaysia/docs/insurance-products/policy-wordings/zgimb-z-travel-insurance-international-pw.pdf (cited within Zurich page)

**Search-verified (snippet level — re-check before quoting figures)**
8. https://www.generali.com.my/commerce/travel-insurance/summary-of-benefits · https://www.affinalways.com/smarttraveller-enhanced-single-trip-plan · https://wise.com/my/blog/generali-travel-insurance
9. https://www.tuneprotect.com/airasia/covidtravelpass/my/ · https://support.airasia.com/s/article/AirAsia-Travel-Insurance-Travel-Comprehensive-Plan
10. https://takeiteasy.msig.com.my/spa-assets/travelAddOnResource/Travel%20SafeGuard%20-%20Policy%20Wording_Single_No%20SD@16.06.26.pdf · https://www.insurnet.com.my/home/travel-insurance-TRP.php?default=Default
11. https://schengen.europ-assistance.com/en/what-insurance-do-you-need-schengen-visa-0 · https://www.axa-schengen.com/en/travel-insurance/benefits/30000-euro-coverage · https://oravisa.com/blog/schengen-visa-travel-insurance-requirements/
12. https://piam.org.my/insurance-101/individual/travel/ · https://www.chubbtravelinsurance.com.my/cti/my-en/home/learn/travel-tips/understanding-medical-evacuation-coverage.html
13. https://shopeepay.com.my/en/insurance · https://shopee.com.my/m/travel-insurance · https://ringgitplus.com/en/blog/insurance/shopeepay-and-zurich-launch-shariah-compliant-travel-takaful-for-malaysian-travellers.html · https://www.zurich.com.my/about-zurich/zurich-in-the-news/2025/2025-05-14
14. https://bjak.my/en · https://bjak.my/en/travel · https://bjak.my/en/roadtax
15. https://policystreet.com.my/compare-car-insurance · https://fintechnews.my/59602/insurtech-malaysia/policystreet-series-c-blueorchard/ · https://www.insurancebusinessmag.com/asia/news/technology/policystreet-rolls-out-new-perks-with-big-savings-on-road-tax-and-insurance-523399.aspx
16. https://www.myeg.com.my/services/compare · https://www.myeg.com.my/services/jpj · https://help.myeg.com.my/portal/en/kb/articles/what-are-the-charges · https://www.malaysia.gov.my/en/categories/transportation/vehicle-license/renewing-motor-vehicle-licenses-road-tax
17. https://kaotim.my/product/... (car/motor/legasi/medikad) · https://www.takaful-malaysia.com.my/en/news/... (2 PRs) · https://www.thestar.com.my/metro/metro-news/2024/07/29/takaful-malaysia-launches-kaotim-legasi
18. https://www.imoney.my/articles/fwd-takaful-fwd-protect-direct-takaful-online · https://www.tuneprotect.com/my/products/travel-easy-insurance/

# UNVERIFIED / FLAGS

- **Allianz plan limits** (RM200k–RM550k figures surfaced in search): allianz.com.my returned **HTTP 403** on direct read → all Allianz amount fields left null; only Shopee-channel facts (COVID/vaccination, regions) are publishable. Do not publish Allianz RM figures without re-reading the page.
- **Etiqa TripCare 360 tier medical limits**: not public (quote-gated) → null.
- **Shopee "RM3/day domestik / RM15.99/day antarabangsa"**: landing page is a JS spinner; snippet-only → don't publish.
- **Tune Protect "RM100,000" COVID medical**: from Tune Protect's covidtravelpass page via search summary → re-verify.
- **Generali RM300k+/unlimited evac**: third-party sources (wise.com, ICBC-hosted PDS) → confirm on generali.com.my/PDS before publishing.
- **MyEG RM2.75 service fee**: snippet from help centre → confirm current rate.
- **FWD travel insurance**: not found on fwd.com.my (2 checks); treat as absent unless owner session finds otherwise.
- **PolicyStreet travel products**: unverified.
- **Bjak road tax status in 2026**: JPJ statement is from May 2024; bjak.my/en/roadtax appears live per search but was not directly read → caveat editorially as "JPJ menyatakan (2024)…", not as current prohibition.
**UPDATE 2026-09-12 (owner-verified, commit follow-up):** Kaotim tiers RM50k/75k/100k + MediBooster RM550k/825k/1.1m (medikad.kaotim.my + PDS 19/07/2024); Tune COVID RM100k; Generali RM350k medical + unlimited evac; MyEG RM2.50 + 8% SST (help.myeg.com.my).

- Chubb Travel Insurance plans (a major MY travel insurer) surfaced only as a "what to compare" source; per-plan facts not gathered — candidate for a follow-up pass.

---

**Summary**: Read-only research; zero files changed (no commits; no subagents). Read the 2 specified repo files for house style; conducted ~14 web searches + 6 direct page reads. Verified directly: Zurich Z-Travel full benefit table, Etiqa TripCare benefits/exclusions, Shopee travel insurance terms, Kaotim products, Bjak/JPJ dispute article; FWD only meta-verifiable (JS-gated page). All limits/prices left null where not publicly verifiable, with per-row flags. Deliverables above feed: travel vertical plan table + companies.json platform rows (slugs `fwd`, `shopee`, `bjak`, `policystreet`, `myeg`, `kaotim` — none currently exist in companies.json; `takaful-malaysia` already exists and should be referenced as Kaotim's parent).

