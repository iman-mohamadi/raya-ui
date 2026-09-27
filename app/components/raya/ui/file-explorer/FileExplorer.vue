<script setup lang="ts" generic="TData = unknown">
import { computed, nextTick, ref, useSlots, useTemplateRef, watch, type ComponentPublicInstance } from 'vue'
import { ContextMenuContent, ContextMenuPortal, ContextMenuRoot, ContextMenuTrigger } from 'reka-ui'
import { useNow, useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'
import FileExplorerContent from './FileExplorerContent.vue'
import FileExplorerSidebar from './FileExplorerSidebar.vue'
import FileExplorerStatusBar from './FileExplorerStatusBar.vue'
import FileExplorerToolbar from './FileExplorerToolbar.vue'
import { provideFileExplorerContext, provideSharedDragDrop } from './context'
import type {
  FileExplorerEmits,
  FileExplorerItem,
  FileExplorerProps,
  FileExplorerSlots,
  FileExplorerSort,
  FileExplorerView,
} from './types'
import { useFileExplorerDragDrop } from './useFileExplorerDragDrop'
import { useFileExplorerKeyboard } from './useFileExplorerKeyboard'
import { useFileExplorerNavigation } from './useFileExplorerNavigation'
import { useFileExplorerSelection } from './useFileExplorerSelection'
import { formatBytes, indexFileTree, isFolder, sortFileItems } from './utils'

const props = withDefaults(defineProps<FileExplorerProps<TData>>(), {
  items: () => [],
  folder: undefined,
  selected: undefined,
  view: undefined,
  search: undefined,
  sort: undefined,
  multiple: true,
  sidebar: true,
  rootLabel: 'root',
  label: 'Files',
})

const emit = defineEmits<FileExplorerEmits<TData>>()

const slots = useSlots()
defineSlots<FileExplorerSlots<TData>>()

// --- Controlled / uncontrolled state ------------------------------------------

const folderModel = useVModel(props, 'folder', emit, { passive: true, defaultValue: props.defaultFolder ?? null })
const selectedModel = useVModel(props, 'selected', emit, { passive: true, defaultValue: props.defaultSelected ?? [] })
const viewModel = useVModel(props, 'view', emit, { passive: true, defaultValue: props.defaultView ?? 'grid' })
const searchModel = useVModel(props, 'search', emit, { passive: true, defaultValue: '' })
const sortModel = useVModel(props, 'sort', emit, { passive: true, defaultValue: { key: 'name', direction: 'asc' } })

const folderId = computed<string | null>({
  get: () => folderModel.value ?? null,
  set: (value) => { folderModel.value = value },
})
const selectedIds = computed<string[]>({
  get: () => selectedModel.value ?? [],
  set: (value) => { selectedModel.value = value },
})
const view = computed<FileExplorerView>({
  get: () => viewModel.value ?? 'grid',
  set: (value) => { viewModel.value = value },
})
const search = computed<string>({
  get: () => searchModel.value ?? '',
  set: (value) => { searchModel.value = value },
})
const sort = computed<FileExplorerSort>({
  get: () => sortModel.value ?? { key: 'name', direction: 'asc' },
  set: (value) => { sortModel.value = value },
})

// --- Folder contents ---------------------------------------------------------------

const index = computed(() => indexFileTree(props.items))
const navigation = useFileExplorerNavigation({ folder: folderId, index })

const currentFolder = computed(() => (navigation.current.value === null ? null : index.value.get(navigation.current.value)?.item ?? null))
const path = computed(() => navigation.path.value.flatMap((id) => {
  const item = index.value.get(id)?.item
  return item ? [item] : []
}))

const query = computed(() => search.value.trim())
const contentItems = computed(() => {
  const children = currentFolder.value ? currentFolder.value.children ?? [] : props.items
  const needle = query.value.toLowerCase()
  const filtered = needle ? children.filter(item => item.name.toLowerCase().includes(needle)) : children
  return sortFileItems(filtered, sort.value)
})
const contentIds = computed(() => contentItems.value.map(item => item.id))

// --- Selection & focus ----------------------------------------------------------

const isSelectable = (id: string) => {
  const item = index.value.get(id)?.item
  return item !== undefined && !item.disabled
}

const selection = useFileExplorerSelection({
  selected: selectedIds,
  multiple: computed(() => props.multiple),
  visibleIds: contentIds,
  isSelectable,
})

const selectedSet = computed(() => new Set(selectedIds.value))
const selectedItems = computed(() => selectedIds.value.flatMap((id) => {
  const item = index.value.get(id)?.item
  return item ? [item] : []
}))
const selectedSize = computed(() => {
  const files = selectedItems.value.filter(item => !isFolder(item))
  return files.length ? formatBytes(files.reduce((sum, item) => sum + (item.size ?? 0), 0)) : ''
})

const content = useTemplateRef<ComponentPublicInstance>('content')
const contentElement = computed<HTMLElement | null>(() => {
  const el: unknown = content.value?.$el
  return el instanceof HTMLElement ? el : null
})

// The roving tab stop: the last focused item, else the first selected one, else the first.
const lastFocusedId = ref<string | null>(null)
const focusedId = computed<string | null>({
  get: () => {
    const ids = contentIds.value
    if (lastFocusedId.value !== null && ids.includes(lastFocusedId.value)) return lastFocusedId.value
    return ids.find(id => selectedSet.value.has(id)) ?? ids[0] ?? null
  },
  set: (value) => { lastFocusedId.value = value },
})

function findItemElement(id: string) {
  const elements = contentElement.value?.querySelectorAll<HTMLElement>('[role="option"][data-item-id]') ?? []
  return Array.from(elements).find(el => el.dataset.itemId === id)
}

function focusItem(id: string) {
  lastFocusedId.value = id
  nextTick(() => findItemElement(id)?.focus())
}

/** Cards per row, measured from the rendered grid. */
function gridColumns(): number {
  const options = Array.from(contentElement.value?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])
  const top = options[0]?.offsetTop
  const perRow = options.filter(option => option.offsetTop === top).length
  return Math.max(1, perRow)
}

