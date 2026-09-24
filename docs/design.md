# Design system

Goal: feel calm, clear and trustworthy, like a good local friend. Visitors are tired, in a hurry and often on a phone.

## Principles

1. **One clear answer.** Show the recommendation first, the detail on demand.
2. **Show your working.** Sources and "last checked" dates are part of the interface, not fine print.
3. **Phone first.** The prototype lives in a phone frame. On small screens it fills the width.
4. **Quiet motion.** Small reveals and one floating card. All motion turns off with `prefers-reduced-motion`.

## Colour

Defined as CSS variables in `src/styles/global.css`. Dark mode follows the system setting.

| Token | Light | Use |
|---|---|---|
| `--bg` | `#f6f3ec` | Page background, warm fog |
| `--ink` | `#0e2a2f` | Text, deep fjord |
| `--brand` | `#d63b1f` | Main accent, rorbu red. Buttons, key numbers |
| `--fjord` | `#1f6f78` | Secondary accent. Tips, links |
| `--good` | `#1f7a4d` | "Best" and "works" |
| `--warn` | `#a4470a` | "Watch out" and "check first" |

Muted text is `#566a6d` on the light background to keep normal text above a 4.5:1 contrast ratio.

## Type

- Headings: Bricolage Grotesque (variable), tight tracking
- Body and UI: Inter (variable)
- Both are self-hosted through Fontsource, so no request goes to Google.

## Components

- **Buttons:** pill shaped. Primary is the brand colour. Ghost is outlined.
- **Cards:** white surface, 1px line, soft shadow. The best option gets a green ring.
- **Segmented control:** for sort and question answers. Uses `aria-pressed` or `role="radio"`.
- **Pills:** filter chips.
- **Phone frame:** fixed 740px screen height, scrolling content, bottom tab bar.

## Accessibility

- Skip link to main content
- The tab bar is a real `tablist` with arrow-key navigation
- Visible focus rings, decorative icons hidden from screen readers
- Live region on the ticket recommendation
- Text scales with the browser's font size
- The page works without JavaScript for reading (reveal effects only start once JavaScript runs)

## Voice

Plain English, short sentences, no jargon. Say "about" when unsure. Say what to do, not just what is true.

## Next design steps

- Test with real visitors on real phones outdoors
- Add German and Norwegian
- An offline state and an "add to home screen" prompt
