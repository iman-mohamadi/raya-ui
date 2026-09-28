import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end, visual and accessibility tests in a real browser, against the
 * dev server. Component logic is covered faster by Vitest (tests/); these cover
 * what happy-dom cannot: layout, focus, pointer and touch input, and paint.
 *
 * Runs the installed Google Chrome, so no browser download is needed. Set
 * PLAYWRIGHT_CHANNEL (e.g. "chromium") to use Playwright's own build instead.
 *
 * `pnpm test:perf` sets PERF=1: the performance spec then runs alone, against a
 * production build (dev mode adds DevTools instrumentation and Vue's dev checks,
 * which would dominate the numbers). Everything else runs against `pnpm dev`.
 */
const perf = Boolean(process.env.PERF)
const port = Number(process.env.PORT ?? (perf ? 3100 : 3000))

export default defineConfig({
  testDir: 'e2e',
  testMatch: perf ? '**/*.perf.spec.ts' : '**/*.spec.ts',
  testIgnore: perf ? [] : ['**/*.perf.spec.ts', '**/tmp/**'],
  globalSetup: perf ? undefined : './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 45_000,
  expect: {
    timeout: 8_000,
    // Tight enough that a changed word fails; loose enough for anti-aliasing noise.
    toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: 'disabled', caret: 'hide' },
  },
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}-{projectName}{ext}',
  use: {
    baseURL: `http://localhost:${port}`,
    channel: process.env.PLAYWRIGHT_CHANNEL ?? 'chrome',
    // Tracing snapshots the DOM after every action, which would swamp the perf timings.
    trace: perf ? 'off' : 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1600, height: 1000 } }, grepInvert: /@mobile/ },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, grep: /@mobile/ },
  ],
  webServer: perf
    ? { command: `PORT=${port} node .output/server/index.mjs`, url: `http://localhost:${port}`, reuseExistingServer: false, timeout: 60_000 }
    : { command: 'pnpm dev', url: `http://localhost:${port}`, reuseExistingServer: true, timeout: 180_000 },
})