// --- Navigation --------------------------------------------------------------------

// Leaving a folder resets the selection; going Up selects the folder you came from.
let pendingSelection: string | null = null
watch(navigation.current, () => {
  const hadFocus = contentElement.value?.contains(document.activeElement) ?? false
  selectedIds.value = pendingSelection === null ? [] : [pendingSelection]
  lastFocusedId.value = pendingSelection
  selection.anchor.value = pendingSelection
  pendingSelection = null
  search.value = ''
  if (hadFocus) {
    nextTick(() => {
      const id = focusedId.value
      if (id !== null) findItemElement(id)?.focus()
      else contentElement.value?.focus()
    })
  }
})

function goUp() {
  if (!navigation.canGoUp.value) return
  pendingSelection = navigation.current.value
  navigation.up()
}

function openItem(id: string) {
  const item = index.value.get(id)?.item
  if (!item || item.disabled || props.disabled) return
  if (isFolder(item)) navigation.navigate(id)
  else emit('open', item)
}

// Keep the directory tree open down to the current folder.
const treeExpanded = ref<string[]>([])
watch(navigation.path, (ids) => {
  const missing = ids.filter(id => !treeExpanded.value.includes(id))
  if (missing.length) treeExpanded.value = [...treeExpanded.value, ...missing]
}, { immediate: true })

// --- Pointer & keyboard ---------------------------------------------------------

function onItemClick(id: string, event: MouseEvent) {
  if (props.disabled || !isSelectable(id)) return
  lastFocusedId.value = id
  if (props.multiple && event.shiftKey) selection.extend(id)
  else if (props.multiple && (event.metaKey || event.ctrlKey)) selection.toggle(id)
  else selection.replace(id)
}

