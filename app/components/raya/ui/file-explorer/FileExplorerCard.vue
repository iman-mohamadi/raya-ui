<script setup lang="ts" generic="TData">
import { computed } from 'vue'
import { CircleCheck } from 'lucide-vue-next'
import FileExplorerFileIcon from './FileExplorerFileIcon.vue'
import FileExplorerRenameInput from './FileExplorerRenameInput.vue'
import type { FileExplorerIconResolver, FileExplorerItem } from './types'
import { useFileExplorerItem } from './useFileExplorerItem'
import {
  formatBytes,
  formatRelativeTime,
  getFileExtension,
  getFileIcon,
  getFileKind,
  isFolder,
  tokenizeCode,
  type CodeTokenKind,
} from './utils'

const props = defineProps<{
  item: FileExplorerItem<TData>
  getIcon?: FileExplorerIconResolver<TData>
}>()

defineSlots<{
  preview?: (props: { item: FileExplorerItem<TData> }) => unknown
}>()

const { selected, renaming, rename, attrs, now } = useFileExplorerItem(() => props.item)

const folder = computed(() => isFolder(props.item))
const kind = computed(() => getFileKind(props.item))
const children = computed(() => props.item.children ?? [])

/** Top-right chip: item count for folders, extension for files without a text tile. */
const badge = computed(() => {
  if (folder.value) return `${children.value.length} ${children.value.length === 1 ? 'item' : 'items'}`
  if (kind.value.badge) return undefined
  return getFileExtension(props.item).toUpperCase() || undefined
})

const PREVIEW_NAMES = 2
const previewNames = computed(() => children.value.slice(0, PREVIEW_NAMES).map(child => child.name).join(', '))
const previewLines = computed(() => (props.item.preview ?? '').split('\n').slice(0, 3).map(tokenizeCode))

const TOKEN_CLASSES: Record<CodeTokenKind, string> = {
  keyword: 'text-sky-600 dark:text-sky-400',
  tag: 'text-sky-600 dark:text-sky-400',
  string: 'text-emerald-600 dark:text-emerald-400',
  comment: 'italic text-muted-foreground/70',
  plain: 'text-muted-foreground',
}
</script>

<template>
  <div
    v-bind="attrs"
    data-slot="file-explorer-card"
    class="group/card relative flex min-w-0 cursor-default select-none flex-col gap-3 rounded-lg border border-border bg-card p-3 text-start outline-none transition-[border-color,background-color,box-shadow] duration-150 motion-reduce:transition-none hover:border-foreground/20 focus-visible:ring-2 focus-visible:ring-ring/50 data-[selected]:border-primary/60 data-[selected]:bg-primary/[0.04] data-[selected]:ring-1 data-[selected]:ring-primary/25 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[dragging]:opacity-50 data-[drop-target]:border-primary data-[drop-target]:bg-primary/10"
  >
    <div class="flex min-w-0 items-start gap-2.5">
      <FileExplorerFileIcon :item="item" :get-icon="getIcon" />
      <div class="min-w-0 flex-1">
        <FileExplorerRenameInput
          v-if="renaming"
          :name="item.name"
          :is-folder="folder"
          :validate="rename.validate"
          class="-ms-1 h-5 font-medium"
          @commit="rename.commit"
          @cancel="rename.cancel"
        />
        <p v-else class="truncate text-sm font-medium leading-5 text-foreground">{{ item.name }}</p>
        <p class="truncate font-mono text-[11px] leading-4 text-muted-foreground">{{ item.description ?? kind.label }}</p>
      </div>
      <CircleCheck v-if="selected" aria-hidden="true" class="size-4 shrink-0 text-primary" />
      <span v-else-if="badge" class="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] leading-4 text-muted-foreground">
        {{ badge }}
      </span>
    </div>

    <div
      data-slot="file-explorer-card-preview"
      class="h-16 overflow-hidden rounded-md border border-border bg-muted/40 font-mono text-[11px] leading-[1.6] dark:bg-background/40"
    >
      <slot name="preview" :item="item">
        <div v-if="folder" class="flex h-full flex-col justify-center px-2.5 text-muted-foreground">
          <template v-if="children.length">
            <p class="truncate text-foreground/75">{{ previewNames }}</p>
            <p v-if="children.length > PREVIEW_NAMES" class="truncate">+{{ children.length - PREVIEW_NAMES }} more</p>
          </template>
          <p v-else class="italic">Empty folder</p>
        </div>
        <img
          v-else-if="item.thumbnail"
          :src="item.thumbnail"
          alt=""
          loading="lazy"
          draggable="false"
          class="size-full object-cover"
        >
        <div v-else-if="item.preview" class="flex h-full flex-col justify-center px-2.5">
          <div v-for="(tokens, line) in previewLines" :key="line" class="truncate whitespace-pre">
            <span v-for="(token, i) in tokens" :key="i" :class="TOKEN_CLASSES[token.kind]">{{ token.text }}</span>
          </div>
        </div>
        <div v-else class="flex h-full items-center justify-center text-muted-foreground/40">
          <component :is="getFileIcon(item, { expanded: false })" aria-hidden="true" class="size-6" />
        </div>
      </slot>
    </div>

    <div class="flex items-center justify-between gap-2 text-xs text-muted-foreground">
      <span class="truncate tabular-nums">{{ folder ? 'Folder' : formatBytes(item.size) }}</span>
      <span class="shrink-0">{{ formatRelativeTime(item.modifiedAt, now) }}</span>
    </div>
  </div>
</template>
