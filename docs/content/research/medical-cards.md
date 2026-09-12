# Research Brief: Medical Card Vertical (insurans.co) — Sourced Facts + Draft JSON

**Files touched:** none (read-only task). **Repo files read for style:** `src/pages/car-insurance/[model].astro`, `src/data/car-models.json` (row shape: flat strings/arrays, slug-keyed, FAQ arrays), `PRODUCT.md` (BM-first, bukan-ejen, cited-facts principles). The JSON rows below mirror the `car-models.json` flat-field pattern; per-plan pages should follow the `[model].astro` template pattern (schema + FAQ + CTA band) minus NCD-specific components.

---

## 1. Per-plan facts

Verified from insurer's own PDFs/pages (read directly today, 2026-09-12) unless flagged. "null" = not stated in the source I read.

| Insurer | Plan | Type | Annual limit | Room & board | Lifetime | Deductible/co-pay | Waiting period | Source |
|---|---|---|---|---|---|---|---|---|
| AIA Bhd. | A-Plus Health360 | Rider (IL) | RM3,000,000 | RM300/hari; naik taraf Vitality Gold RM450 / Platinum RM600 | null (per-benefit lifetime caps only) | RM500/RM1,000/RM3,000 per rider year; 5% co-insurance cap RM500 | null (not in brochure) | AIA brochure PDF |
| Great Eastern Life | SmartMedic Shield (+Extender/Plus) | Rider (IL) | RM1,000,000–4,000,000 (6 tiers) | RM150/250/400 | No limit | Optional RM300 per disability | 30d / 120d specified | GE PDS (v0825) |
| Great Eastern General | GREAT MedCare | Standalone | RM60,000–500,000 (GX200–GX500) | RM200–500/hari (max 180 hari) | No limit | RM500 co-payment + optional deductible RM2,000–20,000 (diskaun 10–50%+) | 30d / 120d specified | GE brochure + page |
| Etiqa Life | OneMedical | Standalone | RM50,000/100,000/150,000 | RM160/280/360, tanpa had hari | No limit ("unlimited lifetime") | Optional RM1,000 per hospitalisation | null (not in flyer) | Etiqa flyer |
| Etiqa Family Takaful | i-MedicalCard Elite | Takaful | RM200,000/250,000 | RM350/400, tanpa had hari | No limit | RM500 atau RM1,000 per certificate year | null (not in flyer) | Etiqa MHIT e-flyer |
| Prudential | PRUMillion Med 2.0 (dalam PRUWith You Plus) | Rider (IL) | RM2,000,000 | RM200/hari (PDS contoh) | Not applicable (none) | RM500 per disability (RM1,000 Med Saver alt.) | 30d / 120d / accident immediate | Pru PDS 20 Jan 2026 |
| Takaful Malaysia Am | myMedik | Takaful | RM150k–500k; RM900k–1.5m dgn MedikBooster | RM150–500/hari, 7 tiers, tanpa had hari | No lifetime limit | Co-Takaful 5%/10% atas RM500/RM1,000 (dikecualikan hospital kerajaan) | 30d / 120d | PDS 04/06/2026 + page |
| Takaful Ikhlas Family | IKHLAS Medik | Takaful | RM250k/500k/1,000k | RM150/250/500, tanpa had hari | No limit | RM500 atau RM10,000 per certificate year | null (not in flyer) | Flyer + page |
| Tokio Marine Insurans (MY) | Medic Plus | Standalone (top-up design) | RM50k–150,000 | RM150–500/hari | No limit | RM10k/RM15k per disability; RM5k hospital kerajaan | 30d / 120d specified | TM brochure (kadar 06/2026) |
| Takaful Malaysia Keluarga | Kaotim MediKad | Takaful, digital | RM50k/75k/100k; ±RM1.1m dgn MediBooster ⚠️ | RM100/150/200/hari ⚠️ | No lifetime limit ⚠️ | null | null | Official domain via search; direct fetch failed ⚠️ |
| Allianz Life (MY) | HealthAssured | Rider | null ⚠️ | null ⚠️ | null | null | null | Page 403'd; snippets only ⚠️ |

