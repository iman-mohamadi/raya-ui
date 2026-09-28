<script setup lang="ts" generic="TData">
import { cn } from '@/lib/utils'
import FileTree from './FileTree.vue'
import { injectFileExplorerContext } from './context'
import type {
  FileExplorerContextMenuSlotProps,
  FileExplorerIconResolver,
  FileExplorerItem,
  FileExplorerLocation,
  FileExplorerLocationSection,
  FileExplorerNameValidator,
  FileExplorerOperationContext,
  FileExplorerSelectEvent,
} from './types'

defineProps<{
  items: FileExplorerItem<TData>[]
  /** The open folder, highlighted in the tree. */
  folder: string | null
  /** The active location without a folder, if any. */
  location: string | null
  locations: FileExplorerLocationSection[]
  itemCount: number
  /** Formatted size of the selected files, if any. */
  selectedSize: string
  draggable: boolean
  disabled: boolean
  dir: 'ltr' | 'rtl'
  /** Shown as an overlay on narrow explorers. */
  open: boolean
  getIcon?: FileExplorerIconResolver<TData>
  onRename?: (item: FileExplorerItem<TData>, name: string) => void
  validateName?: FileExplorerNameValidator<TData>
  /** The explorer's own delete flow, which already confirms. */
  onDelete?: (items: FileExplorerItem<TData>[]) => void
  onLoadChildren?: (folder: FileExplorerItem<TData>, context: FileExplorerOperationContext<TData>) => unknown
  /** Whether right-clicking the empty part of the tree has anything to offer. */
  backgroundMenu: boolean
  /** Whether a location accepts the items being dragged. */
  canDropOnLocation: (location: FileExplorerLocation) => boolean
}>()

const expanded = defineModel<string[]>('expanded', { required: true })

// Two roots (backdrop + panel): listeners such as @keydown go on the panel.
defineOptions({ inheritAttrs: false })

const emit = defineEmits<{
  navigate: [id: string]
  selectLocation: [location: FileExplorerLocation]
  dropOnLocation: [location: FileExplorerLocation, event: DragEvent]
  close: []
}>()

defineSlots<{
  'context-menu'?: (props: FileExplorerContextMenuSlotProps<TData>) => unknown
}>()

const ctx = injectFileExplorerContext()

function onSelect(event: FileExplorerSelectEvent<TData>) {
  if (event.item.type === 'folder') emit('navigate', event.item.id)
}

function isActive(entry: FileExplorerLocation, folder: string | null, location: string | null) {
  if (entry.folder !== undefined) return location === null && entry.folder === folder
  return location === entry.id
}

function onLocationDragOver(entry: FileExplorerLocation, event: DragEvent, canDrop: (location: FileExplorerLocation) => boolean) {
  if (entry.folder !== undefined) {
    ctx.dragDrop.onDragOver(entry.folder, event)
    event.stopPropagation()
    return
  }
  if (!canDrop(entry)) return
  event.preventDefault()
  event.stopPropagation()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
}

function onLocationDrop(entry: FileExplorerLocation, event: DragEvent) {
  event.stopPropagation()
  if (entry.folder !== undefined) ctx.dragDrop.onDrop(event)
  else emit('dropOnLocation', entry, event)
}

// Right-clicks on empty tree space with nothing to offer get the browser's own menu.
function onContextMenuCapture(event: MouseEvent, backgroundMenu: boolean) {
  if (backgroundMenu) return
  if (event.target instanceof Element && event.target.closest('[role="treeitem"]')) return
  event.stopPropagation()
}
</script>

