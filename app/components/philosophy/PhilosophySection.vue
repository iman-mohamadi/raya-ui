<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PhilosophyWebGL from './PhilosophyWebGL.vue'
import PhilosophyContent from './PhilosophyContent.vue'
import { usePhilosophyChoreography } from '~/composables/usePhilosophyChoreography'

const sectionRef = ref<HTMLElement | null>(null)
const { initPhilosophyChoreography } = usePhilosophyChoreography()

onMounted(() => {
  if (sectionRef.value) {
    initPhilosophyChoreography(sectionRef.value)
  }
})
</script>

<template>
  <section ref="sectionRef" class="philosophy-section cinematic-block">
    <div class="cinematic-viewport">
      <!-- Layer 1: Volumetric Luxury Glass -->
      <PhilosophyWebGL />

      <!-- Layer 2: Emotional Typography -->
      <PhilosophyContent />
    </div>
  </section>
</template>

<style scoped>
.philosophy-section {
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