# Full React Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `mockup/index.html` template and the bundled `mockup/support.js` runtime with real React components, with no visible or behavioral difference from the current production build.

**Architecture:** One plain TypeScript `SiteController` holds the state and the logic moved verbatim from `class Component`. Engines (staffs, hobbies, avatar, cursor) become modules that take the controller. JSX is generated mechanically from the template, one component per top-level region, so no markup is retyped. A Playwright harness compares the port against a frozen build of today's site and must report zero differences.

**Tech Stack:** Vite 8, React 19, TypeScript (all already installed). New dev-only dependencies: `@playwright/test`, `pixelmatch`, `pngjs`, `parse5`.

**Spec:** The user's requirement: "The app should look EXACTLY the same, no approximations, EXACTLY identical to the current site, just using react instead of raw html." The reference is the production build of commit `db669ea`. `CLAUDE.md` ("Porting to a production stack") and `DESIGN.md` describe the site.

## Global Constraints

- The baseline is the **`npm run build` output of `db669ea`**, not `npm run mockup`. The raw mockup does not load `src/styles/global.css`, so it renders differently from what Vercel serves (three rules differ).
- Pass means **zero** differences: `pixelmatch` with `threshold: 0` and 0 differing pixels, and exact equality of DOM and computed styles. No tolerance may be added to make a test pass.
- Stylesheet: `src/styles/global.css` first, then the `<helmet>` CSS (`mockup/index.html:18-120`) appended verbatim, in that order. Do not dedupe or tidy. Production loads them in that order and the later `.pill` and `.mini > div` rules win ties.
- Inline styles stay inline and stay in source order. `initCursor` matches `[style*="cursor: pointer"]`, `[style*="cursor: grab"]` and `[style*="zoom-in"]`, and shorthand/longhand order matters. Do not move inline styles to classes.
- All style values are strings (`zIndex: '2'`, `opacity: '0.95'`), so React never appends `px`.
- Moved logic is verbatim. Allowed edits: `this.` to `site.`, method to function wrapper, and erasable type syntax only (annotations, `as`, `!`). Fix type errors with those, never by changing logic.
- Keep element ids and classes the engines look up: `stf-*`, `hb-*`, `mii`, `boot-mii`, `hb-focus`, `gb-name`, `.boot`, `.mii-wrap`, `.mii-sprite`, `.rip`, `.wii-cursor`, `.wii-cursor-in`, `.rv-root`, `.rv-item`, `.focus-root`, `.proj`, `.photo3d`.
- No `React.memo`, `useMemo` or `useCallback` on rendered output, and no state in child components. Every `setState` re-renders the whole tree, because `renderVals` reads `window.innerWidth`, `Date` and `pageZoom` at render time.
- List keys are array indexes, as in the runtime. Components are declared at module scope. Either rule, if broken, remounts nodes and loses CSS transitions and imperative styles.
- Runtime artifacts that are intentionally removed, and normalized by the comparator: `data-dc-tpl`, the `<span class="sc-interp">` wrappers (113 today, no CSS targets them), the `#dc-root` and `.sc-host` wrappers, whitespace-only text nodes (688 today, none renders), the duplicate head links, and the runtime's `.sc-*` and `x-dc` styles.
- `/api/*` and `public/assets/receipts/` are not touched.

## Review Focus

1. Window resized across 700 or 1100px with the page already loaded: values read at render time (Cover Flow spacing) stay stale until the next state change, exactly as today. Owner: Task 4.
2. `/api/stickers`, `/api/now-playing` or `receipts.json` return 500 or fail: seed stickers stay, the badge is absent, and the Spotify iPod shows its "Loading…" text. Owner: Task 4.
3. A re-render lands mid-interaction (now-playing poll during a card tilt or navigator drag): imperative inline styles must survive. Owner: Task 4.
4. Touch device or coarse pointer: no custom cursor, no `data-wii`, taps walk the avatar, and tilt is ignored. Owner: Task 4.
5. Esc or X pressed during the focus overlay's opening or closing phase, and a second open during `closing`: same phases and final state as today. Owner: Task 4.

---

## File Structure

