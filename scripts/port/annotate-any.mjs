// One-off: adds `: any` to every parameter tsc reports as implicitly any, until none remain.
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

for (let pass = 0; pass < 12; pass++) {
  const { stdout } = spawnSync('npx', ['tsc', '-b', '--pretty', 'false'], { encoding: 'utf8', shell: true });
  const hits = [...stdout.matchAll(/^(.+?)\((\d+),(\d+)\): error TS7006: Parameter '(\w+)'/gm)];
  if (!hits.length) {
    console.log(stdout.split('\n').filter(Boolean).slice(0, 60).join('\n'));
    console.log(`remaining errors: ${(stdout.match(/error TS/g) || []).length}`);
    break;
  }
  const byFile = Map.groupBy(hits, (h) => h[1]);
  for (const [file, list] of byFile) {
    const lines = readFileSync(file, 'utf8').split('\n');
    const ordered = list.map((h) => [Number(h[2]) - 1, Number(h[3]) - 1, h[4]]).sort((a, b) => b[0] - a[0] || b[1] - a[1]);
    for (const [line, col, name] of ordered) {
      const at = col + name.length;
      if (lines[line].slice(col, at) !== name) throw new Error(`${file}:${line + 1} expected ${name}`);
      lines[line] = `${lines[line].slice(0, at)}: any${lines[line].slice(at)}`;
    }
    writeFileSync(file, lines.join('\n'));
  }
  console.log(`pass ${pass}: annotated ${hits.length}`);
}
