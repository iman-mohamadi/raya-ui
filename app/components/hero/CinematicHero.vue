<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import WebGLAtmosphere from './WebGLAtmosphere.vue'
import GlassArchitecture from './GlassArchitecture.vue'
import SpatialTypography from './SpatialTypography.vue'
import { useHeroChoreography } from '~/composables/useHeroChoreography'

gsap.registerPlugin(ScrollTrigger)

const { initTimeline } = useHeroChoreography()
let lenis: Lenis

onMounted(() => {
  lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    wheelMultiplier: 1,
  })

  // THE CRITICAL FIX: Bind Lenis scroll to ScrollTrigger updates
  lenis.on('scroll', ScrollTrigger.update)

  // Use GSAP's ticker to run Lenis, ensuring 100% synchronization
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  // Start hero animations
  initTimeline()
})

onUnmounted(() => {
  lenis.destroy()
  gsap.ticker.remove((time) => {
    lenis.raf(time * 1000)
  })
})
</script>

<template>
  <section class="cinematic-hero">
    <WebGLAtmosphere />
    <GlassArchitecture />
    <SpatialTypography />
    <div class="scroll-fade"></div>
  </section>
</template>

<style scoped>
.cinematic-hero {
  position: relative;
  width: 100vw;
  height: 150vh;
  background: transparent; /* <--- This is the key change */
  overflow: hidden;
  perspective: 1000px;
}

.scroll-fade {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30vh;
  /* Adjust gradient to fade into transparency, not solid black */
  background: linear-gradient(to bottom, transparent, rgba(3, 3, 5, 0.8));
  z-index: 50;
  pointer-events: none;
}
</style>