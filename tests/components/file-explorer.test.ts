import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import {
  FileExplorer,
  formatBytes,
  formatRelativeTime,
  getFileKind,
  sortFileItems,
  type FileExplorerItem,
  type FileExplorerMoveEvent,
  type FileExplorerProps,
} from '@/components/raya/ui/file-explorer'

const createItems = (): FileExplorerItem[] => [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: 'src/components',
        name: 'components',
        type: 'folder',
        children: [
          { id: 'src/components/Button.vue', name: 'Button.vue', type: 'file', size: 2048 },
          { id: 'src/components/Input.vue', name: 'Input.vue', type: 'file', size: 1024 },
        ],
      },
      { id: 'src/composables', name: 'composables', type: 'folder', children: [] },
      { id: 'src/App.vue', name: 'App.vue', type: 'file', size: 1000, mimeType: 'text/x-vue' },
    ],
  },
  { id: 'README.md', name: 'README.md', type: 'file', size: 3000 },
  { id: 'locked.txt', name: 'locked.txt', type: 'file', disabled: true },
]

let wrapper: VueWrapper | undefined

function render(props: FileExplorerProps = {}) {
  wrapper = mount(FileExplorer, {
    props: { items: createItems(), ...props },
    attachTo: document.body,
  })
  return wrapper
}

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

async function settle() {
  await flushPromises()
  await new Promise(resolve => setTimeout(resolve))
  await nextTick()
}

const content = (w: VueWrapper) => w.find('[data-slot="file-explorer-content"]')
const option = (w: VueWrapper, id: string) => content(w).find(`[role="option"][data-item-id="${id}"]`)
const optionIds = (w: VueWrapper) => content(w).findAll('[role="option"]').map(el => el.attributes('data-item-id'))
const lastEmit = <T>(w: VueWrapper, event: string) => w.emitted<[T]>(event)?.at(-1)?.[0]
const statusBar = (w: VueWrapper) => w.find('[data-slot="file-explorer-status-bar"]')
const crumbs = (w: VueWrapper) => w.findAll('nav[aria-label="Folder path"] li:not([aria-hidden])').map(el => el.text())

/** The rename input focuses on the next animation frame. */
async function settleFrame() {
  await settle()
  await new Promise(resolve => setTimeout(resolve, 40))
  await nextTick()
}

const renameInput = (w: VueWrapper) => w.find<HTMLInputElement>('[data-slot="file-explorer-rename-input"]')
const dialog = () => document.body.querySelector<HTMLElement>('[data-slot="file-explorer-delete-dialog"]')
const dialogButton = (label: string) =>
  Array.from(dialog()?.querySelectorAll('button') ?? []).find(button => button.textContent?.trim() === label)

async function press(w: VueWrapper, key: string, init: KeyboardEventInit = {}) {
  await content(w).trigger('keydown', { key, ...init })
  await settle()
}

