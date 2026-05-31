<template>
  <div class="layout-cinematic">
    <CinematicCursor />

    <div class="global-canvas-container">
      <TresCanvas clear-color="#030305" window-size>
        <TresPerspectiveCamera :position="[0, 0, 20]" :look-at="[0, 0, 0]" />
        <GlobalParticleSystem />
      </TresCanvas>
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
  z-index: 1; /* Above background, behind content */
  pointer-events: none; /* Let clicks pass through to HTML */
}
.page-content {
  position: relative;
  z-index: 10;
  /* Scroll remains native */
}
</style>