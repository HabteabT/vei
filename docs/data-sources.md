# Data sources

Rule: a fact only goes into `src/data/` if a public source backs it. Each entry carries a source link. Update `LAST_CHECKED` in `src/data/meta.ts` whenever you re-check.

Last checked: **September 2026**.

## In the prototype

| Data | File | Source | Confidence |
|---|---|---|---|
| Live direct trains, Oslo Airport to Oslo S | `entur.ts` | [Entur Journey Planner API](https://developer.entur.no/apis/open), NLOD licence | High (live, official). Fetched only when the visitor taps |
| Airport Express: 19 min, every 10 min | `airport.ts` | flytoget.no | High (official) |
| Airport Express price, about 260 kr | `airport.ts` | Travel guides. Two guides gave 258 and 268 | Medium. Shown as "about" |
| Regional train: about 23 min, about 3 an hour, about 129 kr | `airport.ts` | Oslo Spirit guide | Medium |
| Airport bus: 50 to 60 min, about 269 kr | `airport.ts` | Oslo Spirit guide | Medium |
| Cash on board up to 200 kr notes, 50 kr travel card, where to buy it | `payments.ts` | Ruter tourist ticket page | High (official) |
| Contactless cards accepted almost everywhere | `payments.ts` | The Norway Guide, Life in Norway | Medium |
| Vipps needs a Norwegian bank account and ID | `payments.ts` | Norway Explained | Medium |
| Some spots take Vipps only | `payments.ts` | Norway Explained, Tripadvisor forum | Medium (anecdotal) |
| Under 3% of transactions in cash | `payments.ts` | Life in Norway | Medium |
| Oslo Pass prices 580 / 845 / 995 kr, 30+ museums, transport included | `tickets.ts` | Visit Oslo, Oslo Spirit | Medium. Confirm before you pay |
| Places and their Oslo Pass inclusion | `places.ts` | Visit Oslo | Medium. Only six museums are marked as included |

## Known gaps

- **Ruter fares.** Single and 24-hour prices are published in a PDF and were not read. The site gives rules of thumb instead of numbers. Fix by reading the official price PDF, or by using a fare API if one exists.
- **Opening hours and entry fees.** Left out on purpose.
- **Vy and Flybussen ticket channels.** From guides, not the operators.

## Planned free data

| Source | Use | Licence |
|---|---|---|
| [Entur Journey Planner API](https://developer.entur.no/apis/open) | Already used for airport trains. Next: door-to-door routes anywhere in Norway | NLOD. Must send an `ET-Client-Name` header (we send `vei-prototype`). Browser calls are allowed (CORS is open) |
| OpenStreetMap | Base map and places | ODbL |
| Overture Maps places | Points of interest | CDLA Permissive 2.0 |
| [Open-Meteo](https://open-meteo.com) | In use: current weather and rain chance for Oslo | Free for non-commercial use. Browser calls allowed. Attribution requested. See decision 013 |
| MET Norway weather API | Alternative for a commercial launch | Rejects browser requests without a custom User-Agent, so it needs a small proxy |
| Entur place search (geocoder) | In use: place suggestions in the trip planner | NLOD, same header as the journey planner |

Google Places is avoided for cost reasons (see [product.md](product.md)).

## Updating the data

1. Open each source link and compare.
2. Edit the file in `src/data/`.
3. Update `LAST_CHECKED`.
4. Note any change of approach in [decisions.md](decisions.md).
