delegate: agent=research exit=0 reason=ok seconds=324 run=/home/dev/projects/insurans.co/.agent-runs/20260912-204343-984981
Research complete. Report follows.

---

# Findings

## Vertical 1 — Home insurance (insurans rumah)

**The fire/houseowner/householder tariff is PUBLIC and verified from four independent primary documents read today (2026-09-12):**

| Cover | Construction 1A (brick walls, non-combustible roof) | Construction 1B (partly brick) |
|---|---|---|
| Houseowner (building) — landed/detached & non-detached | **0.090%** p.a. of sum insured | 0.226% |
| Houseowner — flats/apartments | **0.093%** | 0.243% |
| Householder (contents) | **0.338%** | 0.520% |

- Minimum policy premium **RM60**; stamp duty RM10. Add-ons (Takaful Malaysia PDS): 3rd-party liability RM50k included; raise to RM100k = +RM10, to RM250k = +RM20; riot/strike 0.010% (Pacific form). Full theft (contents) 0.25%, plate glass 0.050% (Pacific form).
- Houseowner vs Householder: Houseowner = building (incl. extensions/renovations, loss of rent ≤10% SI, liability to public RM50k); Householder = contents (jewellery/valuables capped at **1/3 of contents SI**; fatal injury by thieves/fire RM10k or ½ contents SI, lower).
- Named products verified: **Berjaya Sompo HOHH** (tariff page incl. rates + PIAM BCC link, read), **Takaful Malaysia myHouseowner/Householder** (PDS, read), **Pacific Insurance** (proposal form with full rate table, read), **BSN/Chubb** houseowner (PDS — *different structure*: 2-year comprehensive policy at 0.2235% landed / 0.2273% flats, Chubb underwriting, "valid as at 1 Jan 2017"). Etiqa HOHH / Zurich Z-HomeProtect / Allianz Smart Home Cover / MSIG product names confirmed via search only — benefit figures **not verified** (flagged in rows).

**Calculator verdict: BUILDABLE.** `premium = rate × buildingSumInsured` (Houseowner) + `0.338% × contentsSI` (Householder) + min-premium floor + RM10 stamp. PIAM's official Building Cost Calculator (`bcc.piam.org.my`, linked from Berjaya Sompo) can be referenced for sum-insured estimation. Caveat to state on-page: BNM is phasing fire-tariff liberalisation, so non-tariff pricing/deviation is possible; basic fire-only (bank's minimum) rate **not found publicly** → quote-gated.

## Vertical 2 — Personal Accident (insurans kemalangan diri)

Fully verified products (primary PDS/product pages read today):

- **Etiqa Buddy PA – Weekend Warrior** (PDS dated 01/06/2026): 4 plans (Basic/Good/Better/Best), adult death & PPD **RM50k/100k/200k/250k** (child RM40k–70k), hospital cash RM100–250/day (max 30 days/accident), recovery nursing RM100–400/day (max 60 days), facial reconstructive/dental + skin graft RM10,000, road ambulance RM500. Worked premium in PDS: Better Plan adult (SI RM200k): basic RM403.99 − 25% online discount = RM303 + 8% SST (RM24.24) + RM10 stamp = **RM337.24/yr**. Takaful variant exists.
- **Tune Protect PA Easy**: flat **RM36/yr**; AD & PPD up to RM50,000; medical RM2,000/accident; hospital income RM50/day max 120 days (≤RM6,000); cosmetic RM1,000; bereavement RM2,000; entry 18–70 (renewable); Malaysian residents + valid work permits.
- **Tune Protect PA Shield**: 5 plans, AD/PD RM100k–**RM1M**; renewal bonus +10%/yr to 150%; medical RM5k–12k (incl. dengue/malaria/JE/Zika/HFMD); hospital income RM75–250/day max 180 days; weekly benefit (optional) up to RM500/week × 104 weeks; snatch theft RM1k; personal liability ≤RM1M; parents support fund; bereavement RM5k. Published annual premiums (Class 1&2, without weekly benefit): **RM188 / 308 / 408 / 668 / 1,238** (excl. 8% SST + RM10 stamp); age/occupation-class rating (Classes 1–3), excluded occupations listed.
- **Allianz / Generali / Takaful PA pages**: not directly readable (allianz.com.my returned HTTP 403) → flagged, not fabricated.

**Calculator verdict: NO tariff, but premiums are FLAT and PUBLISHED** for Tune PA Easy (RM36) and PA Shield (banded by plan/occupation class), and Etiqa shows a worked example. A "band estimate" widget is honest if it only shows published flat prices; a full quote engine is quote-gated.

