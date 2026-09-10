# GTM / GA4 event configuration

Container: `GTM-T3LMP78G`. Create the Google tag/GA4 configuration tag first with the site's GA4 Measurement ID; fire it on **Initialization – All pages**. Keep the existing Consent Mode settings and use this tag as the configuration for every event tag below.

## User-defined variables

Create these as **Data Layer Variable** variables (Version 2), using the exact names below.

| GTM variable | Data Layer Variable Name |
|---|---|
| `DLV - base_premium` | `base_premium` |
| `DLV - ncd_pct` | `ncd_pct` |
| `DLV - premium_after` | `premium_after` |
| `DLV - saving` | `saving` |
| `DLV - repair_cost` | `repair_cost` |
| `DLV - excess` | `excess` |
| `DLV - should_claim` | `should_claim` |
| `DLV - destination` | `destination` |
| `DLV - location` | `location` |
| `DLV - text` | `text` |
| `DLV - partner` | `partner` |
| `DLV - outbound_url` | `outbound_url` |
| `DLV - faq_question` | `faq_question` |
| `DLV - page_type` | `page_type` |
| `DLV - company_a` | `company_a` |
| `DLV - company_b` | `company_b` |

For `compare_view`, the page trigger supplies the company values through these two **Custom JavaScript** variables (not the data layer):

| GTM variable | Custom JavaScript |
|---|---|
| `CJS - company_a` | `function(){var m=window.location.pathname.match(/^\/perbandingan\/([^/]+)\/?$/);return m ? m[1].split('-vs-')[0] : undefined;}` |
| `CJS - company_b` | `function(){var m=window.location.pathname.match(/^\/perbandingan\/([^/]+)\/?$/);return m ? m[1].split('-vs-')[1] : undefined;}` |

## Triggers

Create one **Custom Event** trigger for each pushed event. Set Event name exactly as shown and use **Use regex matching** off.

| GTM trigger | Type / configuration | Event name |
|---|---|---|
| `CE - ncd_calculate` | Custom Event | `ncd_calculate` |
| `CE - ncd_claim_check` | Custom Event | `ncd_claim_check` |
| `CE - cta_click` | Custom Event | `cta_click` |
| `CE - outbound_click` | Custom Event | `outbound_click` |
| `CE - faq_open` | Custom Event | `faq_open` |
| `PV - compare_view` | Page View; Page Path matches RegEx `^/perbandingan/.+` | — |

## GA4 event tags

Create one GA4 Event tag per row, using the Google tag above as its configuration. Add each parameter as an event parameter with the listed variable value.

| Tag | Trigger | Event name | Event parameters |
|---|---|---|---|
| `GA4 - ncd_calculate` | `CE - ncd_calculate` | `ncd_calculate` | `base_premium={{DLV - base_premium}}`, `ncd_pct={{DLV - ncd_pct}}`, `premium_after={{DLV - premium_after}}`, `saving={{DLV - saving}}` |
| `GA4 - ncd_claim_check` | `CE - ncd_claim_check` | `ncd_claim_check` | `repair_cost={{DLV - repair_cost}}`, `excess={{DLV - excess}}`, `ncd_pct={{DLV - ncd_pct}}`, `should_claim={{DLV - should_claim}}` |
| `GA4 - cta_click` | `CE - cta_click` | `cta_click` | `destination={{DLV - destination}}`, `location={{DLV - location}}`, `text={{DLV - text}}` |
| `GA4 - outbound_click` | `CE - outbound_click` | `outbound_click` | `partner={{DLV - partner}}`, `outbound_url={{DLV - outbound_url}}`, `location={{DLV - location}}` |
| `GA4 - faq_open` | `CE - faq_open` | `faq_open` | `faq_question={{DLV - faq_question}}`, `page_type={{DLV - page_type}}` |
| `GA4 - compare_view` | `PV - compare_view` | `compare_view` | `company_a={{CJS - company_a}}`, `company_b={{CJS - company_b}}` |

## Key events and custom dimensions

In GA4 Admin → Events, mark `ncd_calculate` and `ncd_claim_check` as key events. Mark `outbound_click` as a key event and set its counting method to **Once per session**. Do not mark `cta_click`, `faq_open`, or `compare_view` as key events.

Register these as **event-scoped custom dimensions** (GA4 Admin → Data display → Custom definitions):

| Dimension | Event parameter |
|---|---|
| Destination | `destination` |
| CTA / section location | `location` |
| CTA text | `text` |
| Partner | `partner` |
| Outbound URL | `outbound_url` |
| FAQ question | `faq_question` |
| Page type | `page_type` |
| Company A | `company_a` |
| Company B | `company_b` |
| Should claim | `should_claim` |

If numeric calculator reporting is needed, register `base_premium`, `ncd_pct`, `premium_after`, `saving`, `repair_cost`, and `excess` as event-scoped custom metrics rather than dimensions.

## GTM Preview test (five steps)

1. Preview the container, open `/`, and confirm the Google tag fires with consent granted for analytics; inspect the data layer for `gtm.js`.
2. Click both hero CTAs and the four main cards; verify six `cta_click` events with the expected destination, location, and trimmed text.
3. On `/tools/ncd-calculator/`, enter a valid base premium, click an NCD tier, type and pause at least 500 ms, then submit valid claim inputs; verify numeric parameters and boolean `should_claim`. Submit invalid claim inputs and verify no `ncd_claim_check` event.
4. Open and close an FAQ on the home page and calculator; verify `faq_open` fires only while opening and carries the correct question and `page_type`.
5. Click Bjak, PolicyStreet, and MyEG inside the renew section; verify mapped partners and `location=renew`. Open a `/perbandingan/<slug>/` page and verify `compare_view` sends both companies; then confirm events in GA4 DebugView before publishing.
