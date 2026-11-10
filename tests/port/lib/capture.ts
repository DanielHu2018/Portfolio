import type { Page } from '@playwright/test';
import { PNG } from 'pngjs';

export type DomNode = { tag: string; attrs: Record<string, string>; props?: Record<string, unknown>; canvas?: string; kids: (DomNode | string)[] };
export type Capture = { dom: DomNode; styles: string[]; audio: string[]; png: Buffer };

/** Serializes the page in the browser; drops only the artifacts of the old template runtime. */
function snapshot() {
  const running: Animation[] = [];
  for (const a of document.getAnimations()) {
    const timing = a.effect?.getComputedTiming();
    if (timing && timing.endTime !== Infinity) a.finish();
    else { a.pause(); a.currentTime = 0; running.push(a); }
  }
  (window as unknown as { __paused: Animation[] }).__paused = running;

  const isRuntimeSpan = (n: Node) => n instanceof HTMLElement && n.classList.contains('sc-interp');
  const serialize = (el: Element): unknown => {
    const attrs: Record<string, string> = {};
    for (const a of Array.from(el.attributes)) {
      if (a.name === 'data-dc-tpl') continue;
      attrs[a.name] = a.name === 'class' ? a.value.split(/\s+/).filter(Boolean).sort().join(' ') : a.value;
    }
    if (attrs.class === '') delete attrs.class;
    if (attrs.style === '') delete attrs.style;
    // React updates only the declarations that changed, so a declaration's position can differ. Computed styles are compared below.
    if (attrs.style) attrs.style = attrs.style.split(';').map((d) => d.trim()).filter(Boolean).sort().join('; ');
    const kids: unknown[] = [];
    const pushText = (s: string) => {
      if (typeof kids[kids.length - 1] === 'string') kids[kids.length - 1] += s;
      else kids.push(s);
    };
    const walk = (parent: Node) => {
      for (const n of Array.from(parent.childNodes)) {
        if (n.nodeType === Node.TEXT_NODE) pushText(n.nodeValue ?? '');
        else if (isRuntimeSpan(n)) walk(n);
        else if (n.nodeType === Node.ELEMENT_NODE) kids.push(serialize(n as Element));
      }
    };
    walk(el);
    const cleaned = kids.map((k) => (typeof k === 'string' ? k.replace(/\s+/g, ' ') : k)).filter((k) => k !== ' ' && k !== '');
    const node: Record<string, unknown> = { tag: el.tagName.toLowerCase(), attrs, kids: cleaned };
    if (el instanceof HTMLVideoElement) node.props = { muted: el.muted, loop: el.loop, controls: el.controls };
    if (el instanceof HTMLInputElement) node.props = { value: el.value };
    if (el instanceof HTMLCanvasElement) node.canvas = el.toDataURL();
    return node;
  };

  const root = document.querySelector('.rv-root');
  if (!root) throw new Error('.rv-root not found');
  const dump = (el: Element, pseudo?: string) => {
    const cs = getComputedStyle(el, pseudo);
    if (pseudo && (cs.content === 'none' || cs.content === 'normal')) return 'none';
    let out = '';
    // Chrome reports auto margins from its layout cache, so the same layout can read as 0px or its real size.
    // The element's rect, compared below, is the result those margins produce.
    for (let i = 0; i < cs.length; i++) if (!cs[i].startsWith('margin-')) out += `${cs[i]}=${cs.getPropertyValue(cs[i])};`;
    return out;
  };
  const styles: string[] = [];
  const add = (el: Element, label: string) => {
    const r = el.getBoundingClientRect();
    styles.push(`${label} rect=${r.x.toFixed(3)},${r.y.toFixed(3)},${r.width.toFixed(3)},${r.height.toFixed(3)} ${dump(el)}`);
    styles.push(`${label}::before ${dump(el, '::before')}`);
    styles.push(`${label}::after ${dump(el, '::after')}`);
  };
  const html = document.documentElement;
  styles.push(`html-attrs data-wii=${html.getAttribute('data-wii')} style=${html.getAttribute('style')} scroll=${window.scrollX},${window.scrollY}`);
  add(html, 'html');
  add(document.body, 'body');
  add(root, 'root');
  let n = 0;
  root.querySelectorAll('*').forEach((el) => { if (!isRuntimeSpan(el)) add(el, `${n++}:${el.tagName.toLowerCase()}`); });

  // Hover ticks follow Chrome's synthetic pointer events after scrolling, which vary between runs.
  const audio = (window as unknown as { __audio: string[] }).__audio.join(',').replace(/sine:1900,ramp:2300,?/g, '').split(',').filter(Boolean);
  return { dom: serialize(root), styles, audio };
}

