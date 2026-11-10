import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseStyle } from '../../src/site/style.ts';

test('camelCases names and keeps source order', () => {
  assert.deepEqual(Object.entries(parseStyle('font: 600 13px Arial; z-index: 2; font-size: 9px')), [['font', '600 13px Arial'], ['zIndex', '2'], ['fontSize', '9px']]);
});

test('vendor prefixes become React names', () => {
  assert.deepEqual(parseStyle('-webkit-backdrop-filter: blur(8px)'), { WebkitBackdropFilter: 'blur(8px)' });
});

test('custom properties keep their names', () => {
  assert.deepEqual(parseStyle('--dot-size: 4px'), { '--dot-size': '4px' });
});

test('splits on the first colon only', () => {
  assert.deepEqual(parseStyle('background: url("data:image/svg+xml,abc") center'), { background: 'url("data:image/svg+xml,abc") center' });
});

test('skips empty and colon-less entries', () => {
  assert.deepEqual(parseStyle('width: 1px;; nonsense ;'), { width: '1px' });
  assert.deepEqual(parseStyle(''), {});
});
