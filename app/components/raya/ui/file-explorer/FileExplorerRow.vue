<script setup lang="ts" generic="TData">
import FileExplorerRowCells from './FileExplorerRowCells.vue'
import type { ResolvedColumn } from './columns'
import type { FileExplorerColumn, FileExplorerIconResolver, FileExplorerItem } from './types'
import { useFileExplorerItemRoot } from './useFileExplorerItem'
import { fileExplorerColumns } from './variants'

const props = defineProps<{
  item: FileExplorerItem<TData>
  columns: ResolvedColumn<TData>[]
  getIcon?: FileExplorerIconResolver<TData>
}>()

defineSlots<{
  cell?: (props: { item: FileExplorerItem<TData>, column: FileExplorerColumn<TData> }) => unknown
}>()

// The row's root only: selection, focus and drag state. The cells live in
// FileExplorerRowCells so that those changes do not render them again.
const { attrs, nameId, descriptionId } = useFileExplorerItemRoot(() => props.item)
</script>

<template>
  <div
    v-bind="attrs"
    data-slot="file-explorer-row"
    :class="[
      fileExplorerColumns,
      'group/row h-8 cursor-default select-none items-center rounded-md px-2 text-sm text-foreground/90 outline-none',
      '[contain-intrinsic-size:auto_2rem] [content-visibility:auto]',
      // No transitions: selecting a whole folder would animate every row at once.
      'hover:bg-accent/60',
      'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50',
      'data-[selected]:bg-accent data-[selected]:text-foreground',
      'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[dragging]:opacity-50 data-[cut]:opacity-55 data-[touch-lifted]:bg-accent data-[touch-lifted]:shadow-md',
      'data-[drop-target]:bg-primary/10 data-[drop-target]:ring-1 data-[drop-target]:ring-inset data-[drop-target]:ring-primary/40',
      'data-[drop-invalid]:bg-destructive/5 data-[drop-invalid]:ring-1 data-[drop-invalid]:ring-inset data-[drop-invalid]:ring-destructive/40',
    ]"
  >
    <FileExplorerRowCells :item="item" :columns="columns" :get-icon="getIcon" :name-id="nameId" :description-id="descriptionId" />
  </div>
</template>
