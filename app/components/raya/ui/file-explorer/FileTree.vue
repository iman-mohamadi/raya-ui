<script setup lang="ts" generic="TData = unknown">
import { computed, nextTick, ref, toRef, useSlots, useTemplateRef, watch } from 'vue'
import { ContextMenuContent, ContextMenuPortal, ContextMenuRoot, ContextMenuTrigger } from 'reka-ui'
import { useVModel } from '@vueuse/core'
import { FolderOpen, Search, X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import FileExplorerDeleteDialog from './FileExplorerDeleteDialog.vue'
import FileTreeRoot from './FileTreeRoot.vue'
import { injectSharedDragDrop, provideFileTreeContext, type FileExplorerDragDrop } from './context'
import type { FileTreeEmits, FileTreeProps, FileTreeSlots } from './types'
import { useFileExplorerActions } from './useFileExplorerActions'
import { useFileExplorerDragDrop } from './useFileExplorerDragDrop'
import { useFileExplorerSearch } from './useFileExplorerSearch'
import { useFileExplorerSelection } from './useFileExplorerSelection'
import { getVisibleIds, indexFileTree, isFolder, pruneFiles } from './utils'

const props = withDefaults(defineProps<FileTreeProps<TData>>(), {
  items: () => [],
  selected: undefined,
  expanded: undefined,
  search: undefined,
  searchPlaceholder: 'Search files…',
  size: 'md',
  guides: true,
  expandOnClick: true,
  label: 'Files',
  confirmDelete: true,
})

const emit = defineEmits<FileTreeEmits<TData>>()

const slots = useSlots()
defineSlots<FileTreeSlots<TData>>()

// --- Controlled / uncontrolled state ------------------------------------------

const selectedModel = useVModel(props, 'selected', emit, { passive: true, defaultValue: props.defaultSelected ?? [] })
const expandedModel = useVModel(props, 'expanded', emit, { passive: true, defaultValue: props.defaultExpanded ?? [] })
const searchModel = useVModel(props, 'search', emit, { passive: true, defaultValue: '' })

const selectedIds = computed<string[]>({
  get: () => selectedModel.value ?? [],
  set: (value) => { selectedModel.value = value },
})
const searchQuery = computed<string>({
  get: () => searchModel.value ?? '',
  set: (value) => { searchModel.value = value },
})

// --- Derived tree ---------------------------------------------------------------

const index = computed(() => indexFileTree(props.items))
const sourceItems = computed(() => (props.foldersOnly ? pruneFiles(props.items) : props.items))
const search = useFileExplorerSearch(sourceItems, searchQuery)
const displayItems = search.items

// While searching, folders on the way to a match open in a separate, throwaway
// state, so the consumer's `expanded` is exactly as they left it afterwards.
const searchExpanded = ref<string[]>([])
watch(search.revealIds, (revealIds) => {
  if (search.isSearching.value)
    searchExpanded.value = [...new Set([...(expandedModel.value ?? []), ...revealIds])]
}, { immediate: true })

const expandedIds = computed(() => (search.isSearching.value ? searchExpanded.value : expandedModel.value ?? []))
const expandedSet = computed(() => new Set(expandedIds.value))

function setExpanded(ids: string[]) {
  if (search.isSearching.value) searchExpanded.value = ids
  else expandedModel.value = ids
}

function toggleExpanded(id: string) {
  setExpanded(expandedSet.value.has(id) ? expandedIds.value.filter(value => value !== id) : [...expandedIds.value, id])
}

const visibleIds = computed(() => getVisibleIds(displayItems.value, expandedSet.value))
const selectedItems = computed(() => selectedIds.value.flatMap((id) => {
  const item = index.value.get(id)?.item
  return item ? [item] : []
}))

// --- Selection --------------------------------------------------------------------

const selection = useFileExplorerSelection({
  selected: selectedIds,
  multiple: toRef(props, 'multiple'),
  visibleIds,
  isSelectable: id => index.value.get(id)?.item.disabled !== true,
})

function onItemSelect(id: string, event: Event) {
  const item = index.value.get(id)?.item
  if (!item || props.disabled) return

  if (event instanceof KeyboardEvent) {
    if (event.key === ' ' && props.multiple) selection.toggle(id)
    else selection.replace(id)

    if (event.key === 'Enter') {
      if (isFolder(item)) {
        if (props.expandOnClick) toggleExpanded(id)
      }
      else emit('open', item)
    }
  }
  else if (event instanceof MouseEvent && props.multiple && event.shiftKey) {
    selection.extend(id)
  }
  else if (event instanceof MouseEvent && props.multiple && (event.metaKey || event.ctrlKey)) {
    selection.toggle(id)
  }
  else {
    selection.replace(id)
  }

  emit('select', { item, selected: selectedIds.value, originalEvent: event })
}

function onItemOpen(id: string) {
  const item = index.value.get(id)?.item
  if (item && !isFolder(item) && !props.disabled) emit('open', item)
}

// --- Context menu ---------------------------------------------------------------

const hasContextMenu = computed(() => Boolean(slots['context-menu']))
const contextItemId = ref<string | null>(null)
const contextItem = computed(() => (contextItemId.value === null ? null : index.value.get(contextItemId.value)?.item ?? null))

function onItemContextMenu(id: string) {
  contextItemId.value = id
  // Right-clicking outside the selection acts on that item alone, like a desktop file manager.
  if (hasContextMenu.value && !selectedIds.value.includes(id) && index.value.get(id)?.item.disabled !== true)
    selection.replace(id)
}

// --- Rename & delete ----------------------------------------------------------------

const viewport = useTemplateRef<HTMLElement>('viewport')

function focusItem(id: string) {
  nextTick(() => {
    const items = viewport.value?.querySelectorAll<HTMLElement>('[role="treeitem"][data-item-id]') ?? []
    Array.from(items).find(el => el.dataset.itemId === id)?.focus()
  })
}

const actions = useFileExplorerActions({
  index,
  rootItems: () => props.items,
  selected: selectedIds,
  onRename: () => props.onRename,
  validateName: () => props.validateName,
  onDelete: () => props.onDelete,
  confirmDelete: () => props.confirmDelete,
  disabled: () => props.disabled,
  focus: focusItem,
})

/** Delete acts on the selection when the focused item is part of it, else on the focused item. */
function deleteFrom(id: string) {
  const item = index.value.get(id)?.item
  if (item) actions.requestDelete(actions.targetsOf(item))
}

// --- Drag and drop --------------------------------------------------------------

const dragDropEnabled = computed(() => props.draggable && !props.disabled)
// Inside a FileExplorer the tree joins the explorer's drag session.
const dragDrop: FileExplorerDragDrop = injectSharedDragDrop(null) ?? useFileExplorerDragDrop({
  enabled: dragDropEnabled,
  index,
  selected: selectedIds,
  isExpanded: id => expandedSet.value.has(id),
  expand: (id) => {
    if (!expandedSet.value.has(id)) setExpanded([...expandedIds.value, id])
  },
  onMove: event => emit('move', event),
})

// --- Search field ---------------------------------------------------------------

function onSearchKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    const target = viewport.value?.querySelector<HTMLElement>('[role="treeitem"][tabindex="0"]')
      ?? viewport.value?.querySelector<HTMLElement>('[role="treeitem"]')
    if (target) {
      event.preventDefault()
      target.focus()
    }
  }
  else if (event.key === 'Escape' && searchQuery.value) {
    event.preventDefault()
    searchQuery.value = ''
  }
}

