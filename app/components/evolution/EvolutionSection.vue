<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EvolutionWebGL from './EvolutionWebGL.vue'
import EvolutionTypography from './EvolutionTypography.vue'
import MorphingArchitecture from './MorphingArchitecture.vue'
import { useEvolutionScene } from '~/composables/useEvolutionScene'

const sectionRef = ref<HTMLElement | null>(null)
const { initEvolutionChoreography } = useEvolutionScene()

onMounted(() => {
  if (sectionRef.value) {
    // Removed the setTimeout so it mounts in the exact correct DOM order
    initEvolutionChoreography(sectionRef.value)
  }
})
</script>

<template>
  <section ref="sectionRef" class="evolution-section">
    <div class="cinematic-viewport">
      <EvolutionWebGL />
      <EvolutionTypography />
      <MorphingArchitecture />
    </div>
  </section>
</template>

<style scoped>
.evolution-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: transparent;
}

.cinematic-viewport {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>