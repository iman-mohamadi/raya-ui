import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { fitColumns, NAME_MIN_WIDTH, resolveColumns, trackMinWidth } from '@/components/raya/ui/file-manager/columns'
import {
  defaultFileManagerMessages,
  FileManager,
  type FileManagerColumn,
  type FileManagerProps,
} from '@/components/raya/ui/file-manager'

const now = () => new Date('2026-01-01T00:00:00Z')
const columns = resolveColumns(
  ['name', 'modified', 'owner', 'type', 'size'].map(key => ({ key })),
  defaultFileManagerMessages,
  now,
)
const keys = (list: { key: string }[]) => list.map(column => column.key)

describe('details view columns', () => {
  it('reads the minimum of a track', () => {
    expect(trackMinWidth('6.5rem')).toBe(6.5)
    expect(trackMinWidth('160px')).toBe(10)
    expect(trackMinWidth('minmax(8rem, 1fr)')).toBe(8)
    expect(trackMinWidth('1fr')).toBe(0)
  })

  it('keeps every column when there is room, or before the first measurement', () => {
    expect(keys(fitColumns(columns, 80, true))).toEqual(['name', 'modified', 'owner', 'type', 'size'])
    expect(keys(fitColumns(columns, 0, true))).toEqual(['name', 'modified', 'owner', 'type', 'size'])
  })

  it('drops unpinned columns from the end so the name stays readable', () => {
    // 12 name + 6.5 + 8 + 9 + 5.5 + 1.25 check + 5 gaps × 0.75 = 46: one rem short drops "type".
    expect(keys(fitColumns(columns, 45, true))).toEqual(['name', 'modified', 'owner', 'size'])
    expect(keys(fitColumns(columns, 30, true))).toEqual(['name', 'modified', 'size'])
    expect(keys(fitColumns(columns, 20, false))).toEqual(['name', 'size'])
  })

  it('never drops pinned columns', () => {
    expect(keys(fitColumns(columns, NAME_MIN_WIDTH / 2, true))).toEqual(['name', 'size'])
  })
})

// --- Resizing and reordering in the details view ----------------------------------

describe('details view: resizing and reordering columns', () => {
  const items = [
    { id: 'a.ts', name: 'a.ts', type: 'file' as const, size: 10 },
    { id: 'b.ts', name: 'b.ts', type: 'file' as const, size: 20 },
  ]
  let mounted: VueWrapper | undefined
  afterEach(() => {
    mounted?.unmount()
    mounted = undefined
    document.body.innerHTML = ''
  })

  function renderList(props: Partial<FileManagerProps> = {}) {
    mounted = mount(FileManager, {
      props: { items, defaultView: 'list', columns: ['name', 'modified', 'type', 'size'], ...props },
      attachTo: document.body,
    })
    return mounted
  }
  const header = (w: VueWrapper, key: string) => w.find(`[data-column="${key}"]`)
  const headerKeys = (w: VueWrapper) => w.findAll('[data-column]').map(cell => cell.attributes('data-column'))
  const lastColumns = (w: VueWrapper) => (w.emitted('update:columns')?.at(-1)?.[0] ?? []) as FileManagerColumn[]

  it('resizes a column from the keyboard, and resets it', async () => {
    const w = renderList()
    const separator = header(w, 'type').find('[role="separator"]')
    expect(separator.attributes('aria-label')).toBe('Resize Type')
    // Type's default track is 9rem.
    expect(separator.attributes('aria-valuenow')).toBe('144')
    expect(header(w, 'name').find('[role="separator"]').exists()).toBe(false)

    await separator.trigger('keydown', { key: 'End' })
    expect(lastColumns(w).find(column => column.key === 'type')?.width).toBe('640px')
    await separator.trigger('keydown', { key: 'Home' })
    expect(lastColumns(w).find(column => column.key === 'type')?.width).toBe('48px')
    await separator.trigger('keydown', { key: 'Enter' })
    expect(lastColumns(w).find(column => column.key === 'type')?.width).toBeUndefined()
  })

  it('moves a column with Alt+Shift+Arrow and announces it; the name stays first', async () => {
    const w = renderList()
    await header(w, 'type').find('button').trigger('keydown', { key: 'ArrowRight', altKey: true, shiftKey: true })
    await nextTick()
    expect(lastColumns(w).map(column => column.key)).toEqual(['name', 'modified', 'size', 'type'])
    expect(headerKeys(w)).toEqual(['name', 'modified', 'size', 'type'])
    await flushPromises()
    expect(w.find('[aria-live="polite"]').text()).toContain('Type moved to position 4 of 4')

    await header(w, 'modified').find('button').trigger('keydown', { key: 'ArrowLeft', altKey: true, shiftKey: true })
    expect(headerKeys(w)[0]).toBe('name')
    expect(header(w, 'name').find('button').attributes('aria-keyshortcuts')).toBeUndefined()
  })

  it('keeps a resize when the parent passes an equal inline array again', async () => {
    const w = renderList()
    await header(w, 'type').find('[role="separator"]').trigger('keydown', { key: 'End' })
    await w.setProps({ columns: ['name', 'modified', 'type', 'size'] })
    expect(w.find('[data-slot="file-manager-content"] > div').attributes('style')).toContain('640px')
    await w.setProps({ columns: ['name', 'size'] })
    expect(headerKeys(w)).toEqual(['name', 'size'])
  })

  it('still sorts on click, and both controls can be turned off', async () => {
    const w = renderList({ resizableColumns: false, reorderableColumns: false })
    expect(w.find('[role="separator"]').exists()).toBe(false)
    await header(w, 'size').find('button').trigger('click')
    expect(w.emitted('update:sort')?.[0]?.[0]).toEqual({ key: 'size', direction: 'asc' })
    await header(w, 'size').find('button').trigger('keydown', { key: 'ArrowLeft', altKey: true, shiftKey: true })
    expect(w.emitted('update:columns')).toBeUndefined()
  })
})
