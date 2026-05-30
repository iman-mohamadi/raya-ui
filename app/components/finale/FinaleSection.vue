<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FinaleWebGL from './FinaleWebGL.vue'
import FinaleContent from './FinaleContent.vue'
import { useFinaleChoreography } from '~/composables/useFinaleChoreography'

const sectionRef = ref<HTMLElement | null>(null)
const webglRef = ref<any>(null)

const { initFinaleChoreography } = useFinaleChoreography()

onMounted(() => {
  if (sectionRef.value && webglRef.value) {
    initFinaleChoreography(sectionRef.value, webglRef.value.inject3DFinale)
  }
})
</script>

<template>
  <section ref="sectionRef" class="finale-section cinematic-block">
    <div class="cinematic-viewport">
      <FinaleWebGL ref="webglRef" />
      <FinaleContent />
    </div>
  </section>
</template>

<style scoped>
.finale-section {
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