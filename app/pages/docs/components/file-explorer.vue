<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import type { FileExplorerView } from '@/components/raya/ui/file-explorer'
import { CodeBlock } from '@/components/raya/ui/code-block'
import FileExplorerDemo from '@/components/docs/FileExplorerDemo.vue'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'File Explorer Component for Vue & Nuxt',
  description: 'A backend-agnostic file manager UI for Vue and Nuxt: directory tree, grid and details views, clipboard, conflicts, operations with progress and retry, permissions, trash, lazy loading and uploads.',
  ogTitle: 'File Explorer Component for Vue & Nuxt',
  ogDescription: 'A backend-agnostic file manager UI for Vue and Nuxt: directory tree, grid and details views, clipboard, conflicts, operations with progress and retry, permissions, trash, lazy loading and uploads.',
})

// --- Demo settings ------------------------------------------------------------------

const demo = useTemplateRef<InstanceType<typeof FileExplorerDemo>>('demo')
const view = ref<FileExplorerView>('grid')
const multiple = ref(true)
const draggable = ref(true)
const sidebar = ref(true)
const readonly = ref(false)
const slow = ref(true)
const loading = ref(false)

const toggles = [
  { label: 'Directory tree', hint: 'Sidebar with locations and folders.', state: sidebar },
  { label: 'Multiple selection', hint: 'Ctrl/Cmd, Shift and Ctrl+A.', state: multiple },
  { label: 'Drag and drop', hint: 'Move items onto folders or Trash.', state: draggable },
  { label: 'Read only', hint: 'Hides every action that changes data.', state: readonly },
  { label: 'Slow network', hint: 'Makes progress easy to watch.', state: slow },
  { label: 'Loading', hint: 'Show skeleton cards.', state: loading },
]

const resetSettings = () => {
  view.value = 'grid'
  multiple.value = true
  draggable.value = true
  sidebar.value = true
  readonly.value = false
  slow.value = true
  loading.value = false
  demo.value?.reset()
}

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
  { name: 'FileExplorer.vue', note: 'state, navigation, operations, uploads, menus, dialogs' },
  { name: 'FileExplorerToolbar.vue · FileExplorerBreadcrumbs.vue', note: 'navigation, search, sort, view, actions' },
  { name: 'FileExplorerSidebar.vue', note: 'locations + directory tree' },
  { name: 'FileExplorerContent.vue · Card.vue · Row.vue', note: 'grid and details views' },
  { name: 'FileExplorerOperations.vue', note: 'progress, errors, retry, undo' },
  { name: 'FileExplorerConflictDialog.vue · DeleteDialog.vue', note: 'replace / keep both / skip, confirmations' },
  { name: 'FileExplorerMenuItems.vue · FileIcon.vue · StatusBar.vue · RenameInput.vue', note: '' },
  { name: 'FileTree.vue · FileTreeRoot.vue · FileTreeNode.vue', note: 'recursive tree (also standalone)' },
  { name: 'useFileExplorerCommands.ts', note: 'the action registry' },
  { name: 'useFileExplorerOperations.ts · Conflicts · Loader · Actions', note: 'async, conflicts, lazy loading, rename & delete' },
  { name: 'useFileExplorerNavigation · Selection · Keyboard · DragDrop · Search · Item', note: '' },
  { name: 'messages.ts · columns.ts · context.ts · types.ts · utils.ts · variants.ts · index.ts', note: '' },
]

// --- Live source code ------------------------------------------------------------

const codeString = computed(() => `<script setup lang="ts">
import { ref } from 'vue'
import {
  FileExplorer,
  type FileExplorerItem,
  type FileExplorerOperationContext,
  type FileExplorerPasteEvent,
} from '@/components/ui/file-explorer'
import { api } from '@/lib/api' // your client — the explorer never calls it

const files = ref<FileExplorerItem[]>(await api.tree())
const folder = ref<string | null>(null)
const selected = ref<string[]>([])

// Every handler may return a promise: the explorer shows progress,
// errors with Retry, Cancel (through context.signal) and Undo.
async function onPaste(event: FileExplorerPasteEvent, context: FileExplorerOperationContext) {
  await api.paste(event, { signal: context.signal, onProgress: context.progress })
  files.value = await api.tree()
}

async function onTrash({ items }: { items: FileExplorerItem[] }) {
  await api.trash(items.map(item => item.id))
  files.value = await api.tree()
  return { message: \`Moved \${items.length} to Trash\`, undo: () => api.restore(items.map(item => item.id)) }
}
<\/script>

<template>
  <FileExplorer
    v-model:folder="folder"
    v-model:selected="selected"
    :items="files"${view.value !== 'grid' ? `\n    default-view="${view.value}"` : ''}${multiple.value ? '' : '\n    :multiple="false"'}${sidebar.value ? '' : '\n    :sidebar="false"'}${draggable.value ? '\n    draggable' : ''}${readonly.value ? '\n    readonly' : ''}${loading.value ? '\n    loading' : ''}
    directory-upload
    @upload="(files, folder, context) => api.upload(files, folder, context)"
    @create-folder="parent => api.mkdir(parent)"
    @rename="(item, name) => api.rename(item.id, name)"
    @move="event => api.move(event)"
    @paste="onPaste"
    @trash="onTrash"
    @download="({ items }) => api.download(items)"
    @refresh="async () => (files.value = await api.tree())"
    @open="item => router.push(\`/edit/\${item.id}\`)"
    class="h-[560px]"
  />
</template>`)

// --- Usage examples ----------------------------------------------------------------

/** Renders `code` spans in the plain-text descriptions below. */
const inlineCode = (text: string) =>
  text.split('`').map((part, i) => ({ text: part, code: i % 2 === 1 }))

