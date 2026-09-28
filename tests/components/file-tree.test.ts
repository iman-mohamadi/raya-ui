import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { FileCode2 } from 'lucide-vue-next'
import {
  FileTree,
  filterFileTree,
  getFileIcon,
  type FileExplorerItem,
  type FileExplorerMoveEvent,
  type FileTreeProps,
  type FileExplorerSelectEvent,
} from '@/components/raya/ui/file-explorer'

const createItems = (): FileExplorerItem<{ owner: string }>[] => [
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
          { id: 'src/components/Button.vue', name: 'Button.vue', type: 'file', data: { owner: 'ui' } },
          { id: 'src/components/Input.vue', name: 'Input.vue', type: 'file' },
        ],
      },
      {
        id: 'src/composables',
        name: 'composables',
        type: 'folder',
        children: [{ id: 'src/composables/useTheme.ts', name: 'useTheme.ts', type: 'file' }],
      },
      { id: 'src/empty', name: 'empty', type: 'folder', children: [] },
      { id: 'src/App.vue', name: 'App.vue', type: 'file' },
    ],
  },
  { id: 'README.md', name: 'README.md', type: 'file' },
  { id: 'secret.env', name: 'secret.env', type: 'file', disabled: true },
]

// `mount()` cannot infer a generic component's type argument, so tests use the `unknown` default.
type Props = FileTreeProps

let wrapper: VueWrapper | undefined

function render(props: Props = {}, slots: Record<string, unknown> = {}) {
  wrapper = mount(FileTree, {
    props: { items: createItems(), ...props },
    slots,
    attachTo: document.body,
  })
  return wrapper
}

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

const treeitem = (w: VueWrapper, id: string) => w.find(`[role="treeitem"][data-item-id="${id}"]`)
const row = (w: VueWrapper, id: string) => treeitem(w, id).find('[data-slot="file-tree-row"]')
const visibleIds = (w: VueWrapper) => w.findAll('[role="treeitem"]').map(el => el.attributes('data-item-id'))
const lastEmit = <T>(w: VueWrapper, event: string) => w.emitted<[T]>(event)?.at(-1)?.[0]

async function press(w: VueWrapper, id: string, key: string, init: KeyboardEventInit = {}) {
  await treeitem(w, id).trigger('keydown', { key, ...init })
  await settle()
}

/** Reka moves focus and mounts opened groups asynchronously. */
async function settle() {
  await flushPromises()
  await new Promise(resolve => setTimeout(resolve))
  await nextTick()
}

async function focus(w: VueWrapper, id: string) {
  await settle()
  ;(treeitem(w, id).element as HTMLElement).focus()
  await settle()
}

function focusedId() {
  const active = document.activeElement
  return active instanceof HTMLElement ? active.dataset.itemId : undefined
}

describe('FileTree: rendering', () => {
  it('renders root files and folders with tree semantics', () => {
    const w = render()

    expect(w.find('[role="tree"]').attributes('aria-label')).toBe('Files')
    expect(visibleIds(w)).toEqual(['src', 'README.md', 'secret.env'])

    const src = treeitem(w, 'src')
    expect(src.attributes('aria-level')).toBe('1')
    expect(src.attributes('aria-posinset')).toBe('1')
    expect(src.attributes('aria-setsize')).toBe('3')
    expect(src.attributes('aria-expanded')).toBe('false')
    // Files are not expandable.
    expect(treeitem(w, 'README.md').attributes('aria-expanded')).toBeUndefined()
  })

  it('renders nested folders recursively inside role="group"', () => {
    const w = render({ defaultExpanded: ['src', 'src/components'] })

    const button = treeitem(w, 'src/components/Button.vue')
    expect(button.exists()).toBe(true)
    expect(button.attributes('aria-level')).toBe('3')
    expect(button.attributes('aria-posinset')).toBe('1')
    expect(button.attributes('aria-setsize')).toBe('2')

    // The DOM mirrors the data: Button.vue lives in components' group, inside src's group.
    const componentsGroup = treeitem(w, 'src/components').find('[role="group"]')
    expect(componentsGroup.find('[data-item-id="src/components/Button.vue"]').exists()).toBe(true)
    expect(treeitem(w, 'src').find('[role="group"] [data-item-id="src/components"]').exists()).toBe(true)
  })

  it('does not render the contents of collapsed folders', () => {
    const w = render()
    expect(treeitem(w, 'src/components').exists()).toBe(false)
  })

  it('shows the default file icons and allows a custom resolver', () => {
    expect(getFileIcon({ id: 'a', name: 'a.png', type: 'file' }, { expanded: false }))
      .not.toBe(getFileIcon({ id: 'b', name: 'b.txt', type: 'file' }, { expanded: false }))

    const w = render({ getIcon: item => (item.name.endsWith('.md') ? FileCode2 : undefined) })
    expect(w.findComponent(FileCode2).exists()).toBe(true)
  })
})

