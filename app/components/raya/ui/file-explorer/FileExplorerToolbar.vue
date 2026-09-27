<script setup lang="ts" generic="TData">
import { computed } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Folder,
  FolderPlus,
  LayoutGrid,
  List,
  Search,
  Upload,
  X,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { injectFileExplorerContext } from './context'
import type { FileExplorerItem, FileExplorerView } from './types'
import { fileExplorerButtonVariants } from './variants'

const props = defineProps<{
  /** Folders from the root down to the open one. */
  path: FileExplorerItem<TData>[]
  rootLabel: string
  itemCount: number
  canGoBack: boolean
  canGoForward: boolean
  canGoUp: boolean
  showNewFolder: boolean
  showUpload: boolean
  disabled: boolean
}>()

const search = defineModel<string>('search', { required: true })
const view = defineModel<FileExplorerView>('view', { required: true })

const emit = defineEmits<{
  back: []
  forward: []
  up: []
  navigate: [id: string | null]
  newFolder: []
  upload: []
}>()

defineSlots<{ actions?: (props: Record<string, never>) => unknown }>()

const ctx = injectFileExplorerContext()

interface Crumb { id: string | null, label: string }

/** Long paths keep the root, the parent and the open folder, like a collapsed address bar. */
const crumbs = computed<(Crumb | 'ellipsis')[]>(() => {
  const all: Crumb[] = [{ id: null, label: props.rootLabel }, ...props.path.map(folder => ({ id: folder.id, label: folder.name }))]
  const [root] = all
  return all.length > 3 && root ? [root, 'ellipsis', ...all.slice(-2)] : all
})

function onCrumbDragOver(id: string | null, event: DragEvent) {
  ctx.dragDrop.onDragOver(id, event)
  event.stopPropagation()
}

const views: { value: FileExplorerView, label: string, icon: typeof LayoutGrid }[] = [
  { value: 'grid', label: 'Grid view', icon: LayoutGrid },
  { value: 'list', label: 'Details view', icon: List },
]
</script>

<template>
  <div data-slot="file-explorer-toolbar" class="flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-border px-2 py-2 @xl:px-3">
    <div class="flex items-center">
      <button type="button" aria-label="Back" :disabled="disabled || !canGoBack" :class="fileExplorerButtonVariants({ size: 'icon' })" @click="emit('back')">
        <ArrowLeft />
      </button>
      <button type="button" aria-label="Forward" :disabled="disabled || !canGoForward" :class="cn(fileExplorerButtonVariants({ size: 'icon' }), 'hidden @md:inline-flex')" @click="emit('forward')">
        <ArrowRight />
      </button>
      <button type="button" aria-label="Up to parent folder" :disabled="disabled || !canGoUp" :class="fileExplorerButtonVariants({ size: 'icon' })" @click="emit('up')">
        <ArrowUp />
      </button>
    </div>

    <nav aria-label="Folder path" class="flex min-w-0 flex-1 items-center gap-1.5 font-mono text-xs">
      <Folder aria-hidden="true" class="size-4 shrink-0 text-muted-foreground" />
      <ol class="flex min-w-0 items-center gap-1">
        <template v-for="(crumb, i) in crumbs" :key="crumb === 'ellipsis' ? 'ellipsis' : crumb.id ?? 'root'">
          <li v-if="i > 0" aria-hidden="true" class="shrink-0 text-muted-foreground/50">/</li>
          <li v-if="crumb === 'ellipsis'" class="shrink-0 text-muted-foreground">…</li>
          <li v-else :class="cn('min-w-0', i === crumbs.length - 1 ? 'shrink-0 max-w-[60%]' : 'max-w-40')">
            <span
              v-if="i === crumbs.length - 1"
              aria-current="page"
              :data-drop-target="ctx.dragDrop.dropTargetId.value === crumb.id ? '' : undefined"
              class="block max-w-full truncate rounded bg-muted px-1.5 py-0.5 text-foreground data-[drop-target]:bg-primary/15 data-[drop-target]:text-primary"
            >{{ crumb.label }}</span>
            <button
              v-else
              type="button"
              :disabled="disabled"
              :data-drop-target="ctx.dragDrop.dropTargetId.value === crumb.id ? '' : undefined"
              class="block max-w-full truncate rounded px-1 py-0.5 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 data-[drop-target]:bg-primary/15 data-[drop-target]:text-primary"
              @click="emit('navigate', crumb.id)"
              @dragover="onCrumbDragOver(crumb.id, $event)"
              @drop.stop="ctx.dragDrop.onDrop($event)"
            >
              {{ crumb.label }}
            </button>
          </li>
        </template>
      </ol>
      <span class="hidden shrink-0 text-muted-foreground @4xl:inline">· {{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }}</span>
    </nav>

    <div class="flex w-full items-center gap-2 @2xl:w-auto">
      <div class="relative min-w-0 flex-1 @2xl:w-40 @2xl:flex-none @4xl:w-52">
        <Search aria-hidden="true" class="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="search"
          type="text"
          role="searchbox"
          autocomplete="off"
          spellcheck="false"
          aria-label="Filter files"
          placeholder="Filter files…"
          :disabled="disabled"
          class="h-8 w-full min-w-0 rounded-md border border-border bg-transparent ps-8 pe-7 font-mono text-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30"
          @keydown.escape="search = ''"
        >
        <button
          v-if="search"
          type="button"
          aria-label="Clear filter"
          class="absolute end-1.5 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
          @click="search = ''"
        >
          <X aria-hidden="true" class="size-3" />
        </button>
      </div>

      <div role="group" aria-label="View" class="flex shrink-0 items-center rounded-md border border-border p-0.5">
        <button
          v-for="option in views"
          :key="option.value"
          type="button"
          :aria-label="option.label"
          :aria-pressed="view === option.value"
          :disabled="disabled"
          :class="cn(fileExplorerButtonVariants({ size: 'icon' }), 'size-6.5 rounded-[5px] aria-pressed:bg-accent aria-pressed:text-foreground')"
          @click="view = option.value"
        >
          <component :is="option.icon" />
        </button>
      </div>

      <slot name="actions" />

      <template v-if="showNewFolder || showUpload">
        <div aria-hidden="true" class="h-5 w-px shrink-0 bg-border" />
        <button
          v-if="showNewFolder"
          type="button"
          aria-label="New folder"
          :disabled="disabled"
          :class="cn(fileExplorerButtonVariants({ variant: 'outline' }), 'px-2 @3xl:px-2.5')"
          @click="emit('newFolder')"
        >
          <FolderPlus />
          <span class="hidden @3xl:inline">New Folder</span>
        </button>
        <button
          v-if="showUpload"
          type="button"
          aria-label="Upload"
          :disabled="disabled"
          :class="cn(fileExplorerButtonVariants({ variant: 'solid' }), 'px-2 @3xl:px-2.5')"
          @click="emit('upload')"
        >
          <Upload />
          <span class="hidden @3xl:inline">Upload</span>
        </button>
      </template>
    </div>
  </div>
</template>
