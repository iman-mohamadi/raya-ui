<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'

onMounted(() => {
  // Bulletproof Initial Load Sequence
  const tl = gsap.timeline()

  // 1. Loader text pulses briefly
  tl.to('.loader-brand', { opacity: 1, duration: 0.5, ease: 'power2.inOut', yoyo: true, repeat: 1 })

  // 2. Curtain slides up to reveal the world
  tl.to('#global-loader', {
    yPercent: -100,
    duration: 1.2,
    ease: 'expo.inOut',
    delay: 0.2
  })

  // 3. Optional: Trigger a custom event here if you want Hero animations to wait for the loader
})
</script>

<template>
  <div id="app-root">

    <div id="global-loader">
      <div class="loader-brand">BOOTING DIGITAL MATTER...</div>
    </div>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

  </div>
</template>

<style>
/* Reset */
html, body {
  margin: 0;
  padding: 0;
  background-color: #030305;
  color: #ffffff;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

#app-root {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

/* Global Loader Styles */
#global-loader {
  position: fixed;
  inset: 0;
  background-color: #030305; /* Matches the void */
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
}

.loader-brand {
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  color: var(--primary, #00e5ff);
  text-transform: uppercase;
  opacity: 0; /* Hidden initially, GSAP fades it in */
}
</style>