# Product requirements

This is the target for Vei. The first version does not build all of it. Each section says what the current build does.

The shape that should survive every later city:

`City → transportation → attractions → food → activities → reviews`

Adding a city should mean new data, not new screens. Reviews, a calendar journal, restaurants, a backend, and a database are specified here so the data model can grow into them. They are not in the app yet.

## 1. Navigation

Five sections: **Today**, **Get around**, **Pay & tickets**, **Explore**, **My trip**.

**Now:** those five are the app navigation.

One search bar at the top. Visitors use it to choose a city. Later it can also find places, food, and transport inside that city.

**Now:** one city search. It filters Oslo, Kristiansand, Bergen, and Stavanger.

## 2. Choosing a city

After a visitor picks a city, every screen shows only that city: Today, transport, tickets, Explore, saved places, and the trip planner. Typing the city name, or pressing Enter on the one match, selects it.

Start with one to four cities, or up to five. The list can grow. The first set is the popular visitor cities, not every town in Norway.

**Now:** Oslo, Kristiansand, Bergen, Stavanger. Oslo is the deepest guide. The choice is remembered on this device.

## 3. Get around

Show how to move, in plain language: bus, taxi, train, walking, bicycle, rental car, and whatever else that city uses.

From the airport, a visitor should see which service to take, where to board, how long it takes, where to get off, the price when we know it, where to buy the ticket, and how to pay.

**Now:** airport to the centre for each of the four cities, plus a live trip planner for anywhere in Norway (Entur, after live data is turned on). Oslo also shows the next airport trains. Taxi, bicycle, and rental car are not separate guides yet.

## 4. Pay and tickets

For buses, trains, attractions, and museums: where to buy, how to buy, how to pay, and the price when a public source has one.

**Now:** a Norway-wide "how to pay" guide (cards, Vipps, cash). Oslo has the three-question ticket helper. The other cities have steps for the local operator (AKT, Skyss, Kolumbus, Flybussen). Vei does not sell tickets or take payment.

## 5. Explore

Each place has its own page: what it is, where it is, and how to get there from the centre. Hours, photos, tickets, nearby food, ratings, and reviews belong on that page once they can be checked.

Kristiansand starts with Dyreparken, Fiskebrygga, Posebyen, Ravnedalen, Odderøya, and Bystranda.

**Now:** a short sourced list per city. Each place page shows the address, the weather at that place (after live data is on), and a link into the planner. Hours, photos, and entry fees are still left out.

## 6. From the city centre

For a place such as Dyreparken, show the bus, the stop, the time, the walk, the ticket, and another way to go, in one simple block.

**Now:** the place page points at the live planner (city centre to that place) instead of a hand-written bus number we have not verified.

## 7. Ratings and reviews

A signed-in visitor can rate a place, write a review, edit it, and delete it, and can read other people's reviews. The same pattern later covers restaurants, bars, museums, activities, and hotels.

**Now:** a signed-in visitor can rate a place from 1 to 5 stars, write a comment, edit it, and delete it. Anyone can read the comments. In this demo they stay in the browser, so only people using this device see them. Deleting an account removes that person's comments.

## 8 and 9. My trip and a daily journal

A calendar opens on the current year and month. The visitor can change the year and month, pick a day, and write what they did. The note stays on that date. They can edit it, delete it, and look back.

**Now:** My trip is a saved-place list and a morning / afternoon / evening plan. It is not a calendar and it is not a journal.

## 10. Food

Restaurants, bars, cafés, bakeries, and local food, with location, hours, price range, photos, ratings, reviews, and how to get there.

**Now:** not a separate section. A few food-related places (Fiskebrygga, the Bergen fish market) sit in Explore.

## 11. The goal

One calm place for a foreign visitor: transport, tickets, payment, attractions, food, directions, reviews, and a plan for the day. Simple enough to use on the day they land.

## 12. What we are not building yet

Do not add every city and every feature in one step. Prove the structure on a few cities, then add more.

Not in the app yet:

- Backend, database, and an API of our own
- The `frontend/` `backend/` `database/` folder split (the app is still one website under `src/`)
- Photos, opening hours, and entry fees
- Calendar and daily journal
- A restaurants and bars section
- Taxi, bicycle, and rental-car guides

## 13. Technical rules

Keep names obvious. Do not duplicate a screen per city. Share the place page, the airport card, the ticket steps, and the city search. Facts need a public source. When a screen changes, update this file and the other docs in the same change.
