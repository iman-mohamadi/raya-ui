<script setup lang="ts">
import { inject, computed, type HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<PrimitiveProps & {
  class?: HTMLAttributes['class'],
  variant?: 'linear' | 'circular' | 'fill',
  size?: number
}>(), {
  variant: 'linear',
  size: 40
})

const itemContext = inject<any>('FileUploadItemContext')!

// Access the reactive state safely
const progress = computed(() => {
  const state = itemContext.state.value
  return state?.progress ?? 0
})

// Circular calculations
const radius = computed(() => (props.size - 4) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => circumference.value - (progress.value / 100) * circumference.value)
</script>

<template>
  <template v-if="progress < 100">
    <Primitive
        v-if="variant === 'linear'"
        :as="as"
        :as-child="asChild"
        :class="cn('h-1.5 w-full overflow-hidden rounded-full bg-primary/20', props.class)"
    >
      <div
          class="h-full w-full flex-1 bg-primary transition-transform duration-300 ease-linear"
          :style="{ transform: `translateX(-${100 - progress}%)` }"
      />
    </Primitive>

    <Primitive
        v-else-if="variant === 'circular'"
        :as="as"
        :as-child="asChild"
        :class="cn('relative', props.class)"
        :style="{ width: size + 'px', height: size + 'px' }"
    >
      <svg class="-rotate-90 transform transition-all duration-300" :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
        <circle class="text-primary/20" stroke-width="2" :cx="size/2" :cy="size/2" :r="radius" fill="none" stroke="currentColor" />
        <circle class="text-primary transition-all duration-300 ease-linear" stroke-width="2" stroke-linecap="round"
                :cx="size/2" :cy="size/2" :r="radius" fill="none" stroke="currentColor"
                :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset" />
      </svg>
    </Primitive>

    <Primitive
        v-else-if="variant === 'fill'"
        :as="as"
        :as-child="asChild"
        :class="cn('absolute inset-0 bg-primary/20 transition-[clip-path] duration-300 ease-linear', props.class)"
        :style="{ clipPath: `inset(${100 - progress}% 0 0 0)` }"
    />
  </template>
</template>