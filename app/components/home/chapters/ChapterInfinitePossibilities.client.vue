<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { raya3D } from '~/composables/home/useRayaState'

gsap.registerPlugin(ScrollTrigger)

const chapterRef = ref<HTMLElement | null>(null)
const aiRef = ref<HTMLElement | null>(null)
const fintechRef = ref<HTMLElement | null>(null)
const commerceRef = ref<HTMLElement | null>(null)
const creativeRef = ref<HTMLElement | null>(null)
const analyticsRef = ref<HTMLElement | null>(null)
const revealRef = ref<HTMLElement | null>(null)

let tl: gsap.core.Timeline | null = null

onMounted(() => {
  tl = gsap.timeline({
    scrollTrigger: {
      trigger: chapterRef.value,
      start: 'top top',
      end: '+=1000%', // INCREASED: A massive 10 screens of scrolling!
      pin: true,
      scrub: 1
    }
  })

  tl.to(raya3D, { morph: 3, particleColor: '#00ffcc', turbulence: 0.2, duration: 6 }, 0)
  tl.to(raya3D, { cameraX: -6, cameraY: 0, cameraZ: 10, duration: 8 }, 0)
  tl.fromTo(aiRef.value, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 3 }, 4)
  tl.to(aiRef.value, { y: -50, opacity: 0, duration: 3 }, 12)

  tl.to(raya3D, { morph: 4, particleColor: '#e6b800', turbulence: 0.0, duration: 6 }, 15)
  tl.to(raya3D, { cameraX: 6, cameraZ: 12, duration: 8 }, 15)
  tl.fromTo(fintechRef.value, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 3 }, 20)
  tl.to(fintechRef.value, { y: -50, opacity: 0, duration: 3 }, 27)

  tl.to(raya3D, { morph: 5, particleColor: '#ff00ff', turbulence: 0.1, duration: 6 }, 30)
  tl.to(raya3D, { cameraX: -6, cameraZ: 10, duration: 8 }, 30)
  tl.fromTo(commerceRef.value, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 3 }, 35)
  tl.to(commerceRef.value, { y: -50, opacity: 0, duration: 3 }, 42)

  tl.to(raya3D, { morph: 6, particleColor: '#00E5FF', turbulence: 0.5, duration: 6 }, 45)
  tl.to(raya3D, { cameraX: 6, cameraZ: 15, duration: 8 }, 45)
  tl.fromTo(creativeRef.value, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 3 }, 50)
  tl.to(creativeRef.value, { y: -50, opacity: 0, duration: 3 }, 57)

  tl.to(raya3D, { morph: 7, particleColor: '#0066ff', turbulence: 0.0, duration: 6 }, 60)
  tl.to(raya3D, { cameraX: -6, cameraZ: 10, duration: 8 }, 60)
  tl.fromTo(analyticsRef.value, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 3 }, 65)
  tl.to(analyticsRef.value, { y: -50, opacity: 0, duration: 3 }, 72)

  tl.to(raya3D, { morph: 8, particleColor: '#ffffff', turbulence: 0.05, duration: 6 }, 75)
  tl.to(raya3D, { cameraX: 0, cameraY: 0, cameraZ: 35, duration: 10 }, 75)
  tl.fromTo(revealRef.value, { y: 50, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 4 }, 80)
  tl.to(revealRef.value, { y: -100, opacity: 0, duration: 4 }, 88)

  tl.to(raya3D, { morph: 9, turbulence: 0.8, particleColor: '#ff2200', duration: 8 }, 92)
  tl.to(raya3D, { cameraZ: 15, duration: 8 }, 92)
})

onUnmounted(() => tl?.kill())
</script>

<template>
  <section ref="chapterRef" id="chapter-infinite-possibilities" class="relative w-full h-screen overflow-hidden">
    <div class="absolute inset-0 flex flex-col justify-center items-center px-6 md:px-12 pointer-events-none">

      <div ref="aiRef" class="absolute inset-0 flex flex-col justify-center items-start text-left w-full max-w-7xl mx-auto px-6 opacity-0">
        <h2 class="text-[#00ffcc] font-mono text-sm tracking-[0.3em] mb-4">WORLD 01 // AI</h2>
        <h3 class="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6">Interfaces<br/>that think.</h3>
        <p class="text-white/60 text-lg md:text-xl max-w-md font-light leading-relaxed">Adaptive layouts. Context-aware interactions. Intelligent workflows.</p>
      </div>

      <div ref="fintechRef" class="absolute inset-0 flex flex-col justify-center items-end text-right w-full max-w-7xl mx-auto px-6 opacity-0">
        <h2 class="text-[#e6b800] font-mono text-sm tracking-[0.3em] mb-4">WORLD 02 // FINTECH</h2>
        <h3 class="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6">Interfaces that<br/>inspire confidence.</h3>
        <p class="text-white/60 text-lg md:text-xl max-w-md font-light leading-relaxed">Banking experiences. Trading platforms. Mission-critical dashboards.</p>
      </div>

      <div ref="commerceRef" class="absolute inset-0 flex flex-col justify-center items-start text-left w-full max-w-7xl mx-auto px-6 opacity-0">
        <h2 class="text-[#ff00ff] font-mono text-sm tracking-[0.3em] mb-4">WORLD 03 // COMMERCE</h2>
        <h3 class="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6">Interfaces that<br/>create desire.</h3>
        <p class="text-white/60 text-lg md:text-xl max-w-md font-light leading-relaxed">Immersive storefronts. Luxury digital retail. Modern commerce ecosystems.</p>
      </div>

      <div ref="creativeRef" class="absolute inset-0 flex flex-col justify-center items-end text-right w-full max-w-7xl mx-auto px-6 opacity-0">
        <h2 class="text-[#00E5FF] font-mono text-sm tracking-[0.3em] mb-4">WORLD 04 // CREATIVE</h2>
        <h3 class="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6">Interfaces<br/>without limits.</h3>
        <p class="text-white/60 text-lg md:text-xl max-w-md font-light leading-relaxed">Creative tools. Media platforms. Digital experiences built for expression.</p>
      </div>

      <div ref="analyticsRef" class="absolute inset-0 flex flex-col justify-center items-start text-left w-full max-w-7xl mx-auto px-6 opacity-0">
        <h2 class="text-[#0066ff] font-mono text-sm tracking-[0.3em] mb-4">WORLD 05 // ANALYTICS</h2>
        <h3 class="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6">Interfaces that<br/>reveal clarity.</h3>
        <p class="text-white/60 text-lg md:text-xl max-w-md font-light leading-relaxed">Monitoring systems. Observability platforms. Business intelligence.</p>
      </div>

      <div ref="revealRef" class="absolute inset-0 flex flex-col justify-center items-center text-center w-full max-w-7xl mx-auto px-6 opacity-0">
        <h2 class="text-[clamp(40px,8vw,140px)] font-black text-white uppercase tracking-tighter leading-[0.85] flex flex-col items-center">
          <span>One System.</span>
          <span class="text-transparent" style="-webkit-text-stroke: 2px rgba(255,255,255,0.4);">Infinite</span>
          <span class="text-[#00E5FF]">Possibilities.</span>
        </h2>
      </div>

    </div>
  </section>
</template>