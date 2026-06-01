<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { raya3D } from '~/composables/home/useRayaState'

gsap.registerPlugin(ScrollTrigger)

const chapterRef = ref<HTMLElement | null>(null)
const whiteoutRef = ref<HTMLElement | null>(null)

const text1Ref = ref<HTMLElement | null>(null)
const text2Ref = ref<HTMLElement | null>(null)
const text3Ref = ref<HTMLElement | null>(null)
const text4Ref = ref<HTMLElement | null>(null)
const text5Ref = ref<HTMLElement | null>(null)
const climaxRef = ref<HTMLElement | null>(null)

let tl: gsap.core.Timeline | null = null

onMounted(async () => {
  await nextTick()
  if (!chapterRef.value || !whiteoutRef.value) return

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: chapterRef.value,
      start: 'top top',
      end: '+=800%',
      pin: true,
      scrub: 1
    }
  })

  const texts = [text1Ref, text2Ref, text3Ref, text4Ref, text5Ref, climaxRef]
  texts.forEach(r => { if (r.value) gsap.set(r.value, { y: 30, opacity: 0 }) })
  gsap.set(whiteoutRef.value, { opacity: 0 })

  // --- 0-10: THE WHITEOUT & PARTICLE FADEOUT ---
  tl.fromTo(whiteoutRef.value, { opacity: 0 }, { opacity: 1, duration: 5 }, 0)

  // Immediately fade particles to 0 opacity.
  // While invisible, we quietly snap them to morph 14 so they are ready for the end.
  tl.to(raya3D, { particleOpacity: 0, morph: 14, duration: 5 }, 0)

  if (text1Ref.value) {
    tl.fromTo(text1Ref.value, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 3 }, 5)
    tl.to(text1Ref.value, { y: -30, opacity: 0, duration: 3 }, 15)
  }

  if (text2Ref.value) {
    tl.fromTo(text2Ref.value, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 3 }, 18)
    tl.to(text2Ref.value, { y: -30, opacity: 0, duration: 3 }, 28)
  }

  if (text3Ref.value) {
    tl.fromTo(text3Ref.value, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 3 }, 31)
    tl.to(text3Ref.value, { y: -30, opacity: 0, duration: 3 }, 41)
  }

  if (text4Ref.value) {
    tl.fromTo(text4Ref.value, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 3 }, 44)
    tl.to(text4Ref.value, { y: -30, opacity: 0, duration: 3 }, 54)
  }

  if (text5Ref.value) {
    tl.fromTo(text5Ref.value, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 3 }, 57)
    tl.to(text5Ref.value, { y: -30, opacity: 0, duration: 3 }, 67)
  }

  if (climaxRef.value) {
    tl.fromTo(climaxRef.value, { y: 50, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 4 }, 70)
    tl.to(climaxRef.value, { y: -50, opacity: 0, duration: 4 }, 85)
  }

  // --- 90-100: TRANSITION TO FINAL CHAPTER ---
  // The white screen fades out, revealing the dark void again.
  tl.to(whiteoutRef.value, { opacity: 0, duration: 10 }, 90)

  // As the dark returns, we fade the particles back in, targeting morph 15 (The 'R').
  // Because it goes 14 -> 15, it goes straight to the R without rewinding!
  tl.to(raya3D, {
    particleOpacity: 0.8,
    morph: 15,
    particleColor: '#ffffff',
    cameraZ: 40,
    turbulence: 0.05,
    duration: 10
  }, 90)
})

onUnmounted(() => {
  if (tl) {
    tl.scrollTrigger?.kill()
    tl.kill()
  }
})
</script>

<template>
  <section ref="chapterRef" id="chapter-system-to-creation" class="relative w-full h-screen overflow-hidden">

    <div ref="whiteoutRef" class="absolute inset-0 w-full h-full bg-[#FAFAFA] z-0 pointer-events-none will-change-opacity"></div>

    <div class="absolute inset-0 flex flex-col justify-center items-center px-6 md:px-12 z-10 pointer-events-none">

      <div ref="text1Ref" class="absolute inset-0 flex items-center justify-center text-center w-full max-w-5xl mx-auto px-6">
        <h3 class="text-4xl md:text-7xl font-light text-zinc-900 tracking-tight">Ideas become products.</h3>
      </div>

      <div ref="text2Ref" class="absolute inset-0 flex items-center justify-center text-center w-full max-w-5xl mx-auto px-6">
        <h3 class="text-4xl md:text-7xl font-light text-zinc-900 tracking-tight">One system. <span class="font-medium text-[#FF4A00]">Different outcomes.</span></h3>
      </div>

      <div ref="text3Ref" class="absolute inset-0 flex items-center justify-center text-center w-full max-w-5xl mx-auto px-6">
        <h3 class="text-4xl md:text-7xl font-light text-zinc-900 tracking-tight">Not components. <span class="font-medium text-[#00E5FF]">Possibilities.</span></h3>
      </div>

      <div ref="text4Ref" class="absolute inset-0 flex items-center justify-center text-center w-full max-w-5xl mx-auto px-6">
        <h3 class="text-4xl md:text-7xl font-light text-zinc-900 tracking-tight">Not templates. <span class="font-medium">Experiences.</span></h3>
      </div>

      <div ref="text5Ref" class="absolute inset-0 flex items-center justify-center text-center w-full max-w-5xl mx-auto px-6">
        <h3 class="text-4xl md:text-7xl font-light text-zinc-900 tracking-tight">Not interfaces. <span class="font-medium text-[#0066ff]">Memories.</span></h3>
      </div>

      <div ref="climaxRef" class="absolute inset-0 flex flex-col justify-center items-center text-center w-full max-w-6xl mx-auto px-6">
        <h2 class="text-[clamp(30px,5vw,80px)] font-serif italic text-zinc-500 font-light tracking-tight mb-4">
          People don't remember interfaces.
        </h2>
        <h3 class="text-[clamp(40px,7vw,110px)] font-black text-zinc-900 uppercase tracking-tighter leading-none">
          They remember<br/>how they <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4A00] to-[#ff00ff]">felt.</span>
        </h3>
      </div>

    </div>
  </section>
</template>