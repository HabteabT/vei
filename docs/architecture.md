# Architecture

Vei is a static single-page app (Vite, React, TypeScript). There is no backend yet. Everything below is organised so that adding one is a change in one file.

## Layers

```
src/
  domain/        Pure rules and types. No React, no browser, no network.
                 validators, checklist, weather codes, time helpers, shared types
  services/      Things that talk to the outside world, each behind a small interface.
    storage/       KeyValueStore  <- BrowserStore, MemoryStore
    auth/          AuthService    <- LocalAuthService  (uses PasswordHasher, Clock, IdGenerator)
    userdata/      Favorites / Trip / Checklist / Preferences repositories
    transit/       TransitService <- EnturTransitService
    weather/       WeatherService <- OpenMeteoWeatherService
    settings/      Theme, live-data, and the selected city
  data/          Sourced content (airport options, pay guide, places, ticket rules)
  app/           Wiring: composition root, contexts, guards, routes, hooks
  ui/            Design-system primitives (Button, Field, Modal, Toast...)
  components/    Feature building blocks (LiveTrains, PlaceSearch, Checklist...)
  layouts/       Marketing, auth and app shells
  pages/         One file per screen
```

Dependencies only point inward: `pages` use `components`, `hooks` and `services` interfaces. `domain` imports nothing from the other layers. `services` never import React.

## SOLID, with the actual code

| Principle | How it shows up |
|---|---|
| **Single responsibility** | `Pbkdf2Hasher` only hashes. `LocalAuthService` only decides who is signed in. `JsonRecord` only reads and writes one JSON value. `LocalUserData` repositories each own one kind of data. Validators live apart from the services that call them. |
| **Open/closed** | `app/features.tsx` is the single list of screens. The router, the navigation and the sign-in guard all read it, so a new feature is one new entry, not edits to the shell. Account cleanup uses `onAccountDeleted` hooks: user data registers itself, and the auth service never learns about it. |
| **Liskov substitution** | `MemoryStore` and `BrowserStore` are interchangeable behind `KeyValueStore`, which is how the same auth code runs in tests and in the browser. The tests use fake `fetch` and a fake `Clock` in place of the real ones. |
| **Interface segregation** | Repositories are split (`FavoritesRepository`, `TripRepository`, `ChecklistRepository`, `PreferencesRepository`) instead of one large "user data" object. `Observable<T>` is only `get` and `subscribe`. Screens ask for the piece they use. |
| **Dependency inversion** | UI and services depend on interfaces (`AuthService`, `TransitService`, `WeatherService`, `KeyValueStore`, `PasswordHasher`). Only `app/container.ts` names concrete classes. |

## Swapping in a real backend

The demo `LocalAuthService` keeps accounts in the browser. To use a real service (for example an EU-hosted one):

1. Write a class that implements `AuthService` (`signUp`, `signIn`, `signOut`, `getCurrentUser`, `updateName`, `changePassword`, `deleteAccount`, `onAuthChange`).
2. Change the `auth` line in `src/app/container.ts`.
3. Do the same for `UserDataProvider` if saved places should live on a server.

No page, component or guard needs to change.

## Cities

The visitor picks one city in `CitySearch`, stored by `CitySetting` (`vei.settings.city`). Every screen reads it through `useCity()`. Content is keyed by city id in `src/data/cities.ts`, `src/data/cityGuides.ts`, and `src/data/places.ts`. A new city is new data in those files, not a new set of screens.

Oslo still uses the older airport and ticket modules (`airport.ts`, `tickets.ts`) because that guide was written first. The other cities use `cityGuides.ts`.

## Adding a feature

1. Create `src/pages/app/YourPage.tsx`.
2. Add one entry to `FEATURES` in `src/app/features.tsx` with its path, label, icon, and `requiresAuth`.

It appears in the sidebar and bottom bar, is routed, and is protected if you asked for that.

## Authentication in the demo

What it does:

- Sign up, sign in, sign out, change password, edit name, delete account.
- Passwords are hashed with PBKDF2-HMAC-SHA256 (210,000 rounds) and a random salt per account, using the browser's Web Crypto. Plain passwords are never stored.
- Email is normalised. An unknown email and a wrong password give the same message, and the same amount of work is done for both, so the response does not reveal which emails exist.
- 5 failed tries lock that email for 60 seconds, even for the right password.
- Sessions use a random token and expire after 7 days. A password change issues a new token.
- Protected pages redirect to sign-in and return you afterwards. After a deliberate sign-out you go home instead.
- Deleting an account needs the password, then removes the account, its data and the session.

What it is not: real security. Everything lives in this browser's storage, so anyone with access to the device (or its developer tools) can read or copy it. There is no server to enforce limits, and the lockout can be bypassed by clearing storage. It exists so the flows and screens can be shown and tested. Do not put real personal data in it.

## Live data

Live train times, the trip planner and weather call Entur and Open-Meteo directly from the browser. They are off until the visitor turns on the "Live data" switch, because these calls reveal the visitor's IP address to those services. Only the search text, the coordinates and the timetable query are sent.

## Offline

`public/sw.js` caches the site's own files after the first visit so the app opens without a connection. It never caches calls to Entur or Open-Meteo. It is registered in production builds only.

## Tests

`npm test` runs Vitest. Covered: validators, the whole auth service (sign up, duplicates, wrong password, lockout and unlock, session expiry, password change, deletion and cleanup hooks), the user data repositories, ticket rules, weather codes, time helpers, city search, place reviews, and the Entur client (with a fake `fetch`). UI flows were checked by hand in a browser.
