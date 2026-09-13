# Tools / lead-magnets / financial-literacy — ideation pack (2026-09-12)

Owner-bridged Ahrefs + 3-model fan-out (GLM market research, Muse BM specs, Gemini feasibility). Build specs below are figure-safe; roadtax needs the JPJ rate table transcribed+cited before launch.

---
## GLM 5.3 Flash — market & opportunity ranking

# Findings

## 1. Competitive landscape — who owns the calculator keywords

**All top calculator keywords are held by lead-gen aggregators and insurers with gated live-quote engines** — none are honest static calculators:

| Player | Tool | Gating |
|---|---|---|
| Bjak, PolicyStreet, MyEG, oto.my/CarBase, Fincrew | "Car insurance calculator" = quote funnel | **Gated**: plate no. + NRIC + postcode + phone to pull live ISM/JPJ NCD data (bjak.my, policystreet.com.my/en/road-tax-calculator, compare.myeg.com.my) |
| Same players | Road tax calculators | **Free, ungated** — pure JPJ statutory tables, no personal data |
| RinggitPlus | Suite: home loan, car loan, income tax, DSR, personal loan, Money Meter | Free, ungated, but no insurance-specific calculator — insurance goes to broker funnel (ringgitplus.com/en/calculators/) |
| iMoney | Comparison pages, road-tax rates article | Free, EN only |
| Fi Life, MyCoverage (LIAM/MTA), FSMOne, HLA | Needs-based **life coverage gap** calculators | Free, ungated, **all English** |

**Key wedge:** the "road tax + insurance combined" cluster (`road tax insurance calculator` 150, `roadtax and insurance calculator` 100, plus spillover from `car insurance calculator` 3,000/KD29) is served either as JPJ-only or as gated quote funnels. Nobody publishes an ungated BM renewal-cost tool that combines public road-tax math with reference premium ranges.

**BM competition is thin** (verified search in BM): PolicyStreet/MyEG/CarBase have EN calculators; only Fincrew has a `/bm/roadtax-calculator`. Insurers (Etiqa tools page) are EN-first.

## 2. Financial-literacy landscape and the gap

- **FEN** (BNM+SC co-chaired, fenetwork.my) — national strategy NS2.0 2026–2030; policy-level, no consumer tools (bnm.gov.my/-/flmns2pr).
- **AKPK** (akpk.org.my/financial-education) — 4 life-stage modules, PFM curriculum, RUMAHKU; debt-counselling oriented, BM available but institutional tone.
- **FIMM** (fimm.com.my literacy surveys), **SC InvestSmart** — unit trust/PRS/scam focus; insurance coverage is a blind spot.
- **RinggitPlus RMFLS 2025** — survey content (insurance inflation, 42% uninsured) — EN only.
- **MyPF** — community/FB-led, EN, little structured insurance content.

**Gap an independent guide can own:** insurance-specific, BM-first, jargon-free consumer content (claims decisions, takaful-vs-conventional, medical limit sizing, NCD strategy) with no quote funnel. Regulators cover debt/retirement; aggregators are EN and transactional; insurers are sales channels. `perancangan kewangan keluarga` (90, KD0) and `perancangan kewangan` (100, KD0) are zero-KD BM gaps; `financial planning malaysia` (200, KD11, CPC70) shows commercial value.

## 3. Buildable-without-fabrication analysis

**✅ Public-formula buildable:**
- **Road tax (ICE saloon/non-saloon, motorcycle, EV-by-kW)** — JPJ bracket + progressive formula is public and documented (jpj.gov.my Garis Panduan LKM PDF; e.g. 2,354cc = RM380 + 353×RM1.00 = RM733). Sabah/Sarawak discounted schedules also public.
- **NCD ladder math** — already built (`src/lib/ncd.ts`); 0/25/30/38.33/45/55%.
- **"Patut ke claim?"** — already built in the NCD tool (`src/pages/tools/ncd-calculator/index.astro:439-620`).
- **Life coverage gap** — income-replacement + needs-based method is public methodology (10x rule; needs = income replacement + debts + education + funeral − assets): user inputs only, no premium output.
- **DSR-lite** — user inputs, public ratio guidance.

**⚠️ Buildable only from site's own reference data (not fabrication):** `src/data/car-models.json` already carries per-model `premiumNCD0Min/Max`, `marketValueMin/Max`, add-on price ranges (38 models, lines 2–7068). A renewal-cost estimator can use these **clearly labeled as insurans.co reference ranges**, never as live quotes. This is what the existing NCD tool already does for its "model reference" panel.

