# Product

<!-- impeccable:product-schema 1 -->

Updated 15 Nov 2026 for the Edisi redesign (branch `feat/edisi`). Live production is commit `42cbf2e` (16 Nov 2026). The visual system is in `DESIGN.md`.

## Platform

web

## Who runs the site

insurans.co is run by one person: Amir Ariff, founder and editor, operating under Cepat Digital Ventures, Kuala Lumpur. He is not a licensed insurance adviser, agent or broker, and the site says so. The author page is `/penulis/amir-ariff/`.

## Independence

- No affiliate links, no sponsorship, no paid relationships with any insurer, takaful operator or platform.
- The buy-direct table on `/insurans-online/` (section `#beli-terus`) lists each insurer's own online channel.
- Aggregators (Bjak.my, PolicyStreet, Fincrew) appear only as reviewed platforms on `/insurans-online/`. Site check 4 fails a build that links to them anywhere else.
- Outbound clicks to an insurer are tracked as the `direct_insurer_click` event (`src/lib/track.ts`) for measurement only.

## Users

- **Car owners renewing road tax and insurance.** Top search queries include "harga insurans kereta axia", "harga insurans kereta persona 1.6", "insurance hilux 2.4" and "renew insurans kereta". They are on a phone in their yearly renewal window and want a credible number fast, then a way to get a quotation.
- **Owners unsure about NCD, deciding whether to claim or pay.** Queries: "cara kira ncd". NCD (no-claim discount) is the discount earned for each claim-free year, from 0% to 55%. They want the saving worked out and an answer to "patut ke claim?" (should I claim?).
- **Head-to-head shoppers** comparing two named insurers ("prudential vs aia", Etiqa vs Zurich, Allianz vs Zurich), who want the difference and the claim line.
- **Takaful-preferring Muslims** (inferred from search demand for "takaful kereta" and the `/takaful/` hub), who need the Shariah-compliant framing, not only price.

## Audience and language

Bahasa Malaysia first, for ordinary Malaysians rather than agents or brokers. Standard but relaxed Malay, short sentences, the answer first and the reason after, insurance terms in plain words with the industry term in brackets. The house style is `docs/gaya-bahasa.md` (copied from the concept worktree on 15 Nov 2026; this copy is now the reference). Every visible text change follows it.

## Product purpose

A static guide that answers "berapa patut saya bayar?" (how much should I pay?) for Malaysian motor insurance and takaful, and for other common covers, with estimated premiums per car model, NCD arithmetic and insurer comparisons. Success is model pages that rank and turn attention into calculator use and outbound quotation clicks. The site sells nothing.

## What the site covers

A build of this branch (`bun run build`, 15 Nov 2026) produces 182 pages from 66 page files and the data in `src/data/*.json`:

| Family | Pages | Notes |
|---|---|---|
| Car insurance (`/car-insurance/`) | 40 | hub plus 39 model pages |
| Comparisons (`/perbandingan/`) | 17 | hub plus insurer-versus-insurer pages |
| States (`/negeri/`) | 17 | hub plus 16 state pages; state pages are `noindex, follow` |
| Insurance companies (`/companies/`) | 14 | hub plus insurer pages |
| Medical cards (`/medical-cards/`) | 11 | hub plus plan pages |
| Critical illness (`/critical-illness/`) | 9 | hub, list of illnesses, plan pages |
| Travel, home, motorcycle, personal accident | 8, 8, 6, 5 | hub plus plan pages each |
| Guides (`/guides/`) | 8 | NCD, renewal, claims, flood, takaful, comprehensive versus third party |
| Financial literacy (`/literasi-kewangan/`) | 7 | hub plus six articles |
| Online insurance (`/insurans-online/`) | 7 | hub with the buy-direct table, platform reviews |
| Tools (`/tools/`) | 6 | index plus five calculators: NCD, car road tax, motorcycle road tax, home insurance, life cover |
| Short guides (`/panduan/`), government schemes (`/bantuan-insurans/`) | 4, 4 | |
| Single pages | 13 | home, takaful, life and health hubs, i-Lindung, trust pages, photo credits, 404 |

## YMYL rules

Insurance prices are "your money or your life" content, so:

