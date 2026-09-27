<script setup lang="ts" generic="TData">
import { computed } from 'vue'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'reka-ui'
import { cn } from '@/lib/utils'
import { defaultFileExplorerMessages, type FileExplorerMessages } from './messages'
import type { FileExplorerItem } from './types'
import { fileExplorerButtonVariants } from './variants'

const props = withDefaults(defineProps<{
  /** Items waiting for confirmation; `null` closes the dialog. */
  items: FileExplorerItem<TData>[] | null
  /** Overrides the default "Delete …?" wording, e.g. for a permanent delete. */
  title?: string
  description?: string
  confirmLabel?: string
  messages?: FileExplorerMessages
}>(), {
  title: undefined,
  description: undefined,
  confirmLabel: undefined,
  messages: () => defaultFileExplorerMessages,
})

const emit = defineEmits<{
  confirm: [items: FileExplorerItem<TData>[]]
  /** The dialog closed, after a confirm or a cancel. */
  close: []
  /** Focus is about to return; call `preventDefault` to move it elsewhere. */
  closeAutoFocus: [event: Event]
}>()

defineSlots<{
  description?: (props: { items: FileExplorerItem<TData>[] }) => unknown
}>()

// Keep the last content while the dialog animates out.
let lastItems: FileExplorerItem<TData>[] = []
let lastText = { title: '', description: '', confirm: '' }
const shown = computed(() => {
  if (props.items) {
    lastItems = props.items
    lastText = {
      title: props.title ?? props.messages.deleteTitle(props.items),
      description: props.description ?? props.messages.deleteDescription(props.items),
      confirm: props.confirmLabel ?? props.messages.delete,
    }
  }
  return { items: lastItems, ...lastText }
})

function onOpenChange(open: boolean) {
  if (!open) emit('close')
}
</script>

<template>
  <AlertDialogRoot :open="items !== null" @update:open="onOpenChange">
    <AlertDialogPortal>
      <AlertDialogOverlay
        class="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
      />
      <AlertDialogContent
        data-slot="file-explorer-delete-dialog"
        :class="cn(
          'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border border-border bg-background p-6 shadow-lg sm:max-w-md',
          'duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        )"
        @close-auto-focus="emit('closeAutoFocus', $event)"
      >
        <div class="flex flex-col gap-2 text-center sm:text-start">
          <AlertDialogTitle class="truncate text-lg font-semibold text-foreground">
            {{ shown.title }}
          </AlertDialogTitle>
          <AlertDialogDescription class="text-sm text-muted-foreground">
            <slot name="description" :items="shown.items">
              {{ shown.description }}
            </slot>
          </AlertDialogDescription>
        </div>
        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AlertDialogCancel :class="cn(fileExplorerButtonVariants({ variant: 'outline' }), 'h-9 px-4 text-sm')">
            {{ messages.cancel }}
          </AlertDialogCancel>
          <AlertDialogAction
            :class="cn(fileExplorerButtonVariants(), 'h-9 bg-destructive px-4 text-sm text-white hover:bg-destructive/90 hover:text-white focus-visible:ring-destructive/40')"
            @click="emit('confirm', shown.items)"
          >
            {{ shown.confirm }}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