describe('FileTree: expansion', () => {
  it('expands and collapses a folder on click', async () => {
    const w = render()

    await row(w, 'src').trigger('click')
    expect(lastEmit(w, 'update:expanded')).toEqual(['src'])
    expect(treeitem(w, 'src').attributes('aria-expanded')).toBe('true')
    expect(treeitem(w, 'src/components').exists()).toBe(true)

    await row(w, 'src').trigger('click')
    expect(lastEmit(w, 'update:expanded')).toEqual([])
    expect(treeitem(w, 'src').attributes('aria-expanded')).toBe('false')
  })

  it('keeps several nested folders open at once', async () => {
    const w = render()
    await row(w, 'src').trigger('click')
    await row(w, 'src/components').trigger('click')
    await row(w, 'src/composables').trigger('click')

    expect(lastEmit(w, 'update:expanded')).toEqual(['src', 'src/components', 'src/composables'])
    expect(treeitem(w, 'src/composables/useTheme.ts').exists()).toBe(true)
    expect(treeitem(w, 'src/components/Input.vue').exists()).toBe(true)
  })

  it('supports empty folders', async () => {
    const w = render({ defaultExpanded: ['src'] })
    await row(w, 'src/empty').trigger('click')
    expect(treeitem(w, 'src/empty').attributes('aria-expanded')).toBe('true')
    expect(treeitem(w, 'src/empty').findAll('[role="treeitem"]')).toHaveLength(0)
  })

  it('toggles from the chevron without changing the selection', async () => {
    const w = render({ defaultSelected: ['README.md'] })
    await treeitem(w, 'src').find('[data-slot="file-tree-chevron"]').trigger('click')

    expect(lastEmit(w, 'update:expanded')).toEqual(['src'])
    expect(w.emitted('update:selected')).toBeUndefined()
    expect(treeitem(w, 'README.md').attributes('aria-selected')).toBe('true')
  })

  it('follows a controlled `expanded` prop', async () => {
    const w = render({ expanded: [] })
    expect(treeitem(w, 'src/components').exists()).toBe(false)

    await w.setProps({ expanded: ['src', 'src/components'] })
    await settle()
    expect(treeitem(w, 'src/components/Button.vue').exists()).toBe(true)
  })
})