**❌ NOT buildable without fabrication — flag:**
- Any calculator outputting a **specific insurer premium** for car/motorcycle/takaful/medical (Bjak-style quote engine). Motor pricing post-detariffication depends on insurer-specific loadings; no public tariff exists.
- `medical insurance calculator malaysia` (150) → honest version outputs a **recommended annual-limit figure** (user inputs + public private-hospital cost ranges + site's PDS-sourced `medical-cards.json`, which explicitly records "tiada harga premium dianggar atau direka"), never a premium.
- `takaful car insurance calculator` (90) → premium half not buildable; only the "NCD also applies to takaful; takaful-vs-insurance differences" explainer is honest.

## 4. Lead-capture on a static, no-sell site

Site has **zero email capture today** (verified: grep across `src` finds only incidental "e-cover note masuk email" copy). Static-compatible options, verified:
- **Buttondown** — plain HTML form POST to `buttondown.com/api/emails/embed-subscribe/<user>`; zero JS, no tracking pixels (docs.buttondown.com). Best privacy fit for a "bukan ejen" trust brand.
- **MailerLite** — HTML-form-only embed works; omit the universal tracking snippet (mailerlite.com help).
- **Tally/Google Forms embed** — for delivering a gated PDF checklist.
All fit the independence model **if** the newsletter sells nothing — it's content (renewal reminders, claim guides), not quotes. Disclosure line ("kami jual apa-apa, newsletter ni panduan sahaja") should accompany it.

---

# RANKED OPPORTUNITY LIST

Top 5 marked ★. Dimensions abbreviated: demand / audience / uniqueness / path-to-value / feasibility / maintenance / links.

**★ 1. Kalkulator Cukai Jalan + Kos Pembaharuan (road tax × insurance reference combo)**
- Type: calculator. Keyword: `road tax insurance calculator` 150 + `roadtax and insurance calculator` 100 + intercepts `car insurance calculator` 3,000 (KD29) intent honestly.
- Output: road tax from JPJ public formula (region saloon/non-saloon/EV-kW/motorcycle) **plus** insurans.co reference premium range from `car-models.json` (labeled "anggaran rujukan, bukan quotation") = total renewal cost.
- Data: JPJ public formula + site's own published ranges. No insurer price.
- Feasibility: yes, static client-side — reuse NCD tool's pattern (`<script>` + JSON via `textContent` + `track()`).
- Lead capture: "email saya reminder pembaharuan" → Buttondown. Natural annual-renewal email hook.
- Independence: strongest possible — government formula, and "no NRIC needed, unlike Bjak/MyEG" is itself a trust message.
- Scorecard: demand med-high / audience exact (every Malaysian motorist) / uniqueness high (BM, ungated, no-NRIC) / value immediate / feasibility high / maintenance low (JPJ tables change rarely; EV table fresh 2026) / link-worthy high.

**★ 2. Kalkulator Perlindungan (life coverage gap)**
- Type: calculator + lead magnet. Keywords: `life insurance calculator malaysia` 200 (KD8) + `life insurance premium calculator malaysia` 200 (KD6 — flag: premium half not buildable; target the coverage-amount intent).
- Output: target sum assured = (income replacement × years) + debts + education + final expenses − EPF/savings/existing cover; BM "jurang perlindungan" verdict.
- Data: 100% user inputs + public methodology. No premium output — one line: "premium bergantung umur/produk; dapat quotation sebenar."
- Feasibility: static yes. All existing gap calculators (Fi Life, MyCoverage, FSMOne, HLA) are English — BM is an open field.
- Lead capture: highest — "hantar hasil ni ke email" / printable summary → newsletter. `financial planning malaysia` KD11 CPC70 proves monetizable adjacent intent.
- Independence: perfect — advice, not price.

**★ 3. BM financial-literacy pillar: "Perancangan Kewangan Keluarga" content cluster**
- Type: literacy content/lead magnet. Keywords: `perancangan kewangan` 100 (KD0), `perancangan kewangan keluarga` 90 (KD0), `financial planning malaysia` 200 (KD11, CPC70), `literasi kewangan` 100.
- Output: BM guides on protection-gap method, budgeting before buying cover, takaful-vs-insurance, mySalam/Perlindungan Tenang/SOCSO stacking (public safety nets aggregators ignore because unsellable).
- Data: public (FEN NS2.0 themes, AKPK life stages as structure, site's existing guides).
- Feasibility: static yes. Lead capture: each guide ends with newsletter CTA; top guide expands into downloadable checklist PDF.
- Independence: this is the authority play regulators aren't doing in consumer-BM language.
- Links: zero-KD terms + unique safety-net angle = citable resource.

**★ 4. Semak Kecocokan Medical Card (limit fit-check, not price)**
- Type: calculator/guided tool. Keyword: `medical insurance calculator malaysia` 150.
- Output: "annual limit yang masuk akal untuk situasi anda" — user inputs (private hospital preference, family size, employer cover) compared against **site's PDS-sourced** `medical-cards.json` limits/deductibles/co-insurance (aia, great eastern, etc. — sourced from official PDS PDFs, premium-free by design). Verdict: "had anda cukup / terlalu rendah / over-insured."
- Data: user input + site data (PDS). **Flag: premium output not buildable** — keep it limits-only.
- Feasibility: static yes; JSON already exists.
- Lead capture: moderate; strong internal-link hub to medical-cards vertical.
- Independence: distinctive — "kami tak boleh bagi harga premium, tapi kami boleh bagitahu limit berapa you patut target" is exactly the no-sell positioning.

**★ 5. Newsletter lead magnet: "Panduan 15 Minit Sebelum Renew" (PDF + Buttondown)**
- Type: lead magnet. No keyword — conversion layer for picks 1, 2, 4 and existing NCD tool.
- Output: renewal checklist (sum insured check, NCD, add-ons, e-LKM note — JPJ went digital-only Feb 2026), claim-decision flowchart, medical-limit worksheet.
- Data: site's own existing guides (flood, comprehensive-vs-TP, NCD explained) repackaged.
- Feasibility: static yes — Buttondown HTML embed, no backend, no JS dependency.
- Lead capture: the capture mechanism itself. Fit: good **only if** explicitly content-only; add one-line "ini bukan sebut harga" disclaimer.
- Independence: consistent with "bukan ejen, bukan broker" if the list never carries offers.

**6. Kalkulator NCD Motor (extend to motorcycle) — `motorcycle insurance calculator malaysia` 200**
- Road-tax half: buildable (public cc-based motorcycle bands). Premium half: **flag — not buildable**; site has no motorcycle premium reference data (none in `car-models.json` or dedicated file). Ship as "Kalkulator Cukai Jalan Motor + NCD terpakai?" educational page; low priority until demand proven.

**7. "Kalkulator Takaful Kereta" — `takaful car insurance calculator` 90**
- **Flag: premium output requires fabrication.** Honest version = decision helper: "boleh guna NCD dalam takaful? (ya, public)" + takaful-vs-conventional comparison page (site already has `/guides/insurance-vs-takaful/` to interlink). Volume (90) doesn't justify more.

**8. "Patut ke Claim?" as standalone tool page** — already built inside NCD tool; carving out `/tools/patut-ke-claim/` with its own schema is cheap internal-linking, no new demand data (not scored).

---

# Not buildable without fabrication (explicit flags)
- Quote-style `car insurance calculator` / `insurance calculator` (3,000/2,200): post-detariffication motor premiums are insurer-proprietary; any number = fabrication. Serve the intent via picks 1+4 with labeled reference ranges and a "dapat quotation sebenar" handoff.
- `life insurance premium calculator malaysia`: premium output not buildable; coverage-amount output is.
- `takaful car insurance calculator`, motorcycle premium: same.

# Verification & limitations
- Verified in repo: static Astro, client-side calculator pattern + `track()`, no email capture anywhere in `src`, JSON data assets (`car-models.json` 38 models with premium ranges; `medical-cards.json` PDS-sourced, premium-free methodology note).
- Verified via web: competitor tool inventories and gating; JPJ public formula incl. EV; EN-only gap-calculator landscape; Buttondown/MailerLite static embeds.
- Not verified: exact SERP holders per keyword (Ahrefs data is owner's; I used search corroboration, not a rank tracker); Buttondown/MailerLite current pricing tiers; whether car-models.json premium ranges have a stated methodology note like medical-cards.json (found note only in the latter — owner should confirm sourcing for the former before it feeds more tools).

# Open questions for owner
1. Confirm `car-models.json` premium ranges have documented sourcing (medical-cards.json has a methodology note; car-models.json's wasn't found in the sampled lines) before reusing in a renewal-cost calculator.
2. Newsletter cadence/volume appetite — pick 5's value depends on an annual-renewal reminder cycle the owner will actually sustain.
3. Priority language: all picks are BM-first; do EN variants get a second pass later?

---

**Summary:** Read-only research, no files touched, no commits. Mapped competitor calculator landscape (Bjak/PolicyStreet/MyEG gated quotes vs ungated road-tax tools vs EN-only gap calculators), confirmed the BM + independent + no-NRIC wedge, catalogued public-formula vs fabrication-required calculators, and verified static email-capture paths. Delivered a ranked 8-item opportunity list with 5 marked picks, each scored on demand/audience/uniqueness/value/feasibility/maintenance/link-worthiness, with fabrication flags on all premium-output calculators. Evidence from `src/lib/ncd.ts`, `src/pages/tools/ncd-calculator/index.astro`, `src/data/car-models.json`, `src/data/medical-cards.json`, and cited web sources throughout.


---
## Muse Spark 1.3 — BM specs + UX copy (build-ready)

# Set Kalkulator + Lead-Magnet + Literasi Kewangan untuk insurans.co

> Register: BM santai macam Kalkulator NCD sedia ada ("Masukkan… tengok berapa…"). Bukan ejen, bukan broker. Tiada harga direka, tiada quote dijanjikan.

---

## 1. Kalkulator (static, formula awam / input pengguna sahaja)

### Kalkulator A — Kalkulator Roadtax JPJ

**BM name:** Kalkulator Roadtax Kereta (JPJ)

**Input (semua dari pengguna):**
- Kapasiti enjin (cc) — nombor, cth 1,498
- Wilayah — radio: Semenanjung / Sabah & Sarawak / Langkawi & Labuan (bebas duti — papar nota, bukan kiraan)
- Jenis kenderaan — dropdown: kereta persendirian (saloon) sahaja buat fasa 1; motosikal/kenderaan diesel/commercial ditolak dengan mesej "belum disokong"

**Output:**
- Roadtax setahun (RM) — satu nombor
- Pecahan: "cc anda jatuh dalam band X → kadar asas RM__ + RM__ bagi setiap cc tambahan"
- Peringatan: "Ini roadtax JPJ sahaja — belum termasuk premium insurans/takaful."

**Formula/logik (asas awam):**
- Jadual kadar Lesen Kenderaan Motor JPJ — kadar bertingkat ikut band cc, berbeza Semenanjung vs Sabah/Sarawak. Asas awam: portal JPJ / MyEG memaparkan jadual "Road Tax Rates — Private Saloon Vehicles" (cth struktur: kadar rata untuk band rendah, kemudian kadar asas + kadar per-cc untuk band lebih tinggi).
- Logik binaan: `if cc <= sempadan_band → kadar_rata; else → kadar_asas_band + (cc − ambang) × kadar_per_cc`, kemudian pilih jadual ikut wilayah.
- ⚠️ **Flag data:** jadual angka penuh belum ada dalam repo (`car-models.json` ada medan roadtax per model, bukan jadual JPJ). Builder MESTI transkrip angka dari jadual JPJ rasmi dan letak sumber + tarikh semakan sebelum launch. Jangan guna angka dari memori/blog pihak ketiga.

**Disclaimer (ikut nada NCD calc):**
> Anggaran berpandukan jadual kadar JPJ awam (disemak [tarikh]). Roadtax sahaja — bukan premium insurans. Kadar muktamad ikut JPJ/MyEG. Kami bukan ejen, bukan broker.

**Kenapa fit:** trafik renew-stage sedia ada ("renew roadtax"), kiraan 100% deterministik dari jadual awam, tiada premium direka, pasangan semula jadi untuk Kalkulator NCD (dua calc dalam satu page macam layout NCD sedia ada: Calc 1 = roadtax, Calc 2 = "roadtax + insurans saya = kos renew tahun ni?").

---

### Kalkulator B — Kalkulator Coverage Nyawa (Income-Replacement)

**BM name:** Kalkulator Coverage Nyawa — Berapa Cukup Untuk Keluarga Saya?

**Input (semua dari pengguna, tiada harga pasaran):**
- Pendapatan bulanan bersih (RM)
- Berapa tahun keluarga perlu disokong (default 10 — boleh ubah 5/10/15/20)
- Jumlah hutang tertunggak (RM) — rumah + kereta + personal
- Perbelanjaan khas sekali (RM) — cth pendidikan anak, kos sara ibu bapa
- Simpanan sedia ada (RM) — simpanan + EPF yang boleh diakses keluarga
- Coverage sedia ada (RM) — polisi/majikan/mySalam (optional, default 0)

**Output:**
- Jurang coverage (RM) — satu nombor besar
- Pecahan 4 baris: (a) gantian pendapatan, (b) + hutang, (c) + perbelanjaan khas, (d) − simpanan & coverage sedia ada
- Frasa tafsir (bukan nasihat): "Dalam lingkungan RM__ – RM__" + "Ini keperluan kasar, bukan cadangan produk."

**Formula (input pengguna tulen, tiada andaian harga):**
```
gantian_pendapatan = pendapatan_bulanan × 12 × tahun_sokongan
keperluan_kasar   = gantian_pendapatan + hutang + belanja_khas
jurang            = keperluan_kasar − simpanan − coverage_sedia_ada
(jurang < 0 → papar "0 — coverage sedia ada melebihi keperluan kasar ini")
```
Tanpa inflasi/pulangan dalam fasa 1 (nota kaki: "kiraan ringkas, tak ambil kira inflasi/pulangan pelaburan").

**Disclaimer:**
> Ini alat kira keperluan kasar dari nombor anda sendiri — bukan cadangan produk, bukan quote premium. Kami tak jual polisi dan tak tahu harga anda. Sahkan dengan perancang kewangan berlesen jika perlu.

**Kenapa fit:** bukan-ejen tulen (tak sebut sebarang produk/premium), guna data pengguna sahaja jadi mustahil "fabricate", buka pintu ke artikel literasi (bahagian 3) tanpa menjual.

---

### Kalkulator C — "Berapa Medical Card Limit Patut?" (guidance tool, BUKAN quote)

**BM name:** Panduan Had Medical Card — Limit Berapa Masuk Akal Untuk Saya?

**Input:**
- Umur (band: <30 / 30–45 / 45–60 / 60+)
- Bandar rawatan biasa — radio: Lembah Klang/Johor/Penang (kos swasta tinggi) vs bandar lain
- Bajet bulanan untuk medical (RM — pengguna isi sendiri, bukan kami beri harga)
- Keutamaan — checkbox: hospital panel luas / bilik selesa / rawatan luar negara (jaga jangkaan)

**Output (ranges/nasihat, BUKAN premium):**
- Band had tahunan yang munasabah: Sederhana (cth "sekitar RM1j") / Tinggi ("RM2–4j") — sebagai label pendidikan, bukan angka bil
- 3 baris semak dari data sedia ada: deductible vs co-insurance vs room & board ("deductible tinggi = caruman lebih rendah, tapi bayar lebih masa claim — semak PDS")
- CTA bukan-jualan: "Bandingkan 3 PDS dari `medical-cards.json` kami →" + link ke page medical card

**Logik (rule-of-thumb telus, bukan formula harga):**
```
IF umur 45+ ATAU bandar kos-tinggi → syor band "Tinggi"
ELSE IF bajet pengguna rendah → syor band "Sederhana" + nota "deductible boleh legakan bajet"
IF pilih "rawatan luar negara" → nota "kebanyakan rider tempatan terhad — semak klausa geografi dalam PDS"
```
Semua threshold dipapar di page ("kenapa kami syorkan ini"), boleh audit.

**Disclaimer:**
> Ini panduan pendidikan, bukan quote dan bukan janji harga. Had sebenar + premium ikut underwriting dan PDS penginsurans. Kami bukan ejen — kami tak tahu premium anda.

**Kenapa fit:** jawab soalan shopper sebenar tanpa menyentuh harga (yang dilarang), guna data `medical-cards.json` yang dah ada (annual limit, deductible, panel), kekalkan independence.

---

### Kalkulator D (simpanan — bina kemudian) — Kalkulator "Claim vs Bayar Sendiri" Generik

Dah wujud sebagai Calc 2 dalam page NCD (excess + repair + NCD reset). Jangan bina baru — cuma link silang dari Kalkulator Roadtax ("Dah kira roadtax? Semak NCD anda →"). Catat di sini supaya tak ada duplikasi.

---

## 2. Lead-Magnet (BM downloadables — checklist/cheat-sheet, email-optional)

Semua: satu page HTML statik (boleh print/Save-as-PDF) + butang WhatsApp-share. Gating: **email-optional** — papar penuh di page, borang "nak PDF via email?" sekadar pilihan (static site, tiada backend — guna provider form sedia ada atau `mailto:`; jangan fake-gate).

### LM1 — Checklist Pilih Medical Card (8 Perkara)
- **Format:** checklist 1-page (HTML + print CSS)
- **8 poin (grounded `medical-cards.json` + PDS):** 1) annual limit vs lifetime limit, 2) room & board (RM/hari), 3) deductible (berapa bayar dulu), 4) co-insurance/co-takaful %, 5) waiting period 30/120 hari, 6) panel hospital (dekat rumah?), 7) renewal dijamin? COI dijamin?, 8) rider vs standalone (apa asas polisi dia tumpang?)
- **Gating:** tiada — CTA "bandingan penuh medical card →" di bawah
- **Attach ke:** `/medical-cards/` (atau hub medical bila wujud) + link dari Kalkulator C

