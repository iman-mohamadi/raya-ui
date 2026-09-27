<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { CopyPlus, Download, ExternalLink, FolderPlus, Link, PencilLine, Trash2 } from 'lucide-vue-next'
import {
  FileExplorer,
  formatBytes,
  indexFileTree,
  type FileExplorerItem,
  type FileExplorerMoveEvent,
  type FileExplorerView,
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
  description: 'A desktop-style file explorer for Vue and Nuxt: directory tree, breadcrumbs, grid and details views, keyboard navigation, multi-selection, context menus, drag and drop and uploads.',
  ogTitle: 'File Explorer Component for Vue & Nuxt',
  ogDescription: 'A desktop-style file explorer for Vue and Nuxt: directory tree, breadcrumbs, grid and details views, keyboard navigation, multi-selection, context menus, drag and drop and uploads.',
})

// --- Demo data -----------------------------------------------------------------

const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000)
const HOUR = 60
const DAY = 24 * HOUR

const primitives = ['Dialog.vue', 'Button.vue', 'Input.vue', 'Select.vue', 'Tabs.vue', 'Tooltip.vue', 'Popover.vue', 'Switch.vue', 'Slider.vue', 'Checkbox.vue', 'Avatar.vue', 'Badge.vue', 'Card.vue', 'Sheet.vue']

const createFiles = (): FileExplorerItem[] => [
  {
    id: 'pages',
    name: 'pages',
    type: 'folder',
    modifiedAt: ago(5 * DAY),
    children: [
      { id: 'pages/index.vue', name: 'index.vue', type: 'file', size: 3_210, modifiedAt: ago(2 * DAY), preview: '<template>\n  <HeroSection />' },
      { id: 'pages/docs.vue', name: 'docs.vue', type: 'file', size: 1_804, modifiedAt: ago(6 * DAY) },
    ],
  },
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
          {
            id: 'components/ui/FileExplorer.vue',
            name: 'FileExplorer.vue',
            type: 'file',
            size: 4_300,
            mimeType: 'text/x-vue',
            description: 'Vue 3 SFC',
            modifiedAt: ago(10),
            preview: '<template>\n  <FileExplorer v-model="active" />',
          },
          {
            id: 'components/ui/useFileSystem.ts',
            name: 'useFileSystem.ts',
            type: 'file',
            size: 2_867,
            mimeType: 'text/typescript',
            description: 'Composable hook',
            modifiedAt: ago(2 * HOUR),
            preview: 'export const useFS = () =>\n  return { readTree }',
          },
          {
            id: 'components/ui/ui-primitives',
            name: 'ui-primitives',
            type: 'folder',
            description: 'Directory',
            modifiedAt: ago(DAY),
            children: primitives.map((name, i) => ({
              id: `components/ui/ui-primitives/${name}`,
              name,
              type: 'file' as const,
              size: 900 + i * 173,
              modifiedAt: ago(DAY + i * 60),
            })),
          },
          {
            id: 'components/ui/hero-banner.png',
            name: 'hero-banner.png',
            type: 'file',
            size: 1_468_006,
            mimeType: 'image/png',
            description: 'Raster asset',
            modifiedAt: ago(3 * DAY),
            thumbnail: '/og-image.png',
          },
          {
            id: 'components/ui/nuxt.config.ts',
            name: 'nuxt.config.ts',
            type: 'file',
            size: 1_126,
            mimeType: 'text/typescript',
            description: 'Core config',
            modifiedAt: ago(4 * DAY),
            preview: 'export default defineNuxtConfig({\n  devtools: { enabled: true }',
          },
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
  {
    id: 'server',
    name: 'server',
    type: 'folder',
    modifiedAt: ago(14 * DAY),
    children: [
      {
        id: 'server/api',
        name: 'api',
        type: 'folder',
        modifiedAt: ago(14 * DAY),
        children: [
          { id: 'server/api/files.get.ts', name: 'files.get.ts', type: 'file', size: 954, modifiedAt: ago(14 * DAY), preview: 'export default defineEventHandler(async () => {' },
        ],
      },
    ],
  },
  {
    id: 'assets',
    name: 'assets',
    type: 'folder',
    modifiedAt: ago(30 * DAY),
    children: [
      { id: 'assets/logo.svg', name: 'logo.svg', type: 'file', size: 1_120, modifiedAt: ago(30 * DAY), thumbnail: '/logo.svg' },
      { id: 'assets/main.css', name: 'main.css', type: 'file', size: 18_430, modifiedAt: ago(2 * DAY), preview: '@import "tailwindcss";\n@import "tw-animate-css";' },
    ],
  },
  { id: 'package.json', name: 'package.json', type: 'file', size: 1_087, modifiedAt: ago(DAY), preview: '{\n  "name": "raya-app",' },
  { id: 'README.md', name: 'README.md', type: 'file', size: 3_402, modifiedAt: ago(8 * DAY), preview: '# Raya App\nBeautifully engineered components.' },
]

