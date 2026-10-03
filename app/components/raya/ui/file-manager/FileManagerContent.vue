<script setup lang="ts" generic="TData">
import { computed, nextTick, ref, useTemplateRef, watch, type ComponentPublicInstance } from 'vue'
import { useElementSize, useIntersectionObserver } from '@vueuse/core'
import { CircleAlert, CloudUpload, FolderOpen, Inbox, LoaderCircle, SearchX, Trash2 } from '@lucide/vue'
import { cn } from '@/lib/utils'
import FileManagerCard from './FileManagerCard.vue'
import FileManagerDetailsHeader from './FileManagerDetailsHeader.vue'
import FileManagerRow from './FileManagerRow.vue'
import { CHECK_WIDTH, fitColumns, type ResolvedColumn } from './columns'
import { injectFileManagerContext } from './context'
import { SlotOutlet } from './slot'
import type {
  FileManagerIconResolver,
  FileManagerItem,
  FileManagerSort,
  FileManagerView,
} from './types'
import type { LoadState } from './useFileManagerLoader'
import { fileManagerButtonVariants } from './variants'

const props = defineProps<{
  items: FileManagerItem<TData>[]
  view: FileManagerView
  sort: FileManagerSort
  columns: ResolvedColumn<TData>[]
  query: string
  loading: boolean
  /** Loading or failing to load the folder, or searching. */
  loadState: LoadState | undefined
  loadStateKind: 'folder' | 'search'
  multiple: boolean
  /** Shows the drop tile, and the drop overlay while files are dragged in. */
  uploadable: boolean
  externalDrag: boolean
  folderName: string
  /** What an empty view is: a folder, a listing (Recent, Starred…) or the trash. */
  emptyKind: 'folder' | 'listing' | 'trash'
  label: string
  hasMore: boolean
  resizableColumns: boolean
  reorderableColumns: boolean
  dir: 'ltr' | 'rtl'
  moreState: LoadState | undefined
  getIcon?: FileManagerIconResolver<TData>
}>()

const emit = defineEmits<{
  'update:sort': [value: FileManagerSort]
  'resizeColumn': [key: string, width: string | undefined]
  'moveColumn': [key: string, index: number]
  'pick': []
  'loadMore': []
  'retry': []
}>()

const ctx = injectFileManagerContext()
const m = computed(() => ctx.messages.value)

const GRID = 'grid grid-cols-[repeat(auto-fill,minmax(13.5rem,1fr))] gap-3'
const SKELETON_WIDTHS = ['w-2/5', 'w-1/2', 'w-1/3', 'w-3/5', 'w-1/4', 'w-2/5', 'w-1/2', 'w-1/3']

const busy = computed(() => props.loading || props.loadState?.status === 'loading')
const failed = computed(() => props.loadState?.status === 'error')

/** The details header: its width is the room the columns share. */
const header = useTemplateRef<ComponentPublicInstance>('header')
const { width: headerWidth } = useElementSize(header)
const rootFontSize = () => (typeof document === 'undefined' ? 16 : Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16)

/** Columns that fit next to a readable name; the rest reappear as the file manager grows. */
const visibleColumns = computed(() => fitColumns(props.columns, headerWidth.value / rootFontSize(), props.multiple))

/**
 * A column being resized: its live width, applied to the grid tracks only, so
 * the rows follow the pointer without rendering. The new width is committed
 * (and the rows render once) when the drag ends.
 */
const draftWidth = ref<{ key: string, width: number } | null>(null)

/** CSS grid tracks for the details view. */
const tracks = computed(() => ({
  '--file-manager-columns': [
    ...(props.multiple ? [CHECK_WIDTH] : []),
    ...visibleColumns.value.map(column => (draftWidth.value?.key === column.key ? `${draftWidth.value.width}px` : column.width)),
  ].join(' '),
}))

// Load the next page when the end of the list comes within 200px of view. The
// scroller is the observer's root: with the viewport as root, the scroller's
// clipping would cancel the margin.
const scroller = useTemplateRef<HTMLElement>('scroller')
const sentinel = useTemplateRef<HTMLElement>('sentinel')
const { isActive, pause, resume } = useIntersectionObserver(sentinel, ([entry]) => {
  if (entry?.isIntersecting && props.hasMore && !props.moreState) emit('loadMore')
}, { root: scroller, rootMargin: '200px' })
watch(() => props.moreState?.status, (status, previous) => {
  // After a failure, wait for an explicit Retry instead of hammering the server.
  if (status === 'error') pause()
  // A page arrived: observe afresh. An observer only reports changes, so if the
  // end is still in view (a short page, a tall file manager) loading would stall;
  // observing again reports the current state.
  else if (status === undefined && (previous === 'loading' || !isActive.value)) {
    pause()
    nextTick(resume)
  }
})
</script>

