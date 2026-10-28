# Personal Site Redesign: Wii × iPod

Oct 28, 2026 · Daniel Hu · Live version: https://claude.ai/artifact/S8xM6HCSmufTUcRzkKrdTD

## Vision

The site looks like a Wii menu crossed with an iPod: a white glossy interface with gray chrome rims, rounded type and toy-like 3D you can poke at. Underneath, it is a recruiter-friendly portfolio for a new grad software and AI engineer graduating December 2026. The working mockup is the spec: [Personal Site Mockup](https://claude.ai/artifact/JM1h7TbWnPZpWVoD2zAWdY) (also `index.html` in this folder).

**Design principles**

1. **Recruiter facts first.** Name, role, school, grad date and contact links are on the home screen the moment the boot screen closes.
2. **Everything is tactile.** Cards tilt toward the cursor, buttons click with a sound, the avatar walks to where you click. Nothing is static that a visitor might want to touch.
3. **The look is retro-digital; the words are plain.** Copy stays professional (Experience, Projects, Contact) with no animation or console wordplay.
4. **All code, no downloaded assets.** The avatar, hobby models, music staffs, stickers and sounds are drawn or synthesized in code.
5. **Original, not copied.** The Wii and iPod are inspiration only: no Nintendo or Apple logos, characters, sounds or product designs. The avatar, cursor, headphones and volleyball are original designs.

**Direction history:** started as a sakuga (anime animation) concept, moved to Y2K, then to the Wii and underscores look, then added iPod hardware. Sakuga was dropped.

## Audience and the recruiter fast path

Recruiters come first: after one click past the boot screen, a recruiter sees name, role, school, grad date and every contact link without scrolling. Personal sections come after the professional ones and are there to make Daniel memorable.

**Fast-path rules**

- The home screen shows: Daniel Hu, a "Software and AI Engineer" pill, "Honors CSE at Ohio State · Statistics minor · Graduating December 2026 · Columbus, OH", and a dock with LinkedIn, Resume, GitHub and the email address as text.
- The boot screen closes on any click or key and its loading bar lasts about 1.6 seconds.
- The iPod navigator stays pinned on the right on every section (behind a menu button on phones), so any section is one click away.
- The mini music player stays at the bottom of every screen.
- Every section is at least one full screen tall, so each one gets its own moment.
- Every project card leads with one plain sentence of what it is before any visual flourish.

## Visual language

The look is a clean white console menu: glossy white panels, gray chrome rims, one bright Wii-style blue for actions, and soft pastel section backgrounds. Values below are the ones in the mockup.

**Palette**

| Token | Hex | Use |
| --- | --- | --- |
| white | #FFFFFF | Page and panel base |
| scanline | #F3F5F8 | Faint horizontal lines behind every section |
| rim | #D5DAE1 | Borders, iPod bodies, button outlines |
| ink | #3C4046 | Headings and body text |
| action blue | #34BEED | Buttons, highlights, selected states (Tweakable accent) |
| deep blue | #1A9CCB | Button borders, pressed states |
| sky | #BDEBFB | Pills, Contact gradient start |
| cream | #FFF6D6 | Off the clock background |
| staff pink | #FF6FB5 | Gradient on the music staff ribbons |

**Typography**

- Everything: M PLUS Rounded 1c (Google Fonts), weights 400 to 800. Rounded, friendly, console-like.
- iPod screens: Helvetica Neue or Arial at small sizes, like the real menu text.

**Surfaces**

- Glossy panels: a top-to-bottom white-to-gray gradient with a bright inner top edge.
- Shadows are halftone particle dots, never soft blurs.
- 3D cards show real side edges when tilted, built from stacked layers.
- Polished chrome frame around the Contact and Guestbook cards.

**Motion vocabulary**

| Motion | What it looks like | Where it's used |
| --- | --- | --- |
| Rise in | Section items fade and rise once as they scroll into view | Every section |
| Ripple staffs | Five-line music staffs twist, ripple and slide in 3D, notes riding on them | Behind Home, Projects, Skills, Off the clock, Contact |
| Tilt | Card turns toward the cursor, showing its sides, then eases back | Project iPods, Spotify iPod, concert photos, photo of Daniel |
| Spin | Cover Flow rotates to the next photo | Concert photos |
| Zoom to focus | Clicked item flies to the center of a dimmed screen | Any photo, iPod or hobby model |
| Walk | Avatar shrinks to an isometric view, walks to the click, then returns | Anywhere on the page |
| Pop | Panels scale up with a small bounce; stickers pop onto the board | Boot screen, guestbook |

## Page structure

One long scroll in seven sections behind a boot screen, ordered so the professional story is finished before the personal one starts.

0. **Boot screen (every visit).** Wii-menu style: a glossy panel with Daniel's avatar portrait, name and role; "Press anywhere to start"; a curved gray menu bar with a live clock and date, a DH button and a mail button. On press, a startup chime plays, a striped blue loading bar fills in about 1.6 s, then the screen fades into Home.
1. **Home.** Huge name, role pill, school line, the avatar's circle portrait, and a bottom dock with LinkedIn, Resume, GitHub and email.
2. **About.** Short bio beside a thin 3D photo card of Daniel with a gray outline, tape and a gentle flap.
3. **Experience.** Nationwide, the OSU robotics lab and BDAA.
4. **Projects.** CLARA, Sierra and Disco as three 3D iPods; each screen shows the project and the click wheel's center button says VIEW.
5. **Skills.** A single music staff ribbon above the toolkit grid of languages, AI/ML and tools.
6. **Off the clock.** Concert photo Cover Flow, a Spotify iPod for the playlist, and four 3D hobby models (guitar, pencil, skis, volleyball).
7. **Contact.** "Let's build something together" card with Resume, LinkedIn, GitHub and email, then the sticker guestbook, then the credit line.

**Always on screen:** the iPod navigator (right side, draggable), the mini music player (bottom), the Wii-style hand cursor (mouse only) and the avatar.

## Content inventory

All professional content comes from the current resume, so the site and the PDF never disagree. Bracketed items in the mockup (like [STACK]) still need copy or assets from Daniel; see Open questions.

**Professional**

| Section | Item | Content |
| --- | --- | --- |
| Home | Identity | Daniel Hu, Software and AI Engineer, Honors CSE at Ohio State with a Statistics minor, graduating Dec 2026, Columbus OH |
| About | Bio | Builds agentic AI applications on top of foundation models; Engineering Honors; 3.8 GPA; National Merit Scholar; a photo card of Daniel |
| Experience | Nationwide | Software Engineering Intern, Annuity and Retirement, Quality Corps; enterprise financial platform module with 15+ features and 20+ endpoints on PostgreSQL, REST and Angular |
| Experience | OSU robotics lab | Undergraduate AI/ML Researcher, two years; vision-language-action and CNN behavior-cloning policies for manipulation on a UR5e arm, tracked in Weights & Biases |
| Experience | BDAA | Lead of the Foundations of AI track for a 100+ member student organization |
| Projects | CLARA | 1st place, IBM SkillsBuild x OSU FinTech hackathon; Black-Scholes plus a Claude-powered competitive intelligence agent on AWS Bedrock |
| Projects | Sierra | Transmission line routing with multi-objective pathfinding and RAG over regulatory documents |
| Projects | Disco | HackOHI/O 2026; turns friends' opinions into recommendations and coordinates group plans through agents. Details to come |
| Skills | Toolkit | Languages, AI/ML and tools, ordered by relevance as on the resume |
| Links | Buttons | Resume PDF; [LinkedIn](https://www.linkedin.com/in/danielhu2005); [GitHub](https://github.com/DanielHu2018); hu.daniel.w@gmail.com shown as plain text |

Each project iPod needs: a one-line summary, Daniel's role, stack, one result, a screenshot for its screen, and a link for VIEW.

**Personal (Off the clock)**

| Hobby | How it appears |
| --- | --- |
| Going to concerts | Cover Flow of photo cards with artist, venue and date; endless loop with solid reflections, skip arrows and drag |
| Listening to music | Spotify iPod with the playlist embed, plus the mini player's playlist on every page |
| Learning guitar | 3D electric guitar model |
| Drawing | 3D pencil model (code-drawn only; no sketches shown) |
| Skiing | 3D pair of pink skis with poles |
| Volleyball | 3D white volleyball with classic panel seams, no brand logos |

Clicking any hobby model opens it in focus with a one-sentence blurb in Daniel's voice (to write).

## Signature elements

These are built and working in the mockup; the backlog at the end lists what could come next.

**Built**

1. **3D avatar.** A Mii-style figure of Daniel built in code: round head, short dark hair with a fringe, simple dot eyes and smile, slim normal build, blue shirt, silver headphones with rounded-rectangle cups.
    - On Home it sits in a circle portrait; it also appears on the boot screen.
    - Click anywhere and it shrinks to an isometric view, walks there with a ripple at the target, then walks back and grows into the portrait.
    - Reactions: waves when you hover the name, cheers beside a project you open (and idles there until you close it), dances with floating notes while music plays.
2. **iPod navigator.** A white iPod pinned to the right: its menu lists the sections and highlights the current one; MENU, back, forward and the center button move between sections; play and pause control the music. It can be dragged anywhere. On phones it opens from a button in the mini player.
3. **Music staff ribbons.** Five-line staffs with simple line-style notes twist, ripple and slide in 3D behind sections, fading blue to pink.
4. **Project iPods.** Each project is a 3D iPod you can see the sides of; it tilts toward the cursor and springs back. The screen shows the project; VIEW opens it.
5. **Concert Cover Flow.** Photo cards in an endless loop with solid mirrored reflections. iPod-style skip buttons or a drag spin the carousel; cards tilt on hover and glide back.
6. **Hobby models.** Guitar, pencil, skis and volleyball idle-spin on their own; click one to focus it with its blurb.
7. **Focus mode.** Clicking the photo of Daniel, a project iPod, a concert photo, the Spotify iPod or a hobby model flies it to the center over a dimmed page; Esc, the X or a click outside closes it.
8. **Mini player.** A small bar on every page with track, progress, skip back, play or pause and skip forward, kept in sync with the navigator and the Spotify iPod.
9. **Wii-style cursor.** An original white pointing-hand cursor that tilts as it moves, grows over clickable things and presses on click. Mouse only.
10. **Sound effects.** Soft ticks on hover, blips on click, a swipe on skip, chimes for focus open and close, a startup chime and a sticker jingle. All synthesized in the browser; a speaker button in the mini player mutes them and is remembered.
11. **Sticker guestbook.** "Leave a sticker :)": pick one of 8 die-cut stickers (music note, star, heart, flower, snowflake, sun, double note, sparkle), add an optional note ("Say hi!", up to 40 characters), then tap the board to stick it. Stickers land tilted with a pop; notes show as small tags underneath.

**Backlog (ideas, not built)**

- Project detail pages behind each VIEW button: problem, role, stack, results.
- Achievements: badges like "Visited every section" or "Left a sticker".
- A click-wheel mini game (volleyball keep-up or ski slalom).
- Easter egg: spin the click wheel a full circle and the avatar plays air guitar.
- Night mode: navy UI, glowing staffs, sleepy avatar.

## Tech stack

Recommendation: port the mockup to Vite + React + TypeScript and host it statically. The mockup already runs on a small React-based runtime, so a React port is the shortest path to a pixel-identical site, and nothing in it needs a 3D library.

| Layer | Mockup today | Production choice |
| --- | --- | --- |
| Page | One HTML file with a template and a component class | Vite + React + TypeScript, one component per section |
| 3D (avatar, hobby models, staffs) | Hand-written software 3D on Canvas 2D: flat shading, painter's sort, glossy spheres and tubes | Keep the same code as plain modules called from effects; no Three.js needed |
| iPods, cards, Cover Flow | CSS 3D transforms with stacked edge layers | Same CSS, moved into component styles |
| Sound | Web Audio oscillators, no files | Same code |
| Stickers | SVG built in code, used as images | Same code |
| Guestbook storage | In memory only (resets on reload) | Serverless function + small database (for example Cloudflare D1 or Supabase), with rate limiting and a way to remove stickers |
| Music | Simulated playlist; Spotify embed placeholder | Spotify playlist embed; mini player shows the playlist's tracks |
| Photos | Placeholders | AVIF/WebP, resized and lazy-loaded |
| Hosting | Claude artifact | Vercel or Cloudflare Pages on Daniel's domain |

The handoff package (below) includes the mockup files, so the port can be compared side by side as it is built.

## Performance and accessibility

The toy-like 3D only impresses if it stays smooth on a recruiter's mid-range laptop and phone. In headless testing the mockup went from 12 to 26 fps up to 46 to 60 fps after the optimizations below.

| Metric | Target |
| --- | --- |
| Largest Contentful Paint | under 2.0 s on 4G mobile |
| Frame rate | 60 fps on a mid-range laptop, 30+ fps on mid-range phones |
| Lighthouse | 90+ on Performance, Accessibility, Best Practices, SEO |
| Cumulative Layout Shift | under 0.05 |

**Performance tactics (in the mockup)**

- Staff ribbons render at reduced resolution (0.8 × device pixels) and redraw at 30 fps.
- The avatar redraws at 30 fps when it is standing still.
- 3D side layers on iPods and photos are added only while hovered.
- Canvas loops pause when their section is off screen.

**Accessibility**

- `prefers-reduced-motion` turns off reveals, ripples and the walk animation; content stays the same.
- The custom cursor only appears on mouse devices; touch keeps normal taps (phones get taps for the avatar walk).
- Every control is a real button or link with a label; Esc closes focus mode; the guestbook board accepts Enter.
- Decorative canvases are hidden from screen readers; the 3D models carry text labels.
- On phones (under 700 px) the layout stacks, the navigator hides behind a menu button, and touch targets are at least 44 px.

## Build plan

The design is done; what is left is real content, a production port and two small backends. The site can ship after step 3 with the guestbook hidden.

1. **Fill the placeholders.** Photos, project screenshots and roles, Disco details, experience dates, skills, hobby blurbs, playlist and song names (see Open questions).
2. **Set up the repo in Claude Code** from the handoff package and put it under git.
3. **Port to Vite + React + TypeScript**, section by section, keeping it pixel-identical; compare against the mockup served locally.
4. **Guestbook backend.** Store stickers, rate-limit posts, and add a simple way for Daniel to remove one.
5. **Real music.** Spotify playlist embed in the Spotify iPod; mini player lists the playlist's tracks.
6. **Audit.** Performance and accessibility against the targets above, on a real phone and a mid-range laptop.
7. **Deploy** to Vercel or Cloudflare Pages on Daniel's domain.
8. **Backlog** items as time allows, starting with project detail pages.

## Handoff to Claude Code

The mockup is exported as **daniel-hu-site.zip**, which runs exactly like the mockup when served locally.

| File | What it is |
| --- | --- |
| `index.html` | The whole site: markup, styles and logic in one file |
| `support.js` | The small runtime the page needs (bundles React and the template engine) |
| `CLAUDE.md` | Guide Claude Code reads automatically: where each feature lives, what is placeholder, how to port |
| `DESIGN.md` | This design doc |

1. Unzip it, `cd` into the folder and run `claude`.
2. Preview with `npx serve .` and open http://localhost:3000 (opening the file directly does not fully work).
3. Ask Claude Code to set up git and start the port, or to swap in real content.

## Open questions

- [ ] Domain URL (Daniel will send it).
- [ ] Photos: a few of Daniel (About) and concert photos with artist, venue and date for each.
- [ ] Spotify playlist link and the real song names for the mini player.
- [ ] Disco: one-liner, role, stack and demo link.
- [ ] Role, stack and screenshot for CLARA and Sierra; links for each VIEW button.
- [ ] Experience dates and the skills list from the resume; the resume PDF itself.
- [ ] One-sentence blurbs for guitar, drawing, skiing and volleyball.
- [ ] Boot screen shows on every visit and waits for a press; keep it, or auto-continue for returning visitors?
- [ ] Guestbook moderation: who can remove stickers, and is there a word filter on notes?
- [x] OSU robotics research stays in Experience, not Projects.
- [x] Links: LinkedIn, GitHub, email shown as plain text.
- [x] No animation wording in the copy.
- [x] Avatar: round head, no glasses, silver headphones, slim build.
- [x] All 3D and art is code-drawn; no downloaded models or sketches.
