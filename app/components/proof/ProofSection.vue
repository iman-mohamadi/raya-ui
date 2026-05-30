<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProofWebGL from './ProofWebGL.vue'
import ProofContent from './ProofContent.vue'
import { useProofChoreography } from '~/composables/useProofChoreography'

const sectionRef = ref<HTMLElement | null>(null)
const webglRef = ref<any>(null)

const { initProofChoreography } = useProofChoreography()

onMounted(() => {
  if (sectionRef.value && webglRef.value) {
    initProofChoreography(sectionRef.value, webglRef.value.inject3DProof)
  }
})
</script>

<template>
  <section ref="sectionRef" class="proof-section cinematic-block">
    <div class="cinematic-viewport">
      <ProofWebGL ref="webglRef" />
      <ProofContent />
    </div>
  </section>
</template>

<style scoped>
.proof-section {
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