describe('FileExplorer: browsing', () => {
  it('shows the root as cards in a listbox, folders first', () => {
    const w = render()
    expect(content(w).find('[role="listbox"]').attributes('aria-label')).toBe('Files')
    expect(optionIds(w)).toEqual(['src', 'locked.txt', 'README.md'])
    expect(crumbs(w)).toEqual(['root'])
    expect(option(w, 'src').text()).toContain('3 items')
  })

  it('opens a folder on double-click and updates the breadcrumbs', async () => {
    const w = render()
    await option(w, 'src').trigger('dblclick')
    await settle()

    expect(lastEmit(w, 'update:folder')).toBe('src')
    expect(optionIds(w)).toEqual(['src/components', 'src/composables', 'src/App.vue'])
    expect(crumbs(w)).toEqual(['root', 'src'])
    expect(w.find('[aria-current="page"]').text()).toBe('src')
  })

  it('navigates with Enter, and Backspace goes up selecting the folder it left', async () => {
    const w = render({ view: 'list' })
    await option(w, 'src').trigger('click')
    await press(w, 'Enter')
    expect(lastEmit(w, 'update:folder')).toBe('src')

    await press(w, 'Backspace')
    expect(lastEmit(w, 'update:folder')).toBe(null)
    expect(option(w, 'src').attributes('aria-selected')).toBe('true')
  })

  it('goes back, forward and up from the toolbar', async () => {
    const w = render({ defaultFolder: 'src' })
    await option(w, 'src/components').trigger('dblclick')
    await settle()
    expect(crumbs(w)).toEqual(['root', 'src', 'components'])

    await w.find('button[aria-label="Back"]').trigger('click')
    await settle()
    expect(lastEmit(w, 'update:folder')).toBe('src')

    await w.find('button[aria-label="Forward"]').trigger('click')
    await settle()
    expect(lastEmit(w, 'update:folder')).toBe('src/components')

    await w.find('button[aria-label="Up to parent folder"]').trigger('click')
    await settle()
    expect(lastEmit(w, 'update:folder')).toBe('src')
  })

  it('navigates from a breadcrumb', async () => {
    const w = render({ defaultFolder: 'src/components' })
    const root = w.findAll('nav[aria-label="Folder path"] button').find(el => el.text() === 'root')
    await root?.trigger('click')
    await settle()
    expect(lastEmit(w, 'update:folder')).toBe(null)
  })

  it('follows a controlled `folder` prop and falls back to the root for unknown ids', async () => {
    const w = render({ folder: 'src' })
    expect(optionIds(w)).toContain('src/App.vue')

    await w.setProps({ folder: 'does-not-exist' })
    expect(optionIds(w)).toEqual(['src', 'locked.txt', 'README.md'])
  })

  it('shows only folders in the directory tree and navigates from it', async () => {
    const w = render()
    const sidebar = w.find('[data-slot="file-explorer-sidebar"]')
    expect(sidebar.find('[data-item-id="README.md"]').exists()).toBe(false)

    await sidebar.find('[data-item-id="src"] [data-slot="file-tree-row"]').trigger('click')
    await settle()
    expect(lastEmit(w, 'update:folder')).toBe('src')
    // The tree reveals the open folder's subfolders; empty ones are leaves without a chevron.
    const composables = sidebar.find('[data-item-id="src/composables"]')
    expect(composables.exists()).toBe(true)
    expect(composables.attributes('aria-expanded')).toBeUndefined()
  })

  it('filters the open folder by name', async () => {
    const w = render({ defaultFolder: 'src' })
    await w.find('input[aria-label="Filter files"]').setValue('app')
    expect(optionIds(w)).toEqual(['src/App.vue'])

    await w.find('input[aria-label="Filter files"]').setValue('zzz')
    expect(content(w).text()).toContain('No items match “zzz”')
  })
})

describe('FileExplorer: selection', () => {
  it('selects with click, Ctrl-click and Shift-click, and clears on empty space', async () => {
    const w = render({ defaultFolder: 'src' })

    await option(w, 'src/components').trigger('click')
    expect(lastEmit(w, 'update:selected')).toEqual(['src/components'])

    await option(w, 'src/App.vue').trigger('click', { ctrlKey: true })
    expect(lastEmit(w, 'update:selected')).toEqual(['src/components', 'src/App.vue'])
    expect(statusBar(w).text()).toContain('2 items selected')

    await option(w, 'src/components').trigger('click')
    await option(w, 'src/App.vue').trigger('click', { shiftKey: true })
    expect(lastEmit(w, 'update:selected')).toEqual(['src/components', 'src/composables', 'src/App.vue'])

    await content(w).trigger('click')
    expect(lastEmit(w, 'update:selected')).toEqual([])
  })

  it('describes a single selected file in the status bar and sidebar', async () => {
    const w = render({ defaultFolder: 'src' })
    await option(w, 'src/App.vue').trigger('click')

    expect(statusBar(w).text()).toContain('App.vue')
    expect(statusBar(w).text()).toContain('1000 B, text/x-vue')
    expect(w.find('[data-slot="file-explorer-sidebar"]').text()).toContain('1000 B selected')
  })

  it('keeps a single selection without `multiple`', async () => {
    const w = render({ defaultFolder: 'src', multiple: false })
    await option(w, 'src/components').trigger('click')
    await option(w, 'src/App.vue').trigger('click', { ctrlKey: true })
    expect(lastEmit(w, 'update:selected')).toEqual(['src/App.vue'])
    expect(content(w).find('[role="listbox"]').attributes('aria-multiselectable')).toBeUndefined()
  })

  it('does not select disabled items', async () => {
    const w = render()
    await option(w, 'locked.txt').trigger('click')
    expect(w.emitted('update:selected')).toBeUndefined()
    expect(option(w, 'locked.txt').attributes('aria-disabled')).toBe('true')
  })
})

