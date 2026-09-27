<script setup lang="ts">
/**
 * The File Explorer docs demo. Everything below the explorer is a pretend
 * server kept in memory: it waits, reports progress and fails on request, so
 * the explorer's operations, conflicts, errors, retries and undo can be seen.
 * Nothing touches a real filesystem or network.
 */
import { computed, onBeforeUnmount, ref, shallowRef } from 'vue'
import { Clock, House, Star, Trash2, X } from 'lucide-vue-next'
import {
  FileExplorer,
  formatBytes,
  indexFileTree,
  type FileExplorerConflictResolution,
  type FileExplorerItem,
  type FileExplorerListing,
  type FileExplorerLocationSection,
  type FileExplorerOperationContext,
  type FileExplorerOperationResult,
  type FileExplorerUploadContext,
  type FileExplorerView,
} from '@/components/raya/ui/file-explorer'

const props = defineProps<{
  multiple: boolean
  draggable: boolean
  sidebar: boolean
  readonly: boolean
  loading: boolean
  /** Adds latency to every mock call. */
  slow: boolean
}>()

const view = defineModel<FileExplorerView>('view', { required: true })

type Item = FileExplorerItem
type Result = FileExplorerOperationResult

// --- Demo data ---------------------------------------------------------------------

const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000)
const HOUR = 60
const DAY = 24 * HOUR

const primitives = ['Dialog.vue', 'Button.vue', 'Input.vue', 'Select.vue', 'Tabs.vue', 'Tooltip.vue', 'Popover.vue', 'Switch.vue', 'Slider.vue', 'Checkbox.vue', 'Avatar.vue', 'Badge.vue', 'Card.vue', 'Sheet.vue']
const LOG_PAGE = 12
const LOG_TOTAL = 36
const logFile = (n: number): Item => ({ id: `logs/${n}`, name: `build-${String(n).padStart(3, '0')}.log`, type: 'file', size: 2_000 + n * 97, modifiedAt: ago(n * 30), preview: `[info] build #${n} finished\n[info] 214 modules transformed` })