const DEFAULT_FOLDER = 'components/ui'
const DEFAULT_SELECTED = ['components/ui/FileExplorer.vue']

const files = ref(createFiles())
const folder = ref<string | null>(DEFAULT_FOLDER)
const selected = ref<string[]>([...DEFAULT_SELECTED])

// --- Interactive settings ------------------------------------------------------

const view = ref<FileExplorerView>('grid')
const multiple = ref(true)
const draggable = ref(true)
const sidebar = ref(true)
const uploads = ref(true)
const loading = ref(false)

const toggles = [
  { label: 'Directory tree', hint: 'Show the sidebar when there is room.', state: sidebar },
  { label: 'Multiple selection', hint: 'Ctrl/Cmd, Shift and Ctrl+A.', state: multiple },
  { label: 'Drag and drop', hint: 'Move items onto folders.', state: draggable },
  { label: 'File actions', hint: 'Upload, new folder, rename, delete.', state: uploads },
  { label: 'Loading', hint: 'Show skeleton cards.', state: loading },
]

const resetSettings = () => {
  view.value = 'grid'
  multiple.value = true
  draggable.value = true
  sidebar.value = true
  uploads.value = true
  loading.value = false
  files.value = createFiles()
  folder.value = DEFAULT_FOLDER
  selected.value = [...DEFAULT_SELECTED]
}

// --- Demo behavior: application code, not the component ------------------------

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

function removeItems(items: FileExplorerItem[], ids: Set<string>): FileExplorerItem[] {
  return items
    .filter(item => !ids.has(item.id))
    .map(item => (item.children ? { ...item, children: removeItems(item.children, ids) } : item))
}

function insertItems(items: FileExplorerItem[], targetId: string | null, additions: FileExplorerItem[]): FileExplorerItem[] {
  if (targetId === null) return [...items, ...additions]
  return items.map((item) => {
    if (item.id === targetId) return { ...item, children: [...(item.children ?? []), ...additions] }
    return item.children ? { ...item, children: insertItems(item.children, targetId, additions) } : item
  })
}

let counter = 0
const uniqueId = (prefix: string) => `${prefix}-${Date.now()}-${++counter}`
const objectUrls: string[] = []
onBeforeUnmount(() => objectUrls.forEach(url => URL.revokeObjectURL(url)))

function onMove({ items, target }: FileExplorerMoveEvent) {
  const ids = new Set(items.map(item => item.id))
  files.value = insertItems(removeItems(files.value, ids), target?.id ?? null, items)
}

function onUpload(uploaded: File[], target: FileExplorerItem | null) {
  const additions = uploaded.map((file): FileExplorerItem => {
    const thumbnail = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    if (thumbnail) objectUrls.push(thumbnail)
    return { id: uniqueId('upload'), name: file.name, type: 'file', size: file.size, mimeType: file.type || undefined, modifiedAt: new Date(), thumbnail }
  })
  files.value = insertItems(files.value, target?.id ?? null, additions)
  selected.value = additions.map(item => item.id)
}

function onCreateFolder(parent: FileExplorerItem | null) {
  const siblings = new Set((parent ? parent.children ?? [] : files.value).map(item => item.name))
  let name = 'New folder'
  for (let n = 2; siblings.has(name); n++) name = `New folder (${n})`
  const created: FileExplorerItem = { id: uniqueId('folder'), name, type: 'folder', children: [], modifiedAt: new Date() }
  files.value = insertItems(files.value, parent?.id ?? null, [created])
  selected.value = [created.id]
}

function onDelete(items: FileExplorerItem[]) {
  const ids = new Set(items.map(item => item.id))
  files.value = removeItems(files.value, ids)
  selected.value = selected.value.filter(id => !ids.has(id))
}

function renameItem(items: FileExplorerItem[], id: string, name: string): FileExplorerItem[] {
  return items.map((item) => {
    if (item.id === id) return { ...item, name, modifiedAt: new Date() }
    return item.children ? { ...item, children: renameItem(item.children, id, name) } : item
  })
}

function onRename(item: FileExplorerItem, name: string) {
  files.value = renameItem(files.value, item.id, name)
}

function createFolderHere() {
  onCreateFolder(folder.value === null ? null : index.value.get(folder.value)?.item ?? null)
}

