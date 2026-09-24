# Product and market research

Research date: September 2026. Research only used public web sources. Nothing here has been tested with real visitors yet.

## The idea

A website (later an app) for people visiting a new place, with the practical things they need in one spot: how to get around, how to pay, and what to do next. Start in Norway, then go worldwide.

## Verdict

Pieces of this exist, but no single app does it well for a visitor in Norway. "Everything in one app" is the riskiest version of the idea, so the plan is to start narrow.

## Who already does parts of it

| Product | Good at | Misses for a visitor |
|---|---|---|
| Google Maps (with Gemini "Ask Maps") | Navigation, nearby places, AI trip planning | No structured trip plan, budget or group tools |
| Tripadvisor / Viator | Reviews, tours | Tripadvisor's core hotel revenue fell 8% in 2025 as AI answers take its traffic |
| Mindtrip, Layla | AI trip planning and booking | Earn from booking commissions, little local depth |
| Wanderlog, TripIt | Itineraries, organising bookings | TripIt does no planning |
| Citymapper | Transit | Never profitable, sold cheaply to Via in 2023 |
| GetYourGuide, Klook | Tickets and tours | Only sell what pays commission |
| Visit Norway app | Official content | Very low rating on few reviews. One reviewer says content is sourced from Tripadvisor |
| Entur, Ruter, Vy, Skyss, AtB | Transport | Split by region, so visitors need several apps |
| Oslo Pass | City card: 30+ museums plus transport | Only Oslo, only what it sells |

## The gap Vei targets

- Transport is fragmented: regional operators, zone tickets, seasonal changes.
- Payment is confusing: Norway is almost cashless, Vipps needs a Norwegian bank account, and some spots take Vipps only.
- Google Maps shows routes and often fares. As far as we found, it does not say which ticket to buy, in which app, or how to pay as a foreigner. **This is an assumption. The first test with real visitors must check it.**

## Main threats

- Google and ChatGPT give AI trip planning away for free, and Booking.com and Expedia already run inside ChatGPT. Competing on "best restaurants" lists loses.
- Travellers open apps rarely, often two or three trips a year, so retention is hard. This is a common reason travel startups fail.
- Google Places API pricing can reach thousands of dollars a month at scale. Prefer OpenStreetMap, Overture Maps and Norway's free open transport data.

## Market

- World: 1.52 billion international arrivals in 2025, up 4% (UN Tourism). Europe had 793 million.
- Norway: 40.6 million guest nights in commercial accommodation in 2025, of which 14.2 million foreign (+14%) (Statistics Norway).
  - Largest foreign markets by guest nights: Germany 2.6M, Sweden 1.3M, Netherlands 985k, UK 977k, Denmark 896k.
  - Asia: 1.2M guest nights, up 30%.
  - About 6.3 million cruise passengers in 2025, from cruise industry press.
- Market-size reports range from $3.8B to over $1 trillion depending on definition. We ignore them and count tourists instead.

### Segments

| Segment | Fit | Note |
|---|---|---|
| Independent first-time visitors, 2 to 4 days | Best | Start here |
| Cruise day visitors | Later | Many people, few hours. A "6 hours in port" mode fits |
| Swedes and Danes | Low | Know the culture and system |
| Asian visitors | Test | Fast growing. May struggle most with payment and language. A guess to test |
| Domestic | Skip | Locals use Vipps and local apps |

## First version: "Oslo, first 24 hours"

A web app opened by QR code. No download, no account.

| Priority | Feature |
|---|---|
| Must | Airport to hotel: fastest and cheapest way, with where to buy |
| Must | "How to pay here" card |
| Must | Which-ticket helper (single, day ticket, Oslo Pass) |
| Must | Hand-picked "next best thing" list |
| Should | Offline saving (add to home screen) |
| Should | Rainy-day mode, budget estimate, share plan |
| Later | German and Norwegian, cruise-day mode, a second city |

**Not building yet:** accounts, reviews, video, ads, a native app, selling tickets, an AI chatbot as the main feature.

## How it could earn money

- Pay per trip (a tourist pass), not a yearly subscription. People travel a few times a year.
- Affiliate commission on tickets and tours. Baseline for the big tour platforms is about 8%.
- A version for tourism boards and cities. Norway now lets municipalities charge a 3% tourist tax and is pushing to spread visitors out.
- Hotel and short-let QR codes as the main way to reach visitors before they arrive.

## How to test it

1. Before more code: talk to about 10 visitors in Oslo about what confused them with transport and paying. If nobody says it, change the idea.
2. Build the first version.
3. Give it to 15 to 20 real visitors. Good signs:
   - They finish a real task (airport to hotel, with a ticket) without help.
   - They would recommend it.
   - They would pay for a trip pass.

Success test, borrowed from an earlier requirements note: if visitors do not complete a real task with it, change the idea before building more.

## Open questions

- Do the Ruter and Entur apps allow deep links, so Vei can send people to the exact ticket?
- Is there a free weather API for rainy-day mode? (MET Norway is likely, not yet checked.)
- Who keeps the hand-picked places up to date?
- Which visitor segment feels the pain most? Only interviews can answer this.

## Limits of the research

- Web search only. No app store sweep and no download numbers.
- Funding figures come from Crunchbase and PitchBook summaries and may be out of date.
- The 7.2 million international visitors figure appeared in press coverage, not a primary source, so it is not used on the site.
- Nothing has been tested with real visitors.

## Sources

- [SSB: record guest nights 2025](https://www.ssb.no/en/transport-og-reiseliv/reiseliv/statistikk/overnattingar/articles/record-number-of-guest-nights-in-2025)
- [UN Tourism: 2025 arrivals](https://www.untourism.int/news/international-tourist-arrivals-up-4-in-2025-reflecting-strong-travel-demand-around-the-world)
- [Norway Explained: travel apps](https://norwayexplained.com/norwegian-travel-apps-tourists-need/)
- [Norway Explained: Vipps for tourists](https://norwayexplained.com/how-to-get-vipps-as-a-tourist-in-norway/)
- [Life in Norway: cash](https://www.lifeinnorway.net/norway-considers-forcing-businesses-to-accept-cash/)
- [Skift: Tripadvisor and AI overviews](https://skift.com/2026/02/12/tripadvisor-sees-traffic-decline-from-ai-overviews-considers-strategic-alternatives-again/)
- [Skift: ChatGPT travel apps](https://skift.com/2025/10/06/expedia-booking-chatgpt-apps-openai/)
- [TechCrunch: Via acquires Citymapper](https://techcrunch.com/2023/03/16/via-acquires-trip-planning-app-citymapper-to-boost-transit-tech/)
- [Entur open APIs](https://developer.entur.no/apis/open)
- [Euronews: Norway tourist tax](https://www.euronews.com/travel/2025/06/06/norway-to-introduce-tourist-tax-amid-record-visitor-numbers-and-overtourism-concerns)
- [Track360: affiliate programs](https://track360.io/blog/viator-getyourguide-affiliate-programs-operator-teardown-2026)
- [Failory: travel startup failures](https://www.failory.com/startups/travel-failures)