interface Example { id: string, title: string, description: string, code: string }

const examples: Example[] = [
  {
    id: 'basic',
    title: 'Basic usage',
    description: 'Pass a nested tree to `items`. Every item needs a stable, unique `id`, a `name` and a `type`; folders hold `children`. Browsing, selection and keyboard navigation work on their own. Give the explorer a height and it fills it.',
    code: `<script setup lang="ts">
import { FileExplorer, type FileExplorerItem } from '@/components/ui/file-explorer'

const files: FileExplorerItem[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    children: [
      { id: 'src/App.vue', name: 'App.vue', type: 'file', size: 734 },
      { id: 'src/main.ts', name: 'main.ts', type: 'file', size: 298 },
    ],
  },
  { id: 'package.json', name: 'package.json', type: 'file', size: 1087 },
]
<\/script>

<template>
  <FileExplorer :items="files" class="h-[480px]" />
</template>`,
  },
  {
    id: 'events',
    title: 'Events decide what exists',
    description: 'The explorer emits intent; your application performs it and updates `items`. Listening to an event is what enables its action — the toolbar, the context menu, the shortcuts and the status bar all come from one action registry, so an action you do not handle never appears, and one the selection, permissions or read-only state forbid is disabled.',
    code: `<template>
  <FileExplorer
    :items="files"
    @upload="upload"
    @create-folder="createFolder"
    @create-file="createFile"
    @rename="rename"
    @move="move"
    @paste="paste"
    @duplicate="duplicate"
    @download="download"
    @preview="preview"
    @open="open"
    @trash="trash"
    @restore="restore"
    @delete-permanently="purge"
    @empty-trash="emptyTrash"
    @share="share"
    @copy-link="copyLink"
    @favorite="star"
    @unfavorite="unstar"
    @properties="showProperties"
    @refresh="refresh"
  />
</template>`,
  },
  {
    id: 'async',
    title: 'Async handlers and operation states',
    description: 'Return a promise from any handler and the explorer tracks it: a progress bar in the operations panel and on the affected items, `aria-busy`, and a spinner on the refresh button. The last argument is a context with `progress(percent)` and an `AbortSignal`. Instant actions (rename, star, preview) stay silent unless they fail.',
    code: `<script setup lang="ts">
import type { FileExplorerItem, FileExplorerOperationContext } from '@/components/ui/file-explorer'

async function download({ items }: { items: FileExplorerItem[] }, context: FileExplorerOperationContext) {
  const response = await fetch('/api/archive', {
    method: 'POST',
    body: JSON.stringify(items.map(item => item.id)),
    signal: context.signal, // Cancel aborts the request
  })
  const reader = response.body!.getReader()
  const total = Number(response.headers.get('content-length'))
  let received = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    received += value.length
    context.progress((received / total) * 100)
  }
  // Saving the file is your call — the explorer never downloads anything.
}
<\/script>

<template>
  <FileExplorer :items="files" @download="download" />
</template>`,
  },
  {
    id: 'errors',
    title: 'Errors, retry and cancellation',
    description: 'A rejected promise is never swallowed: the operation turns into an error with the message you threw, Retry (which calls your handler again with the same arguments) and Dismiss, and `operation-error` fires for logging. For partial failures, resolve with `failed` — Retry then sends only what failed. Cancel aborts `context.signal`.',
    code: `<script setup lang="ts">
async function upload(files: File[], folder: FileExplorerItem | null, context: FileExplorerUploadContext) {
  const results = await Promise.allSettled(files.map((file, i) =>
    storage.put(folder?.id ?? '', context.relativePaths[i] || file.name, file, { signal: context.signal })))

  files.value = await storage.list()
  return {
    failed: results.flatMap((result, i) =>
      result.status === 'rejected' ? [{ source: files[i], error: String(result.reason) }] : []),
  }
}
<\/script>

<template>
  <FileExplorer :items="files" @upload="upload" @operation-error="op => logger.warn(op)" />
</template>`,
  },
  {
    id: 'external-operations',
    title: 'Your own operations',
    description: 'When progress lives elsewhere (a resumable upload manager, a job queue), pass `operations` and listen to `cancel-operation`, `retry-operation` and `dismiss-operation`. Items listed in `itemIds` show the progress inline.',
    code: `<script setup lang="ts">
import type { FileExplorerOperationState } from '@/components/ui/file-explorer'

const operations = computed<FileExplorerOperationState[]>(() =>
  uploads.value.map(upload => ({
    id: upload.id,
    type: 'upload',
    status: upload.error ? 'error' : upload.done ? 'success' : 'running',
    label: \`Uploading \${upload.name}\`,
    progress: upload.percent,
    error: upload.error,
    itemIds: [upload.placeholderId],
    cancelable: true,
    retryable: true,
  })))
<\/script>

<template>
  <FileExplorer
    :items="files"
    :operations="operations"
    @cancel-operation="op => uploader.cancel(op.id)"
    @retry-operation="op => uploader.retry(op.id)"
    @dismiss-operation="op => uploader.forget(op.id)"
  />
</template>`,
  },
  {
    id: 'undo',
    title: 'Undo and redo',
    description: 'The explorer cannot reverse anything on your server, so it asks you how: return `{ undo }` from a handler and it offers Undo in the panel and on Ctrl/Cmd+Z. Whatever `undo` returns can carry its own `undo`, which becomes Redo (Ctrl/Cmd+Shift+Z or Ctrl+Y). `message` replaces the default success text.',
    code: `<script setup lang="ts">
async function trash({ items }: FileExplorerItemsEvent) {
  const ids = items.map(item => item.id)
  await api.trash(ids)
  files.value = await api.tree()
  return {
    message: \`Moved \${ids.length} items to Trash\`,
    undo: async () => {
      await api.restore(ids)
      files.value = await api.tree()
      return { undo: () => trash({ items }) } // redo
    },
  }
}
<\/script>`,
  },
  {
    id: 'clipboard',
    title: 'Copy, cut and paste',
    description: 'Handling `@paste` enables Copy (Ctrl/Cmd+C), Cut (Ctrl/Cmd+X) and Paste (Ctrl/Cmd+V), from the keyboard, the context menu and on a folder ("paste into"). The clipboard is UI state — bind `v-model:clipboard` to share it between explorers. Cut items are dimmed until pasted. Paste goes into the open folder; pasting a folder into itself or a read-only folder is refused. `copy` and `cut` events tell you what was put on the clipboard.',
    code: `<script setup lang="ts">
import type { FileExplorerClipboard, FileExplorerPasteEvent } from '@/components/ui/file-explorer'

const clipboard = ref<FileExplorerClipboard | null>(null)

async function paste({ items, target, operation, conflicts }: FileExplorerPasteEvent, context: FileExplorerOperationContext) {
  await (operation === 'cut' ? api.move : api.copy)({
    ids: items.map(item => item.id),
    to: target?.id ?? null,
    // e.g. [{ conflict, action: 'keep-both', name: 'report (1).pdf' }]
    conflicts: conflicts.map(({ conflict, action, name }) => ({ id: (conflict.source as FileExplorerItem).id, action, name })),
  }, { signal: context.signal })
  files.value = await api.tree()
}
<\/script>

<template>
  <!-- Two panes sharing one clipboard -->
  <FileExplorer v-model:clipboard="clipboard" :items="files" @paste="paste" />
  <FileExplorer v-model:clipboard="clipboard" :items="files" @paste="paste" />
</template>`,
  },
  {
    id: 'conflicts',
    title: 'Conflict resolution',
    description: 'Before paste, move and upload, the explorer compares names with the destination and asks: Replace, Keep both (with a free name such as "report (1).pdf") or Skip, with "apply to all" for the rest; Cancel stops everything. Copying next to the original keeps both without asking. Your handler receives the choices in `conflicts`, and skipped items are left out. When your server finds conflicts the explorer cannot see, call `context.resolveConflicts()` from the handler — the same dialog answers.',
    code: `<script setup lang="ts">
async function move(event: FileExplorerMoveEvent, context: FileExplorerOperationContext) {
  const { clashes } = await api.checkMove(event)
  if (clashes.length) {
    const choices = await context.resolveConflicts(clashes.map(clash => ({
      name: clash.name,
      source: event.items.find(item => item.id === clash.id)!,
      destination: null,
      target: event.target,
      reason: clash.locked ? 'permission' : 'exists',
    })))
    if (!choices) return // the user canceled
  }
  await api.move(event)
}
<\/script>`,
  },
  {
    id: 'download',
    title: 'Download, duplicate, preview and open',
    description: 'Download is a first-class action (toolbar, menu, status bar) for any selection, folders included when your server can archive them. Duplicate (Ctrl/Cmd+D) copies next to the originals. Open and preview are different things: `open` fires on double-click and Enter; `preview` is a quick look on Space. The explorer never renders files, runs them or downloads them itself — `isPotentiallyUnsafe(item)` flags executables so you can warn, and they get no Preview.',
    code: `<script setup lang="ts">
import { isPotentiallyUnsafe } from '@/components/ui/file-explorer'

function open(item: FileExplorerItem) {
  if (isPotentiallyUnsafe(item) && !confirm(\`\${item.name} is an application. Open it anyway?\`)) return
  router.push(\`/files/\${item.id}\`)
}
<\/script>

<template>
  <FileExplorer
    :items="files"
    @open="open"
    @preview="({ item }) => (quickLook = item)"
    @download="({ items }) => api.download(items)"
    @duplicate="({ items }) => api.duplicate(items)"
  />
  <MyQuickLook v-model:item="quickLook" />
</template>`,
  },
  {
    id: 'permissions',
    title: 'Permissions and read-only',
    description: 'Give items `permissions` — `read`, `write`, `delete`, `rename`, `move`, `copy`, `download`, `share`, all allowed unless set to `false`. Actions follow: a folder without `write` refuses uploads, new items, pastes and drops (and is marked while dragged over); a file without `rename` has no Rename. `readonly` hides every change at once. This shapes the UI only — enforce permissions on your server too.',
    code: `const files: FileExplorerItem[] = [
  {
    id: 'shared',
    name: 'Shared with me',
    type: 'folder',
    owner: 'Ada',
    permissions: { write: false, delete: false, rename: false, move: false },
    children: [
      { id: 'shared/roadmap.xlsx', name: 'roadmap.xlsx', type: 'file', permissions: { download: false } },
    ],
  },
]`,
  },
  {
    id: 'trash',
    title: 'Trash, restore and permanent delete',
    description: 'With `@trash`, Delete moves items to the trash without asking (return `undo` to offer Undo). Items with `trashed: true` offer Restore and Delete permanently instead, and a `listing` with `trash: true` adds Empty Trash; both confirm first. Keep `@delete` too and Shift+Delete deletes permanently. Without `@trash`, Delete asks for confirmation and calls `@delete`.',
    code: `<template>
  <FileExplorer
    v-model:location="location"
    :items="files"
    :listing="location === 'trash' ? { items: trashed, trash: true } : null"
    :locations="[{ locations: [{ id: 'trash', label: 'Trash', icon: Trash2, trash: true }] }]"
    @trash="({ items }) => api.trash(items)"
    @restore="({ items }) => api.restore(items)"
    @delete-permanently="({ items }) => api.purge(items)"
    @empty-trash="() => api.emptyTrash()"
  />
</template>`,
  },
  {
    id: 'favorites',
    title: 'Favorites',
    description: 'Pass the starred ids as `favorites` and listen to `favorite` / `unfavorite`. Starred items show a star, and the menu offers Add to or Remove from Starred. Nothing on the item is mutated.',
    code: `<template>
  <FileExplorer
    :items="files"
    :favorites="starred"
    @favorite="({ items }) => starred.push(...items.map(item => item.id))"
    @unfavorite="({ items }) => (starred = starred.filter(id => !items.some(item => item.id === id)))"
  />
</template>`,
  },
  {
    id: 'locations',
    title: 'Sidebar locations and listings',
    description: 'Sections above the directory tree come from `locations`. An entry with `folder` is a shortcut to a folder (`null` is the root). Any other entry sets `v-model:location`, and you show its items through `listing` — Recent, Starred, Shared with me, a search, a storage provider. Listings are flat and may contain items from anywhere; entries with `trash` accept drops that move items to the trash.',
    code: `<script setup lang="ts">
import { Clock, House, Star, Trash2 } from 'lucide-vue-next'

const location = ref<string | null>(null)
const locations = [
  { label: 'Quick access', locations: [
    { id: 'home', label: 'Home', icon: House, folder: null },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'trash', label: 'Trash', icon: Trash2, trash: true },
  ] },
  { label: 'Locations', locations: [
    { id: 'drive', label: 'My Drive', folder: 'drive-root' },
    { id: 'team', label: 'Team Drive', folder: 'team-root' },
  ] },
]

const { data: listing, pending } = useAsyncData(
  () => (location.value ? api.listing(location.value) : Promise.resolve(null)),
  { watch: [location] },
)
<\/script>

<template>
  <FileExplorer v-model:location="location" :items="files" :locations="locations" :listing="listing" :loading="pending" />
</template>`,
  },
  {
    id: 'lazy',
    title: 'Lazy loading large trees',
    description: 'You never need the whole filesystem in memory. With `@load-children`, a folder whose `children` is `undefined` is loaded when it is opened or expanded in the tree (one call, shared by both). A spinner shows while it loads; a rejected promise shows the error with Retry. Set `hasChildren: false` on folders known to be empty so they show no chevron.',
    code: `<script setup lang="ts">
const files = ref<FileExplorerItem[]>(await api.list(null)) // top level only

async function loadChildren(folder: FileExplorerItem, context: FileExplorerOperationContext) {
  const children = await api.list(folder.id, { signal: context.signal })
  files.value = setChildren(files.value, folder.id, children) // your immutable update
}
<\/script>

<template>
  <FileExplorer :items="files" @load-children="loadChildren" />
</template>`,
  },
  {
    id: 'pagination',
    title: 'Pagination and infinite loading',
    description: 'For huge folders, load a page and set `hasMore` and `cursor` on the folder (or on the `listing`). The next page loads when the end scrolls into view, or with the Load more button; errors pause loading until Retry. Cards and rows use `content-visibility`, so long folders stay cheap to render.',
    code: `<script setup lang="ts">
async function loadMore({ folder, cursor }: FileExplorerLoadMoreEvent) {
  const page = await api.list(folder?.id ?? null, { cursor })
  files.value = appendChildren(files.value, folder?.id ?? null, page.items, {
    hasMore: page.next !== null,
    cursor: page.next,
  })
}
<\/script>

<template>
  <FileExplorer :items="files" @load-more="loadMore" />
</template>`,
  },
  {
    id: 'remote-search',
    title: 'Remote search',
    description: 'By default the search box filters the open folder by name. With `remote-search`, it calls `@search` instead (after `search-debounce` ms, 300 by default; set 0 to debounce yourself) and shows a loading state while your handler runs and an error with Retry if it throws. Show the results through `listing`; an empty query means the search was cleared.',
    code: `<script setup lang="ts">
const results = ref<FileExplorerListing | null>(null)

async function search({ query, folder }: FileExplorerSearchEvent, context: FileExplorerOperationContext) {
  results.value = query
    ? { label: \`Results for “\${query}”\`, items: await api.search(query, { within: folder?.id, signal: context.signal }) }
    : null
}
<\/script>

<template>
  <FileExplorer :items="files" :listing="results" remote-search @search="search" />
</template>`,
  },
  {
    id: 'columns',
    title: 'Details view columns',
    description: 'Choose built-in columns — `name`, `modified`, `created`, `accessed`, `type`, `size`, `owner`, `permissions` — or add your own with a `value` (to sort by) and `format` (to display); the `#cell` slot renders custom columns any way you like. Columns sort from their header or the toolbar Sort menu. Name, size and `pinned` columns stay on narrow explorers.',
    code: `<script setup lang="ts">
const columns = [
  'name',
  'owner',
  'modified',
  { key: 'version', label: 'Version', width: '5rem', value: (item: FileExplorerItem<Meta>) => item.data?.version },
  { key: 'status', label: 'Sync', width: '6rem', pinned: true },
  'size',
]
<\/script>

<template>
  <FileExplorer :items="files" :columns="columns" default-view="list">
    <template #cell="{ item, column }">
      <SyncBadge v-if="column.key === 'status'" :state="item.data?.sync" />
    </template>
  </FileExplorer>
</template>`,
  },
  {
    id: 'menu',
    title: 'Context menu and action availability',
    description: 'Right-click (or long-press, or the Menu key) opens a built-in menu with every action available for the item, the selection or the empty area. Replace it with the `#context-menu` slot: the scope carries the resolved `actions` (render some, add your own), plus `rename()`, `remove()` and `defer()` — the last runs your own entry once the menu has closed, which dialogs need. The exposed `getActions(ids)` returns the same list, e.g. for a command palette.',
    code: `<script setup lang="ts">
import { ContextMenuItem, ContextMenuSeparator } from '@/components/ui/context-menu'
<\/script>

<template>
  <FileExplorer ref="explorer" :items="files" @paste="paste" @download="download">
    <template #context-menu="{ item, actions, defer }">
      <ContextMenuItem v-for="action in actions" :key="action.id" :disabled="action.disabled" @select="action.run()">
        <component :is="action.icon" /> {{ action.label }}
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem v-if="item" @select="defer(() => openVersionHistory(item))">Version history…</ContextMenuItem>
    </template>
  </FileExplorer>
</template>`,
  },
  {
    id: 'upload',
    title: 'Uploads',
    description: '`@upload` enables the Upload button, the drop tile and dropping files from the desktop; `directory-upload` adds Upload folder and walks dropped folders, handing you `context.relativePaths`. `accept` and `max-file-size` are enforced for picked and dropped files alike, and rejected files are reported. Name clashes go through the conflict dialog first.',
    code: `<template>
  <FileExplorer
    :items="files"
    accept="image/*,.pdf"
    :max-file-size="50 * 1024 * 1024"
    directory-upload
    @upload="(files, folder, context) => storage.upload(files, folder, context)"
  />
</template>`,
  },
  {
    id: 'i18n',
    title: 'Translations and RTL',
    description: 'Every visible string — buttons, menus, dialogs, empty states, errors, operation labels — comes from `messages`; pass the ones you want to change. Strings that depend on counts or names are functions, so plurals stay correct. Set `dir="rtl"` (or use Reka\'s `ConfigProvider`) and arrows, indentation, breadcrumbs and menus mirror.',
    code: `<script setup lang="ts">
import type { FileExplorerMessages } from '@/components/ui/file-explorer'

const messages: Partial<FileExplorerMessages> = {
  newFolder: 'Nouveau dossier',
  upload: 'Téléverser',
  items: count => \`\${count} élément\${count > 1 ? 's' : ''}\`,
  deleteTitle: items => \`Supprimer \${items.length} élément(s) ?\`,
}
<\/script>

<template>
  <FileExplorer :items="files" :messages="messages" dir="rtl" />
</template>`,
  },
  {
    id: 'file-tree',
    title: 'FileTree on its own',
    description: 'The directory tree is exported as `FileTree`: recursive, WAI-ARIA tree semantics through Reka UI, id-based `v-model:selected` and `v-model:expanded`, search that reveals matches, inline rename, confirmed delete, lazy `@load-children`, a context menu and drag and drop.',
    code: `<script setup lang="ts">
import { FileTree } from '@/components/ui/file-explorer'
<\/script>

<template>
  <FileTree
    v-model:selected="selected"
    v-model:expanded="expanded"
    :items="files"
    searchable
    @rename="(item, name) => api.rename(item.id, name)"
    @load-children="folder => api.loadChildren(folder)"
    class="h-80"
  />
</template>`,
  },
]

