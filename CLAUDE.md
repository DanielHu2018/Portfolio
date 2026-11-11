# Daniel Hu — personal site

Daniel's portfolio site, hosted on Vercel at https://www.dwho.dev (dwho.dev redirects there;
dwho.vercel.app also works). It is a Vite + React + TypeScript app. `DESIGN.md` is the design
doc: vision, palette, page structure, content, signature elements and open questions. Read it
before starting work. Treat the current look and behavior as the spec: match it exactly unless
Daniel asks for a change.

## Run it

    npm run dev        # the site via Vite at http://localhost:5173
    npm run build      # what Vercel builds

`/api/*` routes are Vercel functions and don't run under Vite.

## Layout

- `src/App.tsx`: holds one `SiteController`, re-renders on every state change, renders the components in order.
- `src/site/controller.ts`: state and behavior (`setState` is synchronous and notifies React).
- `src/site/renderVals.ts`: turns controller state into the `SiteVals` every component reads, and holds the site's copy.
- `src/engine/`: canvas and pointer code that runs outside React (`staffs.ts`, `hobbies.ts`, `mii.ts`, `cursor.ts`).
- `src/components/`: one component per page piece; each takes `{ v }: { v: SiteVals }`.
- `src/styles/global.css`: the stylesheet.
- `api/`: Vercel functions: `now-playing.js` (Daniel's live Spotify status),
  `spotify-login.js` / `spotify-callback.js` (one-time flow to mint `SPOTIFY_REFRESH_TOKEN`),
  `stickers.js` + `stickers/[id].js` (guestbook, see `STICKERS.md`), `resume.js`.
- `scripts/` + `.github/workflows/update-receipts.yml`: every 6 hours, collect Spotify listening
  history into `data/spotify-history.json` and regenerate `public/assets/receipts/`.
- `scripts/optimize-images.py`: makes the web-sized photos in `public/assets/web/` and the WebP avatar
  sprites the site loads, from the full-size originals in `assets-src/` (not deployed). To add a photo,
  put it in `assets-src/`, add it to `PHOTOS` in the script, and run it.

Canvases are found by id (`stf-*`, `hb-*`, `mii`, `boot-mii`, `hb-focus`), so keep those ids. The
avatar sprite is the `.mii-sprite` img inside `.mii-wrap`. Inline styles are matched by string in
places (`initCursor` looks for `[style*="cursor: pointer"]`), so keep them inline.

## Main pieces

| Feature | Where |
| --- | --- |
| Boot screen (Wii-style menu bar, clock, loading bar) | `components/BootScreen.tsx`, `bootGo()` in the controller |
| Animated 3D music staff ribbons behind sections | `engine/staffs.ts` |
| Avatar sprites from `public/assets/avatar/` (portrait on home, walks to clicks in 16 directions, waves, cheers, dances while Daniel is listening) | `engine/mii.ts`, `components/Avatar.tsx` |
| Wii-style hand cursor | `engine/cursor.ts`, `components/WiiCursor.tsx` |
| iPod navigator (draggable, click wheel scrolls between sections) | `components/IpodNav.tsx`, `go(i)` in the controller |
| "Currently listening to" badge | `components/NowPlaying.tsx`, `watchNowPlaying()` in the controller |
| Spotify receipts iPod (wheel arrows switch Top Tracks / Top Artists / Favorite Albums; an album opens its favorite songs) | `components/ReceiptScreen.tsx` (screen, shared by `OffTheClock.tsx` and `FocusOverlay.tsx`), `site/albums.ts` (album list), `loadReceipts()` in the controller |
| Featured project iPods (3D tilt, VIEW links) | `components/Projects.tsx`, `projMove` |
| Concert Cover Flow (endless loop, reflections) | `components/OffTheClock.tsx`, `.photo3d` |
| Hobby 3D models (guitar, pencil, skis, volleyball) | `engine/hobbies.ts` |
| Click-to-focus overlay (Esc / X closes) | `components/FocusOverlay.tsx`, `openFocus()`, `closeFocus()` |
| Synthesized sound effects (Web Audio, no files) | `sfx()`, `initSfx()` in the controller |
| Sticker guestbook | `components/Contact.tsx`, `stickerUri()`, `gbAdd()` in the controller |

The site plays no music itself; the click-wheel play/pause glyphs are decorative.

## Still placeholder

The `[NOTE]` sample stickers in the guestbook seed.

## Checking a change didn't alter the site

`npm run port:baseline` builds a reference copy of the site from a fixed commit (set in
`tests/port/setup-baseline.mjs`) into `.port-baseline/`. `npm run test:port` then builds nothing but
compares `dist/` against it, scenario by scenario: DOM, computed styles, sounds, requests, canvases
and pixels. Run `npm run build` first. The full run takes over an hour and a lot of memory, so use
`--workers=1` or `2`, and `-g` or `--shard` to run part of it. An intentional change makes the
affected scenarios fail until the baseline commit is moved to include it.
