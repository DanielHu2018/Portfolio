// Proves the logic moved out of mockup/index.html is unchanged: same text once types are erased.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { test } from 'node:test';

const ENGINES = {
  initStaffs: 'src/engine/staffs.ts',
  drawAll: 'src/engine/staffs.ts',
  drawStaff: 'src/engine/staffs.ts',
  buildHobbies: 'src/engine/hobbies.ts',
  initHobbies: 'src/engine/hobbies.ts',
  drawHobbies: 'src/engine/hobbies.ts',
  initMii: 'src/engine/mii.ts',
  initCursor: 'src/engine/cursor.ts',
};
const ENGINES_DONE = false;
const RENAMED = { componentDidMount: 'mount', componentDidUpdate: 'didUpdate', componentWillUnmount: 'unmount' };

function methods(text, indent) {
  const open = new RegExp(`^${indent}(?:export )?(?:async )?(?:function )?([A-Za-z_]+)\\s*\\(([^{]*)\\)\\s*\\{$`);
  const found = {};
  let name = null;
  let body = [];
  let params = '';
  for (const line of text.split(/\r?\n/)) {
    if (name === null) {
      const m = open.exec(line);
      if (m) { name = m[1]; params = m[2]; body = []; }
    } else if (line === `${indent}}`) {
      found[name] = { params, body: body.join('\n') };
      name = null;
    } else {
      body.push(line);
    }
  }
  return found;
}

const squash = (s) => s.replace(/\s+/g, '');
// A comment is the one way to keep a verbatim unused variable under noUnusedLocals.
const source = (path) => stripTypeScriptTypes(readFileSync(path, 'utf8')).split(/\r?\n/).filter((l) => !l.includes('@ts-expect-error')).join('\n');

const page = readFileSync('mockup/index.html', 'utf8');
const legacy = methods(page.slice(page.indexOf('class Component'), page.lastIndexOf('</script>')), '  ');

/** The legacy text as it should read once `this` has become the `site` parameter. */
function toFunctionForm(text) {
  const names = Object.keys(ENGINES).join('|');
  return text
    .replace(new RegExp(`this\\.(${names})\\(\\)`, 'g'), '$1(site)')
    .replace(new RegExp(`this\\.(${names})\\(`, 'g'), '$1(site, ')
    .replace(/\bthis\./g, 'site.');
}

test('legacy methods were found', () => {
  assert.equal(Object.keys(legacy).length, 41);
  for (const name of [...Object.keys(ENGINES), 'renderVals', 'componentDidMount']) assert.ok(legacy[name], name);
});

for (const [name, { params, body }] of Object.entries(legacy)) {
  if (name === 'renderVals') {
    test('renderVals is verbatim', () => {
      const port = methods(source('src/site/renderVals.ts'), '').renderVals;
      assert.ok(port, 'renderVals missing');
      assert.equal(squash(port.body), squash(toFunctionForm(body)));
    });
  } else if (ENGINES[name]) {
    test(`engine ${name} is verbatim`, { todo: !ENGINES_DONE }, () => {
      const port = methods(source(ENGINES[name]), '')[name];
      assert.ok(port, `${name} missing`);
      assert.equal(squash(port.params), squash(['site', params].filter(Boolean).join(',')));
      assert.equal(squash(port.body), squash(toFunctionForm(body)));
    });
  } else if (name === 'componentWillUnmount') {
    test('unmount keeps every legacy cleanup', () => {
      const port = methods(source('src/site/controller.ts'), '  ').unmount;
      assert.ok(port, 'unmount missing');
      assert.ok(squash(port.body).startsWith(squash(body)));
    });
  } else {
    test(`${name} is verbatim`, () => {
      const portName = RENAMED[name] ?? name;
      const port = methods(source('src/site/controller.ts'), '  ')[portName];
      assert.ok(port, `${portName} missing`);
      assert.equal(squash(port.params), squash(params));
      assert.equal(squash(port.body), squash(body));
    });
  }
}