// --- API reference -----------------------------------------------------------------

const props = [
  { name: 'items', type: 'FileExplorerItem<TData>[]', default: '[]', description: 'The tree. Never mutated.' },
  { name: 'folder', type: 'string | null', default: 'null', description: 'Open folder id (null is the root). v-model:folder.' },
  { name: 'selected', type: 'string[]', default: '[]', description: 'Selected ids. v-model:selected.' },
  { name: 'view', type: '"grid" | "list"', default: '"grid"', description: 'v-model:view.' },
  { name: 'sort', type: 'FileExplorerSort', default: '{ key: "name", direction: "asc" }', description: 'v-model:sort. Folders always first.' },
  { name: 'search', type: 'string', default: '""', description: 'v-model:search. Filters the open folder, or runs @search with remote-search.' },
  { name: 'clipboard', type: 'FileExplorerClipboard | null', default: 'null', description: 'v-model:clipboard. Share it between explorers.' },
  { name: 'location', type: 'string | null', default: 'null', description: 'Active sidebar location without a folder. v-model:location.' },
  { name: 'listing', type: 'FileExplorerListing | null', default: 'null', description: 'Flat items shown instead of the open folder: Recent, Starred, Trash, search results.' },
  { name: 'locations', type: 'FileExplorerLocationSection[]', default: '[]', description: 'Sidebar sections above the directory tree.' },
  { name: 'operations', type: 'FileExplorerOperationState[]', default: '—', description: 'Your own operations, shown with the explorer\'s.' },
  { name: 'columns', type: '(FileExplorerColumnKey | FileExplorerColumn)[]', default: 'name, modified, type, size', description: 'Details view columns.' },
  { name: 'favorites', type: 'string[]', default: '—', description: 'Starred ids.' },
  { name: 'multiple', type: 'boolean', default: 'true', description: 'Multi-selection.' },
  { name: 'draggable', type: 'boolean', default: 'false', description: 'Drag and drop between folders, the tree, breadcrumbs and Trash.' },
  { name: 'sidebar', type: 'boolean', default: 'true', description: 'Locations and directory tree (an overlay on narrow explorers).' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Hides every action that changes data.' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Skeletons and aria-busy.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables everything.' },
  { name: 'accept', type: 'string', default: '—', description: 'Accepted uploads, for picked and dropped files.' },
  { name: 'maxFileSize', type: 'number', default: '—', description: 'Largest accepted upload, in bytes.' },
  { name: 'directoryUpload', type: 'boolean', default: 'false', description: 'Upload folder, and dropped folders.' },
  { name: 'remoteSearch', type: 'boolean', default: 'false', description: 'Search with @search instead of filtering.' },
  { name: 'searchDebounce', type: 'number', default: '300', description: 'Delay before @search, in ms.' },
  { name: 'confirmDelete', type: 'boolean', default: 'true', description: 'Confirm deletes in a dialog.' },
  { name: 'validateName', type: '(name, item) => string | undefined', default: '—', description: 'Extra rename checks.' },
  { name: 'getIcon', type: 'FileExplorerIconResolver', default: '—', description: 'Custom icons.' },
  { name: 'messages', type: 'Partial<FileExplorerMessages>', default: '—', description: 'Every user-facing string.' },
  { name: 'dir', type: '"ltr" | "rtl"', default: 'inherited', description: 'Reading direction.' },
  { name: 'rootLabel · label · class', type: 'string', default: '"root" · "Files"', description: 'Breadcrumb root, list accessible name, root classes.' },
]