## Vertical 3 — Motorcycle insurance (insurans motosikal)

**Motorcycle roadtax: PUBLIC + verified from the official JPJ PDF (Garis Panduan Pengiraan LKM, pindaan Bajet 2009 — same source already used in `src/data/roadtax-rates.json` for cars).**

Peninsular Malaysia (incl. Pangkor/Langkawi), code AA: **≤150cc = "kadar sedia ada" (RM2 — not restated numerically in the PDF; flagged)**; 151–200cc RM30; 201–250cc RM50; 251–500cc RM180; 501–800cc RM250; >800cc RM350. Sabah & Sarawak: 151–200 RM9; 201–250 RM12; 251–500 RM30; 501–800 RM40; >800 RM42. Labuan = 50% of Sabah rates; Pangkor/Langkawi = 50% of Semenanjung (>150cc). EV motorcycles (JPJ ZEV circular effective 1 Apr 2026): ≤7,500W RM2; 7,501–10,000W RM9; 10,001–12,500W RM12; 12,501–25,000W RM30; 25,001–40,000W RM40; >40,000W RM42.

**Motorcycle third-party insurance: I could NOT verify a public per-cc premium table from an authoritative source.** Kurnia's motorcycle PDS (read) confirms cc, NCD, age and location are rating factors and lists fees (SST 6%, stamp RM10, commission 10%) but publishes no table; Berjaya Sompo PDS gives only a worked comprehensive example (RM147.12, RM2,500 SI, NCD 25%). A MYEG article circulates a cc table but it visibly mixes roadtax bands with premiums → **unverified, do not use**. Current site figures (RM65–85 kapchai TP) are market estimates, not a citable tariff — flag as quote-gated. Comprehensive/TPFT is risk-priced (post-2017 liberalisation) → quote-gated.

**Calculator verdict:** motorcycle **roadtax-by-cc = BUILDABLE** (exact JPJ schedule above, mirrors existing `roadtax-rates.json` pattern; matches "kalkulator-roadtax" demand). **Motorcycle TP premium = NOT honestly buildable** from public sources; **fire/HOHH premium = buildable** (vertical 1). "Motorcycle insurance calculator malaysia" (200/mo) is best served by a roadtax calculator + insurer quote links.

