<template>
  <div class="flow-architecture">
    <div class="flow-morph-core premium-glass">

      <!-- PHASE 1: Terminal -->
      <div class="ui-phase phase-terminal">
        <div class="terminal-dots">
          <div class="dot close"></div><div class="dot min"></div><div class="dot max"></div>
        </div>
        <div class="terminal-command">
          <span class="prompt">~ %</span>
          <span class="typing-text">npx raya-ui add button</span>
          <span class="cursor blink">_</span>
        </div>
      </div>

      <!-- PHASE 3: Base Component -->
      <div class="ui-phase phase-component cursor-interactive">
        <div class="glimmer-ring"></div>
        <span class="mono-label">PRIMARY_ACTION</span>
      </div>

      <!-- PHASE 4: Customized Card -->
      <div class="ui-phase phase-card">
        <div class="card-hero">
          <div class="wireframe-box"></div>
        </div>
        <div class="card-footer">
          <div class="line-skeleton thick"></div>
          <div class="line-skeleton"></div>
          <div class="action-btn cursor-interactive">DEPLOY</div>
        </div>
      </div>

      <!-- PHASE 5: Application Scale (Massive Grid) -->
      <div class="ui-phase phase-app">
        <div class="app-sidebar">
          <div class="nav-skeleton" v-for="i in 5" :key="i"></div>
        </div>
        <div class="app-main">
          <div class="app-header">
            <span class="mono-label">RAYA // PRODUCTION</span>
            <div class="status-indicator">LIVE_SYNC</div>
          </div>
          <div class="app-grid">
            <div class="app-panel span-2">
              <svg viewBox="0 0 100 50" preserveAspectRatio="none" class="chart-svg">
                <path d="M0,40 Q25,10 50,30 T100,20" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
                <path d="M0,40 Q25,10 50,30 T100,20 L100,50 L0,50 Z" fill="url(#grad)" opacity="0.1"/>
                <defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs>
              </svg>
            </div>
            <div class="app-panel"></div>
            <div class="app-panel"></div>
            <div class="app-panel span-2 flex-row">
              <div class="mini-card" v-for="i in 3" :key="i"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.flow-architecture {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  perspective: 2000px;
}

.flow-morph-core {
  position: absolute;
  display: flex;
  overflow: hidden;
  will-change: width, height, border-radius, transform, opacity;
}

.premium-glass {
  background: linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 100%);
  box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.4),
      inset 0 -1px 1px rgba(255, 255, 255, 0.05),
      0 40px 80px rgba(0, 0, 0, 0.9),
      0 0 150px rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(40px) saturate(140%);
  -webkit-backdrop-filter: blur(40px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.ui-phase { position: absolute; inset: 0; display: flex; visibility: hidden; pointer-events: auto; }
.mono-label { font-family: 'SFMono-Regular', monospace; font-size: 0.75rem; letter-spacing: 0.15em; color: #fff; text-transform: uppercase; }

/* 1. Terminal */
.phase-terminal { align-items: center; padding: 0 2rem; gap: 2rem; }
.terminal-dots { display: flex; gap: 8px; }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.close { background: #ff5f56; } .min { background: #ffbd2e; } .max { background: #27c93f; }
.terminal-command { display: flex; align-items: center; font-family: 'SFMono-Regular', monospace; font-size: 1rem; color: #fff; }
.prompt { color: rgba(255,255,255,0.4); margin-right: 1rem; }
.typing-text { overflow: hidden; white-space: nowrap; display: inline-block; }
.blink { animation: blink 1s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }

/* 3. Component */
.phase-component { align-items: center; justify-content: center; }
.glimmer-ring { position: absolute; inset: 0; border-radius: 32px; border: 1px solid rgba(255,255,255,0.3); animation: pulse-ring 2s infinite; }
@keyframes pulse-ring { 0% { transform: scale(0.95); opacity: 0; } 50% { opacity: 1; } 100% { transform: scale(1.05); opacity: 0; } }

/* 4. Card */
.phase-card { flex-direction: column; padding: 1.5rem; gap: 1.5rem; }
.card-hero { flex: 1; background: rgba(0,0,0,0.3); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1); }
.line-skeleton { height: 4px; width: 60%; background: rgba(255,255,255,0.2); border-radius: 2px; margin-bottom: 0.5rem; }
.line-skeleton.thick { height: 8px; width: 80%; background: rgba(255,255,255,0.6); }
.action-btn { margin-top: 1rem; padding: 1rem; text-align: center; border-radius: 8px; background: rgba(255,255,255,0.1); font-family: 'SFMono-Regular', monospace; font-size: 0.75rem; letter-spacing: 0.1em; }

/* 5. App */
.phase-app { padding: 1rem; gap: 1rem; }
.app-sidebar { width: 80px; border-right: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; gap: 1rem; padding: 1rem 0; }
.nav-skeleton { width: 40px; height: 40px; border-radius: 8px; background: rgba(255,255,255,0.05); margin: 0 auto; }
.app-main { flex: 1; display: flex; flex-direction: column; }
.app-header { display: flex; justify-content: space-between; padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.status-indicator { font-family: 'SFMono-Regular', monospace; font-size: 0.6rem; letter-spacing: 0.1em; color: #27c93f; }
.app-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding: 1rem; height: 100%; }
.app-panel { background: rgba(0,0,0,0.3); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); box-shadow: inset 0 0 20px rgba(0,0,0,0.4); }
.span-2 { grid-column: span 2; }
.chart-svg { width: 100%; height: 100%; padding: 1rem; }
.flex-row { display: flex; gap: 1rem; padding: 1rem; }
.mini-card { flex: 1; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid rgba(255,255,255,0.03); }
</style>