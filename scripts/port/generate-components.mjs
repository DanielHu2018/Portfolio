// One-off: turns the <x-dc> template in mockup/index.html into src/components/*.tsx.
// Fails on anything it has no rule for, so nothing is silently dropped or guessed.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { parseFragment } from 'parse5';

const REGIONS = ['SvgDefs', 'FocusOverlay', 'BootScreen', 'Avatar', 'Ripples', 'WiiCursor', 'IpodNav', 'NowPlaying', 'Hero', 'About', 'Experience', 'Projects', 'Skills', 'OffTheClock', 'Contact'];
const EVENTS = { onclick: 'onClick', onkeydown: 'onKeyDown', onpointerdown: 'onPointerDown', onpointerenter: 'onPointerEnter', onpointerleave: 'onPointerLeave', onpointermove: 'onPointerMove', onpointerout: 'onPointerOut', ondoubleclick: 'onDoubleClick' };
const RENAMES = { class: 'className', tabindex: 'tabIndex', maxlength: 'maxLength', autocomplete: 'autoComplete' };
const BOOLEAN = { muted: 'muted', loop: 'loop', controls: 'controls', playsinline: 'playsInline' };
const PLAIN = new Set(['alt', 'd', 'download', 'draggable', 'fill', 'height', 'href', 'id', 'offset', 'placeholder', 'preload', 'preserveAspectRatio', 'rel', 'role', 'rx', 'sizes', 'src', 'stroke', 'target', 'title', 'transform', 'type', 'viewBox', 'width', 'x', 'x1', 'x2', 'y', 'y1', 'y2']);
const HYPHENATED = new Set(['stop-color', 'stroke-linecap', 'stroke-linejoin', 'stroke-width', 'vector-effect']);
const VOID = new Set(['img', 'input', 'br', 'link']);
const HOLE = /\{\{\s*([A-Za-z_$][\w$.]*)\s*\}\}/g;
const WHOLE_HOLE = /^\s*\{\{\s*([A-Za-z_$][\w$.]*)\s*\}\}\s*$/;

const page = readFileSync('mockup/index.html', 'utf8').replace(/\r\n/g, '\n');
const source = page.slice(page.indexOf('<x-dc>') + '<x-dc>'.length, page.indexOf('</x-dc>'));
const fragment = parseFragment(source);

const camel = (name) => name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const quote = (s) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const attrsOf = (node) => Object.fromEntries((node.attrs || []).map((a) => [a.name, a.value]));
const isBlank = (n) => n.nodeName === '#text' && !n.value.trim();
const content = (node) => node.childNodes.filter((n) => n.nodeName !== '#comment' && !isBlank(n));

function expr(path, scope) {
  return scope.has(path.split('.')[0]) ? path : `v.${path}`;
}

