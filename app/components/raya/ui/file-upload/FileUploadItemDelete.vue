<script setup lang="ts">
import { inject, type HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>(), {
  as: 'button'
})
const rootContext = inject<any>('FileUploadContext')!
const itemContext = inject<any>('FileUploadItemContext')!

function onClick() {
  rootContext.removeFile(itemContext.file)
}
</script>

<template>
  <Primitive
      :as="as"
      :as-child="asChild"
      type="button"
      @click="onClick"
      :class="props.class"
  >
    <slot />
  </Primitive>
</template>