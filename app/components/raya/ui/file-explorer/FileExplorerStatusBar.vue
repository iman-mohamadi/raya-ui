<script setup lang="ts" generic="TData">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { injectFileExplorerContext } from './context'
import type { FileExplorerAction, FileExplorerItem } from './types'
import { formatBytes, getFileExtension, getFileKind, isFolder } from './utils'

const props = defineProps<{
  selectedItems: FileExplorerItem<TData>[]
  itemCount: number
  /** Actions for the selection; Open, Preview and Download are offered here. */
  actions: FileExplorerAction[]
}>()

defineSlots<{
  actions?: (props: { items: FileExplorerItem<TData>[], actions: FileExplorerAction[] }) => unknown
}>()

const ctx = injectFileExplorerContext()
const m = computed(() => ctx.messages.value)

const single = computed(() => (props.selectedItems.length === 1 ? props.selectedItems[0] : undefined))
const totalSize = computed(() => {
  const files = props.selectedItems.filter(item => !isFolder(item))
  return files.length ? formatBytes(files.reduce((sum, item) => sum + (item.size ?? 0), 0)) : ''
})
const details = computed(() => {
  const item = single.value
  if (!item) return ''
  if (isFolder(item)) return item.children ? m.value.items(item.children.length) : ''
  const kind = getFileKind(item)
  const type = item.mimeType ?? m.value.fileKind(kind.category, getFileExtension(item), kind.label)
  return [formatBytes(item.size), type].filter(Boolean).join(', ')
})

const shown = computed(() => props.actions.filter(action =>
  !action.disabled
  && (action.id === 'download' || (single.value && !isFolder(single.value) && (action.id === 'open' || action.id === 'preview')))))
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
        {{ m.itemsSelected(selectedItems.length) }}<template v-if="totalSize"> · {{ totalSize }}</template>
      </template>
      <template v-else>
        {{ m.items(itemCount) }}
      </template>
    </p>
    <div class="flex shrink-0 items-center gap-2 text-muted-foreground">
      <slot name="actions" :items="selectedItems" :actions="actions">
        <template v-for="(action, i) in shown" :key="action.id">
          <span v-if="i > 0" aria-hidden="true">·</span>
          <button
            type="button"
            :data-action="action.id"
            :class="cn(
              'rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/50',
              i === 0 ? 'text-primary' : 'hover:text-foreground',
            )"
            @click="action.run()"
          >
            {{ action.label }}
          </button>
        </template>
      </slot>
    </div>
  </div>
</template>
