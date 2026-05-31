<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { raya3D } from '~/composables/home/useRayaState'

gsap.registerPlugin(ScrollTrigger)

const chapterRef = ref<HTMLElement | null>(null)

// Stages Refs
const stage1Ref = ref<HTMLElement | null>(null)
const stage2Ref = ref<HTMLElement | null>(null)
const stage3Ref = ref<HTMLElement | null>(null)

// Specific DOM Elements
const massiveRayaRef = ref<HTMLElement | null>(null)
const navLinksRef = ref<HTMLElement | null>(null)

let tl: gsap.core.Timeline | null = null

onMounted(async () => {
  await nextTick()
  if (!chapterRef.value) return

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: chapterRef.value,
      start: 'top top',
      end: '+=300%', // 3 massive screens of scrolling for the finale
      pin: true,
      scrub: 1
    }
  })

  // Initial DOM Setup
  if (stage1Ref.value) gsap.set(stage1Ref.value, { opacity: 0, scale: 0.9, filter: 'blur(10px)' })
  if (stage2Ref.value) gsap.set(stage2Ref.value, { opacity: 0, y: '20vh' })
  if (massiveRayaRef.value) gsap.set(massiveRayaRef.value, { scale: 0.8, opacity: 0 })
  if (stage3Ref.value) gsap.set(stage3Ref.value, { opacity: 0, scale: 1.1, filter: 'blur(20px)' })

  // --- 0-10: TRANSITION FROM PREVIOUS CHAPTER ---
  // Ensure we are on the highly realistic "Evolved R" (Morph 16)
  tl.to(raya3D, { morph: 16, cameraZ: 30, cameraY: 0, turbulence: 0.2, particleColor: '#ffffff', duration: 10 }, 0)

  // --- 10-30: STAGE 1 (Build what they remember) ---
  if (stage1Ref.value) {
    tl.fromTo(stage1Ref.value,
        { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 8, ease: 'power2.out' }, 10)
    tl.to(stage1Ref.value,
        { opacity: 0, y: -100, filter: 'blur(20px)', duration: 8, ease: 'power2.in' }, 25)
  }

  // --- 30-70: STAGE 2 (Massive Navigation & RAYA Typography) ---
  // The camera slowly orbits and pulls back slightly to reveal the monument
  tl.to(raya3D, { cameraX: 10, cameraZ: 45, turbulence: 0.4, particleColor: '#FF4A00', duration: 40 }, 30)

  if (massiveRayaRef.value) {
    tl.fromTo(massiveRayaRef.value,
        { scale: 0.8, opacity: 0, y: '10vh' },
        { scale: 1, opacity: 0.05, y: '0vh', duration: 15, ease: 'power3.out' }, 30)
    tl.to(massiveRayaRef.value, { y: '-10vh', opacity: 0, duration: 15, ease: 'power3.in' }, 65)
  }

  if (stage2Ref.value && navLinksRef.value) {
    tl.fromTo(stage2Ref.value,
        { opacity: 0, y: '20vh' },
        { opacity: 1, y: '0vh', duration: 15, ease: 'power3.out' }, 35)

    // Parallax the links against the background
    tl.to(navLinksRef.value, { y: '-15vh', duration: 35, ease: 'none' }, 35)

    tl.to(stage2Ref.value, { opacity: 0, filter: 'blur(10px)', duration: 10, ease: 'power2.in' }, 65)
  }

  // --- 75-100: STAGE 3 (The Infinite Pullback & Final Statement) ---
  // Morph 18 is the Infinite Void. The camera shoots backward to Z: 300.
  // The universe becomes tiny.
  tl.to(raya3D, {
    morph: 18,
    cameraX: 0,
    cameraY: 0,
    cameraZ: 300, // Massive pullback
    turbulence: 0.0,
    particleColor: '#ffffff',
    duration: 25,
    ease: 'power3.inOut'
  }, 75)

  if (stage3Ref.value) {
    tl.fromTo(stage3Ref.value,
        { opacity: 0, scale: 1.1, filter: 'blur(20px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 15, ease: 'power2.out' }, 85)
  }
})