function onContentClick(event: MouseEvent) {
  // A click on empty space clears the selection, as on a desktop.
  if (event.target instanceof Element && !event.target.closest('[role="option"], button')) selection.clear()
}

const keyboard = useFileExplorerKeyboard({
  ids: contentIds,
  focusedId,
  view,
  multiple: computed(() => props.multiple),
  isSelectable,
  nameOf: id => index.value.get(id)?.item.name ?? '',
  columns: gridColumns,
  focus: focusItem,
  replace: selection.replace,
  toggle: selection.toggle,
  extend: selection.extend,
  selectAll: selection.selectAll,
  clear: selection.clear,
  open: openItem,
  back: navigation.back,
  forward: navigation.forward,
  up: goUp,
  remove: () => {
    if (props.onDelete && selectedItems.value.length) props.onDelete(selectedItems.value)
  },
})

function onContentKeydown(event: KeyboardEvent) {
  if (props.disabled || props.loading) return
  // Let buttons (the drop tile, sort headers) handle their own keys.
  if (event.target instanceof Element && event.target.closest('button')) return
  keyboard.onKeydown(event)
}

// --- Uploads -------------------------------------------------------------------------

const uploadable = computed(() => Boolean(props.onUpload) && !props.disabled)
const fileInput = useTemplateRef<HTMLInputElement>('fileInput')
const externalDrag = ref(false)

function upload(files: File[]) {
  if (files.length && props.onUpload) props.onUpload(files, currentFolder.value)
}

function onFileInput(event: Event) {
  if (!(event.target instanceof HTMLInputElement)) return
  upload(Array.from(event.target.files ?? []))
  event.target.value = ''
}

// --- Drag and drop -----------------------------------------------------------------

const dragDropEnabled = computed(() => props.draggable && !props.disabled)
const dragDrop = useFileExplorerDragDrop({
  enabled: dragDropEnabled,
  index,
  selected: selectedIds,
  isExpanded: id => treeExpanded.value.includes(id),
  expand: (id) => {
    if (!treeExpanded.value.includes(id)) treeExpanded.value = [...treeExpanded.value, id]
  },
  onMove: event => emit('move', event),
})
provideSharedDragDrop(dragDrop)

const isExternalDrag = (event: DragEvent) =>
  !dragDrop.draggingIds.value.length && Boolean(event.dataTransfer?.types.includes('Files'))

function onContentDragOver(event: DragEvent) {
  if (isExternalDrag(event)) {
    if (!uploadable.value) return
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
    externalDrag.value = true
    return
  }
  // Empty space targets the open folder, where the items already are: refused,
  // which also clears any folder highlight left behind.
  dragDrop.onDragOver(navigation.current.value, event)
}

function onContentDragLeave(event: DragEvent) {
  const next = event.relatedTarget
  if (!(next instanceof Node && event.currentTarget instanceof Node && event.currentTarget.contains(next)))
    externalDrag.value = false
  dragDrop.onDragLeave(event)
}

function onContentDrop(event: DragEvent) {
  if (externalDrag.value) {
    event.preventDefault()
    externalDrag.value = false
    upload(Array.from(event.dataTransfer?.files ?? []))
    return
  }
  dragDrop.onDrop(event)
}

// --- Context menu -------------------------------------------------------------------

const hasContextMenu = computed(() => Boolean(slots['context-menu']))
const contextItemId = ref<string | null>(null)
const contextItem = computed<FileExplorerItem<TData> | null>(() =>
  contextItemId.value === null ? null : index.value.get(contextItemId.value)?.item ?? null)

function onItemContextMenu(id: string) {
  contextItemId.value = id
  lastFocusedId.value = id
  if (!selectedSet.value.has(id) && isSelectable(id)) selection.replace(id)
}

provideFileExplorerContext({
  selected: selectedSet,
  focusedId,
  now: useNow({ interval: 60_000 }),
  draggable: dragDropEnabled,
  dragDrop,
  onItemClick,
  onItemOpen: openItem,
  onItemContextMenu,
})
</script>

