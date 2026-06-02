<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import FloatingDock from '~/components/home/FloatingDock.vue'
import MouseModeIndicator from '~/components/MouseModeIndicator.vue'

import ChapterHero from '~/components/home/chapters/ChapterHero.client.vue'
import ChapterLivingInterfaces from '~/components/home/chapters/ChapterLivingInterfaces.client.vue'
import ChapterInfinitePossibilities from '~/components/home/chapters/ChapterInfinitePossibilities.client.vue'
import ChapterSystemToCreation from '~/components/home/chapters/ChapterSystemToCreation.client.vue'
import MagneticBackToTop from '~/components/MagneticBackToTop.client.vue'

// Import the Monument Footer
import ChapterMonumentFooter from '~/components/home/chapters/ChapterMonumentFooter.client.vue'

import { useScrollManager } from '~/composables/home/useScrollManager'

definePageMeta({ layout: 'cinematic', colorMode: 'dark' })
useScrollManager()

// Track mouse mode state
const mouseMode = ref<0 | 1 | 2>(0)

// Listen for mode changes from GlobalParticleSystem
onMounted(() => {
  const handleModeChange = (e: CustomEvent) => {
    mouseMode.value = e.detail.mode
  }
  
  window.addEventListener('mouseModeChanged', handleModeChange as any)
  
  return () => {
    window.removeEventListener('mouseModeChanged', handleModeChange as any)
  }
})
</script>

<template>
  <div class="bg-transparent text-[#FAFAFA] min-h-screen overflow-x-hidden font-sans relative">
    <MouseModeIndicator :mode="mouseMode" />
    
    <main class="relative z-10 bg-transparent">
      <FloatingDock/>

      <div id="homepage-scroll-container" class="relative z-10 w-full">
        <ChapterHero/>
        <ChapterLivingInterfaces />
        <ChapterInfinitePossibilities />
        <ChapterSystemToCreation />

        <ChapterMonumentFooter />
        <MagneticBackToTop />
      </div>

    </main>
  </div>
</template>
