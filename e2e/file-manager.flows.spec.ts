import { expect, test } from '@playwright/test'
import { content, demoSetting, goHome, item, itemNamed, openDemo, operations, toolbarButton, tree, treeItem } from './support'

/**
 * The File Manager's main workflows, in a real browser against the docs demo
 * (an in-memory mock server with latency, conflicts, failures and undo).
 */

test.beforeEach(async ({ page }) => {
  await openDemo(page, { expand: true })
})

test.describe('clipboard', () => {
  test('copy and paste in place keeps both', async ({ page }) => {
    await item(page, 'components/ui/nuxt.config.ts').click()
    await page.keyboard.press('ControlOrMeta+c')
    await page.keyboard.press('ControlOrMeta+v')

    const copy = itemNamed(page, 'nuxt.config (1).ts')
    await expect(copy).toBeVisible()
    await expect(copy).toHaveAttribute('aria-selected', 'true')
    await expect(copy).toBeFocused()
    await expect(operations(page)).toContainText('Copied 1 item')
  })

  test('cut and paste moves into another folder, and Ctrl+Z moves it back', async ({ page }) => {
    const source = item(page, 'components/ui/nuxt.config.ts')
    await source.click()
    await page.keyboard.press('ControlOrMeta+x')
    await expect(source).toHaveAttribute('data-cut', '')

    await treeItem(page, 'forms').click()
    await expect(item(page, 'components/forms/FormField.vue')).toBeVisible()
    await page.keyboard.press('ControlOrMeta+v')
    await expect(item(page, 'components/ui/nuxt.config.ts')).toBeVisible()
    await expect(operations(page)).toContainText('Moved 1 item')

    await page.keyboard.press('ControlOrMeta+z')
    await expect(item(page, 'components/ui/nuxt.config.ts')).toBeHidden()
  })

  test('refuses to paste a folder into itself', async ({ page }) => {
    await item(page, 'components/ui/ui-primitives').click()
    await page.keyboard.press('ControlOrMeta+c')
    await item(page, 'components/ui/ui-primitives').dblclick()
    await expect(item(page, 'components/ui/ui-primitives/Button.vue')).toBeVisible()
    await item(page, 'components/ui/ui-primitives/Button.vue').click()
    await page.keyboard.press('ControlOrMeta+v')
    const dialog = page.getByRole('alertdialog')
    await expect(dialog).toContainText('“ui-primitives” cannot be added')
    await expect(dialog).toContainText('cannot be pasted into itself')
    await expect(dialog.getByRole('button', { name: 'Replace' })).toHaveCount(0)
    await dialog.getByRole('button', { name: 'Skip' }).click()
    await expect(dialog).toBeHidden()
    await expect(item(page, 'components/ui/ui-primitives/Button.vue')).toBeFocused()
  })
})

test.describe('conflicts and failures', () => {
  test('an upload that clashes asks, and a partial failure offers Retry', async ({ page }) => {
    await goHome(page)
    await page.locator('[data-slot="file-manager"] input[type=file]:not([webkitdirectory])').setInputFiles([
      { name: 'package.json', mimeType: 'application/json', buffer: Buffer.from('{}') },
      { name: 'fail.txt', mimeType: 'text/plain', buffer: Buffer.from('x') },
    ])

    const dialog = page.getByRole('alertdialog')
    await expect(dialog).toContainText('Replace or skip?')
    await expect(dialog).toContainText('package.json')
    await dialog.getByRole('button', { name: 'Keep both' }).click()

    await expect(itemNamed(page, 'package (1).json')).toBeVisible()
    const failure = operations(page).locator('li[data-status="error"]')
    await expect(failure).toContainText('Couldn’t upload 1 item')
    await expect(failure).toContainText('1 of 2 failed: Quota exceeded (demo)')

    await failure.getByRole('button', { name: 'Retry' }).click()
    // fail.txt always fails in the demo: the retry fails again with one file.
    await expect(operations(page).locator('li[data-status="error"]')).toContainText('1 of 1 failed')
  })

  test('Cancel in the conflict dialog uploads nothing', async ({ page }) => {
    await goHome(page)
    await page.locator('[data-slot="file-manager"] input[type=file]:not([webkitdirectory])').setInputFiles([
      { name: 'README.md', mimeType: 'text/markdown', buffer: Buffer.from('#') },
    ])
    await page.getByRole('alertdialog').getByRole('button', { name: 'Cancel' }).click()
    await expect(page.getByRole('alertdialog')).toBeHidden()
    await expect(itemNamed(page, 'README (1).md')).toHaveCount(0)
  })

  test('a failed request shows the error, and Retry runs it again', async ({ page }) => {
    await demoSetting(page, 'Fail next call')
    await item(page, 'components/ui/nuxt.config.ts').click()
    await page.keyboard.press('ControlOrMeta+d')

    const failure = operations(page).locator('li[data-status="error"]')
    await expect(failure).toContainText('Couldn’t duplicate 1 item')
    await expect(failure).toContainText('The mock server was told to fail this request.')

    await failure.getByRole('button', { name: 'Retry' }).click()
    await expect(itemNamed(page, 'nuxt.config copy.ts')).toBeVisible()
  })

  test('a running operation can be canceled', async ({ page }) => {
    await openDemo(page, { slow: true })
    await item(page, 'components/ui/hero-banner.png').click()
    await toolbarButton(page, 'download').click()
    const running = operations(page).getByRole('progressbar')
    await expect(running).toBeVisible()
    await operations(page).getByRole('button', { name: 'Cancel' }).click()
    await expect(operations(page)).toContainText('Canceled')
  })
})

