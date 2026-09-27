<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { CopyPlus, FilePlus, Link, Trash2 } from 'lucide-vue-next'
import {
  FileExplorer,
  indexFileTree,
  type FileExplorerItem,
  type FileExplorerMoveEvent,
} from '@/components/raya/ui/file-explorer'
import { CodeBlock } from '@/components/raya/ui/code-block'
import {
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from '@/components/ui/context-menu'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'File Explorer Component for Vue & Nuxt',
  description: 'An accessible, recursive file tree for Vue and Nuxt: keyboard navigation, ID-based selection, search, context menus and drag and drop, built on Reka UI.',
  ogTitle: 'File Explorer Component for Vue & Nuxt',
  ogDescription: 'An accessible, recursive file tree for Vue and Nuxt: keyboard navigation, ID-based selection, search, context menus and drag and drop, built on Reka UI.',
})

// --- Demo data -----------------------------------------------------------------

const createFiles = (): FileExplorerItem[] => [
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
          { id: 'src/components/Button.vue', name: 'Button.vue', type: 'file', size: 2_458 },
          { id: 'src/components/Dialog.vue', name: 'Dialog.vue', type: 'file', size: 6_130 },
          { id: 'src/components/Input.vue', name: 'Input.vue', type: 'file', size: 1_902 },
        ],
      },
      {
        id: 'src/composables',
        name: 'composables',
        type: 'folder',
        children: [
          { id: 'src/composables/useTheme.ts', name: 'useTheme.ts', type: 'file', size: 812 },
          { id: 'src/composables/useToast.ts', name: 'useToast.ts', type: 'file', size: 1_344 },
        ],
      },
      {
        id: 'src/assets',
        name: 'assets',
        type: 'folder',
        children: [
          { id: 'src/assets/hero.png', name: 'hero.png', type: 'file', size: 184_320 },
          { id: 'src/assets/logo.svg', name: 'logo.svg', type: 'file', size: 1_120 },
        ],
      },
      { id: 'src/App.vue', name: 'App.vue', type: 'file', size: 734 },
      { id: 'src/main.ts', name: 'main.ts', type: 'file', size: 298 },
    ],
  },
  { id: 'package.json', name: 'package.json', type: 'file', size: 1_087 },
  { id: 'README.md', name: 'README.md', type: 'file', size: 3_402 },
]

const DEFAULT_EXPANDED = ['src', 'src/components']
const DEFAULT_SELECTED = ['src/components/Button.vue']

const files = ref(createFiles())
const selected = ref<string[]>([...DEFAULT_SELECTED])
const expanded = ref<string[]>([...DEFAULT_EXPANDED])
const search = ref('')
const status = ref('')

// --- Interactive settings ------------------------------------------------------

const multiple = ref(false)
const searchable = ref(true)
const draggable = ref(true)
const guides = ref(true)
const loading = ref(false)
const size = ref<'sm' | 'md'>('md')

const toggles = [
  { label: 'Multiple selection', hint: 'Ctrl/Cmd and Shift to select several.', state: multiple },
  { label: 'Searchable', hint: 'Show the filter field.', state: searchable },
  { label: 'Drag and drop', hint: 'Move items between folders.', state: draggable },
  { label: 'Indent guides', hint: 'Lines beside nested items.', state: guides },
  { label: 'Loading', hint: 'Show skeleton rows.', state: loading },
]

const resetSettings = () => {
  multiple.value = false
  searchable.value = true
  draggable.value = true
  guides.value = true
  loading.value = false
  size.value = 'md'
  files.value = createFiles()
  selected.value = [...DEFAULT_SELECTED]
  expanded.value = [...DEFAULT_EXPANDED]
  search.value = ''
  status.value = ''
}

watch(multiple, (isMultiple) => {
  if (!isMultiple) selected.value = selected.value.slice(0, 1)
})
watch(searchable, (isSearchable) => {
  if (!isSearchable) search.value = ''
})

// --- Demo behavior: everything below is application code, not the component ---

const index = computed(() => indexFileTree(files.value))

function pathOf(id: string): string {
  const names: string[] = []
  let current: string | null = id
  while (current !== null) {
    const entry = index.value.get(current)
    if (!entry) break
    names.unshift(entry.item.name)
    current = entry.parentId
  }
  return names.join('/')
}

function sortItems(items: FileExplorerItem[]): FileExplorerItem[] {
  return [...items].sort((a, b) =>
    a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'folder' ? -1 : 1)
}

function removeItems(items: FileExplorerItem[], ids: Set<string>): FileExplorerItem[] {
  return items
    .filter(item => !ids.has(item.id))
    .map(item => (item.children ? { ...item, children: removeItems(item.children, ids) } : item))
}

function insertItems(items: FileExplorerItem[], targetId: string | null, additions: FileExplorerItem[]): FileExplorerItem[] {
  if (targetId === null) return sortItems([...items, ...additions])
  return items.map((item) => {
    if (item.id === targetId) return { ...item, children: sortItems([...(item.children ?? []), ...additions]) }
    return item.children ? { ...item, children: insertItems(item.children, targetId, additions) } : item
  })
}