const itemProps = [
  { name: 'id · name · type', type: 'string · string · "file" | "folder"', description: 'Required. Ids are stable and unique across the tree.' },
  { name: 'children', type: 'FileExplorerItem[]', description: 'A folder\'s contents. With @load-children, undefined means "not loaded".' },
  { name: 'hasChildren · hasMore · cursor', type: 'boolean · boolean · unknown', description: 'Lazy loading and pagination.' },
  { name: 'size', type: 'number', description: 'Bytes.' },
  { name: 'createdAt · modifiedAt · accessedAt', type: 'Date | string', description: 'Shown relative; used for sorting.' },
  { name: 'owner · mimeType · extension', type: 'string', description: 'Metadata for columns, icons and the status bar.' },
  { name: 'description · preview · thumbnail', type: 'string', description: 'Card subtitle, text preview, image URL.' },
  { name: 'permissions', type: 'FileExplorerPermissions', description: 'read, write, delete, rename, move, copy, download, share.' },
  { name: 'trashed · disabled', type: 'boolean', description: 'In the trash; not interactive.' },
  { name: 'data', type: 'TData', description: 'Your metadata, typed everywhere.' },
]

const events = [
  { name: 'upload', payload: '(files, folder, context)', description: 'Picked or dropped files. context has relativePaths and conflicts.' },
  { name: 'create-folder · create-file', payload: '(parent, context)', description: 'Return { rename: id } to rename the new item.' },
  { name: 'rename', payload: '(item, name, context)', description: 'Inline rename (F2).' },
  { name: 'move', payload: '({ items, target, conflicts }, context)', description: 'Drag and drop.' },
  { name: 'paste', payload: '({ items, target, operation, conflicts }, context)', description: 'Enables Copy, Cut and Paste.' },
  { name: 'duplicate · download · share · copy-link · properties', payload: '({ items }, context)', description: 'Actions on the selection.' },
  { name: 'preview', payload: '({ item }, context)', description: 'Quick look (Space).' },
  { name: 'open', payload: 'item', description: 'Double-click, Enter, status bar.' },
  { name: 'delete', payload: '(items, context)', description: 'After confirmation. Shift+Delete when @trash is also set.' },
  { name: 'trash · restore · delete-permanently', payload: '({ items }, context)', description: 'Trash workflow.' },
  { name: 'empty-trash', payload: '({ folder }, context)', description: 'From a trash listing, after confirmation.' },
  { name: 'favorite · unfavorite', payload: '({ items }, context)', description: 'Starring.' },
  { name: 'refresh', payload: '({ folder }, context)', description: 'Toolbar refresh.' },
  { name: 'load-children', payload: '(folder, context)', description: 'Lazy folders.' },
  { name: 'load-more', payload: '({ folder, cursor }, context)', description: 'Next page.' },
  { name: 'search', payload: '({ query, folder }, context)', description: 'With remote-search.' },
  { name: 'copy · cut', payload: '{ items }', description: 'Items put on the clipboard.' },
  { name: 'cancel-operation · retry-operation · dismiss-operation', payload: 'FileExplorerOperationState', description: 'For your own operations.' },
  { name: 'operation-error', payload: 'FileExplorerOperationState', description: 'One of the explorer\'s operations failed.' },
  { name: 'update:*', payload: 'folder, selected, view, sort, search, clipboard, location', description: 'v-model updates.' },
]