<template>
  <div
    ref="scroller"
    data-slot="file-manager-content"
    :aria-busy="busy ? 'true' : undefined"
    :class="view === 'list' && 'scroll-pt-11'"
    class="relative min-h-0 flex-1 overflow-y-auto p-3"
  >
    <div
      v-if="busy"
      role="status"
      :aria-label="loadStateKind === 'search' && !loading ? m.searching : m.loading"
      :class="view === 'grid' ? GRID : 'flex flex-col gap-1'"
    >
      <template v-if="view === 'grid'">
        <div v-for="i in 6" :key="i" class="flex flex-col gap-3 rounded-lg border border-border p-3">
          <div class="flex items-center gap-2.5">
            <div class="size-8 animate-pulse rounded-md bg-accent motion-reduce:animate-none" />
            <div class="flex flex-1 flex-col gap-1.5">
              <div class="h-3 w-2/3 animate-pulse rounded-sm bg-accent motion-reduce:animate-none" />
              <div class="h-2.5 w-1/3 animate-pulse rounded-sm bg-accent motion-reduce:animate-none" />
            </div>
          </div>
          <div class="h-16 animate-pulse rounded-md bg-accent/60 motion-reduce:animate-none" />
          <div class="h-2.5 w-1/4 animate-pulse rounded-sm bg-accent motion-reduce:animate-none" />
        </div>
      </template>
      <div v-for="i in 8" v-else :key="i" class="flex h-8 items-center gap-2 px-2">
        <div class="size-5 animate-pulse rounded-[5px] bg-accent motion-reduce:animate-none" />
        <div :class="cn('h-3 animate-pulse rounded-sm bg-accent motion-reduce:animate-none', SKELETON_WIDTHS[i - 1])" />
      </div>
    </div>

    <div
      v-else-if="failed"
      role="alert"
      class="flex h-full min-h-40 flex-col items-center justify-center gap-2 px-4 text-center text-sm text-muted-foreground"
    >
      <CircleAlert aria-hidden="true" class="size-6 text-destructive" />
      <p class="font-medium text-foreground">{{ loadStateKind === 'search' ? m.searchFailed : m.loadFailed }}</p>
      <p v-if="loadState?.error" class="max-w-sm text-xs">{{ loadState.error }}</p>
      <button type="button" :class="cn(fileManagerButtonVariants({ variant: 'outline' }), 'mt-1')" @click="emit('retry')">
        {{ m.retry }}
      </button>
    </div>

    <SlotOutlet v-else-if="!items.length && (query || view === 'list' || !uploadable)" :slot="ctx.slots.empty" :scope="{ query }">
      <div class="flex h-full min-h-40 flex-col items-center justify-center gap-2 px-4 text-center text-sm text-muted-foreground">
        <component :is="query ? SearchX : emptyKind === 'trash' ? Trash2 : emptyKind === 'listing' ? Inbox : FolderOpen" aria-hidden="true" class="size-6 text-muted-foreground/60" />
        <p v-if="query">{{ m.noMatches(query) }}</p>
        <p v-else-if="emptyKind === 'trash'">{{ m.trashEmpty }}</p>
        <p v-else-if="emptyKind === 'listing'">{{ m.noFiles }}</p>
        <template v-else>
          <p>{{ m.emptyFolder }}</p>
          <p v-if="uploadable" class="text-xs">{{ m.emptyFolderHint }}</p>
        </template>
      </div>
    </SlotOutlet>

    <div v-else-if="view === 'grid'" :class="GRID">
      <!-- `contents` lets the drop tile share the grid while staying outside the listbox. -->
      <div role="listbox" :aria-label="label" :aria-multiselectable="multiple || undefined" class="contents">
        <FileManagerCard v-for="item in items" :key="item.id" :item="item" :get-icon="getIcon">
        </FileManagerCard>
      </div>
      <button
        v-if="uploadable && !query"
        type="button"
        data-slot="file-manager-dropzone"
        class="flex min-h-36 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-3 text-center outline-none transition-colors hover:border-foreground/30 hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring/50"
        @click="emit('pick')"
      >
        <span class="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <CloudUpload aria-hidden="true" class="size-4" />
        </span>
        <span class="text-sm font-medium text-foreground">{{ m.dropFiles }}</span>
        <span class="text-xs text-muted-foreground">{{ m.dropFilesHint }}</span>
      </button>
    </div>

    <div v-else class="flex flex-col" :style="tracks">
      <FileManagerDetailsHeader
        ref="header"
        :columns="visibleColumns"
        :sort="sort"
        :multiple="multiple"
        :resizable="resizableColumns"
        :reorderable="reorderableColumns"
        :dir="dir"
        @update:sort="emit('update:sort', $event)"
        @preview="(key, width) => (draftWidth = width === null ? null : { key, width })"
        @resize="(key, width) => emit('resizeColumn', key, width)"
        @move="(key, index) => emit('moveColumn', key, index)"
      />
      <div role="listbox" :aria-label="label" :aria-multiselectable="multiple || undefined" class="flex flex-col gap-px">
        <FileManagerRow v-for="item in items" :key="item.id" :item="item" :columns="visibleColumns" :get-icon="getIcon">
        </FileManagerRow>
      </div>
    </div>

    <div v-if="hasMore && !busy && !failed" class="flex flex-col items-center gap-2 pb-2 pt-4 text-xs text-muted-foreground">
      <div ref="sentinel" aria-hidden="true" class="h-px w-full" />
      <template v-if="moreState?.status === 'loading'">
        <p role="status" class="flex items-center gap-2">
          <LoaderCircle aria-hidden="true" class="size-3.5 animate-spin motion-reduce:animate-none" />
          {{ m.loading }}
        </p>
      </template>
      <template v-else-if="moreState?.status === 'error'">
        <p role="alert" class="text-destructive">{{ moreState.error || m.loadFailed }}</p>
        <button type="button" :class="fileManagerButtonVariants({ variant: 'outline' })" @click="emit('loadMore')">{{ m.retry }}</button>
      </template>
      <button v-else type="button" :class="fileManagerButtonVariants({ variant: 'ghost' })" @click="emit('loadMore')">
        {{ m.loadMore }}
      </button>
    </div>

    <div
      v-if="externalDrag"
      aria-hidden="true"
      class="pointer-events-none absolute inset-2 flex items-center justify-center rounded-lg border-2 border-dashed border-primary/60 bg-primary/5 text-sm font-medium text-primary backdrop-blur-[1px]"
    >
      {{ m.dropToUpload(folderName) }}
    </div>
  </div>
</template>
