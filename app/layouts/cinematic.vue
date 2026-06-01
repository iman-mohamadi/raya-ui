<script setup lang="ts">
import GlobalParticleSystem from '~/components/GlobalParticleSystem.client.vue'
import PostProcessing from '~/components/home/PostProcessing.client.vue'
</script>

<template>
  <div class="layout-cinematic">
    <CinematicCursor />

    <div class="global-canvas-container">
      <ClientOnly>
        <TresCanvas clear-color="#030305" window-size>
          <TresPerspectiveCamera :position="[0, 0, 20]" :look-at="[0, 0, 0]" />

          <GlobalParticleSystem />

          <PostProcessing />

        </TresCanvas>
      </ClientOnly>
    </div>

    <div class="page-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.global-canvas-container {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
.page-content {
  position: relative;
  z-index: 10;
}
</style>