function onMove({ items, target }: FileExplorerMoveEvent) {
  const ids = new Set(items.map(item => item.id))
  files.value = insertItems(removeItems(files.value, ids), target?.id ?? null, items)
  if (target && !expanded.value.includes(target.id)) expanded.value = [...expanded.value, target.id]
  status.value = `Moved ${items.length === 1 ? items[0]?.name : `${items.length} items`} to ${target ? pathOf(target.id) : 'the root'}`
}

let untitledCount = 0

function createFile(context: FileExplorerItem | null) {
  const targetId = context === null ? null : context.type === 'folder' ? context.id : index.value.get(context.id)?.parentId ?? null
  untitledCount += 1
  const file: FileExplorerItem = { id: `untitled-${untitledCount}`, name: `untitled-${untitledCount}.ts`, type: 'file', size: 0 }
  files.value = insertItems(files.value, targetId, [file])
  if (targetId && !expanded.value.includes(targetId)) expanded.value = [...expanded.value, targetId]
  selected.value = [file.id]
  status.value = `Created ${file.name}`
}

function duplicate(item: FileExplorerItem) {
  const dot = item.name.lastIndexOf('.')
  const name = dot > 0 ? `${item.name.slice(0, dot)} copy${item.name.slice(dot)}` : `${item.name} copy`
  const copy: FileExplorerItem = { ...item, id: `${item.id}-copy-${Date.now()}`, name }
  files.value = insertItems(files.value, index.value.get(item.id)?.parentId ?? null, [copy])
  status.value = `Duplicated ${item.name}`
}

async function copyPath(item: FileExplorerItem) {
  const path = pathOf(item.id)
  try {
    await navigator.clipboard.writeText(path)
    status.value = `Copied ${path}`
  }
  catch {
    status.value = path
  }
}

function remove(item: FileExplorerItem) {
  const ids = selected.value.includes(item.id) ? new Set(selected.value) : new Set([item.id])
  files.value = removeItems(files.value, ids)
  selected.value = selected.value.filter(id => !ids.has(id))
  status.value = ids.size === 1 ? `Deleted ${item.name}` : `Deleted ${ids.size} items`
}

// Delete / Backspace on a focused item (not while typing in the search field).
function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Delete' && event.key !== 'Backspace') return
  if (!(event.target instanceof HTMLElement) || event.target.getAttribute('role') !== 'treeitem') return
  const item = index.value.get(event.target.dataset.itemId ?? '')?.item
  if (!item) return
  event.preventDefault()
  remove(item)
}

function formatSize(bytes: number | undefined): string {
  if (bytes === undefined) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const selectionSummary = computed(() => {
  if (status.value) return status.value
  const items = selected.value.flatMap((id) => {
    const item = index.value.get(id)?.item
    return item ? [item] : []
  })
  if (!items.length) return 'No selection'
  if (items.length > 1) return `${items.length} items selected`
  const [item] = items
  return item?.type === 'file' ? `${pathOf(item.id)} · ${formatSize(item.size)}` : pathOf(item?.id ?? '')
})


// --- Installation --------------------------------------------------------------

const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add file-explorer'
  switch (activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add file-explorer'; break
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add file-explorer'; break
    case 'bun': cliCmd = 'bun x --bun raya-ui@latest add file-explorer'; break
  }
  return {
    cli: cliCmd,
    manual: 'npm install reka-ui lucide-vue-next @vueuse/core class-variance-authority clsx tailwind-merge',
  }
})

const fileStructure = [
  { name: 'FileExplorer.vue', note: 'root: state, search field, empty/loading, context menu' },
  { name: 'FileExplorerTree.vue', note: 'Reka TreeRoot wiring' },
  { name: 'FileExplorerNode.vue', note: 'recursive tree item' },
  { name: 'useFileExplorerSelection.ts', note: '' },
  { name: 'useFileExplorerSearch.ts', note: '' },
  { name: 'useFileExplorerDragDrop.ts', note: '' },
  { name: 'context.ts', note: '' },
  { name: 'types.ts', note: '' },
  { name: 'utils.ts', note: '' },
  { name: 'variants.ts', note: '' },
  { name: 'index.ts', note: '' },
]

// --- Live source code ------------------------------------------------------------

const codeString = computed(() => {
  const attrs = [
    'v-model:selected="selected"',
    'v-model:expanded="expanded"',
    ':items="files"',
  ]
  if (multiple.value) attrs.push('multiple')
  if (searchable.value) attrs.push('searchable')
  if (draggable.value) attrs.push('draggable')
  if (!guides.value) attrs.push(':guides="false"')
  if (size.value !== 'md') attrs.push(`size="${size.value}"`)
  if (loading.value) attrs.push('loading')
  if (draggable.value) attrs.push('@move="onMove"')
  attrs.push('class="h-80"')

  return `<script setup lang="ts">
import { ref } from 'vue'
import {
  FileExplorer,
  type FileExplorerItem,${draggable.value ? '\n  type FileExplorerMoveEvent,' : ''}
} from '@/components/ui/file-explorer'

const files = ref<FileExplorerItem[]>([
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
          { id: 'src/components/Button.vue', name: 'Button.vue', type: 'file' },
          { id: 'src/components/Dialog.vue', name: 'Dialog.vue', type: 'file' },
          { id: 'src/components/Input.vue', name: 'Input.vue', type: 'file' },
        ],
      },
      { id: 'src/App.vue', name: 'App.vue', type: 'file' },
      { id: 'src/main.ts', name: 'main.ts', type: 'file' },
    ],
  },
  { id: 'package.json', name: 'package.json', type: 'file' },
])

const selected = ref<string[]>(['src/components/Button.vue'])
const expanded = ref<string[]>(['src', 'src/components'])${draggable.value
  ? `

function onMove({ items, target }: FileExplorerMoveEvent) {
  // Update \`files\` however your app stores them (API call, store, …).
  console.log('move', items.map(i => i.id), 'into', target?.id ?? 'root')
}`
  : ''}
<\/script>

<template>
  <FileExplorer
    ${attrs.join('\n    ')}
  />
</template>`
})