### LM2 — Senarai 36 Penyakit Kritikal BNM (PDF Rujukan)
- **Format:** cheat-sheet rujukan (bukan nasihat)
- **Kandungan:** senarai 36 definisi standard BNM (berkuat kuasa 1 April 2016 — fakta dalam `critical-illness.json` methodologyNote) + 3 baris penerang: standalone vs rider vs skim (mySalam RM8,000 — dari rekod `mysalam`), "early-stage" maksud apa (rujuk rekod AIA/Great Eastern/Zurich), pautan sumber PDS setiap baris
- **Gating:** email-optional ("nak versi PDF kemas?")
- **Attach ke:** hub critical-illness + artikel literasi #4 (bahagian 3)
- ⚠️ **Flag data:** senarai penuh 36 nama perlu ditaip dari dokumen BNM rasmi — jangan guna senarai blog; semak ejaan BM/BI.

### LM3 — Panduan Renew Insurans + Roadtax Online (Langkah-demi-langkah)
- **Format:** panduan 1-page bernombor
- **7 poin (grounded aliran renew sedia ada PRODUCT.md + guides):** 1) semak NCD (MyEG/tanya ejen), 2) semak nilai pasaran kereta (sum insured), 3) banding quotation aggregator, 4) pilih add-on perlu saja (cermin/banjir), 5) bayar (FPX/kad) → simpan e-cover note, 6) renew roadtax (JPJ/MyEG/Pos), 7) simpan PDF polisi + tarikh renew tahun depan
- **Gating:** tiada — ini SEO/utility page
- **Attach ke:** `/guides/renew-car-insurance/` + Kalkulator NCD + Kalkulator Roadtax (segitiga dalaman)

