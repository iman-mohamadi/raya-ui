<script setup lang="ts" generic="TData">
import FileManagerCardBody from './FileManagerCardBody.vue'
import type { FileManagerIconResolver, FileManagerItem } from './types'
import { useFileManagerItemRoot } from './useFileManagerItem'

const props = defineProps<{
  item: FileManagerItem<TData>
  getIcon?: FileManagerIconResolver<TData>
}>()

defineSlots<{
  preview?: (props: { item: FileManagerItem<TData> }) => unknown
}>()

// The card's root only: selection, focus and drag state. The content lives in
// FileManagerCardBody so that those changes do not render it again.
const { attrs, nameId, descriptionId } = useFileManagerItemRoot(() => props.item)
</script>

<template>
  <div
    v-bind="attrs"
    data-slot="file-manager-card"
    class="group/card relative flex min-w-0 cursor-default select-none flex-col gap-3 overflow-hidden rounded-lg border border-border bg-card p-3 text-start outline-none [contain-intrinsic-size:auto_9.5rem] [content-visibility:auto] hover:border-foreground/20 focus-visible:ring-2 focus-visible:ring-ring/50 data-[selected]:border-primary/60 data-[selected]:bg-primary/[0.04] data-[selected]:ring-1 data-[selected]:ring-primary/25 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[cut]:opacity-55 data-[dragging]:opacity-50 data-[touch-lifted]:scale-[1.02] data-[touch-lifted]:shadow-lg motion-safe:transition-transform data-[drop-target]:border-primary data-[drop-target]:bg-primary/10 data-[drop-invalid]:border-destructive/60 data-[drop-invalid]:bg-destructive/5 data-[operation=error]:border-destructive/50"
  >
    <FileManagerCardBody :item="item" :get-icon="getIcon" :name-id="nameId" :description-id="descriptionId" />
  </div>
</template>
