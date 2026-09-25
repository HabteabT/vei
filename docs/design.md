# Design system: "Aurora"

Goal: calm, clear and a little magical, like the northern lights over a quiet fjord. Visitors are tired, in a hurry and on a phone, so it has to be readable first and pretty second.

## Principles

1. **One clear answer.** Show the recommendation first, the detail on demand.
2. **Show your working.** Sources, "last checked" dates and "about" wording are part of the interface.
3. **Phone first.** Bottom navigation on phones, a sidebar on wide screens.
4. **Quiet motion.** Small reveals and a gentle float on the hero cards. All of it stops under `prefers-reduced-motion`.
5. **Honest privacy.** Anything that contacts a third party is behind a switch and explained in plain words.

## Colour

Tokens live in `src/styles/tokens.css`. The theme follows the system, and can be forced with the sun/moon toggle, which sets `data-theme` on `<html>`.

| Token | Ice (light) | Polar night (dark) | Use |
|---|---|---|---|
| `--bg` | `#f1f5fb` | `#070b16` | Page |
| `--bg-elev` | `#ffffff` | `#101932` | Cards |
| `--ink` | `#0a1428` | `#f1f5ff` | Text |
| `--brand` | `#3f5fff` | `#3f5fff` | Buttons, key actions |
| `--aurora-a/b/c/d` | teal, green, violet, sky | same | Gradients, icon tiles, focus ring |
| `--good` / `--warn` / `--danger` | greens, ambers, reds | lighter versions | Status |

Aurora colours are used for decoration and highlights. Body text and controls use the ink and brand colours, which meet contrast for small text in both themes.

## Type

- Headings: **Sora** (variable), tight tracking
- Body and UI: **Plus Jakarta Sans** (variable)
- Both are self-hosted through Fontsource, so no request goes to Google.

## Icons

[Lucide](https://lucide.dev), one consistent stroke style. Icons are decorative (`aria-hidden`) unless they are the only label, in which case the button carries an `aria-label`.

## Components (`src/ui`)

- **Button / LinkButton / IconButton**: primary, secondary, ghost, danger, aurora; sizes sm, md, lg; loading state.
- **TextField / PasswordField**: label, icon, hint, error, show/hide, strength meter.
- **Segmented**, **chips**, **badges**, **alerts**, **empty states**, **skeletons**, **progress ring**.
- **Modal**: the native `<dialog>`, so focus trapping and Escape work by default.
- **Toast**: a polite live region.

## City search

One combobox at the top of the app (`CitySearch`). It lists the cities in this version and filters as you type. The current city stays in the field when the list is closed. Phone and wide screens share that one bar, stuck to the top of the content so it does not scroll away.

## Layout

- Marketing site: hero with an illustrated night-sky scene, features, steps, privacy, demo CTA, roadmap.
- Auth pages: split layout on wide screens, single column on phones.
- App: sidebar (wide) or top bar plus bottom nav (phone). Content is capped at 880px.

## Accessibility

- Skip links, visible focus rings, semantic landmarks
- Segmented controls and chips use `aria-pressed`. Checklist rows use `role="checkbox"`
- Place search is a proper combobox with a listbox and keyboard support
- Errors are announced (`role="alert"`) and tied to their fields
- Text scales with the browser's font size

## Voice

Plain English, short sentences, no jargon. Say "about" when unsure. Say what to do, not only what is true.

## Not done yet

- Real-device testing outdoors, in bright sun
- Norwegian and German
- Installable icons in PNG (the manifest currently points at the SVG)