### LM4 — Checklist Travel Insurance Sebelum Fly
- **Format:** checklist pra-berlepas
- **8 poin (grounded `travel-insurance.json`):** 1) single vs annual trip, 2) had perubatan overseas, 3) evakuasi & repatriasi (hotline 24-jam? cth MSIG), 4) trip cancellation/delay (dari jam ke berapa?), 5) liputan COVID (yes/add-on/no ikut rekod), 6) tier kawasan (domestik ≥50km? Asia? worldwide?), 7) sukan lasak (scuba/s nowboard — rujuk rekod Zurich), 8) dokumen claim (resit, laporan polis, diagnosis doktor)
- **Gating:** email-optional
- **Attach ke:** hub travel (nota: link `/travel-insurance/` dari homepage dilaporkan broken — betulkan dulu sebelum attach)

---

## 3. Siri Literasi Kewangan (BM, rakyat-biasa, beritahu keputusan insurans — bukan menjual)

1. **"Gaji RM3,000: Berapa Sebenarnya Untuk Perlindungan?"** — angle: bajet 50/30/20 versi Malaysia, tetapkan siling perlindungan dari gaji bukan dari ejen; informs: Kalkulator B + medical card budget input.
2. **"EPF, Simpanan & Insurans: Mana Dulu?"** — angle: susunan asas (dana kecemasan → EPF/i-Lindung → top-up swasta); informs: tolak-simpanan dalam Kalkulator B, rekod Etiqa i-Lindung.
3. **"Deductible & Co-Insurance Dalam Bahasa Manusia"** — angle: analogi "bayar dulu RM500, kongsi 5%" dengan contoh bil hospital; informs: Kalkulator C + LM1.
4. **"36 Penyakit Kritikal: Apa Standard BNM Sebenarnya Cover?"** — angle: BNM seragamkan definisi sejak 2016 — rider vs standalone vs early-stage; informs: LM2 + hub CI.
5. **"Travel Insurance: Bila Perlu, Bila Membazir?"** — angle: domestik dekat vs overseas jauh, annual-trip math untuk yang kerap fly; informs: LM4.
6. **"Renew Roadtax & Insurans Tanpa Panik Setiap Tahun"** — angle: ritual tahunan (NCD → sum insured → roadtax) + fail PDF; informs: Kalkulator A + LM3 + NCD calc.

