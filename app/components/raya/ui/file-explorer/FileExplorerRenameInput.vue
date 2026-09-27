<script setup lang="ts">
import { nextTick, onMounted, ref, useId, useTemplateRef, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  /** The current name. */
  name: string
  /** Folders select the whole name; files leave the extension out, like Windows. */
  isFolder: boolean
  validate: (name: string) => string | undefined
  /** Accessible name of the input. */
  label?: string
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

onMounted(() => {
  // Wait a frame so a closing menu or dialog cannot take focus back.
  requestAnimationFrame(() => {
    const el = input.value
    if (!el) return
    el.focus()
    const dot = props.name.lastIndexOf('.')
    el.setSelectionRange(0, !props.isFolder && dot > 0 ? dot : props.name.length)
  })
})

function showError(message: string) {
  error.value = message
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
    nextTick(() => input.value?.focus())
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
    :class="cn(
      'h-6 w-full min-w-0 select-text rounded-sm border border-ring bg-background px-1 text-sm text-foreground outline-none ring-2 ring-ring/25',
      'aria-invalid:border-destructive aria-invalid:ring-destructive/25',
      props.class,
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
  <Teleport v-if="error" to="body">
    <p
      :id="errorId"
      role="alert"
      class="fixed z-[100] max-w-64 rounded-md bg-destructive px-2 py-1 text-xs text-white shadow-md"
      :style="{ top: `${errorPosition.top}px`, left: `${errorPosition.left}px` }"
    >
      {{ error }}
    </p>
  </Teleport>
</template>
