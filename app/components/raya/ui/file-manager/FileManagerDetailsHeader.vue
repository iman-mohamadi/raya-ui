<script setup lang="ts" generic="TData">
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import { ArrowDown, ArrowUp } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { trackMinWidth, type ResolvedColumn } from './columns'
import { injectFileManagerContext } from './context'
import type { FileManagerSort } from './types'
import { fileManagerColumns } from './variants'

/**
 * The details view's column headers: sort on click, resize by dragging (or with
 * the keyboard on) the separator at a column's end, reorder by dragging a header
 * (or Alt+Shift+Arrow). The name column stays first and takes the remaining room.
 */
const props = defineProps<{
  columns: ResolvedColumn<TData>[]
  sort: FileManagerSort
  multiple: boolean
  resizable: boolean
  reorderable: boolean
  dir: 'ltr' | 'rtl'
}>()

const emit = defineEmits<{
  'update:sort': [value: FileManagerSort]
  /** Live width while dragging a separator, in px; `null` when the drag ends. */
  'preview': [key: string, width: number | null]
  /** A new width, or `undefined` to go back to the column's default. */
  'resize': [key: string, width: string | undefined]
  'move': [key: string, index: number]
}>()

const ctx = injectFileManagerContext()
const m = computed(() => ctx.messages.value)
const root = useTemplateRef<HTMLElement>('root')

const MIN_WIDTH = 48
const MAX_WIDTH = 640
const clamp = (width: number) => Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(width)))
const forward = computed(() => (props.dir === 'rtl' ? -1 : 1))

function cellOf(key: string) {
  return root.value?.querySelector<HTMLElement>(`[data-column="${CSS.escape(key)}"]`) ?? null
}
const widthOf = (key: string) => cellOf(key)?.getBoundingClientRect().width ?? MIN_WIDTH

/** A column's width in px for its separator's aria-valuenow: tracks other than the name's are fixed. */
function currentWidth(column: ResolvedColumn<TData>) {
  if (resizing.value?.key === column.key) return resizing.value.width
  const rootSize = typeof document === 'undefined' ? 16 : Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  return clamp(trackMinWidth(column.width) * rootSize)
}

// --- Sorting ---------------------------------------------------------------------

/** Set when a header was dragged, so the click that ends the drag does not sort. */
let suppressClick = false

function sortBy(column: ResolvedColumn<TData>) {
  if (suppressClick || !column.sortable) return
  const direction = props.sort.key === column.key && props.sort.direction === 'asc' ? 'desc' : 'asc'
  emit('update:sort', { key: column.key, direction })
}

function sortLabel(column: ResolvedColumn<TData>) {
  if (props.sort.key !== column.key) return m.value.sortBy(column.label)
  return `${m.value.sortBy(column.label)}, ${props.sort.direction === 'asc' ? m.value.ascending : m.value.descending}`
}

// --- Resizing --------------------------------------------------------------------

const resizing = ref<{ key: string, width: number } | null>(null)

function startResize(column: ResolvedColumn<TData>, event: PointerEvent) {
  if (event.button !== 0) return
  event.preventDefault()
  event.stopPropagation()
  const handle = event.currentTarget as HTMLElement
  handle.setPointerCapture(event.pointerId)
  const startX = event.clientX
  const startWidth = widthOf(column.key)
  resizing.value = { key: column.key, width: startWidth }

  const move = (moveEvent: PointerEvent) => {
    const width = clamp(startWidth + (moveEvent.clientX - startX) * forward.value)
    resizing.value = { key: column.key, width }
    emit('preview', column.key, width)
  }
  const end = () => {
    handle.removeEventListener('pointermove', move)
    handle.removeEventListener('pointerup', end)
    handle.removeEventListener('pointercancel', end)
    const done = resizing.value
    resizing.value = null
    emit('preview', column.key, null)
    if (done && done.width !== Math.round(startWidth)) emit('resize', column.key, `${done.width}px`)
  }
  handle.addEventListener('pointermove', move)
  handle.addEventListener('pointerup', end)
  handle.addEventListener('pointercancel', end)
}

function onSeparatorKeydown(column: ResolvedColumn<TData>, event: KeyboardEvent) {
  const current = Math.round(widthOf(column.key))
  const step = event.shiftKey ? 64 : 16
  let width: number | undefined
  if (event.key === 'ArrowRight') width = current + step * forward.value
  else if (event.key === 'ArrowLeft') width = current - step * forward.value
  else if (event.key === 'Home') width = MIN_WIDTH
  else if (event.key === 'End') width = MAX_WIDTH
  else if (event.key === 'Enter' || event.key === 'Delete' || event.key === 'Backspace') {
    event.preventDefault()
    emit('resize', column.key, undefined)
    return
  }
  if (width === undefined) return
  event.preventDefault()
  emit('resize', column.key, `${clamp(width)}px`)
}

// --- Reordering ------------------------------------------------------------------

const DRAG_THRESHOLD = 5
const dragging = ref<{ key: string, from: number, gap: number, indicator: number } | null>(null)
const movable = (column: ResolvedColumn<TData>) => props.reorderable && column.key !== 'name'

/**
 * Where a header dropped at `clientX` goes: the gap after the columns whose
 * middle it passed (in reading order), never before the name column. `indicator`
 * is that gap's distance from the header's start edge.
 */
