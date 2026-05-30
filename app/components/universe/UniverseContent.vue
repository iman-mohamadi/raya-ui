<template>
  <div class="universe-content">

    <!-- PHASE 1: The Big Bang Statement -->
    <div class="u-phase u-phase-1">
      <h2 class="giant-editorial text-center">
        <div class="line-wrap"><span class="uni-line">EVERY EXPERIENCE</span></div>
        <div class="line-wrap"><span class="uni-line luxury-italic text-primary">STARTS HERE.</span></div>
      </h2>
    </div>

    <!-- PHASE 2: Input Constellation -->
    <div class="u-phase u-phase-constellation constellation-input">
      <div class="constellation-hud left-align">
        <div class="hud-title">INPUT_CONSTELLATION</div>
        <ul class="hud-list">
          <li>SYS // UI_BUTTON</li>
          <li>SYS // UI_INPUT</li>
          <li>SYS // UI_TEXTAREA</li>
        </ul>
      </div>
    </div>

    <!-- PHASE 3: Interaction Constellation -->
    <div class="u-phase u-phase-constellation constellation-interaction">
      <div class="constellation-hud right-align">
        <div class="hud-title">INTERACTION_CONSTELLATION</div>
        <ul class="hud-list">
          <li>SYS // UI_ACCORDION</li>
          <li>SYS // UI_COLLAPSIBLE</li>
          <li>SYS // UI_SHEET</li>
        </ul>
      </div>
    </div>

    <!-- PHASE 4: Morph Sequence Statement -->
    <div class="u-phase u-phase-morph">
      <h2 class="giant-editorial text-right">
        <div class="line-wrap"><span class="uni-line">COMPONENTS</span></div>
        <div class="line-wrap"><span class="uni-line">BECOME</span></div>
        <div class="line-wrap"><span class="uni-line luxury-italic">WORLDS.</span></div>
      </h2>
    </div>

    <!-- PHASE 5: Scale Realization -->
    <div class="u-phase u-phase-scale">
      <div class="scale-container uni-fade">
        <h1 class="massive-stats text-primary">120+</h1>
        <p class="scale-sub">LIVING COMPONENTS.<br>INFINITE EXPERIENCES.</p>
      </div>
    </div>

    <!-- PHASE 6: The Convergence -->
    <div class="u-phase u-phase-ending">
      <h2 class="giant-editorial text-center">
        <div class="line-wrap"><span class="uni-line">THE COMPONENT IS</span></div>
        <div class="line-wrap"><span class="uni-line luxury-italic">ONLY THE BEGINNING.</span></div>
      </h2>
    </div>

  </div>
</template>

<style scoped>
.universe-content {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}

.u-phase {
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
  font-size: clamp(4rem, 9vw, 12rem);
  font-weight: 200;
  line-height: 0.9;
  letter-spacing: -0.04em;
  margin: 0;
  color: #fff;
}
.luxury-italic { font-family: 'Times New Roman', serif; font-style: italic; font-weight: 300; color: rgba(255,255,255,0.7); }
.text-center { text-align: center; align-items: center; }
.text-right { text-align: right; align-items: flex-end; }
.text-primary { color: var(--primary, #00e5ff); }

.line-wrap { overflow: hidden; padding-bottom: 0.15em; }
.uni-line { display: block; will-change: transform, opacity; }

/* Constellation HUDs */
.u-phase-constellation { opacity: 0; }
.constellation-hud {
  position: absolute;
  padding: 2rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  backdrop-filter: blur(20px);
  border-radius: 12px;
}
.left-align { top: 30%; left: 10vw; }
.right-align { top: 40%; right: 10vw; text-align: right; }
.hud-title { font-family: 'SFMono-Regular', monospace; font-size: 0.75rem; letter-spacing: 0.2em; color: var(--primary); margin-bottom: 1.5rem; }
.hud-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.hud-list li { font-family: 'SFMono-Regular', monospace; font-size: 0.65rem; color: rgba(255,255,255,0.4); letter-spacing: 0.1em; }

/* Scale Moment */
.u-phase-scale { align-items: center; }
.scale-container { text-align: center; }
.massive-stats { font-family: 'Inter', sans-serif; font-size: clamp(8rem, 20vw, 25rem); font-weight: 200; line-height: 0.8; letter-spacing: -0.05em; margin: 0; }
.scale-sub { font-family: 'SFMono-Regular', monospace; font-size: 1rem; letter-spacing: 0.15em; color: #fff; margin-top: 2rem; }
</style>