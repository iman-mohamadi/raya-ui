<script setup lang="ts">
import { ref, onMounted } from 'vue'
import WorldsWebGL from './WorldsWebGL.vue'
import WorldsArchitecture from './WorldsArchitecture.vue'
import { useWorldsChoreography } from '~/composables/useWorldsChoreography'

const sectionRef = ref<HTMLElement | null>(null)
const trackRef = ref<any>(null) // Ref forwarded to the child track

const { initWorldsChoreography } = useWorldsChoreography()

onMounted(() => {
  if (sectionRef.value && trackRef.value?.$el) {
    // We pass the raw DOM element of the track to the choreographer
    initWorldsChoreography(sectionRef.value, trackRef.value.$el)
  }
})
</script>

<template>
  <section ref="sectionRef" class="product-worlds-section">
    <div class="cinematic-viewport">

      <WorldsWebGL />

      <WorldsArchitecture ref="trackRef" />

    </div>
  </section>
</template>

<style scoped>
.product-worlds-section {
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