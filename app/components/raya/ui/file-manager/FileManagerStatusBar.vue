<script setup lang="ts" generic="TData">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { injectFileManagerContext } from './context'
import type { FileManagerAction, FileManagerItem } from './types'
import { formatBytes, getFileExtension, getFileKind, isFolder } from './utils'

const props = defineProps<{
  selectedItems: FileManagerItem<TData>[]
  itemCount: number
  /** Actions for the selection; Open, Preview and Download are offered here. */
  actions: FileManagerAction[]
}>()

defineSlots<{
  actions?: (props: { items: FileManagerItem<TData>[], actions: FileManagerAction[] }) => unknown
}>()

const ctx = injectFileManagerContext()
const m = computed(() => ctx.messages.value)

const single = computed(() => (props.selectedItems.length === 1 ? props.selectedItems[0] : undefined))
const totalSize = computed(() => {
  const files = props.selectedItems.filter(item => !isFolder(item))
  return files.length ? formatBytes(files.reduce((sum, item) => sum + (item.size ?? 0), 0), m.value) : ''
})
const details = computed(() => {
  const item = single.value
  if (!item) return ''
  if (isFolder(item)) return item.children ? m.value.items(item.children.length) : ''
  const kind = getFileKind(item)
  const type = m.value.fileKind(kind.category, getFileExtension(item), kind.label)
  return [formatBytes(item.size, m.value), type].filter(Boolean).join(m.value.listSeparator)
})

const shown = computed(() => props.actions.filter(action =>
  !action.disabled
  && (action.id === 'download' || (single.value && !isFolder(single.value) && (action.id === 'open' || action.id === 'preview')))))
</script>

<template>
  <div data-slot="file-manager-status-bar" class="flex h-9 shrink-0 items-center justify-between gap-3 border-t border-border px-3 text-xs">
    <p aria-live="polite" class="flex min-w-0 items-center gap-2 text-muted-foreground">
      <template v-if="single">
        <span aria-hidden="true" class="size-1.5 shrink-0 rounded-full bg-primary" />
        <bdi class="truncate font-medium text-foreground/90">{{ single.name }}</bdi>
        <span v-if="details" class="hidden shrink-0 @md:inline">(<bdi>{{ details }}</bdi>)</span>
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
              // The default action: a themed underline in light mode, where primary text is too pale.
              i === 0 ? 'text-foreground underline decoration-primary decoration-2 underline-offset-2 dark:text-primary dark:no-underline dark:hover:underline' : 'hover:text-foreground',
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
