import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import {
  FileManager,
  type FileManagerItem,
  type FileManagerOperationContext,
  type FileManagerPasteEvent,
  type FileManagerProps,
} from '@/components/raya/ui/file-manager'

const createItems = (): FileManagerItem[] => [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    children: [
      { id: 'src/App.vue', name: 'App.vue', type: 'file', size: 1000 },
      { id: 'src/main.ts', name: 'main.ts', type: 'file', size: 300 },
      { id: 'src/locked.ts', name: 'locked.ts', type: 'file', permissions: { rename: false, delete: false, download: false } },
    ],
  },
  { id: 'docs', name: 'docs', type: 'folder', children: [{ id: 'docs/App.vue', name: 'App.vue', type: 'file' }] },
  { id: 'readonly', name: 'readonly', type: 'folder', permissions: { write: false }, children: [] },
  { id: 'lazy', name: 'lazy', type: 'folder' },
  { id: 'README.md', name: 'README.md', type: 'file' },
]

let wrapper: VueWrapper | undefined

function render(props: FileManagerProps = {}) {
  wrapper = mount(FileManager, { props: { items: createItems(), ...props }, attachTo: document.body })
  return wrapper
}

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  document.body.innerHTML = ''
})

async function settle(ms = 0) {
  await flushPromises()
  await new Promise(resolve => setTimeout(resolve, ms))
  await nextTick()
}

