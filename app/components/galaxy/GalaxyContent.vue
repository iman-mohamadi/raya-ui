<template>
  <div class="galaxy-content">

    <div class="g-phase g-intro center-align">
      <h2 class="giant-editorial text-center">
        <div class="line-wrap"><span class="g-line">NO GREAT SYSTEM</span></div>
        <div class="line-wrap"><span class="g-line luxury-italic">IS BUILT ALONE.</span></div>
      </h2>
    </div>

    <div class="g-phase g-commits top-left">
      <div class="meta-label g-line text-accent">NETWORK_ACTIVITY // LIVE</div>
      <h2 class="medium-editorial text-left">
        <div class="line-wrap"><span class="g-line">Always Moving.</span></div>
        <div class="line-wrap"><span class="g-line text-primary luxury-italic">Always Evolving.</span></div>
      </h2>
    </div>

    <div class="g-phase g-scale center-align">
      <h1 class="mega-editorial text-center">
        <div class="line-wrap"><span class="g-line">BUILT BY MANY.</span></div>
      </h1>
      <h1 class="mega-editorial text-center mt-8">
        <div class="line-wrap"><span class="g-line luxury-italic text-primary">FOR MILLIONS.</span></div>
      </h1>
    </div>

    <div class="g-phase g-heartbeat center-align">
      <h2 class="giant-editorial text-center">
        <div class="line-wrap"><span class="g-line">ONE COMMUNITY.</span></div>
        <div class="line-wrap"><span class="g-line luxury-italic text-white">ONE FUTURE.</span></div>
      </h2>
    </div>

    <div class="g-phase g-ending center-align">
      <h2 class="giant-editorial text-center">
        <div class="line-wrap"><span class="g-line text-accent">EVERYTHING</span></div>
        <div class="line-wrap"><span class="g-line luxury-italic">LEADS HERE.</span></div>
      </h2>
    </div>

  </div>
</template>

<style scoped>
.galaxy-content {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}

.g-phase {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 8vw;
}

/* Typography Base */
.giant-editorial { font-family: 'Helvetica Neue', 'Inter', sans-serif; font-size: clamp(4rem, 10vw, 12rem); font-weight: 200; line-height: 0.9; letter-spacing: -0.04em; color: #fff; margin: 0; }
.medium-editorial { font-family: 'Helvetica Neue', 'Inter', sans-serif; font-size: clamp(2rem, 5vw, 6rem); font-weight: 300; line-height: 1; letter-spacing: -0.02em; color: #fff; margin: 0; }
.mega-editorial { font-family: 'Helvetica Neue', 'Inter', sans-serif; font-size: clamp(5rem, 14vw, 18rem); font-weight: 200; line-height: 0.8; letter-spacing: -0.06em; color: #fff; margin: 0; }

.luxury-italic { font-family: 'Times New Roman', serif; font-style: italic; font-weight: 300; color: rgba(255,255,255,0.7); }
.meta-label { font-family: 'SFMono-Regular', monospace; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1rem; }

/* Alignments */
.center-align { justify-content: center; align-items: center; }
.top-left { justify-content: flex-start; align-items: flex-start; padding-top: 15vh; }

.text-center { text-align: center; }
.text-left { text-align: left; }
.mt-8 { margin-top: 4rem; }

/* Theme Colors */
.text-primary { color: var(--primary, #00e5ff); }
.text-accent { color: var(--accent, #a855f7); }
.text-white { color: #fff; }

/* GSAP Utils */
.line-wrap { overflow: hidden; padding-bottom: 0.15em; }
.g-line { display: block; will-change: transform, opacity; }
</style>