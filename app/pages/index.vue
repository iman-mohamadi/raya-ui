<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

import CinematicHero from '~/components/hero/CinematicHero.vue'
import EvolutionSection from '~/components/evolution/EvolutionSection.vue'
import ProductWorldsSection from '~/components/worlds/ProductWorldsSection.vue'
import PhilosophySection from '~/components/philosophy/PhilosophySection.vue'
import EngineSection from '~/components/engine/EngineSection.vue'
import UniverseSection from '~/components/universe/UniverseSection.vue'
import FlowSection from '~/components/flow/FlowSection.vue'
import ProofSection from '~/components/proof/ProofSection.vue'
import GalaxySection from '~/components/galaxy/GalaxySection.vue'
import FinaleSection from '~/components/finale/FinaleSection.vue'

definePageMeta({ layout: 'cinematic' })
useHead({ title: 'Raya UI // Digital Matter' })

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    }, 2500) // Accommodating the massive compilation of the entire 10-scene 3D journey
  })
})
</script>

<template>
  <main class="raya-world">
    <!-- Scene 1: The Hero -->
    <CinematicHero class="cinematic-block" />
    <!-- Scene 2: Morphing Evolution -->
    <EvolutionSection class="cinematic-block" />
    <!-- Scene 3: Product Worlds -->
    <ProductWorldsSection class="cinematic-block" />
    <!-- Scene 4: Digital Philosophy -->
    <PhilosophySection class="cinematic-block" />
    <!-- Scene 5: The Engine Room -->
    <EngineSection class="cinematic-block" />
    <!-- Scene 6: The Component Universe -->
    <UniverseSection class="cinematic-block" />
    <!-- Scene 7: Developer Flow -->
    <FlowSection class="cinematic-block" />
    <!-- Scene 8: Proof Through Creation -->
    <ProofSection class="cinematic-block" />
    <!-- Scene 9: The Open Source Galaxy -->
    <GalaxySection class="cinematic-block" />

    <!-- Scene 10: The Grand Finale -->
    <FinaleSection class="cinematic-block" />
  </main>
</template>

<style scoped>
.raya-world {
  display: block;
  width: 100%;
  background: transparent;
}

.cinematic-block {
  position: relative;
  width: 100vw;
  height: 100vh;
  z-index: 10;
}
</style>