/** A promise the test resolves or rejects by hand. */
function deferred<T = void>() {
  let resolve: (value: T) => void = () => {}
  let reject: (error: unknown) => void = () => {}
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

const content = (w: VueWrapper) => w.find('[data-slot="file-manager-content"]')
const option = (w: VueWrapper, id: string) => content(w).find(`[role="option"][data-item-id="${id}"]`)
const optionIds = (w: VueWrapper) => content(w).findAll('[role="option"]').map(el => el.attributes('data-item-id'))
const panel = (w: VueWrapper) => w.find('[data-slot="file-manager-operations"]')
const panelButton = (w: VueWrapper, label: string) => panel(w).findAll('button').find(el => el.text() === label)
const conflictDialog = () => document.body.querySelector<HTMLElement>('[data-slot="file-manager-conflict-dialog"]')
const conflictButton = (label: string) =>
  Array.from(conflictDialog()?.querySelectorAll('button') ?? []).find(button => button.textContent?.trim() === label)
const confirmDialog = () => document.body.querySelector<HTMLElement>('[data-slot="file-manager-delete-dialog"]')
const confirmButton = (label: string) =>
  Array.from(confirmDialog()?.querySelectorAll('button') ?? []).find(button => button.textContent?.trim() === label)

async function press(w: VueWrapper, key: string, init: KeyboardEventInit = {}) {
  await content(w).trigger('keydown', { key, ...init })
  await settle()
}

async function open(w: VueWrapper, id: string) {
  await option(w, id).trigger('dblclick')
  await settle()
}

describe('FileManager: clipboard', () => {
  it('copies with Ctrl+C and pastes into another folder with Ctrl+V', async () => {
    const onPaste = vi.fn()
    const w = render({ defaultFolder: 'src', onPaste })
    await option(w, 'src/App.vue').trigger('click')
    await option(w, 'src/main.ts').trigger('click', { ctrlKey: true })
    await press(w, 'c', { ctrlKey: true })

    expect(w.emitted('copy')?.[0]?.[0]).toMatchObject({ items: [{ id: 'src/App.vue' }, { id: 'src/main.ts' }] })
    expect(w.emitted('update:clipboard')?.at(-1)?.[0]).toMatchObject({ operation: 'copy' })

    await w.find('nav[aria-label="Folder path"] button').trigger('click')
    await settle()
    await open(w, 'readonly')
    await press(w, 'v', { ctrlKey: true })
    // A read-only folder refuses the paste.
    expect(onPaste).not.toHaveBeenCalled()

    await w.find('button[aria-label="Back"]').trigger('click')
    await settle()
    await open(w, 'lazy')
    await w.find('button[aria-label="Up to parent folder"]').trigger('click')
    await settle()
    await press(w, 'v', { ctrlKey: true })
    await settle()
    const event: FileManagerPasteEvent = onPaste.mock.calls[0]?.[0]
    expect(event.operation).toBe('copy')
    expect(event.target).toBeNull()
    expect(event.items.map(item => item.id)).toEqual(['src/App.vue', 'src/main.ts'])
  })

  it('dims cut items, moves them on paste and clears the clipboard afterwards', async () => {
    const onPaste = vi.fn()
    const w = render({ defaultFolder: 'src', onPaste })
    await option(w, 'src/main.ts').trigger('click')
    await press(w, 'x', { ctrlKey: true })

    expect(w.emitted('cut')).toHaveLength(1)
    expect(option(w, 'src/main.ts').attributes('data-cut')).toBe('')

    await w.find('button[aria-label="Up to parent folder"]').trigger('click')
    await settle()
    await press(w, 'v', { ctrlKey: true })
    await settle()
    expect(onPaste.mock.calls[0]?.[0]).toMatchObject({ operation: 'cut', target: null, items: [{ id: 'src/main.ts' }] })
    expect(w.emitted('update:clipboard')?.at(-1)?.[0]).toBeNull()
  })

  it('keeps both automatically when copying next to the original', async () => {
    const onPaste = vi.fn()
    const w = render({ defaultFolder: 'src', onPaste })
    await option(w, 'src/App.vue').trigger('click')
    await press(w, 'c', { ctrlKey: true })
    await press(w, 'v', { ctrlKey: true })
    await settle()

    expect(conflictDialog()).toBeNull()
    expect(onPaste.mock.calls[0]?.[0].conflicts).toEqual([
      expect.objectContaining({ action: 'keep-both', name: 'App (1).vue' }),
    ])
  })
})

describe('FileManager: conflicts', () => {
  async function pasteAppIntoDocs(onPaste: (event: FileManagerPasteEvent) => void) {
    const w = render({ defaultFolder: 'src', onPaste })
    await option(w, 'src/App.vue').trigger('click')
    await press(w, 'c', { ctrlKey: true })
    await w.find('button[aria-label="Up to parent folder"]').trigger('click')
    await settle()
    await open(w, 'docs')
    await press(w, 'v', { ctrlKey: true })
    await settle()
    return w
  }

  it('asks when a name already exists, and keeps both with a free name', async () => {
    const onPaste = vi.fn()
    await pasteAppIntoDocs(onPaste)
    expect(conflictDialog()?.textContent).toContain('An item named “App.vue” already exists in docs.')
    conflictButton('Keep both')?.click()
    await settle()

    const event: FileManagerPasteEvent = onPaste.mock.calls[0]?.[0]
    expect(event.target?.id).toBe('docs')
    expect(event.conflicts).toEqual([expect.objectContaining({ action: 'keep-both', name: 'App (1).vue' })])
  })

  it('replaces, skips or cancels', async () => {
    const replace = vi.fn()
    await pasteAppIntoDocs(replace)
    conflictButton('Replace')?.click()
    await settle()
    expect(replace.mock.calls[0]?.[0].conflicts[0]).toMatchObject({ action: 'replace' })
    wrapper?.unmount()

    const skip = vi.fn()
    await pasteAppIntoDocs(skip)
    conflictButton('Skip')?.click()
    await settle()
    // The only item was skipped, so nothing is pasted.
    expect(skip).not.toHaveBeenCalled()
    wrapper?.unmount()

    const cancel = vi.fn()
    await pasteAppIntoDocs(cancel)
    conflictButton('Cancel')?.click()
    await settle(250)
    expect(cancel).not.toHaveBeenCalled()
  })

  it('applies one choice to all remaining conflicts', async () => {
    const onPaste = vi.fn()
    const items: FileManagerItem[] = [
      { id: 'a', name: 'a', type: 'folder', children: [{ id: 'a/1', name: 'one.txt', type: 'file' }, { id: 'a/2', name: 'two.txt', type: 'file' }] },
      { id: 'b', name: 'b', type: 'folder', children: [{ id: 'b/1', name: 'one.txt', type: 'file' }, { id: 'b/2', name: 'two.txt', type: 'file' }] },
    ]
    const w = render({ items, defaultFolder: 'a', onPaste })
    await press(w, 'a', { ctrlKey: true })
    await press(w, 'c', { ctrlKey: true })
    await w.find('button[aria-label="Up to parent folder"]').trigger('click')
    await settle()
    await open(w, 'b')
    await press(w, 'v', { ctrlKey: true })
    await settle()

    const applyAll = conflictDialog()?.querySelector<HTMLInputElement>('input[type="checkbox"]')
    expect(conflictDialog()?.textContent).toContain('Do this for the next 1 conflict')
    applyAll?.click()
    await nextTick()
    conflictButton('Keep both')?.click()
    await settle()
    expect(onPaste.mock.calls[0]?.[0].conflicts.map((resolution: { name?: string }) => resolution.name)).toEqual(['one (1).txt', 'two (1).txt'])
  })

  it('lets a handler ask about conflicts its server found', async () => {
    let answer: unknown
    const onPaste = vi.fn(async (event: FileManagerPasteEvent, context: FileManagerOperationContext) => {
      answer = await context.resolveConflicts([{ name: 'App.vue', source: event.items[0]!, destination: null, target: null, reason: 'permission' }])
    })
    const w = render({ defaultFolder: 'src', onPaste })
    await option(w, 'src/App.vue').trigger('click')
    await press(w, 'c', { ctrlKey: true })
    await w.find('button[aria-label="Up to parent folder"]').trigger('click')
    await settle()
    await press(w, 'v', { ctrlKey: true })
    await settle()

    expect(conflictDialog()?.textContent).toContain('You do not have permission')
    // Only Skip and Cancel make sense for a permission problem.
    expect(conflictButton('Replace')).toBeUndefined()
    conflictButton('Skip')?.click()
    await settle()
    expect(answer).toEqual([expect.objectContaining({ action: 'skip' })])
  })
})

describe('FileManager: operations', () => {
  it('shows progress for a running operation and clears it on success', async () => {
    const pending = deferred()
    let report: (percent: number) => void = () => {}
    const onDownload = vi.fn((_: unknown, context: FileManagerOperationContext) => {
      report = context.progress
      return pending.promise
    })
    const w = render({ defaultFolder: 'src', onDownload })
    await option(w, 'src/App.vue').trigger('click')
    await w.find('button[data-action="download"]').trigger('click')
    await settle()

    expect(panel(w).text()).toContain('Preparing download of 1 item…')
    expect(option(w, 'src/App.vue').attributes('aria-busy')).toBe('true')
    report(40)
    await nextTick()
    expect(panel(w).find('[role="progressbar"]').attributes('aria-valuenow')).toBe('40')

    pending.resolve()
    await settle()
    expect(panel(w).exists()).toBe(false)
  })

  it('never hides a failure: shows the error, retries and dismisses', async () => {
    const onDuplicate = vi.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(undefined)
    const w = render({ defaultFolder: 'src', onDuplicate })
    await option(w, 'src/App.vue').trigger('click')
    await press(w, 'd', { ctrlKey: true })
    await settle()

    expect(panel(w).find('li[data-status="error"]').text()).toContain('Couldn’t duplicate 1 item')
    expect(panel(w).text()).toContain('Network error')
    expect(w.emitted('operation-error')?.[0]?.[0]).toMatchObject({ type: 'duplicate', status: 'error' })

    await panelButton(w, 'Retry')?.trigger('click')
    await settle()
    expect(onDuplicate).toHaveBeenCalledTimes(2)
    expect(panel(w).exists()).toBe(false)
  })

  it('cancels through the AbortSignal', async () => {
    let signal: AbortSignal | undefined
    const onDownload = vi.fn((_: unknown, context: FileManagerOperationContext) => {
      signal = context.signal
      return new Promise<void>(() => {})
    })
    const w = render({ defaultFolder: 'src', onDownload })
    await option(w, 'src/App.vue').trigger('click')
    await w.find('button[data-action="download"]').trigger('click')
    await settle()

    await panelButton(w, 'Cancel')?.trigger('click')
    expect(signal?.aborted).toBe(true)
    expect(panel(w).text()).toContain('Canceled')
  })

  it('retries only the files that failed', async () => {
    const onUpload = vi.fn()
    const w = render({ defaultFolder: 'src', onUpload })
    const good = new File(['a'], 'good.txt')
    const bad = new File(['b'], 'bad.txt')
    onUpload.mockResolvedValueOnce({ failed: [{ source: bad, error: 'Quota exceeded' }] })

    const input = w.find<HTMLInputElement>('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [good, bad], configurable: true })
    await input.trigger('change')
    await settle()

    expect(panel(w).text()).toContain('Couldn’t upload 1 item')
    expect(panel(w).text()).toContain('1 of 2 failed: Quota exceeded')
    await panelButton(w, 'Retry')?.trigger('click')
    await settle()
    expect(onUpload.mock.calls[1]?.[0]).toEqual([bad])
  })

  it('rejects files over maxFileSize or outside accept, and says so', async () => {
    const onUpload = vi.fn()
    const w = render({ defaultFolder: 'src', onUpload, maxFileSize: 2, accept: '.txt' })
    const input = w.find<HTMLInputElement>('input[type="file"]')
    Object.defineProperty(input.element, 'files', {
      value: [new File(['ok'], 'ok.txt'), new File(['too big'], 'big.txt'), new File(['x'], 'image.png')],
      configurable: true,
    })
    await input.trigger('change')
    await settle()

    expect(onUpload.mock.calls[0]?.[0].map((file: File) => file.name)).toEqual(['ok.txt'])
    expect(panel(w).text()).toContain('2 files were not uploaded')
    expect(panelButton(w, 'Retry')).toBeUndefined()
  })

  it('offers Undo when a handler returns one, from the panel and Ctrl+Z', async () => {
    const undo = vi.fn()
    const onTrash = vi.fn(() => ({ message: 'Moved 1 item to trash', undo }))
    const w = render({ defaultFolder: 'src', onTrash })
    await option(w, 'src/App.vue').trigger('click')
    await press(w, 'Delete')

    // Trash needs no confirmation.
    expect(confirmDialog()).toBeNull()
    expect(onTrash).toHaveBeenCalledWith({ items: [expect.objectContaining({ id: 'src/App.vue' })] }, expect.anything())
    expect(panel(w).text()).toContain('Moved 1 item to trash')
    await panelButton(w, 'Undo')?.trigger('click')
    await settle()
    expect(undo).toHaveBeenCalledTimes(1)

    await option(w, 'src/main.ts').trigger('click')
    await press(w, 'Delete')
    await press(w, 'z', { ctrlKey: true })
    expect(undo).toHaveBeenCalledTimes(2)
  })

  it('shows operations passed in by the consumer and forwards their actions', async () => {
    const w = render({
      defaultFolder: 'src',
      operations: [
        { id: 'u1', type: 'upload', status: 'running', label: 'Uploading video.mp4', progress: 60, cancelable: true, itemIds: ['src/App.vue'] },
        { id: 'u2', type: 'upload', status: 'error', label: 'Upload failed', error: 'Offline', retryable: true },
      ],
    })
    expect(panel(w).text()).toContain('Uploading video.mp4')
    expect(option(w, 'src/App.vue').attributes('aria-busy')).toBe('true')

    await panelButton(w, 'Cancel')?.trigger('click')
    await panelButton(w, 'Retry')?.trigger('click')
    expect(w.emitted('cancel-operation')?.[0]?.[0]).toMatchObject({ id: 'u1' })
    expect(w.emitted('retry-operation')?.[0]?.[0]).toMatchObject({ id: 'u2' })
  })
})

describe('FileManager: actions', () => {
  it('only offers actions whose handlers exist, and disables them without a selection', async () => {
    const w = render({ defaultFolder: 'src', onDownload: vi.fn(), onRefresh: vi.fn() })
    expect(w.find('[data-action="upload"]').exists()).toBe(false)
    expect(w.find('[data-action="refresh"]').exists()).toBe(true)
    expect(w.find('[data-action="download"]').attributes('disabled')).toBeDefined()

    await option(w, 'src/App.vue').trigger('click')
    expect(w.find('[data-action="download"]').attributes('disabled')).toBeUndefined()
  })

  it('downloads the selection, folders included', async () => {
    const onDownload = vi.fn()
    const w = render({ onDownload })
    await option(w, 'src').trigger('click')
    await option(w, 'README.md').trigger('click', { ctrlKey: true })
    await w.find('[data-action="download"]').trigger('click')
    expect(onDownload.mock.calls[0]?.[0].items.map((item: FileManagerItem) => item.id)).toEqual(['src', 'README.md'])
  })

  it('refreshes the open folder', async () => {
    const onRefresh = vi.fn()
    const w = render({ defaultFolder: 'src', onRefresh })
    await w.find('[data-action="refresh"]').trigger('click')
    expect(onRefresh).toHaveBeenCalledWith({ folder: expect.objectContaining({ id: 'src' }) }, expect.anything())
  })

  it('selects and renames a created folder once it appears', async () => {
    const onCreateFolder = vi.fn(() => ({ rename: 'src/new' }))
    const w = render({ defaultFolder: 'src', onCreateFolder, onRename: vi.fn() })
    await w.find('[data-action="new-folder"]').trigger('click')
    await settle()

    const items = createItems()
    items[0]?.children?.push({ id: 'src/new', name: 'New folder', type: 'folder', children: [] })
    await w.setProps({ items })
    await settle(40)
    expect(option(w, 'src/new').attributes('aria-selected')).toBe('true')
    const input = w.find<HTMLInputElement>('[data-slot="file-manager-rename-input"]')
    expect(option(w, 'src/new').find('input').exists()).toBe(false)
    expect(input.exists()).toBe(true)
    expect(document.activeElement).toBe(input.element)
  })

  it('previews with Space and opens with Enter', async () => {
    const onPreview = vi.fn()
    const w = render({ defaultFolder: 'src', onPreview, view: 'list' })
    await option(w, 'src/App.vue').trigger('click')
    await press(w, ' ')
    expect(onPreview).toHaveBeenCalledWith({ item: expect.objectContaining({ id: 'src/App.vue' }) }, expect.anything())

    await press(w, 'Enter')
    expect(w.emitted('open')?.[0]?.[0]).toMatchObject({ id: 'src/App.vue' })
  })

  it('stars and unstars through the built-in context menu', async () => {
    const onFavorite = vi.fn()
    const onUnfavorite = vi.fn()
    const w = render({ defaultFolder: 'src', onFavorite, onUnfavorite, favorites: ['src/main.ts'] })
    expect(option(w, 'src/main.ts').text()).toContain('Starred')

    await option(w, 'src/App.vue').trigger('contextmenu')
    await settle()
    const menu = document.body.querySelector('[data-slot="file-manager-context-menu"]')
    const star = menu?.querySelector<HTMLElement>('[data-action="favorite"]')
    expect(star?.textContent).toContain('Add to Starred')
    star?.click()
    await settle(250)
    expect(onFavorite).toHaveBeenCalledWith({ items: [expect.objectContaining({ id: 'src/App.vue' })] }, expect.anything())

    await option(w, 'src/main.ts').trigger('contextmenu')
    await settle()
    expect(document.body.querySelector('[data-slot="file-manager-context-menu"] [data-action="unfavorite"]')).not.toBeNull()
  })
})

describe('FileManager: permissions', () => {
  it('refuses renaming, deleting and downloading what the item does not allow', async () => {
    const onRename = vi.fn()
    const onDelete = vi.fn()
    const onDownload = vi.fn()
    const w = render({ defaultFolder: 'src', onRename, onDelete, onDownload })
    await option(w, 'src/locked.ts').trigger('click')

    await press(w, 'F2')
    await settle(40)
    expect(w.find('[data-slot="file-manager-rename-input"]').exists()).toBe(false)
    await press(w, 'Delete')
    expect(confirmDialog()).toBeNull()
    expect(w.find('[data-action="download"]').attributes('disabled')).toBeDefined()
  })

  it('makes read-only folders refuse uploads and new items', async () => {
    const w = render({ defaultFolder: 'readonly', onUpload: vi.fn(), onCreateFolder: vi.fn() })
    expect(w.find('[data-action="new-folder"]').attributes('disabled')).toBeDefined()
    expect(w.find('[data-action="upload"]').attributes('disabled')).toBeDefined()
    expect(w.find('[data-slot="file-manager-dropzone"]').exists()).toBe(false)
  })

  it('hides every change with `readonly`', () => {
    const w = render({ readonly: true, onUpload: vi.fn(), onCreateFolder: vi.fn(), onDownload: vi.fn() })
    expect(w.find('[data-action="upload"]').exists()).toBe(false)
    expect(w.find('[data-action="new-folder"]').exists()).toBe(false)
    // Reading is still fine.
    expect(w.find('[data-action="download"]').exists()).toBe(true)
  })
})

describe('FileManager: trash', () => {
  const trashListing = {
    trash: true,
    items: [{ id: 'old.txt', name: 'old.txt', type: 'file' as const, trashed: true }],
  }

  it('restores, deletes permanently after confirmation, and empties the trash', async () => {
    const onRestore = vi.fn()
    const onDeletePermanently = vi.fn()
    const onEmptyTrash = vi.fn()
    const w = render({ listing: trashListing, location: 'trash', onRestore, onDeletePermanently, onEmptyTrash, locations: [{ locations: [{ id: 'trash', label: 'Trash', trash: true }] }] })
    expect(w.find('nav[aria-label="Folder path"]').text()).toContain('Trash')

    await option(w, 'old.txt').trigger('click')
    await press(w, 'Delete')
    expect(confirmDialog()?.textContent).toContain('Permanently delete “old.txt”?')
    confirmButton('Delete permanently')?.click()
    await settle()
    expect(onDeletePermanently).toHaveBeenCalledWith({ items: [expect.objectContaining({ id: 'old.txt' })] }, expect.anything())

    await w.find('[data-action="empty-trash"]').trigger('click')
    await settle()
    expect(confirmDialog()?.textContent).toContain('Empty the trash?')
    confirmButton('Empty Trash')?.click()
    await settle()
    expect(onEmptyTrash).toHaveBeenCalledTimes(1)
  })
})

describe('FileManager: lazy loading', () => {
  it('loads an unloaded folder when it is opened, shows errors, and retries', async () => {
    const onLoadChildren = vi.fn()
      .mockRejectedValueOnce(new Error('Permission denied'))
      .mockResolvedValueOnce(undefined)
    const w = render({ onLoadChildren })
    await open(w, 'lazy')

    expect(onLoadChildren).toHaveBeenCalledWith(expect.objectContaining({ id: 'lazy' }), expect.anything())
    expect(content(w).find('[role="alert"]').text()).toContain('Permission denied')

    await content(w).findAll('button').find(el => el.text() === 'Retry')?.trigger('click')
    await settle()
    expect(onLoadChildren).toHaveBeenCalledTimes(2)

    const items = createItems()
    const lazy = items.find(item => item.id === 'lazy')
    if (lazy) lazy.children = [{ id: 'lazy/a.txt', name: 'a.txt', type: 'file' }]
    await w.setProps({ items })
    expect(optionIds(w)).toEqual(['lazy/a.txt'])
  })

  it('shows a loading state while children load', async () => {
    const pending = deferred()
    const w = render({ onLoadChildren: () => pending.promise })
    await open(w, 'lazy')
    expect(content(w).attributes('aria-busy')).toBe('true')
    pending.resolve()
    await settle()
    expect(content(w).attributes('aria-busy')).toBeUndefined()
  })

  it('loads the next page of a folder', async () => {
    const onLoadMore = vi.fn()
    const items = createItems()
    const src = items[0]
    if (src) Object.assign(src, { hasMore: true, cursor: 'page-2' })
    const w = render({ items, defaultFolder: 'src', onLoadMore })
    await content(w).findAll('button').find(el => el.text() === 'Load more')?.trigger('click')
    await settle()
    expect(onLoadMore).toHaveBeenCalledWith({ folder: expect.objectContaining({ id: 'src' }), cursor: 'page-2' }, expect.anything())
  })
})

describe('FileManager: remote search and listings', () => {
  it('searches on the server and shows the listing it returns', async () => {
    const onSearch = vi.fn()
    const w = render({ remoteSearch: true, searchDebounce: 0, onSearch })
    await w.find('input[role="searchbox"]').setValue('app')
    await settle()
    expect(onSearch).toHaveBeenCalledWith({ query: 'app', folder: null }, expect.anything())

    await w.setProps({ listing: { label: 'Results for “app”', items: [{ id: 'hit', name: 'App.vue', type: 'file' }] } })
    expect(optionIds(w)).toEqual(['hit'])
    expect(w.find('nav[aria-label="Folder path"]').text()).toContain('Results for “app”')
  })

  it('shows a search error with Retry', async () => {
    const onSearch = vi.fn().mockRejectedValueOnce(new Error('Search is down')).mockResolvedValue(undefined)
    const w = render({ remoteSearch: true, searchDebounce: 0, onSearch })
    await w.find('input[role="searchbox"]').setValue('x')
    await settle()
    expect(content(w).find('[role="alert"]').text()).toContain('Search is down')
    await content(w).findAll('button').find(el => el.text() === 'Retry')?.trigger('click')
    await settle()
    expect(onSearch).toHaveBeenCalledTimes(2)
  })

  it('switches between sidebar locations and folders', async () => {
    const w = render({
      locations: [{ label: 'Quick access', locations: [{ id: 'home', label: 'Home', folder: null }, { id: 'recent', label: 'Recent' }] }],
    })
    await w.find('[data-location="recent"]').trigger('click')
    expect(w.emitted('update:location')?.at(-1)?.[0]).toBe('recent')
    expect(w.find('[data-location="recent"]').attributes('aria-current')).toBe('page')

    await w.find('[data-location="home"]').trigger('click')
    expect(w.emitted('update:location')?.at(-1)?.[0]).toBeNull()
  })
})

describe('FileManager: focus and accessibility', () => {
  it('moves focus to the neighbour after a delete', async () => {
    const onDelete = vi.fn()
    const w = render({ defaultFolder: 'src', onDelete, confirmDelete: false, view: 'list' })
    await option(w, 'src/App.vue').trigger('click')
    ;(option(w, 'src/App.vue').element as HTMLElement).focus()
    await press(w, 'Delete')
    expect(document.activeElement?.getAttribute('data-item-id')).toBe('src/locked.ts')
  })

  it('returns focus to the renamed item', async () => {
    const w = render({ defaultFolder: 'src', onRename: vi.fn(), defaultSelected: ['src/main.ts'] })
    await press(w, 'F2')
    await settle(40)
    await w.find('[data-slot="file-manager-rename-input"]').trigger('keydown', { key: 'Escape' })
    await settle()
    expect(document.activeElement?.getAttribute('data-item-id')).toBe('src/main.ts')
  })

  it('announces status changes once, politely, and failures assertively', async () => {
    const w = render({ operations: [] })
    const polite = () => w.find('[aria-live="polite"][aria-atomic="true"]').text()
    const assertive = () => w.find('[role="alert"][aria-atomic="true"]').text()
    expect([polite(), assertive()]).toEqual(['', ''])

    await w.setProps({ operations: [{ id: 'x', type: 'copy', status: 'running', progress: 25, label: 'Copying 2 items…' }] })
    await flushPromises()
    expect(polite()).toBe('Copying 2 items…')
    const bar = panel(w).find('[role="progressbar"]')
    expect([bar.attributes('aria-valuemin'), bar.attributes('aria-valuemax'), bar.attributes('aria-valuenow')]).toEqual(['0', '100', '25'])

    await w.setProps({ operations: [{ id: 'x', type: 'copy', status: 'error', label: 'Couldn’t copy 2 items', error: 'Disk full' }] })
    await flushPromises()
    expect(assertive()).toBe('Couldn’t copy 2 items: Disk full')
    // The list itself is not a live region: nothing is read twice.
    expect(panel(w).find('ul').attributes('aria-live')).toBeUndefined()
  })

  it('translates through `messages`', () => {
    const w = render({
      defaultFolder: 'src',
      onCreateFolder: vi.fn(),
      messages: { newFolder: 'Nouveau dossier', items: count => `${count} éléments` },
    })
    expect(w.find('[data-action="new-folder"]').text()).toContain('Nouveau dossier')
    expect(w.find('[data-slot="file-manager-status-bar"]').text()).toContain('3 éléments')
  })
})

describe('FileManager: command palette', () => {
  const palette = () => document.body.querySelector<HTMLElement>('[data-slot="file-manager-command-palette"]')
  const paletteInput = () => palette()?.querySelector<HTMLInputElement>('input')
  const commandIds = () => Array.from(palette()?.querySelectorAll('[data-command]') ?? []).map(el => el.getAttribute('data-command'))

  async function type(text: string) {
    const input = paletteInput()!
    input.value = text
    input.dispatchEvent(new Event('input'))
    await settle()
  }

  it('is off unless asked for', async () => {
    const w = render({ defaultFolder: 'src' })
    await press(w, 'k', { ctrlKey: true })
    expect(palette()).toBeNull()
  })

  it('opens on Ctrl+K, filters, and goes to a folder', async () => {
    const w = render({ defaultFolder: 'src', commandPalette: true })
    await option(w, 'src/App.vue').trigger('click')
    await press(w, 'k', { ctrlKey: true })
    await settle(20)
    expect(palette()).not.toBeNull()
    expect(commandIds()).toContain('folder:docs')

    await type('read')
    expect(commandIds()).toEqual(['folder:readonly'])
    paletteInput()!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await settle(20)
    expect(palette()).toBeNull()
    expect(w.emitted('update:folder')?.at(-1)).toEqual(['readonly'])
  })

  it('runs an action on the selection', async () => {
    const w = render({ defaultFolder: 'src', commandPalette: true, onRename: vi.fn() })
    await option(w, 'src/App.vue').trigger('click')
    ;(w.vm as unknown as { openCommandPalette: () => void }).openCommandPalette()
    await settle(20)
    await type('rena')
    expect(commandIds()).toEqual(['action:rename'])
    paletteInput()!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await settle(40)
    expect(w.find('[data-slot="file-manager-rename-input"]').exists()).toBe(true)
  })
})

describe('FileManager: API', () => {
  it('starts from defaultSort without taking over the sort', async () => {
    const w = render({ defaultFolder: 'src', defaultSort: { key: 'size', direction: 'desc' } })
    expect(optionIds(w)).toEqual(['src/App.vue', 'src/main.ts', 'src/locked.ts'])
    expect(w.emitted('update:sort')).toBeUndefined()
  })

  it('exposes focus()', async () => {
    const w = render({ defaultFolder: 'src', defaultSelected: ['src/main.ts'] })
    await option(w, 'src/main.ts').trigger('click')
    ;(document.activeElement as HTMLElement | null)?.blur()
    ;(w.vm as unknown as { focus: () => void }).focus()
    expect(document.activeElement?.getAttribute('data-item-id')).toBe('src/main.ts')
  })
})