```json
[
  {"slug":"berjaya-sompo-houseowner-householder","insurer":"Berjaya Sompo Insurance Berhad","planName":"Houseowner / Householder","type":"houseowner-householder","coversWhat":"Houseowner: bangunan (fire, kilat, letupan, pesawat, hentaman kenderaan/binatang, paip pecah, kecurian pecah masuk, taufan, banjir, gempa) + loss of rent 10% SI + liability awam RM50,000. Householder: isi rumah, barangan kemas dihad 1/3 SI isi rumah","tariffRates":"Houseowner 1A: 0.090% landed / 0.093% flat; Householder 1A: 0.338% (kadar setahun atas Jumlah Diinsuranskan; ilustrasi RM100,000 = RM90/RM93/RM338)","minPremium":"RM60","sumInsuredBasis":"Kos pembinaan semula (rujuk PIAM Building Cost Calculator bcc.piam.org.my); bukan harga pasaran/tanah","quoteGated":"fire-only basic rate tidak diterbitkan; HOHH premium boleh dikira dari kadar","sources":["https://www.berjayasompo.com.my/product/houseowner-householder"],"asAt":"2026-09-12"},
  {"slug":"takaful-malaysia-myhouseowner-householder","insurer":"Syarikat Takaful Malaysia Am Berhad","planName":"Takaful myHouseowner/Householder","type":"houseowner-householder-takaful","coversWhat":"Kebakaran/kilat/letupan domestik, pesawat, hentaman, paip pecah, kecurian pecah masuk (rumah dibiarkan kosong >90 hari terkecuali), taufan, gempa, banjir; loss of rent 10%; liability RM50,000 (naik RM100k +RM10, RM250k +RM20)","tariffRates":"Houseowner 1A: 0.090% landed / 0.093% flat; 1B: 0.226% / 0.243%; Householder 1A: 0.338% (1B tidak diterima untuk householder)","minPremium":"RM60","sumInsuredBasis":"Market value atau replacement value; average clause jika kurang dilindungi","quoteGated":null,"sources":["https://www.takaful-malaysia.com.my/wp-content/uploads/2023/02/STMAB-PDSE-HOHH-V01-03-2023.pdf"],"asAt":"2026-09-12"},
  {"slug":"pacific-houseowner-householder","insurer":"The Pacific Insurance Berhad","planName":"Houseowner dan/atau Householder","type":"houseowner-householder","coversWhat":"Houseowner: bangunan + debris removal + yuran arkitek/jurukur + tambahan loss of rent; Householder: isi rumah; tambahan: riot 0.010%, kecurian penuh 0.25%, kaca keping 0.050%, liability RM100k RM10 / RM200k RM20","tariffRates":"Houseowner 1A: 0.090% (dwelling bertanah) / 0.093% (apartment); 1B: 0.226% / 0.243%; Householder 1A: 0.338% / 1B: 0.520%","minPremium":null,"sumInsuredBasis":"NILAI PENUH harta (average clause)","quoteGated":null,"sources":["https://www.pacificinsurance.com.my/wp-content/uploads/2024/02/Houseowner-Householder_P-Form_CFH_V1.1_1-MAR-2024.pdf"],"asAt":"2026-09-12"},
  {"slug":"bsn-chubb-houseowner","insurer":"Chubb Insurance Malaysia Berhad (dijual melalui BSN)","planName":"BSN Houseowner Insurance","type":"houseowner-comprehensive","coversWhat":"Bangunan: fire/kilat/letupan, pesawat, kenderaan, paip pecah, kecurian pecah masuk, windstorm, gempa, banjir; loss of rent 10%; riot; subsidence; alteration 25% SI; liability RM50,000; tempoh 2 tahun","tariffRates":"Comprehensive: 0.2235% rumah berteres/semi-D/detached; 0.2273% flat/apartment/condo (contoh RM150,000 x 0.2235% = RM335.25/tahun; 2 tahun = RM680.50)","minPremium":null,"sumInsuredBasis":"Market value atau reinstatement; contoh average clause RM250,000 x 200,000/250,000","quoteGated":"struktur berbeza (pakej 2-tahun bank); bukan kadar tariff asas","sources":["https://www.bsn.com.my/cms/upload/pdf/personal/wealth/general_insurance_houseowner_pds_1.pdf"],"asAt":"2026-09-12"},
  {"slug":"etiqa-hohh","insurer":"Etiqa","planName":"Houseowner/Householder Insurance & Takaful","type":"houseowner-householder","coversWhat":"Kebakaran, kilat, letupan, bencana alam (banjir/gempa/taufan), hentaman, pecah masuk, loss of rent 10%; boleh beli online/MAE; rebat online dilaporkan","tariffRates":null,"minPremium":null,"sumInsuredBasis":null,"quoteGated":"HANYA NAMA PRODUK disahkan melalui carian; butiran had/kadar TIDAK diverifikasi — baca semula laman sebelum publish","sources":["https://www.etiqa.com.my/home/hohh-insurance"],"asAt":"2026-09-12"},
  {"slug":"zurich-z-homeprotect","insurer":"Zurich Malaysia","planName":"Z-HomeProtect (Insurance & Takaful)","type":"houseowner-householder","coversWhat":"Section I houseowner (bangunan, garaj, fixtures) + Section II householder (barang isi rumah); barangan kemas sehingga 1/3 SI isi rumah (laporan carian)","tariffRates":null,"minPremium":null,"sumInsuredBasis":null,"quoteGated":"HANYA NAMA PRODUK disahkan; butiran TIDAK diverifikasi","sources":["https://www.zurich.com.my/insurance-products/protection/for-my-property/z-homeprotect"],"asAt":"2026-09-12"},
  {"slug":"allianz-smart-home-cover","insurer":"Allianz General Insurance","planName":"Smart Home Cover","type":"modular-houseowner-householder","coversWhat":"Modul: HouseOwner (bangunan), HouseHolder (isi rumah), perlindungan pinjaman, landlord, HomeFix (laporan carian)","tariffRates":null,"minPremium":null,"sumInsuredBasis":null,"quoteGated":"HANYA NAMA PRODUK disahkan; butiran TIDAK diverifikasi","sources":["https://www.allianz.com.my/personal/home-motor-and-travel/home/smart-home-cover.html"],"asAt":"2026-09-12"},
  {"slug":"etiqa-buddy-pa-weekend-warrior","insurer":"Etiqa General Insurance Berhad","planName":"Buddy PA Insurance – Weekend Warrior","type":"personal-accident","coversWhat":"Kematian & hilang upaya kekal akibat kemalangan, compassionate care, perbelanjaan pemulihan/gaya hidup, jururawat pemulihan 60 hari, elaun hospital 30 hari, perubatan wad & luar wad, ambulans, pembedahan membina semuka/gigi + kulit RM10,000","plansAndBenefits":"Basic/Good/Better/Best: mati & PPD dewasa RM50,000/100,000/200,000/250,000 (kanak-kanak RM40,000-70,000); hospital cash RM100-250/hari; nursing RM100-400/hari","entryAge":null,"premiumPublished":"Contoh PDS (Better, dewasa, SI RM200k): basic RM403.99 - diskaun online 25% = RM303 + SST 8% RM24.24 + setem RM10 = RM337.24/tahun","sources":["https://www.etiqa.com.my/pdfs/en/insurance/Product_Disclosure_Sheet_Weekend_Warrior_Insurance.pdf","https://www.etiqa.com.my/personal-accident"],"asAt":"2026-09-12"},
  {"slug":"tune-protect-pa-easy","insurer":"Tune Insurance Malaysia Berhad","planName":"Tune Protect PA Easy","type":"personal-accident","coversWhat":"Kematian akibat kemalangan & PPD, perbelanjaan perubatan kemalangan, elaun hospital, kosmetik, khairat (bereavement)","plansAndBenefits":"AD & PPD sehingga RM50,000; perubatan RM2,000 setiap kemalangan; hospital RM50/hari (max 120 hari, RM6,000); kosmetik RM1,000; khairat RM2,000","entryAge":"18-70 tahun (penduduk Malaysia / permit kerja sah)","premiumPublished":"RM36.00 setahun (harga rata diterbitkan); boleh beli online","sources":["https://www.tuneprotect.com/my/products/pa-easy/"],"asAt":"2026-09-12"},
  {"slug":"tune-protect-pa-shield","insurer":"Tune Insurance Malaysia Berhad","planName":"PA Shield","type":"personal-accident","coversWhat":"AD & PPD, renewal bonus +10%/tahun max 150%, perubatan (termasuk denggi/malaria/JE/Zika/HFMD), kemasukan hospital tanpa tunai, pendapatan hospital 180 hari, elaun mingguan (opsyen, 104 minggu), ragut RM1,000, liabiliti peribadi sehingga RM1,000,000, dana sokongan ibu bapa, khairat RM5,000, repatriasi RM5,000","plansAndBenefits":"Pelan 1-5 AD/PPD RM100,000/200,000/300,000/500,000/1,000,000; perubatan RM5,000-12,000; hospital RM75-250/hari; premium tahunan Kelas 1&2 tanpa manfaat mingguan RM188/308/408/668/1,238 (Pelan 5: RM1,238; dengan manfaat mingguan RM1,438) - excl SST 8% + setem RM10","entryAge":null,"premiumPublished":"Ya (brosur rasmi; kelas pekerjaan 1-3; kelas 3 tidak layak manfaat mingguan)","sources":["https://s3-ap-southeast-1.amazonaws.com/tuneprotect.com/tpr/wp-content/uploads/pdf/Tune_Protect_PA_Shield_Brochure.pdf","https://www.tuneprotect.com/my/products/pa-shield/"],"asAt":"2026-09-12"},
  {"slug":"allianz-personal-accident","insurer":"Allianz General Insurance","planName":"Allianz Personal Accident (laman tidak dapat dibaca)","type":"personal-accident","coversWhat":null,"plansAndBenefits":null,"entryAge":null,"premiumPublished":null,"sources":["https://www.allianz.com.my/personal/life-health-and-savings/personal-accident/personal-accident.html"],"asAt":"2026-09-12"},
  {"slug":"jpj-motosikal-roadtax","insurer":"JPJ (LKM)","planName":"Cukai jalan motosikal mengikut cc (Kod AA)","type":"roadtax-schedule","coversWhat":"Kadar Lesen Kenderaan Motor motosikal persendirian","premiumBasis":"Jadual tetap JPJ: Semenanjung (termasuk Pangkor/Langkawi): <=150cc kadar sedia ada (RM2 - tidak dinyatakan semula dalam PDF, perlu sahkan); 151-200cc RM30; 201-250cc RM50; 251-500cc RM180; 501-800cc RM250; >800cc RM350. Sabah & Sarawak: RM9/RM12/RM30/RM40/RM42. Labuan = 50% kadar Sabah; Pangkor/Langkawi >150cc = 50% kadar Semenanjung. EV (berkuat kuasa 1 Apr 2026): <=7,500W RM2; 7,501-10,000W RM9; 10,001-12,500W RM12; 12,501-25,000W RM30; 25,001-40,000W RM40; >40,000W RM42","calculatorFeasible":"YA - jadual awam penuh, sama corak roadtax-rates.json sedia ada","sources":["https://www.jpj.gov.my/wp-content/uploads/2022/11/Garis-Panduan-Pengiraan-LKM-Bajet-20092.pdf","https://www.jpj.gov.my/wp-content/uploads/2026/07/Lampiran-B-01.04.2026-Garis-Panduan-Kadar-LKM-Bagi-Kenderaan-Motor-Elektrik-ZEVs.pdf"],"asAt":"2026-09-12"},
  {"slug":"kurnia-motorcycle-third-party","insurer":"AmGeneral Insurance Berhad (Kurnia)","planName":"Motor Insurance – Motorcycle (Third Party)","type":"third-party","coversWhat":"Liabiliti pihak ketiga: kecederaan, maut, kerosakan/kehilangan harta; TIDAK meliputi motor sendiri (kecuali add-on); penumpang/pillion perlu add-on (wajib untuk masuk Singapura)","premiumBasis":"Tariff coverage: premium bergantung NCD, kuasa enjin (cc), umur kenderaan/pemilik, lokasi - TIADA jadual awam diterbitkan dalam PDS","calculatorFeasible":"TIDAK boleh dikira dari sumber awam; quote-gated","sources":["https://www.kurnia.com/download/pds/motorcycle-third-party-eng.pdf"],"asAt":"2026-09-12"},
  {"slug":"berjaya-sompo-motorcycle","insurer":"Berjaya Sompo Insurance Berhad","planName":"SOMPO Motorcycle / Motorcycle +","type":"comprehensive","coversWhat":"Comprehensive, TPFT, Third Party; add-on: liabiliti pillion, special perils, PA penunggang","premiumBasis":"Bergantung SI, cc, NCD, umur pemilik/kenderaan; contoh PDS: Honda Airblade SI RM2,500, umur 8, NCD 25% = RM147.12/tahun (sebelum SST & setem; SST 6%, setem RM10)","calculatorFeasible":"TIDAK (contoh tunggal, bukan jadual)","sources":["https://online.berjayasompo.com.my/motorcycle/docs/Motorcycle%20PDS%20_ENG%20(042023).pdf"],"asAt":"2026-09-12"},
  {"slug":"etiqa-myrider","insurer":"Etiqa","planName":"MyRider / MyRider Plus (Motorcycle Insurance & Takaful)","type":"comprehensive-takaful","coversWhat":"Comprehensive & third-party + add-on perubatan, elaun hospital, towing 24/7 (laporan carian); rebat online","premiumBasis":null,"calculatorFeasible":"quote-gated","sources":["https://www.etiqa.com.my/motorcycle","https://www.etiqa.com.my/motorcycle/myRider-insurance"],"asAt":"2026-09-12"},
  {"slug":"zurich-z-rider","insurer":"Zurich Malaysia","planName":"Z-Rider (Insurance & Takaful)","type":"comprehensive-takaful","coversWhat":"Pelanggaran, terbalik, kebakaran, kecurian, liabiliti pihak ketiga; add-on liabiliti penumpang, bencana alam (laporan carian); dijual web + Shopee","premiumBasis":null,"calculatorFeasible":"quote-gated","sources":["https://www.zurich.com.my/insurance-products/protection/for-my-vehicle/z-rider"],"asAt":"2026-09-12"},
  {"slug":"msig-motorcycle-online","insurer":"MSIG Insurance (Malaysia) Bhd","planName":"MSIG Motorcycle Insurance (Take It Easy)","type":"comprehensive-third-party","coversWhat":"Comprehensive & Third Party Annual; syarat portal online (laporan carian): <=250cc, SI < RM30,000, umur motor <=15 tahun (comprehensive) / <=40 tahun (third-party); add-on PA penunggang","premiumBasis":null,"calculatorFeasible":"quote-gated","sources":["https://takeiteasy.msig.com.my/msigonline/products/product-landing-page.html?product=mcy"],"asAt":"2026-09-12"}
]
```

