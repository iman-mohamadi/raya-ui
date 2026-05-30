<template>
  <div class="philosophy-content">

    <!-- PHASE 1: SILENT VOID -->
    <div class="phil-phase phil-p1">
      <h2 class="giant-editorial line-wrap">
        <span class="line p1-line">INTERFACES</span>
      </h2>
      <h2 class="giant-editorial line-wrap indent-right">
        <span class="line p1-line luxury-italic">ARE EMOTION.</span>
      </h2>
    </div>

    <!-- PHASE 4: INTERACTION AS ART -->
    <div class="phil-phase phil-p4">
      <div class="interaction-showcase">
        <div class="meta-label p4-fade">04 // KINETIC RESPONSE</div>

        <!-- Ultra-Premium Magnetic Element -->
        <div class="magnetic-button cursor-interactive p4-fade">
          <div class="glass-orb"></div>
          <span class="button-text">FEEL THE SYSTEM</span>
        </div>
      </div>
    </div>

    <!-- PHASE 5: THE MANIFESTO -->
    <div class="phil-phase phil-p5">
      <div class="manifesto-block">
        <p class="manifesto-text line-wrap">
          <span class="line p5-line">Raya UI is not a component library.</span>
        </p>
        <p class="manifesto-text line-wrap indent-subtle">
          <span class="line p5-line">It is a digital craft system</span>
        </p>
        <p class="manifesto-text line-wrap indent-deep">
          <span class="line p5-line">for those who believe</span>
        </p>
        <p class="manifesto-text line-wrap">
          <span class="line p5-line luxury-italic primary-text">interfaces should feel alive.</span>
        </p>
      </div>
    </div>

  </div>
</template>

<style scoped>
.philosophy-content {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none; /* Container ignores clicks, children re-enable them */
}

.phil-phase {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8vw;
}

/* Typography Foundations */
.giant-editorial {
  font-family: 'Helvetica Neue', 'Inter', sans-serif;
  font-size: clamp(4rem, 10vw, 12rem);
  font-weight: 200;
  line-height: 0.9;
  letter-spacing: -0.05em;
  margin: 0;
  color: #fff;
}

.luxury-italic {
  font-family: 'Times New Roman', serif;
  font-style: italic;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.7);
}

.indent-right { text-align: right; margin-right: 5vw; }
.indent-subtle { padding-left: 10vw; }
.indent-deep { padding-left: 20vw; }

.primary-text { color: var(--primary, #00e5ff); }

/* GSAP Line Wrapping */
.line-wrap { overflow: hidden; padding-bottom: 0.15em; }
.line { display: block; transform: translateY(110%) rotate(2deg); transform-origin: left bottom; }

/* Phase 4: Interaction Art */
.phil-p4 {
  align-items: flex-end;
  justify-content: center;
}
.interaction-showcase {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2rem;
  pointer-events: auto; /* Re-enable clicks for the button */
}
.meta-label {
  font-family: 'SFMono-Regular', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: rgba(255,255,255,0.4);
}

.magnetic-button {
  position: relative;
  padding: 2rem 4rem;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  backdrop-filter: blur(20px);
  transition: background 0.4s ease, border-color 0.4s ease;
}

.magnetic-button:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.3);
}

.glass-orb {
  position: absolute;
  width: 150px;
  height: 150px;
  background: var(--primary, #00e5ff);
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.2;
  transition: opacity 0.4s ease, transform 0.2s ease-out;
  transform: scale(0.5);
}

.magnetic-button:hover .glass-orb {
  opacity: 0.5;
  transform: scale(1);
}

.button-text {
  position: relative;
  z-index: 2;
  font-family: 'SFMono-Regular', monospace;
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  color: #fff;
}

/* Phase 5: Manifesto */
.phil-p5 {
  align-items: center;
  text-align: left;
}
.manifesto-block {
  max-width: 80vw;
}
.manifesto-text {
  font-family: 'Helvetica Neue', 'Inter', sans-serif;
  font-size: clamp(2rem, 5vw, 6rem);
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin: 0;
  color: #fff;
}
</style>