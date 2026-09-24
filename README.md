# Vei

**Land. Pay. Go.**

Vei (Norwegian for "way" or "road") sorts the boring parts of arriving in Norway: getting into town, buying the right ticket, and paying like a local. It is a calm, honest visitor guide. Free, no ads, no tracking.

> Status: working demo. Oslo first. Facts come from public sources, live data from Entur and Open-Meteo.

## Try it

- **Demo login:** `demo@vei.app` / `VeiDemo2026`, or press "Try the demo account" on the site. You can also create your own account.
- Accounts in this demo live only in your browser. See [docs/architecture.md](docs/architecture.md) for what that means.

## What is in it

| Area | What you can do |
|---|---|
| **Marketing site** | Illustrated landing page with features, how it works, privacy and roadmap |
| **Accounts** | Sign up, sign in, sign out, protected pages, edit profile, change password, download your data, delete your account |
| **Today** | Live Oslo weather, next airport trains, quick actions, and an arrival checklist that remembers your progress |
| **Get around** | Airport options compared, live trains, and a trip planner from any place to any place in Norway with real routes, changes and which app sells the ticket |
| **Pay & tickets** | "How do I pay?" for transit, shops, kiosks, Vipps and cash, and a three-question ticket helper |
| **Explore** | Hand-picked places with rainy-day, outdoor, Oslo Pass, "for you" and saved filters. Save favourites and add to your trip |
| **My trip** | Saved places and a morning, afternoon and evening plan with notes (needs an account) |
| **Profile** | Interests and budget, theme, live-data switch, security, data export |
| **Also** | Light and dark themes, works offline after the first visit, keyboard and screen-reader friendly |

Guests can use everything except saving places and the trip plan.

## Live data is your choice

Live train times, routes, place search and weather call [Entur](https://developer.entur.no/apis/open) and [Open-Meteo](https://open-meteo.com) straight from your browser. That shows your IP address to them, so it stays **off until you turn on the "Live data" switch**. Nothing is sent to anyone else, and there is no analytics.

## Run it

Requires Node 20 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 43 unit tests
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
```

## Tech

Vite, React 19 and TypeScript. Plain CSS with design tokens. React Router (hash routes). Lucide icons. Self-hosted fonts (Sora and Plus Jakarta Sans). Vitest for tests. No backend, no database.

## How it is built

Layered and SOLID: pure `domain` rules, `services` behind small interfaces, `ui` primitives, and one composition root (`src/app/container.ts`) that chooses the concrete classes. Swapping the demo accounts for a real backend is a one-line change there. Adding a screen is one entry in `src/app/features.tsx`. The full map is in [docs/architecture.md](docs/architecture.md).

```
src/
  domain/      pure rules and types
  services/    auth, storage, user data, transit, weather (each behind an interface)
  data/        sourced content
  app/         wiring, guards, routes, hooks
  ui/          design-system primitives
  components/  feature building blocks
  layouts/     marketing, auth and app shells
  pages/       one file per screen
```

## Content rules

1. If a fact has no public source, it does not go in.
2. Prices are approximate and carry a "last checked" date (`src/data/meta.ts`).
3. Anything sponsored will be labelled. Nothing is ranked for pay.
4. Personal data stays on the device in this demo, and can be downloaded or deleted at any time.

## Docs

- [Architecture and SOLID mapping](docs/architecture.md)
- [Product and market research](docs/product.md)
- [Design system](docs/design.md)
- [Data sources](docs/data-sources.md)
- [Decision log](docs/decisions.md)

## Deploy

Pushing to `main` runs the tests, builds, and publishes with GitHub Pages (`.github/workflows/deploy.yml`). One-time setup: in the repo, go to Settings, then Pages, and set Source to **GitHub Actions**.

## Known limits

- Demo accounts are not real security (browser storage only).
- Prices are approximate. Ruter's official fares are only published as PDFs.
- English only for now. Opening hours and entry fees are left out until they can be verified.
- Open-Meteo's free tier is for non-commercial use.

## License

The code is released under the [MIT License](LICENSE). The name "Vei", the logo and the written content in `docs/` and `src/data/` are not part of that grant. Ask before reusing them.

## Disclaimer

Vei is not a booking or ticket service and is not affiliated with Ruter, Vy, Flytoget, Flybussen, Visit Oslo or Vipps. Always confirm prices and times with the operator before you pay.
