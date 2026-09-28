<script setup lang="ts" generic="TData">
import { computed } from 'vue'
import {
  DropdownMenuContent,
  DropdownMenuItemIndicator,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'reka-ui'
import {
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  LayoutGrid,
  List,
  PanelLeft,
  Plus,
  Search,
  Upload,
  X,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import FileExplorerBreadcrumbs from './FileExplorerBreadcrumbs.vue'
import FileExplorerMenuItems from './FileExplorerMenuItems.vue'
import { injectFileExplorerContext } from './context'
import type { FileExplorerAction, FileExplorerActionId, FileExplorerItem, FileExplorerSort, FileExplorerView } from './types'
import { fileExplorerButtonVariants, fileExplorerMenuContent, fileExplorerMenuItem } from './variants'

const props = defineProps<{
  /** Folders from the root down to the open one. */
  path: FileExplorerItem<TData>[]
  rootLabel: string
  listingLabel: string | null
  itemCount: number
  canGoBack: boolean
  canGoForward: boolean
  canGoUp: boolean
  disabled: boolean
  dir: 'ltr' | 'rtl'
  /** Actions for the open folder (new, upload, refresh, empty trash). */
  folderActions: FileExplorerAction[]
  /** Actions for the selection shown as buttons (download). */
  selectionActions: FileExplorerAction[]
  sortColumns: { key: string, label: string }[]
  refreshing: boolean
  searchPlaceholder: string
  showSidebarToggle: boolean
}>()

const search = defineModel<string>('search', { required: true })
const view = defineModel<FileExplorerView>('view', { required: true })
const sort = defineModel<FileExplorerSort>('sort', { required: true })

const emit = defineEmits<{
  back: []
  forward: []
  up: []
  navigate: [id: string | null]
  toggleSidebar: []
  /** A toolbar menu opened or closed. */
  menuOpen: [open: boolean]
  /** A toolbar menu is returning focus; picked actions run here. */
  menuCloseAutoFocus: [event: Event]
}>()

defineSlots<{ actions?: (props: Record<string, never>) => unknown }>()

const ctx = injectFileExplorerContext()
const m = computed(() => ctx.messages.value)

const pick = (ids: FileExplorerActionId[]) => props.folderActions.filter(action => ids.includes(action.id))
const creates = computed(() => pick(['new-folder', 'new-file']))
const uploads = computed(() => pick(['upload', 'upload-folder']))
const refresh = computed(() => props.folderActions.find(action => action.id === 'refresh'))
const emptyTrash = computed(() => props.folderActions.find(action => action.id === 'empty-trash'))
const download = computed(() => props.selectionActions.find(action => action.id === 'download'))

const sortKey = computed({
  get: () => sort.value.key,
  set: (key: string) => { sort.value = { ...sort.value, key } },
})
const sortDirection = computed({
  get: () => sort.value.direction,
  set: (direction: string) => { sort.value = { ...sort.value, direction: direction === 'desc' ? 'desc' : 'asc' } },
})

const views: { value: FileExplorerView, label: () => string, icon: typeof LayoutGrid }[] = [
  { value: 'grid', label: () => m.value.gridView, icon: LayoutGrid },
  { value: 'list', label: () => m.value.listView, icon: List },
]

const icon = cn(fileExplorerButtonVariants({ size: 'icon' }))
const labelled = (variant: 'outline' | 'solid') => cn(fileExplorerButtonVariants({ variant }), 'px-2 @3xl:px-2.5')
const menuContent = cn(fileExplorerMenuContent, 'origin-(--reka-dropdown-menu-content-transform-origin)')
</script>

<template>
  <div data-slot="file-explorer-toolbar" class="flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-border px-2 py-2 @xl:px-3">
    <div class="flex items-center">
      <button
        v-if="showSidebarToggle"
        type="button"
        :aria-label="m.toggleSidebar"
        :title="m.toggleSidebar"
        :class="cn(icon, '@3xl:hidden')"
        @click="emit('toggleSidebar')"
      >
        <PanelLeft />
      </button>
      <button type="button" :aria-label="m.back" :title="m.back" :disabled="disabled || !canGoBack" :class="icon" @click="emit('back')">
        <ArrowLeft class="rtl:-scale-x-100" />
      </button>
      <button type="button" :aria-label="m.forward" :title="m.forward" :disabled="disabled || !canGoForward" :class="cn(icon, 'hidden @md:inline-flex')" @click="emit('forward')">
        <ArrowRight class="rtl:-scale-x-100" />
      </button>
      <button type="button" :aria-label="m.up" :title="m.up" :disabled="disabled || !canGoUp" :class="icon" @click="emit('up')">
        <ArrowUp />
      </button>
    </div>

    <FileExplorerBreadcrumbs
      :path="path"
      :root-label="rootLabel"
      :listing-label="listingLabel"
      :disabled="disabled"
      :dir="dir"
      @navigate="emit('navigate', $event)"
    />
    <span class="hidden shrink-0 font-mono text-xs text-muted-foreground @4xl:inline">· {{ m.items(itemCount) }}</span>

    <div class="flex w-full items-center gap-2 @2xl:w-auto">
      <div class="relative min-w-28 flex-1 @2xl:w-40 @2xl:flex-none @4xl:w-52">
        <Search aria-hidden="true" class="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="search"
          type="text"
          role="searchbox"
          autocomplete="off"
          spellcheck="false"
          :aria-label="searchPlaceholder"
          :placeholder="searchPlaceholder"
          :disabled="disabled"
          class="h-8 w-full min-w-0 rounded-md border border-border bg-transparent ps-8 pe-7 font-mono text-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30"
          @keydown.escape="search = ''"
        >
        <button
          v-if="search"
          type="button"
          :aria-label="m.clearFilter"
          class="absolute end-1 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
          @click="search = ''"
        >
          <X aria-hidden="true" class="size-3" />
        </button>
      </div>

      <DropdownMenuRoot :dir="dir" :modal="false" @update:open="emit('menuOpen', $event)">
        <DropdownMenuTrigger :aria-label="m.sort" :title="m.sort" :disabled="disabled" :class="icon">
          <ArrowDownUp />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent align="end" :side-offset="4" :class="menuContent" @close-auto-focus="emit('menuCloseAutoFocus', $event)">
            <DropdownMenuLabel class="px-2 py-1.5 text-xs font-medium text-muted-foreground">{{ m.sort }}</DropdownMenuLabel>
            <DropdownMenuRadioGroup v-model="sortKey">
              <DropdownMenuRadioItem v-for="column in sortColumns" :key="column.key" :value="column.key" :class="cn(fileExplorerMenuItem, 'ps-8')">
                <DropdownMenuItemIndicator class="absolute start-2 flex size-4 items-center justify-center"><Check /></DropdownMenuItemIndicator>
                {{ column.label }}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator class="-mx-1 my-1 h-px bg-border" />
            <DropdownMenuRadioGroup v-model="sortDirection">
              <DropdownMenuRadioItem value="asc" :class="cn(fileExplorerMenuItem, 'ps-8')">
                <DropdownMenuItemIndicator class="absolute start-2 flex size-4 items-center justify-center"><Check /></DropdownMenuItemIndicator>
                {{ m.ascending }}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="desc" :class="cn(fileExplorerMenuItem, 'ps-8')">
                <DropdownMenuItemIndicator class="absolute start-2 flex size-4 items-center justify-center"><Check /></DropdownMenuItemIndicator>
                {{ m.descending }}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>

      <div role="group" :aria-label="m.view" class="flex shrink-0 items-center rounded-md border border-border p-0.5">
        <button
          v-for="option in views"
          :key="option.value"
          type="button"
          :aria-label="option.label()"
          :title="option.label()"
          :aria-pressed="view === option.value"
          :disabled="disabled"
          :class="cn(icon, 'size-6.5 rounded-[5px] aria-pressed:bg-accent aria-pressed:text-foreground')"
          @click="view = option.value"
        >
          <component :is="option.icon" />
        </button>
      </div>

      <slot name="actions" />

      <template v-if="download || refresh || emptyTrash || creates.length || uploads.length">
        <div aria-hidden="true" class="hidden h-5 w-px shrink-0 bg-border @md:block" />

        <!-- On phone widths Download lives in the status bar and menus, leaving room to search. -->
        <button
          v-if="download"
          type="button"
          data-action="download"
          :aria-label="download.label"
          :title="download.label"
          :disabled="disabled || download.disabled"
          :class="cn(icon, 'hidden @md:inline-flex')"
          @click="download.run()"
        >
          <component :is="download.icon" />
        </button>
        <button
          v-if="refresh"
          type="button"
          data-action="refresh"
          :aria-label="refresh.label"
          :title="refresh.label"
          :aria-busy="refreshing || undefined"
          :disabled="disabled || refreshing"
          :class="icon"
          @click="refresh.run()"
        >
          <component :is="refresh.icon" :class="refreshing && 'animate-spin motion-reduce:animate-none'" />
        </button>
        <button
          v-if="emptyTrash"
          type="button"
          data-action="empty-trash"
          :disabled="disabled || emptyTrash.disabled"
          :class="cn(labelled('outline'), 'text-destructive')"
          @click="emptyTrash.run()"
        >
          <component :is="emptyTrash.icon" />
          <span class="hidden @3xl:inline">{{ emptyTrash.label }}</span>
        </button>

        <template v-if="creates.length === 1 && creates[0]">
          <button
            type="button"
            :data-action="creates[0].id"
            :aria-label="creates[0].label"
            :disabled="disabled || creates[0].disabled"
            :class="labelled('outline')"
            @click="creates[0].run()"
          >
            <component :is="creates[0].icon" />
            <span class="hidden @3xl:inline">{{ creates[0].label }}</span>
          </button>
        </template>
        <DropdownMenuRoot v-else-if="creates.length" :dir="dir" :modal="false" @update:open="emit('menuOpen', $event)">
          <DropdownMenuTrigger data-action="new" :aria-label="m.new" :disabled="disabled || creates.every(action => action.disabled)" :class="labelled('outline')">
            <Plus />
            <span class="hidden @3xl:inline">{{ m.new }}</span>
            <ChevronDown class="hidden opacity-60 @3xl:inline" />
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent align="end" :side-offset="4" :class="menuContent" @close-auto-focus="emit('menuCloseAutoFocus', $event)">
              <FileExplorerMenuItems :actions="creates" kind="dropdown" />
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenuRoot>

        <template v-if="uploads.length === 1 && uploads[0]">
          <button
            type="button"
            data-action="upload"
            :aria-label="uploads[0].label"
            :disabled="disabled || uploads[0].disabled"
            :class="labelled('solid')"
            @click="uploads[0].run()"
          >
            <Upload />
            <span class="hidden @3xl:inline">{{ uploads[0].label }}</span>
          </button>
        </template>
        <DropdownMenuRoot v-else-if="uploads.length" :dir="dir" :modal="false" @update:open="emit('menuOpen', $event)">
          <DropdownMenuTrigger :aria-label="m.upload" :disabled="disabled || uploads.every(action => action.disabled)" :class="labelled('solid')">
            <Upload />
            <span class="hidden @3xl:inline">{{ m.upload }}</span>
            <ChevronDown class="hidden opacity-70 @3xl:inline" />
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent align="end" :side-offset="4" :class="menuContent" @close-auto-focus="emit('menuCloseAutoFocus', $event)">
              <FileExplorerMenuItems :actions="uploads" kind="dropdown" />
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
      </template>
    </div>
  </div>
</template>
