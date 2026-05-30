<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const cursorRef = ref<HTMLElement | null>(null)
const dotRef = ref<HTMLElement | null>(null)

let xMove: any, yMove: any
let xMoveDot: any, yMoveDot: any

onMounted(() => {
  if (!cursorRef.value || !dotRef.value) return

  xMove = gsap.quickTo(cursorRef.value, 'x', { duration: 0.6, ease: 'power3.out' })
  yMove = gsap.quickTo(cursorRef.value, 'y', { duration: 0.6, ease: 'power3.out' })

  xMoveDot = gsap.quickTo(dotRef.value, 'x', { duration: 0.1, ease: 'none' })
  yMoveDot = gsap.quickTo(dotRef.value, 'y', { duration: 0.1, ease: 'none' })

  const onMouseMove = (e: MouseEvent) => {
    xMove(e.clientX)
    yMove(e.clientY)
    xMoveDot(e.clientX)
    yMoveDot(e.clientY)
  }

  // Global Event Delegation for Interactive Elements
  const onMouseOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('.cursor-interactive')) {
      gsap.to(cursorRef.value, {
        scale: 3,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        mixBlendMode: 'difference',
        border: 'none',
        duration: 0.4,
        ease: 'expo.out'
      })
      gsap.to(dotRef.value, { opacity: 0, duration: 0.2 })
    }
  }

  const onMouseOut = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('.cursor-interactive')) {
      gsap.to(cursorRef.value, {
        scale: 1,
        backgroundColor: 'transparent',
        mixBlendMode: 'normal',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        duration: 0.4,
        ease: 'expo.out'
      })
      gsap.to(dotRef.value, { opacity: 1, duration: 0.2 })
    }
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseover', onMouseOver)
  window.addEventListener('mouseout', onMouseOut)

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseover', onMouseOver)
    window.removeEventListener('mouseout', onMouseOut)
  })
})
</script>

<template>
  <div class="cursor-wrapper">
    <div ref="cursorRef" class="cursor-ring"></div>
    <div ref="dotRef" class="cursor-dot"></div>
  </div>
</template>

<style scoped>
.cursor-wrapper {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99999; /* Must be above absolutely everything */
}

.cursor-ring {
  position: absolute;
  top: -16px;
  left: -16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.5);
  will-change: transform, background-color, border;
  transform: translate(-100vw, -100vh);
  transition: mix-blend-mode 0.2s ease;
}

.cursor-dot {
  position: absolute;
  top: -3px;
  left: -3px;
  width: 6px;
  height: 6px;
  background-color: var(--primary, #00e5ff);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--primary, #00e5ff);
  will-change: transform, opacity;
  transform: translate(-100vw, -100vh);
}

:global(body), :global(a), :global(button) {
  cursor: none !important;
}
</style>