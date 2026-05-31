<script setup lang="ts">
// 1. CRITICAL: Nuxt auto-imports DO NOT WORK inside TresCanvas. You MUST explicitly import it.
import GlobalParticleSystem from '~/components/GlobalParticleSystem.client.vue'
</script>

<template>
  <div class="layout-cinematic">
    <CinematicCursor />

    <div class="global-canvas-container">
      <ClientOnly>
        <TresCanvas clear-color="#030305" window-size>
          <TresPerspectiveCamera :position="[0, 0, 20]" :look-at="[0, 0, 0]" />

          <GlobalParticleSystem />

        </TresCanvas>
      </ClientOnly>
    </div>

    <div class="global-environment">
      <div class="film-grain"></div>
      <div ref="ambientGlowRef" class="ambient-glow"></div>
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