# Daniel Hu — personal site

Daniel's portfolio site: a Vite + React + TypeScript port (`src/`) of the finished design mockup
(`mockup/`, kept as the visual spec). `mockup/index.html` is the original site in one file and
`mockup/support.js` is the small runtime it needs. `DESIGN.md` is the design doc: vision,
palette, page structure, content, signature elements, recommended stack, build plan and open
questions. Read it before starting work. Treat the current look and behavior as the spec: when
porting or editing, match it exactly unless Daniel asks for a change.

## Run it

It must be served over http (opening the file directly with file:// half-works):

    npm run dev        # React port at http://localhost:5173
    npm run mockup     # original mockup at http://localhost:3000

## How the React port is organized

- `src/data/content.ts` holds all copy and placeholders (projects, hobbies, playlist, stickers).
- `src/components/` has one component per page section plus shared iPod pieces in `ipod.tsx`.
- `src/engine/` holds the imperative code moved over as-is: canvas drawing (`staffs.ts`,
  `hobbies.ts`, `scene.ts`, `mii.ts`), `cursor.ts`, `tilt.ts`, `sfx.ts`, `stickers.ts`. The engines
  find their canvases by id (`stf-*`, `hb-*`, `mii`, `boot-mii`, `hb-focus`), so keep those ids.
- `src/hooks/` holds the React state: player, focus overlay, section tracking, scroll reveal.
- `src/styles/global.css` is the mockup's stylesheet, unchanged.

To check the port still matches, serve both, dismiss the boot screen, freeze animations and
hide canvases, then pixel-diff full-page screenshots at 390, 824 and 1440px wide. That diff
was 0 pixels when the port landed.

## How mockup/index.html is organized

- `<x-dc>` holds the markup. `{{name}}` holes are filled from `renderVals()`.
  `<sc-for list="{{x}}" as="y">` loops and `<sc-if value="{{x}}">` conditionals are template tags.
- `<script type="text/x-dc" data-dc-script>` holds `class Component extends DCLogic`
  (React-like: `this.state`, `this.setState`, `componentDidMount`, `componentWillUnmount`).
- The `data-props` JSON on that script tag sets the default accent and avatar colors.

## Main pieces

| Feature | React port | Mockup (search in index.html) |
| --- | --- | --- |
| Boot screen (Wii-style menu bar, clock, loading bar) | `BootScreen.tsx`, `bootGo` in `App.tsx` | `.boot`, `bootGo()` |
| Animated 3D music staff ribbons behind sections | `engine/staffs.ts`, `engine/scene.ts` | `initStaffs()`, `drawStaff()` |
| 3D avatar (portrait on home, walks to clicks, waves, cheers, dances) | `engine/mii.ts` | `buildMii()`, `initMii()`, `miiReact()` |
| Wii-style hand cursor | `engine/cursor.ts` | `initCursor()` |
| iPod navigator (draggable, click wheel scrolls between sections) | `IpodNav.tsx`, `hooks/useSections.ts` | `aside.ipod`, `go(i)` |
| Bottom mini music player + sound-effects mute | `MiniPlayer.tsx`, `hooks/usePlayer.ts` | `.mini`, `playlist()`, `onTick()`, `skip()` |
| Featured project iPods (3D tilt, VIEW links) | `Projects.tsx`, `ProjectIpod` in `ipod.tsx`, `engine/tilt.ts` | `.slab3d.proj`, `projMove` |
| Concert Cover Flow (endless loop, reflections) | `CoverFlow` in `OffTheClock.tsx` | `flow`, `.photo3d` |
| Hobby 3D models (guitar, pencil, skis, volleyball) | `engine/hobbies.ts` | `buildHobbies()`, `drawHobbies()` |
| Click-to-focus overlay (Esc / X closes) | `FocusOverlay.tsx`, `hooks/useFocus.ts` | `openFocus()`, `closeFocus()` |
| Synthesized sound effects (Web Audio, no files) | `engine/sfx.ts` | `sfx()`, `initSfx()` |
| Sticker guestbook | `Guestbook.tsx`, `engine/stickers.ts` | `.gb-board`, `stickerUri()`, `gbAdd()` |

## Still placeholder (Daniel will supply)

Placeholders live in `src/data/content.ts` and the section components (and, in the mockup,
in index.html): `[PHOTO OF YOU]`, `[CONCERT PHOTO]` / `[VENUE]` / `[DATE]`,
`[CLARA SCREENSHOT]`, `[SIERRA SCREENSHOT]`, `[DISCO SCREENSHOT]`, `[FULL DETAILS COMING]`,
`[YOUR ROLE]`, `[STACK]`, `[DATES]`, `[FROM YOUR RESUME]`, `[SPOTIFY PLAYLIST EMBED]`,
`[YOUR PLAYLIST]`, the 5 songs in `PLAYLIST`, the hobby blurbs (`[A QUICK BLURB ABOUT ...]`),
`[NOTE]` sample stickers, and the `#resume` link. The domain is not decided yet.

## Not real yet

- Guestbook persistence is implemented through `/api/stickers` and Supabase; configure the
  environment variables in `STICKERS.md` and use the protected DELETE endpoint for moderation.
- The music player is simulated; the Spotify embed is a placeholder.

## Porting to a production stack

If asked to rebuild in a framework (React/Vite, Next.js, Astro, etc.), keep it pixel-identical:
port section by section, keep the canvas drawing code as-is in effects/hooks, keep the fonts
(M PLUS Rounded 1c from Google Fonts), and compare side by side with `npm run mockup` on this folder.