Name checks: "Etiqa Medical Essential" and "Elite Takaful Medical" — **not found** on Etiqa official properties; live Etiqa medical-card lines are OneMedical/OneMedical Takaful and i-MedicalCard Elite. "Allianz MediGreat" — **not found**; Allianz's current health lines are MediCure / HealthInsured / HealthAssured / MediSafe Infinite+. "GREAT MediCare" → actual product is **GREAT MedCare** (Great Eastern **General**, standalone, not the SmartMedic life side). "PRUMy Medical Plus" is an umbrella (PRUWith You/PRUWith You Plus + PRUMillion Med/PRUValue Med riders); I anchored on the PRUMillion Med 2.0 PDS which is a complete BNM-format PDS.

```json
[
  {
    "slug": "aia-a-plus-health-360",
    "insurer": "AIA Bhd.",
    "planName": "A-Plus Health360",
    "type": "rider",
    "annualLimit": "RM3,000,000",
    "roomBoard": "RM300/hari (tanpa had hari per rider year; naik taraf AIA Vitality: RM450 Gold, RM600 Platinum)",
    "lifetimeLimit": null,
    "coInsurance": "5% untuk in-patient, ditetapkan atas RM500 per rider year (mengimbangi deductible)",
    "deductibleOptions": ["RM500 per rider year", "RM1,000 per rider year", "RM3,000 per rider year"],
    "panelSize": "150+ AIA panel providers, 70+ SMART Panel Hospitals (as of Jun 2026)",
    "waitingPeriods": null,
    "standoutFeature": "Health Wallet (no-claim bonus RM2,500/tahun sehingga 10 kali, primary care RM50/lawatan x3, screening/vaksin RM1,000 setiap 2 tahun) — medical card pertama dengan faedah rawatan primer/pencegahan",
    "sources": ["https://www.aia.com.my/content/dam/my-wise/document/health-protection-conventional/A-Plus_Health360_Brochure_11th.pdf"],
    "asAt": "2026-09-12"
  },
  {
    "slug": "great-eastern-smartmedic-shield",
    "insurer": "Great Eastern Life Assurance (Malaysia) Berhad",
    "planName": "SmartMedic Shield (+ Extender, + Plus)",
    "type": "rider",
    "annualLimit": "RM1,000,000 / 1,650,000 / 2,000,000 / 3,000,000 / 3,650,000 / 4,000,000 (bergantung plan)",
    "roomBoard": "RM150 / RM250 / RM400 sehari",
    "lifetimeLimit": "No limit",
    "coInsurance": null,
    "deductibleOptions": ["RM300 per disability (opsyen varian -D)"],
    "panelSize": null,
    "waitingPeriods": ["30 hari (penyakit umum)", "120 hari (specified illnesses, cth hipertensi/diabetes)"],
    "standoutFeature": "Annual limit sehingga RM4 juta, cashless facility, perlindungan sehingga 80/100 ANB; PDS: renewal dijamin tetapi COI tidak dijamin",
    "sources": ["https://www.greateasternlife.com/content/dam/corp-site/my/malaysia/gelm-mcm-marcom/product-/product-disclosure-sheet/gelm-mmc-pd-sms-smse-smsp-pds.pdf"],
    "asAt": "2026-09-12"
  },
  {
    "slug": "great-eastern-great-medcare",
    "insurer": "Great Eastern General Insurance (Malaysia) Berhad",
    "planName": "GREAT MedCare",
    "type": "standalone",
    "annualLimit": "RM60,000 / 100,000 / 200,000 / 500,000 (GX200/250/300/500)",
    "roomBoard": "RM200 / 250 / 300 / 500 sehari (maksimum 180 hari)",
    "lifetimeLimit": "No lifetime limit",
    "coInsurance": "RM500 per policy year (Section A item 1-17; dikecualikan untuk kecemasan, follow-up kanser/dialisis, hospital kerajaan); bilik atas entitlement: bayar perbezaan + co-insurance 20% atas bil lain",
    "deductibleOptions": ["RM2,000", "RM3,500", "RM5,000", "RM7,000", "RM15,000", "RM20,000 per policy year (opsyen, dengan diskaun premium 10%-50%+)"],
    "panelSize": null,
    "waitingPeriods": ["30 hari (sakit umum)", "120 hari (specified illnesses)"],
    "standoutFeature": "Standalone dengan renewal dijamin sehingga 85 tahun, co-payment RM500 tetap, Living Care Allowance, Good Health Discount 10%",
    "sources": ["https://www.greateasternlife.com/my/en/personal-insurance/our-products/hospital-surgical-insurance/great-medcare.html", "https://www.greateasternlife.com/content/dam/corp-site/my/en/content-fragment/personal-insurance/our-products/hospital-surgical-insurance/great-medcare/gegm-da-pd-medcare-brochure.pdf"],
    "asAt": "2026-09-12"
  },
  {
    "slug": "etiqa-one-medical",
    "insurer": "Etiqa Life Insurance Berhad",
    "planName": "OneMedical",
    "type": "standalone",
    "annualLimit": "RM50,000 / 100,000 / 150,000 (Plan 1/2/3)",
    "roomBoard": "RM160 / RM280 / RM360 sehari (tanpa had hari)",
    "lifetimeLimit": "No limit (unlimited lifetime medical cover)",
    "coInsurance": null,
    "deductibleOptions": ["RM1,000 per hospitalisation (opsyen; terpakai pada Inpatient & Day Care Surgery sahaja)"],
    "panelSize": null,
    "waitingPeriods": null,
    "standoutFeature": "Diskaun pakej keluarga 5%, kelulusan segera tanpa pemeriksaan perubatan, anak boleh masuk dari 14 hari, cash benefit RM2,000 penyakit berjangkit (COVID-19, denggi kategori lain dalam flyer)",
    "sources": ["https://www.etiqa.com.my/pdfs/en/insurance/Flyer_OneMedical.pdf"],
    "asAt": "2026-09-12"
  },
  {
    "slug": "etiqa-i-medicalcard-elite",
    "insurer": "Etiqa Family Takaful Berhad",
    "planName": "i-MedicalCard Elite",
    "type": "takaful",
    "annualLimit": "RM200,000 (Plan 1) / RM250,000 (Plan 2)",
    "roomBoard": "RM350 / RM400 sehari (tanpa had hari)",
    "lifetimeLimit": "No limit",
    "coInsurance": null,
    "deductibleOptions": ["RM500 per certificate year", "RM1,000 per certificate year"],
    "panelSize": null,
    "waitingPeriods": null,
    "standoutFeature": "Penuh digital (beli online tanpa ejen, e-medical card + Guarantee Letter via app Etiqa+), renewal automatik sehingga 85 tahun, elaun tunai RM200/hari di hospital kerajaan",
    "sources": ["https://edp.etiqa.com/edp/mhit/static/i-MedicalCard%20Elite_e-Flyer-59bd44d635e9a2d9098bfd33f495ea64.pdf", "https://www.etiqa.com.my/health/i-medicalcard-elite"],
    "asAt": "2026-09-12"
  },
  {
    "slug": "prudential-prumillion-med-2",
    "insurer": "Prudential Assurance Malaysia Berhad",
    "planName": "PRUMillion Med 2.0 (attach kepada PRUWith You / PRUWith You Plus)",
    "type": "rider",
    "annualLimit": "RM2,000,000",
    "roomBoard": "RM200 sehari (contoh PDS; tier lain tersedia)",
    "lifetimeLimit": "Not applicable (tiada lifetime limit)",
    "coInsurance": null,
    "deductibleOptions": ["RM500 per disability", "RM1,000 Med Saver (alternatif dalam jadual opsyen PDS)"],
    "panelSize": null,
    "waitingPeriods": ["30 hari (penyakit dilindungi lain)", "120 hari (specified illnesses, cth hipertensi/diabetes)", "Hospitalisasi kemalangan: serta-merta"],
    "standoutFeature": "PDS 20 Jan 2026: annual limit RM2 juta tanpa lifetime limit, cashless; COI tidak dijaminkan dan mungkin naik (medikal inflasi 7%-10% dalam unjuran PDS)",
    "sources": ["https://www.prudential.com.my/content/dam/prudential-aem-lbu/pamb/pdf/en/products/Medical-Insurance/PRUMillion-Med-2.0-PDS.pdf"],
    "asAt": "2026-09-12"
  },
  {
    "slug": "takaful-malaysia-mymedik",
    "insurer": "Syarikat Takaful Malaysia Am Berhad",
    "planName": "myMedik",
    "type": "takaful",
    "annualLimit": "RM150,000-500,000 (P150-P500); RM900,000-1,500,000 dengan rider MedikBooster",
    "roomBoard": "RM150 / 200 / 250 / 300 / 350 / 400 / 500 sehari (7 tiers, tanpa had hari)",
    "lifetimeLimit": "No lifetime limit",
    "coInsurance": "Co-Takaful 5% atau 10%, ditetapkan atas RM500/RM1,000 per certificate year; dikecualikan jika dirawat di hospital kerajaan Malaysia",
    "deductibleOptions": null,
    "panelSize": null,
    "waitingPeriods": ["30 hari (penyakit selain specified illnesses)", "120 hari (specified illnesses)"],
    "standoutFeature": "E-medical card + e-certificate serta-merta, elaun tunai RM100-250/hari di hospital kerajaan, penyertaan warganegara 6-69 tahun (anak dari 6 tahun) sehingga 85 ANB",
    "sources": ["https://www.takaful-malaysia.com.my/en/products/mymedik/", "https://www.takaful-malaysia.com.my/wp-content/uploads/2025/06/PDS-myMedik-EN-04062026.pdf"],
    "asAt": "2026-09-12"
  },
  {
    "slug": "takaful-ikhlas-ikhlas-medik",
    "insurer": "Takaful Ikhlas Family Berhad",
    "planName": "IKHLAS Medik",
    "type": "takaful",
    "annualLimit": "RM250,000 / 500,000 / 1,000,000 (Plan 150/250/500)",
    "roomBoard": "RM150 / RM250 / RM500 sehari (tanpa had hari)",
    "lifetimeLimit": "No lifetime limit",
    "coInsurance": null,
    "deductibleOptions": ["RM500 per certificate year", "RM10,000 per certificate year"],
    "panelSize": null,
    "waitingPeriods": null,
    "standoutFeature": "Reward no-claim: +10% R&B dan annual limit setiap 2 tahun bebas tuntutan (maks 200% had awal); 50% refund unutilised R&B; physio/akupunktur/bekam outpatient RM1,500-3,000; kanser/dialisis outpatient RM500,000 seumur hidup di atas annual limit",
    "sources": ["https://www.takaful-ikhlas.com.my/category/health-medical-takaful/product/ikhlas-medik", "https://www.takaful-ikhlas.com.my/api/uploads/IKHLAS_Medik_Flyers_v1_1_ENG_de151aa80b.pdf"],
    "asAt": "2026-09-12"
  },
  {
    "slug": "tokio-marine-medic-plus",
    "insurer": "Tokio Marine Insurans (Malaysia) Berhad",
    "planName": "Medic Plus",
    "type": "standalone",
    "annualLimit": "RM50,000 / 75,000 / 100,000 / 150,000 (MPE/MPC/MPB/MPA)",
    "roomBoard": "RM150 / 200 / 300 / 500 sehari (maks harian)",
    "lifetimeLimit": "No lifetime limit",
    "coInsurance": null,
    "deductibleOptions": ["RM10,000 per disability", "RM15,000 per disability (Plan MPE)", "RM5,000 jika dirawat di hospital kerajaan Malaysia"],
    "panelSize": null,
    "waitingPeriods": ["30 hari (sakit/qualifying period)", "120 hari (specified illnesses)", "Pre-existing dideclare: dilindungi selepas 12 bulan"],
    "standoutFeature": "Direka sebagai cover sekunder/top-up atas polisi H&S sedia ada atau cover majikan (deductible tinggi); kemasukan 30 hari-65 tahun, renewal sehingga umur 100; kadar premium rasmi berkuat kuasa 01/06/2026",
    "sources": ["https://www.tokiomarine.com/content/dam/tokiomarine/my/non-life/products/personal/health/medic-plus/documents/Medic%20Plus%20Brochure-English.pdf"],
    "asAt": "2026-09-12"
  },
  {
    "slug": "takaful-malaysia-kaotim-medikad",
    "insurer": "Syarikat Takaful Malaysia Keluarga Berhad (platform Kaotim)",
    "planName": "Kaotim MediKad",
    "type": "takaful",
    "annualLimit": "RM50,000 (Standard) / RM75,000 (Pro) / RM100,000 (Max); sehingga RM1.1 juta dengan MediBooster [dari hasil carian laman rasmi/PDS - tidak dapat dibaca langsung]",
    "roomBoard": "RM100 / RM150 / RM200 sehari [dari hasil carian laman rasmi - tidak dapat dibaca langsung]",
    "lifetimeLimit": "No lifetime limit [dari hasil carian - tidak dapat dibaca langsung]",
    "coInsurance": null,
    "deductibleOptions": null,
    "panelSize": null,
    "waitingPeriods": null,
    "standoutFeature": "100% digital tanpa ejen, harga rasmi dari RM38 sebulan (meta description medikad.kaotim.my); peserta 6-69 tahun, perlindungan sehingga 85 tahun",
    "sources": ["https://medikad.kaotim.my/", "https://api.kaotim.my/uploads/PDS-MediKad-EN-19072024.pdf", "https://ringgitplus.com/en/blog/insurance/takaful-malaysia-launches-digital-platform-kaotim-and-medical-coverage-plan-kaotim-medikad.html"],
    "asAt": "2026-09-12"
  },
  {
    "slug": "allianz-healthassured",
    "insurer": "Allianz Life Insurance Malaysia Berhad",
    "planName": "HealthAssured",
    "type": "rider",
    "annualLimit": null,
    "roomBoard": null,
    "lifetimeLimit": null,
    "coInsurance": null,
    "deductibleOptions": null,
    "panelSize": null,
    "waitingPeriods": null,
    "standoutFeature": null,
    "sources": ["https://www.allianz.com.my/personal/life-health-and-savings/medical-and-hospitalisation/healthassured.html"],
    "asAt": "2026-09-12"
  }
]
```