---

## 4. Draf Siap-Bina (TOP 2 kalkulator + TOP 2 lead magnet)

### DRAF 1 — Kalkulator Roadtax (UX copy penuh)

> **H1:** Kalkulator Roadtax Kereta 2026
> **Intro:** Masukkan cc kereta dan wilayah — tengok roadtax JPJ setahun dalam beberapa saat. Ini roadtax sahaja, belum termasuk premium insurans. Bukan ejen, bukan broker — nombor ini ikut jadual JPJ awam.
>
> **Label input:**
> - "Kapasiti Enjin (cc) — cth: 1498" (helper: "Tengok dalam geran/VOC kereta anda.")
> - "Wilayah" — (○) Semenanjung (○) Sabah & Sarawak (○) Langkawi / Labuan — bebas duti
> - Butang: "Kira Roadtax Saya"
>
> **Output:**
> - Besar: "Roadtax setahun anda: **RM__**"
> - Kecil: "Enjin 1,498cc · Semenanjung · band 1,600cc ke bawah. Kadar: RM__ asas + RM__ × __cc tambahan."
> - Nota Langkawi/Labuan: "Langkawi & Labuan bebas duti — semak portal JPJ untuk pengesahan."
>
> **Bawah output:** "Nak kos penuh renew? Premium insurans anda (selepas NCD) + roadtax ini = belanja tahun ni. [Semak NCD saya →](/tools/ncd-calculator/)"
>
> **Disclaimer (wajib, nada sedia ada):**
> Anggaran berpandukan jadual kadar JPJ awam (disemak [TARIKH]). Roadtax sahaja — bukan premium insurans. Kadar muktamad ikut JPJ/MyEG. Maklumat am sahaja, bukan nasihat. Kami bukan ejen, bukan broker.
>
> **Schema:** tiru NCD calc — `WebApplication` + `Offer price 0 MYR` + breadcrumb Tools.

