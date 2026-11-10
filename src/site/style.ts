/** Parses an inline CSS string into a React style object, keeping source order. */
export function parseStyle(css: string): Record<string, string> {
  const style: Record<string, string> = {};
  for (const entry of css.split(';')) {
    const colon = entry.indexOf(':');
    if (colon < 0) continue;
    const name = entry.slice(0, colon).trim();
    style[name.startsWith('--') ? name : name.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = entry.slice(colon + 1).trim();
  }
  return style;
}
