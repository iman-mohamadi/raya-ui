<script setup lang="ts" generic="TData">
import { computed } from 'vue'
import type { FileExplorerItem } from './types'
import { formatBytes, getFileKind, isFolder } from './utils'

const props = defineProps<{
  selectedItems: FileExplorerItem<TData>[]
  itemCount: number
}>()

const emit = defineEmits<{
  open: [item: FileExplorerItem<TData>]
}>()

defineSlots<{
  actions?: (props: { items: FileExplorerItem<TData>[] }) => unknown
}>()

const single = computed(() => (props.selectedItems.length === 1 ? props.selectedItems[0] : undefined))
const totalSize = computed(() => formatBytes(props.selectedItems.reduce((sum, item) => sum + (item.size ?? 0), 0)))
const details = computed(() => {
  const item = single.value
  if (!item) return ''
  const type = item.mimeType ?? getFileKind(item).label
  return isFolder(item) ? `${item.children?.length ?? 0} items` : [formatBytes(item.size), type].filter(Boolean).join(', ')
})
</script>

<template>
  <div data-slot="file-explorer-status-bar" class="flex h-9 shrink-0 items-center justify-between gap-3 border-t border-border px-3 text-xs">
    <p aria-live="polite" class="flex min-w-0 items-center gap-2 text-muted-foreground">
      <template v-if="single">
        <span aria-hidden="true" class="size-1.5 shrink-0 rounded-full bg-primary" />
        <span class="truncate font-medium text-foreground/90">{{ single.name }}</span>
        <span v-if="details" class="hidden shrink-0 @md:inline">({{ details }})</span>
      </template>
      <template v-else-if="selectedItems.length">
        {{ selectedItems.length }} items selected<template v-if="totalSize !== '0 B'"> · {{ totalSize }}</template>
      </template>
      <template v-else>
        {{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }}
      </template>
    </p>
    <div class="flex shrink-0 items-center gap-2 text-muted-foreground">
      <slot name="actions" :items="selectedItems">
        <button
          v-if="single && !isFolder(single)"
          type="button"
          class="rounded-sm text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/50"
          @click="emit('open', single)"
        >
          Open File
        </button>
      </slot>
    </div>
  </div>
</template>
