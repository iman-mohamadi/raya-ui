<script setup lang="ts" generic="TData">
import FileTree from './FileTree.vue'
import type { FileExplorerIconResolver, FileExplorerItem, FileExplorerSelectEvent } from './types'

defineProps<{
  items: FileExplorerItem<TData>[]
  /** The open folder, highlighted in the tree. */
  folder: string | null
  itemCount: number
  /** Formatted size of the selected files, if any. */
  selectedSize: string
  draggable: boolean
  disabled: boolean
  getIcon?: FileExplorerIconResolver<TData>
}>()

const expanded = defineModel<string[]>('expanded', { required: true })

const emit = defineEmits<{
  navigate: [id: string]
}>()

defineSlots<{
  'context-menu'?: (props: { item: FileExplorerItem<TData> | null }) => unknown
}>()

function onSelect(event: FileExplorerSelectEvent<TData>) {
  if (event.item.type === 'folder') emit('navigate', event.item.id)
}
</script>

<template>
  <aside
    data-slot="file-explorer-sidebar"
    aria-label="Directory tree"
    class="hidden w-56 shrink-0 flex-col border-e border-border @3xl:flex @5xl:w-60"
  >
    <p aria-hidden="true" class="px-4 pb-1.5 pt-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
      Directory tree
    </p>
    <FileTree
      v-model:expanded="expanded"
      :items="items"
      :selected="folder === null ? [] : [folder]"
      :draggable="draggable"
      :disabled="disabled"
      :get-icon="getIcon"
      :expand-on-click="false"
      folders-only
      label="Folders"
      class="min-h-0 flex-1 px-2 pb-2"
      @select="onSelect"
    >
      <template v-if="$slots['context-menu']" #context-menu="scope">
        <slot name="context-menu" v-bind="scope" />
      </template>
    </FileTree>
    <div class="flex h-9 shrink-0 items-center justify-between gap-2 border-t border-border px-4 font-mono text-[11px] text-muted-foreground">
      <span>{{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }}</span>
      <span v-if="selectedSize" class="truncate text-emerald-600 dark:text-emerald-400">{{ selectedSize }} selected</span>
    </div>
  </aside>
</template>
