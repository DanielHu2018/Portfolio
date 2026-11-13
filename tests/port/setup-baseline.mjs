// Builds the frozen reference site (commit BASELINE) into .port-baseline/ for the equivalence tests,
// and caches the Latin subsets of the site's web fonts so font loading never varies between runs.
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';

const BASELINE = 'bad52f4';
const dir = '.port-baseline';
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&family=Permanent+Marker&display=swap';
const CHROME_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const sh = (cmd, cwd) => execSync(cmd, { stdio: 'inherit', cwd });

if (process.argv.includes('--force') && existsSync(dir)) {
  sh(`git worktree remove --force ${dir}`);
  rmSync(dir, { recursive: true, force: true });
}
if (!existsSync(`${dir}/dist/index.html`)) {
  sh(`git worktree add --detach ${dir} ${BASELINE}`);
  sh('npm ci --no-audit --no-fund', dir);
  sh('npm run build', dir);
}

mkdirSync(`${dir}/fonts`, { recursive: true });
const css = await (await fetch(FONT_CSS, { headers: { 'User-Agent': CHROME_UA } })).text();
const faces = [...css.matchAll(/\/\* ([^*]+) \*\/\s*(@font-face \{[^}]+\})/g)].filter((m) => m[1] === 'latin' || m[1] === 'latin-ext').map((m) => m[2]);
if (faces.length < 5) throw new Error(`expected font faces, found ${faces.length}`);
for (const url of new Set(faces.flatMap((f) => [...f.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1])))) {
  writeFileSync(`${dir}/fonts/${basename(url)}`, Buffer.from(await (await fetch(url)).arrayBuffer()));
}
writeFileSync(`${dir}/fonts/fonts.css`, faces.join('\n'));