## Calculator feasibility (deliverable 2 summary)

| Calculator | Status | Basis |
|---|---|---|
| Fire / Houseowner premium | **Buildable** | `premium = rate × SI`: HO 1A 0.090%/0.093%, HO 1B 0.226%/0.243%, HH 1A 0.338%, HH 1B 0.520%; min RM60; +RM10 stamp (4 primary docs agree) |
| Motorcycle roadtax by cc | **Buildable** | JPJ LKM schedule (exact bands above); same JPJ PDF already provenance for `roadtax-rates.json` |
| Motorcycle third-party premium | **NOT buildable (flag)** | cc is a tariff rating factor (Kurnia PDS) but no authoritative public per-cc table found; all circulating tables are market estimates or unverified (MYEG table mixes roadtax bands) |
| PA premium | Partial | Flat/banded published prices exist (Tune PA Easy RM36; PA Shield RM188–1,238; Etiqa worked example) — show published prices only; no general formula |

## Flat SOURCES (all read 2026-09-12 unless noted)

**Primary (read directly):**
- https://www.jpj.gov.my/wp-content/uploads/2022/11/Garis-Panduan-Pengiraan-LKM-Bajet-20092.pdf
- https://www.jpj.gov.my/wp-content/uploads/2026/07/Lampiran-B-01.04.2026-Garis-Panduan-Kadar-LKM-Bagi-Kenderaan-Motor-Elektrik-ZEVs.pdf
- https://www.berjayasompo.com.my/product/houseowner-householder (rates + BCC link)
- https://www.takaful-malaysia.com.my/wp-content/uploads/2023/02/STMAB-PDSE-HOHH-V01-03-2023.pdf
- https://www.pacificinsurance.com.my/wp-content/uploads/2024/02/Houseowner-Householder_P-Form_CFH_V1.1_1-MAR-2024.pdf
- https://www.bsn.com.my/cms/upload/pdf/personal/wealth/general_insurance_houseowner_pds_1.pdf
- https://www.etiqa.com.my/pdfs/en/insurance/Product_Disclosure_Sheet_Weekend_Warrior_Insurance.pdf
- https://www.tuneprotect.com/my/products/pa-easy/
- https://s3-ap-southeast-1.amazonaws.com/tuneprotect.com/tpr/wp-content/uploads/pdf/Tune_Protect_PA_Shield_Brochure.pdf
- https://www.kurnia.com/download/pds/motorcycle-third-party-eng.pdf
- https://online.berjayasompo.com.my/motorcycle/docs/Motorcycle%20PDS%20_ENG%20(042023).pdf
- https://bcc.piam.org.my/ (PIAM Building Cost Calculator — linked from Berjaya Sompo)

