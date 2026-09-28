<script setup lang="ts">
import { computed, nextTick, ref, watch, type Ref } from 'vue'
import { CircleAlert, CircleCheck, LoaderCircle, X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import type { FileExplorerMessages } from './messages'
import type { FileExplorerOperationState } from './types'

const props = defineProps<{
  operations: FileExplorerOperationState[]
  messages: FileExplorerMessages
}>()

const emit = defineEmits<{
  cancel: [id: string]
  retry: [id: string]
  undo: [id: string]
  dismiss: [id: string]
}>()

const VISIBLE = 4
const shown = computed(() => props.operations.slice(0, VISIBLE))
const hidden = computed(() => Math.max(0, props.operations.length - VISIBLE))

/** Operations from the app may leave out `label`: fall back to the standard wording. */
const labelOf = (operation: FileExplorerOperationState) =>
  operation.label ?? props.messages.operationLabel(operation.type, operation.status, operation.itemIds?.length ?? 1)

const active = (operation: FileExplorerOperationState) => operation.status === 'running' || operation.status === 'pending'

const link = 'shrink-0 rounded-sm text-xs font-medium outline-none underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring/50'
/** Primary actions: themed underline in light mode (primary text is too pale on white), primary text in dark. */
const primaryLink = 'text-foreground underline decoration-primary decoration-2 dark:text-primary dark:no-underline dark:hover:underline'

// Announcements go through two live regions that always exist (content added
// to a region created at the same moment is often not read): progress and
// success are polite, failures assertive. Each status change is read once.
const politeMessage = ref('')
const alertMessage = ref('')
const lastStatus = new Map<string, FileExplorerOperationState['status']>()
let mounted = false

function announce(region: Ref<string>, text: string) {
  region.value = ''
  nextTick(() => { region.value = text })
}

watch(() => props.operations.map(operation => `${operation.id}:${operation.status}`).join('|'), () => {
  const seen = new Set<string>()
  for (const operation of props.operations) {
    seen.add(operation.id)
    const previous = lastStatus.get(operation.id)
    if (previous === operation.status) continue
    lastStatus.set(operation.id, operation.status)
    if (!mounted || operation.status === 'pending') continue
    if (operation.status === 'error') announce(alertMessage, [labelOf(operation), operation.error].filter(Boolean).join(': '))
    else announce(politeMessage, labelOf(operation))
  }
  for (const id of [...lastStatus.keys()]) if (!seen.has(id)) lastStatus.delete(id)
  mounted = true
}, { immediate: true })
</script>

<template>
  <div class="sr-only" aria-live="polite" aria-atomic="true">{{ politeMessage }}</div>
  <div class="sr-only" role="alert" aria-atomic="true">{{ alertMessage }}</div>
  <section
    v-if="operations.length"
    data-slot="file-explorer-operations"
    :aria-label="messages.operations"
    class="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex flex-col items-end gap-2 @md:start-auto @md:w-80"
  >
    <ul class="flex w-full flex-col gap-2">
      <li
        v-for="operation in shown"
        :key="operation.id"
        :data-status="operation.status"
        :aria-busy="active(operation) || undefined"
        class="pointer-events-auto flex flex-col gap-2 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md animate-in fade-in-0 slide-in-from-bottom-2 motion-reduce:animate-none"
      >
        <div class="flex items-start gap-2">
          <LoaderCircle v-if="active(operation)" aria-hidden="true" class="mt-0.5 size-4 shrink-0 animate-spin text-muted-foreground motion-reduce:animate-none" />
          <CircleAlert v-else-if="operation.status === 'error'" aria-hidden="true" class="mt-0.5 size-4 shrink-0 text-destructive" />
          <CircleCheck v-else-if="operation.status === 'success'" aria-hidden="true" class="mt-0.5 size-4 shrink-0 text-emerald-700 dark:text-emerald-400" />
          <X v-else aria-hidden="true" class="mt-0.5 size-4 shrink-0 text-muted-foreground" />

          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium">{{ labelOf(operation) }}</p>
            <p v-if="operation.error" class="line-clamp-2 text-xs text-muted-foreground">{{ operation.error }}</p>
          </div>

          <div class="flex items-center gap-2">
            <button v-if="active(operation) && operation.cancelable" type="button" :class="cn(link, 'text-muted-foreground hover:text-foreground')" @click="emit('cancel', operation.id)">
              {{ messages.cancel }}
            </button>
            <button v-if="operation.status === 'error' && operation.retryable" type="button" :class="cn(link, primaryLink)" @click="emit('retry', operation.id)">
              {{ messages.retry }}
            </button>
            <button v-if="operation.status === 'success' && operation.undoable" type="button" :class="cn(link, primaryLink)" @click="emit('undo', operation.id)">
              {{ messages.undo }}
            </button>
            <button
              v-if="!active(operation)"
              type="button"
              :aria-label="messages.dismiss"
              class="-me-1.5 -my-1 flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
              @click="emit('dismiss', operation.id)"
            >
              <X aria-hidden="true" class="size-3.5" />
            </button>
          </div>
        </div>

        <div
          v-if="active(operation)"
          role="progressbar"
          :aria-label="labelOf(operation)"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="operation.progress"
          class="relative h-1 overflow-hidden rounded-full bg-muted"
        >
          <div
            v-if="operation.progress !== undefined"
            class="h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none"
            :style="{ width: `${operation.progress}%` }"
          />
          <div v-else class="absolute inset-y-0 w-1/3 rounded-full bg-primary/70 animate-[file-explorer-indeterminate_1.2s_ease-in-out_infinite] motion-reduce:animate-none" />
        </div>
      </li>
    </ul>
    <p v-if="hidden" class="pointer-events-auto rounded-md bg-popover px-2 py-0.5 text-xs text-muted-foreground shadow-sm">
      {{ messages.moreOperations(hidden) }}
    </p>
  </section>
</template>

<style>
@keyframes file-explorer-indeterminate {
  from { inset-inline-start: -33%; }
  to { inset-inline-start: 100%; }
}
</style>
