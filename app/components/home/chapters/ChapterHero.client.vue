<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import { raya3D } from '~/composables/home/useRayaState'

gsap.registerPlugin(ScrollTrigger, CustomEase)

// The SOTD-level cinematic ease: fast initial impact, very slow breathing tail
CustomEase.create("cinematic", "M0,0 C0.1,0.9 0.2,1 1,1")

const heroRef = ref<HTMLElement | null>(null)
const line1Ref = ref<HTMLElement | null>(null)
const line2Ref = ref<HTMLElement | null>(null)
const subtextRef = ref<HTMLElement | null>(null)

let entryTimeline: gsap.core.Timeline | null = null
let scrollTimeline: gsap.core.Timeline | null = null

onMounted(async () => {
  await nextTick()
  if (!heroRef.value) return

  // Explicit reset globally - keeping moody/high-contrast colors
  raya3D.morph = 0
  raya3D.particleColor = '#00E5FF' // Deep cyan
  raya3D.particleOpacity = 0.8
  raya3D.cameraZ = 20
  raya3D.cameraX = 0
  raya3D.cameraY = 0
  raya3D.turbulence = 0.05

  entryTimeline = gsap.timeline({ delay: 1.0 })

  entryTimeline
      .fromTo(raya3D, { morph: 0 }, { morph: 1, duration: 3.5, ease: 'cinematic' }, 0)
      .fromTo(line1Ref.value, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 2.0, ease: 'cinematic' }, 1.0)
      .fromTo(line2Ref.value, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 2.0, ease: 'cinematic' }, 1.2)
      .fromTo(subtextRef.value, { y: 30, opacity: 0 }, { y: 0, opacity: 0.8, duration: 2.0, ease: 'cinematic' }, 1.6)

  scrollTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: heroRef.value,
      start: 'top top',
      end: '+=100%',
      pin: true,
      pinSpacing: false,
      scrub: true // FIX: Changed from '1' to 'true' to eliminate double-lag with Lenis
    }
  })

  // Exclusively controls DOM text to prevent 3D object fight collisions
  scrollTimeline
      .fromTo([line1Ref.value, line2Ref.value, subtextRef.value],
          { y: 0, opacity: 1 },
          { y: -50, opacity: 0, duration: 1, stagger: 0.1 }, 0)
})

onUnmounted(() => {
  if (entryTimeline) entryTimeline.kill()
  if (scrollTimeline) {
    scrollTimeline.scrollTrigger?.kill()
    scrollTimeline.kill()
  }
})
</script>

<template>
  <section ref="heroRef" id="chapter-hero" class="relative w-full h-dvh overflow-hidden">
    <div class="w-full h-full flex flex-col justify-center items-center px-6 md:px-12 pointer-events-none">
      <div class="max-w-5xl w-full flex flex-col items-center text-center">
        <h1 class="text-white flex flex-col items-center gap-2 md:gap-4 tracking-tighter">
          <span ref="line1Ref" class="block text-5xl md:text-8xl lg:text-[7rem] font-light text-white/90 will-change-transform">Design interfaces</span>
          <span ref="line2Ref" class="block text-5xl md:text-8xl lg:text-[7rem] font-medium text-white will-change-transform">that feel alive.</span>
        </h1>
        <p ref="subtextRef" class="mt-12 md:mt-16 text-lg md:text-xl text-white/60 font-light max-w-2xl leading-relaxed tracking-wide will-change-transform">
          Raya UI is an open-source component ecosystem for Vue and Nuxt teams that care about motion, craftsmanship, and unforgettable user experiences.
        </p>
      </div>
    </div>
  </section>
</template>