<template>
  <div class="worlds-track" ref="trackRef">

    <div class="world-container world-fintech">
      <h2 class="world-title-bg">MONEY<br>IN MOTION.</h2>

      <div class="glass-architecture">
        <div class="glass-panel main-panel">
          <div class="panel-header">
            <span class="mono-label">GLOBAL_MARKETS // ETH</span>
            <span class="primary-text mono-label">+12.4%</span>
          </div>
          <div class="fintech-chart">
            <svg viewBox="0 0 400 150" preserveAspectRatio="none">
              <path d="M0,30 L400,30 M0,75 L400,75 M0,120 L400,120" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4 4" fill="none"/>
              <rect class="anim-path" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" x="50" y="40" width="4" height="60" fill="none" stroke="var(--primary)" stroke-width="4" />
              <rect class="anim-path" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" x="150" y="80" width="4" height="40" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="4" />
              <rect class="anim-path" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" x="250" y="20" width="4" height="90" fill="none" stroke="var(--primary)" stroke-width="4" />
              <rect class="anim-path" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" x="350" y="60" width="4" height="50" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="4" />
              <path class="anim-path" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" d="M0,100 L50,70 L150,100 L250,65 L350,85 L400,40" fill="none" stroke="var(--primary)" stroke-width="2" style="filter: drop-shadow(0 0 8px var(--primary))"/>
            </svg>
          </div>
        </div>
        <div class="glass-panel floating-card cursor-interactive">
          <span class="mono-label">EXECUTE_TRADE</span>
          <div class="arrow-icon">→</div>
        </div>
      </div>
    </div>

    <div class="world-container world-ai">
      <h2 class="world-title-bg text-right">INTERFACES<br>THAT THINK.</h2>

      <div class="glass-architecture ai-layout">
        <div class="glass-panel neural-panel">
          <span class="mono-label">NEURAL_NET_V4</span>
          <svg viewBox="0 0 200 200" class="neural-svg">
            <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
            <path class="anim-path" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" d="M100,20 Q150,100 100,180 Q50,100 100,20" fill="none" stroke="var(--primary)" stroke-width="1.5" />
            <path class="anim-path" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" d="M20,100 Q100,50 180,100 Q100,150 20,100" fill="none" stroke="var(--primary)" stroke-width="1.5" />
            <circle class="core-node" cx="100" cy="100" r="6" fill="var(--primary)" style="filter: drop-shadow(0 0 10px var(--primary))"/>
          </svg>
        </div>
        <div class="glass-panel prompt-bar cursor-interactive">
          <div class="pulse-dot primary-glow"></div>
          <span class="mono-label">Generating spatial environments...</span>
        </div>
      </div>
    </div>

    <div class="world-container world-analytics">
      <h2 class="world-title-bg">DATA BECOMES<br>SPATIAL.</h2>

      <div class="glass-architecture analytics-layout">
        <div class="glass-panel massive-data">
          <div class="data-grid">
            <div class="data-cell" v-for="i in 12" :key="i">
              <span class="mono-label opacity-40">VOL_{{i}}</span>
              <span class="mono-value">{{ (Math.random() * 100).toFixed(1) }}K</span>
            </div>
          </div>
          <svg viewBox="0 0 400 100" class="topo-lines" preserveAspectRatio="none">
            <path class="anim-path" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" d="M0,80 C100,80 150,20 250,20 C350,20 380,60 400,60" fill="none" stroke="var(--primary)" stroke-width="2"/>
            <path class="anim-path delay-1" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" d="M0,90 C120,90 140,40 260,40 C340,40 370,70 400,70" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
          </svg>
        </div>
      </div>
    </div>

    <div class="world-container world-commerce">
      <h2 class="world-title-bg text-center luxury-type">LUXURY THROUGH<br>INTERACTION.</h2>

      <div class="glass-architecture commerce-layout">
        <div class="glass-panel editorial-frame">
          <div class="image-placeholder">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <path class="anim-path" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" d="M0,0 L100,100 M100,0 L0,100" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
            </svg>
          </div>
          <div class="editorial-meta">
            <span class="serif-title">OBSIDIAN V.01</span>
            <span class="mono-label">USD 1,200</span>
          </div>
        </div>
        <div class="glass-panel cart-btn cursor-interactive">
          <span class="mono-label">ADD TO ARCHIVE</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.worlds-track {
  position: absolute;
  top: 0;
  left: 0;
  width: 400vw; /* 4 Worlds */
  height: 100vh;
  display: flex;
  will-change: transform;
}