describe('FileTree: selection', () => {
  it('selects a file on click and emits the item', async () => {
    const w = render()
    await row(w, 'README.md').trigger('click')

    expect(lastEmit(w, 'update:selected')).toEqual(['README.md'])
    expect(treeitem(w, 'README.md').attributes('aria-selected')).toBe('true')
    expect(lastEmit<FileExplorerSelectEvent>(w, 'select')?.item.id).toBe('README.md')
  })

  it('selects a folder on click', async () => {
    const w = render()
    await row(w, 'src').trigger('click')
    expect(lastEmit(w, 'update:selected')).toEqual(['src'])
    expect(treeitem(w, 'src').attributes('aria-selected')).toBe('true')
  })

  it('replaces the selection in single mode, even with modifiers', async () => {
    const w = render()
    await row(w, 'README.md').trigger('click')
    await row(w, 'src').trigger('click', { ctrlKey: true })

    expect(lastEmit(w, 'update:selected')).toEqual(['src'])
    expect(w.find('[role="tree"]').attributes('aria-multiselectable')).toBeUndefined()
  })

  it('adds with Ctrl/Cmd-click and selects ranges with Shift-click when `multiple`', async () => {
    const w = render({ multiple: true, defaultExpanded: ['src'] })
    expect(w.find('[role="tree"]').attributes('aria-multiselectable')).toBe('true')

    await row(w, 'src/components').trigger('click', { ctrlKey: true })
    await row(w, 'src/App.vue').trigger('click', { metaKey: true })
    expect(lastEmit(w, 'update:selected')).toEqual(['src/components', 'src/App.vue'])

    // Modifier clicks select folders without toggling them.
    expect(treeitem(w, 'src/components').attributes('aria-expanded')).toBe('false')

    await row(w, 'src/App.vue').trigger('click', { ctrlKey: true })
    expect(lastEmit(w, 'update:selected')).toEqual(['src/components'])

    // A plain click sets the anchor; Shift-click selects everything visible up to the target.
    await row(w, 'src/components').trigger('click', { ctrlKey: true })
    await row(w, 'src/components').trigger('click', { metaKey: true })
    await row(w, 'README.md').trigger('click', { shiftKey: true })
    expect(lastEmit(w, 'update:selected')).toEqual([
      'src/components',
      'src/composables',
      'src/empty',
      'src/App.vue',
      'README.md',
    ])
  })

  it('follows a controlled `selected` prop', async () => {
    const w = render({ selected: ['README.md'] })
    expect(treeitem(w, 'README.md').attributes('aria-selected')).toBe('true')

    await w.setProps({ selected: ['src'] })
    expect(treeitem(w, 'README.md').attributes('aria-selected')).toBe('false')
    expect(treeitem(w, 'src').attributes('aria-selected')).toBe('true')
  })

  it('ignores disabled items', async () => {
    const w = render()
    const secret = treeitem(w, 'secret.env')
    expect(secret.attributes('aria-disabled')).toBe('true')

    await row(w, 'secret.env').trigger('click')
    expect(w.emitted('update:selected')).toBeUndefined()
    expect(secret.attributes('aria-selected')).toBe('false')
  })

  it('selects nothing when the whole explorer is disabled', async () => {
    const w = render({ disabled: true })
    await row(w, 'README.md').trigger('click')
    expect(w.emitted('update:selected')).toBeUndefined()
  })
})

describe('FileTree: keyboard', () => {
  it('moves through visible items with ArrowUp/ArrowDown, Home and End', async () => {
    const w = render()
    await focus(w, 'src')

    await press(w, 'src', 'ArrowDown')
    expect(focusedId()).toBe('README.md')
    await press(w, 'README.md', 'ArrowUp')
    expect(focusedId()).toBe('src')
    // `secret.env` is disabled, so End lands on the last focusable item.
    await press(w, 'src', 'End')
    expect(focusedId()).toBe('README.md')
    await press(w, 'README.md', 'Home')
    expect(focusedId()).toBe('src')
  })

  it('expands with ArrowRight, then moves into the folder', async () => {
    const w = render()
    await focus(w, 'src')

    await press(w, 'src', 'ArrowRight')
    expect(lastEmit(w, 'update:expanded')).toEqual(['src'])

    await press(w, 'src', 'ArrowRight')
    expect(focusedId()).toBe('src/components')
  })

  it('moves to the parent with ArrowLeft without collapsing ancestors, then collapses', async () => {
    const w = render({ defaultExpanded: ['src', 'src/components'] })
    await focus(w, 'src/components/Button.vue')

    await press(w, 'src/components/Button.vue', 'ArrowLeft')
    expect(focusedId()).toBe('src/components')
    expect(w.emitted('update:expanded')).toBeUndefined()

    await press(w, 'src/components', 'ArrowLeft')
    expect(lastEmit(w, 'update:expanded')).toEqual(['src'])
    expect(treeitem(w, 'src').attributes('aria-expanded')).toBe('true')
  })

  it('selects and opens a file with Enter', async () => {
    const w = render()
    await press(w, 'README.md', 'Enter')

    expect(lastEmit(w, 'update:selected')).toEqual(['README.md'])
    expect(lastEmit<FileExplorerItem>(w, 'open')?.id).toBe('README.md')
  })

  it('selects and toggles a folder with Enter', async () => {
    const w = render()
    await press(w, 'src', 'Enter')

    expect(lastEmit(w, 'update:selected')).toEqual(['src'])
    expect(lastEmit(w, 'update:expanded')).toEqual(['src'])
  })

  it('toggles items in and out of the selection with Space when `multiple`', async () => {
    const w = render({ multiple: true })
    await press(w, 'src', ' ')
    await press(w, 'README.md', ' ')
    expect(lastEmit(w, 'update:selected')).toEqual(['src', 'README.md'])

    await press(w, 'src', ' ')
    expect(lastEmit(w, 'update:selected')).toEqual(['README.md'])
  })

  it('extends the selection with Shift+ArrowDown and selects all with Ctrl+A', async () => {
    const w = render({ multiple: true, defaultExpanded: ['src'] })
    await row(w, 'src').trigger('click', { ctrlKey: true })
    await focus(w, 'src')

    await press(w, 'src', 'ArrowDown', { shiftKey: true })
    expect(lastEmit(w, 'update:selected')).toEqual(['src', 'src/components'])

    await press(w, 'src/components', 'a', { ctrlKey: true })
    // Everything visible except the disabled file.
    expect(lastEmit(w, 'update:selected')).toEqual([
      'src',
      'src/components',
      'src/composables',
      'src/empty',
      'src/App.vue',
      'README.md',
    ])
  })
})