const createFiles = (): Item[] => [
  {
    id: 'components',
    name: 'components',
    type: 'folder',
    modifiedAt: ago(10),
    children: [
      {
        id: 'components/ui',
        name: 'ui',
        type: 'folder',
        modifiedAt: ago(10),
        children: [
          { id: 'components/ui/FileExplorer.vue', name: 'FileExplorer.vue', type: 'file', size: 4_300, mimeType: 'text/x-vue', description: 'Vue 3 SFC', modifiedAt: ago(10), owner: 'You', preview: '<template>\n  <FileExplorer v-model="active" />' },
          { id: 'components/ui/useFileSystem.ts', name: 'useFileSystem.ts', type: 'file', size: 2_867, mimeType: 'text/typescript', description: 'Composable hook', modifiedAt: ago(2 * HOUR), owner: 'You', preview: 'export const useFS = () =>\n  return { readTree }' },
          {
            id: 'components/ui/ui-primitives',
            name: 'ui-primitives',
            type: 'folder',
            description: 'Directory',
            modifiedAt: ago(DAY),
            children: primitives.map((name, i) => ({ id: `components/ui/ui-primitives/${name}`, name, type: 'file' as const, size: 900 + i * 173, modifiedAt: ago(DAY + i * 60), owner: 'Design team' })),
          },
          { id: 'components/ui/hero-banner.png', name: 'hero-banner.png', type: 'file', size: 1_468_006, mimeType: 'image/png', description: 'Raster asset', modifiedAt: ago(3 * DAY), owner: 'Design team', thumbnail: '/og-image.png' },
          { id: 'components/ui/nuxt.config.ts', name: 'nuxt.config.ts', type: 'file', size: 1_126, mimeType: 'text/typescript', description: 'Core config', modifiedAt: ago(4 * DAY), owner: 'You', preview: 'export default defineNuxtConfig({\n  devtools: { enabled: true }' },
        ],
      },
      {
        id: 'components/forms',
        name: 'forms',
        type: 'folder',
        modifiedAt: ago(9 * DAY),
        children: [
          { id: 'components/forms/FormField.vue', name: 'FormField.vue', type: 'file', size: 2_140, modifiedAt: ago(9 * DAY) },
          { id: 'components/forms/useForm.ts', name: 'useForm.ts', type: 'file', size: 1_512, modifiedAt: ago(12 * DAY), preview: 'export function useForm<T>(schema: Schema<T>) {' },
        ],
      },
    ],
  },
  {
    id: 'composables',
    name: 'composables',
    type: 'folder',
    modifiedAt: ago(3 * HOUR),
    children: [
      { id: 'composables/useTheme.ts', name: 'useTheme.ts', type: 'file', size: 812, modifiedAt: ago(3 * HOUR), preview: 'export const useTheme = () => {\n  const mode = useColorMode()' },
      { id: 'composables/useToast.ts', name: 'useToast.ts', type: 'file', size: 1_344, modifiedAt: ago(20 * DAY) },
    ],
  },
  // Loaded on demand: its children are not known until it is opened.
  { id: 'server', name: 'server', type: 'folder', modifiedAt: ago(14 * DAY), description: 'Loads on open' },
  // Paginated: the rest arrives page by page.
  { id: 'logs', name: 'logs', type: 'folder', modifiedAt: ago(30), description: `${LOG_TOTAL} files, paged`, children: Array.from({ length: LOG_PAGE }, (_, i) => logFile(i + 1)), hasMore: true, cursor: LOG_PAGE },
  {
    id: 'shared',
    name: 'shared-with-me',
    type: 'folder',
    description: 'Read only',
    modifiedAt: ago(6 * DAY),
    owner: 'Ada',
    permissions: { write: false, delete: false, rename: false, move: false },
    children: [
      { id: 'shared/brand-guide.pdf', name: 'brand-guide.pdf', type: 'file', size: 5_232_000, modifiedAt: ago(6 * DAY), owner: 'Ada', permissions: { write: false, delete: false, rename: false, move: false } },
      { id: 'shared/roadmap.xlsx', name: 'roadmap.xlsx', type: 'file', size: 48_200, modifiedAt: ago(8 * DAY), owner: 'Ada', permissions: { write: false, delete: false, rename: false, move: false, download: false } },
    ],
  },
  { id: 'package.json', name: 'package.json', type: 'file', size: 1_087, modifiedAt: ago(DAY), preview: '{\n  "name": "raya-app",' },
  { id: 'README.md', name: 'README.md', type: 'file', size: 3_402, modifiedAt: ago(8 * DAY), preview: '# Raya App\nBeautifully engineered components.' },
]

const files = ref<Item[]>(createFiles())
const trash = ref<{ item: Item, parentId: string | null }[]>([])
const favorites = ref<string[]>(['components/ui/FileExplorer.vue'])
const folder = ref<string | null>('components/ui')
const selected = ref<string[]>(['components/ui/FileExplorer.vue'])
const location = ref<string | null>(null)
const preview = shallowRef<{ item: Item, mode: 'preview' | 'properties' } | null>(null)
let failNextCall = false

// --- A pretend server ---------------------------------------------------------------

