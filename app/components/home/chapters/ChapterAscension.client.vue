<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { raya3D } from '~/composables/home/useRayaState'

gsap.registerPlugin(ScrollTrigger)

const chapterRef = ref<HTMLElement | null>(null)
const text1Ref = ref<HTMLElement | null>(null)
const text2Ref = ref<HTMLElement | null>(null)
const text3Ref = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)

let tl: gsap.core.Timeline | null = null

onMounted(async () => {
  await nextTick()
  if (!chapterRef.value) return

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: chapterRef.value,
      start: 'top top',
      end: '+=1200%', // Massive 12-screen finale
      pin: true,
      scrub: 1
    }
  })

  // Initial States
  const elements = [text1Ref, text2Ref, text3Ref, ctaRef, footerRef]
  elements.forEach(el => { if (el.value) gsap.set(el.value, { y: 30, opacity: 0 }) })

  // --- 0-10: THE EVOLVED R ---
  // The camera slowly begins to orbit as the R evolves
  tl.fromTo(raya3D, { morph: 15, cameraX: 0, cameraZ: 40 }, { morph: 16, cameraX: 15, cameraZ: 25, duration: 10, ease: 'power1.inOut' }, 0)

  // --- 10-40: THE EMOTIONAL TYPOGRAPHY ---
  if (text1Ref.value) {
    tl.fromTo(text1Ref.value, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 3 }, 10)
    tl.to(text1Ref.value, { y: -30, opacity: 0, duration: 3 }, 20)
  }

  if (text2Ref.value) {
    tl.fromTo(text2Ref.value, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 3 }, 20)
    tl.to(text2Ref.value, { y: -30, opacity: 0, duration: 3 }, 30)
  }

  if (text3Ref.value) {
    tl.fromTo(text3Ref.value, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 3 }, 30)
    tl.to(text3Ref.value, { y: -30, opacity: 0, duration: 3 }, 40)
  }

  // --- 40-60: THE LUMINOUS CORE REVEAL ---
  // The camera pushes in, the R opens into the accretion disk, colors shift to pure energy
  tl.to(raya3D, {
    morph: 17,
    cameraX: 0,
    cameraY: 0,
    cameraZ: 18,
    turbulence: 1.5,
    particleColor: '#FFFFFF', // Pure, premium white light
    duration: 20
  }, 40)

  // --- 60-80: CTA INTEGRATION ---
  if (ctaRef.value) {
    tl.fromTo(ctaRef.value, { y: 50, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 5 }, 55)
    tl.to(ctaRef.value, { y: -50, opacity: 0, duration: 5 }, 75)
  }

  // --- 80-100: CINEMATIC FOOTER & INFINITE PULLBACK ---
  // The universe shatters into an infinite starfield as the camera pulls back miles away
  tl.to(raya3D, { morph: 18, cameraY: 0, cameraZ: 150, particleColor: '#ffffff', turbulence: 0.05, duration: 20 }, 80)

  if (footerRef.value) {
    tl.fromTo(footerRef.value, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 10 }, 85)
  }
})

onUnmounted(() => {
  if (tl) { tl.scrollTrigger?.kill(); tl.kill() }
})
</script>

