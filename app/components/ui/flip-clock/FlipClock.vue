<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import FlipUnit from './FlipUnit.vue'
import type { VariantProps } from 'class-variance-authority'

// Re-use variant definition type from FlipUnit for consistency in props,
// though we define the clock layout variants here.
const flipClockVariants = cva(
    "relative flex justify-center items-center font-mono font-medium",
    {
      variants: {
        size: {
          sm: "text-3xl space-x-1",
          md: "text-5xl space-x-2",
          lg: "text-6xl space-x-2",
          xl: "text-8xl space-x-3"
        },
        variant: {
          default: "",
          secondary: "",
          destructive: "",
          outline: "",
          muted: ""
        }
      },
      defaultVariants: {
        size: "md",
        variant: "default"
      }
    }
)

interface Props {
  countdown?: boolean
  targetDate?: Date | string
  showDays?: "auto" | "always" | "never"
  size?: VariantProps<typeof flipClockVariants>['size']
  variant?: "default" | "secondary" | "destructive" | "outline" | "muted"
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  countdown: false,
  showDays: "auto",
  size: "md",
  variant: "default"
})

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTime(countdown: boolean, targetDate?: Date | string): TimeLeft {
  const now = new Date()

  // Real-time Clock Mode
  if (!countdown) {
    return {
      days: 0,
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds()
    }
  }

  // Countdown Mode
  if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  const target = new Date(targetDate)
  const diff = Math.max(0, target.getTime() - now.getTime())

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60)
  }
}

const time = ref(getTime(props.countdown, props.targetDate))
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => {
    const nextTime = getTime(props.countdown, props.targetDate)
    // Only update state if seconds actually changed
    if (time.value.seconds !== nextTime.seconds || time.value.minutes !== nextTime.minutes) {
      time.value = nextTime
    }
  }, 250)
})

onUnmounted(() => {
  clearInterval(timer)
})

const daysStr = computed(() => String(time.value.days).padStart(3, "0"))
const hoursStr = computed(() => String(time.value.hours).padStart(2, "0"))
const minutesStr = computed(() => String(time.value.minutes).padStart(2, "0"))
const secondsStr = computed(() => String(time.value.seconds).padStart(2, "0"))

const shouldShowDays = computed(() =>
    props.countdown && (props.showDays === "always" || (props.showDays === "auto" && time.value.days > 0))
)

const heightMap: Record<string, string> = {
  sm: "text-4xl",
  md: "text-5xl",
  lg: "text-6xl",
  xl: "text-8xl"
}
</script>

<template>
  <div :class="cn(flipClockVariants({ size, variant }), props.class)">
    <template v-if="shouldShowDays">
      <FlipUnit
          v-for="(digit, i) in daysStr"
          :key="`d-${i}`"
          :digit="digit"
          :size="size"
          :variant="variant"
      />
      <span :class="cn('text-center -translate-y-[8%]', heightMap[size || 'md'])">:</span>
    </template>

    <FlipUnit
        v-for="(digit, i) in hoursStr"
        :key="`h-${i}`"
        :digit="digit"
        :size="size"
        :variant="variant"
    />

    <span :class="cn('text-center -translate-y-[8%]', heightMap[size || 'md'])">:</span>

    <FlipUnit
        v-for="(digit, i) in minutesStr"
        :key="`m-${i}`"
        :digit="digit"
        :size="size"
        :variant="variant"
    />

    <span :class="cn('text-center -translate-y-[8%]', heightMap[size || 'md'])">:</span>

    <FlipUnit
        v-for="(digit, i) in secondsStr"
        :key="`s-${i}`"
        :digit="digit"
        :size="size"
        :variant="variant"
    />
  </div>
</template>