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

## Hero video

`assets/video/hero.mp4` — 1280×720, H.264 Main L3.1, 5.04s, **no audio track**,
1.5 MB, `moov` before `mdat` so playback starts without waiting for the whole
file. Good as supplied; it did not need re-encoding.

The video is the hero's only picture. There is no `poster` and no still image
behind it, so nothing can paint ahead of the footage:

1. `<video>` — autoplay, muted, looped, `playsinline` (without which iOS
   Safari takes it fullscreen), `preload="auto"`.
2. The container's gradient, which holds the space until the first frame
   arrives and stands in permanently if the file never does.

`main.js` hides the video only when the source errors — the file cannot be
fetched or decoded — leaving the gradient. Refused autoplay (a data saver,
battery saver, or iOS low-power mode) no longer hides it: the frame on screen
is the video's own, so it stays and playback starts at the first interaction.
Under `prefers-reduced-motion: reduce` the video is held on its opening frame
rather than removed, which keeps the picture and drops the movement.

**Not verified in a browser here.** The build environment's Chromium ships
without H.264 and its bundled ffmpeg has no MP4 demuxer, so the video could not
be decoded to confirm playback. The file's
structure was parsed directly and is sound, and the hero layout was verified by
substituting a codec the sandbox can decode. Play the page in a real browser to
confirm, and check the copy stays legible against the footage — the hero scrim
is heaviest on the left, where the text sits.

To swap the video, replace the file at the same path. A `poster` is deliberately
not set — a poster frame paints before the footage and was the reason the hero
showed a different image first.

## Photography

Two photographs are hotlinked from Unsplash:

| Section | URL |
|---|---|
| House | `images.unsplash.com/photo-1585059895524-72359e06133a` |
| Trade | `images.unsplash.com/photo-1553413077-190dd305871c` |

**These URLs could not be verified from the build environment** — its network
blocks `images.unsplash.com` — so open the page in a real browser and confirm
both resolve before sending it anywhere.

If one fails, nothing breaks: `[data-fallback]` containers own their aspect
ratio and carry a warm gradient, and `main.js` hides the `<img>` on error, so
the layout holds and no broken-image icon appears. Swapping in the client's own
photographs is a matter of replacing the two `src` values — both frames are
4:5.

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
- Hero media box fills the hero at both widths (it previously collapsed to
  zero height: `[data-fallback]` set `position: relative`, tying with
  `.hero__media` on specificity and winning on source order)
- Video path checked with a substitute codec: the element covers the hero,
  plays, loops, and falls back to the container's gradient when the source
  cannot be decoded
