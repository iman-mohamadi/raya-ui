<script setup lang="ts" generic="TData">
import { computed } from 'vue'
import { Circle, CircleAlert, CircleCheck, Star } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import FileExplorerFileIcon from './FileExplorerFileIcon.vue'
import FileExplorerRenameInput from './FileExplorerRenameInput.vue'
import type { FileExplorerIconResolver, FileExplorerItem } from './types'
import { SlotOutlet } from './slot'
import { useFileExplorerItemContent } from './useFileExplorerItem'
import {
  formatBytes,
  getFileExtension,
  getFileIcon,
  getFileKind,
  isFolder,
  tokenizeCode,
  type CodeTokenKind,
} from './utils'

/**
 * The content of a grid card. Kept apart from the card's root (selection, focus)
 * so selecting or focusing items does not render every card again; see
 * useFileExplorerItem.
 */
const props = defineProps<{
  item: FileExplorerItem<TData>
  getIcon?: FileExplorerIconResolver<TData>
  /** Ids the root's `aria-labelledby` and `aria-describedby` point at. */
  nameId: string
  descriptionId: string
}>()

defineSlots<{
  preview?: (props: { item: FileExplorerItem<TData> }) => unknown
}>()

const { slots, description, renaming, favorite, operation, busy, modified, rename, renameLayer, messages, multiple, toggle } = useFileExplorerItemContent(() => props.item)

const folder = computed(() => isFolder(props.item))
const kind = computed(() => getFileKind(props.item))
const kindLabel = computed(() => messages.value.fileKind(kind.value.category, getFileExtension(props.item), kind.value.label))
const children = computed(() => props.item.children ?? [])

/** Top-right chip: item count for folders, extension for files without a text tile. */
const badge = computed(() => {
  if (folder.value) return props.item.children ? messages.value.items(children.value.length) : undefined
  if (kind.value.badge) return undefined
  return getFileExtension(props.item).toUpperCase() || undefined
})

const PREVIEW_NAMES = 2
const previewNames = computed(() => children.value.slice(0, PREVIEW_NAMES).map(child => child.name).join(messages.value.listSeparator))
const previewLines = computed(() => (props.item.preview ?? '').split('\n').slice(0, 3).map(tokenizeCode))

const TOKEN_CLASSES: Record<CodeTokenKind, string> = {
  keyword: 'text-sky-700 dark:text-sky-400',
  tag: 'text-sky-700 dark:text-sky-400',
  string: 'text-emerald-700 dark:text-emerald-400',
  comment: 'italic text-muted-foreground/70',
  plain: 'text-foreground/70',
}

function onToggle(event: MouseEvent) {
  // The check circle adds or removes the card without replacing the selection.
  event.stopPropagation()
  toggle()
}
</script>