### DRAF 2 — Kalkulator Coverage Nyawa (UX copy penuh)

> **H1:** Kalkulator Coverage Nyawa — Berapa Cukup Untuk Keluarga?
> **Intro:** Jawab 6 soalan tentang nombor anda sendiri. Kami tak tanya nama, tak jual apa-apa — cuma kira jurang kasar supaya anda ada angka sebelum bercakap dengan sesiapa.
>
> **Label input:**
> 1. "Gaji bersih sebulan (RM) — cth: 4,000"
> 2. "Berapa tahun keluarga perlu disokong? — [5] [10] [15] [20]" (default 10)
> 3. "Jumlah hutang (rumah + kereta + lain-lain) (RM)"
> 4. "Belanja khas sekali (pendidikan anak dsb.) (RM) — boleh 0"
> 5. "Simpanan sedia ada + EPF (RM) — boleh 0"
> 6. "Coverage sedia ada (polisi/majikan) (RM) — boleh 0"
> - Butang: "Kira Jurang Saya"
>
> **Output:**
> - Besar: "Jurang coverage kasar anda: **RM__**"
> - Pecahan (4 baris, ikut PRODUCT principle "answer first, explain second"):
>   - Gantian pendapatan: RM__ (__ × 12 × __ tahun)
>   - (+) Hutang & belanja khas: RM__
>   - (−) Simpanan & coverage sedia ada: RM__
>   - (=) Jurang: RM__
> - Tafsir: "Ini keperluan kasar, bukan cadangan produk dan bukan quote. Kalau jurang besar, baca [Gaji RM3,000: berapa untuk perlindungan? →] dulu sebelum jumpa sesiapa."
>
> **Disclaimer:** Alat pendidikan dari nombor anda sendiri. Bukan cadangan produk, bukan quote premium, bukan nasihat kewangan. Kami tak jual polisi. Untuk nasihat peribadi, jumpa perancang kewangan berlesen.

### DRAF 3 — LM1 Checklist Pilih Medical Card (kandungan penuh)

> **H1:** Checklist Pilih Medical Card — 8 Perkara Wajib Semak (Sebelum Tandatangan)
> **Intro:** Print page ni. Tanya 8 soalan ni pada mana-mana ejen atau PDS — kalau dia tak boleh jawab, jangan sign dulu. Kami bukan ejen, bukan broker.
>
> 1. ☐ **Had tahunan (annual limit) berapa?** — Cukup untuk bil swasta di bandar saya? (Rujukan data kami: ada plan RM1j–RM4j.)
> 2. ☐ **Ada had seumur hidup?** — "No limit" ke ada siling?
> 3. ☐ **Bilik & penginapan (room & board) RM/hari?** — Cth RM150/250/400 — selesa dengan expectation saya?
> 4. ☐ **Deductible berapa?** — Berapa saya bayar dulu setiap kali (cth RM300/RM500/RM1,000)?
> 5. ☐ **Co-insurance berapa %?** — Lepas deductible, berapa % saya kongsi (cth 5%)?
> 6. ☐ **Waiting period?** — 30 hari penyakit am, 120 hari penyakit tertentu — saya faham?
> 7. ☐ **Hospital panel mana dekat rumah saya?** — Cashless ke pay-and-claim?
> 8. ☐ **Renewal dijamin? Caj (COI) dijamin?** — Buka PDS, cari dua ayat ni. Kalau tak jumpa, tanya bertulis.
>
> **Penutup + CTA:** Dah tanda 8? Bandingkan plan sebenar dalam [data medical card kami →] dan cuba [Panduan Had Medical Card →]. Simpan PDF PDS — jangan percaya brosur saja.

### DRAF 4 — LM3 Panduan Renew (kandungan penuh)

> **H1:** Renew Insurans + Roadtax Online — 7 Langkah Tanpa Panik
> **Intro:** Ritual tahunan anda, dalam satu page. Ikut turutan — jangan langkau langkah 1 (NCD).
>
> 1. **Semak NCD anda** — MyEG atau tanya ejen. Screenshot.
> 2. **Semak nilai pasaran kereta** — sum insured ikut nilai semasa, bukan harga beli dulu.
> 3. **Banding 2–3 quotation** — aggregator macam Bjak.my/PolicyStreet untuk rujukan harga (itu rujukan, bukan ranking editorial kami).
> 4. **Add-on perlu saja** — cermin? banjir (special perils)? Tolak yang tak perlu.
> 5. **Bayar & simpan e-cover note** — FPX/kad; simpan PDF polisi.
> 6. **Renew roadtax** — JPJ/MyEG/Pos; cuba [Kalkulator Roadtax →] untuk semak angka.
> 7. **Set peringatan tahun depan** — kalendar + folder "Renew 2027".
>
> **Penutup:** Jumlah belanja tahun ni = premium (selepas NCD) + roadtax. Kira kedua-dua dengan [Kalkulator NCD →] dan [Kalkulator Roadtax →].

---

### Flag data yang tiada (blocker sebelum bina)
- **Jadual angka JPJ penuh** (setiap band cc + kedua-dua wilayah) + tarikh semakan + URL sumber — tanpa ini Kalkulator Roadtax tak boleh launch.
- **Senarai rasmi 36 penyakit BNM** (teks + sumber PDF BNM) — tanpa ini LM2 tak boleh launch.
- **Betulkan link `/travel-insurance/` broken** (PRODUCT.md) sebelum attach LM4.
- Bukan blocker: medical/travel/CI PDS links sedia ada dalam `sources[]` — guna semula, jangan salin harga (rekod sememangnya `null` untuk yang quote-gated — kekalkan null).

