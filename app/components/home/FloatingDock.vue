<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const isLightMode = ref(false)
let trigger: ScrollTrigger | null = null

onMounted(async () => {
  await nextTick()

  setTimeout(() => {
    const whiteoutSection = document.getElementById('chapter-system-to-creation')

    if (whiteoutSection) {
      trigger = ScrollTrigger.create({
        trigger: whiteoutSection,
        start: 'top 50%',
        // FIX: Match the end to the exact pinned scroll length of the chapter (800%)
        end: '+=800%',
        onEnter: () => { isLightMode.value = true },
        onLeave: () => { isLightMode.value = false },
        onEnterBack: () => { isLightMode.value = true },
        onLeaveBack: () => { isLightMode.value = false },
      })
    }
  }, 1000)
})

onUnmounted(() => {
  if (trigger) trigger.kill()
})
</script>

<template>
  <div class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto transition-transform duration-500 hover:scale-[1.02]">

    <nav
        :class="[
        'flex items-center gap-4 md:gap-8 px-6 py-3 md:py-4 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl',
        'backdrop-blur-3xl saturate-200', // The Apple Glass Secret
        isLightMode
          ? 'bg-[#f5f5f7]/40 border border-black/10 text-zinc-800 shadow-[0_8px_32px_rgba(0,0,0,0.05)]'
          : 'bg-[#1c1c1c]/40 border border-white/10 text-zinc-300 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
      ]"
    >

      <NuxtLink
          to="/docs/introduction"
          class="text-xs md:text-sm font-medium tracking-wide transition-opacity duration-300 hover:opacity-50"
      >
        Introduction
      </NuxtLink>

      <NuxtLink
          to="/docs/installation"
          class="text-xs md:text-sm font-medium tracking-wide transition-opacity duration-300 hover:opacity-50"
      >
        Installation
      </NuxtLink>

      <NuxtLink
          to="/components"
          class="text-xs md:text-sm font-medium tracking-wide transition-opacity duration-300 hover:opacity-50"
      >
        Components
      </NuxtLink>

      <div
          :class="[
          'w-px h-4 transition-colors duration-1000',
          isLightMode ? 'bg-black/10' : 'bg-white/10'
        ]"
      ></div>

      <a
          href="https://github.com/iman-mohamadi/raya-ui"
          target="_blank"
          class="text-xs md:text-sm font-medium tracking-wide transition-opacity duration-300 hover:opacity-50 flex items-center gap-2"
      >
        GitHub
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-70">
          <path d="M7 17l9.2-9.2M17 17V7H7"/>
        </svg>
      </a>

    </nav>

  </div>
</template>