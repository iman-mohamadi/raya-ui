<script setup lang="ts">
import { inject, type HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'

const props = withDefaults(defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>(), {
  as: 'button'
})
const rootContext = inject<any>('FileUploadContext')!

function onClick() {
  rootContext.clearFiles()
}
</script>

<template>
  <Primitive
      v-if="rootContext.files.value.length > 0"
      :as="as"
      :as-child="asChild"
      type="button"
      @click="onClick"
      :class="props.class"
  >
    <slot />
  </Primitive>
</template>