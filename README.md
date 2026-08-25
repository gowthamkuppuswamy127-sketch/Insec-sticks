# Incense Creators — single-page site

A static, single-page site for Incense Creators, manufacturers and exporters of
agarbatti, dhoop and pooja oils in Bengaluru (est. 1989).

No build step, no dependencies. Open `index.html` in a browser, or serve the
folder from any static host (Netlify, Vercel, GitHub Pages, S3, plain nginx).

```
index.html
assets/css/styles.css
assets/js/main.js
```

## Design

| | |
|---|---|
| Ground | `#12100E` charcoal, with `#191612` / `#211D18` for bands and cards |
| Text | `#F7F3EA` paper, `#B8B0A3` muted |
| Brass | `#C9A227` — house marks and section indices only |
| Ember | `#E0662F` — means "lit": scent-weight bars and the primary action |
| Type | Cormorant Garamond (display) + Inter (body, tabular figures for data) |

Every text pairing clears WCAG AA on its own ground (lowest is ember on card at
4.87:1). Rules are drawn in low-opacity paper, never in gold.

**Signature — the register.** The product range is presented as a perfumer's
register rather than a card grid: name, family, format, and a horizontal ember
bar whose length is the datum. The bars draw themselves as each row scrolls in.
Below 760px the table becomes stacked records so the bar stays on screen at
full width instead of hiding behind a horizontal scroll.

## Content sources

Company facts (founding year and founder, the four first employees, the awards,
the ten-plus export markets, the address and phone numbers, the product names)
are taken from the client's existing site and their IndiaMART / TradeIndia /
ExportersIndia trade profiles.

Two things on the page are **written, not sourced**, and should be checked with
the client before this goes live:

1. **Scent-weight values** in the register (the `--w` custom property on each
   `<tr>`). These are indicative placeholders. The section says so in print, but
   replace them with the client's real figures — or swap the column for burn
   time, which buyers ask about more.
2. **The five making stages.** Standard good practice for masala agarbatti, not
   a description of this specific factory's line. Confirm before publishing.

## Photography

Three photographs are hotlinked from Unsplash:

| Section | URL |
|---|---|
| Hero | `images.unsplash.com/photo-1602928321679-560bb453f190` |
| House | `images.unsplash.com/photo-1585059895524-72359e06133a` |
| Trade | `images.unsplash.com/photo-1553413077-190dd305871c` |

**These URLs could not be verified from the build environment** — its network
blocks `images.unsplash.com` — so open the page in a real browser and confirm
all three resolve before sending it anywhere.

If one fails, nothing breaks: `[data-fallback]` containers own their aspect
ratio and carry a warm gradient, and `main.js` hides the `<img>` on error, so
the layout holds and no broken-image icon appears. Swapping in the client's own
photographs is a matter of replacing the three `src` values — the frames are
4:5 for House and Trade, and full-bleed for the hero.

## Behaviour

JavaScript is progressive enhancement only; the page is fully readable and
usable without it.

- Scroll reveals via `IntersectionObserver`. The root is extended far above the
  viewport so anything at or above the fold reveals immediately — without that,
  an element already scrolled past on a deep link such as `/#register` would
  never intersect and would stay invisible.
- `prefers-reduced-motion` is respected: transitions collapse and the register
  bars render at full length.
- The enquiry form validates, then composes a `mailto:` message. There is no
  backend. To take submissions server-side, point the `<form>` at a handler
  (Formspree, Netlify Forms, or your own endpoint) and drop the submit handler
  in `main.js`.

## Checked

- Chromium, 1440×900 and 390×844
- No console errors; no horizontal overflow at either width
- All interactive controls ≥44px tall except inline links inside sentences
- Deep links to every section render fully
