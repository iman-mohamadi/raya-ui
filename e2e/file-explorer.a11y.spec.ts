import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { demoSetting, goHome, item, openDemo, operations, type DemoOptions } from './support'

/**
 * Automated accessibility audit (axe-core, WCAG 2.2 AA and best practices) of
 * each state of the explorer: views, menus, dialogs, rename, errors, trash,
 * right to left, light and dark, and phone size. Automated checks find about a
 * third of real issues; they complement, not replace, a screen reader pass.
 */

/** Everything the explorer renders, including menus and dialogs portaled to <body>. */
const SCOPE = ['[data-slot="file-explorer"]', '[role="menu"]', '[role="alertdialog"]', '[role="dialog"]']

async function audit(page: Page) {
  // Let enter animations finish: axe reads computed colors mid-fade otherwise.
  await page.waitForTimeout(350)
  let builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
  for (const selector of SCOPE) {
    if (await page.locator(selector).count()) builder = builder.include(selector)
  }
  const { violations } = await builder.analyze()
  const report = violations.map(violation => ({
    rule: violation.id,
    impact: violation.impact,
    help: violation.help,
    nodes: violation.nodes.slice(0, 5).map(node => `${node.target.join(' ')}: ${node.failureSummary?.split('\n')[1]?.trim() ?? ''}`),
  }))
  expect(report, JSON.stringify(report, null, 2)).toEqual([])
}

const themes: DemoOptions[] = [{ theme: 'dark' }, { theme: 'light' }]

for (const options of themes) {
  test.describe(`${options.theme} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await openDemo(page, { ...options, expand: true })
    })

    test('grid view', async ({ page }) => {
      await audit(page)
    })

    test('details view', async ({ page }) => {
      await page.getByRole('button', { name: 'Details view' }).click()
      await audit(page)
    })

    test('context menu', async ({ page }) => {
      await item(page, 'components/ui/nuxt.config.ts').click({ button: 'right' })
      await expect(page.getByRole('menu')).toBeVisible()
      await audit(page)
    })

    test('toolbar menus', async ({ page }) => {
      await page.locator('[data-slot="file-explorer-toolbar"] [data-action="new"]').click()
      await expect(page.getByRole('menu')).toBeVisible()
      await audit(page)
    })

    test('rename', async ({ page }) => {
      await item(page, 'components/ui/nuxt.config.ts').click()
      await page.keyboard.press('F2')
      await page.getByRole('textbox', { name: 'New name' }).fill('README.md/')
      await page.keyboard.press('Enter')
      await expect(page.getByRole('textbox', { name: 'New name' })).toHaveAttribute('aria-invalid', 'true')
      await audit(page)
    })

    test('conflict dialog', async ({ page }) => {
      await goHome(page)
      await page.locator('[data-slot="file-explorer"] input[type=file]:not([webkitdirectory])').setInputFiles([
        { name: 'package.json', mimeType: 'application/json', buffer: Buffer.from('{}') },
        { name: 'README.md', mimeType: 'text/markdown', buffer: Buffer.from('#') },
      ])
      await expect(page.getByRole('alertdialog')).toBeVisible()
      await audit(page)
    })

    test('delete confirmation', async ({ page }) => {
      await goHome(page)
      await item(page, 'package.json').click()
      await page.keyboard.press('Shift+Delete')
      await expect(page.getByRole('alertdialog')).toBeVisible()
      await audit(page)
    })

    test('operations: running, failed and undo', async ({ page }) => {
      await demoSetting(page, 'Fail next call')
      await item(page, 'components/ui/nuxt.config.ts').click()
      await page.keyboard.press('ControlOrMeta+d')
      await expect(operations(page).locator('li[data-status="error"]')).toBeVisible()
      await item(page, 'components/ui/hero-banner.png').click()
      await page.keyboard.press('Delete')
      await expect(operations(page)).toContainText('Undo')
      await audit(page)
    })

    test('trash listing', async ({ page }) => {
      await item(page, 'components/ui/hero-banner.png').click()
      await page.keyboard.press('Delete')
      await page.locator('[data-slot="file-explorer-sidebar"]').getByRole('button', { name: /^Trash/ }).click()
      await expect(item(page, 'components/ui/hero-banner.png')).toBeVisible()
      await audit(page)
    })

    test('empty and no matches', async ({ page }) => {
      await page.getByRole('searchbox').fill('nothing matches this')
      await expect(page.locator('[data-slot="file-explorer-content"]')).toContainText('No items match')
      await audit(page)
    })
  })
}

test('command palette', async ({ page }) => {
  await openDemo(page, { expand: true })
  await item(page, 'components/ui/nuxt.config.ts').click()
  await page.keyboard.press('ControlOrMeta+k')
  await expect(page.locator('[data-slot="file-explorer-command-palette"]')).toBeVisible()
  await audit(page)
})

test('arabic, right to left', async ({ page }) => {
  await openDemo(page, { arabic: true, expand: true })
  await audit(page)
  await item(page, 'components/ui/nuxt.config.ts').click({ button: 'right' })
  await expect(page.getByRole('menu')).toBeVisible()
  await audit(page)
})

test('phone size, sidebar open @mobile', async ({ page }) => {
  await openDemo(page)
  await audit(page)
  await page.getByRole('button', { name: 'Toggle directory tree' }).click()
  await expect(page.locator('[data-slot="file-explorer-sidebar"]')).toBeVisible()
  await audit(page)
})