const index = computed(() => indexFileTree(files.value))
let counter = 0
const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${++counter}`
const objectUrls: string[] = []
onBeforeUnmount(() => objectUrls.forEach(url => URL.revokeObjectURL(url)))

/** Waits like a network call would, reporting progress, and fails when asked to. */
async function server(context: FileExplorerOperationContext, steps = 4) {
  const delay = props.slow ? 450 : 120
  for (let step = 1; step <= steps; step++) {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(resolve, delay)
      context.signal.addEventListener('abort', () => {
        clearTimeout(timer)
        reject(new DOMException('Canceled', 'AbortError'))
      }, { once: true })
    })
    context.progress((step / steps) * 100)
  }
  if (failNextCall) {
    failNextCall = false
    throw new Error('The mock server was told to fail this request.')
  }
}

function update(items: Item[], id: string, change: (item: Item) => Item): Item[] {
  return items.map((item) => {
    if (item.id === id) return change(item)
    return item.children ? { ...item, children: update(item.children, id, change) } : item
  })
}

function removeIds(items: Item[], ids: Set<string>): Item[] {
  return items.filter(item => !ids.has(item.id)).map(item => (item.children ? { ...item, children: removeIds(item.children, ids) } : item))
}

function insert(items: Item[], parentId: string | null, additions: Item[]): Item[] {
  if (parentId === null) return [...items, ...additions]
  return update(items, parentId, parent => ({ ...parent, children: [...(parent.children ?? []), ...additions] }))
}

/** A deep copy with fresh ids, as a server copy would produce. */
function cloneTree(item: Item, name = item.name): Item {
  const id = newId(item.type)
  return { ...item, id, name, modifiedAt: new Date(), children: item.children?.map(child => cloneTree(child)) }
}

function applyConflicts(targetId: string | null, conflicts: FileExplorerConflictResolution[]) {
  // "Replace" removes what was there; "Keep both" renames the incoming copy.
  const replaced = new Set(conflicts.filter(c => c.action === 'replace' && c.conflict.destination).map(c => c.conflict.destination?.id ?? ''))
  if (replaced.size) files.value = removeIds(files.value, replaced)
  return (item: Item) => conflicts.find(c => c.conflict.source === item && c.action === 'keep-both')?.name ?? item.name
}

const handlers = {
  async onUpload(uploaded: File[], target: Item | null, context: FileExplorerUploadContext): Promise<Result> {
    await server(context, uploaded.length + 2)
    const nameFor = (file: File) => context.conflicts.find(c => c.conflict.source === file && c.action === 'keep-both')?.name ?? file.name
    applyConflicts(target?.id ?? null, context.conflicts)
    // Files named "fail…" are rejected, to show partial failures and retry.
    const failed = uploaded.filter(file => file.name.toLowerCase().startsWith('fail'))
    const added = uploaded.filter(file => !failed.includes(file)).map((file): Item => {
      const thumbnail = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      if (thumbnail) objectUrls.push(thumbnail)
      return { id: newId('upload'), name: nameFor(file), type: 'file', size: file.size, mimeType: file.type || undefined, modifiedAt: new Date(), owner: 'You', thumbnail }
    })
    files.value = insert(files.value, target?.id ?? null, added)
    return { select: added.map(item => item.id), failed: failed.map(file => ({ source: file, error: 'Quota exceeded (demo)' })) }
  },

  async onCreateFolder(parent: Item | null, context: FileExplorerOperationContext): Promise<Result> {
    await server(context, 1)
    const siblings = new Set((parent ? parent.children ?? [] : files.value).map(item => item.name))
    let name = 'New folder'
    for (let n = 2; siblings.has(name); n++) name = `New folder (${n})`
    const created: Item = { id: newId('folder'), name, type: 'folder', children: [], modifiedAt: new Date(), owner: 'You' }
    files.value = insert(files.value, parent?.id ?? null, [created])
    return { rename: created.id }
  },

  async onCreateFile(parent: Item | null, context: FileExplorerOperationContext): Promise<Result> {
    await server(context, 1)
    const created: Item = { id: newId('file'), name: 'untitled.md', type: 'file', size: 0, modifiedAt: new Date(), owner: 'You' }
    files.value = insert(files.value, parent?.id ?? null, [created])
    return { rename: created.id }
  },

  async onRename(item: Item, name: string, context: FileExplorerOperationContext): Promise<Result> {
    await server(context, 1)
    const previous = item.name
    files.value = update(files.value, item.id, current => ({ ...current, name, modifiedAt: new Date() }))
    return { undo: () => { files.value = update(files.value, item.id, current => ({ ...current, name: previous })) } }
  },

  async onPaste(event: { items: Item[], target: Item | null, operation: 'copy' | 'cut', conflicts: FileExplorerConflictResolution[] }, context: FileExplorerOperationContext): Promise<Result> {
    await server(context, 5)
    const targetId = event.target?.id ?? null
    const nameOf = applyConflicts(targetId, event.conflicts)
    if (event.operation === 'cut') return moveItems(event.items, targetId, nameOf)
    const copies = event.items.map(item => cloneTree(item, nameOf(item)))
    files.value = insert(files.value, targetId, copies)
    const ids = new Set(copies.map(copy => copy.id))
    return { select: [...ids], message: `Copied ${copies.length} item${copies.length === 1 ? '' : 's'}`, undo: () => { files.value = removeIds(files.value, ids) } }
  },

  async onMove(event: { items: Item[], target: Item | null, conflicts?: FileExplorerConflictResolution[] }, context: FileExplorerOperationContext): Promise<Result> {
    await server(context, 3)
    const targetId = event.target?.id ?? null
    return moveItems(event.items, targetId, applyConflicts(targetId, event.conflicts ?? []))
  },

  async onDuplicate(event: { items: Item[] }, context: FileExplorerOperationContext): Promise<Result> {
    await server(context, 3)
    const copies = event.items.map((item) => {
      const dot = item.name.lastIndexOf('.')
      const name = dot > 0 ? `${item.name.slice(0, dot)} copy${item.name.slice(dot)}` : `${item.name} copy`
      const copy = cloneTree(item, name)
      files.value = insert(files.value, index.value.get(item.id)?.parentId ?? null, [copy])
      return copy
    })
    return { select: copies.map(copy => copy.id) }
  },

  async onTrash(event: { items: Item[] }, context: FileExplorerOperationContext): Promise<Result> {
    await server(context, 2)
    const entries = event.items.map(item => ({ item: { ...item, trashed: true }, parentId: index.value.get(item.id)?.parentId ?? null }))
    files.value = removeIds(files.value, new Set(event.items.map(item => item.id)))
    trash.value = [...trash.value, ...entries]
    return {
      message: `Moved ${entries.length} item${entries.length === 1 ? '' : 's'} to Trash`,
      undo: () => restoreEntries(entries.map(entry => entry.item.id)),
    }
  },

  async onRestore(event: { items: Item[] }, context: FileExplorerOperationContext): Promise<Result> {
    await server(context, 2)
    restoreEntries(event.items.map(item => item.id))
    return { message: `Restored ${event.items.length} item${event.items.length === 1 ? '' : 's'}` }
  },

  async onDeletePermanently(event: { items: Item[] }, context: FileExplorerOperationContext) {
    await server(context, 2)
    const ids = new Set(event.items.map(item => item.id))
    trash.value = trash.value.filter(entry => !ids.has(entry.item.id))
  },

  async onEmptyTrash(_: unknown, context: FileExplorerOperationContext) {
    await server(context, 2)
    trash.value = []
  },

  async onDelete(items: Item[], context: FileExplorerOperationContext) {
    await server(context, 2)
    files.value = removeIds(files.value, new Set(items.map(item => item.id)))
  },

  async onDownload(event: { items: Item[] }, context: FileExplorerOperationContext): Promise<Result> {
    await server(context, 6)
    return { message: `Prepared ${event.items.length} download${event.items.length === 1 ? '' : 's'} (nothing is saved in this demo)` }
  },

  async onRefresh(_: unknown, context: FileExplorerOperationContext) {
    await server(context, 3)
  },

  async onLoadChildren(target: Item, context: FileExplorerOperationContext) {
    await server(context, 4)
    if (target.id !== 'server') return
    files.value = update(files.value, 'server', item => ({
      ...item,
      children: [
        { id: 'server/api', name: 'api', type: 'folder', modifiedAt: ago(14 * DAY), children: [{ id: 'server/api/files.get.ts', name: 'files.get.ts', type: 'file', size: 954, modifiedAt: ago(14 * DAY), preview: 'export default defineEventHandler(async () => {' }] },
        { id: 'server/middleware.ts', name: 'middleware.ts', type: 'file', size: 611, modifiedAt: ago(15 * DAY) },
      ],
    }))
  },

  async onLoadMore(event: { folder: Item | null, cursor: unknown }, context: FileExplorerOperationContext) {
    await server(context, 3)
    const from = typeof event.cursor === 'number' ? event.cursor : 0
    const page = Array.from({ length: LOG_PAGE }, (_, i) => logFile(from + i + 1))
    const next = from + LOG_PAGE
    files.value = update(files.value, 'logs', item => ({ ...item, children: [...(item.children ?? []), ...page], cursor: next, hasMore: next < LOG_TOTAL }))
  },

  onFavorite: (event: { items: Item[] }) => { favorites.value = [...new Set([...favorites.value, ...event.items.map(item => item.id)])] },
  onUnfavorite: (event: { items: Item[] }) => {
    const ids = new Set(event.items.map(item => item.id))
    favorites.value = favorites.value.filter(id => !ids.has(id))
  },
  onPreview: (event: { item: Item }) => { preview.value = { item: event.item, mode: 'preview' } },
  onProperties: (event: { items: Item[] }) => {
    const [item] = event.items
    if (item) preview.value = { item, mode: 'properties' }
  },
  async onCopyLink(event: { items: Item[] }): Promise<Result> {
    const links = event.items.map(item => `https://files.example.com/${encodeURIComponent(item.id)}`).join('\n')
    await navigator.clipboard?.writeText(links).catch(() => {})
    return { message: 'Link copied (example.com, not a real link)' }
  },
}

