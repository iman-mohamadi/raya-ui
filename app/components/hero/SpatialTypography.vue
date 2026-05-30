<template>
  <div class="spatial-typography">
    <div class="meta-header">
      <div class="micro-copy">Digital Matter // OS V.01</div>
    </div>

    <div class="title-container">
      <h1 class="hero-title">
        <div class="line-wrap"><span class="line">The interface</span></div>
        <div class="line-wrap"><span class="line indent">is alive.</span></div>
      </h1>
    </div>

    <div class="subtitle-container">
      <p class="hero-sub">
        <div class="line-wrap"><span class="line">Designed for the</span></div>
        <div class="line-wrap"><span class="line">next generation</span></div>
        <div class="line-wrap"><span class="line">of interaction.</span></div>
      </p>
    </div>
  </div>
</template>

<style scoped>
.spatial-typography {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto 1fr auto;
  padding: 4vw;
  height: 100vh;
  color: #fff;
}

/* 1. Header Placement */
.meta-header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
}

/* 2. Main Title Placement - Anchored left, vertically centered */
.title-container {
  grid-column: 1 / 10;
  grid-row: 2;
  align-self: center;
  margin-top: -5vh; /* Slight optical lift */
}

/* 3. Subtitle Placement - Anchored right, bottom */
.subtitle-container {
  grid-column: 8 / 13;
  grid-row: 3;
  text-align: right;
  align-self: end;
  padding-bottom: 4vh;
}

/* Typography Styling */
.hero-title {
  /* Use a premium fallback stack. If you have a custom font, apply it globally to these */
  font-family: 'Helvetica Neue', 'Inter', sans-serif;
  font-size: clamp(3.5rem, 8vw, 10rem);
  font-weight: 300;
  line-height: 0.95;
  letter-spacing: -0.04em;
  margin: 0;
}

.indent {
  margin-left: 10vw; /* Responsive indentation */
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
}

.hero-sub {
  font-family: 'Helvetica Neue', 'Inter', sans-serif;
  font-size: clamp(1rem, 1.2vw, 1.5rem);
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.micro-copy {
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.3);
}

/* GSAP Animation Prep */
.line-wrap {
  overflow: hidden;
  padding-bottom: 0.15em;
}

.line {
  display: block;
  transform: translateY(110%) rotate(2deg);
  transform-origin: left bottom;
  will-change: transform;
}
</style>