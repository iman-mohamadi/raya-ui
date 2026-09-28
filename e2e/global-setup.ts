import { chromium, type FullConfig } from '@playwright/test'

/**
 * Warms the dev server before the tests start. On a cold start Vite discovers
 * and optimizes dependencies on first load and then reloads the page, which
 * would otherwise land in the middle of whichever tests ran first.
 */
export default async function globalSetup(config: FullConfig) {
  const project = config.projects[0]
  const baseURL = project?.use.baseURL ?? 'http://localhost:3000'
  const browser = await chromium.launch({ channel: project?.use.channel })
  const page = await browser.newPage()
  for (const path of ['/docs/components/file-manager?slow=0', '/__e2e/file-manager?count=10']) {
    // Load until a visit completes without a reload in the middle of it.
    for (let attempt = 0; attempt < 5; attempt++) {
      let reloaded = false
      page.once('framenavigated', () => { reloaded = true })
      await page.goto(`${baseURL}${path}`, { waitUntil: 'networkidle', timeout: 120_000 })
      reloaded = false
      await page.waitForTimeout(1500)
      if (!reloaded) break
    }
  }
  await browser.close()
}
