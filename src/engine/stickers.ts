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
  else {
    fill = '<circle cx="22" cy="24" r="15"/><circle cx="78" cy="24" r="15"/><ellipse cx="50" cy="56" rx="42" ry="37"/>';
    detail = '<circle cx="22" cy="24" r="7" fill="#FFD3A6"/><circle cx="78" cy="24" r="7" fill="#FFD3A6"/>'
      + '<ellipse cx="50" cy="73" rx="22" ry="15" fill="#FFF4E4"/>'
      + '<g fill="none" stroke="#3C2A1E" stroke-linecap="round" stroke-width="5"><path d="M50 22 V34"/><path d="M37 25 L41 36"/><path d="M63 25 L59 36"/>'
      + '<path d="M10 52 L23 56"/><path d="M11 65 L23 64"/><path d="M90 52 L77 56"/><path d="M89 65 L77 64"/></g>'
      + '<circle cx="36" cy="52" r="5" fill="#3C2A1E"/><circle cx="64" cy="52" r="5" fill="#3C2A1E"/><circle cx="37.6" cy="50.4" r="1.6" fill="#FFFFFF"/><circle cx="65.6" cy="50.4" r="1.6" fill="#FFFFFF"/>'
      + '<path d="M44 64 H56 L50 71 Z" fill="#FF6FB5" stroke="#FF6FB5" stroke-width="2" stroke-linejoin="round"/>'
      + '<path d="M50 71 Q46 78 40 75 M50 71 Q54 78 60 75" fill="none" stroke="#3C2A1E" stroke-width="2.6" stroke-linecap="round"/>';
  }
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