function duplicate(item: FileExplorerItem) {
  const dot = item.name.lastIndexOf('.')
  const name = dot > 0 ? `${item.name.slice(0, dot)} copy${item.name.slice(dot)}` : `${item.name} copy`
  const copy: FileExplorerItem = { ...item, id: uniqueId('copy'), name, modifiedAt: new Date() }
  files.value = insertItems(files.value, index.value.get(item.id)?.parentId ?? null, [copy])
  selected.value = [copy.id]
}

function copyPath(item: FileExplorerItem) {
  navigator.clipboard?.writeText(pathOf(item.id)).catch(() => {})
}

function download(item: FileExplorerItem) {
  // The demo has no real file contents; download the preview text instead.
  const url = URL.createObjectURL(new Blob([item.preview ?? ''], { type: item.mimeType ?? 'text/plain' }))
  const link = document.createElement('a')
  link.href = url
  link.download = item.name
  link.click()
  URL.revokeObjectURL(url)
}

const lastOpened = ref('')
function onOpen(item: FileExplorerItem) {
  lastOpened.value = pathOf(item.id)
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
  { name: 'FileExplorer.vue', note: 'state, navigation, uploads, context menu' },
  { name: 'FileExplorerToolbar.vue', note: 'back/forward/up, breadcrumbs, filter, view, actions' },
  { name: 'FileExplorerSidebar.vue', note: 'directory tree + stats' },
  { name: 'FileExplorerContent.vue', note: 'grid and details views' },
  { name: 'FileExplorerCard.vue', note: '' },
  { name: 'FileExplorerRow.vue', note: '' },
  { name: 'FileExplorerFileIcon.vue', note: '' },
  { name: 'FileExplorerStatusBar.vue', note: '' },
  { name: 'FileTree.vue', note: 'standalone recursive tree' },
  { name: 'FileTreeRoot.vue', note: '' },
  { name: 'FileTreeNode.vue', note: 'recursive tree item' },
  { name: 'useFileExplorer*.ts', note: 'navigation, selection, keyboard, search, drag & drop' },
  { name: 'context.ts · types.ts · utils.ts · variants.ts · index.ts', note: '' },
]

// --- Live source code ------------------------------------------------------------

