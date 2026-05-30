<template>
  <div class="flow-typography">

    <div class="t-phase t-phase-1">
      <h2 class="giant-editorial text-center"><span class="flow-line">ONE COMMAND.</span></h2>
      <h2 class="giant-editorial text-center"><span class="flow-line luxury-italic">ZERO FRICTION.</span></h2>
    </div>

    <div class="t-phase t-phase-2">
      <h2 class="giant-editorial text-right"><span class="flow-line">CONNECTED</span></h2>
      <h2 class="giant-editorial text-right"><span class="flow-line luxury-italic">TO THE SOURCE.</span></h2>
    </div>

    <div class="t-phase t-phase-3">
      <h2 class="giant-editorial text-left"><span class="flow-line">GENERATED.</span></h2>
      <h2 class="giant-editorial text-left"><span class="flow-line">ASSEMBLED.</span></h2>
    </div>

    <div class="t-phase t-phase-4">
      <h2 class="giant-editorial text-center"><span class="flow-line">YOURS TO</span></h2>
      <h2 class="giant-editorial text-center"><span class="flow-line luxury-italic">SHAPE.</span></h2>
    </div>

    <div class="t-phase t-phase-5">
      <h2 class="giant-editorial text-center"><span class="flow-line">FROM ONE</span></h2>
      <h2 class="giant-editorial text-center"><span class="flow-line luxury-italic">COMPONENT.</span></h2>
    </div>

    <div class="t-phase t-phase-6">
      <h2 class="giant-editorial text-center"><span class="flow-line">READY FOR THE</span></h2>
      <h2 class="giant-editorial text-center"><span class="flow-line luxury-italic">REAL WORLD.</span></h2>
    </div>

    <div class="t-phase t-phase-end">
      <h1 class="mega-editorial text-center"><span class="flow-line">ONE SYSTEM.</span></h1>
      <h1 class="mega-editorial text-center"><span class="flow-line luxury-italic text-primary">ENDLESS CREATION.</span></h1>
    </div>

  </div>
</template>

<style scoped>
.flow-typography { position: absolute; inset: 0; z-index: 15; pointer-events: none; }

.t-phase {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 5vw;
}

.giant-editorial {
  font-family: 'Helvetica Neue', 'Inter', sans-serif;
  font-size: clamp(3rem, 8vw, 10rem);
  font-weight: 200;
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: #fff;
  margin: 0;
  overflow: hidden; /* For line-wrap effect */
}

.mega-editorial {
  font-family: 'Helvetica Neue', 'Inter', sans-serif;
  font-size: clamp(5rem, 12vw, 16rem);
  font-weight: 200;
  line-height: 0.85;
  letter-spacing: -0.05em;
  color: #fff;
  margin: 0;
  overflow: hidden;
}

.luxury-italic { font-family: 'Times New Roman', serif; font-style: italic; font-weight: 300; color: rgba(255,255,255,0.6); }
.text-center { text-align: center; align-items: center; }
.text-right { text-align: right; align-items: flex-end; }
.text-left { text-align: left; align-items: flex-start; }
.text-primary { color: var(--primary, #00e5ff); }

/* Hidden state for GSAP */
.flow-line { display: block; transform: translateY(100%); opacity: 0; will-change: transform, opacity; }

.t-phase-2 { align-items: flex-end; justify-content: flex-end; padding-bottom: 10vh; }
.t-phase-3 { align-items: flex-start; justify-content: flex-start; padding-top: 15vh; }
.t-phase-4 { justify-content: flex-start; padding-top: 10vh; }
.t-phase-5 { justify-content: flex-end; padding-bottom: 10vh; }
</style>