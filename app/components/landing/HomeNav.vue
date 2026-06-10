<script setup lang="ts">
import { ref } from 'vue'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const menuRef = ref<HTMLDivElement | null>(null)
const isMenuOpen = ref(false)

let lenis: Lenis | null = null

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value

  if (isMenuOpen.value) {
    lenis?.stop()
    gsap.to(menuRef.value, {
      clipPath: 'circle(150% at 95% 5%)',
      duration: 1.2,
      ease: 'expo.inOut'
    })
    gsap.fromTo('.menu-item',
        { y: 100, opacity: 0, rotateX: -45 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.1, ease: 'power4.out', delay: 0.3 }
    )
  } else {
    lenis?.start()
    gsap.to(menuRef.value, {
      clipPath: 'circle(0% at 95% 5%)',
      duration: 1,
      ease: 'expo.inOut'
    })
  }
}
</script>

<template>
  <!-- NAVIGATION -->
  <nav class="fixed top-0 left-0 right-0 z-[8000] px-8 py-8 flex justify-between items-center mix-blend-difference">
    <span></span>
    <button @click="toggleMenu" class="w-16 h-16 rounded-full bg-[#ff4a00] text-black flex flex-col items-center justify-center gap-1.5 hover:scale-105 transition-transform duration-300">
      <div class="w-6 h-[2px] bg-black transition-all duration-500" :class="{ 'rotate-45 translate-y-[4px]': isMenuOpen }"></div>
      <div class="w-6 h-[2px] bg-black transition-all duration-500" :class="{ '-rotate-45 -translate-y-[4px]': isMenuOpen }"></div>
    </button>
  </nav>

  <!-- FULLSCREEN MENU -->
  <div ref="menuRef" class="fixed inset-0 bg-[#ff4a00] z-[7000] flex items-center justify-center perspective-[1000px]" style="clip-path: circle(0% at 95% 5%);">
    <div class="flex flex-col text-center gap-6">
      <div class="overflow-hidden p-2"><NuxtLink to="/components" class="menu-item block text-black text-[clamp(60px,10vw,160px)] font-black uppercase tracking-tighter hover:text-white transition-colors leading-none">Components</NuxtLink></div>
      <div class="overflow-hidden p-2"><NuxtLink to="/docs/installation" class="menu-item block text-black text-[clamp(60px,10vw,160px)] font-black uppercase tracking-tighter hover:text-white transition-colors leading-none">Documentation</NuxtLink></div>
      <div class="overflow-hidden p-2"><a href="https://github.com/raya-ui" target="_blank" class="menu-item block text-black text-[clamp(60px,10vw,160px)] font-black uppercase tracking-tighter hover:text-white transition-colors leading-none">GitHub</a></div>
    </div>
  </div>
</template>

<style scoped>

</style>