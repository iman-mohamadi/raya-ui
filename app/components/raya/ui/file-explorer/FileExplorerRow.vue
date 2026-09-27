<script setup lang="ts" generic="TData">
import { computed } from 'vue'
import FileExplorerFileIcon from './FileExplorerFileIcon.vue'
import FileExplorerRenameInput from './FileExplorerRenameInput.vue'
import type { FileExplorerIconResolver, FileExplorerItem } from './types'
import { useFileExplorerItem } from './useFileExplorerItem'
import { formatBytes, formatRelativeTime, getFileKind, isFolder } from './utils'
import { fileExplorerColumns } from './variants'

const props = defineProps<{
  item: FileExplorerItem<TData>
  getIcon?: FileExplorerIconResolver<TData>
}>()

const { renaming, rename, attrs, now } = useFileExplorerItem(() => props.item)
const kind = computed(() => getFileKind(props.item))
</script>

<template>
  <div
    v-bind="attrs"
    data-slot="file-explorer-row"
    :class="[
      fileExplorerColumns,
      'h-8 cursor-default select-none items-center rounded-md px-2 text-sm text-foreground/90 outline-none',
      'transition-colors duration-100 motion-reduce:transition-none hover:bg-accent/60',
      'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50',
      'data-[selected]:bg-accent data-[selected]:text-foreground',
      'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[dragging]:opacity-50',
      'data-[drop-target]:bg-primary/10 data-[drop-target]:ring-1 data-[drop-target]:ring-inset data-[drop-target]:ring-primary/40',
    ]"
  >
    <span class="flex min-w-0 items-center gap-2">
      <FileExplorerFileIcon :item="item" :get-icon="getIcon" size="sm" />
      <FileExplorerRenameInput
        v-if="renaming"
        :name="item.name"
        :is-folder="isFolder(item)"
        :validate="rename.validate"
        @commit="rename.commit"
        @cancel="rename.cancel"
      />
      <span v-else class="truncate">{{ item.name }}</span>
    </span>
    <span class="hidden truncate text-xs text-muted-foreground @xl:block">{{ formatRelativeTime(item.modifiedAt, now) }}</span>
    <span class="hidden truncate text-xs text-muted-foreground @xl:block">{{ item.description ?? kind.label }}</span>
    <span class="truncate text-end text-xs tabular-nums text-muted-foreground">
      {{ isFolder(item) ? `${item.children?.length ?? 0} items` : formatBytes(item.size) }}
    </span>
  </div>
</template>
