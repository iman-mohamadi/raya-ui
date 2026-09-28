<script setup lang="ts" generic="TData">
import { computed } from 'vue'
import { Check, CircleAlert, LoaderCircle, Star } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import FileExplorerFileIcon from './FileExplorerFileIcon.vue'
import FileExplorerRenameInput from './FileExplorerRenameInput.vue'
import type { ResolvedColumn } from './columns'
import type { FileExplorerColumn, FileExplorerIconResolver, FileExplorerItem } from './types'
import { SlotOutlet } from './slot'
import { useFileExplorerItemContent } from './useFileExplorerItem'
import { isFolder } from './utils'

/**
 * The cells of a details row, rendered straight into the row's grid. Kept apart
 * from the row's root (selection, focus) so selecting or focusing items does not
 * render every row again; see useFileExplorerItem.
 */
const props = defineProps<{
  item: FileExplorerItem<TData>
  columns: ResolvedColumn<TData>[]
  getIcon?: FileExplorerIconResolver<TData>
  /** Ids the root's `aria-labelledby` and `aria-describedby` point at. */
  nameId: string
  descriptionId: string
}>()

defineSlots<{
  cell?: (props: { item: FileExplorerItem<TData>, column: FileExplorerColumn<TData> }) => unknown
}>()

const { slots, description, renaming, favorite, operation, busy, rename, renameLayer, messages, multiple, toggle } = useFileExplorerItemContent(() => props.item)

// Formatted once per change: the dates follow the minute clock, and returning
// the previous array when nothing changed keeps the clock from rendering every row.
const texts = computed<string[]>((previous) => {
  const next = props.columns.map(column => (column.key === 'name' ? '' : column.format(props.item)))
  return previous && previous.length === next.length && previous.every((text, i) => text === next[i]) ? previous : next
})

const BUILT_IN = new Set(['name', 'modified', 'created', 'accessed', 'type', 'size', 'owner', 'permissions'])

function onToggle(event: MouseEvent) {
  event.stopPropagation()
  toggle()
}
</script>

<template>
  <span
    v-if="multiple"
    aria-hidden="true"
    data-slot="file-explorer-check"
    class="flex size-4 cursor-pointer items-center justify-center rounded-[4px] border border-border text-primary-foreground opacity-0 group-hover/row:opacity-100 pointer-coarse:opacity-100 group-data-[selected]/row:border-primary group-data-[selected]/row:bg-primary group-data-[selected]/row:opacity-100"
    @click="onToggle"
  >
    <!-- Selection is shown with CSS (the root's data-selected), so selecting does not render the cells. -->
    <Check class="invisible size-3 group-data-[selected]/row:visible" />
  </span>

  <template v-for="(column, index) in columns" :key="column.key">
    <span v-if="column.key === 'name'" class="flex min-w-0 items-center gap-2">
      <FileExplorerFileIcon :item="item" :get-icon="getIcon" size="sm" />
      <FileExplorerRenameInput
        v-if="renaming"
        :name="item.name"
        :is-folder="isFolder(item)"
        :label="messages.newName"
        :layer="renameLayer"
        :validate="rename.validate"
        @commit="rename.commit"
        @cancel="rename.cancel"
      />
      <template v-else>
        <bdi :id="nameId" class="truncate">{{ item.name }}</bdi>
        <Star v-if="favorite" aria-hidden="true" class="size-3 shrink-0 fill-amber-400 text-amber-400" />
      </template>
      <span :id="descriptionId" class="sr-only">{{ description }}</span>
      <LoaderCircle v-if="busy" aria-hidden="true" class="size-3.5 shrink-0 animate-spin text-muted-foreground motion-reduce:animate-none" />
      <CircleAlert
        v-else-if="operation?.status === 'error'"
        aria-hidden="true"
        class="size-3.5 shrink-0 text-destructive"
      />
    </span>
    <span
      v-else
      :class="cn(
        'truncate text-xs text-muted-foreground group-data-[selected]/row:text-foreground/80',
        column.align === 'end' && 'text-end tabular-nums',
      )"
      :title="column.title?.(item)"
    >
      <SlotOutlet v-if="!BUILT_IN.has(column.key)" :slot="slots.cell" :scope="{ item, column: column.source }">
        <bdi>{{ texts[index] }}</bdi>
      </SlotOutlet>
      <bdi v-else>{{ texts[index] }}</bdi>
    </span>
  </template>
</template>
