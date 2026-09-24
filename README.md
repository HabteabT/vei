# Vei

**Land. Pay. Go.**

Vei (Norwegian for "way" or "road") sorts the boring parts of arriving in Norway: getting into town, buying the right ticket, and paying like a local. It is a calm, honest visitor guide. No account, no ads, no tracking.

> Status: early prototype. Oslo first. The site is a working demo of the first version, using hand-checked public information.

## Why

Norway is easy to love and oddly hard to arrive in. Transport is split across regional operators, tickets are zone based, the country is almost cashless, and Vipps (how locals pay) needs a Norwegian bank account. Visitors lose their first hour to this. Google Maps and AI chatbots are good at "what to see". They are not built around "which ticket, in which app, and how do I pay". That is the gap Vei goes after.

Read more in [docs/product.md](docs/product.md).

## What is in the prototype

| Tab | What it does |
|---|---|
| Arrive | Oslo Airport to city: regional train, Airport Express, airport bus. Sort by cheapest or fastest, with where to buy. Tap "Show next trains" for live departures from Entur |
| Pay | "How do I pay?" for transit, shops, kiosks, Vipps and cash |
| Tickets | Three questions, one recommendation: single tickets, a day ticket or the Oslo Pass |
| Explore | A short starter list of places with indoor/outdoor and Oslo Pass filters |

Every fact links to its source. Prices are shown as "about" with a "last checked" date, because official fares live in PDFs and change.

## Run it

Requires Node 20 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
```

## Tech

- Vite, React and TypeScript
- Plain CSS with design tokens, light and dark mode
- Self-hosted fonts (Bricolage Grotesque, Inter) through Fontsource
- Live train times from [Entur](https://developer.entur.no/apis/open)'s open API, called from the browser only when the visitor taps for them. That is the site's only third-party request
- No backend, no database, no analytics

## Project layout

```
src/
  components/       Page sections and the phone prototype
    app/            The four tabs inside the phone
  data/             Sourced facts. Every entry carries a source link
  styles/global.css Design tokens and all styles
docs/               Product, design, data sources and decision log
.github/workflows/  Deploy to GitHub Pages
```

## Content rules

1. If a fact has no public source, it does not go in.
2. Prices are approximate and carry a "last checked" date (`src/data/meta.ts`).
3. Anything sponsored will be labelled. Nothing is ranked for pay.
4. No personal data is collected.

## Docs

- [Product and market research](docs/product.md)
- [Design system](docs/design.md)
- [Data sources](docs/data-sources.md)
- [Decision log](docs/decisions.md)

## Deploy

Pushing to `main` builds and publishes the site with GitHub Pages (see `.github/workflows/deploy.yml`). One-time setup: in the repo, go to Settings, then Pages, and set Source to **GitHub Actions**.

## License

The code is released under the [MIT License](LICENSE). The name "Vei", the logo and the written content in `docs/` and `src/data/` are not part of that grant. Ask before reusing them.

## Disclaimer

Vei is not a booking or ticket service and is not affiliated with Ruter, Vy, Flytoget, Flybussen, Visit Oslo or Vipps. Always confirm prices and times with the operator before you pay.
