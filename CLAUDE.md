# Daniel Hu — personal site

Daniel's portfolio site, hosted on Vercel at https://www.dwho.dev (dwho.dev redirects there;
dwho.vercel.app also works). The whole site lives in `mockup/index.html`, with
`mockup/support.js` as the small runtime it needs. `src/App.tsx` is a thin Vite + React shell
that imports both files raw and mounts them, so **edits to the site go in `mockup/index.html`**.
`DESIGN.md` is the design doc: vision, palette, page structure, content, signature elements and
open questions. Read it before starting work. Treat the current look and behavior as the spec:
match it exactly unless Daniel asks for a change.

## Run it

It must be served over http (opening the file directly with file:// half-works):

    npm run dev        # the site via Vite at http://localhost:5173 (what Vercel builds)
    npm run mockup     # the same file served raw at http://localhost:3000

`/api/*` routes are Vercel functions and don't run under either command.

## Layout

- `mockup/index.html`: markup, styles and component logic for the whole site.
- `src/App.tsx`, `src/main.tsx`: mount the mockup; `src/styles/global.css` is its stylesheet.
- `api/`: Vercel functions: `now-playing.js` (Daniel's live Spotify status),
  `spotify-login.js` / `spotify-callback.js` (one-time flow to mint `SPOTIFY_REFRESH_TOKEN`),
  `stickers.js` + `stickers/[id].js` (guestbook, see `STICKERS.md`), `resume.js`.
- `scripts/` + `.github/workflows/update-receipts.yml`: every 6 hours, collect Spotify listening
  history into `data/spotify-history.json` and regenerate `public/assets/receipts/`.

## How mockup/index.html is organized

- `<x-dc>` holds the markup. `{{name}}` holes are filled from `renderVals()`.
  `<sc-for list="{{x}}" as="y">` loops and `<sc-if value="{{x}}">` conditionals are template tags.
- `<script type="text/x-dc" data-dc-script>` holds `class Component extends DCLogic`
  (React-like: `this.state`, `this.setState`, `componentDidMount`, `componentWillUnmount`).
- The `data-props` JSON on that script tag sets the default accent and avatar colors.
- Canvases are found by id (`stf-*`, `hb-*`, `mii`, `boot-mii`, `hb-focus`), so keep those ids.

## Main pieces (search in index.html)

| Feature | Where |
| --- | --- |
| Boot screen (Wii-style menu bar, clock, loading bar) | `.boot`, `bootGo()` |
| Animated 3D music staff ribbons behind sections | `initStaffs()`, `drawStaff()` |
| 3D avatar (portrait on home, walks to clicks, waves, cheers, dances while Daniel is listening) | `buildMii()`, `initMii()`, `miiReact()` |
| Wii-style hand cursor | `initCursor()` |
| iPod navigator (draggable, click wheel scrolls between sections) | `aside.ipod`, `go(i)` |
| "Currently listening to" badge | `.np`, `watchNowPlaying()` |
| Spotify receipts iPod (wheel arrows switch views) | `loadReceipts()`, `trackPrev` / `trackNext` |
| Featured project iPods (3D tilt, VIEW links) | `.slab3d.proj`, `projMove` |
| Concert Cover Flow (endless loop, reflections) | `flow`, `.photo3d` |
| Hobby 3D models (guitar, pencil, skis, volleyball) | `buildHobbies()`, `drawHobbies()` |
| Click-to-focus overlay (Esc / X closes) | `openFocus()`, `closeFocus()` |
| Synthesized sound effects (Web Audio, no files) | `sfx()`, `initSfx()` |
| Sticker guestbook | `.gb-board`, `stickerUri()`, `gbAdd()` |

The site plays no music itself; the click-wheel play/pause glyphs are decorative.

## Still placeholder

The `[NOTE]` sample stickers in the guestbook seed.

## Porting to a production stack

If asked to rebuild in a framework (React/Vite, Next.js, Astro, etc.), keep it pixel-identical:
port section by section, keep the canvas drawing code as-is in effects/hooks, keep the fonts
(M PLUS Rounded 1c from Google Fonts), and compare side by side with `npm run mockup`: serve
both, dismiss the boot screen, freeze animations and hide canvases, then pixel-diff full-page
screenshots at 390, 824 and 1440px wide.