function dropPosition(clientX: number) {
  const box = root.value?.getBoundingClientRect()
  const rects = props.columns.map(column => cellOf(column.key)?.getBoundingClientRect())
  const passed = (rect: DOMRect) => (forward.value === 1 ? clientX > rect.left + rect.width / 2 : clientX < rect.left + rect.width / 2)
  let gap = 1
  while (gap < rects.length && rects[gap] && passed(rects[gap]!)) gap += 1
  // Distance from the header's start edge to a column's start (or, after the last one, its end).
  const startOf = (rect: DOMRect) => (forward.value === 1 ? rect.left - (box?.left ?? 0) : (box?.right ?? 0) - rect.right)
  const endOf = (rect: DOMRect) => (forward.value === 1 ? rect.right - (box?.left ?? 0) : (box?.right ?? 0) - rect.left)
  const next = rects[gap]
  const last = rects[rects.length - 1]
  const indicator = next ? startOf(next) - 7 : last ? endOf(last) + 5 : 0
  return { gap, indicator }
}

function startReorder(column: ResolvedColumn<TData>, index: number, event: PointerEvent) {
  if (!movable(column) || event.button !== 0 || event.pointerType === 'touch') return
  const button = event.currentTarget as HTMLElement
  const startX = event.clientX
  const move = (moveEvent: PointerEvent) => {
    if (!dragging.value && Math.abs(moveEvent.clientX - startX) < DRAG_THRESHOLD) return
    if (!dragging.value) button.setPointerCapture(moveEvent.pointerId)
    const { gap, indicator } = dropPosition(moveEvent.clientX)
    dragging.value = { key: column.key, from: index, gap, indicator }
  }
  const end = () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', end)
    window.removeEventListener('pointercancel', end)
    const done = dragging.value
    dragging.value = null
    if (!done) return
    // The pointerup is followed by a click on the header: do not sort.
    suppressClick = true
    setTimeout(() => { suppressClick = false })
    // Removing the column first shifts the gaps after it by one.
    const to = done.gap > done.from ? done.gap - 1 : done.gap
    if (to !== done.from) emit('move', done.key, Math.max(1, to))
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', end)
  window.addEventListener('pointercancel', end)
}

const announcement = ref('')

function onHeaderKeydown(column: ResolvedColumn<TData>, index: number, event: KeyboardEvent) {
  if (!movable(column) || !event.altKey || !event.shiftKey) return
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
  event.preventDefault()
  const step = (event.key === 'ArrowRight' ? 1 : -1) * forward.value
  const to = Math.min(props.columns.length - 1, Math.max(1, index + step))
  if (to === index) return
  emit('move', column.key, to)
  announcement.value = ''
  nextTick(() => { announcement.value = m.value.columnMoved(column.label, to + 1, props.columns.length) })
}
</script>

<template>
  <div
    ref="root"
    role="presentation"
    :data-reordering="dragging ? '' : undefined"
    :data-resizing="resizing ? '' : undefined"
    :class="cn(fileManagerColumns, 'sticky -top-3 z-10 -mx-3 -mt-3 mb-1 border-b border-border bg-card px-5 py-1.5 data-[resizing]:cursor-col-resize data-[resizing]:select-none')"
  >
    <span v-if="multiple" aria-hidden="true" />
    <div
      v-for="(column, index) in columns"
      :key="column.key"
      :data-column="column.key"
      :data-dragging="dragging?.key === column.key ? '' : undefined"
      class="relative flex min-w-0 data-[dragging]:opacity-40"
    >
      <button
        type="button"
        :disabled="!column.sortable && !movable(column)"
        :aria-label="sortLabel(column)"
        :aria-keyshortcuts="movable(column) ? 'Alt+Shift+ArrowLeft Alt+Shift+ArrowRight' : undefined"
        :class="cn(
          'flex min-w-0 flex-1 items-center gap-1 rounded-sm font-mono text-[11px] uppercase tracking-wider rtl:tracking-normal text-muted-foreground outline-none enabled:hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50',
          column.align === 'end' && 'justify-end',
          movable(column) && 'active:cursor-grabbing',
        )"
        @click="sortBy(column)"
        @pointerdown="startReorder(column, index, $event)"
        @keydown="onHeaderKeydown(column, index, $event)"
      >
        <span class="truncate">{{ column.label }}</span>
        <component
          :is="sort.direction === 'asc' ? ArrowUp : ArrowDown"
          v-if="sort.key === column.key"
          aria-hidden="true"
          class="size-3 shrink-0"
        />
      </button>
      <span
        v-if="resizable && column.key !== 'name'"
        role="separator"
        aria-orientation="vertical"
        tabindex="0"
        :aria-label="m.resizeColumn(column.label)"
        :aria-valuenow="currentWidth(column)"
        :aria-valuemin="MIN_WIDTH"
        :aria-valuemax="MAX_WIDTH"
        data-slot="file-manager-column-resizer"
        :data-active="resizing?.key === column.key ? '' : undefined"
        class="group/resizer absolute inset-y-[-0.375rem] -end-2 z-10 flex w-2.5 cursor-col-resize touch-none justify-center outline-none"
        @pointerdown="startResize(column, $event)"
        @dblclick="emit('resize', column.key, undefined)"
        @keydown="onSeparatorKeydown(column, $event)"
      >
        <span class="w-px bg-transparent transition-colors group-hover/resizer:bg-border group-focus-visible/resizer:w-0.5 group-focus-visible/resizer:bg-ring group-data-[active]/resizer:w-0.5 group-data-[active]/resizer:bg-primary" />
      </span>
    </div>
    <span
      v-if="dragging"
      aria-hidden="true"
      class="pointer-events-none absolute inset-y-1 w-0.5 rounded-full bg-primary"
      :style="{ insetInlineStart: `${dragging.indicator}px` }"
    />
    <span class="sr-only" aria-live="polite">{{ announcement }}</span>
  </div>
</template>
