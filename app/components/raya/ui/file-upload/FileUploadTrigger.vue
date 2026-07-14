<script setup lang="ts">
import { inject, type HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'

const props = withDefaults(defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>(), {
  as: 'button'
})
const context = inject<any>('FileUploadContext')!

function onClick(e: MouseEvent) {
  context.inputRef.value?.click()
}
</script>

<template>
  <Primitive
      :as="as"
      :as-child="asChild"
      type="button"
      :disabled="context.props.value.disabled"
      data-slot="file-upload-trigger"
      :data-disabled="context.props.value.disabled ? '' : undefined"
      @click="onClick"
      :class="props.class"
  >
    <slot />
  </Primitive>
</template>