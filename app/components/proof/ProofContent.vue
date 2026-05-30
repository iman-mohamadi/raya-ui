<template>
  <div class="proof-content">

    <div class="proof-phase p-intro">
      <h2 class="giant-editorial text-center">
        <div class="line-wrap"><span class="proof-line">CREATION</span></div>
        <div class="line-wrap"><span class="proof-line luxury-italic">WITHOUT LIMITS.</span></div>
      </h2>
    </div>

    <div class="proof-phase p-finance bottom-left">
      <h3 class="meta-label proof-line text-finance">01 // FINANCIAL OS</h3>
      <h2 class="medium-editorial">
        <div class="line-wrap"><span class="proof-line">Finance With Presence.</span></div>
        <div class="line-wrap"><span class="proof-line">Precision At Scale.</span></div>
      </h2>
    </div>

    <div class="proof-phase p-ai top-right">
      <h3 class="meta-label proof-line text-ai">02 // AI DIMENSION</h3>
      <h2 class="medium-editorial text-right">
        <div class="line-wrap"><span class="proof-line">Interfaces That Think.</span></div>
        <div class="line-wrap"><span class="proof-line">Intelligence Tangible.</span></div>
      </h2>
    </div>

    <div class="proof-phase p-commerce center-align">
      <h3 class="meta-label proof-line text-white">03 // SPATIAL RETAIL</h3>
      <h2 class="medium-editorial text-center">
        <div class="line-wrap"><span class="proof-line">Commerce Reimagined.</span></div>
        <div class="line-wrap"><span class="proof-line">Designed To Be Desired.</span></div>
      </h2>
    </div>

    <div class="proof-phase p-music bottom-right">
      <h3 class="meta-label proof-line text-music">04 // AUDIO UNIVERSE</h3>
      <h2 class="medium-editorial text-right">
        <div class="line-wrap"><span class="proof-line">Sound Made Visible.</span></div>
        <div class="line-wrap"><span class="proof-line">Feel The Rhythm.</span></div>
      </h2>
    </div>

    <div class="proof-phase p-workspace top-left">
      <h3 class="meta-label proof-line text-workspace">05 // FUTURE WORKSPACE</h3>
      <h2 class="medium-editorial text-left">
        <div class="line-wrap"><span class="proof-line">Work Without Friction.</span></div>
        <div class="line-wrap"><span class="proof-line">Productivity Reimagined.</span></div>
      </h2>
    </div>

    <div class="proof-phase p-reveal center-align">
      <h1 class="mega-editorial text-center">
        <div class="proof-scale">ONE SYSTEM.</div>
      </h1>
      <h1 class="mega-editorial text-center luxury-italic">
        <div class="proof-scale">INFINITE OUTCOMES.</div>
      </h1>
    </div>

    <div class="proof-phase p-ending center-align">
      <h2 class="giant-editorial text-center">
        <div class="line-wrap"><span class="proof-line">THE FUTURE</span></div>
        <div class="line-wrap"><span class="proof-line text-primary luxury-italic">IS BUILT.</span></div>
      </h2>
    </div>

  </div>
</template>

<style scoped>
.proof-content {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}

.proof-phase {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 8vw;
}

/* Typography Base */
.giant-editorial { font-family: 'Helvetica Neue', 'Inter', sans-serif; font-size: clamp(4rem, 10vw, 14rem); font-weight: 200; line-height: 0.85; letter-spacing: -0.04em; color: #fff; margin: 0; }
.medium-editorial { font-family: 'Helvetica Neue', 'Inter', sans-serif; font-size: clamp(2rem, 5vw, 6rem); font-weight: 300; line-height: 1; letter-spacing: -0.02em; color: #fff; margin: 0; }
.mega-editorial { font-family: 'Helvetica Neue', 'Inter', sans-serif; font-size: clamp(5rem, 12vw, 18rem); font-weight: 200; line-height: 0.8; letter-spacing: -0.06em; color: #fff; margin: 0; }

.luxury-italic { font-family: 'Times New Roman', serif; font-style: italic; font-weight: 300; color: rgba(255,255,255,0.7); }
.meta-label { font-family: 'SFMono-Regular', monospace; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1rem; }

/* Alignments */
.center-align { justify-content: center; align-items: center; }
.bottom-left { justify-content: flex-end; align-items: flex-start; padding-bottom: 10vh; }
.top-right { justify-content: flex-start; align-items: flex-end; padding-top: 10vh; }
.bottom-right { justify-content: flex-end; align-items: flex-end; padding-bottom: 10vh; }
.top-left { justify-content: flex-start; align-items: flex-start; padding-top: 10vh; }

.text-center { text-align: center; }
.text-right { text-align: right; }
.text-left { text-align: left; }

/* Theme Colors */
.text-primary { color: var(--primary, #fff); }
.text-finance { color: #eab308; }
.text-ai { color: #d946ef; }
.text-white { color: #fff; }
.text-music { color: #06b6d4; }
.text-workspace { color: #3b82f6; }

/* GSAP Utils */
.line-wrap { overflow: hidden; padding-bottom: 0.15em; }
.proof-line { display: block; will-change: transform, opacity; }
.proof-scale { display: block; will-change: transform, opacity, filter; }
</style>