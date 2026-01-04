<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { cn } from '@/lib/utils'
import { Motion } from 'motion-v'

defineOptions({
  inheritAttrs: false
})

interface GlowingEffectProps {
  blur?: number
  inactiveZone?: number
  proximity?: number
  spread?: number
  variant?: 'default' | 'white'
  glow?: boolean
  disabled?: boolean
  movementDuration?: number
  borderWidth?: number
}

const props = withDefaults(defineProps<GlowingEffectProps>(), {
  blur: 0,
  inactiveZone: 0.7,
  proximity: 0,
  spread: 20,
  variant: 'default',
  glow: false,
  movementDuration: 2,
  borderWidth: 1,
  disabled: true,
})

const containerRef = ref<HTMLElement | null>(null)
const angle = ref(0)
const isActive = ref(false)
const lastPosition = { x: 0, y: 0 }
let animationFrameId: number | null = null

const handleMove = (e?: MouseEvent | { x: number; y: number }) => {
  if (!containerRef.value) return

  // Debounce with RAF to prevent excessive calculations
  if (animationFrameId) cancelAnimationFrame(animationFrameId)

  animationFrameId = requestAnimationFrame(() => {
    const element = containerRef.value?.$el || containerRef.value // Handle component ref
    if (!element) return

    const { left, top, width, height } = element.getBoundingClientRect()
    const mouseX = e && 'x' in e ? e.x : lastPosition.x
    const mouseY = e && 'y' in e ? e.y : lastPosition.y

    if (e) {
      lastPosition.x = mouseX
      lastPosition.y = mouseY
    }

    const center = [left + width * 0.5, top + height * 0.5]
    const distanceFromCenter = Math.hypot(mouseX - center[0], mouseY - center[1])
    const inactiveRadius = 0.5 * Math.min(width, height) * props.inactiveZone

    if (distanceFromCenter < inactiveRadius) {
      isActive.value = false
      return
    }

    const isClose =
        mouseX > left - props.proximity &&
        mouseX < left + width + props.proximity &&
        mouseY > top - props.proximity &&
        mouseY < top + height + props.proximity

    isActive.value = isClose

    if (isClose) {
      const currentAngle = angle.value
      let targetAngle = (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) / Math.PI + 90

      // Calculate shortest path for smooth rotation to avoid "spinning back"
      const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180
      angle.value = currentAngle + angleDiff
    }
  })
}

onMounted(() => {
  if (props.disabled) return

  const handleScroll = () => handleMove()
  const handlePointerMove = (e: PointerEvent) => handleMove({ x: e.clientX, y: e.clientY })

  window.addEventListener('scroll', handleScroll, { passive: true })
  document.body.addEventListener('pointermove', handlePointerMove, { passive: true })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
    document.body.removeEventListener('pointermove', handlePointerMove)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  })
})

const gradientStyle = computed(() => {
  const repeat = 5
  if (props.variant === 'white') {
    return `repeating-conic-gradient(
        from 236.84deg at 50% 50%,
        var(--black),
        var(--black) calc(25% / ${repeat})
      )`
  }
  return `radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%),
      radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%),
      radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%),
      radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%),
      repeating-conic-gradient(
        from 236.84deg at 50% 50%,
        #dd7bbb 0%,
        #d79f1e calc(25% / ${repeat}),
        #5a922c calc(50% / ${repeat}),
        #4c7894 calc(75% / ${repeat}),
        #dd7bbb calc(100% / ${repeat})
      )`
})
</script>

<template>
  <div
      :class="cn(
      'pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity',
      props.glow && 'opacity-100',
      props.variant === 'white' && 'border-white',
      !props.disabled && '!block'
    )"
  />
  <Motion
      ref="containerRef"
      as="div"
      :initial="false"
      :animate="{ '--start': angle }"
      :transition="{
        duration: props.movementDuration,
        ease: [0.16, 1, 0.3, 1]
      }"
      :style="{
        '--blur': `${props.blur}px`,
        '--spread': props.spread,
        '--active': isActive ? '1' : '0',
        '--glowingeffect-border-width': `${props.borderWidth}px`,
        '--repeating-conic-gradient-times': '5',
        '--gradient': gradientStyle
      }"
      :class="cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity',
        props.glow && 'opacity-100',
        props.blur > 0 && 'blur-[var(--blur)]',
        $attrs.class as string,
        props.disabled && '!hidden'
      )"
  >
    <div
        :class="cn(
        'glow',
        'rounded-[inherit]',
        'after:content-[\'\'] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
        'after:[border:var(--glowingeffect-border-width)_solid_transparent]',
        'after:[background:var(--gradient)] after:[background-attachment:fixed]',
        'after:opacity-[var(--active)] after:transition-opacity after:duration-300',
        'after:[mask-clip:padding-box,border-box]',
        'after:[mask-composite:intersect]',
        'after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]'
      )"
    />
  </Motion>
</template>