test.describe('rename, trash and undo', () => {
  test('F2 renames, Escape cancels', async ({ page }) => {
    await item(page, 'components/ui/nuxt.config.ts').click()
    await page.keyboard.press('F2')
    const input = page.getByRole('textbox', { name: 'New name' })
    await expect(input).toBeFocused()
    await input.fill('app.config.ts')
    await page.keyboard.press('Escape')
    await expect(itemNamed(page, 'nuxt.config.ts')).toBeVisible()

    await page.keyboard.press('F2')
    await input.fill('app.config.ts')
    await page.keyboard.press('Enter')
    await expect(itemNamed(page, 'app.config.ts')).toBeVisible()
    await expect(item(page, 'components/ui/nuxt.config.ts')).toBeFocused()
  })

  test('rename rejects a name that exists', async ({ page }) => {
    await item(page, 'components/ui/nuxt.config.ts').click()
    await page.keyboard.press('F2')
    await page.getByRole('textbox', { name: 'New name' }).fill('useFileSystem.ts')
    await page.keyboard.press('Enter')
    await expect(page.getByRole('textbox', { name: 'New name' })).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByText('An item named “useFileSystem.ts” already exists here.')).toBeVisible()
  })

  test('Delete moves to the trash with Undo, and focus moves to the neighbour', async ({ page }) => {
    await item(page, 'components/ui/hero-banner.png').click()
    await page.keyboard.press('Delete')
    await expect(item(page, 'components/ui/hero-banner.png')).toBeHidden()
    await expect(content(page).locator('[data-item-id]:focus')).toHaveCount(1)
    await expect(operations(page)).toContainText('Moved 1 item to Trash')

    await operations(page).getByRole('button', { name: 'Undo' }).click()
    await expect(item(page, 'components/ui/hero-banner.png')).toBeVisible()
  })

  test('trash location: restore and empty with confirmation', async ({ page }) => {
    await item(page, 'components/ui/hero-banner.png').click()
    await page.keyboard.press('Delete')
    await item(page, 'components/ui/nuxt.config.ts').click()
    await page.keyboard.press('Delete')
    await expect(item(page, 'components/ui/nuxt.config.ts')).toBeHidden()

    await page.locator('[data-slot="file-manager-sidebar"]').getByRole('button', { name: /^Trash/ }).click()
    await expect(item(page, 'components/ui/hero-banner.png')).toBeVisible()

    await item(page, 'components/ui/hero-banner.png').click({ button: 'right' })
    await page.getByRole('menuitem', { name: 'Restore' }).click()
    await expect(item(page, 'components/ui/hero-banner.png')).toBeHidden()

    await toolbarButton(page, 'empty-trash').click()
    const confirm = page.getByRole('alertdialog')
    await expect(confirm).toContainText('Empty the trash?')
    await confirm.getByRole('button', { name: 'Empty Trash' }).click()
    await expect(content(page)).toContainText('Trash is empty')
  })
})