<template>
  <div class="flex min-w-0 items-start gap-2.5">
    <FileExplorerFileIcon :item="item" :get-icon="getIcon" />
    <div class="min-w-0 flex-1">
      <FileExplorerRenameInput
        v-if="renaming"
        :name="item.name"
        :is-folder="folder"
        :label="messages.newName"
        :layer="renameLayer"
        :validate="rename.validate"
        class="-ms-1 -my-0.5 h-6 font-medium"
        @commit="rename.commit"
        @cancel="rename.cancel"
      />
      <p v-else class="flex min-w-0 items-center gap-1 text-sm font-medium leading-5 text-foreground">
        <bdi :id="nameId" class="truncate">{{ item.name }}</bdi>
        <Star v-if="favorite" aria-hidden="true" class="size-3 shrink-0 fill-amber-400 text-amber-400" />
      </p>
      <span :id="descriptionId" class="sr-only">{{ description }}</span>
      <p class="truncate font-mono text-[11px] leading-4 text-muted-foreground">{{ item.description ?? kindLabel }}</p>
    </div>

    <span
      v-if="multiple"
      aria-hidden="true"
      data-slot="file-explorer-check"
      :class="cn(
        'grid shrink-0 cursor-pointer place-items-center [grid-template-areas:stack] *:[grid-area:stack]',
      )"
      @click="onToggle"
    >
      <!-- Selection is shown with CSS (the root's data-selected), so selecting does not render the body.
         Visibility and opacity only: display changes would lay out every card on Ctrl+A. -->
      <CircleCheck class="invisible size-4 text-primary group-data-[selected]/card:visible" />
      <Circle class="invisible size-4 text-muted-foreground group-hover/card:visible pointer-coarse:visible group-data-[selected]/card:opacity-0" />
      <span
        v-if="badge"
        :class="cn(
          'rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] leading-4 text-foreground/70 justify-self-end',
          'group-hover/card:invisible pointer-coarse:invisible group-data-[selected]/card:invisible',
        )"
      >{{ badge }}</span>
    </span>
    <template v-else>
      <CircleCheck aria-hidden="true" class="hidden size-4 shrink-0 text-primary group-data-[selected]/card:block" />
      <span v-if="badge" class="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] leading-4 text-foreground/70 group-data-[selected]/card:hidden">
        {{ badge }}
      </span>
    </template>
  </div>

  <div
    data-slot="file-explorer-card-preview"
    class="h-16 overflow-hidden rounded-md border border-border bg-muted/40 font-mono text-[11px] leading-[1.6] dark:bg-background/40"
  >
    <SlotOutlet :slot="slots.preview" :scope="{ item }">
      <div v-if="folder" class="flex h-full flex-col justify-center px-2.5 text-muted-foreground">
        <template v-if="children.length">
          <p class="truncate text-foreground/75"><bdi>{{ previewNames }}</bdi></p>
          <p v-if="children.length > PREVIEW_NAMES" class="truncate"><bdi>+{{ children.length - PREVIEW_NAMES }}</bdi></p>
        </template>
        <p v-else-if="item.children" class="italic">{{ messages.emptyFolder }}</p>
      </div>
      <img
        v-else-if="item.thumbnail"
        :src="item.thumbnail"
        alt=""
        loading="lazy"
        decoding="async"
        draggable="false"
        class="size-full object-cover"
      >
      <!-- Code and text read left to right in any layout. -->
      <div v-else-if="item.preview" dir="ltr" class="flex h-full flex-col justify-center px-2.5">
        <div v-for="(tokens, line) in previewLines" :key="line" class="truncate whitespace-pre">
          <span v-for="(token, i) in tokens" :key="i" :class="TOKEN_CLASSES[token.kind]">{{ token.text }}</span>
        </div>
      </div>
      <div v-else class="flex h-full items-center justify-center text-muted-foreground/40">
        <component :is="getFileIcon(item, { expanded: false })" aria-hidden="true" class="size-6" />
      </div>
    </SlotOutlet>
  </div>

  <div class="flex items-center justify-between gap-2 text-xs text-muted-foreground">
    <span class="flex min-w-0 items-center gap-1 truncate tabular-nums">
      <CircleAlert v-if="operation?.status === 'error'" aria-hidden="true" class="size-3.5 shrink-0 text-destructive" />
      <span class="truncate" :title="operation?.status === 'error' ? operation.error : undefined">
        {{ folder ? messages.folder : formatBytes(item.size, messages) }}
      </span>
    </span>
    <span class="shrink-0">{{ busy && operation?.progress !== undefined ? `${Math.round(operation.progress)}%` : modified }}</span>
  </div>

  <div v-if="busy" aria-hidden="true" class="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-primary/15">
    <div
      v-if="operation?.progress !== undefined"
      class="h-full bg-primary transition-[width] duration-300 motion-reduce:transition-none"
      :style="{ width: `${operation.progress}%` }"
    />
    <div v-else class="absolute inset-y-0 w-1/3 bg-primary animate-[file-explorer-indeterminate_1.2s_ease-in-out_infinite] motion-reduce:animate-none" />
  </div>
</template>
