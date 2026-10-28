// Guestbook stickers: die-cut SVGs built in code, returned as CSS url() values.
import { STICKERS } from '../data/content';

const cache: Record<number, string> = {};

export function stickerUri(i: number): string {
  if (cache[i]) return cache[i];
  const col = (STICKERS[i] || STICKERS[0]).color;
  const f = (n: number) => Math.round(n * 10) / 10;
  const poly = (pts: number, ro: number, ri: number, cx: number, cy: number, rot: number) => {
    const a: string[] = [];
    for (let j = 0; j < pts * 2; j++) { const r = j % 2 ? ri : ro; const t = rot + j * Math.PI / pts; a.push(f(cx + Math.sin(t) * r) + ',' + f(cy - Math.cos(t) * r)); }
    return '<polygon points="' + a.join(' ') + '"/>';
  };
  let fill = ''; let lines = ''; let detail = '';
  if (i === 0) fill = '<ellipse cx="34" cy="72" rx="19" ry="14" transform="rotate(-22 34 72)"/><rect x="43" y="10" width="11" height="64" rx="4"/><path d="M48 10 C60 22 84 26 80 52 C74 40 64 36 52 36 Z"/>';
  else if (i === 1) fill = poly(5, 48, 21, 50, 54, 0);
  else if (i === 2) fill = '<path d="M50 88 C20 68 5 52 5 33 C5 18 16 8 30 8 C40 8 46 14 50 22 C54 14 60 8 70 8 C84 8 95 18 95 33 C95 52 80 68 50 88 Z"/>';
  else if (i === 3) {
    for (let j = 0; j < 5; j++) { const t = j * Math.PI * 2 / 5; fill += '<circle cx="' + f(50 + Math.sin(t) * 25) + '" cy="' + f(50 - Math.cos(t) * 25) + '" r="21"/>'; }
    detail = '<circle cx="50" cy="50" r="15" fill="#FFE27A"/>';
  } else if (i === 4) {
    for (let j = 0; j < 6; j++) {
      const t = j * Math.PI / 3; const ex = 50 + Math.sin(t) * 42; const ey = 50 - Math.cos(t) * 42;
      const bx = 50 + Math.sin(t) * 26; const by = 50 - Math.cos(t) * 26;
      lines += '<path d="M50 50 L' + f(ex) + ' ' + f(ey) + ' M' + f(bx + Math.sin(t - 0.8) * 14) + ' ' + f(by - Math.cos(t - 0.8) * 14) + ' L' + f(bx) + ' ' + f(by) + ' L' + f(bx + Math.sin(t + 0.8) * 14) + ' ' + f(by - Math.cos(t + 0.8) * 14) + '"/>';
    }
  } else if (i === 5) { fill = poly(12, 48, 35, 50, 50, 0); detail = '<circle cx="50" cy="50" r="25" fill="#FFC46B"/><circle cx="42" cy="46" r="3.5" fill="#7A3E10"/><circle cx="58" cy="46" r="3.5" fill="#7A3E10"/><path d="M41 56 Q50 64 59 56" fill="none" stroke="#7A3E10" stroke-width="3.5" stroke-linecap="round"/>'; }
  else if (i === 6) fill = '<ellipse cx="25" cy="76" rx="16" ry="12" transform="rotate(-22 25 76)"/><ellipse cx="71" cy="66" rx="16" ry="12" transform="rotate(-22 71 66)"/><rect x="33" y="22" width="9" height="54" rx="3"/><rect x="79" y="12" width="9" height="54" rx="3"/><polygon points="33,22 88,10 88,26 33,38"/>';
  else fill = '<path d="M50 4 C54 34 66 46 96 50 C66 54 54 66 50 96 C46 66 34 54 4 50 C34 46 46 34 50 4 Z"/><path d="M82 8 C83 16 85 18 93 19 C85 20 83 22 82 30 C81 22 79 20 71 19 C79 18 81 16 82 8 Z"/>';
  const lw = 11;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-14 -14 128 128">'
    + '<defs><clipPath id="c">' + fill + '</clipPath></defs>'
    + '<g fill="#C9CFD8" stroke="#C9CFD8" stroke-width="22" stroke-linejoin="round" stroke-linecap="round">' + fill + '</g>'
    + '<g fill="none" stroke="#C9CFD8" stroke-width="' + (lw + 22) + '" stroke-linecap="round" stroke-linejoin="round">' + lines + '</g>'
    + '<g fill="#FFFFFF" stroke="#FFFFFF" stroke-width="18" stroke-linejoin="round" stroke-linecap="round">' + fill + '</g>'
    + '<g fill="none" stroke="#FFFFFF" stroke-width="' + (lw + 18) + '" stroke-linecap="round" stroke-linejoin="round">' + lines + '</g>'
    + '<g fill="' + col + '">' + fill + '</g>'
    + '<g fill="none" stroke="' + col + '" stroke-width="' + lw + '" stroke-linecap="round" stroke-linejoin="round">' + lines + '</g>'
    + detail
    + '<g clip-path="url(#c)"><ellipse cx="30" cy="22" rx="46" ry="26" fill="#FFFFFF" opacity="0.32"/></g>'
    + '<g fill="none" stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="' + (lw - 6) + '" stroke-linecap="round" transform="translate(-1.5 -1.5)">' + lines.replace(/M50 50 L[^M]*/g, '') + '</g>'
    + '</svg>';
  cache[i] = 'url("data:image/svg+xml,' + encodeURIComponent(svg).replace(/'/g, '%27') + '")';
  return cache[i];
}