// --- Usage examples ----------------------------------------------------------------

/** Renders `code` spans in the plain-text descriptions below. */
const inlineCode = (text: string) =>
  text.split('`').map((part, i) => ({ text: part, code: i % 2 === 1 }))

const examples = [
  {
    title: 'Basic usage',
    description: 'Pass a tree to `items`. Every item needs a stable, unique `id`, a `name` and a `type`. Files never need `children`; the explorer works out everything else.',
    code: `<script setup lang="ts">
import { FileExplorer, type FileExplorerItem } from '@/components/ui/file-explorer'

const files: FileExplorerItem[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    children: [
      { id: 'src/App.vue', name: 'App.vue', type: 'file' },
      { id: 'src/main.ts', name: 'main.ts', type: 'file' },
    ],
  },
  { id: 'package.json', name: 'package.json', type: 'file' },
]
<\/script>

<template>
  <FileExplorer :items="files" class="h-72" />
</template>`,
  },
  {
    title: 'Nested folders',
    description: 'Folders nest to any depth; each level is rendered by the same recursive item inside a `role="group"`. An empty folder is simply `children: []`, and `default-expanded` opens folders on first render without taking control of the state.',
    code: `<script setup lang="ts">
const files: FileExplorerItem[] = [
  {
    id: 'app',
    name: 'app',
    type: 'folder',
    children: [
      {
        id: 'app/components',
        name: 'components',
        type: 'folder',
        children: [
          {
            id: 'app/components/ui',
            name: 'ui',
            type: 'folder',
            children: [{ id: 'app/components/ui/Button.vue', name: 'Button.vue', type: 'file' }],
          },
        ],
      },
      { id: 'app/layouts', name: 'layouts', type: 'folder', children: [] },
    ],
  },
]
<\/script>

<template>
  <FileExplorer :items="files" :default-expanded="['app', 'app/components']" />
</template>`,
  },
  {
    title: 'Controlled selection',
    description: 'Selection is a list of ids, bound with `v-model:selected`. It is always an array, so the same ref works with and without `multiple`. Listen to `select` for the item that was clicked, and to `open` for files activated with Enter or a double-click.',
    code: `<script setup lang="ts">
const selected = ref<string[]>(['src/App.vue'])

function openFile(item: FileExplorerItem) {
  router.push(\`/editor/\${encodeURIComponent(item.id)}\`)
}
<\/script>

<template>
  <FileExplorer v-model:selected="selected" :items="files" @open="openFile" />
  <p>Selected: {{ selected[0] ?? 'nothing' }}</p>
</template>`,
  },
  {
    title: 'Controlled expanded state',
    description: 'Open folders are ids too, via `v-model:expanded`. Because state is keyed by id rather than object identity, it survives when you replace `items` with fresh data from a server.',
    code: `<script setup lang="ts">
const expanded = ref<string[]>(['src'])

const collapseAll = () => { expanded.value = [] }
const revealButton = () => {
  expanded.value = [...new Set([...expanded.value, 'src', 'src/components'])]
}
<\/script>

<template>
  <div class="flex gap-2">
    <Button size="sm" variant="outline" @click="collapseAll">Collapse all</Button>
    <Button size="sm" variant="outline" @click="revealButton">Reveal Button.vue</Button>
  </div>
  <FileExplorer v-model:expanded="expanded" :items="files" />
</template>`,
  },
  {
    title: 'Multiple selection',
    description: 'With `multiple`, Ctrl/Cmd-click toggles an item, Shift-click selects a range, Shift+Arrow extends it from the keyboard, Space toggles the focused item and Ctrl/Cmd+A selects everything visible.',
    code: `<script setup lang="ts">
const selected = ref<string[]>([])
<\/script>

<template>
  <FileExplorer v-model:selected="selected" :items="files" multiple />
  <p>{{ selected.length }} selected</p>
</template>`,
  },
  {
    title: 'Search',
    description: '`searchable` adds a filter field. Matching is a case-insensitive substring match on names; the folders leading to each match stay visible and open automatically, and a folder whose own name matches keeps all of its contents. The input data is never mutated, and your `expanded` state is left exactly as it was once the search is cleared. Bind `v-model:search` to drive the filter from your own input instead.',
    code: `<script setup lang="ts">
const query = ref('')
<\/script>

<template>
  <!-- Built-in field -->
  <FileExplorer :items="files" searchable search-placeholder="Go to file…" />

  <!-- Or your own input -->
  <Input v-model="query" placeholder="Filter" />
  <FileExplorer v-model:search="query" :items="files" />
</template>`,
  },
  {
    title: 'Custom icons',
    description: 'The default resolver picks a Lucide glyph from the extension (code, JSON, text, image, video, audio, archive, spreadsheet, config, lock and font files). Pass `get-icon` to override it for some items and return `undefined` for the rest, or take full control of the markup with the `#icon` slot.',
    code: `<script setup lang="ts">
import { FileCode, Palette, Braces } from 'lucide-vue-next'
import { getFileExtension, type FileExplorerIconResolver } from '@/components/ui/file-explorer'

const getIcon: FileExplorerIconResolver = (item) => {
  if (item.type === 'folder') return undefined
  if (getFileExtension(item) === 'css') return Palette
  if (item.name === 'package.json') return Braces
  return undefined
}

const tints: Record<string, string> = {
  vue: 'text-emerald-500',
  ts: 'text-sky-500',
  json: 'text-amber-500',
}
<\/script>

<template>
  <!-- A resolver -->
  <FileExplorer :items="files" :get-icon="getIcon" />

  <!-- Or a slot, e.g. to tint icons by language -->
  <FileExplorer :items="files">
    <template #icon="{ item, expanded }">
      <FileCode
        v-if="item.type === 'file'"
        class="size-4 shrink-0"
        :class="tints[getFileExtension(item)] ?? 'text-muted-foreground'"
      />
      <component :is="expanded ? FolderOpen : Folder" v-else class="size-4 shrink-0 text-muted-foreground" />
    </template>
  </FileExplorer>
</template>`,
  },
  {
    title: 'Custom item rendering',
    description: 'Every item slot receives `{ item, depth, expanded, selected, disabled }`. `#label` replaces the name (it also gets the search `query`), `#item` replaces icon and label together, and `#actions` adds trailing content. The chevron, indentation and accessibility attributes always stay in place. Rows are a `group/row`, so slot content can respond to hover. Attach your own metadata through the typed `data` field.',
    code: `<script setup lang="ts">
interface GitStatus { status?: 'modified' | 'added' }

const files: FileExplorerItem<GitStatus>[] = [
  { id: 'src/App.vue', name: 'App.vue', type: 'file', size: 734, data: { status: 'modified' } },
  { id: 'src/main.ts', name: 'main.ts', type: 'file', size: 298, data: { status: 'added' } },
]
<\/script>

<template>
  <FileExplorer :items="files">
    <template #label="{ item }">
      <span class="truncate" :class="item.data?.status === 'modified' && 'text-amber-600 dark:text-amber-400'">
        {{ item.name }}
      </span>
    </template>

    <template #actions="{ item }">
      <span class="tabular-nums opacity-0 transition-opacity group-hover/row:opacity-100">
        {{ formatBytes(item.size) }}
      </span>
      <span v-if="item.data?.status" class="font-mono text-[10px] uppercase">
        {{ item.data.status[0] }}
      </span>
    </template>
  </FileExplorer>
</template>`,
  },
  {
    title: 'Context menu',
    description: 'Provide a `#context-menu` slot and the explorer opens one Reka UI context menu on right-click (or the Menu key / Shift+F10 on the focused item). The slot receives the item that was clicked, or `null` for the empty area. Right-clicking outside the current selection selects that item first. The component ships no actions of its own; fill the menu with the shadcn-vue `ContextMenuItem`.',
    code: `<script setup lang="ts">
import { ContextMenuItem, ContextMenuSeparator } from '@/components/ui/context-menu'
<\/script>

<template>
  <FileExplorer :items="files">
    <template #context-menu="{ item }">
      <ContextMenuItem @select="createFile(item)">New file</ContextMenuItem>
      <template v-if="item">
        <ContextMenuItem @select="rename(item)">Rename</ContextMenuItem>
        <ContextMenuItem @select="copyPath(item)">Copy path</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" @select="remove(item)">Delete</ContextMenuItem>
      </template>
    </template>
  </FileExplorer>
</template>`,
  },
  {
    title: 'Drag and drop',
    description: 'With `draggable`, items can be dragged onto folders (dropping on a file targets its folder, and the empty area targets the root). Dragging a selected item drags the whole selection, and hovering a closed folder opens it. Drops into an item\'s own subtree, or into the folder it already lives in, are refused. The explorer only emits `move`: updating the data is yours.',
    code: `<script setup lang="ts">
import type { FileExplorerMoveEvent } from '@/components/ui/file-explorer'

async function onMove({ items, target }: FileExplorerMoveEvent) {
  await api.move(items.map(item => item.id), target?.id ?? null)
  files.value = await api.list()
}
<\/script>

<template>
  <FileExplorer :items="files" draggable @move="onMove" />
</template>`,
  },
  {
    title: 'Empty state',
    description: 'An empty tree shows “No files”, and a search without matches shows “No results for …”. Replace both with the `#empty` slot, which receives the active `query`.',
    code: `<template>
  <FileExplorer :items="[]">
    <template #empty="{ query }">
      <div class="flex flex-col items-center gap-2 py-10 text-sm text-muted-foreground">
        <template v-if="query">Nothing matches “{{ query }}”.</template>
        <template v-else>
          This project is empty.
          <Button size="sm" variant="outline" @click="createFile(null)">New file</Button>
        </template>
      </div>
    </template>
  </FileExplorer>
</template>`,
  },
  {
    title: 'Loading state',
    description: '`loading` replaces the tree with skeleton rows and sets `aria-busy`. Swap the placeholder with the `#loading` slot.',
    code: `<script setup lang="ts">
const { data: files, pending } = await useFetch<FileExplorerItem[]>('/api/files', { default: () => [] })
<\/script>

<template>
  <FileExplorer :items="files" :loading="pending" />
</template>`,
  },
]

