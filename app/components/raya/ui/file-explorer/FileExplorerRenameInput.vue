<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId, useTemplateRef, type CSSProperties, type HTMLAttributes } from 'vue'
import { useEventListener, useResizeObserver } from '@vueuse/core'
import { cn } from '@/lib/utils'

const props = defineProps<{
  /** The current name. */
  name: string
  /** Folders select the whole name; files leave the extension out, like Windows. */
  isFolder: boolean
  validate: (name: string) => string | undefined
  /** Accessible name of the input. */
  label?: string
  /**
   * Selector of a positioned layer to draw the input in, over this spot. Items
   * with a listbox or tree role must not contain an input, so the explorer and
   * the tree pass their overlay. Without it, the input renders in place.
   */
  layer?: string
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits<{
  commit: [name: string]
  cancel: []
}>()

const input = useTemplateRef<HTMLInputElement>('input')
const value = ref(props.name)
const error = ref<string>()
const errorPosition = ref({ top: 0, left: 0 })
const errorId = useId()
let settled = false

// --- Overlay placement -----------------------------------------------------------

/** Holds the input's place in the item while the input is drawn in the layer. */
const anchor = useTemplateRef<HTMLElement>('anchor')
const box = ref<{ top: number, left: number, width: number, height: number, clip: string }>()

/** The nearest scrolling ancestor: the input is clipped to it, like the item. */
function scrollParent(element: HTMLElement) {
  let parent = element.parentElement
  while (parent && !/(auto|scroll)/.test(getComputedStyle(parent).overflowY)) parent = parent.parentElement
  return parent
}

function place() {
  const spot = anchor.value
  const layerElement = props.layer ? document.querySelector<HTMLElement>(props.layer) : null
  if (!spot || !layerElement) return
  const rect = spot.getBoundingClientRect()
  const origin = layerElement.getBoundingClientRect()
  const view = scrollParent(spot)?.getBoundingClientRect()
  const clip = view
    ? `inset(${Math.max(0, view.top - rect.top)}px ${Math.max(0, rect.right - view.right)}px ${Math.max(0, rect.bottom - view.bottom)}px ${Math.max(0, view.left - rect.left)}px)`
    : 'none'
  box.value = { top: rect.top - origin.top, left: rect.left - origin.left, width: rect.width, height: rect.height, clip }
  if (error.value) errorPosition.value = { top: rect.bottom - origin.top + 4, left: rect.left - origin.left }
}

const overlayStyle = computed<CSSProperties | undefined>(() => box.value && {
  position: 'absolute',
  top: `${box.value.top}px`,
  left: `${box.value.left}px`,
  width: `${box.value.width}px`,
  height: `${box.value.height}px`,
  clipPath: box.value.clip,
})

if (props.layer) {
  useResizeObserver(anchor, place)
  useEventListener(typeof window === 'undefined' ? null : window, 'scroll', place, { capture: true, passive: true })
  useEventListener(typeof window === 'undefined' ? null : window, 'resize', place, { passive: true })
}

onMounted(() => {
  place()
  // Wait a frame so a closing menu or dialog cannot take focus back.
  requestAnimationFrame(() => {
    const el = input.value
    if (!el) return
    // No scroll-into-view: it would also move clipped ancestors of the host page.
    el.focus({ preventScroll: true })
    const dot = props.name.lastIndexOf('.')
    el.setSelectionRange(0, !props.isFolder && dot > 0 ? dot : props.name.length)
  })
})

function showError(message: string) {
  error.value = message
  if (props.layer) return place()
  const rect = input.value?.getBoundingClientRect()
  if (rect) errorPosition.value = { top: rect.bottom + 4, left: rect.left }
}

function finish(kind: 'commit' | 'cancel') {
  if (settled) return
  const next = value.value.trim()
  if (kind === 'cancel' || next === props.name) {
    settled = true
    emit('cancel')
    return
  }
  const message = props.validate(next)
  if (message) {
    showError(message)
    nextTick(() => input.value?.focus({ preventScroll: true }))
    return
  }
  settled = true
  emit('commit', next)
}

function onBlur() {
  // Clicking away commits a valid name and abandons an invalid one.
  if (settled) return
  const next = value.value.trim()
  if (next !== props.name && !props.validate(next)) finish('commit')
  else {
    settled = true
    emit('cancel')
  }
}

function onKeydown(event: KeyboardEvent) {
  // Keep typing away from the tree / listbox keyboard handlers around the input.
  event.stopPropagation()
  if (event.key === 'Enter') {
    event.preventDefault()
    finish('commit')
  }
  else if (event.key === 'Escape') {
    event.preventDefault()
    finish('cancel')
  }
}
</script>

<template>
  <span v-if="layer" ref="anchor" aria-hidden="true" :class="cn('block h-6 w-full min-w-0', props.class)" />
  <Teleport :to="layer ?? 'body'" :disabled="!layer" defer>
    <input
      ref="input"
      v-model="value"
      type="text"
      data-slot="file-explorer-rename-input"
      :aria-label="label ?? 'New name'"
      autocomplete="off"
      spellcheck="false"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? errorId : undefined"
      :style="layer ? overlayStyle : undefined"
      :class="cn(
        'h-6 w-full min-w-0 select-text rounded-sm border border-ring bg-background px-1 text-sm text-foreground outline-none ring-2 ring-ring/25',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/25',
        layer ? 'pointer-events-auto' : props.class,
      )"
      @input="error = undefined"
      @keydown="onKeydown"
      @blur="onBlur"
      @click.stop
      @dblclick.stop
      @mousedown.stop
      @contextmenu.stop
      @dragstart.stop.prevent
    >
  </Teleport>
  <Teleport v-if="error" :to="layer ?? 'body'" defer>
    <p
      :id="errorId"
      role="alert"
      :class="cn('z-[100] max-w-64 rounded-md border border-destructive/40 bg-popover px-2 py-1 text-xs text-destructive shadow-md', layer ? 'absolute' : 'fixed')"
      :style="{ top: `${errorPosition.top}px`, left: `${errorPosition.left}px` }"
    >
      {{ error }}
    </p>
  </Teleport>
</template>