| Path | Responsibility |
| --- | --- |
| `playwright.config.ts` | Serves baseline (4173) and target (4174) |
| `tests/port/setup-baseline.mjs` | Builds `db669ea` into `.port-baseline/` |
| `tests/port/fixtures/` | Stubbed API and receipts responses |
| `tests/port/lib/determinism.ts` | Fake clock, seeded random, route stubs, audio spy |
| `tests/port/lib/capture.ts` | DOM, computed style, screenshot capture and comparison |
| `tests/port/scenarios.ts` | The state matrix |
| `tests/port/equivalence.spec.ts` | Runs each scenario on both sites and compares |
| `tests/port/logic-parity.test.mjs` | Proves moved logic is verbatim (deleted in Task 5) |
| `scripts/port/generate-components.mjs` | One-off template to JSX generator (deleted in Task 5) |
| `src/site/controller.ts` | `SiteController`: store, lifecycle, sfx, guestbook, focus, nav, tilt, drag |
| `src/site/renderVals.ts` | `renderVals`, with the site's content inline as today |
| `src/site/style.ts` | `parseStyle`, the runtime's style-string parser |
| `src/engine/{staffs,hobbies,mii,cursor}.ts` | Canvas and pointer engines |
| `src/components/*.tsx` | Generated JSX, one region per file |
| `src/App.tsx`, `src/main.tsx` | Root subscribes to the controller; mounts the app |

Components, in `.rv-root` child order: `SvgDefs`, `FocusOverlay`, `BootScreen`, `Avatar`, `Ripples`, `WiiCursor`, `IpodNav`, `NowPlaying`, `Hero`, `About`, `Experience`, `Projects`, `Skills`, `OffTheClock`, `Contact`.

---

### Task 1: Equivalence harness, proven against itself

**Files:**
- Create: `playwright.config.ts`, `tests/port/setup-baseline.mjs`, `tests/port/fixtures/{stickers.json,now-playing.json,receipts.json}`, `tests/port/lib/determinism.ts`, `tests/port/lib/capture.ts`, `tests/port/scenarios.ts`, `tests/port/equivalence.spec.ts`
- Modify: `package.json` (dev dependencies; scripts `port:baseline`, `test:port`), `.gitignore` (`.port-baseline/`, `test-results/`, `playwright-report/`)

**Interfaces:**
- Produces: `npm run test:port`. `PORT_TARGET_URL` selects the target (default `http://localhost:4174`). `PORT_MUTATE=1` injects a deliberate 1px change on the target.
- Produces: `type Scenario = { name: string; viewport: { width: number; height: number }; context?: { hasTouch?: boolean; reducedMotion?: boolean }; api?: 'ok' | 'playing' | 'fail'; run: (page: Page, clock: Clock) => Promise<void> }`
- Produces: `capture(page): Promise<{ dom: DomNode; styles: string[]; audio: AudioEvent[]; requests: string[]; png: Buffer }>`

- [ ] **Step 1: Build the baseline.** `setup-baseline.mjs` runs `git worktree add --detach .port-baseline db669ea`, then `npm ci` and `npm run build` in it. Run: `npm run port:baseline`. Expected: `.port-baseline/dist/index.html` exists.

- [ ] **Step 2: Write `determinism.ts`,** applied to every page before navigation:
  - `page.clock.install({ time: new Date('2026-11-09T12:00:00') })`, advanced only through `clock.runFor`.
  - `addInitScript` replaces `Math.random` with mulberry32, seed `0x5EED`.
  - `page.route` stubs: `/api/stickers` (GET fixture; POST recorded with body, returns 200), `/api/now-playing` (`{playing:false}`, the playing fixture, or 500 per `scenario.api`), `/assets/receipts/receipts.json` (frozen fixture).
  - `/assets/avatar/*.gif` is fulfilled with the bytes of `avatar_idle.png`, so frames do not depend on wall-clock GIF playback. Which sprite was requested is still compared, through the `.mii-sprite` `src` attribute.
  - `addInitScript` wraps `AudioContext.prototype.createOscillator` to log type and frequency per tone.

