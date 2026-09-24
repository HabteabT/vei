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

## 003. Web first, no account
- **Chose:** a website opened by QR code. No download, no login.
- **Why:** visitors will not install an app for a three-day stay, and it keeps privacy simple.
- **Revisit if:** offline use or notifications need a native app.

## 004. Show sources and dates instead of exact prices
- **Chose:** prices shown as "about", with source links and a "last checked" date.
- **Why:** official fares are in PDFs and change. Blogs disagree by a few kroner. Wrong prices would destroy trust.
- **Revisit if:** we get a reliable fare feed.

## 005. Self-hosted fonts, no third-party requests
- **Chose:** Fontsource packages instead of Google Fonts.
- **Why:** matches the privacy promise and avoids sending visitor IP addresses to a third party.

## 006. Stack: Vite, React, TypeScript, plain CSS
- **Why:** fast to build, easy to deploy as static files, no framework lock-in. No backend is needed for this version.
- **Revisit if:** we need server-side logic, accounts or many pages.

## 007. Public repository
- **Chose:** public from day one, at github.com/HabteabT/vei.
- **Why:** the owner's choice. Note that anyone can read the code and the documented ideas.

## 009. Licence: MIT for the code
- **Chose:** MIT, copyright Naibe Mehari Tekle. The name "Vei", the logo and the written content (`docs/`, `src/data/`) are excluded in the README and need permission to reuse.
- **Why:** the repo is public anyway, so a clear licence beats "all rights reserved" for trust and for any contributors. The code is a small UI, and the real value is the curated, sourced content, the brand and execution.
- **Trade-off:** anyone may copy, fork and even sell the code. Copies already taken stay under MIT even if we change the licence later. If protecting the code matters more, switch new versions to AGPL-3.0 or keep the repo private.

## 010. Live data is opt-in
- **Chose:** the site calls Entur (live airport trains) only when the visitor taps a button, and says so on the button.
- **Why:** keeps "no third-party requests by default" true and honest, since any call to Entur reveals the visitor's IP address to Entur.
- **Also:** Entur's open API allows browser calls and asks clients to send `ET-Client-Name`.

## 008. No AI assistant attribution in commits or docs
- **Chose:** commits use the owner's own git identity only.
