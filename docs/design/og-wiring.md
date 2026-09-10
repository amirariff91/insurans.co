# OG image wiring

Use the generated card that matches each dynamic page template. Do not build an OG path from the display name; use the record slug.

| Page template | `ogImage` prop value | `og:image:alt` pattern |
|---|---|---|
| `src/pages/car-insurance/[model].astro` | `/og/car-insurance/${car.slug}.png` | `Insurans ${car.fullName}: NCD 55% ${formatRange(car.premiumNCD55Min, car.premiumNCD55Max)} setahun; tanpa NCD ${formatRange(car.premiumNCD0Min, car.premiumNCD0Max)}.` |
| `src/pages/companies/[slug].astro` | `/og/companies/${company.slug}.png` | `${company.name} (${company.fullName}) — produk, kelebihan dan cara claim.` |
| `src/pages/perbandingan/[slug].astro` | `/og/perbandingan/${comparison.slug}.png` | `${company1.name} vs ${company2.name} — perbandingan harga, perlindungan dan claim.` |

Include the company full name in parentheses only when `company.fullName !== company.name`.

`formatRange(min, max)` should use the same integer `Intl.NumberFormat('ms-MY')` output as the page and return `RM{min}–RM{max}`. Keep the alt text factual; do not add a rating, winner, quotation or endorsement.