describe('FileExplorer: keyboard', () => {
  it('moves and selects with arrows, extends with Shift, and selects all with Ctrl+A', async () => {
    const w = render({ defaultFolder: 'src', view: 'list' })

    await press(w, 'ArrowDown')
    expect(lastEmit(w, 'update:selected')).toEqual(['src/composables'])
    expect(document.activeElement?.getAttribute('data-item-id')).toBe('src/composables')

    await press(w, 'ArrowDown', { shiftKey: true })
    expect(lastEmit(w, 'update:selected')).toEqual(['src/composables', 'src/App.vue'])

    await press(w, 'Home')
    expect(lastEmit(w, 'update:selected')).toEqual(['src/components'])

    await press(w, 'a', { ctrlKey: true })
    expect(lastEmit(w, 'update:selected')).toEqual(['src/components', 'src/composables', 'src/App.vue'])

    await press(w, 'Escape')
    expect(lastEmit(w, 'update:selected')).toEqual([])
  })

  it('moves sideways in the grid', async () => {
    const w = render({ defaultFolder: 'src' })
    await press(w, 'ArrowRight')
    expect(lastEmit(w, 'update:selected')).toEqual(['src/composables'])
    await press(w, 'ArrowLeft')
    expect(lastEmit(w, 'update:selected')).toEqual(['src/components'])
  })

  it('jumps to a name by typing', async () => {
    const w = render({ defaultFolder: 'src', view: 'list' })
    await press(w, 'a')
    expect(lastEmit(w, 'update:selected')).toEqual(['src/App.vue'])
  })

  it('opens a file with Enter', async () => {
    const w = render({ defaultFolder: 'src', defaultSelected: ['src/App.vue'], view: 'list' })
    await press(w, 'Enter')
    expect(lastEmit<FileExplorerItem>(w, 'open')?.id).toBe('src/App.vue')
  })

})

describe('FileExplorer: views', () => {
  it('switches to the details view and sorts by column', async () => {
    const w = render({ defaultFolder: 'src/components' })
    await w.find('button[aria-label="Details view"]').trigger('click')
    expect(lastEmit(w, 'update:view')).toBe('list')
    expect(content(w).find('[data-slot="file-explorer-row"]').exists()).toBe(true)
    expect(optionIds(w)).toEqual(['src/components/Button.vue', 'src/components/Input.vue'])

    const sizeHeader = content(w).findAll('button').find(el => el.text() === 'Size')
    await sizeHeader?.trigger('click')
    expect(lastEmit(w, 'update:sort')).toEqual({ key: 'size', direction: 'asc' })
    expect(optionIds(w)).toEqual(['src/components/Input.vue', 'src/components/Button.vue'])
  })

  it('emits `open` for files on double-click and from the status bar', async () => {
    const w = render()
    await option(w, 'README.md').trigger('dblclick')
    expect(lastEmit<FileExplorerItem>(w, 'open')?.id).toBe('README.md')

    await option(w, 'README.md').trigger('click')
    const openButton = statusBar(w).findAll('button').find(el => el.text() === 'Open File')
    await openButton?.trigger('click')
    expect(w.emitted('open')).toHaveLength(2)
  })

  it('shows empty and loading states', async () => {
    const w = render({ defaultFolder: 'src/composables' })
    expect(content(w).text()).toContain('This folder is empty')

    await w.setProps({ loading: true })
    expect(content(w).find('[role="status"]').exists()).toBe(true)
    expect(content(w).attributes('aria-busy')).toBe('true')
  })
})

