<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { raya3D } from '~/composables/home/useRayaState'

gsap.registerPlugin(ScrollTrigger)

const chapterRef = ref<HTMLElement | null>(null)
const textStaticRef = ref<HTMLElement | null>(null)
const textRespondRef = ref<HTMLElement | null>(null)
const textAdaptRef = ref<HTMLElement | null>(null)
const textBreatheRef = ref<HTMLElement | null>(null)
const panelsRef = ref<HTMLElement | null>(null)

let tl: gsap.core.Timeline | null = null

onMounted(() => {
  tl = gsap.timeline({
    scrollTrigger: {
      trigger: chapterRef.value,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 1
    }
  })

  // REMOVED BLUR: Relying strictly on high-performance opacity and transform
  gsap.set(textStaticRef.value, { y: 50, opacity: 0 })
  gsap.set([textRespondRef.value, textAdaptRef.value, textBreatheRef.value], { y: 50, opacity: 0 })
  gsap.set(panelsRef.value, { y: '15vh', opacity: 0, scale: 0.9 })

  // 0-20: Morph to Wave
  tl.fromTo(raya3D, { morph: 1, cameraZ: 8, cameraY: 0 }, { morph: 2, cameraZ: 5, cameraY: -2, turbulence: 0.4, duration: 20 }, 0)

  // TEXT 1
  tl.fromTo(textStaticRef.value, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 5 }, 0)
  tl.to(textStaticRef.value, { y: -50, opacity: 0, duration: 5 }, 25)

  // TEXT 2
  tl.fromTo(textRespondRef.value, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 3 }, 30)
  tl.fromTo(textAdaptRef.value, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 3 }, 32)
  tl.fromTo(textBreatheRef.value, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 3 }, 34)
  tl.to([textRespondRef.value, textAdaptRef.value, textBreatheRef.value], { y: -50, opacity: 0, duration: 5 }, 55)

  // 50-70: Morph to Civilizations
  tl.fromTo(raya3D, { morph: 2, cameraZ: 5, cameraY: -2 }, { morph: 3, cameraZ: 15, cameraY: 0, particleColor: '#ffffff', turbulence: 0.02, duration: 20 }, 50)

  // CARDS REVEAL
  tl.fromTo(panelsRef.value, { y: '15vh', opacity: 0, scale: 0.9 }, { y: '0vh', opacity: 1, scale: 1, duration: 8 }, 65)
  tl.to(panelsRef.value, { y: '-15vh', opacity: 0, duration: 8 }, 92)
})

onUnmounted(() => tl?.kill())
</script>

<template>
  <section ref="chapterRef" id="chapter-living-interfaces" class="relative w-full h-screen overflow-hidden">
    <div class="absolute inset-0 flex flex-col items-center justify-center text-center w-full max-w-7xl mx-auto z-10 pointer-events-none">
      <h2 ref="textStaticRef" class="absolute text-[clamp(40px,6vw,100px)] font-serif italic text-white/80 font-light tracking-tight w-full px-4">
        Interfaces should not feel static.
      </h2>
      <div class="flex flex-col items-center gap-2 md:gap-4 text-[clamp(45px,8vw,160px)] font-black uppercase tracking-tighter leading-[0.85] w-full px-4">
        <span ref="textRespondRef" class="text-white">They should respond.</span>
        <span ref="textAdaptRef" class="text-transparent" style="-webkit-text-stroke: 2px rgba(255,255,255,0.3);">Adapt.</span>
        <span ref="textBreatheRef" class="text-[#00E5FF]">Breathe.</span>
      </div>
    </div>

    <div class="absolute inset-0 w-full h-full flex items-center justify-center z-20 pointer-events-none px-6 py-12">
      <div ref="panelsRef" class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 w-full max-w-6xl mx-auto pointer-events-auto">
        <div class="flex-1 w-full h-[20vh] min-h-[140px] max-h-[160px] md:max-h-[350px] rounded-[30px] md:rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-2xl flex flex-col justify-end p-6 md:p-8 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.05] to-transparent"></div>
          <h3 class="text-white font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase mb-2 md:mb-4">01 — Physics</h3>
          <h4 class="text-2xl md:text-3xl lg:text-4xl text-white font-medium">Motion</h4>
        </div>
        <div class="flex-1 w-full h-[25vh] min-h-[160px] max-h-[180px] md:max-h-[400px] rounded-[30px] md:rounded-[40px] bg-[#00E5FF]/[0.05] border border-[#00E5FF]/20 backdrop-blur-3xl shadow-[0_0_100px_rgba(255,74,0,0.1)] flex flex-col justify-end p-6 md:p-8 relative overflow-hidden md:translate-y-8">
          <div class="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#00E5FF]/[0.1] to-transparent"></div>
          <h3 class="text-[#00E5FF] font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase mb-2 md:mb-4">02 — Space</h3>
          <h4 class="text-2xl md:text-3xl lg:text-4xl text-white font-medium">Depth</h4>
        </div>
        <div class="flex-1 w-full h-[20vh] min-h-[140px] max-h-[160px] md:max-h-[350px] rounded-[30px] md:rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-2xl flex flex-col justify-end p-6 md:p-8 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.05] to-transparent"></div>
          <h3 class="text-white font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase mb-2 md:mb-4">03 — State</h3>
          <h4 class="text-2xl md:text-3xl lg:text-4xl text-white font-medium">Presence</h4>
        </div>
      </div>
    </div>
  </section>
</template>