<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EngineWebGL from './EngineWebGL.vue'
import EngineContent from './EngineContent.vue'
import { useEngineChoreography } from '~/composables/useEngineChoreography'

const sectionRef = ref<HTMLElement | null>(null)
const webglRef = ref<any>(null) // Access the defineExpose from child

const { initEngineChoreography } = useEngineChoreography()

onMounted(() => {
  if (sectionRef.value && webglRef.value) {
    // Pass the WebGL 3D timeline injector directly into our GSAP choreographer
    initEngineChoreography(sectionRef.value, webglRef.value.inject3DAssembly)
  }
})
</script>

<template>
  <section ref="sectionRef" class="engine-section cinematic-block">
    <div class="cinematic-viewport">

      <EngineWebGL ref="webglRef" />

      <EngineContent />

    </div>
  </section>
</template>

<style scoped>
.engine-section {
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