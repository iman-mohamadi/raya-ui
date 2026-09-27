<script setup lang="ts" generic="TData">
import { computed, ref, watch } from 'vue'
import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'reka-ui'
import { cn } from '@/lib/utils'
import FileExplorerFileIcon from './FileExplorerFileIcon.vue'
import type { FileExplorerMessages } from './messages'
import type { FileExplorerConflict, FileExplorerConflictAction, FileExplorerItem } from './types'
import { formatBytes, formatRelativeTime } from './utils'
import { fileExplorerButtonVariants } from './variants'

const props = defineProps<{
  conflict: FileExplorerConflict<TData> | null
  /** Conflicts after this one, for "apply to all". */
  remaining: number
  rootLabel: string
  messages: FileExplorerMessages
}>()

const emit = defineEmits<{
  choose: [action: FileExplorerConflictAction, applyToAll: boolean]
  cancel: []
}>()

const applyToAll = ref(false)
watch(() => props.conflict, () => { applyToAll.value = false })

// Keep the last conflict on screen while the dialog animates out.
let last: FileExplorerConflict<TData> | null = null
const shown = computed(() => {
  if (props.conflict) last = props.conflict
  return last
})

const targetName = computed(() => shown.value?.target?.name ?? props.rootLabel)
const exists = computed(() => shown.value?.reason === 'exists')

interface Side { label: string, name: string, size: string, modified: string, item?: FileExplorerItem<TData> }

const sides = computed<Side[]>(() => {
  const conflict = shown.value
  if (!conflict || !exists.value) return []
  const now = new Date()
  const source = conflict.source
  const incoming: Side = source instanceof File
    ? { label: props.messages.conflictIncoming, name: source.name, size: formatBytes(source.size), modified: formatRelativeTime(new Date(source.lastModified), now), item: { id: `incoming:${source.name}`, name: source.name, type: 'file', mimeType: source.type || undefined, size: source.size } }
    : { label: props.messages.conflictIncoming, name: source.name, size: formatBytes(source.size), modified: formatRelativeTime(source.modifiedAt, now), item: source }
  const destination = conflict.destination
  const existing: Side | undefined = destination
    ? { label: props.messages.conflictExisting, name: destination.name, size: formatBytes(destination.size), modified: formatRelativeTime(destination.modifiedAt, now), item: destination }
    : undefined
  return existing ? [incoming, existing] : [incoming]
})

function onOpenChange(open: boolean) {
  if (!open) emit('cancel')
}

const button = (variant: 'outline' | 'solid' | 'ghost') => cn(fileExplorerButtonVariants({ variant }), 'h-9 px-4 text-sm')
</script>

<template>
  <AlertDialogRoot :open="conflict !== null" @update:open="onOpenChange">
    <AlertDialogPortal>
      <AlertDialogOverlay
        class="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
      />
      <AlertDialogContent
        data-slot="file-explorer-conflict-dialog"
        :class="cn(
          'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border border-border bg-background p-6 shadow-lg sm:max-w-lg',
          'duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        )"
      >
        <div v-if="shown" class="flex flex-col gap-2 text-center sm:text-start">
          <AlertDialogTitle class="text-lg font-semibold text-foreground">
            {{ messages.conflictTitle(shown) }}
          </AlertDialogTitle>
          <AlertDialogDescription class="text-sm text-muted-foreground">
            {{ messages.conflictDescription(shown, targetName) }}
          </AlertDialogDescription>
        </div>

        <div v-if="sides.length" class="grid gap-2 sm:grid-cols-2">
          <div
            v-for="side in sides"
            :key="side.label"
            class="flex min-w-0 items-center gap-3 rounded-md border border-border bg-muted/30 p-3"
          >
            <FileExplorerFileIcon v-if="side.item" :item="side.item" />
            <div class="min-w-0 text-start">
              <p class="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{{ side.label }}</p>
              <p class="truncate text-sm font-medium text-foreground">{{ side.name }}</p>
              <p class="truncate text-xs text-muted-foreground">
                {{ [side.size, side.modified].filter(Boolean).join(' · ') }}
              </p>
            </div>
          </div>
        </div>

        <label v-if="remaining > 0" class="flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <input v-model="applyToAll" type="checkbox" class="size-4 rounded border-border accent-primary">
          {{ messages.applyToAll(remaining) }}
        </label>

        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" :class="button('ghost')" @click="emit('cancel')">
            {{ messages.cancel }}
          </button>
          <button type="button" :class="button('outline')" @click="emit('choose', 'skip', applyToAll)">
            {{ messages.skip }}
          </button>
          <template v-if="exists">
            <button type="button" :class="button('outline')" @click="emit('choose', 'keep-both', applyToAll)">
              {{ messages.keepBoth }}
            </button>
            <button type="button" :class="button('solid')" @click="emit('choose', 'replace', applyToAll)">
              {{ messages.replace }}
            </button>
          </template>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