function moveItems(items: Item[], targetId: string | null, nameOf: (item: Item) => string): Result {
  const origins = items.map(item => ({ id: item.id, parentId: index.value.get(item.id)?.parentId ?? null }))
  const moved = items.map(item => ({ ...item, name: nameOf(item) }))
  files.value = insert(removeIds(files.value, new Set(items.map(item => item.id))), targetId, moved)
  return {
    select: moved.map(item => item.id),
    message: `Moved ${moved.length} item${moved.length === 1 ? '' : 's'}`,
    undo: () => {
      // Put everything back where it came from.
      let tree = removeIds(files.value, new Set(moved.map(item => item.id)))
      for (const origin of origins) {
        const original = items.find(item => item.id === origin.id)
        if (original) tree = insert(tree, origin.parentId, [original])
      }
      files.value = tree
    },
  }
}

function restoreEntries(ids: string[]) {
  const restoring = trash.value.filter(entry => ids.includes(entry.item.id))
  trash.value = trash.value.filter(entry => !ids.includes(entry.item.id))
  for (const entry of restoring) {
    const parentExists = entry.parentId === null || index.value.has(entry.parentId)
    files.value = insert(files.value, parentExists ? entry.parentId : null, [{ ...entry.item, trashed: false }])
  }
}

// --- Sidebar locations ----------------------------------------------------------------