- [ ] **Step 3: Write `capture.ts`.** Before capturing, wait for `document.fonts.ready` and all `img.complete`, then for each `document.getAnimations()`: `finish()` if finite, otherwise `pause()` with `currentTime = 0`.
  - `dom`: tree from `.rv-root` with sorted attributes, class tokens as a set, `style` attribute verbatim, and the normalizations named in Global Constraints.
  - `styles`: for every element and its `::before` and `::after`, all `getComputedStyle` entries, plus `html`, `body` and the bounding rect. Include `html` attributes (`data-wii`, `--z`).
  - `png`: `page.screenshot({ animations: 'disabled', mask: [video, iframe] })`. Video frames and the PDF viewer are not deterministic, so their attributes are covered by `dom` and their pixels are masked.
  - Compare with `pixelmatch(a, b, diff, w, h, { threshold: 0, includeAA: true })`. Write the diff PNG and the first differing DOM path on failure.

- [ ] **Step 4: Write `scenarios.ts`.** Scroll with `window.scrollTo({ top, behavior: 'instant' })`. Viewports `A` = 390×844, 824×1100, 1440×900, 2560×1440. Viewports `B` = 699×900, 700×900, 1099×800, 1100×800.

| Group | Scenarios | Viewports |
| --- | --- | --- |
| Boot | idle; loading at 800ms; leaving; Enter starts; Tab does not start | A |
| Sections | each of the 7 sections after reveal; full page after all reveals | A, then B for Home and Skills |
| Focus | photo, resume, concert (+ next/prev), proj 0/1/2 (+ step), spotify, skills, each of 4 hobbies; `from` phase; `open`; `closing`; closed; Esc, X, backdrop | A |
| Navigator | wheel prev/next/menu/center; row click; drag then dock with double-click; phone menu open/closed | A |
| Interaction | project tilt at 3 pointer positions, leave at 700ms; photo hover and strip leave; Cover Flow prev/next ×12; all 6 receipt views; rows hover; 4 skill rows, skill use row click (project and experience) | 1440×900, 390×844 |
| Guestbook | pick each sticker; place by click with note; Enter on board; 81st sticker trims to 80; 40-char note clip | 1440×900, 390×844 |
| Avatar | click-walk at 16 directions; waving on `h1` hover; cheer beside open project; dancing with `api: 'playing'` | 1440×900 |
| Audio | mute toggle persists after reload; hover, click, skip, open, close, boot, sign sequences | 1440×900 |
| Motion | `reducedMotion: true` for Sections and Focus | 1440×900 |

- [ ] **Step 5: Write `equivalence.spec.ts`.** One test per scenario: run it on baseline and target in separate contexts, then assert `dom`, `styles`, `audio`, `requests` equal and 0 differing pixels.

- [ ] **Step 6: Control run.** Run: `PORT_TARGET_URL=http://localhost:4173 npm run test:port`. Expected: all pass, twice in a row. If any scenario differs against itself, fix determinism. Do not add tolerance.

- [ ] **Step 7: Sensitivity run.** Run with `PORT_TARGET_URL=http://localhost:4173 PORT_MUTATE=1`. Expected: every scenario FAILS, with a named DOM path or style.

- [ ] **Step 8: Commit** with message `Add baseline equivalence harness for the React port`.

---

### Task 2: SiteController and renderVals

**Files:**
- Create: `src/site/controller.ts`, `src/site/renderVals.ts`, `src/site/style.ts`, `tests/port/logic-parity.test.mjs`

**Interfaces:**
- Produces:
```ts
class SiteController {
  state: SiteState;              // { sel?, jumping?, seen?, armed?, rm?, boot?, focus?, fPhase?, gb?, gbSk?, gbStatus?, gbErr?, np?, receipts?, receiptView?, receiptSel?, skillSel?, flow?, navOpen?, sfxMuted?, pos?, reduced? }
  props: { accent: string };     // '#34BEED'
  pageZoom?: number;
  miiReact?: (type: 'wave' | 'cheer', at?: { x: number; y: number } | null) => void;
  st(): SiteState;
  setState(partial: Partial<SiteState>): void;
  subscribe(listener: () => void): () => void;
  mount(): void;      // componentDidMount
  unmount(): void;    // componentWillUnmount
  didUpdate(): void;  // componentDidUpdate
}
function renderVals(site: SiteController): SiteVals;
function parseStyle(css: string): Record<string, string>;
```
- `SiteVals` is the inferred return type of `renderVals`.

