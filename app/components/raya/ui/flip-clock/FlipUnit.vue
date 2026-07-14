<script setup lang="ts">
import { ref, watch } from 'vue'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

const flipUnitVariants = cva(
    "relative subpixel-antialiased perspective-[1000px] rounded-md overflow-hidden",
    {
      variants: {
        size: {
          sm: "w-10 min-w-10 h-14 text-3xl",
          md: "w-14 min-w-14 h-20 text-5xl",
          lg: "w-17 min-w-17 h-24 text-6xl",
          xl: "w-22 min-w-22 h-32 text-8xl"
        },
        variant: {
          default: "bg-primary text-primary-foreground",
          secondary: "bg-secondary text-secondary-foreground",
          destructive: "bg-destructive text-destructive-foreground",
          outline: "border border-input bg-background text-foreground",
          muted: "bg-muted text-muted-foreground"
        }
      },
      defaultVariants: {
        size: "md",
        variant: "default"
      }
    }
)

interface Props {
  digit: string | number
  size?: VariantProps<typeof flipUnitVariants>['size']
  variant?: VariantProps<typeof flipUnitVariants>['variant']
  class?: string
}

const props = defineProps<Props>()

const prevDigit = ref(props.digit)
const flipping = ref(false)

watch(() => props.digit, (current, previous) => {
  if (current !== previous) {
    flipping.value = true
    const timer = setTimeout(() => {
      flipping.value = false
      prevDigit.value = current
    }, 550) // Slightly less than 600ms
  }
})

const commonCardStyle = "absolute inset-x-0 overflow-hidden h-1/2 bg-inherit text-inherit"
</script>

<template>
  <div :class="cn(flipUnitVariants({ size, variant }), props.class)">
    <div :class="cn(commonCardStyle, 'rounded-t-lg top-0')">
      <span class="absolute left-0 right-0 w-full flex items-center justify-center h-[200%] top-0">
        {{ digit }}
      </span>
    </div>

    <div :class="cn(commonCardStyle, 'rounded-b-lg translate-y-full')">
      <span class="absolute left-0 right-0 w-full flex items-center justify-center h-[200%] -top-[100%]">
        {{ prevDigit }}
      </span>
    </div>

    <div
        :class="cn(
        commonCardStyle,
        'z-20 origin-bottom backface-hidden rounded-t-lg',
        flipping && 'animate-flip-top'
      )"
    >
      <span class="absolute left-0 right-0 w-full flex items-center justify-center h-[200%] top-0">
        {{ prevDigit }}
      </span>
    </div>

    <div
        :class="cn(
        commonCardStyle,
        'z-10 origin-top backface-hidden rounded-b-lg translate-y-full',
        flipping && 'animate-flip-bottom'
      )"
        style="transform: rotateX(90deg)"
    >
      <span class="absolute left-0 right-0 w-full flex items-center justify-center h-[200%] -top-[100%]">
        {{ digit }}
      </span>
    </div>

    <div class="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 bg-background/50 z-30"></div>
  </div>
</template>

<style scoped>
.backface-hidden {
  backface-visibility: hidden;
}

.animate-flip-top {
  animation: flip-top-anim 0.6s ease-in forwards;
}

.animate-flip-bottom {
  animation: flip-bottom-anim 0.6s ease-out forwards;
}

@keyframes flip-top-anim {
  0% {
    transform: rotateX(0deg);
    z-index: 30;
  }
  50%, 100% {
    transform: rotateX(-90deg);
    z-index: 10;
  }
}

@keyframes flip-bottom-anim {
  0%, 50% {
    transform: rotateX(90deg);
    z-index: 10;
  }
  100% {
    transform: rotateX(0deg);
    z-index: 30;
  }
}
</style>