<script setup lang="ts">
import { inject, type HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>()
const context = inject<any>('FileUploadContext')!

function onClick(e: MouseEvent) {
  // If we clicked a trigger inside the dropzone, don't trigger input
  const target = e.target as HTMLElement
  if (target.closest('[data-slot="file-upload-trigger"]')) return

  context.inputRef.value?.click()
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  context.setDragOver(true)
}

function onDragLeave(e: DragEvent) {
  e.preventDefault()
  context.setDragOver(false)
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  context.setDragOver(false)
  if (e.dataTransfer?.files) {
    context.handleFileChange(Array.from(e.dataTransfer.files))
  }
}
</script>

<template>
  <Primitive
      :as="as"
      :as-child="asChild"
      role="button"
      :id="context.dropzoneId"
      :class="cn(
      'relative flex select-none flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 outline-none transition-colors hover:bg-accent/30 focus-visible:border-ring/50',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'data-[dragging]:border-primary/30 data-[dragging]:bg-accent/30',
      'data-[invalid]:border-destructive data-[invalid]:ring-destructive/20',
      props.class
    )"
      :data-disabled="context.props.value.disabled ? '' : undefined"
      :data-dragging="context.dragOver.value ? '' : undefined"
      :data-invalid="context.invalid.value ? '' : undefined"
      @click="onClick"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
  >
    <slot />
  </Primitive>
</template>