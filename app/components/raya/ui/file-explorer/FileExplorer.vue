<script setup lang="ts" generic="TData = unknown">
import { computed, ref, toRef, useSlots, useTemplateRef, watch } from 'vue'
import { ContextMenuContent, ContextMenuPortal, ContextMenuRoot, ContextMenuTrigger } from 'reka-ui'
import { useVModel } from '@vueuse/core'
import { FolderOpen, Search, X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import FileExplorerTree from './FileExplorerTree.vue'
import { provideFileExplorerContext } from './context'
import type { FileExplorerEmits, FileExplorerProps, FileExplorerSlots } from './types'
import { useFileExplorerDragDrop } from './useFileExplorerDragDrop'
import { useFileExplorerSearch } from './useFileExplorerSearch'
import { useFileExplorerSelection } from './useFileExplorerSelection'
import { getVisibleIds, indexFileTree, isFolder } from './utils'

const props = withDefaults(defineProps<FileExplorerProps<TData>>(), {
  items: () => [],
  selected: undefined,
  expanded: undefined,
  search: undefined,
  searchPlaceholder: 'Search files…',
  size: 'md',
  guides: true,
  label: 'Files',
})

const emit = defineEmits<FileExplorerEmits<TData>>()

const slots = useSlots()
defineSlots<FileExplorerSlots<TData>>()

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
const search = useFileExplorerSearch(toRef(props, 'items'), searchQuery)
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
      if (isFolder(item)) toggleExpanded(id)
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

// --- Drag and drop --------------------------------------------------------------

const dragDropEnabled = computed(() => props.draggable && !props.disabled)
const dragDrop = useFileExplorerDragDrop({
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

const viewport = useTemplateRef<HTMLElement>('viewport')

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

provideFileExplorerContext({
  query: search.query,
  size: toRef(props, 'size'),
  guides: toRef(props, 'guides'),
  draggable: dragDropEnabled,
  dropTargetId: dragDrop.dropTargetId,
  draggingIds: dragDrop.draggingIds,
  onItemSelect,
  onItemOpen,
  onItemContextMenu,
  extendSelection: selection.extend,
  selectAll: selection.selectAll,
  onDragStart: dragDrop.onDragStart,
  onDragOver: dragDrop.onDragOver,
  onDrop: dragDrop.onDrop,
  onDragEnd: dragDrop.onDragEnd,
})
</script>

<template>
  <div
    data-slot="file-explorer"
    :class="cn('flex min-h-0 flex-col gap-2 text-sm [--file-explorer-indent:1rem]', props.class)"
    :data-disabled="disabled ? '' : undefined"
  >
    <div v-if="searchable" data-slot="file-explorer-search" class="relative shrink-0">
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
          data-slot="file-explorer-viewport"
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
                :style="{ '--file-explorer-depth': row.depth }"
                :class="cn(
                  'flex items-center gap-2 ps-[calc(var(--file-explorer-depth)_*_var(--file-explorer-indent)_+_1.5rem)]',
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

          <FileExplorerTree
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
          </FileExplorerTree>
        </div>
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
  </div>
</template>