describe('FileExplorer: actions', () => {
  it('only shows New Folder and Upload when handlers are provided', () => {
    const w = render()
    expect(w.find('button[aria-label="Upload"]').exists()).toBe(false)
    expect(w.find('button[aria-label="New folder"]').exists()).toBe(false)
    expect(w.find('[data-slot="file-explorer-dropzone"]').exists()).toBe(false)
  })

  it('creates folders and uploads into the open folder', async () => {
    const onCreateFolder = vi.fn()
    const onUpload = vi.fn()
    const w = render({ defaultFolder: 'src', onCreateFolder, onUpload })

    await w.find('button[aria-label="New folder"]').trigger('click')
    expect(onCreateFolder).toHaveBeenCalledWith(expect.objectContaining({ id: 'src' }))
    expect(w.find('[data-slot="file-explorer-dropzone"]').exists()).toBe(true)

    const input = w.find<HTMLInputElement>('input[type="file"]')
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })
    Object.defineProperty(input.element, 'files', { value: [file], configurable: true })
    await input.trigger('change')
    expect(onUpload).toHaveBeenCalledWith([file], expect.objectContaining({ id: 'src' }))
  })

  it('reports a move when a card is dropped on a folder card', async () => {
    const w = render({ draggable: true, defaultFolder: 'src' })
    const data = new Map<string, string>()
    const dataTransfer = {
      types: [] as string[],
      effectAllowed: 'none',
      dropEffect: 'none',
      setData: (type: string, value: string) => data.set(type, value),
      getData: (type: string) => data.get(type) ?? '',
    }

    expect(option(w, 'src/App.vue').attributes('draggable')).toBe('true')
    await option(w, 'src/App.vue').trigger('dragstart', { dataTransfer })
    await option(w, 'src/components').trigger('dragover', { dataTransfer })
    expect(option(w, 'src/components').attributes('data-drop-target')).toBe('')
    await option(w, 'src/components').trigger('drop', { dataTransfer })

    const move = lastEmit<FileExplorerMoveEvent>(w, 'move')
    expect(move?.items.map(item => item.id)).toEqual(['src/App.vue'])
    expect(move?.target?.id).toBe('src/components')
  })
})

describe('FileExplorer: rename', () => {
  it('renames inline with F2 and Enter, selecting the name without its extension', async () => {
    const onRename = vi.fn()
    const w = render({ defaultFolder: 'src', onRename })
    await option(w, 'src/App.vue').trigger('click')
    await press(w, 'F2')
    await settleFrame()

    const input = renameInput(w)
    expect(input.element.value).toBe('App.vue')
    expect(document.activeElement).toBe(input.element)
    expect([input.element.selectionStart, input.element.selectionEnd]).toEqual([0, 3])

    await input.setValue('Main.vue')
    await input.trigger('keydown', { key: 'Enter' })
    expect(onRename).toHaveBeenCalledWith(expect.objectContaining({ id: 'src/App.vue' }), 'Main.vue')
    expect(renameInput(w).exists()).toBe(false)
  })

  it('cancels with Escape and ignores unchanged names', async () => {
    const onRename = vi.fn()
    const w = render({ defaultFolder: 'src', onRename, defaultSelected: ['src/components'] })
    await press(w, 'F2')
    await settleFrame()
    await renameInput(w).setValue('widgets')
    await renameInput(w).trigger('keydown', { key: 'Escape' })
    expect(renameInput(w).exists()).toBe(false)

    await press(w, 'F2')
    await settleFrame()
    await renameInput(w).trigger('keydown', { key: 'Enter' })
    expect(onRename).not.toHaveBeenCalled()
  })

  it('refuses duplicates and names rejected by `validateName`', async () => {
    const onRename = vi.fn()
    const validateName = (name: string) => (name.startsWith('.') ? 'Hidden files are not allowed.' : undefined)
    const w = render({ defaultFolder: 'src', onRename, validateName, defaultSelected: ['src/App.vue'] })
    await press(w, 'F2')
    await settleFrame()

    await renameInput(w).setValue('COMPONENTS')
    await renameInput(w).trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(document.body.querySelector('[role="alert"]')?.textContent).toContain('already exists')
    expect(renameInput(w).attributes('aria-invalid')).toBe('true')

    await renameInput(w).setValue('.env')
    await renameInput(w).trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(document.body.querySelector('[role="alert"]')?.textContent).toContain('Hidden files')
    expect(onRename).not.toHaveBeenCalled()
  })

  it('does nothing on F2 without `onRename`', async () => {
    const w = render({ defaultFolder: 'src', defaultSelected: ['src/App.vue'] })
    await press(w, 'F2')
    await settleFrame()
    expect(renameInput(w).exists()).toBe(false)
  })

  it('renames folders in the directory tree', async () => {
    const onRename = vi.fn()
    const w = render({ onRename })
    const node = w.find('[data-slot="file-explorer-sidebar"] [role="treeitem"][data-item-id="src"]')
    ;(node.element as HTMLElement).focus()
    await node.trigger('keydown', { key: 'F2' })
    await settleFrame()

    const input = node.find<HTMLInputElement>('[data-slot="file-explorer-rename-input"]')
    await input.setValue('source')
    await input.trigger('keydown', { key: 'Enter' })
    expect(onRename).toHaveBeenCalledWith(expect.objectContaining({ id: 'src' }), 'source')
  })
})