const results = [
  { name: 'select', type: 'string[]', description: 'Select and focus these ids once they appear in items.' },
  { name: 'rename', type: 'string', description: 'Start renaming this id once it appears.' },
  { name: 'undo', type: '() => FileExplorerHandlerResult', description: 'Offer Undo; its own result may carry undo (Redo).' },
  { name: 'message', type: 'string', description: 'Success text in the operations panel.' },
  { name: 'failed', type: '{ source, error }[]', description: 'Partial failure; Retry sends only these.' },
]

const slots = [
  { name: '#context-menu', payload: '{ item, actions, rename, remove, defer }', description: 'Replaces the built-in menu.' },
  { name: '#preview', payload: '{ item }', description: 'A card\'s preview area.' },
  { name: '#cell', payload: '{ item, column }', description: 'Custom details columns.' },
  { name: '#empty', payload: '{ query }', description: 'Empty folder or no matches.' },
  { name: '#delete-description', payload: '{ items }', description: 'Delete confirmation text.' },
  { name: '#toolbar-actions', payload: '—', description: 'Extra toolbar buttons.' },
  { name: '#status-actions', payload: '{ items, actions }', description: 'Status bar actions.' },
]

const exposed = [
  { name: 'rename(id) · remove(ids)', description: 'Inline rename; delete through the dialog.' },
  { name: 'copy(ids) · cut(ids) · paste(folderId?)', description: 'Clipboard.' },
  { name: 'undo() · redo() · refresh()', description: 'History and reload.' },
  { name: 'resolveConflicts(conflicts)', description: 'Open the conflict dialog yourself.' },
  { name: 'getActions(ids?)', description: 'Available actions, for command palettes.' },
  { name: 'operations', description: 'Every operation currently shown.' },
]