**Name-only confirmation (NOT figure-verified — re-read before publishing figures):**
- https://www.etiqa.com.my/home/hohh-insurance · https://www.etiqa.com.my/motorcycle · https://www.etiqa.com.my/motorcycle/myRider-insurance
- https://www.zurich.com.my/insurance-products/protection/for-my-property/z-homeprotect · https://www.zurich.com.my/insurance-products/protection/for-my-vehicle/z-rider
- https://www.allianz.com.my/personal/home-motor-and-travel/home/smart-home-cover.html
- https://takeiteasy.msig.com.my/msigonline/products/product-landing-page.html?product=mcy

## Not confirmable / flagged

1. **Basic fire-only tariff rate** (bank's bare fire policy) — not found in any primary doc; quote-gated. All four tariff docs cover Houseowner/Householder.
2. **Motorcycle third-party per-cc premium table** — no authoritative public source found (PIAM Motor Tariff PDF not publicly hosted); current site's RM65–85 ranges are market estimates, must stay flagged as such.
3. **MYEG "kadar insurans motosikal 2024" table** — content not renderable (JS page) and its search snippet mixes roadtax bands with premium figures → treated as unverified, excluded.
4. **Allianz PA & home product details** — allianz.com.my returns HTTP 403 to direct reads; names only.
5. **Etiqa PA "up to RM300,000" claim from search synthesis** — contradicts PDS (max RM250k/adult); use PDS figure only.
6. JPJ PDF does not restate the ≤150cc numeric rate ("kadar sedia ada"; commonly RM2) — keep null-flagged in data.
7. BSN/Chubb houseowner PDS predates tariff liberalisation (2017) — rates are Chubb-package-specific, not the HOHH tariff.

---

**Summary:** No files changed (read-only task). Verified the HOHH fire tariff (4 primary sources agree on rates) and the full JPJ motorcycle roadtax schedule — both sufficient for honest calculators — plus 3 fully-sourced PA products and 5 sourced motorcycle products; documented that motorcycle TP premiums and bare fire-only cover are quote-gated. Verification method: direct reads of official PDFs/product pages (listed above), with search-synthesis content explicitly quarantined as unverified.

