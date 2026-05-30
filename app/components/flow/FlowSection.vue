<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FlowWebGL from './FlowWebGL.vue'
import FlowArchitecture from './FlowArchitecture.vue'
import FlowTypography from './FlowTypography.vue'
import { useFlowChoreography } from '~/composables/useFlowChoreography'

const sectionRef = ref<HTMLElement | null>(null)
const webglRef = ref<any>(null)

const { initFlowChoreography } = useFlowChoreography()

onMounted(() => {
  if (sectionRef.value && webglRef.value) {
    initFlowChoreography(sectionRef.value, webglRef.value.inject3DFlow)
  }
})
</script>

<template>
  <section ref="sectionRef" class="flow-section cinematic-block">
    <div class="cinematic-viewport">
      <FlowWebGL ref="webglRef" />
      <FlowTypography />
      <FlowArchitecture />
    </div>
  </section>
</template>

<style scoped>
.flow-section {
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