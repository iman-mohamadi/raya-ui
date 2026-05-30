<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GalaxyWebGL from './GalaxyWebGL.vue'
import GalaxyContent from './GalaxyContent.vue'
import { useGalaxyChoreography } from '~/composables/useGalaxyChoreography'

const sectionRef = ref<HTMLElement | null>(null)
const webglRef = ref<any>(null)

const { initGalaxyChoreography } = useGalaxyChoreography()

onMounted(() => {
  if (sectionRef.value && webglRef.value) {
    initGalaxyChoreography(sectionRef.value, webglRef.value.inject3DGalaxy)
  }
})
</script>

<template>
  <section ref="sectionRef" class="galaxy-section cinematic-block">
    <div class="cinematic-viewport">
      <GalaxyWebGL ref="webglRef" />
      <GalaxyContent />
    </div>
  </section>
</template>

<style scoped>
.galaxy-section {
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