const codeString = computed(() => {
  const attrs = [
    'v-model:folder="folder"',
    'v-model:selected="selected"',
    ':items="files"',
  ]
  if (view.value !== 'grid') attrs.push(`default-view="${view.value}"`)
  if (!multiple.value) attrs.push(':multiple="false"')
  if (!sidebar.value) attrs.push(':sidebar="false"')
  if (draggable.value) attrs.push('draggable')
  if (loading.value) attrs.push('loading')
  if (draggable.value) attrs.push('@move="onMove"')
  if (uploads.value) attrs.push('@upload="onUpload"', '@create-folder="onCreateFolder"', '@rename="onRename"', '@delete="onDelete"')
  attrs.push('@open="openFile"', 'class="h-[560px]"')

  const handlers = [
    ...(draggable.value
      ? [`function onMove({ items, target }: FileExplorerMoveEvent) {
  // Persist the move, then update \`files\`.
}`]
      : []),
    ...(uploads.value
      ? [`function onUpload(uploaded: File[], folder: FileExplorerItem | null) {
  // Send to your storage, then add the new items under \`folder\`.
}

function onCreateFolder(parent: FileExplorerItem | null) {}

function onRename(item: FileExplorerItem, name: string) {}

// Called after the user confirms in the dialog.
function onDelete(items: FileExplorerItem[]) {}`]
      : []),
    `function openFile(item: FileExplorerItem) {
  router.push(\`/editor/\${encodeURIComponent(item.id)}\`)
}`,
  ]

  return `<script setup lang="ts">
import { ref } from 'vue'
import {
  FileExplorer,
  type FileExplorerItem,${draggable.value ? '\n  type FileExplorerMoveEvent,' : ''}
} from '@/components/ui/file-explorer'

const files = ref<FileExplorerItem[]>([
  {
    id: 'components',
    name: 'components',
    type: 'folder',
    children: [
      {
        id: 'components/ui',
        name: 'ui',
        type: 'folder',
        children: [
          {
            id: 'components/ui/FileExplorer.vue',
            name: 'FileExplorer.vue',
            type: 'file',
            size: 4300,
            modifiedAt: '2026-09-27T09:40:00Z',
            description: 'Vue 3 SFC',
            preview: '<template>\\n  <FileExplorer v-model="active" />',
          },
          {
            id: 'components/ui/hero-banner.png',
            name: 'hero-banner.png',
            type: 'file',
            size: 1468006,
            thumbnail: '/images/hero-banner.png',
          },
        ],
      },
    ],
  },
  { id: 'README.md', name: 'README.md', type: 'file', size: 3402 },
])

const folder = ref<string | null>('components/ui')
const selected = ref<string[]>([])

${handlers.join('\n\n')}
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
    description: 'Pass a nested tree to `items`. Every item needs a stable, unique `id`, a `name` and a `type`; folders hold `children`. The explorer handles browsing, selection and keyboard navigation on its own. Give it a height and it fills it.',
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
    title: 'Navigation',
    description: 'The open folder is an id (or `null` for the root), bound with `v-model:folder`. Double-click or Enter opens a folder; Back, Forward and Up work like a browser history, and every breadcrumb is clickable. Sync it with the URL to make locations shareable.',
    code: `<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const folder = computed({
  get: () => (route.query.folder as string) ?? null,
  set: id => router.push({ query: id ? { folder: id } : {} }),
})
<\/script>

<template>
  <FileExplorer v-model:folder="folder" :items="files" root-label="My Drive" />
</template>`,
  },
  {
    title: 'Selection and opening files',
    description: 'Selection is a list of ids in the open folder. With `multiple` (on by default) it behaves like a desktop: Ctrl/Cmd-click toggles, Shift-click selects a range, clicking empty space clears. Double-clicking a file, pressing Enter or using the status bar emits `open`.',
    code: `<script setup lang="ts">
const selected = ref<string[]>([])

function openFile(item: FileExplorerItem) {
  router.push(\`/editor/\${encodeURIComponent(item.id)}\`)
}
<\/script>

<template>
  <FileExplorer v-model:selected="selected" :items="files" @open="openFile" />
</template>`,
  },
  {
    title: 'Grid and details views',
    description: 'The toolbar switches between cards and a details list; bind `v-model:view` to control or persist it. The details view sorts by name, modified date, type or size (`v-model:sort`), always keeping folders first.',
    code: `<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import type { FileExplorerSort, FileExplorerView } from '@/components/ui/file-explorer'

const view = useStorage<FileExplorerView>('explorer-view', 'grid')
const sort = ref<FileExplorerSort>({ key: 'modified', direction: 'desc' })
<\/script>

<template>
  <FileExplorer v-model:view="view" v-model:sort="sort" :items="files" />
</template>`,
  },
  {
    title: 'Previews and metadata',
    description: 'Cards show whatever the item carries: `size` and `modifiedAt` in the footer, `description` as the subtitle (defaults to the file type), and either a `thumbnail` image or a few lines of `preview` text. Folders summarize their contents. Use the `#preview` slot for anything else, e.g. a waveform or a PDF page.',
    code: `<script setup lang="ts">
const files: FileExplorerItem<{ url: string }>[] = [
  {
    id: 'useFileSystem.ts',
    name: 'useFileSystem.ts',
    type: 'file',
    size: 2867,
    modifiedAt: new Date(),
    description: 'Composable hook',
    preview: 'export const useFS = () =>\\n  return { readTree }',
  },
  {
    id: 'hero.png',
    name: 'hero.png',
    type: 'file',
    size: 1468006,
    thumbnail: 'https://cdn.example.com/thumbs/hero.png',
  },
]
<\/script>

<template>
  <FileExplorer :items="files">
    <template #preview="{ item }">
      <AudioWaveform v-if="item.mimeType?.startsWith('audio/')" :src="item.data?.url" />
    </template>
  </FileExplorer>
</template>`,
  },
  {
    title: 'Uploads, new folders and deleting',
    description: 'The explorer never touches storage. Pass `@upload`, `@create-folder` and `@delete` and the matching UI appears: the Upload button, the drop tile and desktop file drops for uploads; the New Folder button; the Delete key. Each handler receives the destination folder (`null` for the root) or the selected items.',
    code: `<script setup lang="ts">
async function onUpload(uploaded: File[], folder: FileExplorerItem | null) {
  await Promise.all(uploaded.map(file => storage.put(folder?.id ?? '', file)))
  files.value = await storage.list()
}

async function onCreateFolder(parent: FileExplorerItem | null) {
  await storage.mkdir(parent?.id ?? '', 'New folder')
  files.value = await storage.list()
}

async function onDelete(items: FileExplorerItem[]) {
  if (!confirm(\`Delete \${items.length} item(s)?\`)) return
  await storage.remove(items.map(item => item.id))
  files.value = await storage.list()
}
<\/script>

<template>
  <FileExplorer
    :items="files"
    accept="image/*,.pdf"
    @upload="onUpload"
    @create-folder="onCreateFolder"
    @delete="onDelete"
  />
</template>`,
  },
  {
    title: 'Renaming',
    description: 'Pass `@rename` to enable inline renaming: F2, or `rename()` from the context menu, turns the name into an input with the base name selected. Enter or clicking away commits, Esc cancels. Empty names, slashes and duplicates in the same folder are refused with an inline message; add your own rules with `validate-name`. The handler receives the item and the trimmed new name.',
    code: `<script setup lang="ts">
async function onRename(item: FileExplorerItem, name: string) {
  await storage.rename(item.id, name)
  files.value = await storage.list()
}

const validateName = (name: string) =>
  /[<>:"|?*]/.test(name) ? 'Names cannot contain < > : " | ? *' : undefined
<\/script>

<template>
  <FileExplorer :items="files" :validate-name="validateName" @rename="onRename" />
</template>`,
  },
  {
    title: 'Confirming deletes',
    description: 'Delete — the key, `remove()` from the context menu or the exposed `remove(ids)` — opens a confirmation dialog that names the file, or counts the items and folders involved. Cancel has focus, so Enter never deletes by accident. `@delete` runs only once the user confirms. Reword the message with `#delete-description`, or turn the dialog off with `:confirm-delete="false"` when your app has its own undo or trash.',
    code: `<script setup lang="ts">
async function onDelete(items: FileExplorerItem[]) {
  await storage.moveToTrash(items.map(item => item.id))
  files.value = await storage.list()
}
<\/script>

<template>
  <FileExplorer :items="files" @delete="onDelete">
    <template #delete-description="{ items }">
      {{ items.length === 1 ? 'It' : 'They' }} will be moved to the trash for 30 days.
    </template>
  </FileExplorer>
</template>`,
  },
  {
    title: 'Context menu',
    description: 'Fill the `#context-menu` slot with shadcn-vue `ContextMenuItem`s. It opens for cards, rows, directory tree folders and the empty area (`item` is `null` there). Right-clicking outside the selection selects that item first. The scope also has `rename()` and `remove()`, which start the built-in inline rename and confirmed delete once the menu has closed.',
    code: `<script setup lang="ts">
import { ContextMenuItem, ContextMenuSeparator } from '@/components/ui/context-menu'
<\/script>

<template>
  <FileExplorer :items="files">
    <template #context-menu="{ item, rename, remove }">
      <template v-if="item">
        <ContextMenuItem @select="rename">Rename</ContextMenuItem>
        <ContextMenuItem @select="copyLink(item)">Copy link</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" @select="remove">Delete</ContextMenuItem>
      </template>
      <ContextMenuItem v-else @select="createFolder">New folder</ContextMenuItem>
    </template>
  </FileExplorer>
</template>`,
  },
  {
    title: 'Drag and drop',
    description: 'With `draggable`, cards and rows can be dropped onto folder cards, folders in the directory tree or any breadcrumb. Dragging a selected item drags the whole selection; hovering a closed tree folder opens it. The explorer emits `move` and leaves the data to you.',
    code: `<script setup lang="ts">
async function onMove({ items, target }: FileExplorerMoveEvent) {
  await storage.move(items.map(item => item.id), target?.id ?? '')
  files.value = await storage.list()
}
<\/script>

<template>
  <FileExplorer :items="files" draggable @move="onMove" />
</template>`,
  },
  {
    title: 'Toolbar and status bar',
    description: 'Add buttons to the toolbar with `#toolbar-actions`, and replace the status bar actions (an Open File link by default) with `#status-actions`, which receives the selected items.',
    code: `<template>
  <FileExplorer :items="files">
    <template #toolbar-actions>
      <Button size="sm" variant="ghost" @click="refresh">Refresh</Button>
    </template>

    <template #status-actions="{ items }">
      <button v-if="items.length === 1" @click="download(items[0])">Download</button>
    </template>
  </FileExplorer>
</template>`,
  },
  {
    title: 'Empty and loading states',
    description: '`loading` shows skeleton cards (or rows) and sets `aria-busy`. Empty folders and filters without matches show a message you can replace with the `#empty` slot.',
    code: `<script setup lang="ts">
const { data: files, pending } = await useFetch<FileExplorerItem[]>('/api/files', { default: () => [] })
<\/script>

<template>
  <FileExplorer :items="files" :loading="pending">
    <template #empty="{ query }">
      <p v-if="query">Nothing called “{{ query }}” here.</p>
      <p v-else>Nothing here yet — drop files to get started.</p>
    </template>
  </FileExplorer>
</template>`,
  },
  {
    title: 'FileTree on its own',
    description: 'The directory tree is exported as `FileTree`: a recursive, accessible tree built on Reka UI with id-based `v-model:selected` and `v-model:expanded`, search that reveals matches, item slots, a context menu and drag and drop. Use it for editor sidebars and navigation.',
    code: `<script setup lang="ts">
import { FileTree, formatBytes } from '@/components/ui/file-explorer'

const selected = ref<string[]>([])
const expanded = ref<string[]>(['src'])
<\/script>

<template>
  <FileTree
    v-model:selected="selected"
    v-model:expanded="expanded"
    :items="files"
    searchable
    class="h-80"
  >
    <template #actions="{ item }">
      <span class="opacity-0 group-hover/row:opacity-100">{{ formatBytes(item.size) }}</span>
    </template>
  </FileTree>
</template>`,
  },
]

// --- API reference -----------------------------------------------------------------

const props = [
  { name: 'items', type: 'FileExplorerItem<TData>[]', default: '[]', description: 'The whole tree. Never mutated.' },
  { name: 'folder', type: 'string | null', default: 'null', description: 'Open folder id, null for the root. Bind with v-model:folder. Unknown ids fall back to the root.' },
  { name: 'defaultFolder', type: 'string | null', default: 'null', description: 'Initial folder when folder is not bound.' },
  { name: 'selected', type: 'string[]', default: '—', description: 'Selected ids. Bind with v-model:selected. Cleared when the folder changes.' },
  { name: 'defaultSelected', type: 'string[]', default: '[]', description: 'Initial selection when selected is not bound.' },
  { name: 'view', type: '"grid" | "list"', default: '"grid"', description: 'Bind with v-model:view.' },
  { name: 'defaultView', type: '"grid" | "list"', default: '"grid"', description: 'Initial view when view is not bound.' },
  { name: 'search', type: 'string', default: '""', description: 'Filters the open folder by name. Bind with v-model:search. Cleared on navigation.' },
  { name: 'sort', type: 'FileExplorerSort', default: '{ key: "name", direction: "asc" }', description: 'Bind with v-model:sort. Folders always come first.' },
  { name: 'multiple', type: 'boolean', default: 'true', description: 'Ctrl/Cmd-click, Shift-click, Shift+Arrow and Ctrl/Cmd+A multi-selection.' },
  { name: 'draggable', type: 'boolean', default: 'false', description: 'Enables drag and drop onto folders, the tree and breadcrumbs. Listen to move.' },
  { name: 'sidebar', type: 'boolean', default: 'true', description: 'Shows the directory tree when the explorer is at least 48rem wide.' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Skeleton cards or rows, and aria-busy.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables every interaction.' },
  { name: 'rootLabel', type: 'string', default: '"root"', description: 'Name of the root in the breadcrumbs.' },
  { name: 'accept', type: 'string', default: '—', description: 'accept attribute of the upload picker.' },
  { name: 'validateName', type: '(name, item) => string | undefined', default: '—', description: 'Extra checks for renames. Return an error message to refuse a name.' },
  { name: 'confirmDelete', type: 'boolean', default: 'true', description: 'Ask for confirmation in a dialog before calling the delete handler.' },
  { name: 'getIcon', type: 'FileExplorerIconResolver<TData>', default: '—', description: 'Returns an icon component per item; undefined keeps the default type tile.' },
  { name: 'label', type: 'string', default: '"Files"', description: 'Accessible name of the item list.' },
  { name: 'class', type: 'HTMLAttributes["class"]', default: '—', description: 'Classes for the root. Give it a height.' },
]

const itemProps = [
  { name: 'id', type: 'string', description: 'Required. Stable and unique across the whole tree — never the name or an index.' },
  { name: 'name', type: 'string', description: 'Required. Displayed, filtered, sorted and used for type-ahead.' },
  { name: 'type', type: '"file" | "folder"', description: 'Required.' },
  { name: 'children', type: 'FileExplorerItem<TData>[]', description: 'A folder\'s contents. Omit or [] for an empty folder.' },
  { name: 'size', type: 'number', description: 'Bytes. Shown on cards, rows and in the status bar; used for sorting.' },
  { name: 'modifiedAt', type: 'Date | string', description: 'Shown as “10m ago”; used for sorting.' },
  { name: 'description', type: 'string', description: 'Card subtitle and details “Type” column. Defaults to the file type.' },
  { name: 'preview', type: 'string', description: 'The first lines are shown on the card with light syntax coloring.' },
  { name: 'thumbnail', type: 'string', description: 'Image URL shown on the card instead of preview.' },
  { name: 'mimeType', type: 'string', description: 'Shown in the status bar.' },
  { name: 'extension', type: 'string', description: 'Overrides the extension parsed from name.' },
  { name: 'disabled', type: 'boolean', description: 'Visible but cannot be selected, opened or dragged.' },
  { name: 'data', type: 'TData', description: 'Your own metadata, typed in slots and events.' },
]

const events = [
  { name: 'update:folder', payload: 'string | null', description: 'The open folder changed.' },
  { name: 'update:selected', payload: 'string[]', description: 'The selection changed.' },
  { name: 'update:view', payload: '"grid" | "list"', description: 'The view was switched.' },
  { name: 'update:search', payload: 'string', description: 'The filter changed.' },
  { name: 'update:sort', payload: 'FileExplorerSort', description: 'A details column header was clicked.' },
  { name: 'open', payload: 'FileExplorerItem<TData>', description: 'A file was opened (double-click, Enter or Open File).' },
  { name: 'move', payload: 'FileExplorerMoveEvent<TData>', description: '{ items, target } after a drop; target is null for the root breadcrumb.' },
  { name: 'upload', payload: '(files: File[], folder) => void', description: 'Handler. Enables the Upload button, drop tile and desktop drops.' },
  { name: 'create-folder', payload: '(parent) => void', description: 'Handler. Enables the New Folder button.' },
  { name: 'rename', payload: '(item, name) => void', description: 'Handler. Enables inline renaming (F2 and rename() in the context menu).' },
  { name: 'delete', payload: '(items) => void', description: 'Handler. Called after the confirmation dialog, for the Delete key or remove() in the context menu.' },
]

const slots = [
  { name: '#preview', payload: '{ item }', description: 'The preview area of a card.' },
  { name: '#context-menu', payload: '{ item, rename, remove }', description: 'Context menu entries; enables the menu. rename() and remove() run the built-in actions.' },
  { name: '#delete-description', payload: '{ items }', description: 'Body of the delete confirmation dialog.' },
  { name: '#empty', payload: '{ query }', description: 'Empty folder or filter without matches.' },
  { name: '#toolbar-actions', payload: '—', description: 'Extra toolbar buttons.' },
  { name: '#status-actions', payload: '{ items }', description: 'Right side of the status bar.' },
]

const keyboard = [
  { keys: ['← → ↑ ↓'], description: 'Move between items (in two dimensions in the grid) and select.' },
  { keys: ['Shift', 'Arrows'], description: 'Extend the selection from the anchor.' },
  { keys: ['Ctrl / ⌘', 'Arrows'], description: 'Move focus without selecting; Space then toggles.' },
  { keys: ['Home', 'End'], description: 'First / last item.' },
  { keys: ['Enter'], description: 'Open a folder, or emit open for a file.' },
  { keys: ['Backspace'], description: 'Up to the parent folder, selecting the folder you left.' },
  { keys: ['Alt', '← / → / ↑'], description: 'Back, forward, up.' },
  { keys: ['Ctrl / ⌘', 'A'], description: 'Select everything in the folder.' },
  { keys: ['Space'], description: 'Toggle the focused item in the selection.' },
  { keys: ['Esc'], description: 'Clear the selection (or the filter, in the filter field).' },
  { keys: ['F2'], description: 'Rename the focused item inline (Enter to save, Esc to cancel).' },
  { keys: ['Delete'], description: 'Delete the selection, after confirmation.' },
  { keys: ['a–z'], description: 'Jump to the next item whose name starts with the typed text.' },
]

const types = [
  { name: 'FileExplorerItem<TData>', description: 'A node of the tree.' },
  { name: 'FileExplorerView · FileExplorerSort', description: '"grid" | "list", and { key, direction }.' },
  { name: 'FileExplorerMoveEvent<TData>', description: 'Payload of move.' },
  { name: 'FileExplorerProps / Emits / Slots', description: 'The explorer contract, for wrappers.' },
  { name: 'FileTree · FileTreeProps / Emits / Slots', description: 'The standalone tree and its contract. It supports the same rename and delete handlers.' },
  { name: 'FileExplorerContextMenuSlotProps', description: '{ item, rename, remove }.' },
  { name: 'validateItemName(index, items, item, name)', description: 'The built-in name checks, for server-side reuse.' },
  { name: 'ref.rename(id) · ref.remove(ids)', description: 'Exposed on a template ref, e.g. for toolbar buttons.' },
  { name: 'formatBytes(bytes)', description: '1536 → "1.5 KB".' },
  { name: 'formatRelativeTime(date, now?)', description: '"just now", "10m ago", "3d ago".' },
  { name: 'getFileKind(item)', description: '{ label, badge, tone } used for tiles and the type column.' },
  { name: 'sortFileItems(items, sort)', description: 'Folders first, then by key, then by name.' },
  { name: 'indexFileTree(items)', description: 'Map of id → { item, parentId, depth }, for paths and parents.' },
  { name: 'filterFileTree(items, query)', description: 'The tree search as a pure function.' },
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
        A desktop-style file explorer: a directory tree, breadcrumbs with back and forward, grid and details views,
        desktop selection and keyboard shortcuts, context menus, drag and drop and uploads. It is a UI component — you
        bring the data and decide what every action does.
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

    <!-- File Structure -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">File Structure</h2>
      <p class="text-sm text-muted-foreground leading-relaxed">
        <code>FileExplorer</code> owns the state and composes small parts. The directory tree is <code>FileTree</code>,
        which renders one <code>FileTreeNode</code> per item; each node renders its children with another
        <code>FileTreeNode</code>. All state is keyed by id, so nothing copies or mutates your data.
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
        The items form a single-tab-stop <code>listbox</code> with <code>aria-selected</code> and
        <code>aria-multiselectable</code>. The directory tree is a separate tab stop following the WAI-ARIA tree pattern:
        arrows move and expand, Enter opens the folder.
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
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">{{ prop.name }}</code>
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

      <h3 class="text-2xl mt-8 mb-3 text-foreground">Events &amp; handlers</h3>
      <p class="text-sm text-muted-foreground leading-relaxed mb-2">
        <code>upload</code>, <code>create-folder</code>, <code>rename</code> and <code>delete</code> are declared as handler props, so the
        explorer can tell whether you listen and only shows those actions when you do.
      </p>
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
        Everything is exported from <code>@/components/ui/file-explorer</code>. Both components are generic over
        <code>TData</code>, inferred from <code>items</code>, so <code>item.data</code> is typed in slots and events.
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
      <div class="flex size-full flex-col gap-2 p-3 sm:p-4">
        <FileExplorer
          v-model:folder="folder"
          v-model:selected="selected"
          v-model:view="view"
          :items="files"
          :multiple="multiple"
          :draggable="draggable"
          :sidebar="sidebar"
          :loading="loading"
          :on-upload="uploads ? onUpload : undefined"
          :on-create-folder="uploads ? onCreateFolder : undefined"
          :on-delete="uploads ? onDelete : undefined"
          :on-rename="uploads ? onRename : undefined"
          label="Project files"
          class="min-h-0 w-full flex-1 shadow-sm"
          @move="onMove"
          @open="onOpen"
        >
          <template #status-actions="{ items }">
            <template v-if="items.length === 1 && items[0]?.type === 'file'">
              <button type="button" class="rounded-sm text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/50" @click="items[0] && onOpen(items[0])">
                Open File
              </button>
              <span aria-hidden="true">·</span>
              <button type="button" class="rounded-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50" @click="items[0] && download(items[0])">
                Download
              </button>
            </template>
            <span v-else-if="items.length > 1" class="tabular-nums">
              {{ formatBytes(items.reduce((sum, item) => sum + (item.size ?? 0), 0)) }}
            </span>
          </template>

          <template #context-menu="{ item, rename, remove }">
            <template v-if="item">
              <ContextMenuLabel class="max-w-56 truncate font-mono text-xs font-normal text-muted-foreground">
                {{ pathOf(item.id) }}
              </ContextMenuLabel>
              <template v-if="item.type === 'file'">
                <ContextMenuItem @select="onOpen(item)">
                  <ExternalLink />
                  Open
                  <ContextMenuShortcut>↵</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem @select="duplicate(item)">
                  <CopyPlus />
                  Duplicate
                </ContextMenuItem>
                <ContextMenuItem @select="download(item)">
                  <Download />
                  Download
                </ContextMenuItem>
              </template>
              <ContextMenuItem :disabled="!uploads" @select="rename">
                <PencilLine />
                Rename
                <ContextMenuShortcut>F2</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem @select="copyPath(item)">
                <Link />
                Copy path
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem variant="destructive" :disabled="!uploads" @select="remove">
                <Trash2 />
                Delete
                <ContextMenuShortcut>Del</ContextMenuShortcut>
              </ContextMenuItem>
            </template>
            <ContextMenuItem v-else :disabled="!uploads" @select="createFolderHere">
              <FolderPlus />
              New folder
            </ContextMenuItem>
          </template>
        </FileExplorer>
        <p class="h-4 shrink-0 truncate px-1 text-center font-mono text-[11px] text-muted-foreground" aria-live="polite">
          <template v-if="lastOpened">opened {{ lastOpened }}</template>
        </p>
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
        <label for="file-explorer-view" class="text-sm font-medium text-foreground">View</label>
        <div class="relative">
          <select id="file-explorer-view" v-model="view" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="grid">Grid</option>
            <option value="list">Details</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>
    </template>
  </DocContent>
</template>