onUnmounted(() => {
  if (tl) { tl.scrollTrigger?.kill(); tl.kill() }
})
</script>

<template>
  <section ref="chapterRef" id="chapter-monument-footer" class="relative w-full h-screen overflow-hidden bg-transparent">

    <div class="absolute inset-0 flex flex-col justify-center items-center z-10 pointer-events-none">

      <div ref="stage1Ref" class="absolute inset-0 flex items-center justify-center text-center w-full max-w-6xl mx-auto px-6 opacity-0">
        <h2 class="text-[clamp(40px,7vw,120px)] font-black text-white uppercase tracking-tighter leading-none">
          Build what they<br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 italic font-serif tracking-tight">remember.</span>
        </h2>
      </div>

      <div ref="stage2Ref" class="absolute inset-0 w-full h-full flex flex-col items-center justify-center opacity-0 pointer-events-auto">

        <h1 ref="massiveRayaRef" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[35vw] font-black text-white leading-none tracking-tighter select-none mix-blend-overlay pointer-events-none">
          RAYA
        </h1>

        <nav ref="navLinksRef" class="relative z-20 flex flex-col items-center gap-6 md:gap-10 w-full px-6">

          <NuxtLink to="/docs/introduction" class="group relative text-[clamp(40px,6vw,100px)] md:text-8xl font-black uppercase tracking-tighter text-transparent transition-all duration-700" style="-webkit-text-stroke: 1px rgba(255,255,255,0.3);">
            <span class="relative z-10 group-hover:text-white transition-colors duration-500">Introduction</span>
            <div class="absolute inset-0 bg-[#00ffcc]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
          </NuxtLink>

          <NuxtLink to="/docs/installation" class="group relative text-[clamp(40px,6vw,100px)] md:text-8xl font-black uppercase tracking-tighter text-transparent transition-all duration-700" style="-webkit-text-stroke: 1px rgba(255,255,255,0.3);">
            <span class="relative z-10 group-hover:text-white transition-colors duration-500">Installation</span>
            <div class="absolute inset-0 bg-[#FF4A00]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
          </NuxtLink>

          <NuxtLink to="/components" class="group relative text-[clamp(40px,6vw,100px)] md:text-8xl font-black uppercase tracking-tighter text-transparent transition-all duration-700" style="-webkit-text-stroke: 1px rgba(255,255,255,0.3);">
            <span class="relative z-10 group-hover:text-white transition-colors duration-500">Components</span>
            <div class="absolute inset-0 bg-[#ff00ff]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
          </NuxtLink>

          <a href="https://github.com/iman-mohamadi/raya-ui" target="_blank" class="group relative text-[clamp(40px,6vw,100px)] md:text-8xl font-black uppercase tracking-tighter text-transparent transition-all duration-700" style="-webkit-text-stroke: 1px rgba(255,255,255,0.3);">
            <span class="relative z-10 group-hover:text-white transition-colors duration-500">GitHub</span>
          </a>

        </nav>

        <div class="absolute bottom-12 w-full flex justify-between items-center px-12 md:px-24 text-white/30 font-mono text-xs uppercase tracking-widest">
          <span>MIT License</span>
          <span>© 2026</span>
        </div>

      </div>

      <div ref="stage3Ref" class="absolute inset-0 flex flex-col items-center justify-center text-center w-full max-w-7xl mx-auto px-6 opacity-0">
        <h2 class="text-[clamp(30px,5vw,80px)] font-serif italic text-white/50 font-light tracking-tight mb-6">
          The future is
        </h2>
        <h3 class="text-[clamp(50px,9vw,160px)] font-black text-white uppercase tracking-tighter leading-none shadow-[0_0_100px_rgba(255,255,255,0.1)]">
          Crafted.
        </h3>
      </div>

    </div>
  </section>
</template>