- [ ] **Step 1: Write the failing test `logic-parity.test.mjs`** (`node --test`). For each legacy method of `class Component`, extract its body by brace matching, pass the port's function through `module.stripTypeScriptTypes`, collapse whitespace, rewrite `this.` to `site.` on the legacy side, and assert equal text. The map covers every method in `mockup/index.html:709-2204`. Only `componentDidMount`, `componentWillUnmount`, `componentDidUpdate` map to renamed methods, and only `componentWillUnmount` is excluded from comparison.

- [ ] **Step 2: Run it.** Run: `node --test tests/port/logic-parity.test.mjs`. Expected: FAIL, target files missing.

- [ ] **Step 3: Implement `setState` with the runtime's semantics:** `this.state = { ...this.state, ...partial }` applies **synchronously** (`st()` right after must see it), then notifies subscribers. Logic relies on that, for example `this.st().focus` read inside animation frames and right after `setState`.

- [ ] **Step 4: Implement `parseStyle` as the runtime's `st()`:** split on `;`, split each on the first `:`, trim, keep `--*` names, camelCase others with `/-([a-z])/g` (so `-webkit-x` becomes `WebkitX`), skip entries with no colon.

- [ ] **Step 5: Move the methods verbatim.** Non-engine methods go on `SiteController` and `renderVals` goes to its own file. Engine methods are stubbed for Task 3. `mount` calls `componentDidMount`'s body. `unmount` runs `componentWillUnmount`'s body **and** removes `data-rv` from every `.rv-item`, or Strict Mode's remount leaves `observeNew` skipping all items and nothing reveals in dev.

- [ ] **Step 6: Run the test and `npm run typecheck`.** Expected: non-engine parity passes; engine entries are `todo`; typecheck passes.

- [ ] **Step 7: Commit** with message `Move site logic into SiteController`.

---

### Task 3: Engine modules

**Files:**
- Create: `src/engine/staffs.ts` (`initStaffs`, `drawAll`, `drawStaff`), `src/engine/hobbies.ts` (`buildHobbies`, `initHobbies`, `drawHobbies`), `src/engine/mii.ts` (`initMii`), `src/engine/cursor.ts` (`initCursor`)
- Modify: `src/site/controller.ts`, `tests/port/logic-parity.test.mjs`

**Interfaces:**
- Consumes: `SiteController` from Task 2.
- Produces: each function is `name(site: SiteController, ...legacyParams)`. Engine-owned fields stay on the controller under their legacy names: `stf`, `hob`, `hobFocus`, `raf`, `onResize`, `miiOff`, `curOff`.

- [ ] **Step 1: Turn the engine `todo` entries into real assertions.** Run the test. Expected: FAIL for those 8 functions.
- [ ] **Step 2: Move the 8 methods verbatim** and wire the controller to call them.
- [ ] **Step 3: Run `node --test tests/port/logic-parity.test.mjs` and `npm run typecheck`.** Expected: PASS with no `todo`.
- [ ] **Step 4: Commit** with message `Move canvas and pointer engines into modules`.

---

### Task 4: Generated components, wired up, and full equivalence

**Files:**
- Create: `scripts/port/generate-components.mjs`, `src/components/*.tsx` (15 files, list above)
- Modify: `src/App.tsx`, `src/styles/global.css` (append helmet CSS), `tests/port/scenarios.ts`

**Interfaces:**
- Consumes: `SiteController`, `renderVals`, `parseStyle`, `SiteVals`.
- Produces: each component is `export function Name({ v }: { v: SiteVals })`.

- [ ] **Step 1: Add the Review Focus scenarios to `scenarios.ts`:**
  - `resize-stale-flow`: load at 1440, resize to 690 with no state change, capture; then click Cover Flow next, capture.
  - `api-fail`: all three endpoints fail, capture Home, Off the clock and Contact at 1440.
  - `rerender-mid-tilt`: tilt a project, deliver a now-playing change through `clock.runFor(20000)`, capture. `rerender-mid-drag`: same during a navigator drag.
  - `touch`: `hasTouch: true` at 390×844: tap walks the avatar, tap a project card, assert no `data-wii`.
  - `focus-races`: Esc during `from`; X during `closing`; open another item during `closing`.

- [ ] **Step 2: Write the generator** with `parse5`, reading `<x-dc>` from `mockup/index.html`. Output rules:

