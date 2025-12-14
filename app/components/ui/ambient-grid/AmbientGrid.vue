{
type: uploaded file
fileName: iman-mohamadi/enzoui/EnzOUi-481682bc4f3f825c0131815bd4179e5da136063e/app/components/ui/ambient-grid/AmbientGrid.vue
fullContent:
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  /**
   * The size of the grid pattern in pixels.
   * @default 24
   */
  gridSize?: number
  /**
   * Primary glow color (top/mouse follower).
   * @default "#a855f7" (purple-500)
   */
  color1?: string
  /**
   * Secondary glow color (bottom/static).
   * @default "#3b82f6" (blue-500)
   */
  color2?: string
  /**
   * Whether the primary glow should follow the mouse.
   * @default true
   */
  interactive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  gridSize: 24,
  color1: '#a855f7', // purple-500
  color2: '#3b82f6', // blue-500
  interactive: true,
})

const container = ref<HTMLElement | null>(null)
const { elementX, elementY, isOutside } = useMouseInElement(container)

// Smoothly transition the spotlight position
const spotlightPos = computed(() => {
  if (!props.interactive || isOutside.value) {
    return { x: '50%', y: '0%' } // Default position (top center)
  }
  return { x: `${elementX.value}px`, y: `${elementY.value}px` }
})
</script>

<template>
  <div
      ref="container"
      :class="cn('absolute inset-0 z-0 overflow-hidden bg-background', props.class)"
  >
    <div
        class="absolute inset-0 z-0 transition-opacity duration-700"
        :style="{
        '--grid-size': `${gridSize}px`,
        '--color-1': color1,
        '--color-2': color2,
        '--mouse-x': spotlightPos.x,
        '--mouse-y': spotlightPos.y
      }"
    >
      <div
          class="absolute inset-0 h-full w-full opacity-[0.15]"
          style="background-image: linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px); background-size: var(--grid-size) var(--grid-size);"
      ></div>

      <div
          class="absolute h-[500px] w-[500px] rounded-full opacity-30 blur-[100px] transition-all duration-100 ease-out will-change-transform"
          :style="{
          background: 'var(--color-1)',
          left: 'var(--mouse-x)',
          top: 'var(--mouse-y)',
          transform: 'translate(-50%, -50%)'
        }"
      ></div>

      <div
          class="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/3 translate-y-1/3 rounded-full opacity-20 blur-[100px]"
          :style="{ background: 'var(--color-2)' }"
      ></div>
    </div>

    <div class="relative z-10 h-full w-full">
      <slot />
    </div>
  </div>
</template>
}