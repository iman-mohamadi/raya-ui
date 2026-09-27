<script setup lang="ts" generic="TData">
import { Check, CircleAlert, LoaderCircle, Star } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import FileExplorerFileIcon from './FileExplorerFileIcon.vue'
import FileExplorerRenameInput from './FileExplorerRenameInput.vue'
import type { ResolvedColumn } from './columns'
import type { FileExplorerColumn, FileExplorerIconResolver, FileExplorerItem } from './types'
import { useFileExplorerItem } from './useFileExplorerItem'
import { isFolder } from './utils'
import { fileExplorerColumns } from './variants'

const props = defineProps<{
  item: FileExplorerItem<TData>
  columns: ResolvedColumn<TData>[]
  getIcon?: FileExplorerIconResolver<TData>
}>()

defineSlots<{
  cell?: (props: { item: FileExplorerItem<TData>, column: FileExplorerColumn<TData> }) => unknown
}>()

const { selected, renaming, favorite, operation, busy, rename, attrs, messages, multiple, toggle } = useFileExplorerItem(() => props.item)

const BUILT_IN = new Set(['name', 'modified', 'created', 'accessed', 'type', 'size', 'owner', 'permissions'])

function onToggle(event: MouseEvent) {
  event.stopPropagation()
  toggle()
}
</script>

<template>
  <div
    v-bind="attrs"
    data-slot="file-explorer-row"
    :class="[
      fileExplorerColumns,
      'group/row h-8 cursor-default select-none items-center rounded-md px-2 text-sm text-foreground/90 outline-none',
      '[contain-intrinsic-size:auto_2rem] [content-visibility:auto]',
      'transition-colors duration-100 motion-reduce:transition-none hover:bg-accent/60',
      'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50',
      'data-[selected]:bg-accent data-[selected]:text-foreground',
      'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[dragging]:opacity-50 data-[cut]:opacity-55',
      'data-[drop-target]:bg-primary/10 data-[drop-target]:ring-1 data-[drop-target]:ring-inset data-[drop-target]:ring-primary/40',
      'data-[drop-invalid]:bg-destructive/5 data-[drop-invalid]:ring-1 data-[drop-invalid]:ring-inset data-[drop-invalid]:ring-destructive/40',
    ]"
  >
    <span
      v-if="multiple"
      aria-hidden="true"
      data-slot="file-explorer-check"
      :class="cn(
        'flex size-4 cursor-pointer items-center justify-center rounded-[4px] border border-border text-primary-foreground transition-opacity',
        selected ? 'border-primary bg-primary' : 'opacity-0 group-hover/row:opacity-100 pointer-coarse:opacity-100',
      )"
      @click="onToggle"
    >
      <Check v-if="selected" class="size-3" />
    </span>

    <template v-for="column in columns" :key="column.key">
      <span v-if="column.key === 'name'" class="flex min-w-0 items-center gap-2">
        <FileExplorerFileIcon :item="item" :get-icon="getIcon" size="sm" />
        <FileExplorerRenameInput
          v-if="renaming"
          :name="item.name"
          :is-folder="isFolder(item)"
          :label="messages.newName"
          :validate="rename.validate"
          @commit="rename.commit"
          @cancel="rename.cancel"
        />
        <template v-else>
          <span class="truncate">{{ item.name }}</span>
          <Star v-if="favorite" aria-hidden="true" class="size-3 shrink-0 fill-amber-400 text-amber-400" />
          <span v-if="favorite" class="sr-only">{{ messages.starred }}</span>
        </template>
        <LoaderCircle v-if="busy" aria-hidden="true" class="size-3.5 shrink-0 animate-spin text-muted-foreground motion-reduce:animate-none" />
        <CircleAlert
          v-else-if="operation?.status === 'error'"
          aria-hidden="true"
          class="size-3.5 shrink-0 text-destructive"
        />
        <span v-if="operation" class="sr-only">{{ operation.label }}{{ operation.error ? `: ${operation.error}` : '' }}</span>
      </span>
      <span
        v-else
        :class="cn(
          'truncate text-xs text-muted-foreground',
          column.align === 'end' && 'text-end tabular-nums',
          !column.pinned && 'hidden @xl:block',
        )"
        :title="column.title?.(item)"
      >
        <slot v-if="$slots.cell && !BUILT_IN.has(column.key)" name="cell" :item="item" :column="column.source" />
        <template v-else>{{ column.format(item) }}</template>
      </span>
    </template>
  </div>
</template>
