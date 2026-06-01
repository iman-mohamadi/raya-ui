<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollManager } from '~/composables/home/useScrollManager'

gsap.registerPlugin(ScrollTrigger)

const { lenis, scrollProgress } = useScrollManager()

const containerRef = ref<HTMLElement | null>(null)
const orbRef = ref<HTMLElement | null>(null)
const coreRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const ringRef = ref<HTMLElement | null>(null)

let xToOrb: gsap.QuickToFunc
let yToOrb: gsap.QuickToFunc
let xToCore: gsap.QuickToFunc
let yToCore: gsap.QuickToFunc

const isVisible = ref(false)
const isHovered = ref(false)
const isWarping = ref(false)

// Segmented dashed ring math
const radius = 26
const circumference = 2 * Math.PI * radius
const dashArray = `${circumference / 8} ${circumference / 32}` // Creates technical segments

// Safe scroll progress clamp (0 to 1) to prevent bugs if Lenis overscrolls
const progress = computed(() => Math.max(0, Math.min(scrollProgress.value || 0, 1)))
const dashOffset = computed(() => circumference - progress.value * circumference)

const onMouseMove = (e: MouseEvent) => {
  if (!containerRef.value || !orbRef.value || !coreRef.value || isWarping.value) return

  const rect = containerRef.value.getBoundingClientRect()
  // Calculate relative mouse position from the absolute center of the hit area
  const relX = e.clientX - (rect.left + rect.width / 2)
  const relY = e.clientY - (rect.top + rect.height / 2)

  const dist = Math.sqrt(relX * relX + relY * relY)
  const magneticRadius = rect.width * 0.8

  if (dist < magneticRadius) {
    if (!isHovered.value) {
      isHovered.value = true
      gsap.to(textRef.value, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(2)' })
      gsap.to(coreRef.value, { scale: 1.5, opacity: 0.15, duration: 0.4 })
      gsap.to(ringRef.value, { rotation: 90, duration: 0.8, ease: 'power3.out' })
    }

    // Outer Orb moves heavily
    xToOrb(relX * 0.4)
    yToOrb(relY * 0.4)

    // Inner Core moves FASTER to create a glass sphere 3D depth illusion
    xToCore(relX * 0.7)
    yToCore(relY * 0.7)
  } else {
    handleMouseLeave()
  }
}

const handleMouseLeave = () => {
  if (!isHovered.value || isWarping.value) return
  isHovered.value = false

  // Snap back to absolute center
  xToOrb(0)
  yToOrb(0)
  xToCore(0)
  yToCore(0)

  gsap.to(textRef.value, { opacity: 0, y: 10, duration: 0.3, ease: 'power2.in' })
  gsap.to(coreRef.value, { scale: 1, opacity: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
  gsap.to(ringRef.value, { rotation: 0, duration: 0.8, ease: 'power2.out' })
}

const scrollToTop = () => {
  if (isWarping.value) return
  isWarping.value = true

  // The "Warp Drive" Click Animation
  const tl = gsap.timeline({
    onComplete: () => {
      isWarping.value = false
      gsap.set(orbRef.value, { y: 100, opacity: 0, scaleY: 1, scaleX: 1 })
    }
  })

  // 1. Compress down gathering energy
  tl.to(orbRef.value, { scaleY: 0.5, scaleX: 1.2, duration: 0.2, ease: 'power2.out' })

  // 2. Shoot up into a laser beam line
  tl.to(orbRef.value, {
    scaleY: 6,
    scaleX: 0.1,
    y: -window.innerHeight,
    opacity: 0,
    duration: 0.5,
    ease: 'power4.in'
  }, "+=0.05")

  // Fire scroll exactly as the beam shoots up
  if (lenis?.value) {
    lenis.value.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  if (!containerRef.value || !orbRef.value || !coreRef.value) return

  // Highly responsive GSAP spring physics
  xToOrb = gsap.quickTo(orbRef.value, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.4)' })
  yToOrb = gsap.quickTo(orbRef.value, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.4)' })

  xToCore = gsap.quickTo(coreRef.value, 'x', { duration: 0.3, ease: 'power3.out' })
  yToCore = gsap.quickTo(coreRef.value, 'y', { duration: 0.3, ease: 'power3.out' })

  // Appear after scrolling 30% of the screen
  ScrollTrigger.create({
    start: 'top -30%',
    onUpdate: (self) => {
      if (isWarping.value) return // Don't interrupt the warp out animation

      const shouldBeVisible = self.progress > 0
      if (shouldBeVisible !== isVisible.value) {
        isVisible.value = shouldBeVisible
        gsap.to(orbRef.value, {
          y: isVisible.value ? 0 : 80,
          opacity: isVisible.value ? 1 : 0,
          scale: isVisible.value ? 1 : 0.5,
          duration: 1.0,
          ease: 'expo.out'
        })
      }
    }
  })

  window.addEventListener('mousemove', onMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<template>
  <div
      ref="containerRef"
      class="fixed bottom-8 right-8 md:bottom-12 md:right-12 z-50 w-32 h-32 flex items-center justify-center pointer-events-none"
  >
    <button
        ref="orbRef"
        class="relative flex items-center justify-center w-16 h-16 rounded-full bg-[#030305]/80 backdrop-blur-xl border border-white/5 cursor-none pointer-events-auto shadow-[inset_0_0_20px_rgba(0,229,255,0.05)] opacity-0 translate-y-20 will-change-transform"
        @click="scrollToTop"
    >
      <svg ref="ringRef" class="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 60 60">
        <circle
            cx="30" cy="30" r="26"
            fill="none"
            class="stroke-white/5"
            stroke-width="1"
        />
        <circle
            cx="30" cy="30" r="26"
            fill="none"
            stroke="#00E5FF"
            stroke-width="1.5"
            stroke-linecap="round"
            :stroke-dasharray="dashArray"
            :stroke-dashoffset="dashOffset"
            class="transition-all duration-100 ease-linear drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]"
        />
      </svg>

      <div
          ref="coreRef"
          class="absolute w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_15px_#00E5FF] pointer-events-none will-change-transform"
      ></div>

      <span
          ref="textRef"
          class="absolute text-[#00E5FF] text-[10px] font-bold tracking-[0.2em] opacity-0 translate-y-2 pointer-events-none mix-blend-screen"
      >
        TOP
      </span>
    </button>
  </div>
</template>