<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import CinematicCursor from '~/components/CinematicCursor.vue'

const ambientGlowRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!ambientGlowRef.value) return

  // Increased duration to 1.2s.
  // This makes the massive light drag heavily and smoothly behind the snappy cursor.
  const xMove = gsap.quickTo(ambientGlowRef.value, 'x', { duration: 1.2, ease: 'power3.out' })
  const yMove = gsap.quickTo(ambientGlowRef.value, 'y', { duration: 1.2, ease: 'power3.out' })

  const onMouseMove = (e: MouseEvent) => {
    xMove(e.clientX)
    yMove(e.clientY)
  }

  window.addEventListener('mousemove', onMouseMove)

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
  })
})
</script>

<template>
  <div class="layout-cinematic">
    <CinematicCursor />

    <div class="global-environment">
      <div class="film-grain"></div>
      <div ref="ambientGlowRef" class="ambient-glow"></div>
    </div>

    <div class="page-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.layout-cinematic {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  background: #030305;
  overflow: hidden;
}

.global-environment {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.page-content {
  position: relative;
  z-index: 10;
}

/* --- THE FIX: FLAWLESS VOLUMETRIC LIGHT --- */
.ambient-glow {
  position: fixed;
  top: 0;
  left: 0;
  width: 1200px;  /* Increased size for massive, soft falloff */
  height: 1200px;
  margin-top: -600px;
  margin-left: -600px;
  border-radius: 50%;

  /* Hardcoded multi-stop gradient for absolute precision (change rgb to match your primary) */
  background: radial-gradient(
      circle,
      rgba(0, 229, 255, 0.12) 0%,    /* Hot core */
      rgba(0, 229, 255, 0.06) 25%,   /* Mid glow */
      rgba(0, 229, 255, 0.02) 50%,   /* Soft fade */
      transparent 100%               /* Edge dissolve */
  );

  /* Crucial: Makes the light mathematically add to the darkness, preventing pixelation */
  mix-blend-mode: screen;

  /* Crucial: Forces hardware acceleration WITHOUT low-res bitmap rasterization */
  transform-style: preserve-3d;
  pointer-events: none;
}
</style>