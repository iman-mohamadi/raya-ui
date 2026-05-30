<template>
  <div class="engine-content">

    <div class="engine-phase e-phase-0">
      <h2 class="giant-editorial text-center">
        <span class="engine-line el-0">BEAUTY IS BUILT</span><br>
        <span class="engine-line el-0 italic-luxury">ON SYSTEMS.</span>
      </h2>
    </div>

    <div class="engine-phase e-phase-assembly">

      <div class="module-block mb-vue">
        <div class="hud-line"></div>
        <div class="hud-meta">MODULE_01</div>
        <h3 class="engine-line asm-1 text-primary">Reactive Foundations</h3>
      </div>

      <div class="module-block mb-nuxt text-right">
        <div class="hud-line reverse"></div>
        <div class="hud-meta">MODULE_02</div>
        <h3 class="engine-line asm-2 text-white">Architecture For Growth</h3>
      </div>

      <div class="module-block mb-tailwind">
        <div class="hud-line"></div>
        <div class="hud-meta">MODULE_03</div>
        <h3 class="engine-line asm-3 text-white">Design Without Constraints</h3>
      </div>

      <div class="module-block mb-reka text-right">
        <div class="hud-line reverse"></div>
        <div class="hud-meta">MODULE_04</div>
        <h3 class="engine-line asm-4 text-white">Precision At The Core</h3>
      </div>

      <div class="module-block mb-gsap">
        <div class="hud-line"></div>
        <div class="hud-meta">MODULE_05</div>
        <h3 class="engine-line asm-5 text-accent">Motion With Meaning</h3>
      </div>

    </div>

    <div class="engine-phase e-phase-climax">
      <div class="climax-wrapper">
        <h1 class="raya-massive engine-line el-climax">RAYA</h1>
        <p class="raya-sub engine-line el-climax">
          A system for building interfaces people remember.
        </p>
      </div>
    </div>

  </div>
</template>

<style scoped>
.engine-content {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}

.engine-phase {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 5vw;
}

/* Typography Base */
.giant-editorial {
  font-family: 'Helvetica Neue', 'Inter', sans-serif;
  font-size: clamp(3rem, 7vw, 10rem);
  font-weight: 200;
  line-height: 0.9;
  letter-spacing: -0.04em;
  margin: 0;
  color: #fff;
}
.italic-luxury { font-family: 'Times New Roman', serif; font-style: italic; font-weight: 300; color: rgba(255,255,255,0.6); }
.text-center { text-align: center; }
.text-right { text-align: right; align-items: flex-end; }
.text-primary { color: var(--primary, #00e5ff); }
.text-white { color: #fff; }
.text-accent { color: var(--accent, #a855f7); }

/* GSAP Preparation */
.engine-line { opacity: 0; transform: translateY(20px); will-change: transform, opacity; }

/* The Assembly HUD Blocks */
.module-block {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.mb-vue { top: 20%; left: 8%; }
.mb-nuxt { top: 35%; right: 8%; }
.mb-tailwind { top: 50%; left: 8%; }
.mb-reka { top: 65%; right: 8%; }
.mb-gsap { bottom: 15%; left: 50%; transform: translateX(-50%); text-align: center; align-items: center; }

.hud-line { width: 40px; height: 1px; background: rgba(255,255,255,0.3); margin-bottom: 0.5rem; }
.hud-meta { font-family: 'SFMono-Regular', monospace; font-size: 0.65rem; letter-spacing: 0.2em; color: rgba(255,255,255,0.4); }
h3 { font-family: 'Inter', sans-serif; font-size: clamp(1rem, 2vw, 2rem); font-weight: 300; margin: 0; letter-spacing: -0.02em; }

/* The Climax Overlay */
.e-phase-climax {
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle, rgba(0,0,0,0) 20%, rgba(3,3,5,0.8) 100%);
  opacity: 0; /* Handled by GSAP */
}
.climax-wrapper { text-align: center; }
.raya-massive {
  font-family: 'Inter', sans-serif;
  font-size: clamp(8rem, 20vw, 25rem);
  font-weight: 200;
  line-height: 0.8;
  letter-spacing: -0.06em;
  margin: 0;
  color: #fff;
  text-shadow: 0 0 40px rgba(255,255,255,0.2);
}
.raya-sub {
  font-family: 'SFMono-Regular', monospace;
  font-size: clamp(0.75rem, 1.2vw, 1.2rem);
  letter-spacing: 0.1em;
  color: var(--primary, #00e5ff);
  margin-top: 2rem;
  text-transform: uppercase;
}
</style>