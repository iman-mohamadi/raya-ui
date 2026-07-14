<script setup lang="ts">
import { inject, type HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<PrimitiveProps & {
  class?: HTMLAttributes['class']
}>()

const context = inject<any>('FileUploadContext')!
</script>

<template>
  <Primitive
      v-if="context.files.value.length > 0"
      :as="as"
      :as-child="asChild"
      role="list"
      :id="context.listId"
      data-slot="file-upload-list"
      :class="cn('flex flex-col gap-2', props.class)"
  >
    <slot />
  </Primitive>
</template>