const locations = computed<FileExplorerLocationSection[]>(() => [
  {
    label: 'Quick access',
    locations: [
      { id: 'home', label: 'Home', icon: House, folder: null },
      { id: 'recent', label: 'Recent', icon: Clock },
      { id: 'starred', label: 'Starred', icon: Star, badge: favorites.value.length || undefined },
      { id: 'trash', label: 'Trash', icon: Trash2, trash: true, badge: trash.value.length || undefined },
    ],
  },
])

const allFiles = computed(() => [...index.value.values()].map(entry => entry.item).filter(item => item.type === 'file'))

const listing = computed<FileExplorerListing | null>(() => {
  switch (location.value) {
    case 'recent':
      return { items: [...allFiles.value].sort((a, b) => new Date(b.modifiedAt ?? 0).getTime() - new Date(a.modifiedAt ?? 0).getTime()).slice(0, 8) }
    case 'starred':
      return { items: favorites.value.flatMap(id => index.value.get(id)?.item ?? []) }
    case 'trash':
      return { items: trash.value.map(entry => entry.item), trash: true }
    default:
      return null
  }
})

const lastOpened = ref('')

function reset() {
  files.value = createFiles()
  trash.value = []
  favorites.value = ['components/ui/FileExplorer.vue']
  folder.value = 'components/ui'
  selected.value = ['components/ui/FileExplorer.vue']
  location.value = null
  preview.value = null
  lastOpened.value = ''
  failNextCall = false
}