<template>
  <section ref="chapterRef" id="chapter-ascension" class="relative w-full h-screen overflow-hidden bg-transparent">

    <div class="absolute inset-0 flex flex-col justify-center items-center px-6 md:px-12 z-10 pointer-events-none">

      <!-- Editorial Typography -->
      <div ref="text1Ref" class="absolute inset-0 flex items-center justify-center text-center w-full max-w-5xl mx-auto px-6 opacity-0">
        <h3 class="text-[clamp(40px,6vw,120px)] font-serif italic text-white/60 font-light tracking-tight">Interfaces are forgotten.</h3>
      </div>

      <div ref="text2Ref" class="absolute inset-0 flex items-center justify-center text-center w-full max-w-5xl mx-auto px-6 opacity-0">
        <h3 class="text-[clamp(40px,6vw,120px)] font-serif italic text-white/60 font-light tracking-tight">Experiences are remembered.</h3>
      </div>

      <div ref="text3Ref" class="absolute inset-0 flex items-center justify-center text-center w-full max-w-6xl mx-auto px-6 opacity-0">
        <h3 class="text-[clamp(50px,8vw,140px)] font-black text-white uppercase tracking-tighter leading-none">
          Build what they<br/><span class="text-[#FF4A00]">remember.</span>
        </h3>
      </div>

      <!-- The Integrated CTA -->
      <div ref="ctaRef" class="absolute inset-0 flex flex-col items-center justify-center text-center w-full max-w-3xl mx-auto px-6 opacity-0 pointer-events-auto">
        <div class="p-[1px] rounded-full bg-gradient-to-b from-white/20 to-transparent mb-12">
          <div class="flex items-center gap-2 px-8 py-4 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl">
            <span class="w-2 h-2 rounded-full bg-[#FF4A00] animate-pulse"></span>
            <span class="text-white font-mono text-sm tracking-widest uppercase">Raya Core Online</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-6 w-full justify-center mb-12">
          <button class="w-full sm:w-auto px-10 py-5 rounded-full bg-white text-black font-semibold tracking-wide hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            Start Building
          </button>
          <button class="w-full sm:w-auto px-10 py-5 rounded-full bg-transparent border border-white/20 text-white font-semibold tracking-wide hover:bg-white/5 transition-colors duration-300">
            Explore Components
          </button>
        </div>

        <button class="text-white/50 hover:text-white transition-colors duration-300 font-mono text-sm tracking-widest uppercase flex items-center gap-3">
          <span class="w-6 h-[1px] bg-white/20"></span>
          View on GitHub
          <span class="w-6 h-[1px] bg-white/20"></span>
        </button>

        <p class="mt-16 text-white/40 font-light tracking-wide">
          Open source. Built for Vue and Nuxt.<br/>Designed for teams who care about craft.
        </p>
      </div>

      <!-- The Cinematic Footer -->
      <div ref="footerRef" class="absolute bottom-0 left-0 w-full px-6 md:px-16 py-12 flex flex-col pointer-events-auto opacity-0 border-t border-white/5 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm">
        <div class="max-w-7xl w-full mx-auto flex flex-col md:flex-row justify-between items-center md:items-end gap-12 md:gap-0">

          <div class="flex flex-col items-center md:items-start gap-4">
            <h2 class="text-3xl font-serif italic text-white/80">Raya UI</h2>
            <p class="text-white/40 text-sm font-light">A creative ecosystem. Not a component library.</p>
          </div>

          <div class="flex flex-wrap justify-center md:justify-end gap-8 md:gap-12">
            <div class="flex flex-col gap-3 text-center md:text-left">
              <span class="text-white/30 font-mono text-xs uppercase tracking-widest mb-2">Ecosystem</span>
              <a href="#" class="text-white/60 hover:text-white transition-colors text-sm">Docs</a>
              <a href="#" class="text-white/60 hover:text-white transition-colors text-sm">Components</a>
              <a href="#" class="text-white/60 hover:text-white transition-colors text-sm">Examples</a>
            </div>

            <div class="flex flex-col gap-3 text-center md:text-left">
              <span class="text-white/30 font-mono text-xs uppercase tracking-widest mb-2">Resources</span>
              <a href="#" class="text-white/60 hover:text-white transition-colors text-sm">Registry</a>
              <a href="#" class="text-white/60 hover:text-white transition-colors text-sm">Changelog</a>
              <a href="#" class="text-white/60 hover:text-white transition-colors text-sm">GitHub</a>
            </div>

            <div class="flex flex-col gap-3 text-center md:text-left">
              <span class="text-white/30 font-mono text-xs uppercase tracking-widest mb-2">Legal</span>
              <a href="#" class="text-white/60 hover:text-white transition-colors text-sm">Community</a>
              <a href="#" class="text-white/60 hover:text-white transition-colors text-sm">MIT License</a>
            </div>
          </div>

        </div>

        <div class="max-w-7xl w-full mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-xs font-mono">
          <span>&copy; 2026 Raya UI. All rights reserved.</span>
          <span>Crafted for the web.</span>
        </div>
      </div>

    </div>
  </section>
</template>