| Template | JSX |
| --- | --- |
| `{{a.b}}` as whole text | `{v.a.b}`, or `{a.b}` for a loop variable |
| Text with holes | Same line, literal text preserved (`{fc.city} · {fc.date}`) |
| Attribute with holes | Template literal; missing value becomes `''` |
| `style="static"` | Object literal, string values, source order |
| `style="{{x}}"` | `style={parseStyle(v.x)}` |
| `style="… {{x}}"` (2 cases: `accent`, `gbMsgColor`) | Object literal with a template-literal value |
| `<sc-if value="{{x}}">` | `{x ? (<>…</>) : null}` |
| `<sc-for list="{{l}}" as="y">` | `{l.map((y, i) => <Fragment key={i}>…</Fragment>)}` |
| Whitespace-only text; comments; `<helmet>`; `hint-*` | Dropped |
| `class` / `onClick` etc. / boolean `muted loop controls` | `className` / same name / `true` |
| `playsinline`, `maxlength`, `autocomplete`, `tabIndex`, SVG `stroke-width` etc. | React camelCase equivalents |
| Text with a literal `{`, `}`, `<`, `>` or `&amp;` | JSX-safe expression |

The generator fails on any hole, tag or attribute it has no rule for.

- [ ] **Step 3: Generate and format the 15 files.** Run the generator. Expected: `npm run typecheck` passes.

- [ ] **Step 4: Rewrite `App.tsx`.** One controller instance is held in `useRef`.
  - Subscribe with `const [, bump] = useState(0)` and `site.subscribe(() => bump(n => n + 1))`. Use this rather than `useSyncExternalStore`, so updates have the same scheduling as the runtime's class `setState`.
  - Subscribe, then `site.mount()`, in `useLayoutEffect(..., [])`, matching `componentDidMount`'s timing before first paint. Return `unmount` and unsubscribe.
  - `site.didUpdate()` in a `useLayoutEffect` with no dependency array, skipping the first commit.
  - Render `<div aria-label="Daniel Hu portfolio"><div className={...} style={...}>` with the `.rv-root` attributes, then the 15 components in order. Call `renderVals(site)` once per render.
  - Remove the `?raw` imports.

- [ ] **Step 5: Append the helmet CSS to `global.css`** per Global Constraints. Leave root `index.html` as is.

- [ ] **Step 6: Run the full gate.** Run: `npm run build && npm run test:port`. Expected: every scenario passes with 0 differences. For each failure, read the diff, fix the generator or wiring (regenerate, do not hand-edit), and rerun. Build minification rewriting CSS is a known suspect: if a computed style differs, adjust the Vite CSS minifier setting.

- [ ] **Step 7: Check Strict Mode in dev.** Run the Sections scenarios against `npm run dev`. Expected: items reveal, one canvas loop runs, one cursor listener set, no console errors.

- [ ] **Step 8: Commit** with message `Render the site with React components`.

---

### Task 5: Remove the old runtime and finish

**Files:**
- Delete: `mockup/`, `scripts/port/`, `tests/port/logic-parity.test.mjs`
- Modify: `package.json` (remove `mockup` script, `serve`, `parse5`), `CLAUDE.md`, `tests/port/scenarios.ts` if it references removed paths

- [ ] **Step 1: Check the baseline is still current.** Run: `git diff db669ea origin/react-port -- mockup src index.html`. Expected: empty. If not, those edits landed after the baseline: port them, then rebuild the baseline at the new commit and rerun the gate.
- [ ] **Step 2: Delete the files** and update `CLAUDE.md`: site lives in `src/`, the feature table points to the new modules, `npm run mockup` is gone, and `npm run test:port` is documented.
- [ ] **Step 3: Run the final gate.** Run: `npm run build && npm run test:port`. Expected: 0 differences. Then `grep -r "support.js\|sc-if\|DCLogic" src index.html`. Expected: no matches.
- [ ] **Step 4: Compare against a real deployment.** Run the gate with `PORT_TARGET_URL` set to the Vercel preview URL for this branch, with the baseline unchanged. Expected: 0 differences.
- [ ] **Step 5: Commit** with message `Remove the mockup runtime`. Merging into `react-port` is the owner's decision and is not part of this plan.
