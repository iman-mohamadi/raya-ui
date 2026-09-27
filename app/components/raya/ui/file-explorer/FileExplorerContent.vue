<script setup lang="ts" generic="TData">
import { ArrowDown, ArrowUp, CloudUpload, FolderOpen, SearchX } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import FileExplorerCard from './FileExplorerCard.vue'
import FileExplorerRow from './FileExplorerRow.vue'
import type {
  FileExplorerIconResolver,
  FileExplorerItem,
  FileExplorerSort,
  FileExplorerSortKey,
  FileExplorerView,
} from './types'
import { fileExplorerColumns } from './variants'

const props = defineProps<{
  items: FileExplorerItem<TData>[]
  view: FileExplorerView
  sort: FileExplorerSort
  query: string
  loading: boolean
  multiple: boolean
  /** Shows the drop tile, and the drop overlay while files are dragged in. */
  uploadable: boolean
  externalDrag: boolean
  folderName: string
  label: string
  getIcon?: FileExplorerIconResolver<TData>
}>()

const emit = defineEmits<{
  'update:sort': [value: FileExplorerSort]
  'pick': []
}>()

defineSlots<{
  preview?: (props: { item: FileExplorerItem<TData> }) => unknown
  empty?: (props: { query: string }) => unknown
}>()

const GRID = 'grid grid-cols-[repeat(auto-fill,minmax(13.5rem,1fr))] gap-3'

const columns: { key: FileExplorerSortKey, label: string, class?: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'modified', label: 'Modified', class: 'hidden @xl:flex' },
  { key: 'type', label: 'Type', class: 'hidden @xl:flex' },
  { key: 'size', label: 'Size', class: 'justify-end' },
]

function sortBy(key: FileExplorerSortKey) {
  const direction = props.sort.key === key && props.sort.direction === 'asc' ? 'desc' : 'asc'
  emit('update:sort', { key, direction })
}

function sortLabel(column: { key: FileExplorerSortKey, label: string }) {
  if (props.sort.key !== column.key) return `Sort by ${column.label}`
  return `Sort by ${column.label}, currently ${props.sort.direction === 'asc' ? 'ascending' : 'descending'}`
}

const SKELETON_WIDTHS = ['w-2/5', 'w-1/2', 'w-1/3', 'w-3/5', 'w-1/4', 'w-2/5', 'w-1/2', 'w-1/3']
</script>

<template>
  <div
    data-slot="file-explorer-content"
    :aria-busy="loading ? 'true' : undefined"
    class="relative min-h-0 flex-1 overflow-y-auto p-3"
  >
    <div v-if="loading" role="status" aria-label="Loading files" :class="view === 'grid' ? GRID : 'flex flex-col gap-1'">
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

    <slot v-else-if="!items.length && (query || view === 'list' || !uploadable)" name="empty" :query="query">
      <div class="flex h-full min-h-40 flex-col items-center justify-center gap-2 px-4 text-center text-sm text-muted-foreground">
        <component :is="query ? SearchX : FolderOpen" aria-hidden="true" class="size-6 text-muted-foreground/60" />
        <p v-if="query">No items match “{{ query }}”</p>
        <template v-else>
          <p>This folder is empty</p>
          <p v-if="uploadable" class="text-xs">Drop files here to upload</p>
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
        <span class="text-sm font-medium text-foreground">Drop files</span>
        <span class="text-xs text-muted-foreground">or click to upload</span>
      </button>
    </div>

    <div v-else class="flex flex-col">
      <div
        role="presentation"
        :class="cn(fileExplorerColumns, 'sticky top-0 z-10 -mx-3 -mt-3 mb-1 border-b border-border bg-card px-5 py-1.5')"
      >
        <button
          v-for="column in columns"
          :key="column.key"
          type="button"
          :aria-label="sortLabel(column)"
          :class="cn(
            'flex min-w-0 items-center gap-1 rounded-sm font-mono text-[11px] uppercase tracking-wider text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50',
            column.class,
          )"
          @click="sortBy(column.key)"
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
        <FileExplorerRow v-for="item in items" :key="item.id" :item="item" :get-icon="getIcon" />
      </div>
    </div>

    <div
      v-if="externalDrag"
      aria-hidden="true"
      class="pointer-events-none absolute inset-2 flex items-center justify-center rounded-lg border-2 border-dashed border-primary/60 bg-primary/5 text-sm font-medium text-primary backdrop-blur-[1px]"
    >
      Drop to upload to {{ folderName }}
    </div>
  </div>
</template>