---

**Ringkasan tugasan:** tiada fail ditulis/diubah (tugasan baca-sahaja) — fail dibaca: `src/pages/tools/index.astro`, `src/pages/tools/ncd-calculator/index.astro` (sebahagian, 44–300), `PRODUCT.md`, `src/pages/guides/index.astro`, plus sampel `medical-cards.json`, `critical-illness.json`, `travel-insurance.json` dan senarai `src/data/*.json`. Pengesahan: pola dua-kalkulator + nada disclaimer + struktur schema `WebApplication` disahkan dari kod NCD calc; grounding data lead-magnet disahkan dari rekod JSON sebenar.


---
## Gemini 3.8 Flash — technical feasibility

# Feasibility Memo — New Calculators + Lead Capture (insurans.co)

## 1. The existing pattern (what's reusable)

**Architecture: static page + pure lib + inline client script.** No framework state, no build-time JS. Three layers:

| Layer | Where | Pattern |
|---|---|---|
| SEO/schema | `src/pages/tools/ncd-calculator/index.astro:4-30` | `WebApplication` schema (`applicationCategory: FinanceApplication`, `offers.price: 0`, publisher, breadcrumb) passed to `Base` via `schema` prop; `Base.astro:106-108` renders it with `withAuthor()` from `src/lib/schema.ts:31-33`. |
| Pure logic | `src/lib/ncd.ts` | Tier table as `as const` array (`NCD_TIERS:9-15`), pure fns `simulate:22-28`, `basePremiumFromCurrent:38`, formatter `rm:42`. Zero DOM, fully unit-testable, imported by both `.astro` frontmatter and the client `<script>`. |
| Client wiring | `ncd-calculator/index.astro:446-623` | One inline `<script>` (Astro bundles+TS-checks it): module-scope state var (`selectedNCD:449`), `getElementById` + null guards, event listeners, `innerHTML` for result rendering. |

Specific reusable mechanics:

- **URL-param prefill + validation**: `?model` and `?ncd` parsed at `index.astro:494-522`; unknown model slug or non-tier NCD value collected into `invalidParams` and surfaced via a hidden `#handoff-note` warning element (`:89,527-530`) instead of silently rendering. This is the handoff pattern — `AnswerCard.astro:34` links `…?model=${slug}&ncd=${tier}` into the calculator. New tools should keep the same "valid param preselects, invalid param warns" contract.
- **Data without runtime fetch**: reference data shipped as JSON `<script type="application/json" id="model-reference-data">` (`index.astro:139`) parsed client-side (`:486-489`). `src/data/car-models.json` (7068 lines, has `engineCC` per model, e.g. `"1.0L (998cc)"`) already exists — a roadtax calculator can reuse it for a "pick your model" affordance or ignore it.
- **Analytics**: `src/lib/track.ts:5-8` pushes `{event, …params}` to `window.dataLayer` (GTM `GTM-T3LMP78G`, `Base.astro:125-130`). Tool events fired at point of result: `ncd_calculate` (`ncd-calculator:478-483`), `ncd_claim_check` (`:570-574`). Same pattern for new tools: one event per completed calculation, raw inputs as params.
- **A11y**: proper `<label for>` on all inputs (`:85-87, 154-156, 187-189, 206-208`), skip-link and `data-page-type` from `Base.astro:133,144`. **Gap to not copy**: results are written via `innerHTML` into divs without `aria-live`/`role="status"` (`#ncd-result:103`, `#claim-result:251`), and `#claim-result` is fetched with a non-null assertion (`:547`). New calculators should add `role="status" aria-live="polite"` on result containers — a one-attribute fix.

**Template for a new tool**: `src/pages/tools/<tool>/index.astro` (hero + breadcrumb + `pageType="tool"` + WebApplication schema + calculator card + editorial content/FAQ + related-links grid) + `src/lib/<tool>.ts` (pure) + a card in `src/pages/tools/index.astro:33-40` (currently hardcoded grid, one entry). Everything ships as static HTML + one small JS chunk; total marginal JS ≈ a few KB.

## 2. Per-candidate effort & feasibility