/** A string with holes as a JS expression; a lone hole keeps the value's own type. */
function valueExpr(value, scope) {
  const whole = WHOLE_HOLE.exec(value);
  if (whole) return expr(whole[1], scope);
  const body = value.replace(/`/g, '\\`').replace(HOLE, (_, p) => `\${${expr(p, scope)}}`);
  if (body.includes('{{')) throw new Error(`unparsed hole: ${value}`);
  return `\`${body}\``;
}

function styleValue(value, scope) {
  return value.includes('{{') ? valueExpr(value, scope) : quote(value);
}

function styleAttr(value, scope) {
  const whole = WHOLE_HOLE.exec(value);
  if (whole) return `style={parseStyle(${expr(whole[1], scope)})}`;
  const props = [];
  for (const entry of value.split(';')) {
    const colon = entry.indexOf(':');
    if (colon < 0) { if (entry.trim()) throw new Error(`bad style entry: ${entry}`); continue; }
    const raw = entry.slice(0, colon).trim();
    const name = raw.startsWith('--') ? quote(raw) : camel(raw);
    props.push(`${name}: ${styleValue(entry.slice(colon + 1).trim(), scope)}`);
  }
  if (props.some((x) => x.startsWith("'--"))) { used.cssProperties = true; return `style={{ ${props.join(', ')} } as CSSProperties}`; }
  return `style={{ ${props.join(', ')} }}`;
}

function jsxAttr(name, value, scope) {
  if (name === 'style') return styleAttr(value, scope);
  if (name.startsWith('hint-')) return null;
  let prop;
  if (EVENTS[name]) prop = EVENTS[name];
  else if (BOOLEAN[name] && value === '') return BOOLEAN[name];
  else if (RENAMES[name]) prop = RENAMES[name];
  else if (HYPHENATED.has(name)) prop = camel(name);
  else if (name.startsWith('aria-') || PLAIN.has(name)) prop = name;
  else throw new Error(`no rule for attribute: ${name}="${value}"`);
  if (prop === 'tabIndex' || prop === 'maxLength') return `${prop}={${Number(value)}}`;
  if (!value.includes('{{')) return `${prop}=${JSON.stringify(value)}`;
  return `${prop}={${valueExpr(value, scope)}}`;
}

const NEEDS_EXPR = /[{}<>&]/;

function textLines(raw, scope) {
  const text = raw.replace(/\s+/g, ' ');
  if (text === ' ' || text === '') return [];
  const lead = text.startsWith(' ');
  const trail = text.endsWith(' ') && text.length > 1;
  const inner = text.trim();
  const parts = [];
  let last = 0;
  for (const m of inner.matchAll(HOLE)) {
    if (m.index > last) parts.push(literal(inner.slice(last, m.index)));
    parts.push(`{${expr(m[1], scope)}}`);
    last = m.index + m[0].length;
  }
  if (last < inner.length) parts.push(literal(inner.slice(last)));
  if (inner.replace(HOLE, '').includes('{{')) throw new Error(`unparsed hole: ${inner}`);
  const line = parts.join('');
  return [`${lead ? "{' '}" : ''}${line}${trail ? "{' '}" : ''}`];
}

function literal(s) {
  // Spaces at the edge of a segment sit between holes on one line, which JSX keeps.
  return NEEDS_EXPR.test(s) ? `{${JSON.stringify(s)}}` : s;
}

let loopDepth = 0;
const used = { fragment: false, parseStyle: false, cssProperties: false };

function childLines(nodes, scope, pad) {
  return nodes.flatMap((n) => nodeLines(n, scope, pad));
}

function nodeLines(node, scope, pad) {
  if (node.nodeName === '#comment') return [];
  if (node.nodeName === '#text') return textLines(node.value, scope).map((l) => pad + l);
  const attrs = attrsOf(node);

  if (node.nodeName === 'sc-if') {
    const whole = WHOLE_HOLE.exec(attrs.value);
    if (!whole) throw new Error(`sc-if value: ${attrs.value}`);
    return [`${pad}{${expr(whole[1], scope)} ? (`, ...wrapped(content(node), scope, `${pad}  `), `${pad}) : null}`];
  }
  if (node.nodeName === 'sc-for') {
    const whole = WHOLE_HOLE.exec(attrs.list);
    if (!whole) throw new Error(`sc-for list: ${attrs.list}`);
    used.fragment = true;
    const item = attrs.as;
    const index = `i${loopDepth++}`;
    const inner = new Set(scope).add(item);
    const lines = [
      `${pad}{${expr(whole[1], scope)}.map((${item}: any, ${index}: number) => (`,
      `${pad}  <Fragment key={${index}}>`,
      ...childLines(content(node), inner, `${pad}    `),
      `${pad}  </Fragment>`,
      `${pad}))}`,
    ];
    loopDepth--;
    return lines;
  }
  if (node.nodeName.includes('-') || node.nodeName === 'helmet') throw new Error(`no rule for element: ${node.nodeName}`);

  const tag = node.tagName;
  const rendered = Object.entries(attrs).map(([n, v]) => jsxAttr(n, v, scope)).filter(Boolean);
  if (rendered.some((a) => a.startsWith('style={parseStyle('))) used.parseStyle = true;
  const open = `${pad}<${tag}${rendered.length ? ` ${rendered.join(' ')}` : ''}`;
  const kids = content(node);
  if (VOID.has(tag) || kids.length === 0) return [`${open} />`];
  return [`${open}>`, ...childLines(kids, scope, `${pad}  `), `${pad}</${tag}>`];
}

/** Several siblings under a conditional need one parent; a fragment adds no DOM. */
function wrapped(nodes, scope, pad) {
  if (nodes.length === 1 && nodes[0].nodeName !== '#text') return nodeLines(nodes[0], scope, pad);
  return [`${pad}<>`, ...childLines(nodes, scope, `${pad}  `), `${pad}</>`];
}

const root = content(fragment).find((n) => n.nodeName === 'div');
if (!attrsOf(root).class?.startsWith('rv-root')) throw new Error('expected .rv-root');
const regions = content(root);
if (regions.length !== REGIONS.length) throw new Error(`expected ${REGIONS.length} regions, found ${regions.length}`);

mkdirSync('src/components', { recursive: true });
regions.forEach((node, i) => {
  used.fragment = false;
  used.parseStyle = false;
  used.cssProperties = false;
  const body = nodeLines(node, new Set(), '    ');
  const usesV = body.some((l) => /\bv\./.test(l));
  // A region that is one conditional is an expression, not JSX, until it has a parent.
  const isExpression = node.nodeName === 'sc-if';
  const header = [
    used.fragment || used.cssProperties ? `import { ${[used.cssProperties && 'type CSSProperties', used.fragment && 'Fragment'].filter(Boolean).join(', ')} } from 'react';` : null,
    usesV ? "import type { SiteVals } from '../site/renderVals';" : null,
    used.parseStyle ? "import { parseStyle } from '../site/style';" : null,
  ].filter(Boolean);
  const signature = usesV ? '{ v }: { v: SiteVals }' : '';
  const out = [
    ...header,
    ...(header.length ? [''] : []),
    `export function ${REGIONS[i]}(${signature}) {`,
    '  return (',
    ...(isExpression ? ['    <>', ...body.map((l) => `  ${l}`), '    </>'] : body),
    '  );',
    '}',
    '',
  ];
  writeFileSync(`src/components/${REGIONS[i]}.tsx`, out.join('\n'));
});

const r = attrsOf(root);
console.log('root class:', r.class);
console.log(styleAttr(r.style, new Set()));
