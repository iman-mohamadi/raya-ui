<template>
  <div class="glass-architecture">
    <div class="fragment top-left">
      <div class="ui-dot"></div>
      <div class="ui-line"></div>
    </div>

    <div class="fragment bottom-right"></div>
  </div>
</template>

<style scoped>
.glass-architecture {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  overflow: hidden;
}

/* Clean, premium glass panels */
.fragment {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px); /* Safari support */
  border-radius: 2px;
  will-change: transform, opacity;
}

/* Precise framing positions instead of random overlaps */
.top-left {
  top: 4vw;
  left: 4vw;
  width: 250px;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  gap: 1rem;
}

.bottom-right {
  bottom: -5vh;
  right: -5vw;
  width: 40vw;
  height: 50vh;
  transform: rotate(-15deg);
  background: linear-gradient(135deg, rgba(255,255,255,0.04), transparent);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
}

/* Minimal UI Details */
.ui-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
}

.ui-line {
  flex-grow: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}
</style>