test.describe('navigation and loading', () => {
  test('a lazy folder loads when opened, and appears in the tree', async ({ page }) => {
    await goHome(page)
    await item(page, 'server').dblclick()
    await expect(item(page, 'server/api')).toBeVisible()
    await expect(treeItem(page, 'api')).toBeVisible()
  })

  test('a paged folder loads more as it scrolls', async ({ page }) => {
    await goHome(page)
    await item(page, 'logs').dblclick()
    await expect(content(page).locator('[data-item-id]')).toHaveCount(12)
    for (const expected of [24, 36]) {
      await content(page).locator('[data-item-id]').last().scrollIntoViewIfNeeded()
      await expect(content(page).locator('[data-item-id]')).toHaveCount(expected)
    }
    await expect(content(page).getByRole('button', { name: 'Load more' })).toHaveCount(0)
  })

  test('keyboard: arrows, Enter to open, Backspace returns to the folder you came from', async ({ page }) => {
    await item(page, 'components/ui/FileManager.vue').click()
    await page.keyboard.press('Home')
    await expect(item(page, 'components/ui/ui-primitives')).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(item(page, 'components/ui/ui-primitives/Avatar.vue')).toBeFocused()
    await page.keyboard.press('Backspace')
    await expect(item(page, 'components/ui/ui-primitives')).toBeFocused()
    // Up is a step in history, like a desktop file manager: Back returns into the folder.
    await page.keyboard.press('Alt+ArrowLeft')
    await expect(item(page, 'components/ui/ui-primitives/Avatar.vue')).toBeVisible()
  })

  test('filtering narrows the folder and says when nothing matches', async ({ page }) => {
    const search = page.getByRole('searchbox')
    await search.fill('.ts')
    await expect(content(page).locator('[data-item-id]')).toHaveCount(2)
    await search.fill('zzz')
    await expect(content(page)).toContainText('No items match “zzz”')
  })

  test('the tree expands and navigates', async ({ page }) => {
    await treeItem(page, 'composables').click()
    await expect(item(page, 'composables/useTheme.ts')).toBeVisible()
    await expect(tree(page).getByRole('treeitem', { name: 'composables', exact: true })).toHaveAttribute('aria-selected', 'true')
  })
})

test.describe('menus and drag and drop', () => {
  test('the context menu lists what the item allows, and Escape returns focus', async ({ page }) => {
    const target = item(page, 'components/ui/nuxt.config.ts')
    await target.click({ button: 'right' })
    const menu = page.getByRole('menu')
    for (const action of ['open', 'preview', 'cut', 'copy', 'duplicate', 'rename', 'favorite', 'download', 'copy-link', 'trash', 'properties'])
      await expect(menu.locator(`[role="menuitem"][data-action="${action}"]`)).toBeVisible()
    await expect(menu.locator('[data-action="copy"]')).toContainText('Ctrl+C')
    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
    await expect(target).toBeFocused()
  })

  test('read-only items offer no changes', async ({ page }) => {
    await goHome(page)
    await item(page, 'shared').dblclick()
    await item(page, 'shared/roadmap.xlsx').click({ button: 'right' })
    const menu = page.getByRole('menu')
    await expect(menu.locator('[data-action="copy"]')).toBeVisible()
    // Menus keep their shape; what the permissions forbid is greyed out.
    for (const action of ['rename', 'cut', 'trash', 'download'])
      await expect(menu.locator(`[data-action="${action}"]`)).toHaveAttribute('aria-disabled', 'true')
  })

  test('drags a file onto a folder', async ({ page }) => {
    await item(page, 'components/ui/nuxt.config.ts').dragTo(item(page, 'components/ui/ui-primitives'))
    await expect(item(page, 'components/ui/nuxt.config.ts')).toBeHidden()
    await expect(operations(page)).toContainText('Moved 1 item')
  })

  test('drops on a read-only folder are refused', async ({ page }) => {
    await goHome(page)
    await item(page, 'README.md').dragTo(item(page, 'shared'))
    await expect(item(page, 'README.md')).toBeVisible()
  })
})

test.describe('details view columns', () => {
  const headerKeys = (page: import('@playwright/test').Page) =>
    page.locator('[data-slot="file-manager-content"] [data-column]').evaluateAll(cells => cells.map(cell => cell.getAttribute('data-column')))

  test('drag a column edge to resize it, and a header to move it', async ({ page }) => {
    await page.getByRole('button', { name: 'Details view' }).click()
    const owner = page.locator('[data-column="owner"]')
    const before = (await owner.boundingBox())!.width

    const handle = (await owner.locator('[role="separator"]').boundingBox())!
    await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2)
    await page.mouse.down()
    await page.mouse.move(handle.x + 80, handle.y + handle.height / 2, { steps: 8 })
    await page.mouse.up()
    await expect.poll(async () => Math.round((await owner.boundingBox())!.width - before)).toBeGreaterThan(70)
    // The drag did not sort by owner.
    await expect(owner.locator('svg')).toHaveCount(0)

    expect(await headerKeys(page)).toEqual(['name', 'modified', 'owner', 'type', 'size'])
    const from = (await owner.locator('button').boundingBox())!
    const type = (await page.locator('[data-column="type"]').boundingBox())!
    await page.mouse.move(from.x + 10, from.y + from.height / 2)
    await page.mouse.down()
    await page.mouse.move(type.x + type.width - 4, type.y + type.height / 2, { steps: 10 })
    await page.mouse.up()
    await expect.poll(() => headerKeys(page)).toEqual(['name', 'modified', 'type', 'owner', 'size'])
    // Rows follow the header order.
    await expect(item(page, 'components/ui/nuxt.config.ts').locator(':scope > span').nth(3)).toContainText('TypeScript')
  })
})

