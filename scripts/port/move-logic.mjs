// One-off: moves `class Component` out of mockup/index.html without retyping it.
// usage: node scripts/port/move-logic.mjs controller | engines
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const ENGINES = {
  staffs: ['initStaffs', 'drawAll', 'drawStaff'],
  hobbies: ['buildHobbies', 'initHobbies', 'drawHobbies'],
  mii: ['initMii'],
  cursor: ['initCursor'],
};
const ENGINE_NAMES = Object.values(ENGINES).flat();

const page = readFileSync('mockup/index.html', 'utf8').replace(/\r\n/g, '\n');
const cls = page.slice(page.indexOf('class Component'), page.lastIndexOf('</script>'));

/** Each legacy member as raw lines, with any comment lines directly above it. */
function members() {
  const lines = cls.split('\n');
  const out = [];
  let comments = [];
  for (let i = 1; i < lines.length; i++) {
    const m = /^  (async )?([A-Za-z_]+)\((.*)\) \{$/.exec(lines[i]);
    if (/^  \/\//.test(lines[i])) { comments.push(lines[i]); continue; }
    if (!m) { comments = []; continue; }
    let end = i + 1;
    while (lines[end] !== '  }') end++;
    out.push({ name: m[2], async: !!m[1], params: m[3], body: lines.slice(i + 1, end), comments });
    comments = [];
    i = end;
  }
  return out;
}

const dedent = (line) => line.replace(/^ {2}/, '');
const toFunctionForm = (line) => line
  .replace(new RegExp(`this\\.(${ENGINE_NAMES.join('|')})\\(\\)`, 'g'), '$1(site)')
  .replace(new RegExp(`this\\.(${ENGINE_NAMES.join('|')})\\(`, 'g'), '$1(site, ')
  .replace(/\bthis\./g, 'site.');
const AMBIENT = 'declare const document: any;\ndeclare const window: any;\n';

function asMethod(m, name = m.name, extra = []) {
  return [...m.comments, `  ${m.async ? 'async ' : ''}${name}(${m.params}) {`, ...m.body, ...extra, '  }'].join('\n');
}

function asFunction(m, retType = '') {
  const params = ['site: SiteController', m.params].filter(Boolean).join(', ');
  const body = m.body.map((l) => dedent(toFunctionForm(l)));
  return [...m.comments.map(dedent), `export function ${m.name}(${params})${retType} {`, ...body, '}'].join('\n');
}

const all = members();
const target = process.argv[2];

if (target === 'controller') {
  mkdirSync('src/site', { recursive: true });
  const rename = { componentDidMount: 'mount', componentDidUpdate: 'didUpdate' };
  const body = all
    .filter((m) => !ENGINE_NAMES.includes(m.name) && m.name !== 'renderVals')
    .map((m) => {
      if (m.name === 'componentWillUnmount') {
        return asMethod(m, 'unmount', [
          "    // Strict Mode remounts on the same DOM; observeNew skips anything already marked.",
          "    document.querySelectorAll('.rv-item[data-rv]').forEach((el: any) => el.removeAttribute('data-rv'));",
        ]);
      }
      return asMethod(m, rename[m.name] ?? m.name);
    })
    .join('\n');
  const forwarders = ['initStaffs', 'initMii', 'initCursor'].map((n) => `  ${n}() {}`).join('\n');
  writeFileSync('src/site/controller.ts', `${AMBIENT}
export type SiteState = {
  sel?: number;
  jumping?: boolean;
  seen?: Record<string, boolean>;
  armed?: boolean;
  rm?: boolean;
  boot?: string;
  focus?: any;
  fPhase?: string | null;
  gb?: any[];
  gbSk?: number;
  gbStatus?: string;
  gbErr?: boolean;
  np?: any;
  receipts?: any;
  receiptView?: number;
  receiptSel?: number;
  skillSel?: number;
  flow?: number;
  navOpen?: boolean;
  sfxMuted?: boolean;
  pos?: { x: number; y: number } | null;
  reduced?: boolean;
};

export class SiteController {
  state: SiteState = {};
  props = { accent: '#34BEED' };
  pageZoom?: number;
  miiReact?: (type: string, at?: { x: number; y: number } | null) => void;
  // Instance fields the moved methods assign to, under their original names.
  [field: string]: any;

  private listeners = new Set<() => void>();

  // Like the old runtime: state is readable immediately, the render follows.
  setState(partial: Partial<SiteState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => listener());
  }
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }
${forwarders}
${body}
}
`);
  const vals = all.find((m) => m.name === 'renderVals');
  writeFileSync('src/site/renderVals.ts', `import type { SiteController } from './controller';

declare const window: any;

${asFunction(vals)}

export type SiteVals = ReturnType<typeof renderVals>;
`);
} else if (target === 'engines') {
  mkdirSync('src/engine', { recursive: true });
  for (const [file, names] of Object.entries(ENGINES)) {
    const others = Object.entries(ENGINES).flatMap(([f, ns]) => (f === file ? [] : ns.map((n) => [f, n])));
    const fns = names.map((n) => asFunction(all.find((m) => m.name === n))).join('\n\n');
    const imports = [...new Set(others.filter(([, n]) => new RegExp(`\\b${n}\\(site`).test(fns)).map(([f]) => f))]
      .map((f) => `import { ${others.filter(([g, n]) => g === f && new RegExp(`\\b${n}\\(site`).test(fns)).map(([, n]) => n).join(', ')} } from './${f}';`);
    writeFileSync(`src/engine/${file}.ts`, `import type { SiteController } from '../site/controller';\n${imports.join('\n')}${imports.length ? '\n' : ''}\n${AMBIENT}\n${fns}\n`);
  }
} else {
  throw new Error('usage: move-logic.mjs controller | engines');
}