describe('FileTree: search', () => {
  it('filters by name, keeps the path to each match and opens it', async () => {
    const w = render({ search: 'button' })
    await nextTick()

    expect(visibleIds(w)).toEqual(['src', 'src/components', 'src/components/Button.vue'])
    expect(w.find('mark').text()).toBe('Button')
  })

  it('never mutates the input and restores the consumer\'s expanded state', async () => {
    const items = createItems()
    const snapshot = structuredClone(items)
    const w = render({ items, expanded: ['src'] })

    await w.setProps({ search: 'theme' })
    await settle()
    expect(visibleIds(w)).toEqual(['src', 'src/composables', 'src/composables/useTheme.ts'])
    expect(w.emitted('update:expanded')).toBeUndefined()

    await w.setProps({ search: '' })
    await settle()
    expect(visibleIds(w)).toEqual(['src', 'src/components', 'src/composables', 'src/empty', 'src/App.vue', 'README.md', 'secret.env'])
    expect(items).toEqual(snapshot)
  })

  it('renders a search field with `searchable`', async () => {
    const w = render({ searchable: true })
    const input = w.find('input[role="searchbox"]')
    await input.setValue('readme')

    expect(lastEmit(w, 'update:search')).toBe('readme')
    expect(visibleIds(w)).toEqual(['README.md'])

    await input.trigger('keydown', { key: 'Escape' })
    expect(lastEmit(w, 'update:search')).toBe('')
  })

  it('shows an empty result', async () => {
    const w = render({ search: 'nothing-matches' })
    expect(w.find('[role="tree"]').exists()).toBe(false)
    expect(w.text()).toContain('No results for “nothing-matches”')
  })

  it('keeps a folder whole when its own name matches', () => {
    const { items, revealIds } = filterFileTree(createItems(), 'components')
    expect(items[0]?.children?.[0]?.children).toHaveLength(2)
    expect(revealIds).toEqual(['src'])
  })
})

describe('FileTree: states and slots', () => {
  it('shows "No files" for an empty tree, and accepts a custom empty slot', () => {
    expect(render({ items: [] }).text()).toContain('No files')
    wrapper?.unmount()

    const w = render({ items: [] }, { empty: () => h('p', { class: 'custom-empty' }, 'Drop files here') })
    expect(w.find('.custom-empty').text()).toBe('Drop files here')
  })

  it('shows skeleton rows while loading', () => {
    const w = render({ loading: true })
    expect(w.find('[role="status"]').exists()).toBe(true)
    expect(w.find('[role="tree"]').exists()).toBe(false)
    expect(w.find('[data-slot="file-tree-viewport"]').attributes('aria-busy')).toBe('true')
  })

  it('passes typed item state to the item slots at every depth', () => {
    const w = render({ defaultExpanded: ['src', 'src/components'] }, {
      label: ({ item, depth }: { item: FileExplorerItem<{ owner: string }>, depth: number }) =>
        h('span', { class: 'custom-label' }, `${depth}:${item.name}:${item.data?.owner ?? '-'}`),
      actions: ({ item }: { item: FileExplorerItem }) => (item.type === 'file' ? h('span', { class: 'meta' }, 'file') : null),
    })

    const labels = w.findAll('.custom-label').map(el => el.text())
    expect(labels).toContain('2:Button.vue:ui')
    expect(labels).toContain('0:README.md:-')
    expect(row(w, 'src/components/Input.vue').find('.meta').exists()).toBe(true)
  })
})