.world-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* --- TYPOGRAPHY --- */
.world-title-bg {
  position: absolute;
  font-family: 'Helvetica Neue', 'Inter', sans-serif;
  font-size: clamp(6rem, 15vw, 20rem);
  font-weight: 200;
  line-height: 0.85;
  letter-spacing: -0.04em;
  color: rgba(255, 255, 255, 0.03); /* Massive ghost text in background */
  white-space: nowrap;
  z-index: 1;
  will-change: transform;
}

.luxury-type {
  font-family: 'Times New Roman', serif; /* Or any premium serif you load */
  font-style: italic;
  font-weight: 300;
}

.text-right { right: -5vw; text-align: right; }
.text-center { left: 50%; transform: translateX(-50%); text-align: center; }

.mono-label {
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.6);
  text-transform: uppercase;
}

.primary-text { color: var(--primary); transition: color 0.5s ease; }
.opacity-40 { opacity: 0.4; }

/* --- PREMIUM GLASS ARCHITECTURE --- */
.glass-architecture {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  perspective: 2000px;
}

.glass-panel {
  position: absolute;
  background: linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%);
  box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.3),
      inset 0 -1px 1px rgba(255, 255, 255, 0.05),
      0 40px 80px rgba(0, 0, 0, 0.8),
      0 0 120px rgba(var(--primary-rgb), 0.05); /* Uses dynamic color */
  backdrop-filter: blur(40px) saturate(150%);
  -webkit-backdrop-filter: blur(40px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
}

/* World 1: Fintech */
.main-panel { top: 25%; left: 10vw; width: 45vw; height: 50vh; padding: 2rem; justify-content: space-between; }
.panel-header { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem; }
.fintech-chart { width: 100%; height: 70%; margin-top: 2rem; }
.floating-card { bottom: 15%; right: 20vw; padding: 1.5rem 2.5rem; border-radius: 100px; display: flex; flex-direction: row; align-items: center; gap: 1rem; }

/* World 2: AI */
.ai-layout .neural-panel { top: 15%; right: 15vw; width: 35vw; height: 60vh; align-items: center; justify-content: center; border-radius: 40px; }
.neural-svg { width: 80%; height: 80%; }
.ai-layout .prompt-bar { bottom: 20%; left: 15vw; padding: 1.5rem 3rem; border-radius: 16px; display: flex; flex-direction: row; align-items: center; gap: 1.5rem; width: 40vw; }
.pulse-dot { width: 12px; height: 12px; border-radius: 50%; }

/* World 3: Analytics */
.analytics-layout .massive-data { top: 20%; left: 15vw; width: 70vw; height: 60vh; padding: 3rem; }
.data-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; height: 60%; }
.data-cell { display: flex; flex-direction: column; gap: 0.5rem; border-left: 1px solid rgba(255,255,255,0.1); padding-left: 1rem; }
.mono-value { font-family: 'SFMono-Regular', monospace; font-size: 2rem; color: #fff; }
.topo-lines { width: 100%; height: 30%; margin-top: 2rem; }

/* World 4: Commerce */
.commerce-layout .editorial-frame { top: 15%; left: 50%; transform: translateX(-50%); width: 30vw; height: 70vh; padding: 1rem; border-radius: 8px; }
.image-placeholder { width: 100%; height: 80%; background: rgba(0,0,0,0.4); border-radius: 4px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.editorial-meta { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 1rem 0 1rem; }
.serif-title { font-family: 'Times New Roman', serif; font-size: 1.25rem; letter-spacing: 0.05em; }
.commerce-layout .cart-btn { bottom: 10%; left: 50%; transform: translateX(-50%); padding: 1.5rem 4rem; border-radius: 100px; background: rgba(255,255,255,0.1); }

/* SVG Utilities */
.anim-path { transition: stroke 0.5s ease; } /* Allows color shift as worlds change */
.primary-glow { background: var(--primary); box-shadow: 0 0 15px var(--primary); transition: background 0.5s ease, box-shadow 0.5s ease; }
</style>