const keyboard = [
  { keys: ['← → ↑ ↓'], description: 'Move (two-dimensional in the grid, mirrored in RTL) and select.' },
  { keys: ['Shift', 'Arrows'], description: 'Extend the selection.' },
  { keys: ['Ctrl / ⌘', 'Arrows'], description: 'Move focus only; Ctrl/⌘+Space toggles.' },
  { keys: ['Home', 'End'], description: 'First / last item.' },
  { keys: ['Enter'], description: 'Open.' },
  { keys: ['Space'], description: 'Preview (with @preview), else toggle selection.' },
  { keys: ['Alt', 'Enter'], description: 'Properties.' },
  { keys: ['F2'], description: 'Rename.' },
  { keys: ['Ctrl / ⌘', 'C · X · V'], description: 'Copy, cut, paste.' },
  { keys: ['Ctrl / ⌘', 'D'], description: 'Duplicate.' },
  { keys: ['Delete', '⌘⌫'], description: 'Move to trash, or delete after confirmation.' },
  { keys: ['Shift', 'Delete'], description: 'Delete permanently.' },
  { keys: ['Ctrl / ⌘', 'Z'], description: 'Undo. Ctrl+Y or Ctrl/⌘+Shift+Z redo.' },
  { keys: ['Ctrl / ⌘', 'A'], description: 'Select all.' },
  { keys: ['Backspace', 'Alt ↑'], description: 'Up, selecting the folder you left.' },
  { keys: ['Alt', '← / →'], description: 'Back, forward.' },
  { keys: ['Esc'], description: 'Clear the selection.' },
  { keys: ['a–z'], description: 'Type-ahead.' },
]

