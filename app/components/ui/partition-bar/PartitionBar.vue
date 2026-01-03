<script setup lang="ts">
import { ref, computed, provide, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const partitionBarVariants = cva("flex flex-row bg-background", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base" // 'text-md' isn't standard tailwind, using text-base
    }
  },
  defaultVariants: {
    size: "md"
  }
})

interface Props {
  gap?: number
  size?: VariantProps<typeof partitionBarVariants>['size']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  gap: 1,
  size: "md"
})

// State to track children values
const items = ref(new Map<string, number>())

const register = (id: string, value: number) => {
  items.value.set(id, value)
}

const unregister = (id: string) => {
  items.value.delete(id)
}

const total = computed(() => {
  let sum = 0
  for (const val of items.value.values()) {
    sum += val
  }
  return sum
})

// Provide context to children
provide('partition-bar-context', {
  total,
  size: computed(() => props.size),
  register,
  unregister
})
</script>

<template>
  <ul
      :class="cn('w-full', partitionBarVariants({ size }), props.class)"
      :style="{ gap: `${gap * 4}px` }"
  >
    <slot />
  </ul>
</template>