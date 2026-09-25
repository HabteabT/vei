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
| Kristiansand, Bergen, and Stavanger city list | `cities.ts` | Chosen for the first version. Coordinates are city-centre points for weather | High for the names. Weather is for the centre, not the airport |
| Kristiansand airport bus, lines 35/36, platform B, 1 zone | `cityGuides.ts` | [AKT airport buses](https://www.akt.no/english/travel-planning/airport-buses/) | High. No minute count or fare number was published on that page, so none is shown |
| Kristiansand places | `places.ts` | [Visit Norway: Kristiansand](https://www.visitnorway.com/places-to-go/southern-norway/kristiansand/) and the [Dyreparken listing](https://www.visitnorway.com/listings/dyreparken-kristiansand-zoo-and-amusement-park/21056/) | Medium. No hours or entry fees |
| Bergen airport light rail and coach | `cityGuides.ts` | [Skyss airports](https://www.skyss.no/en/travel/Airports/) and [Visit Bergen](https://en.visitbergen.com/visitor-information/travel-information/getting-here/to-bergen-by-plane/bergen-airport-flesland-to-bergen-city-center) | Mode is high. The 45 min / 51 kr and 30 min / 189 kr figures are from Visit Bergen, so they are shown as "about" |
| Bergen places | `places.ts` | [Visit Bergen](https://en.visitbergen.com/) | Medium |
| Stavanger airport shuttle | `cityGuides.ts` | [Flybussen Stavanger](https://www.flybussen.no/en/airports/stavanger-airport/), [Fjord Norway](https://www.fjordnorway.com/en/transport/airport-shuttle-flybussen-stavanger), [Visit Norway](https://www.visitnorway.com/places-to-go/fjord-norway/the-stavanger-region/) | Medium. 25–30 min and every 20 min are from Fjord Norway. About 279 kr is the shared Flybussen Connect online adult fare (April 2026 price list), so the screen says to confirm the Stavanger fare |
| Stavanger places | `places.ts` | [Visit Norway: the Stavanger region](https://www.visitnorway.com/places-to-go/fjord-norway/the-stavanger-region/) | Medium |

## Known gaps

- **Ruter fares.** Single and 24-hour prices are published in a PDF and were not read. The site gives rules of thumb instead of numbers. Fix by reading the official price PDF, or by using a fare API if one exists.
- **Opening hours and entry fees.** Left out on purpose.
- **Place addresses.** Street addresses come from the operator or Visit Norway where a page publishes one. Parks and districts use the place name and city when there is no single door number. The coordinates are only for the weather call.
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
