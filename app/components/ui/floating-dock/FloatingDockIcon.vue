<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  mouseX: number
  title: string
  icon: any
  href: string
}>()

const elRef = ref<HTMLElement | null>(null)
const bounds = ref({ x: 0, width: 0 })
const hover = ref(false)

// 1. Efficiently get bounds
const updateBounds = () => {
  if (elRef.value) {
    const rect = elRef.value.getBoundingClientRect()
    bounds.value = {
      // Add scrollX to ensure position is correct relative to the document
      x: rect.left + window.scrollX,
      width: rect.width
    }
  }
}

onMounted(() => {
  updateBounds()
  window.addEventListener('resize', updateBounds)
  window.addEventListener('scroll', updateBounds)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateBounds)
  window.removeEventListener('scroll', updateBounds)
})

// 2. Calculate Target Dimensions
const baseWidth = 40
const distanceLimit = 150
const distanceInput = computed(() => {
  if (props.mouseX === Infinity) return Infinity
  // Distance from center of the icon
  return props.mouseX - (bounds.value.x + bounds.value.width / 2)
})

const targetWidth = computed(() => {
  const distance = distanceInput.value
  if (Math.abs(distance) > distanceLimit) return baseWidth

  // Cosine interpolation for a smoother bell-curve feel than linear
  const percent = (1 - Math.abs(distance) / distanceLimit)
  // Maps -150..0..150 to 0..1..0

  // Using simple easing for better feel
  const eased = percent * percent // Ease in-outish

  return baseWidth + (40 * percent) // 40px base + up to 40px growth
})

// 3. Stable Spring Physics (Mass-Spring-Damper)
// We increase mass to 1.0 to prevent instability explosions.
const width = ref(baseWidth)
let velocity = 0

// Constants tuned for "Bouncy but Stable"
const mass = 1
const stiffness = 150 // Tension
const damping = 15    // Friction

let rafId: number | null = null
let lastTime = 0

const animate = (time: number) => {
  if (!lastTime) lastTime = time

  // Calculate Delta Time in seconds (capped at 0.1s to prevent explosion on lag)
  const dt = Math.min((time - lastTime) / 1000, 0.1)
  lastTime = time

  const current = width.value
  const target = targetWidth.value

  // Spring Force: F = -k(x - target)
  const springForce = -stiffness * (current - target)

  // Damping Force: F = -d * v
  const dampingForce = -damping * velocity

  // Acceleration: a = F / m
  const acceleration = (springForce + dampingForce) / mass

  // Euler Integration
  velocity += acceleration * dt
  width.value += velocity * dt

  // Clamp width to sane values to absolutely prevent the 3.4e38px bug
  if (width.value < baseWidth) width.value = baseWidth
  if (width.value > 150) width.value = 150

  // Stop condition: low velocity and close to target
  if (Math.abs(velocity) < 0.05 && Math.abs(current - target) < 0.05) {
    width.value = target
    velocity = 0
    rafId = null
    lastTime = 0 // Reset time for next run
  } else {
    rafId = requestAnimationFrame(animate)
  }
}

// Trigger animation loop
watch(targetWidth, () => {
  if (rafId === null) {
    lastTime = 0
    rafId = requestAnimationFrame(animate)
  }
})

// Styles
const widthPx = computed(() => `${width.value.toFixed(2)}px`) // Limit decimals for CSS
const iconScale = computed(() => {
  // Map width (40..80) to scale (1..1.5)
  const ratio = (width.value - baseWidth) / 40
  // returns 0 at rest, 1 at max
  return 1 + (ratio * 0.5) // Scale from 1.0 to 1.5
})
</script>

<template>
  <a :href="href" class="relative group">
    <div
        ref="elRef"
        class="relative flex aspect-square cursor-pointer items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-800 will-change-[width,height,transform]"
        :style="{ width: widthPx, height: widthPx }"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
      <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-2"
      >
        <div
            v-if="hover"
            class="absolute -top-10 left-1/2 -translate-x-1/2 w-fit whitespace-pre rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white z-50 shadow-sm"
        >
          {{ title }}
        </div>
      </Transition>

      <div
          class="flex items-center justify-center will-change-transform"
          :style="{ transform: `scale(${iconScale})` }"
      >
        <component :is="icon" class="h-5 w-5 text-neutral-500 dark:text-neutral-300" />
      </div>
    </div>
  </a>
</template>