// --- API reference -----------------------------------------------------------------

const props = [
  { name: 'items', type: 'FileExplorerItem<TData>[]', default: '[]', description: 'The tree to render. Never mutated.' },
  { name: 'selected', type: 'string[]', default: '—', description: 'Selected ids. Bind with v-model:selected. Always an array, even in single-selection mode.' },
  { name: 'defaultSelected', type: 'string[]', default: '[]', description: 'Initial selection when selected is not bound.' },
  { name: 'expanded', type: 'string[]', default: '—', description: 'Open folder ids. Bind with v-model:expanded.' },
  { name: 'defaultExpanded', type: 'string[]', default: '[]', description: 'Initially open folders when expanded is not bound.' },
  { name: 'search', type: 'string', default: '—', description: 'Filter query. Bind with v-model:search, or let searchable manage it.' },
  { name: 'multiple', type: 'boolean', default: 'false', description: 'Enables Ctrl/Cmd-click, Shift-click, Shift+Arrow, Space and Ctrl/Cmd+A multi-selection.' },
  { name: 'searchable', type: 'boolean', default: 'false', description: 'Renders the built-in search field.' },
  { name: 'searchPlaceholder', type: 'string', default: '"Search files…"', description: 'Placeholder and accessible name of the search field.' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Shows skeleton rows (or the loading slot) and sets aria-busy.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables every interaction.' },
  { name: 'draggable', type: 'boolean', default: 'false', description: 'Enables drag and drop. Listen to move.' },
  { name: 'getIcon', type: 'FileExplorerIconResolver<TData>', default: '—', description: 'Returns the icon component for an item. Returning undefined falls back to the default icon.' },
  { name: 'size', type: '"sm" | "md"', default: '"md"', description: 'Row height and text size.' },
  { name: 'guides', type: 'boolean', default: 'true', description: 'Draws a vertical guide line beside nested items.' },
  { name: 'label', type: 'string', default: '"Files"', description: 'Accessible name of the tree (aria-label).' },
  { name: 'class', type: 'HTMLAttributes["class"]', default: '—', description: 'Classes for the root. Give it a height to make the tree scroll.' },
]

const itemProps = [
  { name: 'id', type: 'string', description: 'Required. Stable and unique across the whole tree. Used for selection, expansion and rendering keys — never the name or an array index.' },
  { name: 'name', type: 'string', description: 'Required. The displayed label, also used for search and type-ahead.' },
  { name: 'type', type: '"file" | "folder"', description: 'Required. Folders are expandable, even when empty.' },
  { name: 'children', type: 'FileExplorerItem<TData>[]', description: 'A folder\'s contents. Omit it or pass [] for an empty folder. Ignored on files.' },
  { name: 'disabled', type: 'boolean', description: 'The item cannot be selected, toggled, dragged or dropped onto. Keyboard focus skips it.' },
  { name: 'extension', type: 'string', description: 'Overrides the extension parsed from name when choosing the default icon.' },
  { name: 'size', type: 'number', description: 'Optional metadata (bytes), available to slots.' },
  { name: 'modifiedAt', type: 'Date | string', description: 'Optional metadata, available to slots.' },
  { name: 'mimeType', type: 'string', description: 'Optional metadata, available to slots.' },
  { name: 'data', type: 'TData', description: 'Your own metadata. Its type flows into slots, events and the icon resolver.' },
]

const events = [
  { name: 'update:selected', payload: 'string[]', description: 'The selection changed.' },
  { name: 'update:expanded', payload: 'string[]', description: 'A folder was opened or closed. Not emitted for folders revealed by a search.' },
  { name: 'update:search', payload: 'string', description: 'The built-in search field changed.' },
  { name: 'select', payload: 'FileExplorerSelectEvent<TData>', description: 'The user selected an item: { item, selected, originalEvent }.' },
  { name: 'open', payload: 'FileExplorerItem<TData>', description: 'A file was activated with Enter or a double-click.' },
  { name: 'move', payload: 'FileExplorerMoveEvent<TData>', description: 'Items were dropped: { items, target }, where target is null for the root.' },
]

const slots = [
  { name: '#item', payload: '{ item, depth, expanded, selected, disabled }', description: 'Replaces the icon and label of each item.' },
  { name: '#icon', payload: '{ item, depth, expanded, selected, disabled }', description: 'Replaces the icon.' },
  { name: '#label', payload: '{ item, depth, expanded, selected, disabled, query }', description: 'Replaces the name. The default highlights search matches.' },
  { name: '#actions', payload: '{ item, depth, expanded, selected, disabled }', description: 'Trailing content, aligned to the end of the row.' },
  { name: '#context-menu', payload: '{ item: FileExplorerItem | null }', description: 'Context menu entries. Enables the menu when provided.' },
  { name: '#empty', payload: '{ query }', description: 'Shown when there is nothing to display.' },
  { name: '#loading', payload: '—', description: 'Shown while loading is true.' },
]

const keyboard = [
  { keys: ['↓', '↑'], description: 'Move focus to the next / previous visible item.' },
  { keys: ['→'], description: 'Open a closed folder; on an open folder, move to its first child.' },
  { keys: ['←'], description: 'Close an open folder; otherwise move to the parent folder.' },
  { keys: ['Home', 'End'], description: 'Move to the first / last visible item.' },
  { keys: ['Enter'], description: 'Select the item. Toggles a folder; emits open for a file.' },
  { keys: ['Space'], description: 'Select the item, or toggle it in the selection with multiple.' },
  { keys: ['Shift', '↓ / ↑'], description: 'Extend the selection (multiple).' },
  { keys: ['Ctrl / ⌘', 'A'], description: 'Select every visible item (multiple).' },
  { keys: ['a–z'], description: 'Type-ahead: focus the next item whose name starts with the typed text.' },
  { keys: ['↓'], description: 'From the search field, move into the tree. Esc clears the search.' },
]

const types = [
  { name: 'FileExplorerItem<TData>', description: 'A node of the tree.' },
  { name: 'FileExplorerItemType', description: '"file" | "folder".' },
  { name: 'FileExplorerItemState', description: '{ depth, expanded, selected, disabled }.' },
  { name: 'FileExplorerIconResolver<TData>', description: '(item, state) => Component | undefined.' },
  { name: 'FileExplorerSelectEvent<TData>', description: 'Payload of select.' },
  { name: 'FileExplorerMoveEvent<TData>', description: 'Payload of move.' },
  { name: 'FileExplorerProps / Emits / Slots', description: 'The full component contract, for wrappers.' },
  { name: 'getFileIcon(item, state)', description: 'The default icon resolver, handy to fall back to.' },
  { name: 'getFileExtension(item)', description: 'Lower-cased extension without the dot.' },
  { name: 'filterFileTree(items, query)', description: 'The search filter as a pure function: { items, revealIds }.' },
  { name: 'indexFileTree(items)', description: 'Map of id → { item, parentId, depth }, for resolving paths and parents.' },
]
</script>

<template>
  <DocContent>
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">File Explorer</span>
    </template>

    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">File Explorer</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A lightweight file tree for editors, dashboards and upload flows. Folders render recursively, state is keyed by id,
        and Reka UI's tree primitives provide the keyboard and screen reader support. You bring the data; it never
        touches a filesystem or a backend.
      </p>
    </div>

    <!-- Installation -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">Installation</h2>

      <div class="flex items-center gap-2 mb-4 border-b border-border pb-2">
        <button
          v-for="tab in ['cli', 'manual', 'css']"
          :key="tab"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize"
          :class="activeInstallTab === tab ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'"
          @click="activeInstallTab = tab"
        >
          {{ tab }}
        </button>
      </div>

      <div v-if="activeInstallTab === 'cli'" class="w-full gap-0 rounded-xl overflow-hidden border border-border bg-background">
        <div class="flex items-center px-3 h-10 border-b border-border">
          <div class="flex items-center gap-0.5 relative">
            <button
              v-for="tab in cliTabs"
              :key="tab"
              class="relative z-10 px-3 h-7 rounded-md text-sm transition-colors"
              :class="activeCliTab === tab ? 'text-foreground bg-muted' : 'text-muted-foreground hover:text-foreground'"
              @click="activeCliTab = tab"
            >
              {{ tab }}
            </button>
          </div>
        </div>
        <div class="p-1.5">
          <CodeBlock language="bash" :code="installCommands.cli" class="border-0 m-0 bg-transparent" />
        </div>
      </div>

      <div v-if="activeInstallTab === 'manual'" class="flex flex-col gap-4">
        <p class="text-sm text-muted-foreground">1. Install dependencies:</p>
        <div class="rounded-xl overflow-hidden border border-border bg-background p-1.5">
          <CodeBlock language="bash" :code="installCommands.manual" class="border-0 m-0 bg-transparent" />
        </div>
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component folder into <code>components/ui/file-explorer</code>.</p>
      </div>

      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Ready to go:</strong> colors come from your shadcn theme tokens
          (<code>accent</code>, <code>border</code>, <code>ring</code>, <code>popover</code>, <code>primary</code>).
          Folder and menu animations use the <code>tw-animate-css</code> utilities shadcn-vue projects already import.
        </div>
      </div>
    </div>

    <!-- File Structure -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">File Structure</h2>
      <p class="text-sm text-muted-foreground leading-relaxed">
        <code>FileExplorer</code> owns the state and renders <code>FileExplorerTree</code>, which renders one
        <code>FileExplorerNode</code> per root item. Each node renders its children with another
        <code>FileExplorerNode</code>, so the DOM mirrors your data. Nodes only receive their item and read shared,
        id-based state from context: no per-node watchers, no copies of your tree.
      </p>
      <div class="my-4 rounded-xl border border-border overflow-hidden bg-background">
        <div class="p-4 w-full relative font-mono text-sm text-muted-foreground">
          <div class="flex items-center gap-2 text-foreground">components/ui/file-explorer</div>
          <div class="relative ml-2 mt-1 before:absolute before:left-0 before:inset-y-0 before:w-px before:bg-border">
            <div v-for="file in fileStructure" :key="file.name" class="flex items-center gap-2 py-1 pl-4">
              <span :class="file.name.endsWith('.vue') ? 'text-pink-500' : 'text-foreground/80'">{{ file.name }}</span>
              <span v-if="file.note" class="hidden sm:inline text-xs text-muted-foreground/70 font-sans">— {{ file.note }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Usage -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">Usage</h2>

      <div v-for="example in examples" :key="example.title" class="flex flex-col mb-8">
        <h3 class="text-2xl mt-5 mb-2 text-foreground">{{ example.title }}</h3>
        <p class="text-sm text-muted-foreground leading-relaxed mb-3">
          <template v-for="(part, i) in inlineCode(example.description)" :key="i">
            <code v-if="part.code" class="text-foreground bg-muted rounded px-1 py-0.5 text-[0.8125rem]">{{ part.text }}</code>
            <template v-else>{{ part.text }}</template>
          </template>
        </p>
        <div class="rounded-xl overflow-hidden border border-border bg-background p-1.5">
          <CodeBlock language="vue" :code="example.code" class="border-0 m-0 bg-transparent" />
        </div>
      </div>
    </div>

    <!-- Keyboard -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">Keyboard Interactions</h2>
      <p class="text-sm text-muted-foreground leading-relaxed">
        The tree is a single tab stop following the WAI-ARIA tree view pattern. Items expose
        <code>role="treeitem"</code>, <code>aria-level</code>, <code>aria-setsize</code>, <code>aria-posinset</code>,
        <code>aria-expanded</code> (folders only) and <code>aria-selected</code>, nested inside
        <code>role="group"</code> lists. Folder animations respect <code>prefers-reduced-motion</code>.
      </p>
      <div class="rounded-none border-t border-border mt-6 overflow-hidden">
        <div v-for="(entry, i) in keyboard" :key="i" class="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 px-5 py-3 border-b border-border">
          <div class="w-full sm:w-44 shrink-0 flex flex-wrap gap-1">
            <kbd v-for="key in entry.keys" :key="key" class="inline-flex h-6 min-w-6 items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-xs text-foreground">{{ key }}</kbd>
          </div>
          <p class="flex-1 text-sm text-muted-foreground leading-relaxed">{{ entry.description }}</p>
        </div>
      </div>
    </div>

    <!-- CSS Variables -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">CSS Variables</h2>
      <div class="rounded-none border-t border-border overflow-hidden">
        <div class="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 px-5 py-4 border-b border-border">
          <div class="w-full sm:w-56 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">--file-explorer-indent</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <code class="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md self-start">1rem</code>
            <p class="text-sm text-muted-foreground leading-relaxed">
              Indent per nesting level. Set it on the root, e.g.
              <code>class="[--file-explorer-indent:1.25rem]"</code>. Guide lines follow automatically.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- API Reference -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">API Reference</h2>

      <h3 class="text-2xl mt-7 mb-3 text-foreground">Props</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div v-for="prop in props" :key="prop.name" class="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 px-5 py-4 border-b border-border">
          <div class="w-full sm:w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">{{ prop.name }}</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex flex-wrap items-center gap-2 min-w-0">
              <code class="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md break-all">{{ prop.type }}</code>
              <div class="flex-1" />
              <code class="text-xs font-mono text-foreground bg-muted px-2 py-0.5 rounded-md shrink-0">{{ prop.default }}</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-1">{{ prop.description }}</p>
          </div>
        </div>
      </div>

      <h3 class="text-2xl mt-8 mb-3 text-foreground">Item</h3>
      <p class="text-sm text-muted-foreground leading-relaxed mb-2">
        The shape of each entry in <code>items</code>. Only <code>id</code>, <code>name</code> and <code>type</code> are required.
      </p>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div v-for="item in itemProps" :key="item.name" class="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 px-5 py-4 border-b border-border">
          <div class="w-full sm:w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">{{ item.name }}</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <code class="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md self-start break-all">{{ item.type }}</code>
            <p class="text-sm text-muted-foreground leading-relaxed">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <h3 class="text-2xl mt-8 mb-3 text-foreground">Events</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div v-for="event in events" :key="event.name" class="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 px-5 py-4 border-b border-border">
          <div class="w-full sm:w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">{{ event.name }}</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <code class="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md self-start break-all">{{ event.payload }}</code>
            <p class="text-sm text-muted-foreground leading-relaxed">{{ event.description }}</p>
          </div>
        </div>
      </div>

      <h3 class="text-2xl mt-8 mb-3 text-foreground">Slots</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div v-for="slot in slots" :key="slot.name" class="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 px-5 py-4 border-b border-border">
          <div class="w-full sm:w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg break-all">{{ slot.name }}</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <code class="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md self-start break-all">{{ slot.payload }}</code>
            <p class="text-sm text-muted-foreground leading-relaxed">{{ slot.description }}</p>
          </div>
        </div>
      </div>

      <h3 class="text-2xl mt-8 mb-3 text-foreground">TypeScript</h3>
      <p class="text-sm text-muted-foreground leading-relaxed mb-2">
        Everything is exported from <code>@/components/ui/file-explorer</code>. The component is generic over
        <code>TData</code>, inferred from <code>items</code>, so <code>item.data</code> is typed in every slot and event.
      </p>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div v-for="type in types" :key="type.name" class="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 px-5 py-3 border-b border-border">
          <div class="w-full sm:w-64 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg break-all">{{ type.name }}</code>
          </div>
          <p class="flex-1 text-sm text-muted-foreground leading-relaxed">{{ type.description }}</p>
        </div>
      </div>
    </div>

    <!-- RIGHT PANE: Preview -->
    <template #preview>
      <div class="w-full h-full flex items-center justify-center px-4 sm:px-8 py-4 sm:py-6">
        <div class="w-full max-w-sm max-h-full flex flex-col rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
          <div class="flex shrink-0 items-center justify-between gap-2 px-3 h-10 border-b border-border">
            <span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">Explorer</span>
            <span class="text-xs text-muted-foreground font-mono">raya-app</span>
          </div>

          <FileExplorer
            v-model:selected="selected"
            v-model:expanded="expanded"
            v-model:search="search"
            :items="files"
            :multiple="multiple"
            :searchable="searchable"
            :draggable="draggable"
            :guides="guides"
            :loading="loading"
            :size="size"
            label="Project files"
            class="h-[340px] min-h-0 shrink p-2"
            @move="onMove"
            @select="status = ''"
            @keydown="onKeydown"
            @open="item => (status = `Opened ${pathOf(item.id)}`)"
          >
            <template #actions="{ item, selected: isSelected }">
              <span
                v-if="item.type === 'file'"
                class="tabular-nums opacity-0 transition-opacity group-hover/row:opacity-100"
                :class="isSelected && 'opacity-100'"
              >
                {{ formatSize(item.size) }}
              </span>
            </template>

            <template #context-menu="{ item }">
              <ContextMenuLabel v-if="item" class="max-w-48 truncate text-xs text-muted-foreground font-normal">
                {{ pathOf(item.id) }}
              </ContextMenuLabel>
              <ContextMenuItem @select="createFile(item)">
                <FilePlus />
                New file
              </ContextMenuItem>
              <template v-if="item">
                <ContextMenuItem v-if="item.type === 'file'" @select="duplicate(item)">
                  <CopyPlus />
                  Duplicate
                </ContextMenuItem>
                <ContextMenuItem @select="copyPath(item)">
                  <Link />
                  Copy path
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem variant="destructive" @select="remove(item)">
                  <Trash2 />
                  Delete
                  <ContextMenuShortcut>⌫</ContextMenuShortcut>
                </ContextMenuItem>
              </template>
            </template>
          </FileExplorer>

          <div class="flex shrink-0 items-center justify-between gap-3 px-3 h-9 border-t border-border text-xs text-muted-foreground">
            <span class="truncate" aria-live="polite">{{ selectionSummary }}</span>
            <span class="hidden sm:flex shrink-0 items-center gap-1">
              <kbd class="rounded border border-border bg-muted px-1 font-mono text-[10px]">↑↓</kbd>
              <kbd class="rounded border border-border bg-muted px-1 font-mono text-[10px]">←→</kbd>
              <kbd class="rounded border border-border bg-muted px-1 font-mono text-[10px]">↵</kbd>
            </span>
          </div>
        </div>
      </div>
    </template>

    <template #code>
      <CodeBlock language="vue" :code="codeString" class="border-0 bg-transparent m-0 p-0" />
    </template>

    <template #settings>
      <div class="flex items-center justify-between mb-6">
        <span class="font-semibold text-base text-foreground tracking-tight">Settings</span>
        <button class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" @click="resetSettings">Reset</button>
      </div>

      <div v-for="toggle in toggles" :key="toggle.label" class="flex items-center justify-between gap-4 mb-4">
        <div class="flex flex-col gap-0.5">
          <span class="text-sm font-medium text-foreground">{{ toggle.label }}</span>
          <span class="text-xs text-muted-foreground">{{ toggle.hint }}</span>
        </div>
        <button
          role="switch"
          :aria-checked="toggle.state.value"
          :aria-label="toggle.label"
          :class="['w-10 h-6 rounded-full transition-colors duration-300 relative shrink-0', toggle.state.value ? 'bg-foreground' : 'bg-muted']"
          @click="toggle.state.value = !toggle.state.value"
        >
          <div :class="['w-4 h-4 rounded-full absolute top-[4px] transition-transform duration-300', toggle.state.value ? 'translate-x-[20px] bg-background' : 'translate-x-[4px] bg-muted-foreground shadow-sm']" />
        </button>
      </div>

      <div class="flex flex-col gap-2 mt-2">
        <label for="file-explorer-size" class="text-sm font-medium text-foreground">Size</label>
        <div class="relative">
          <select id="file-explorer-size" v-model="size" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="sm">Small</option>
            <option value="md">Medium</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>
    </template>
  </DocContent>
</template>