const skeletonRows = [
  { depth: 0, width: 'w-20' },
  { depth: 1, width: 'w-28' },
  { depth: 2, width: 'w-24' },
  { depth: 2, width: 'w-16' },
  { depth: 1, width: 'w-32' },
  { depth: 0, width: 'w-16' },
] as const

provideFileTreeContext({
  query: search.query,
  size: toRef(props, 'size'),
  guides: toRef(props, 'guides'),
  draggable: dragDropEnabled,
  dragDrop,
  foldersOnly: toRef(props, 'foldersOnly'),
  expandOnClick: toRef(props, 'expandOnClick'),
  onItemSelect,
  onItemOpen,
  onItemContextMenu,
  extendSelection: selection.extend,
  selectAll: selection.selectAll,
  startRename: actions.startRename,
  deleteFrom,
  renamingId: actions.renamingId,
  validateRename: actions.validateRename,
  commitRename: actions.commitRename,
  cancelRename: actions.cancelRename,
})
</script>

<template>
  <div
    data-slot="file-tree"
    :class="cn('flex min-h-0 flex-col gap-2 text-sm [--file-tree-indent:1rem]', props.class)"
    :data-disabled="disabled ? '' : undefined"
  >
    <div v-if="searchable" data-slot="file-tree-search" class="relative shrink-0">
      <Search aria-hidden="true" class="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <input
        v-model="searchQuery"
        type="text"
        role="searchbox"
        autocomplete="off"
        spellcheck="false"
        :aria-label="searchPlaceholder"
        :placeholder="searchPlaceholder"
        :disabled="disabled"
        :class="cn(
          'h-8 w-full min-w-0 rounded-md border border-input bg-transparent ps-8 pe-8 text-sm shadow-xs outline-none',
          'transition-[color,box-shadow] placeholder:text-muted-foreground dark:bg-input/30',
          'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )"
        @keydown="onSearchKeydown"
      >
      <button
        v-if="searchQuery"
        type="button"
        aria-label="Clear search"
        class="absolute end-1.5 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
        @click="searchQuery = ''"
      >
        <X aria-hidden="true" class="size-3.5" />
      </button>
    </div>

    <ContextMenuRoot>
      <ContextMenuTrigger as-child :disabled="!hasContextMenu || loading || disabled">
        <div
          ref="viewport"
          data-slot="file-tree-viewport"
          :aria-busy="loading ? 'true' : undefined"
          :data-drop-target="dragDrop.dropTargetId.value === null ? '' : undefined"
          class="relative min-h-0 flex-1 overflow-y-auto rounded-md p-px data-[drop-target]:bg-primary/5 data-[drop-target]:ring-1 data-[drop-target]:ring-inset data-[drop-target]:ring-primary/30"
          @contextmenu.capture="contextItemId = null"
          @dragover="dragDrop.onDragOver(null, $event)"
          @dragleave="dragDrop.onDragLeave"
          @drop="dragDrop.onDrop"
        >
          <slot v-if="loading" name="loading">
            <div role="status" aria-label="Loading files" class="flex flex-col">
              <div
                v-for="(row, i) in skeletonRows"
                :key="i"
                :style="{ '--file-tree-depth': row.depth }"
                :class="cn(
                  'flex items-center gap-2 ps-[calc(var(--file-tree-depth)_*_var(--file-tree-indent)_+_1.5rem)]',
                  size === 'sm' ? 'h-6' : 'h-7',
                )"
              >
                <div class="size-4 shrink-0 animate-pulse rounded-sm bg-accent motion-reduce:animate-none" />
                <div :class="cn('h-3 animate-pulse rounded-sm bg-accent motion-reduce:animate-none', row.width)" />
              </div>
            </div>
          </slot>

          <slot v-else-if="!displayItems.length" name="empty" :query="search.query.value">
            <div class="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
              <FolderOpen aria-hidden="true" class="size-5 text-muted-foreground/70" />
              <p class="text-sm text-muted-foreground">
                <template v-if="search.query.value">
                  No results for “{{ search.query.value }}”
                </template>
                <template v-else>
                  No files
                </template>
              </p>
            </div>
          </slot>

          <FileTreeRoot
            v-else
            :items="displayItems"
            :expanded="expandedIds"
            :selected-items="selectedItems"
            :multiple="multiple"
            :disabled="disabled"
            :get-icon="getIcon"
            :aria-label="label"
            @update:expanded="setExpanded"
          >
            <template v-if="$slots.item" #item="scope">
              <slot name="item" v-bind="scope" />
            </template>
            <template v-if="$slots.icon" #icon="scope">
              <slot name="icon" v-bind="scope" />
            </template>
            <template v-if="$slots.label" #label="scope">
              <slot name="label" v-bind="scope" />
            </template>
            <template v-if="$slots.actions" #actions="scope">
              <slot name="actions" v-bind="scope" />
            </template>
          </FileTreeRoot>
        </div>
      </ContextMenuTrigger>

      <ContextMenuPortal v-if="hasContextMenu">
        <ContextMenuContent
          data-slot="file-tree-context-menu"
          @close-auto-focus="actions.onMenuCloseAutoFocus"
          :class="cn(
            'z-50 max-h-(--reka-context-menu-content-available-height) min-w-[8rem] origin-(--reka-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto',
            'rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          )"
        >
          <slot name="context-menu" v-bind="actions.menuScope(contextItem)" />
        </ContextMenuContent>
      </ContextMenuPortal>
    </ContextMenuRoot>

    <FileExplorerDeleteDialog
      :items="actions.pendingDelete.value"
      @confirm="actions.confirmDelete"
      @close="actions.closeDelete"
    >
      <template v-if="$slots['delete-description']" #description="scope">
        <slot name="delete-description" v-bind="scope" />
      </template>
    </FileExplorerDeleteDialog>
  </div>
</template>