- Every figure is sourced (BNM, PIAM, JPJ, insurer documents), and the source is linked on the page.
- Never invent people, quotes, reviews, testimonials, prices or rankings.
- Every estimate is labelled "Anggaran" with the date it was checked.
- Road tax figures are for Peninsular Malaysia (Semenanjung) unless the page says otherwise.
- A change that removes or alters a price must be caught by site check 1 and signed off by the editor.

## Ads

- AdSense is opt-in per page: `Base.astro` takes `ads` and it defaults to `false`. A page passes `ads={true}` only if it meets the content gate. Noindex pages never load ads.
- The gate: at least 700 words of main text, and a 5-word-sequence similarity under 0.35 with its nearest sibling page in the same family. `python3 scripts/ads-gate-audit.py dist /tmp/ads-gate.json` (build folder, then the JSON report it writes) measures every family and reports pages that load ads while failing the gate.
- Ads are Auto ads: the templates hold no manual ad units. `adsbygoogle.js` loads eagerly while the account is under review (`src/lib/third-party.ts`).
- AdSense site status is "needs attention". The site was rejected on 9 Oct 2026; the content-accuracy and ads opt-in release went live on 14 Nov 2026 (`4dd50a3`). Resubmit about three days after the next deploy.

## Analytics and consent

- Google Tag Manager (`GTM-T3LMP78G`, which loads GA4) loads in "idle" mode: after DOMContentLoaded, once the browser is idle, capped at 1.5 seconds (`src/lib/third-party.ts`, `src/components/ThirdPartyScripts.astro`). Events pushed earlier are queued.
- Consent defaults are set before any tag. Google's Funding Choices message (pulled in by AdSense) asks for consent.
- The footer has a "Tetapan privasi" button (privacy settings) that reopens the consent choice.

## Trust pages

`/about/`, `/kaedah-editorial/` (editorial method, including the public corrections log), `/penulis/amir-ariff/` (author), `/hubungi/` (contact), `/privacy/`, `/terms/`, `/kredit-foto/` (photo credits for every car photo).

## Deliberately not built

- Stories, a price feed or "Terkini" update stream on this branch (the Terkini stream is on branch `feat/terkini`).
- Dark mode.
- Per-insurer quotations or any quote engine.
  - A published-price lookup is allowed and is not a quote engine. It returns the figure printed in an insurer's published table for the reader's age, plan or trip, with the source document, its date, the page and the conditions beside it. It is not an offer or a quotation. It asks only for what selects a row: no name, IC number, phone number or email. Nothing can be bought from it. A figure appears only after two independent extractions of the table agree and the insurer's printed example reproduces from it.
- User uploads, accounts or reviews.

## Positioning

The Malaysian motor guide that pairs per-model premium estimates (39 models, NCD 0% to 55%) with NCD decision arithmetic ("patut ke claim?") in plain Malay, citing BNM and PIAM, and says plainly that it is not an agent or broker. Neighbours (Bjak, PolicyStreet) sell quotations; insurans.co answers the question that comes before the quotation.

## Operating context

- The yearly renewal ritual: check NCD (MyEG or an agent), compare, pay, receive the e-cover note, renew road tax (JPJ, MyEG or Pos).
- Most readers are on Malaysian phones and share links on WhatsApp.
- Motor premiums have been set by insurers themselves since the 2017 tariff liberalisation.
- Static Astro 7 site, Tailwind 3, no backend, built with bun and served by nginx from a Docker image on Coolify.

## Brand commitments

- Name: Insurans.co. Wordmark: the "slider i" logo, whose dot is the NCD knob (see `DESIGN.md`). Taglines: "Bukan ejen. Bukan broker." and "Panduan insurans untuk rakyat Malaysia biasa."
- Voice: as `docs/gaya-bahasa.md`.

## Product principles

1. **Answer first, explain second.** The number comes before the method on every template.
2. **NCD is the product.** Every car price responds to the NCD step, with a claim-or-pay answer.
3. **Independence is the moat.** No paid relationships; aggregators are never presented as an editorial ranking.
4. **Enrich the engine, do not prune it.** The 39 model pages are the traffic; edits raise unique value per page.
5. **Plain Malay, facts cited.** Sourced, dated estimates.

## Accessibility and inclusion

44px targets, a 14px text floor, AA contrast, visible focus rings, pages that work without JavaScript and at 200% text. Details in `DESIGN.md`; enforced by `bun run check:site` (checks 3, 6 and 7).