export async function capture(page: Page, fullPage = false): Promise<Capture> {
  const data = (await page.evaluate(snapshot)) as Omit<Capture, 'png'>;
  const shoot = () => page.screenshot({ animations: 'disabled', fullPage, mask: [page.locator('video'), page.locator('iframe')], maskColor: '#FF00FF' });
  // The Cover Flow photos are large images under 3D rotation, which Chrome never rasters the same way twice.
  // Their markup, geometry and styles are compared above; only their pixels are left out.
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.id = '__port-hide';
    style.textContent = '.photo3d, [style*="scaleY(-1)"] { visibility: hidden !important; } .photo3d * { visibility: hidden !important; }';
    document.head.appendChild(style);
  });
  // Chrome decodes and rasters large images off the main thread; wait until two frames agree.
  let png = await shoot();
  for (let i = 0; i < 6; i++) {
    const next = await shoot();
    const stable = next.equals(png);
    png = next;
    if (stable) break;
  }
  await page.evaluate(() => document.getElementById('__port-hide')?.remove());
  await page.evaluate(() => (window as unknown as { __paused: Animation[] }).__paused.forEach((a) => a.play()));
  return { ...data, png };
}

function firstDomDiff(a: DomNode | string, b: DomNode | string, path: string): string | null {
  if (typeof a === 'string' || typeof b === 'string') return a === b ? null : `${path}: text ${JSON.stringify(a).slice(0, 160)} vs ${JSON.stringify(b).slice(0, 160)}`;
  const here = `${path}>${a.tag}`;
  if (a.tag !== b.tag) return `${path}: tag ${a.tag} vs ${b.tag}`;
  const names = new Set([...Object.keys(a.attrs), ...Object.keys(b.attrs)]);
  for (const name of names) if (a.attrs[name] !== b.attrs[name]) return `${here}: @${name} ${String(a.attrs[name]).slice(0, 2000)} vs ${String(b.attrs[name]).slice(0, 2000)}`;
  if (JSON.stringify(a.props) !== JSON.stringify(b.props)) return `${here}: props ${JSON.stringify(a.props)} vs ${JSON.stringify(b.props)}`;
  if (a.canvas !== b.canvas) return `${here}#${a.attrs.id}: canvas bitmap differs`;
  if (a.kids.length !== b.kids.length) return `${here}: ${a.kids.length} vs ${b.kids.length} children`;
  for (let i = 0; i < a.kids.length; i++) {
    const diff = firstDomDiff(a.kids[i], b.kids[i], `${here}[${i}]`);
    if (diff) return diff;
  }
  return null;
}

function firstStyleDiff(a: string[], b: string[]): string | null {
  if (a.length !== b.length) return `style entry count ${a.length} vs ${b.length}`;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) continue;
    const pa = a[i].split(';');
    const pb = b[i].split(';');
    for (let j = 0; j < Math.max(pa.length, pb.length); j++) if (pa[j] !== pb[j]) return `${a[i].split(' ')[0]}: ${pa[j]} vs ${pb[j]}`;
  }
  return null;
}

export function compareStructure(a: Capture, b: Capture): string | null {
  const dom = firstDomDiff(a.dom, b.dom, '');
  if (dom) return `DOM ${dom}`;
  const styles = firstStyleDiff(a.styles, b.styles);
  if (styles) return `computed style ${styles}`;
  if (a.audio.join() !== b.audio.join()) return `audio ${a.audio.join()} vs ${b.audio.join()}`;
  return null;
}

/** Pixels that differ between repeated renders of the very same page: Chrome's own noise. */
export function noiseMask(samples: Pick<Capture, 'png'>[]): Uint8Array {
  const first = PNG.sync.read(samples[0].png);
  const mask = new Uint8Array(first.width * first.height);
  for (const sample of samples.slice(1)) {
    const other = PNG.sync.read(sample.png);
    if (other.width !== first.width || other.height !== first.height) continue;
    for (let i = 0; i < mask.length; i++) {
      const p = i * 4;
      if (first.data[p] !== other.data[p] || first.data[p + 1] !== other.data[p + 1] || first.data[p + 2] !== other.data[p + 2]) mask[i] = 1;
    }
  }
  return mask;
}

export function pixelDiff(a: Pick<Capture, 'png'>, b: Pick<Capture, 'png'>, mask?: Uint8Array): { count: number; message: string; image?: Buffer } {
  const pa = PNG.sync.read(a.png);
  const pb = PNG.sync.read(b.png);
  if (pa.width !== pb.width || pa.height !== pb.height) return { count: 1, message: `screenshot size ${pa.width}x${pa.height} vs ${pb.width}x${pb.height}` };
  const diff = new PNG({ width: pa.width, height: pa.height });
  let count = 0;
  for (let i = 0; i < pa.width * pa.height; i++) {
    const p = i * 4;
    const same = pa.data[p] === pb.data[p] && pa.data[p + 1] === pb.data[p + 1] && pa.data[p + 2] === pb.data[p + 2];
    const ignored = !!mask && mask[i] === 1;
    const bad = !same && !ignored;
    if (bad) count++;
    diff.data[p] = bad ? 255 : pa.data[p] >> 2;
    diff.data[p + 1] = bad ? 0 : pa.data[p + 1] >> 2;
    diff.data[p + 2] = bad ? 0 : pa.data[p + 2] >> 2;
    diff.data[p + 3] = 255;
  }
  return { count, message: `${count} pixels differ`, image: count ? PNG.sync.write(diff) : undefined };
}
