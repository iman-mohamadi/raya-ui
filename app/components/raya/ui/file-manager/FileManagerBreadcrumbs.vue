<script setup lang="ts" generic="TData">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from 'reka-ui'
import { useElementSize } from '@vueuse/core'
import { Ellipsis, Folder, FolderOpen } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { injectFileManagerContext } from './context'
import type { FileManagerItem } from './types'
import { fileManagerMenuContent, fileManagerMenuItem } from './variants'

const props = defineProps<{
  /** Folders from the root down to the open one. */
  path: FileManagerItem<TData>[]
  rootLabel: string
  /** Shown alone instead of the path while a listing (search results, Recent…) is displayed. */
  listingLabel: string | null
  disabled: boolean
  dir: 'ltr' | 'rtl'
}>()

const emit = defineEmits<{
  navigate: [id: string | null]
}>()

const ctx = injectFileManagerContext()

interface Crumb { id: string | null, label: string }

const all = computed<Crumb[]>(() => [
  { id: null, label: props.rootLabel },
  ...props.path.map(folder => ({ id: folder.id, label: folder.name })),
])

/** Folders between the root and the open one. */
const between = computed(() => all.value.slice(1, -1))

/**
 * Long paths keep the root, the parent and the open folder; the rest sits in a
 * menu. When even that does not fit, the parent joins the menu too (`squeeze`)
 * before any label is truncated.
 */
const squeeze = ref(0)
const hiddenCount = computed(() => Math.min(between.value.length, Math.max(0, between.value.length - 1) + squeeze.value))
const collapsed = computed(() => between.value.slice(0, hiddenCount.value))
const visible = computed(() => {
  const [root] = all.value
  const current = all.value.length > 1 ? all.value.at(-1) : undefined
  return [root, ...between.value.slice(hiddenCount.value), current].filter(crumb => crumb !== undefined)
})

const list = useTemplateRef<HTMLElement>('list')
const { width } = useElementSize(list)
const truncated = () => [...(list.value?.querySelectorAll<HTMLElement>('[data-crumb]') ?? [])]
  .some(label => label.scrollWidth > label.clientWidth + 1)

async function fit() {
  squeeze.value = 0
  await nextTick()
  while (hiddenCount.value < between.value.length && truncated()) {
    squeeze.value += 1
    await nextTick()
  }
}
watch([width, all, () => props.listingLabel], fit, { flush: 'post' })

function onDragOver(id: string | null, event: DragEvent) {
  ctx.dragDrop.onDragOver(id, event)
  event.stopPropagation()
}

const crumbButton = 'block max-w-full truncate rounded px-1 py-0.5 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 data-[drop-target]:bg-primary/15 data-[drop-target]:text-primary'
</script>

<template>
  <nav :aria-label="ctx.messages.value.folderPath" class="flex min-w-0 flex-1 items-center gap-1.5 font-mono text-xs">
    <component :is="listingLabel ? FolderOpen : Folder" aria-hidden="true" class="size-4 shrink-0 text-muted-foreground" />
    <ol ref="list" class="flex min-w-0 flex-1 items-center gap-1">
      <li v-if="listingLabel" class="min-w-0 max-w-[80%] shrink-0">
        <span aria-current="page" class="block truncate rounded bg-muted px-1.5 py-0.5 text-foreground">{{ listingLabel }}</span>
      </li>
      <template v-for="(crumb, i) in (listingLabel ? [] : visible)" :key="crumb.id ?? 'root'">
        <li v-if="i > 0" aria-hidden="true" class="shrink-0 text-muted-foreground/50">/</li>

        <template v-if="i === 1 && collapsed.length">
          <li class="shrink-0">
            <DropdownMenuRoot :dir="dir" :modal="false">
              <DropdownMenuTrigger
                :aria-label="ctx.messages.value.hiddenFolders"
                :disabled="disabled"
                class="flex h-5 items-center rounded px-1 text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <Ellipsis aria-hidden="true" class="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent align="start" :side-offset="4" :class="cn(fileManagerMenuContent, 'origin-(--reka-dropdown-menu-content-transform-origin)')">
                  <DropdownMenuItem
                    v-for="hidden in collapsed"
                    :key="hidden.id ?? 'root'"
                    :class="fileManagerMenuItem"
                    @select="emit('navigate', hidden.id)"
                  >
                    <Folder aria-hidden="true" />
                    <span class="truncate">{{ hidden.label }}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenuRoot>
          </li>
          <li aria-hidden="true" class="shrink-0 text-muted-foreground/50">/</li>
        </template>

        <li :class="cn('min-w-0', i === visible.length - 1 ? 'shrink-0 max-w-[60%]' : 'max-w-40')">
          <span
            v-if="i === visible.length - 1"
            aria-current="page"
            data-crumb
            :data-drop-target="ctx.dragDrop.dropTargetId.value === crumb.id ? '' : undefined"
            class="block max-w-full truncate rounded bg-muted px-1.5 py-0.5 text-foreground data-[drop-target]:bg-primary/15 data-[drop-target]:text-primary"
          >{{ crumb.label }}</span>
          <button
            v-else
            type="button"
            data-crumb
            :disabled="disabled"
            :data-drop-target="ctx.dragDrop.dropTargetId.value === crumb.id ? '' : undefined"
            :class="crumbButton"
            @click="emit('navigate', crumb.id)"
            @dragover="onDragOver(crumb.id, $event)"
            @drop.stop="ctx.dragDrop.onDrop($event)"
          >
            {{ crumb.label }}
          </button>
        </li>
      </template>
    </ol>
  </nav>
</template>
