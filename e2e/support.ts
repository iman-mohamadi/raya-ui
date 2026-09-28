import { expect, type Page } from '@playwright/test'

export type Theme = 'dark' | 'light'

export interface DemoOptions {
  theme?: Theme
  /** The demo's latency; off by default so tests stay fast. */
  slow?: boolean
  arabic?: boolean
  /** Widen the preview to the whole page (desktop only), so the sidebar is docked. */
  expand?: boolean
}

/** Opens the File Manager docs page and waits for the demo file manager. */
export async function openDemo(page: Page, { theme = 'dark', slow = false, arabic = false, expand = false }: DemoOptions = {}) {
  await page.addInitScript(value => localStorage.setItem('vueuse-color-scheme', value), theme)
  const query = new URLSearchParams({ slow: slow ? '1' : '0', ...(arabic ? { arabic: '1' } : {}) })
  await page.goto(`/docs/components/file-manager?${query}`)
  const fileManager = page.locator('[data-slot="file-manager"]')
  await expect(fileManager).toBeVisible()
  await hydrated(page)
  // The demo opens components/ui with FileManager.vue selected.
  await expect(item(page, 'components/ui/FileManager.vue')).toBeVisible()
  await page.waitForLoadState('networkidle')
  if (expand) {
    await page.getByRole('button', { name: 'Expand preview' }).click()
    await expect.poll(async () => (await fileManager.boundingBox())?.width ?? 0).toBeGreaterThan(1100)
    // The layout animates for 700ms: wait until the file manager stops moving.
    await expect.poll(async () => {
      const before = await fileManager.boundingBox()
      await page.waitForTimeout(150)
      const after = await fileManager.boundingBox()
      return JSON.stringify(before) === JSON.stringify(after)
    }).toBe(true)
    await expect(page.locator('[data-slot="file-manager-sidebar"] [role="tree"]')).toBeVisible()
  }
  return fileManager
}

/** Opens the bare harness (e2e/harness) with `count` files in the "big" folder. */
export async function openHarness(page: Page, { count = 5000, view = 'grid' }: { count?: number, view?: 'grid' | 'list' } = {}) {
  await page.addInitScript(() => localStorage.setItem('vueuse-color-scheme', 'dark'))
  await page.goto(`/__e2e/file-manager?count=${count}&view=${view}`)
  await expect(page.locator('[data-slot="file-manager"]')).toBeVisible()
  await hydrated(page)
  await expect(item(page, 'big')).toBeVisible()
}

/** Server-rendered markup is visible before Vue takes it over; input sent earlier is lost. */
async function hydrated(page: Page) {
  await page.waitForFunction(() => Boolean((document.querySelector('#__nuxt') as { __vue_app__?: unknown } | null)?.__vue_app__))
}

export const fileManager = (page: Page) => page.locator('[data-slot="file-manager"]')
export const content = (page: Page) => page.locator('[data-slot="file-manager-content"]')
export const item = (page: Page, id: string) => content(page).locator(`[data-item-id="${id}"]`)
export const itemNamed = (page: Page, name: string) => content(page).locator('[data-item-id]').filter({ has: page.getByText(name, { exact: true }) })
export const operations = (page: Page) => page.locator('[data-slot="file-manager-operations"]')
export const tree = (page: Page) => page.locator('[data-slot="file-manager-sidebar"] [role="tree"]')
export const treeItem = (page: Page, name: string) => tree(page).getByRole('treeitem', { name, exact: true })
export const toolbarButton = (page: Page, action: string) => page.locator(`[data-slot="file-manager-toolbar"] [data-action="${action}"]`)

/** Goes to the root through the sidebar's Home entry. */
export async function goHome(page: Page) {
  await page.locator('[data-slot="file-manager-sidebar"]').getByRole('button', { name: /^(Home|الرئيسية)/ }).click()
  await expect(item(page, 'package.json')).toBeVisible()
}

/** Runs a callback from the docs settings panel, e.g. "Fail next call". */
export async function demoSetting(page: Page, label: string | RegExp) {
  const settings = page.getByRole('button', { name: 'Preview settings' })
  if ((await settings.getAttribute('aria-expanded')) !== 'true') await settings.click()
  await page.getByRole('button', { name: label }).click()
  await settings.click()
}