<template>
  <div
    data-slot="file-explorer"
    :data-disabled="disabled ? '' : undefined"
    :class="cn(
      '@container flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card text-sm text-card-foreground',
      disabled && 'pointer-events-none opacity-60',
      props.class,
    )"
  >
    <FileExplorerToolbar
      v-model:search="search"
      v-model:view="view"
      :path="path"
      :root-label="rootLabel"
      :item-count="contentItems.length"
      :can-go-back="navigation.canGoBack.value"
      :can-go-forward="navigation.canGoForward.value"
      :can-go-up="navigation.canGoUp.value"
      :show-new-folder="Boolean(onCreateFolder)"
      :show-upload="uploadable"
      :disabled="disabled"
      @back="navigation.back"
      @forward="navigation.forward"
      @up="goUp"
      @navigate="navigation.navigate"
      @new-folder="onCreateFolder?.(currentFolder)"
      @upload="fileInput?.click()"
    >
      <template v-if="$slots['toolbar-actions']" #actions>
        <slot name="toolbar-actions" />
      </template>
    </FileExplorerToolbar>

    <div class="flex min-h-0 flex-1">
      <FileExplorerSidebar
        v-if="sidebar"
        v-model:expanded="treeExpanded"
        :items="items"
        :folder="navigation.current.value"
        :item-count="contentItems.length"
        :selected-size="selectedSize"
        :draggable="dragDropEnabled"
        :disabled="disabled"
        :get-icon="getIcon"
        @navigate="navigation.navigate"
      >
        <template v-if="hasContextMenu" #context-menu="scope">
          <slot name="context-menu" v-bind="scope" />
        </template>
      </FileExplorerSidebar>

      <div class="flex min-w-0 flex-1 flex-col">
        <ContextMenuRoot>
          <ContextMenuTrigger as-child :disabled="!hasContextMenu || loading || disabled">
            <FileExplorerContent
              ref="content"
              tabindex="-1"
              :items="contentItems"
              :view="view"
              :sort="sort"
              :query="query"
              :loading="loading"
              :multiple="multiple"
              :uploadable="uploadable"
              :external-drag="externalDrag"
              :folder-name="currentFolder?.name ?? rootLabel"
              :label="label"
              :get-icon="getIcon"
              class="outline-none"
              @update:sort="sort = $event"
              @pick="fileInput?.click()"
              @click="onContentClick"
              @keydown="onContentKeydown"
              @contextmenu.capture="contextItemId = null"
              @dragover="onContentDragOver"
              @dragleave="onContentDragLeave"
              @drop="onContentDrop"
            >
              <template v-if="$slots.preview" #preview="scope">
                <slot name="preview" v-bind="scope" />
              </template>
              <template v-if="$slots.empty" #empty="scope">
                <slot name="empty" v-bind="scope" />
              </template>
            </FileExplorerContent>
          </ContextMenuTrigger>

          <ContextMenuPortal v-if="hasContextMenu">
            <ContextMenuContent
              data-slot="file-explorer-context-menu"
              :class="cn(
                'z-50 max-h-(--reka-context-menu-content-available-height) min-w-[8rem] origin-(--reka-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto',
                'rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
                'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
              )"
            >
              <slot name="context-menu" :item="contextItem" />
            </ContextMenuContent>
          </ContextMenuPortal>
        </ContextMenuRoot>

        <FileExplorerStatusBar :selected-items="selectedItems" :item-count="contentItems.length" @open="emit('open', $event)">
          <template v-if="$slots['status-actions']" #actions="scope">
            <slot name="status-actions" v-bind="scope" />
          </template>
        </FileExplorerStatusBar>
      </div>
    </div>

    <input
      v-if="uploadable"
      ref="fileInput"
      type="file"
      multiple
      :accept="accept"
      class="sr-only"
      tabindex="-1"
      aria-hidden="true"
      @change="onFileInput"
    >
  </div>
</template>