const migration = [
  'Handlers get a trailing context argument (signal, progress, resolveConflicts). Existing handlers keep working.',
  'move is now a handler: @move="fn" is unchanged in templates, and the payload gains conflicts. wrapper.emitted("move") no longer records it in tests.',
  'The status bar\'s default action reads "Open" (it was "Open File"), and the New Folder button\'s label is "New Folder" — both configurable through messages.',
  'FileExplorerSort.key also accepts custom column keys.',
  'A built-in context menu now appears when you do not provide #context-menu. Its scope gained actions and defer.',
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
        The UI layer of a file manager — for cloud drives, media libraries, document managers and IDE sidebars.
        It owns navigation, selection, keyboard, menus, dialogs, drag and drop and the state of running operations.
        Your application owns everything else: it handles the events, talks to its storage, and updates
        <code>items</code>.
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
          <strong class="font-semibold">Ready to go:</strong> colors come from your shadcn theme tokens, the layout adapts
          with Tailwind v4 container queries (it responds to its own width, not the window), and animations use the
          <code>tw-animate-css</code> utilities shadcn-vue projects already import.
        </div>
      </div>
    </div>

    <!-- Architecture -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">How it works</h2>
      <p class="text-sm text-muted-foreground leading-relaxed">
        The explorer emits intent, your application performs it, and the explorer renders the new <code>items</code>.
        It never calls an API, reads a disk, stores data or mutates what you pass in. Listening to an event is what
        enables its action; handlers may return a promise, which the explorer tracks as an operation with progress,
        errors, retry, cancellation and undo — all of which you control.
      </p>
      <div class="my-4 rounded-xl border border-border bg-background p-4 font-mono text-xs leading-6 text-muted-foreground">
        <p>user action ─▶ FileExplorer ─▶ <span class="text-foreground">@paste(event, context)</span> ─▶ your API</p>
        <p class="ps-24">◀─ progress · error · { undo, select } ─┘</p>
        <p>your API ─▶ <span class="text-foreground">items</span> ─▶ FileExplorer renders the result</p>
      </div>
    </div>

    <!-- File Structure -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">File Structure</h2>
      <div class="my-4 rounded-xl border border-border overflow-hidden bg-background">
        <div class="p-4 w-full relative font-mono text-sm text-muted-foreground">
          <div class="flex items-center gap-2 text-foreground">components/ui/file-explorer</div>
          <div class="relative ml-2 mt-1 before:absolute before:left-0 before:inset-y-0 before:w-px before:bg-border">
            <div v-for="file in fileStructure" :key="file.name" class="flex flex-wrap items-center gap-x-2 py-1 pl-4">
              <span :class="file.name.includes('.vue') ? 'text-pink-500' : 'text-foreground/80'">{{ file.name }}</span>
              <span v-if="file.note" class="text-xs text-muted-foreground/70 font-sans">— {{ file.note }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Usage -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">Usage</h2>

      <div v-for="example in examples" :id="example.id" :key="example.id" class="flex flex-col mb-8">
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
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">Keyboard & accessibility</h2>
      <p class="text-sm text-muted-foreground leading-relaxed">
        Items form a single-tab-stop <code>listbox</code> (<code>aria-selected</code>, <code>aria-multiselectable</code>,
        <code>aria-busy</code> while an operation runs); the directory tree is a WAI-ARIA tree. Operations are announced
        through a polite live region, errors as alerts, progress as <code>progressbar</code>. Focus lands on the new
        item after create, on the renamed item after rename, on the neighbour after delete, on the first item after
        opening a folder, and on the folder you came from after Up or Back. Everything drag and drop does is also
        available as Cut and Paste.
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

    <!-- API Reference -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">API Reference</h2>

      <h3 class="text-2xl mt-7 mb-3 text-foreground">Props</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div v-for="prop in props" :key="prop.name" class="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 px-5 py-4 border-b border-border">
          <div class="w-full sm:w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg break-all">{{ prop.name }}</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex flex-wrap items-center gap-2 min-w-0">
              <code class="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md break-all">{{ prop.type }}</code>
              <div class="flex-1" />
              <code class="text-xs font-mono text-foreground bg-muted px-2 py-0.5 rounded-md break-all">{{ prop.default }}</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-1">{{ prop.description }}</p>
          </div>
        </div>
      </div>

      <h3 class="text-2xl mt-8 mb-3 text-foreground">Item</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div v-for="item in itemProps" :key="item.name" class="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 px-5 py-4 border-b border-border">
          <div class="w-full sm:w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg break-all">{{ item.name }}</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <code class="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md self-start break-all">{{ item.type }}</code>
            <p class="text-sm text-muted-foreground leading-relaxed">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <h3 class="text-2xl mt-8 mb-3 text-foreground">Events</h3>
      <p class="text-sm text-muted-foreground leading-relaxed mb-2">
        Action events are handler props: listening to one enables the action. Each receives a
        <code>FileExplorerOperationContext</code> last and may return (or resolve to) a result.
      </p>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div v-for="event in events" :key="event.name" class="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 px-5 py-4 border-b border-border">
          <div class="w-full sm:w-52 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg break-all">{{ event.name }}</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <code class="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md self-start break-all">{{ event.payload }}</code>
            <p class="text-sm text-muted-foreground leading-relaxed">{{ event.description }}</p>
          </div>
        </div>
      </div>

      <h3 class="text-2xl mt-8 mb-3 text-foreground">Handler results</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div v-for="result in results" :key="result.name" class="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 px-5 py-4 border-b border-border">
          <div class="w-full sm:w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">{{ result.name }}</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <code class="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md self-start break-all">{{ result.type }}</code>
            <p class="text-sm text-muted-foreground leading-relaxed">{{ result.description }}</p>
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

      <h3 class="text-2xl mt-8 mb-3 text-foreground">Exposed</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div v-for="entry in exposed" :key="entry.name" class="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 px-5 py-3 border-b border-border">
          <div class="w-full sm:w-64 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg break-all">{{ entry.name }}</code>
          </div>
          <p class="flex-1 text-sm text-muted-foreground leading-relaxed">{{ entry.description }}</p>
        </div>
      </div>

      <h3 class="text-2xl mt-8 mb-3 text-foreground">TypeScript</h3>
      <p class="text-sm text-muted-foreground leading-relaxed">
        Everything is exported from <code>@/components/ui/file-explorer</code>: <code>FileExplorerItem</code>,
        <code>FileExplorerPermissions</code>, <code>FileExplorerOperationState</code>,
        <code>FileExplorerOperationContext</code>, <code>FileExplorerOperationResult</code>,
        <code>FileExplorerPasteEvent</code>, <code>FileExplorerMoveEvent</code>, <code>FileExplorerItemsEvent</code>
        (download, duplicate, trash…), <code>FileExplorerConflict</code> and its resolution,
        <code>FileExplorerClipboard</code>, <code>FileExplorerListing</code>, <code>FileExplorerLocation</code>,
        <code>FileExplorerColumn</code>, <code>FileExplorerAction</code>, <code>FileExplorerMessages</code>, and the
        helpers <code>getFileKind</code>, <code>isPotentiallyUnsafe</code>, <code>can</code>, <code>formatBytes</code>,
        <code>formatRelativeTime</code>, <code>uniqueName</code>, <code>matchesAccept</code> and
        <code>sortFileItems</code>. Both components are generic over <code>TData</code>.
      </p>

      <h3 class="text-2xl mt-8 mb-3 text-foreground">Migrating from the previous version</h3>
      <ul class="flex list-disc flex-col gap-2 ps-5 text-sm text-muted-foreground leading-relaxed">
        <li v-for="note in migration" :key="note">{{ note }}</li>
      </ul>
    </div>

    <!-- RIGHT PANE: Preview -->
    <template #preview>
      <FileExplorerDemo
        ref="demo"
        v-model:view="view"
        :multiple="multiple"
        :draggable="draggable"
        :sidebar="sidebar"
        :readonly="readonly"
        :loading="loading"
        :slow="slow"
      />
    </template>

    <template #code>
      <CodeBlock language="vue" :code="codeString" class="border-0 bg-transparent m-0 p-0" />
    </template>

    <template #settings>
      <div class="flex items-center justify-between mb-5">
        <span class="font-semibold text-base text-foreground tracking-tight">Settings</span>
        <button class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" @click="resetSettings">Reset</button>
      </div>

      <div v-for="toggle in toggles" :key="toggle.label" class="flex items-center justify-between gap-4 mb-3.5">
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

      <div class="flex items-center gap-2 mt-1">
        <label for="file-explorer-view" class="sr-only">View</label>
        <div class="relative flex-1">
          <select id="file-explorer-view" v-model="view" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="grid">Grid</option>
            <option value="list">Details</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
        <button
          type="button"
          class="shrink-0 rounded-lg border border-border px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
          @click="demo?.failNext()"
        >
          Fail next call
        </button>
      </div>
    </template>
  </DocContent>
</template>
