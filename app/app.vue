<script setup lang="ts">
import { gsap } from 'gsap'

// Define the global GSAP cinematic transition
const pageTransition = {
  name: 'cinematic',
  mode: 'out-in',
  css: false, // Tell Vue we are doing this purely with JS for high performance

  onLeave: (el: Element, done: () => void) => {
    const tl = gsap.timeline({ onComplete: done })

    // 1. Current page scales down and fades
    tl.to(el, { scale: 0.95, opacity: 0, duration: 0.6, ease: 'power3.inOut' }, 0)

    // 2. Black loading screen slides UP from the bottom
    tl.to('#global-transition-overlay', { y: '0%', duration: 0.6, ease: 'power3.inOut' }, 0)
  },

  onEnter: (el: Element, done: () => void) => {
    const tl = gsap.timeline({ onComplete: done })

    // 1. Prepare the new page (scaled down and pushed down slightly)
    gsap.set(el, { scale: 0.9, y: 100, opacity: 0 })

    // 2. Loading screen slides UP and away out of the screen
    tl.to('#global-transition-overlay', { y: '-100%', duration: 0.6, ease: 'power3.inOut' }, 0)

    // 3. New page slides up into place and scales to full size
    tl.to(el, { scale: 1, y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.2)

    // 4. Reset the loader back to the bottom hidden position for the next click
    tl.set('#global-transition-overlay', { y: '100%' })
  }
}
</script>

<template>
  <div class="bg-[#050505] min-h-screen text-white overflow-hidden">

    <div id="global-transition-overlay" class="fixed inset-0 w-full h-full bg-[#030305] z-[9999] translate-y-full flex items-center justify-center pointer-events-none">
      <div class="flex items-center gap-4">
        <span class="w-2 h-2 rounded-full bg-[#FF4A00] animate-pulse"></span>
        <span class="text-white/50 font-mono text-sm tracking-[0.3em] uppercase">Booting Environment...</span>
      </div>
    </div>

    <NuxtLayout>
      <NuxtPage :transition="pageTransition" />
    </NuxtLayout>

  </div>
</template>