⚠️ **KAOTIM row:** direct reads of `medikad.kaotim.my` (JS-only shell) and the PDS PDF (TLS cert failure) failed. Tier figures came from search renderings of the official `kaotim.my` domain + the PDS URL, corroborated by RinggitPlus; verify by opening the PDS in a browser before publishing. **Allianz row:** official page returned HTTP 403; snippets claim "up to RM3 million, no lifetime limit, no-cap R&B days" — treat as unverified, fill after a manual fetch.
**UPDATE 2026-09-12 (owner-verified, commit follow-up):** Kaotim tiers RM50k/75k/100k + MediBooster RM550k/825k/1.1m (medikad.kaotim.my + PDS 19/07/2024); Tune COVID RM100k; Generali RM350k medical + unlimited evac; MyEG RM2.50 + 8% SST (help.myeg.com.my).


---

## 2. Apa yang patut dibanding (buyer-education bullets)

- **Annual vs lifetime limit** — annual limit refresh setiap policy year; lifetime limit habis = polisi tamat dan kena beli baru. High limits cost more; pilih ikut keperluan/bajet, bukan ikut nombor terbesar. Source: [FEN, Understand Common Terms in MHIT](https://www.fenetwork.my/medical-and-health-insurance-takaful/understand-common-terms-in-mhit/).
- **Co-insurance / deductible kini wajib ditawarkan sebagai opsyen** — efektif 1 Sep 2024 semua ITO mesti offer produk dengan co-payment; produk co-payment 19%–68% lebih murah; co-payment dikecualikan untuk kecemasan, follow-up kanser/dialisis, dan rawatan hospital kerajaan. Source: [BNM, 6 Jul 2024](https://www.bnm.gov.my/-/mhit-req-en). Prudential PDS mengesahkan: deductible lebih tinggi = COI lebih rendah.
- **Waiting period piawai industri: 30 hari sakit umum, 120 hari specified illnesses (hipertensi, diabetes, batu karang, buasir dll.), kemalangan serta-merta** — verifikasi dalam PDS Prudential, SmartMedic, myMedik dan brosur Tokio Marine. Pre-existing dikecualikan; sesetengah plan cover semula selepas 12 bulan jika dideclare (Tokio Medic Plus).
- **Room upgrade = penalti berganda** — bayar perbezaan bilik, dan (bergantung polisi) co-insurance dikenakan pada baki bil: OneMedical flyer nota 1 ("top-up room & board rate differences"), myMedik PDS ("pay the difference"), GREAT MedCare (perbezaan + 20% co-insurance bil lain). Ini punca claim "kurang daripada jangka" paling biasa.
- **COI / caruman tidak dijaminkan** — semua PDS terkini (Prudential, GE SmartMedic, myMedik) nyatakan renewal dijamin tetapi harga tidak; unjuran medical inflation 7%–10% setahun; BNM rekod inflasi kos perubatan swasta 12.6% (2023) vs purata global 5.6%. Source: [BNM](https://www.bnm.gov.my/-/mhit-req-en) + PDS masing-masing.
- **Standalone vs rider** — rider melekat pada polisi life/ILP (COI dipotong dari unit account, boleh naik walaupun tak claim); standalone = polisi perubatan sahaja. Source: [FEN](https://www.fenetwork.my/medical-and-health-insurance-takaful/understand-common-terms-in-mhit/); PDS Prudential Step 1.
- **Panel hospital & cashless** — fasiliti cashless hanya berguna di hospital panel terpilih dan tertakluk pada pengesahan pra-kemasukan (GE SmartMedic PDS); senarai panel berubah, semak locator rasmi sebelum beli (AIA brochure nota 3).
- **Free-look 15/30 hari** — semua produk di atas ada free-look (15 hari standard; myMedik 15 hari dari e-certificate) — guna untuk batal tanpa rugi jika tersalah beli. Source: PDS masing-masing; definisi [FEN](https://www.fenetwork.my/medical-and-health-insurance-takaful/understand-common-terms-in-mhit/).

Pitfalls for "medical card murah" searchers: murah = deductible/co-insurance tinggi atau annual limit rendah (contoh: Kaotim Standard RM50k vs SmartMedic Shield RM1m+); murah juga = standalone tanpa kandungan life/CI — bukan "lebihuntung", cuma liputan berbeza. Outpatient biasa (GP, demam) TIDAK dilindungi kecuali masuk hospital atau kanser/dialisis — senarai outpatient dalam flyer OneMedical/Elite/IKHLAS Medik terhad kepada item tersenarai.

---

## 3. Kaotim review summary

**What it is:** Kaotim is the direct-to-consumer digital platform of **Syarikat Takaful Malaysia Keluarga Berhad**; **MediKad** is its standalone medical takaful card (no agent, online quote→apply→e-certificate, e-medical card). Officially marketed "medical card from RM38 a month" (meta description of medikad.kaotim.my, read 2026-09-12); launch covered by [RinggitPlus](https://ringgitplus.com/en/blog/insurance/takaful-malaysia-launches-digital-platform-kaotim-and-medical-coverage-plan-kaotim-medikad.html) and [Takaful Malaysia's own newsroom](https://www.takaful-malaysia.com.my/en/news/takaful-malaysia-unveils-kaotim-a-new-digital-platform-offering-an-affordable-medical-card-for-malaysians/).

**How it differs:** no agent channel (vs AIA/Prudential/GE agency IL riders), pure protection without cash value, budget tiers (RM50k–100k annual limit base, ±RM1.1m with MediBooster ⚠️), same underwriter/PIDM backing as Takaful Malaysia's myMedik family. Direct fetch of tier details failed (⚠️ above) — verify against PDS before publishing.

**Reputation signals (community, anecdotal — label as such on-page):** cheaper than agent-tied IL bundles for young adults; no-agent convenience and portal-based servicing praised ([Reddit r/MalaysianPF thread](https://www.reddit.com/r/MalaysianPF/comments/1fqe0yj/experiences_with_kaotim_medikad/), [Lowyat forum](https://forum.lowyat.net/topic/5551596)); recurring caveats in same threads: premiums step up with age bands, pre-existing conditions must still be declared, routine GP visits not covered, prefer-agent users dissatisfied. Also third-party roundup coverage ([Says](https://says.com/my/lifestyle/takaful-malaysia-kaotim-medikad)). No regulator actions found against Kaotim/Takaful Malaysia on this product.

---

## 4. SOURCES

Insurer/banker primary (read directly 2026-09-12):
1. https://www.aia.com.my/content/dam/my-wise/document/health-protection-conventional/A-Plus_Health360_Brochure_11th.pdf
2. https://www.greateasternlife.com/content/dam/corp-site/my/malaysia/gelm-mcm-marcom/product-/product-disclosure-sheet/gelm-mmc-pd-sms-smse-smsp-pds.pdf
3. https://www.greateasternlife.com/my/en/personal-insurance/our-products/hospital-surgical-insurance/great-medcare.html
4. https://www.greateasternlife.com/content/dam/corp-site/my/en/content-fragment/personal-insurance/our-products/hospital-surgical-insurance/great-medcare/gegm-da-pd-medcare-brochure.pdf
5. https://www.etiqa.com.my/pdfs/en/insurance/Flyer_OneMedical.pdf
6. https://edp.etiqa.com/edp/mhit/static/i-MedicalCard%20Elite_e-Flyer-59bd44d635e9a2d9098bfd33f495ea64.pdf (hosted on Etiqa's MHIT edp domain)
7. https://www.etiqa.com.my/health/i-medicalcard-elite
8. https://www.prudential.com.my/content/dam/prudential-aem-lbu/pamb/pdf/en/products/Medical-Insurance/PRUMillion-Med-2.0-PDS.pdf
9. https://www.takaful-malaysia.com.my/en/products/mymedik/
10. https://www.takaful-malaysia.com.my/wp-content/uploads/2025/06/PDS-myMedik-EN-04062026.pdf
11. https://www.takaful-ikhlas.com.my/category/health-medical-takaful/product/ikhlas-medik
12. https://www.takaful-ikhlas.com.my/api/uploads/IKHLAS_Medik_Flyers_v1_1_ENG_de151aa80b.pdf
13. https://www.tokiomarine.com/content/dam/tokiomarine/my/non-life/products/personal/health/medic-plus/documents/Medic%20Plus%20Brochure-English.pdf
14. https://medikad.kaotim.my/
15. https://www.allianz.com.my/personal/life-health-and-savings/medical-and-hospitalisation/healthassured.html (403 — not fetched)

BNM / education:
16. https://www.bnm.gov.my/-/mhit-req-en
17. https://www.fenetwork.my/medical-and-health-insurance-takaful/understand-common-terms-in-mhit/

Kaotim reputation / launch (secondary):
18. https://ringgitplus.com/en/blog/insurance/takaful-malaysia-launches-digital-platform-kaotim-and-medical-coverage-plan-kaotim-medikad.html
19. https://www.takaful-malaysia.com.my/en/news/takaful-malaysia-unveils-kaotim-a-new-digital-platform-offering-an-affordable-medical-card-for-malaysians/ (timed out on direct read; surfaced consistently in search)
20. https://says.com/my/lifestyle/takaful-malaysia-kaotim-medikad
21. https://www.reddit.com/r/MalaysianPF/comments/1fqe0yj/experiences_with_kaotim_medikad/
22. https://forum.lowyat.net/topic/5551596
23. https://api.kaotim.my/uploads/PDS-MediKad-EN-19072024.pdf (failed — TLS cert; retry in browser)

**Could NOT verify (do not publish as fact):** AIA A-Plus Health360 overall lifetime limit (schedule garbled in extraction); all Allianz HealthAssured figures; Kaotim tier limits/R&B/booster numbers (search-rendered only, corroborated by RinggitPlus but not direct-read); waiting periods for OneMedical, i-MedicalCard Elite, IKHLAS Medik, Kaotim (not stated in the flyers/pages read — they exist in PDS/certificate wording); panel sizes for all except AIA. "Etiqa Medical Essential", "Elite Takaful Medical", "Allianz MediGreat", "GREAT MediCare" (correct name: GREAT MedCare) as product names — not found on official sources.

---

**Summary:** Read-only research; 3 repo files read (`src/pages/car-insurance/[model].astro`, `src/data/car-models.json`, `PRODUCT.md`), zero files modified, nothing committed. Produced 11 draft JSON rows keyed to house field style, with 9 plans anchored on insurer-issued PDS/brochures/PDS-grade documents read directly today and 2 rows (Kaotim tiers, Allianz) explicitly flagged unverified due to fetch failures. Verification method: official PDFs/pages fetched and parsed directly rather than trusting search summaries; every number in the table/JSON traceable to a listed primary source; education claims sourced to BNM/FEN.