| Candidate | Effort | Feasible client-side? | Notes |
|---|---|---|---|
| **Kalkulator Roadtax** | **LOW** | ✅ Yes — fully encodable | JPJ formula is public and purely arithmetic: flat rates ≤1600cc, then `base + (excess cc × rate)` per bracket, saloon vs non-saloon, Semenanjung vs Sabah/Sarawak/Labuan (sources: [Kurnia](https://www.kurnia.com/blog/road-tax-price-malaysia), [Paultan](https://paultan.org/research/tools/road-tax/), [Loanstreet](https://loanstreet.com.my/learning-centre/road-tax-amount-malaysia)). Data need: a small ~10-row bracket table per (region × body) in `src/lib/roadtax.ts` — same shape as `NCD_TIERS`. Inputs: cc number + 2 selects. No insurer data, no fabrication risk (it's a statutory tariff, not a price quote). Bonus: `car-models.json` already carries `engineCC`, so a model slug could prefill cc via the existing JSON-island pattern. Watch: West-vs-East rates differ substantially; also company-registered vehicles cost ~2.5–3× — ship v1 as **private individual only** and label it, otherwise the select matrix grows. |
| **Kalkulator Coverage Nyawa** (income replacement) | **LOW** | ✅ Yes — pure user input | Standard formula: `annual income × multiplier (10–15, age-banded) + debts − liquid assets`, or DIME. All inputs user-supplied; output a *range + explanation*, never a product price. This stays inside the no-fabrication constraint as long as the result is framed as "keperluan coverage" not "harga polisi". Straight reuse of the lib+script pattern; effort is mostly the editorial explanation content. |
| **Medical card limit guidance** | **MED** | ✅ Yes, with care | Feasible as *advice ranges* (inputs: age, city, ward preference → suggested annual limit band, e.g. RM100k/150k/200k+ classes) sourced from published claim-cost statistics. **MED not LOW** because the honest version needs a documented source basis (the repo already has `data: medical-cards` datasets and provenance docs per commit `71aedce` — reuse that sourcing discipline). Must show guidance bands + "semak polisi sebenar" links, never a premium figure. |
| **Any premium/quote calculator** (e.g. "kira premium insurans kesihatan anda") | — | ❌ **NOT feasible without fabrication** | Real premiums are insurer rate-card + underwriting data. On a static site with no backend and no insurer feeds, any output would be an invented price — exactly what the "bukan ejen" independence model forbids. The NCD calculator dodges this by computing a *discount on the user's own real premium*. The only compliant variants are: user supplies their own premium (existing pattern), or statutory tariffs (roadtax). Do not build quote estimators; route that intent to the existing outbound partner links (`track.ts:26-39` already tracks `outbound_click` by partner). |

## 3. Lead capture / email on static

**Deployment reality**: this is not Netlify/Cloudflare — it's a static `dist/` served by nginx in Docker (`Dockerfile:1-13`, `output: 'static'` in `astro.config.mjs`). So:

- **Netlify Forms / Cloudflare Pages forms**: not available — the host is nginx in a container. A Cloudflare Worker would only apply if the domain actually proxies through Cloudflare; unverifiable from the repo, so don't assume it.
- **No CSP constraint**: `nginx.conf` sets `X-Frame-Options: SAMEORIGIN`, `nosniff`, HSTS, `Permissions-Policy` — but **no `Content-Security-Policy` header** (verified: `nginx.conf:7-12`, full file read). GTM script from `googletagmanager.com` already loads (`Base.astro:125-130`). So an embedded third-party form (Mailchimp/Brevo/Kit inline form or iframe) works with **zero nginx changes**. `X-Frame-Options: SAMEORIGIN` only blocks *others framing you out*, not you embedding theirs — only relevant if you ever add `frame-ancestors` via a future CSP; note it then.
- **GTM/consent**: `Base.astro:116-118` defaults `ad_storage/ad_user_data/ad_personalization: denied` globally and `analytics_storage: denied` in EEA/UK, granted elsewhere (my — analytics on). An embedded newsletter form's own tracking pixels would run outside this consent gate — for a Malaysian-audience newsletter this is a minor, disclose-in-privacy-policy matter, but it's a real (small) inconsistency with the consent posture worth a line in `src/pages/privacy/`.
- **Independence model**: a **newsletter/email-subscribe** is consistent with "bukan ejen" — it sells nothing and discloses nothing to insurers. A **lead form that routes users to agents/insurers for commission** is *not* — it converts the site into an intermediary and breaks the editorial claim. Recommendation: only the newsletter flavor.

**Recommendation — lightest honest option**: a plain **`mailto:` or no-JS newsletter link**, or an embedded third-party newsletter form (Kit/Brevo/Mailchimp) on `/tools/` and tool result cards. Ranked:
1. **Newsletter via embedded third-party form** (LOW effort, ~1 component + 2 placements) — third party stores/handles the email; nothing touches your stack; disclosure in privacy page (`src/pages/privacy/index.astro:130` already lists contact email).
2. **`mailto:` CTA** — zero new surface, already the contact pattern (`src/pages/about/index.astro:165`); fine as a stopgap, but no list-building.
3. Netlify/Cloudflare-native forms — **not applicable** to this host; would require adding a backend endpoint, contradicting the static/no-backend constraint. Advise against.

## 4. Recommended build order

1. **Kalkulator Roadtax** — LOW effort, highest likely search demand ("kalkulator cukai jalan" is a high-volume Malaysian query), pure statutory formula = zero independence risk, reuses `NCD_TIERS`-style table + entire page pattern. Ship private-individual, all 3 regions, saloon+non-saloon.
2. **Kalkulator Coverage Nyawa** — LOW effort, second tool to prove the pattern generalizes (non-motor vertical, feeds the life-insurance content hub), income-replacement math is uncontroversial and sourceable.
3. **Medical card limit guidance** — MED effort, defer until the owner's Ahrefs data confirms demand and the sourcing write-up (provenance doc, matching `71aedce` convention) is done.
4. **Newsletter embed** — LOW, parallel-track any time; not sequenced against calculators.

Explicitly out: any premium/quote estimator (infeasible without fabrication). If the Ahrefs data shows demand for "harga insurans X"-type tools, the compliant answer is comparison/editorial pages + outbound partner links (pattern already exists and is tracked), not a calculator.

---
**Summary**: Read-only review, no files touched. Verified the NCD tool's three-layer pattern (WebApplication schema at `ncd-calculator/index.astro:4-30`, pure lib `src/lib/ncd.ts`, inline client script `:446-623`), analytics via `src/lib/track.ts` → GTM `GTM-T3LMP78G`, URL-param prefill/warn contract, and the nginx/Docker static deployment (no CSP, no Netlify/Cloudflare host). Roadtax formula confirmed encodable client-side from public JPJ brackets ([Kurnia](https://www.kurnia.com/blog/road-tax-price-malaysia), [Paultan](https://paultan.org/research/tools/road-tax/), [Loanstreet](https://loanstreet.com.my/learning-centre/road-tax-amount-malaysia)). Grep confirmed no existing form/fetch/email-capture code — only `mailto:` contact links. Recommendation: build roadtax → coverage-nyawa first, defer medical-guidance, reject premium estimators, and use an embedded third-party newsletter form (not platform-native forms) for lead capture.

