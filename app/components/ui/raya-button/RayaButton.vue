<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
// CHANGE THIS IMPORT:
import { type RayaButtonVariants, rayaButtonVariants } from './variants'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-vue-next'

interface Props extends /* @vue-ignore */ PrimitiveProps {
  variant?: RayaButtonVariants['variant']
  color?: RayaButtonVariants['color']
  size?: RayaButtonVariants['size']
  block?: boolean
  square?: boolean
  loading?: boolean
  class?: HTMLAttributes['class']
  asChild?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  asChild: false,
  variant: 'solid',
  color: 'primary',
  size: 'md',
  block: false,
  square: false,
  loading: false
})

const computedClass = computed(() => {
  return cn(
      rayaButtonVariants({
        variant: props.variant,
        color: props.color,
        size: props.size,
        block: props.block,
        square: props.square
      }),
      props.class
  )
})
</script>

<template>
  <Primitive
      :as="asChild ? 'slot' : 'button'"
      :as-child="asChild"
      :class="computedClass"
      :disabled="loading"
  >
    <Loader2 v-if="loading" class="animate-spin mr-2 h-4 w-4" />

    <slot />
  </Primitive>
</template>