<script setup lang="ts" generic="TData">
import { computed, useTemplateRef, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { ArrowDown, ArrowUp, CircleAlert, CloudUpload, FolderOpen, LoaderCircle, SearchX } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import FileExplorerCard from './FileExplorerCard.vue'
import FileExplorerRow from './FileExplorerRow.vue'
import type { ResolvedColumn } from './columns'
import { injectFileExplorerContext } from './context'
import type {
  FileExplorerColumn,
  FileExplorerIconResolver,
  FileExplorerItem,
  FileExplorerSort,
  FileExplorerView,
} from './types'
import type { LoadState } from './useFileExplorerLoader'
import { fileExplorerButtonVariants, fileExplorerColumns } from './variants'

const props = defineProps<{
  items: FileExplorerItem<TData>[]
  view: FileExplorerView
  sort: FileExplorerSort
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
  label: string
  hasMore: boolean
  moreState: LoadState | undefined
  getIcon?: FileExplorerIconResolver<TData>
}>()

const emit = defineEmits<{
  'update:sort': [value: FileExplorerSort]
  'pick': []
  'loadMore': []
  'retry': []
}>()

defineSlots<{
  preview?: (props: { item: FileExplorerItem<TData> }) => unknown
  empty?: (props: { query: string }) => unknown
  cell?: (props: { item: FileExplorerItem<TData>, column: FileExplorerColumn<TData> }) => unknown
}>()

const ctx = injectFileExplorerContext()
const m = computed(() => ctx.messages.value)

const GRID = 'grid grid-cols-[repeat(auto-fill,minmax(13.5rem,1fr))] gap-3'
const SKELETON_WIDTHS = ['w-2/5', 'w-1/2', 'w-1/3', 'w-3/5', 'w-1/4', 'w-2/5', 'w-1/2', 'w-1/3']

const busy = computed(() => props.loading || props.loadState?.status === 'loading')
const failed = computed(() => props.loadState?.status === 'error')

/** CSS grid tracks for the details view: every column wide, pinned ones narrow. */
const tracks = computed(() => {
  const check = props.multiple ? ['1.25rem'] : []
  return {
    '--file-explorer-columns': [...check, ...props.columns.map(column => column.width)].join(' '),
    '--file-explorer-columns-narrow': [...check, ...props.columns.filter(column => column.pinned).map(column => column.width)].join(' '),
  }
})

function sortBy(column: ResolvedColumn<TData>) {
  if (!column.sortable) return
  const direction = props.sort.key === column.key && props.sort.direction === 'asc' ? 'desc' : 'asc'
  emit('update:sort', { key: column.key, direction })
}

function sortLabel(column: ResolvedColumn<TData>) {
  if (props.sort.key !== column.key) return m.value.sortBy(column.label)
  return `${m.value.sortBy(column.label)}, ${props.sort.direction === 'asc' ? m.value.ascending : m.value.descending}`
}

// Load the next page when the end of the list scrolls into view.
const sentinel = useTemplateRef<HTMLElement>('sentinel')
const { isActive, pause, resume } = useIntersectionObserver(sentinel, ([entry]) => {
  if (entry?.isIntersecting && props.hasMore && !props.moreState) emit('loadMore')
}, { rootMargin: '200px' })
watch(() => props.moreState?.status === 'error', (error) => {
  // After a failure, wait for an explicit Retry instead of hammering the server.
  if (error) pause()
  else if (!isActive.value) resume()
})
</script>

<template>
  <div
    data-slot="file-explorer-content"
    :aria-busy="busy ? 'true' : undefined"
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
      <button type="button" :class="cn(fileExplorerButtonVariants({ variant: 'outline' }), 'mt-1')" @click="emit('retry')">
        {{ m.retry }}
      </button>
    </div>

    <slot v-else-if="!items.length && (query || view === 'list' || !uploadable)" name="empty" :query="query">
      <div class="flex h-full min-h-40 flex-col items-center justify-center gap-2 px-4 text-center text-sm text-muted-foreground">
        <component :is="query ? SearchX : FolderOpen" aria-hidden="true" class="size-6 text-muted-foreground/60" />
        <p v-if="query">{{ m.noMatches(query) }}</p>
        <template v-else>
          <p>{{ m.emptyFolder }}</p>
          <p v-if="uploadable" class="text-xs">{{ m.emptyFolderHint }}</p>
        </template>
      </div>
    </slot>

    <div v-else-if="view === 'grid'" :class="GRID">
      <!-- `contents` lets the drop tile share the grid while staying outside the listbox. -->
      <div role="listbox" :aria-label="label" :aria-multiselectable="multiple || undefined" class="contents">
        <FileExplorerCard v-for="item in items" :key="item.id" :item="item" :get-icon="getIcon">
          <template v-if="$slots.preview" #preview="scope">
            <slot name="preview" v-bind="scope" />
          </template>
        </FileExplorerCard>
      </div>
      <button
        v-if="uploadable && !query"
        type="button"
        data-slot="file-explorer-dropzone"
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
      <div
        role="presentation"
        :class="cn(fileExplorerColumns, 'sticky top-0 z-10 -mx-3 -mt-3 mb-1 border-b border-border bg-card px-5 py-1.5')"
      >
        <span v-if="multiple" aria-hidden="true" />
        <button
          v-for="column in columns"
          :key="column.key"
          type="button"
          :disabled="!column.sortable"
          :aria-label="sortLabel(column)"
          :class="cn(
            'flex min-w-0 items-center gap-1 rounded-sm font-mono text-[11px] uppercase tracking-wider text-muted-foreground outline-none enabled:hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50',
            column.align === 'end' && 'justify-end',
            !column.pinned && 'hidden @xl:flex',
          )"
          @click="sortBy(column)"
        >
          <span class="truncate">{{ column.label }}</span>
          <component
            :is="sort.direction === 'asc' ? ArrowUp : ArrowDown"
            v-if="sort.key === column.key"
            aria-hidden="true"
            class="size-3 shrink-0"
          />
        </button>
      </div>
      <div role="listbox" :aria-label="label" :aria-multiselectable="multiple || undefined" class="flex flex-col gap-px">
        <FileExplorerRow v-for="item in items" :key="item.id" :item="item" :columns="columns" :get-icon="getIcon">
          <template v-if="$slots.cell" #cell="scope">
            <slot name="cell" v-bind="scope" />
          </template>
        </FileExplorerRow>
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
        <button type="button" :class="fileExplorerButtonVariants({ variant: 'outline' })" @click="emit('loadMore')">{{ m.retry }}</button>
      </template>
      <button v-else type="button" :class="fileExplorerButtonVariants({ variant: 'ghost' })" @click="emit('loadMore')">
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