describe('FileExplorer: delete', () => {
  it('asks for confirmation before calling `onDelete`', async () => {
    const onDelete = vi.fn()
    const w = render({ defaultFolder: 'src', onDelete })
    await option(w, 'src/App.vue').trigger('click')
    await press(w, 'Delete')

    expect(dialog()?.textContent).toContain('Delete “App.vue”?')
    dialogButton('Cancel')?.click()
    await settle()
    expect(onDelete).not.toHaveBeenCalled()
    expect(dialog()).toBeNull()

    await option(w, 'src/components').trigger('click', { ctrlKey: true })
    await press(w, 'Delete')
    expect(dialog()?.textContent).toContain('Delete 2 items?')
    expect(dialog()?.textContent).toContain('including 1 folder')
    dialogButton('Delete')?.click()
    await settle()
    expect(onDelete).toHaveBeenCalledWith([
      expect.objectContaining({ id: 'src/App.vue' }),
      expect.objectContaining({ id: 'src/components' }),
    ])
  })

  it('deletes straight away with `confirmDelete: false`', async () => {
    const onDelete = vi.fn()
    const w = render({ defaultFolder: 'src', onDelete, confirmDelete: false, defaultSelected: ['src/App.vue'] })
    await press(w, 'Delete')
    expect(dialog()).toBeNull()
    expect(onDelete).toHaveBeenCalledWith([expect.objectContaining({ id: 'src/App.vue' })])
  })
})

describe('FileExplorer: utilities', () => {
  it('formats sizes and relative times', () => {
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(4300)).toBe('4.2 KB')
    expect(formatBytes(1_468_006)).toBe('1.4 MB')

    const now = new Date('2026-01-10T12:00:00Z')
    expect(formatRelativeTime(new Date('2026-01-10T11:50:00Z'), now)).toBe('10m ago')
    expect(formatRelativeTime('2026-01-10T10:00:00Z', now)).toBe('2h ago')
    expect(formatRelativeTime('2026-01-07T12:00:00Z', now)).toBe('3d ago')
    expect(formatRelativeTime(new Date('2026-01-10T11:59:50Z'), now)).toBe('just now')
  })

  it('sorts folders first and describes file types', () => {
    const sorted = sortFileItems(createItems()[0]?.children ?? [], { key: 'name', direction: 'desc' })
    expect(sorted.map(item => item.name)).toEqual(['composables', 'components', 'App.vue'])
    expect(getFileKind({ id: 'a', name: 'a.vue', type: 'file' })).toMatchObject({ label: 'Vue component', badge: 'V' })
    expect(getFileKind({ id: 'b', name: 'hero.png', type: 'file' }).label).toBe('PNG image')
    expect(getFileKind({ id: 'c', name: 'nuxt.config.ts', type: 'file' }).label).toBe('TypeScript')
  })
})
