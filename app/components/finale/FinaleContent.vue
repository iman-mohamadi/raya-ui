<template>
  <div class="finale-content">

    <!-- PHASE 2: Message 1 -->
    <div class="f-phase f-msg-1">
      <h2 class="sacred-editorial text-center">
        <div class="line-wrap"><span class="f-line">INTERFACES ARE</span></div>
        <div class="line-wrap"><span class="f-line luxury-italic text-ghost">FORGOTTEN.</span></div>
      </h2>
    </div>

    <!-- PHASE 3: Message 2 -->
    <div class="f-phase f-msg-2">
      <h2 class="sacred-editorial text-center">
        <div class="line-wrap"><span class="f-line">EXPERIENCES ARE</span></div>
        <div class="line-wrap"><span class="f-line luxury-italic text-ghost">REMEMBERED.</span></div>
      </h2>
    </div>

    <!-- PHASE 4: The Climax -->
    <div class="f-phase f-climax">
      <h1 class="climax-editorial text-center">
        <div class="line-wrap"><span class="f-line text-blinding">BUILD WHAT THEY</span></div>
        <div class="line-wrap"><span class="f-line text-blinding">REMEMBER.</span></div>
      </h1>
    </div>

    <!-- PHASE 5: The Artifact (CTA) -->
    <div class="f-phase f-cta">
      <div class="glass-artifact cursor-interactive">

        <!-- Internal DNA Reflections -->
        <div class="artifact-dna dna-1"></div>
        <div class="artifact-dna dna-2"></div>

        <div class="artifact-content">
          <div class="cli-container">
            <span class="prompt">~ %</span>
            <span class="command">npx raya-ui add</span>
          </div>

          <div class="action-grid">
            <button class="artifact-btn primary-btn">START BUILDING</button>
            <button class="artifact-btn ghost-btn">EXPLORE REGISTRY</button>
          </div>
        </div>
      </div>
    </div>

    <!-- PHASE 6: The Final Note & Footer -->
    <div class="f-phase f-ending">
      <div class="final-message">
        <h3 class="meta-editorial text-center">
          <div class="line-wrap"><span class="f-line">THE FUTURE IS BUILT BY THOSE WHO CREATE IT.</span></div>
        </h3>
      </div>

      <!-- Integrated Spatial Footer -->
      <footer class="footer-environment">
        <div class="footer-brand">RAYA UI <span class="version">V.01</span></div>
        <div class="footer-links">
          <a href="#" class="cursor-interactive">GitHub</a>
          <a href="#" class="cursor-interactive">Documentation</a>
          <a href="#" class="cursor-interactive">X (Twitter)</a>
        </div>
      </footer>
    </div>

  </div>
</template>

<style scoped>
.finale-content {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}

.f-phase {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5vw;
}

/* Typography Base */
.sacred-editorial { font-family: 'Helvetica Neue', 'Inter', sans-serif; font-size: clamp(3rem, 7vw, 10rem); font-weight: 200; line-height: 0.9; letter-spacing: -0.04em; color: #fff; margin: 0; }
.climax-editorial { font-family: 'Helvetica Neue', 'Inter', sans-serif; font-size: clamp(4rem, 12vw, 16rem); font-weight: 200; line-height: 0.85; letter-spacing: -0.05em; margin: 0; }
.meta-editorial { font-family: 'SFMono-Regular', monospace; font-size: 0.85rem; letter-spacing: 0.2em; color: rgba(255,255,255,0.5); text-transform: uppercase; }

.luxury-italic { font-family: 'Times New Roman', serif; font-style: italic; font-weight: 300; }
.text-center { text-align: center; }
.text-ghost { color: rgba(255,255,255,0.4); }
.text-blinding { color: #fff; text-shadow: 0 0 40px rgba(255,255,255,0.8), 0 0 80px rgba(255,255,255,0.4); }

.line-wrap { overflow: hidden; padding-bottom: 0.15em; }
.f-line { display: block; will-change: transform, opacity; }

/* THE ARTIFACT (CTA) */
.glass-artifact {
  position: relative;
  width: 500px;
  max-width: 90vw;
  padding: 3rem;
  background: linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 100%);
  box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.5),
      inset 0 -1px 1px rgba(255, 255, 255, 0.05),
      0 50px 100px rgba(0, 0, 0, 0.9),
      0 0 150px rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(50px) saturate(160%);
  -webkit-backdrop-filter: blur(50px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  overflow: hidden;
  pointer-events: auto; /* Enable interaction */
  will-change: transform, opacity, filter;
}

/* Artifact Internal DNA */
.artifact-dna {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  filter: blur(60px);
  z-index: 0;
  opacity: 0.3;
}
.dna-1 { top: -50px; left: -50px; background: var(--primary, #fff); }
.dna-2 { bottom: -50px; right: -50px; background: var(--accent, #a855f7); }

.artifact-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.cli-container {
  background: rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 1.5rem;
  font-family: 'SFMono-Regular', monospace;
  font-size: 1.2rem;
  color: #fff;
  display: flex;
  align-items: center;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
}
.prompt { color: rgba(255,255,255,0.4); margin-right: 1rem; }

.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.artifact-btn {
  padding: 1.2rem;
  border-radius: 8px;
  font-family: 'SFMono-Regular', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: none; /* Let cinematic cursor handle it */
  transition: all 0.3s ease;
}
.primary-btn {
  background: #fff;
  color: #000;
  border: none;
}
.primary-btn:hover { background: #e0e0e0; box-shadow: 0 0 20px rgba(255,255,255,0.5); }
.ghost-btn {
  background: rgba(255,255,255,0.05);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.1);
}
.ghost-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); }

/* --- FOOTER INTEGRATION --- */
.f-ending {
  justify-content: flex-end;
}
.final-message {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
}

.footer-environment {
  width: 100%;
  padding: 2vw 4vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255,255,255,0.05);
  background: linear-gradient(to top, rgba(3,3,5,1), rgba(3,3,5,0));
  pointer-events: auto;
  will-change: transform, opacity;
}

.footer-brand {
  font-family: 'SFMono-Regular', monospace;
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  color: #fff;
}
.version { color: rgba(255,255,255,0.4); margin-left: 0.5rem; }

.footer-links {
  display: flex;
  gap: 2rem;
}
.footer-links a {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.5);
  text-decoration: none;
  transition: color 0.3s ease;
}
.footer-links a:hover { color: #fff; }
</style>