<template>
  <div
    v-if="open"
    aria-hidden="true"
    class="absolute inset-0 z-20 bg-black/20 @3xl:hidden"
    @click="emit('close')"
  />
  <aside
    v-bind="$attrs"
    data-slot="file-explorer-sidebar"
    :aria-label="ctx.messages.value.directoryTree"
    :data-open="open ? '' : undefined"
    :class="cn(
      'hidden w-56 shrink-0 flex-col border-e border-border bg-card @3xl:flex @5xl:w-60',
      open && 'absolute inset-y-0 start-0 z-30 flex shadow-lg @3xl:static @3xl:shadow-none',
    )"
    @keydown.escape="open && emit('close')"
  >
    <nav v-if="locations.length" class="flex flex-col gap-3 px-2 pt-3" :aria-label="ctx.messages.value.folders">
      <div v-for="(section, s) in locations" :key="section.id ?? s" class="flex flex-col gap-0.5">
        <p v-if="section.label" class="px-2 pb-1 font-mono text-[11px] uppercase tracking-wider rtl:tracking-normal text-muted-foreground">
          {{ section.label }}
        </p>
        <button
          v-for="entry in section.locations"
          :key="entry.id"
          type="button"
          :data-location="entry.id"
          :disabled="disabled || entry.disabled"
          :aria-current="isActive(entry, folder, location) ? 'page' : undefined"
          :data-drop-target="entry.folder !== undefined && ctx.dragDrop.dropTargetId.value === entry.folder ? '' : undefined"
          class="flex h-8 w-full min-w-0 items-center gap-2 rounded-md px-2 text-start text-sm text-foreground/85 outline-none transition-colors hover:bg-accent/70 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50 disabled:opacity-50 aria-[current=page]:bg-accent aria-[current=page]:text-foreground data-[drop-target]:bg-primary/10 data-[drop-target]:ring-1 data-[drop-target]:ring-inset data-[drop-target]:ring-primary/40"
          @click="emit('selectLocation', entry)"
          @dragover="onLocationDragOver(entry, $event, canDropOnLocation)"
          @drop="onLocationDrop(entry, $event)"
        >
          <component :is="entry.icon" v-if="entry.icon" aria-hidden="true" class="size-4 shrink-0 text-muted-foreground" />
          <span class="min-w-0 flex-1 truncate">{{ entry.label }}</span>
          <span v-if="entry.badge !== undefined" class="shrink-0 rounded bg-muted px-1.5 font-mono text-[10px] leading-4 text-muted-foreground">{{ entry.badge }}</span>
        </button>
      </div>
    </nav>

    <p aria-hidden="true" class="px-4 pb-1.5 pt-3 font-mono text-[11px] uppercase tracking-wider rtl:tracking-normal text-muted-foreground">
      {{ ctx.messages.value.directoryTree }}
    </p>
    <div class="flex min-h-0 flex-1 flex-col" @contextmenu.capture="onContextMenuCapture($event, backgroundMenu)">
      <FileTree
        v-model:expanded="expanded"
        :items="items"
        :selected="folder === null || location !== null ? [] : [folder]"
        :draggable="draggable"
        :disabled="disabled"
        :get-icon="getIcon"
        :on-rename="onRename"
        :validate-name="validateName"
        :on-delete="onDelete"
        :on-load-children="onLoadChildren"
        :confirm-delete="false"
        :expand-on-click="false"
        :messages="ctx.messages.value"
        :dir="dir"
        folders-only
        :label="ctx.messages.value.folders"
        class="min-h-0 flex-1 px-2 pb-2"
        @select="onSelect"
      >
        <template v-if="$slots['context-menu']" #context-menu="scope">
          <slot name="context-menu" v-bind="scope" />
        </template>
      </FileTree>
    </div>
    <div class="flex h-9 shrink-0 items-center justify-between gap-2 border-t border-border px-4 font-mono text-[11px] text-muted-foreground">
      <span>{{ ctx.messages.value.items(itemCount) }}</span>
      <span v-if="selectedSize" class="truncate text-emerald-700 dark:text-emerald-400">{{ ctx.messages.value.sizeSelected(selectedSize) }}</span>
    </div>
  </aside>
</template>
