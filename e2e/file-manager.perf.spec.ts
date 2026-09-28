import { expect, test, type Page } from '@playwright/test'
import { content, item, openHarness } from './support'

/**
 * Large folders, measured in the harness (e2e/harness) on a production build
 * (`pnpm test:perf`). Each step is timed in the page from the input until the
 * next painted frame. The budgets catch regressions such as work that grows
 * with the folder where it should not (a focus move re-rendering every item),
 * rather than benchmarking one machine.
 */

/** Runs `action` in the page and resolves with the time until two frames have painted. */
async function timed(page: Page, action: () => Promise<void>) {
  await page.evaluate(() => { (window as unknown as { __t: number }).__t = performance.now() })
  await action()
  return page.evaluate(() => new Promise<number>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve(performance.now() - (window as unknown as { __t: number }).__t)))
  }))
}

for (const count of [1000, 5000]) {
  for (const view of ['grid', 'list'] as const) {
    test(`${count} files, ${view} view`, async ({ page }, info) => {
      test.slow()
      await openHarness(page, { count, view })
      const first = item(page, 'big/0')

      const open = await timed(page, async () => {
        await item(page, 'big').dblclick()
        await first.waitFor()
      })
      await expect(content(page).locator('[data-item-id]')).toHaveCount(count)

      await first.click()
      const selectAll = await timed(page, () => page.keyboard.press('ControlOrMeta+a'))
      await expect(page.getByTestId('state')).toContainText(`"selected":${count}`)

      // Let the click (which deselects everything) paint first: an arrow key on
      // its own must cost the same in any folder size.
      await first.click()
      await page.waitForTimeout(300)
      const arrow = await timed(page, () => page.keyboard.press('ArrowDown'))

      // Sorting from a column header (details view only).
      const sort = await timed(page, async () => {
        await page.evaluate(() => {
          const header = [...document.querySelectorAll<HTMLButtonElement>('[data-slot="file-manager-content"] [role="presentation"] button')].find(button => button.textContent?.includes('Size'))
          header?.click()
        })
      })

      const scroll = await timed(page, () => content(page).evaluate((element) => { element.scrollTop = element.scrollHeight }))
      await expect(content(page).locator('[data-item-id]').last()).toBeInViewport()

      const nodes = await page.evaluate(() => document.querySelectorAll('*').length)
      const timings = { open, selectAll, arrow, sort: view === 'list' ? sort : 0, scroll }
      await info.attach('timings', { body: JSON.stringify({ ...timings, nodes }, null, 2), contentType: 'application/json' })
      console.log(`[perf] ${count} ${view}: ${JSON.stringify(Object.fromEntries(Object.entries(timings).map(([k, v]) => [k, Math.round(v)])))} nodes=${nodes}`)

      // Ceilings, about 1.5–3× the measured production numbers (Chrome, 2026 laptop):
      // opening and selecting everything scale with the folder. A single step stays
      // near-flat: it re-renders two items, and only the browser's style pass over a
      // bigger document grows (about 40 ms at 1,000 files, 70–90 ms at 5,000).
      const scale = count / 1000
      expect(open).toBeLessThan(600 * scale)
      expect(selectAll).toBeLessThan(150 * scale)
      expect(arrow).toBeLessThan(60 + 12 * scale)
      if (view === 'list') expect(sort).toBeLessThan(100 * scale)
      expect(scroll).toBeLessThan(300)
    })
  }
}
