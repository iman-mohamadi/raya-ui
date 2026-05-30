<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UniverseWebGL from './UniverseWebGL.vue'
import UniverseContent from './UniverseContent.vue'
import { useUniverseChoreography } from '~/composables/useUniverseChoreography'

const sectionRef = ref<HTMLElement | null>(null)
const webglRef = ref<any>(null)

const { initUniverseChoreography } = useUniverseChoreography()

onMounted(() => {
  if (sectionRef.value && webglRef.value) {
    // Pass the WebGL 3D injector into the GSAP scroll timeline
    initUniverseChoreography(sectionRef.value, webglRef.value.inject3DUniverse)
  }
})
</script>

<template>
  <section ref="sectionRef" class="universe-section cinematic-block">
    <div class="cinematic-viewport">
      <UniverseWebGL ref="webglRef" />
      <UniverseContent />
    </div>
  </section>
</template>

<style scoped>
.universe-section {
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