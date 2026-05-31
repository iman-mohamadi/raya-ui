<script setup lang="ts">
import FloatingDock from '~/components/home/FloatingDock.vue'

import ChapterHero from '~/components/home/chapters/ChapterHero.client.vue'
import ChapterLivingInterfaces from '~/components/home/chapters/ChapterLivingInterfaces.client.vue'
import ChapterInfinitePossibilities from '~/components/home/chapters/ChapterInfinitePossibilities.client.vue'
import ChapterSystemToCreation from '~/components/home/chapters/ChapterSystemToCreation.client.vue'

// Import the Monument Footer
import ChapterMonumentFooter from '~/components/home/chapters/ChapterMonumentFooter.client.vue'

import { useScrollManager } from '~/composables/home/useScrollManager'

definePageMeta({ layout: 'cinematic', colorMode: 'dark' })
useScrollManager()
</script>

<template>
  <div class="bg-transparent text-[#FAFAFA] min-h-screen overflow-x-hidden font-sans relative">
    <main class="relative z-10 bg-transparent">
      <FloatingDock/>

      <div id="homepage-scroll-container" class="relative z-10 w-full">
        <ChapterHero/>
        <ChapterLivingInterfaces />
        <ChapterInfinitePossibilities />
        <ChapterSystemToCreation />

        <ChapterMonumentFooter />
      </div>

    </main>
  </div>
</template>