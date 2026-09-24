# Decision log

Newest at the bottom. Each entry: what we chose, why, and what would change our mind.

## 001. Name: Vei
- **Chose:** Vei, Norwegian for "way" or "road".
- **Why:** Short, memorable, and the meaning fits (finding your way). Rough domain checks showed vei.com, vei.no and vei.app are taken, while vei.travel, vei.guide and variants like getvei.no, veiapp.no and veiguide.com looked free.
- **Revisit if:** we go outside the Nordics and the name does not travel, or a trademark issue appears. Trademark and domains are not yet checked properly.

## 002. Start narrow: Oslo, first 24 hours
- **Chose:** one city and one job (arrive, pay, get around) instead of an all-in-one guide.
- **Why:** "Everything in one app" is the most crowded and most failed idea in travel, and Google and AI assistants now give general planning away free.
- **Revisit if:** interviews show visitors do not struggle with transport and payment.

## 003. Web first
- **Chose:** a website opened by QR code. No download.
- **Why:** visitors will not install an app for a three-day stay, and it keeps privacy simple.
- **Revisit if:** offline use or notifications need a native app.
- **Updated by 011:** accounts are now optional (the original plan was no login at all).

## 004. Show sources and dates instead of exact prices
- **Chose:** prices shown as "about", with source links and a "last checked" date.
- **Why:** official fares are in PDFs and change. Blogs disagree by a few kroner. Wrong prices would destroy trust.
- **Revisit if:** we get a reliable fare feed.

## 005. Self-hosted fonts, no third-party requests by default
- **Chose:** Fontsource packages instead of Google Fonts.
- **Why:** matches the privacy promise and avoids sending visitor IP addresses to a third party.

## 006. Stack: Vite, React, TypeScript, plain CSS
- **Why:** fast to build, easy to deploy as static files, no framework lock-in. No backend is needed for this version.
- **Revisit if:** we need server-side logic or many pages.

## 007. Public repository
- **Chose:** public from day one, at github.com/HabteabT/vei.
- **Why:** the owner's choice. Note that anyone can read the code and the documented ideas.

## 008. No AI assistant attribution in commits or docs
- **Chose:** commits use the owner's own git identity only.

## 009. Licence: MIT for the code
- **Chose:** MIT, copyright Naibe Mehari Tekle. The name "Vei", the logo and the written content (`docs/`, `src/data/`) are excluded in the README and need permission to reuse.
- **Why:** the repo is public anyway, so a clear licence beats "all rights reserved" for trust and for any contributors. The code is a small UI, and the real value is the curated, sourced content, the brand and execution.
- **Trade-off:** anyone may copy, fork and even sell the code. Copies already taken stay under MIT even if we change the licence later. If protecting the code matters more, switch new versions to AGPL-3.0 or keep the repo private.

## 010. Live data is opt-in
- **Chose:** anything that calls Entur or Open-Meteo runs only after the visitor turns on the "Live data" switch, which says what it does in plain words.
- **Why:** keeps "no third-party requests by default" true and honest, since any call to those services reveals the visitor's IP address.
- **Also:** Entur's open API allows browser calls and asks clients to send `ET-Client-Name`.

## 011. Demo accounts stored in the browser, behind an interface
- **Chose:** sign up, sign in, sign out, protected pages and account deletion, implemented by `LocalAuthService` behind the `AuthService` interface. Passwords are hashed with PBKDF2 and a random salt. Sessions expire. Failed logins lock the email for a minute.
- **Why:** the demo needs to show real account flows now, but real accounts need a server and a data-protection setup that is not decided. Creating a hosted account on a service also needs the owner's own account, so it was not done on their behalf.
- **Trade-off:** this is not real security. Anyone with the device can read the stored data. It is labelled as a demo in the app and in `docs/architecture.md`.
- **Revisit when:** moving to a real launch. Implement `AuthService` against an EU-hosted provider and change one line in `app/container.ts`.
- **Also:** guests can use every feature except saving places and the trip plan.

## 012. Visual identity: "Aurora"
- **Chose:** deep polar-night blues with northern-lights teal, green and violet, Sora and Plus Jakarta Sans, Lucide icons, glass surfaces, and a custom illustrated hero.
- **Why:** the first version (cream background, one red accent) looked generic. The new look is distinctive, works well in both light and dark, and suits a Nordic product.

## 013. Open-Meteo for weather
- **Chose:** Open-Meteo, called from the browser only when Live data is on.
- **Why:** MET Norway is the natural source, but it rejects requests without a custom User-Agent, which browsers cannot send. Open-Meteo needs no key and allows browser calls.
- **Trade-off:** its free tier is for non-commercial use. A commercial launch needs their paid plan, or MET Norway behind a small proxy. The `WeatherService` interface makes that a one-file change.

## 014. Hash routing
- **Chose:** `/#/app/...` URLs.
- **Why:** works on plain static hosting such as GitHub Pages without server rules. In-page section links use JavaScript scrolling because `#section` anchors would clash with the router.

## 015. SOLID structure, tested
- **Chose:** domain, services (behind interfaces), UI layers with one composition root, and unit tests for the logic that matters (43 tests).
- **Why:** so a real backend, another weather provider or a new feature can be added without rewriting screens. See `docs/architecture.md`.

## 016. Guards decide by intent
- **Chose:** a protected page sends a signed-out visitor to sign-in (and back afterwards), but after a deliberate sign-out or account deletion it sends them home.
- **Why:** the first version sent people to the sign-in page right after they signed out, with a confusing "that page needs an account" message. The router applies navigation at a lower priority than state updates, so ordering the calls could not fix it.