describe('FileTree: rename & delete', () => {
  it('renames the focused item with F2', async () => {
    const onRename = vi.fn()
    const w = render({ onRename })
    await focus(w, 'README.md')
    await press(w, 'README.md', 'F2')
    await new Promise(resolve => setTimeout(resolve, 40))

    const input = w.find<HTMLInputElement>('[data-slot="file-explorer-rename-input"]')
    // Drawn over the item, not inside it: a treeitem must not contain an input.
    expect(treeitem(w, 'README.md').find('input').exists()).toBe(false)
    expect([input.element.selectionStart, input.element.selectionEnd]).toEqual([0, 6])
    await input.setValue('CHANGELOG.md')
    await input.trigger('keydown', { key: 'Enter' })
    expect(onRename).toHaveBeenCalledWith(expect.objectContaining({ id: 'README.md' }), 'CHANGELOG.md')
  })

  it('keeps arrow keys inside the rename input', async () => {
    const w = render({ onRename: vi.fn(), defaultExpanded: ['src'] })
    await focus(w, 'src')
    await press(w, 'src', 'F2')
    const input = w.find('[data-slot="file-explorer-rename-input"]')
    await input.trigger('keydown', { key: 'ArrowLeft' })
    await settle()
    expect(w.emitted('update:expanded')).toBeUndefined()
  })

  it('confirms before deleting', async () => {
    const onDelete = vi.fn()
    const w = render({ onDelete })
    await focus(w, 'README.md')
    await press(w, 'README.md', 'Delete')

    const confirm = Array.from(document.body.querySelectorAll('[data-slot="file-explorer-delete-dialog"] button'))
      .find(button => button.textContent?.trim() === 'Delete')
    expect(confirm).toBeDefined()
    ;(confirm as HTMLElement).click()
    await settle()
    expect(onDelete).toHaveBeenCalledWith([expect.objectContaining({ id: 'README.md' })])
  })
})

describe('FileTree: drag and drop', () => {
  function dataTransfer() {
    const data = new Map<string, string>()
    return {
      effectAllowed: 'none',
      dropEffect: 'none',
      setData: (type: string, value: string) => data.set(type, value),
      getData: (type: string) => data.get(type) ?? '',
    }
  }

  it('reports a move into a folder', async () => {
    const w = render({ draggable: true, defaultExpanded: ['src'] })
    const transfer = dataTransfer()

    expect(row(w, 'README.md').attributes('draggable')).toBe('true')
    await row(w, 'README.md').trigger('dragstart', { dataTransfer: transfer })
    await row(w, 'src/components').trigger('dragover', { dataTransfer: transfer })
    expect(row(w, 'src/components').attributes('data-drop-target')).toBe('')

    await row(w, 'src/components').trigger('drop', { dataTransfer: transfer })
    const move = lastEmit<FileExplorerMoveEvent>(w, 'move')
    expect(move?.items.map(item => item.id)).toEqual(['README.md'])
    expect(move?.target?.id).toBe('src/components')
  })

  it('refuses to drop a folder into itself or its descendants', async () => {
    const w = render({ draggable: true, defaultExpanded: ['src', 'src/components'] })
    const transfer = dataTransfer()

    await row(w, 'src').trigger('dragstart', { dataTransfer: transfer })
    await row(w, 'src/components/Button.vue').trigger('dragover', { dataTransfer: transfer })
    await row(w, 'src/components/Button.vue').trigger('drop', { dataTransfer: transfer })

    expect(w.emitted('move')).toBeUndefined()
  })

  it('is off unless `draggable` is set', () => {
    const w = render()
    expect(row(w, 'README.md').attributes('draggable')).toBeUndefined()
  })
})