defineExpose({
  reset,
  /** Makes the next mock server call fail, to show errors and Retry. */
  failNext: () => { failNextCall = true },
})
</script>

<template>
  <div class="relative flex size-full flex-col gap-2 p-3 sm:p-4">
    <FileExplorer
      v-model:folder="folder"
      v-model:selected="selected"
      v-model:view="view"
      v-model:location="location"
      :items="files"
      :listing="listing"
      :locations="locations"
      :favorites="favorites"
      :multiple="multiple"
      :draggable="draggable"
      :sidebar="sidebar"
      :readonly="readonly"
      :loading="loading"
      :columns="['name', 'modified', 'owner', 'type', 'size']"
      directory-upload
      label="Project files"
      class="min-h-0 w-full flex-1 shadow-sm"
      v-bind="handlers"
      @open="item => (lastOpened = item.name)"
    />
    <p class="h-4 shrink-0 truncate px-1 text-center font-mono text-[11px] text-muted-foreground" aria-live="polite">
      <template v-if="lastOpened">open → {{ lastOpened }}</template>
      <template v-else>Mock server in memory — try uploading a file named “fail.txt”.</template>
    </p>

    <div
      v-if="preview"
      role="dialog"
      aria-modal="false"
      :aria-label="preview.item.name"
      class="absolute inset-x-6 bottom-16 top-6 z-40 flex flex-col overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl sm:inset-x-auto sm:end-8 sm:w-80"
    >
      <div class="flex items-center gap-2 border-b border-border px-3 py-2">
        <span class="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{{ preview.mode }}</span>
        <span class="min-w-0 flex-1 truncate text-sm font-medium">{{ preview.item.name }}</span>
        <button type="button" aria-label="Close" class="rounded-sm p-1 text-muted-foreground hover:text-foreground" @click="preview = null">
          <X class="size-4" />
        </button>
      </div>
      <div class="min-h-0 flex-1 overflow-auto p-3 text-sm">
        <template v-if="preview.mode === 'preview'">
          <img v-if="preview.item.thumbnail" :src="preview.item.thumbnail" alt="" class="w-full rounded-md border border-border">
          <pre v-else-if="preview.item.preview" class="whitespace-pre-wrap rounded-md bg-muted/50 p-3 font-mono text-xs">{{ preview.item.preview }}</pre>
          <p v-else class="text-muted-foreground">No preview for this file type — the app decides what a preview is.</p>
        </template>
        <dl v-else class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
          <dt class="text-muted-foreground">Type</dt><dd>{{ preview.item.type }}</dd>
          <dt class="text-muted-foreground">Size</dt><dd>{{ formatBytes(preview.item.size) || '—' }}</dd>
          <dt class="text-muted-foreground">Owner</dt><dd>{{ preview.item.owner ?? '—' }}</dd>
          <dt class="text-muted-foreground">Modified</dt><dd>{{ preview.item.modifiedAt ? new Date(preview.item.modifiedAt).toLocaleString() : '—' }}</dd>
          <dt class="text-muted-foreground">Id</dt><dd class="break-all font-mono">{{ preview.item.id }}</dd>
        </dl>
      </div>
    </div>
  </div>
</template>
