<template>
  <div class="evolution-typography">
    <h2 class="cinematic-heading evo-title-left">
      STATIC UI
    </h2>
    <h2 class="cinematic-heading evo-title-right">
      IS DEAD.
    </h2>
    <div class="evo-micro-copy">
      <p>02 // MORPHOLOGY</p>
      <p>System reconstruction initiated.</p>
    </div>
  </div>
</template>

<style scoped>
.evolution-typography {
  position: absolute;
  inset: 0;
  z-index: 15;
  display: flex;
  flex-direction: column;
  justify-content: center;
  pointer-events: none;
  perspective: 1000px;
}

.cinematic-heading {
  font-family: 'Helvetica Neue', 'Inter', sans-serif;
  font-size: clamp(5rem, 12vw, 15rem);
  font-weight: 200;
  line-height: 0.85;
  letter-spacing: -0.05em;
  color: #ffffff;
  margin: 0;
  will-change: transform, opacity, filter;
}

.evo-title-left {
  text-align: left;
  margin-left: -2vw; /* Pull off grid slightly */
}

.evo-title-right {
  text-align: right;
  margin-right: 5vw;
  margin-top: -4vh;
  font-style: italic;
  color: rgba(255, 255, 255, 0.4);
}

.evo-micro-copy {
  position: absolute;
  bottom: 8vh;
  left: 5vw;
  font-family: 'SFMono-Regular', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
}
</style>