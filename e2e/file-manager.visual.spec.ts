import { expect, test, type Page } from '@playwright/test'
import { fileManager, goHome, item, openDemo, type DemoOptions } from './support'

/**
 * Visual regression: the file manager in each theme, direction and size, compared
 * with the committed screenshots in e2e/__screenshots__. After an intended
 * visual change, review the diff and run `pnpm test:e2e:update`.
 *
 * Baselines are rendered by the local Chrome; other platforms render text
 * slightly differently, so regenerate them on the machine that checks them.
 */

async function settle(page: Page) {
  // Fonts, thumbnails and the entry animation of the operations panel.
  await page.evaluate(() => document.fonts.ready)
  await page.waitForLoadState('networkidle')
  // Park the pointer where it hovers nothing (the page's left edge opens the docs menu).
  const size = page.viewportSize()
  await page.mouse.move((size?.width ?? 800) - 2, (size?.height ?? 600) - 2)
  await page.waitForTimeout(300)
}

const cases: (DemoOptions & { name: string })[] = [
  { name: 'dark', theme: 'dark' },
  { name: 'light', theme: 'light' },
  { name: 'rtl', theme: 'dark', arabic: true },
]

for (const { name, ...options } of cases) {
  test.describe(name, () => {
    test.beforeEach(async ({ page }) => {
      await openDemo(page, { ...options, expand: true })
    })

    test('grid', async ({ page }) => {
      await settle(page)
      await expect(fileManager(page)).toHaveScreenshot(`${name}-grid.png`)
    })

    test('details', async ({ page }) => {
      await page.getByRole('button', { name: options.arabic ? 'عرض التفاصيل' : 'Details view' }).click()
      await settle(page)
      await expect(fileManager(page)).toHaveScreenshot(`${name}-details.png`)
    })

    test('context menu', async ({ page }) => {
      await item(page, 'components/ui/nuxt.config.ts').click({ button: 'right', position: { x: 60, y: 30 } })
      await expect(page.getByRole('menu')).toBeVisible()
      await settle(page)
      await expect(page).toHaveScreenshot(`${name}-context-menu.png`)
    })

    test('conflict dialog', async ({ page }) => {
      await goHome(page)
      await page.locator('[data-slot="file-manager"] input[type=file]:not([webkitdirectory])').setInputFiles([
        { name: 'package.json', mimeType: 'application/json', buffer: Buffer.from('{}') },
      ])
      await expect(page.getByRole('alertdialog')).toBeVisible()
      await settle(page)
      // The incoming file's age depends on when the test runs.
      await expect(page).toHaveScreenshot(`${name}-conflict.png`, { mask: [page.getByRole('alertdialog').locator('p.truncate.text-xs')] })
    })
  })
}

test('half width: sidebar folds away, breadcrumb collapses', async ({ page }) => {
  await openDemo(page)
  await settle(page)
  await expect(fileManager(page)).toHaveScreenshot('half-width.png')
})

test('phone @mobile', async ({ page }) => {
  await openDemo(page)
  await settle(page)
  await expect(fileManager(page)).toHaveScreenshot('phone.png')
  await page.getByRole('button', { name: 'Toggle directory tree' }).click()
  await settle(page)
  await expect(fileManager(page)).toHaveScreenshot('phone-sidebar.png')
})