test.describe('command palette', () => {
  test('Ctrl+K finds a folder, Enter goes there, and focus lands in the folder', async ({ page }) => {
    await item(page, 'components/ui/nuxt.config.ts').click()
    await page.keyboard.press('ControlOrMeta+k')
    const palette = page.locator('[data-slot="file-manager-command-palette"]')
    await expect(palette.getByRole('combobox').or(palette.locator('input'))).toBeFocused()
    await page.keyboard.type('compos')
    await expect(palette.locator('[data-command]').first()).toHaveAttribute('data-command', 'folder:composables')
    await page.keyboard.press('Enter')
    await expect(palette).toBeHidden()
    await expect(item(page, 'composables/useTheme.ts')).toBeVisible()
    await expect(content(page).locator('[data-item-id]:focus')).toHaveCount(1)
  })

  test('Escape closes it and returns focus to the item', async ({ page }) => {
    await item(page, 'components/ui/nuxt.config.ts').click()
    await page.keyboard.press('ControlOrMeta+k')
    await expect(page.locator('[data-slot="file-manager-command-palette"]')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(item(page, 'components/ui/nuxt.config.ts')).toBeFocused()
  })
})

test.describe('touch', () => {
  test.use({ hasTouch: true })

  async function touch(page: import('@playwright/test').Page, points: { x: number, y: number, wait?: number }[]) {
    const cdp = await page.context().newCDPSession(page)
    const [first, ...rest] = points
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: first!.x, y: first!.y }] })
    if (first!.wait) await page.waitForTimeout(first!.wait)
    for (const point of rest) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: point.x, y: point.y }] })
      if (point.wait) await page.waitForTimeout(point.wait)
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  }
  const center = async (locator: import('@playwright/test').Locator) => {
    const box = (await locator.boundingBox())!
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
  }
  const path = (from: { x: number, y: number }, to: { x: number, y: number }, steps = 8) =>
    Array.from({ length: steps }, (_, i) => ({ x: from.x + ((to.x - from.x) * (i + 1)) / steps, y: from.y + ((to.y - from.y) * (i + 1)) / steps, wait: 16 }))

  test('hold, then drag a file onto a folder', async ({ page }) => {
    const from = await center(item(page, 'components/ui/nuxt.config.ts'))
    const to = await center(item(page, 'components/ui/ui-primitives'))
    await touch(page, [{ ...from, wait: 450 }, ...path(from, to)])
    await expect(item(page, 'components/ui/nuxt.config.ts')).toBeHidden()
    await expect(operations(page)).toContainText('Moved 1 item')
  })

  test('a quick swipe does not drag', async ({ page }) => {
    const from = await center(item(page, 'components/ui/nuxt.config.ts'))
    const to = await center(item(page, 'components/ui/ui-primitives'))
    await touch(page, [from, ...path(from, to)])
    await page.waitForTimeout(300)
    await expect(item(page, 'components/ui/nuxt.config.ts')).toBeVisible()
    await expect(operations(page)).toHaveCount(0)
  })

  test('holding still opens the context menu instead', async ({ page }) => {
    const from = await center(item(page, 'components/ui/nuxt.config.ts'))
    await touch(page, [{ ...from, wait: 900 }])
    await expect(page.getByRole('menu')).toBeVisible()
  })
})

test.describe('download', () => {
  test('a file downloads with its name and content', async ({ page }) => {
    await item(page, 'components/ui/nuxt.config.ts').click()
    const download = page.waitForEvent('download')
    await toolbarButton(page, 'download').click()
    const file = await download
    expect(file.suggestedFilename()).toBe('nuxt.config.ts')
    const path = await file.path()
    const { readFile } = await import('node:fs/promises')
    expect(await readFile(path, 'utf8')).toContain('defineNuxtConfig')
    await expect(operations(page)).toContainText('Downloaded nuxt.config.ts')
  })

  test('a folder downloads as a zip with its contents', async ({ page }) => {
    await item(page, 'components/ui/ui-primitives').click({ button: 'right' })
    const download = page.waitForEvent('download')
    await page.getByRole('menu').locator('[data-action="download"]').click()
    const file = await download
    expect(file.suggestedFilename()).toBe('ui-primitives.zip')
    const { readFile, copyFile } = await import('node:fs/promises')
    const bytes = await readFile(await file.path())
    expect(bytes.subarray(0, 4).toString('latin1')).toBe('PK\x03\x04')
    expect(bytes.includes(Buffer.from('ui-primitives/Button.vue'))).toBe(true)
    if (process.env.KEEP_DOWNLOADS) await copyFile(await file.path(), `${process.env.KEEP_DOWNLOADS}/ui-primitives.zip`)
  })
})
