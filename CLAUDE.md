# Daniel Hu — personal site

This folder is the finished design mockup of Daniel's portfolio site, exported as-is.
`mockup/index.html` is the whole site (markup, styles and logic in one file). `support.js` is the small
runtime it needs (it bundles React and a template engine). `DESIGN.md` is the design doc: vision,
palette, page structure, content, signature elements, recommended stack, build plan and open
questions. Read it before starting work. Treat the current look and behavior as the spec: when
porting or editing, match it exactly unless Daniel asks for a change.

## Run it

It must be served over http (opening the file directly with file:// half-works):

    npm run dev        # React port at http://localhost:5173
    npm run mockup     # original mockup at http://localhost:3000

## How index.html is organized

- `<x-dc>` holds the markup. `{{name}}` holes are filled from `renderVals()`.
  `<sc-for list="{{x}}" as="y">` loops and `<sc-if value="{{x}}">` conditionals are template tags.
- `<script type="text/x-dc" data-dc-script>` holds `class Component extends DCLogic`
  (React-like: `this.state`, `this.setState`, `componentDidMount`, `componentWillUnmount`).
- The `data-props` JSON on that script tag sets the default accent and avatar colors.

## Main pieces (search these names in index.html)

| Feature | Where |
| --- | --- |
| Boot screen (Wii-style menu bar, clock, loading bar) | `.boot`, `bootGo()` |
| Animated 3D music staff ribbons behind sections | `initStaffs()`, `drawStaff()` |
| 3D avatar (portrait on home, walks to clicks, waves, cheers, dances) | `buildMii()`, `initMii()`, `miiReact()` |
| Wii-style hand cursor | `initCursor()` |
| iPod navigator (draggable, click wheel scrolls between sections) | `aside.ipod`, `go(i)` |
| Bottom mini music player + sound-effects mute | `.mini`, `playlist()`, `onTick()`, `skip()` |
| Featured project iPods (3D tilt, VIEW links) | `.slab3d.proj`, `projMove` |
| Concert Cover Flow (endless loop, reflections) | `flow`, `.photo3d` |
| Hobby 3D models (guitar, pencil, skis, volleyball) | `buildHobbies()`, `drawHobbies()` |
| Click-to-focus overlay (Esc / X closes) | `openFocus()`, `closeFocus()` |
| Synthesized sound effects (Web Audio, no files) | `sfx()`, `initSfx()` |
| Sticker guestbook | `.gb-board`, `stickerUri()`, `gbAdd()` |

## Still placeholder (Daniel will supply)

Bracketed text in index.html: `[PHOTO OF YOU]`, `[CONCERT PHOTO]` / `[VENUE]` / `[DATE]`,
`[CLARA SCREENSHOT]`, `[SIERRA SCREENSHOT]`, `[DISCO SCREENSHOT]`, `[FULL DETAILS COMING]`,
`[YOUR ROLE]`, `[STACK]`, `[DATES]`, `[FROM YOUR RESUME]`, `[SPOTIFY PLAYLIST EMBED]`,
`[YOUR PLAYLIST]`, the 5 songs in `playlist()`, the hobby blurbs (`[A QUICK BLURB ABOUT ...]`),
`[NOTE]` sample stickers, and the `#resume` link. The domain is not decided yet.

## Not real yet

- Guestbook persistence is implemented through `/api/stickers` and Supabase; configure the
  environment variables in `STICKERS.md` and use the protected DELETE endpoint for moderation.
- The music player is simulated; the Spotify embed is a placeholder.

## Porting to a production stack

If asked to rebuild in a framework (React/Vite, Next.js, Astro, etc.), keep it pixel-identical:
port section by section, keep the canvas drawing code as-is in effects/hooks, keep the fonts
(M PLUS Rounded 1c from Google Fonts), and compare side by side with `npm run mockup` on this folder.
