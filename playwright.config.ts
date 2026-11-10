import { defineConfig } from '@playwright/test';

export const BASELINE_URL = 'http://localhost:4173';
export const TARGET_URL = process.env.PORT_TARGET_URL || 'http://localhost:4174';

const baseline = { command: 'npx vite preview --port 4173 --strictPort', cwd: '.port-baseline', url: BASELINE_URL, reuseExistingServer: true };
const target = { command: 'npx vite preview --port 4174 --strictPort', url: 'http://localhost:4174', reuseExistingServer: true };

export default defineConfig({
  testDir: 'tests/port',
  testMatch: '*.spec.ts',
  fullyParallel: true,
  workers: 6,
  timeout: 900000,
  reporter: 'line',
  // Make Chrome finish decoding and rastering synchronously, so identical pages give identical pixels.
  use: { launchOptions: { args: ['--disable-checker-imaging', '--disable-partial-raster', '--disable-gpu-rasterization', '--run-all-compositor-stages-before-draw', '--disable-new-content-rendering-timeout', '--disable-threaded-animation', '--disable-lcd-text', '--disable-skia-runtime-opts'] } },
  webServer: TARGET_URL === 'http://localhost:4174' ? [baseline, target] : [baseline],
});
