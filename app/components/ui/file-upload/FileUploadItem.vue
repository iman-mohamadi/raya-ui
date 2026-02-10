<script setup lang="ts">
import { inject, provide, computed, type HTMLAttributes, toRaw } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<PrimitiveProps & {
  file: File
  class?: HTMLAttributes['class']
}>()

const context = inject<any>('FileUploadContext')!

// Use toRaw to ensure we match the Raw File object used as key in the Map
const fileState = computed(() => context.fileStates.get(toRaw(props.file)))

provide('FileUploadItemContext', {
  file: props.file,
  state: fileState
})
</script>

<template>
  <Primitive
      :as="as"
      :as-child="asChild"
      role="listitem"
      data-slot="file-upload-item"
      :class="cn('relative flex items-center gap-2.5 rounded-md border p-3', props.class)"
  >
    <slot />
  </Primitive>
</template>