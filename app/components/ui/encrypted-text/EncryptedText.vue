<script setup lang="ts">
import { ref, watch, onUnmounted, computed } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  text: string
  trigger?: 'visible' | 'hover' | 'manual'
  revealDelayMs?: number
  charset?: string
  flipDelayMs?: number
  class?: string
  encryptedClass?: string
  revealedClass?: string
}>(), {
  trigger: 'visible',
  revealDelayMs: 50,
  charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", // Restrict to uniform-width characters
  flipDelayMs: 40
})

const containerRef = ref<HTMLElement | null>(null)
const isVisible = useElementVisibility(containerRef)
const hasStarted = ref(false)

const revealCount = ref(0)
const scrambleChars = ref<string[]>([])
let animationFrameId: number | null = null
let isAnimating = ref(false)

function generateRandomCharacter(charset: string): string {
  return charset.charAt(Math.floor(Math.random() * charset.length))
}

function generateGibberish(original: string, charset: string): string[] {
  return original.split('').map(char => char === ' ' ? ' ' : generateRandomCharacter(charset))
}

const startAnimation = () => {
  if (isAnimating.value) return
  isAnimating.value = true
  revealCount.value = 0
  scrambleChars.value = generateGibberish(props.text, props.charset)

  const startTime = performance.now()
  let lastFlipTime = startTime

  const update = (now: number) => {
    const elapsed = now - startTime
    const totalLength = props.text.length
    revealCount.value = Math.min(totalLength, Math.floor(elapsed / Math.max(1, props.revealDelayMs)))

    if (revealCount.value >= totalLength) {
      isAnimating.value = false
      return
    }

    if (now - lastFlipTime >= props.flipDelayMs) {
      scrambleChars.value = scrambleChars.value.map((char, index) => {
        if (index < revealCount.value) return props.text[index]
        if (props.text[index] === ' ') return ' '
        return generateRandomCharacter(props.charset)
      })
      lastFlipTime = now
    }
    animationFrameId = requestAnimationFrame(update)
  }
  animationFrameId = requestAnimationFrame(update)
}

watch(isVisible, (visible) => {
  if (props.trigger === 'visible' && visible && !hasStarted.value) {
    hasStarted.value = true
    startAnimation()
  }
})

const handleHover = () => {
  if (props.trigger === 'hover') {
    startAnimation()
  }
}

onUnmounted(() => {
  if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
})

defineExpose({ start: startAnimation })

const characters = computed(() => {
  return props.text.split('').map((char, index) => {
    const isRevealed = index < revealCount.value
    return {
      char: isRevealed ? char : (scrambleChars.value[index] || char),
      isRevealed
    }
  })
})
</script>

<template>
  <span
      ref="containerRef"
      :class="cn('relative inline-flex', props.class)"
      @mouseenter="handleHover"
      :aria-label="text"
      role="text"
  >
    <span class="invisible whitespace-pre pointer-events-none select-none">{{ text }}</span>

    <span class="absolute inset-0 flex whitespace-pre">
      <span
          v-for="(item, index) in characters"
          :key="index"
          :class="cn(item.isRevealed ? revealedClass : encryptedClass)"
      >{{ item.char }}</span>
    </span>
  </span>
</template>