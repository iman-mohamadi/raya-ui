<template>
  <div class="morphing-architecture">
    <div class="morph-core premium-glass">

      <div class="ui-layer ui-phase-button">
        <div class="status-dot primary-glow pulsing"></div>
        <span class="mono-label">SYS.CORE // WAKE</span>
      </div>

      <div class="ui-layer ui-phase-card">
        <div class="card-header">
          <span class="mono-label">DATA.STREAM_01</span>
          <span class="mono-value stat-number">84.992%</span>
        </div>
        <svg class="data-wave-svg" viewBox="0 0 400 100" preserveAspectRatio="none">
          <path d="M0,50 C40,90 80,10 120,50 C160,90 200,10 240,50 C280,90 320,10 360,50 C400,90 400,90 400,90" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="4" />

          <path class="anim-path wave-path" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" d="M0,50 C40,90 80,10 120,50 C160,90 200,10 240,50 C280,90 320,10 360,50 C400,90 400,90 400,90" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="3" />
        </svg>
      </div>

      <div class="ui-layer ui-phase-os">

        <div class="os-sidebar">
          <div class="nav-node active-node"><div class="node-dot primary-glow"></div></div>
          <div class="nav-node"></div>
          <div class="nav-node"></div>
          <div class="nav-node"></div>
        </div>

        <div class="os-main-content">
          <div class="os-toolbar">
            <div class="window-controls">
              <div class="os-dot close"></div><div class="os-dot min"></div><div class="os-dot max"></div>
            </div>
            <div class="mono-label tracking-wide text-center">RAYA UI // DIGITAL MATTER OS</div>
            <div class="network-status primary-text mono-label">● LIVE_SYNC</div>
          </div>

          <div class="os-grid">

            <div class="os-panel data-radial">
              <svg class="radial-svg" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" stroke-dasharray="4 4" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
                <circle class="anim-ring primary-ring" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" cx="100" cy="100" r="70" fill="none" stroke="var(--primary, #00e5ff)" stroke-width="4" transform="rotate(-90 100 100)" style="filter: drop-shadow(0 0 4px var(--primary, #00e5ff))"/>
                <circle class="anim-ring secondary-ring" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" cx="100" cy="100" r="50" fill="none" stroke="var(--accent, #a855f7)" stroke-width="2" transform="rotate(180 100 100)" />
              </svg>
              <div class="radial-center-data">
                <span class="massive-number primary-text">92</span>
                <span class="mono-label">CORE_OPT</span>
              </div>
            </div>

            <div class="os-panel node-graph">
              <span class="panel-title mono-label">GEOMETRY_NODES</span>
              <svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%;">
                <path class="anim-path node-line" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" d="M20,130 L80,50 L160,100 L230,30 L280,80" fill="none" stroke="var(--accent, #a855f7)" stroke-width="1.5" />
                <circle class="node-point primary-glow-svg" cx="20" cy="130" r="4" fill="#fff"/>
                <circle class="node-point primary-glow-svg" cx="80" cy="50" r="4" fill="#fff"/>
                <circle class="node-point primary-glow-svg" cx="160" cy="100" r="4" fill="#fff"/>
                <circle class="node-point primary-glow-svg" cx="230" cy="30" r="4" fill="#fff"/>
                <circle class="node-point primary-glow-svg" cx="280" cy="80" r="4" fill="#fff"/>
              </svg>
            </div>

            <div class="os-panel system-logs">
              <span class="panel-title mono-label">TERMINAL.OUTPUT</span>
              <div class="log-container">
                <div class="log-line anim-log"><span class="primary-text">[SYS_OK]</span> Booting spatial architecture...</div>
                <div class="log-line anim-log"><span class="primary-text">[SYS_OK]</span> Compiling component arrays...</div>
                <div class="log-line anim-log"><span class="primary-text">[SYS_OK]</span> Injecting kinetic geometry...</div>
                <div class="log-line anim-log"><span class="accent-text">[WARN]</span> Overriding static limits...</div>
                <div class="log-line anim-log"><span class="primary-text">[LIVE]</span> The interface is alive.</div>
              </div>
            </div>

            <div class="os-panel server-load">
              <div class="server-header">
                <span class="mono-label">MEMORY_ALLOCATION</span>
                <span class="mono-label primary-text">14.2 GB/s</span>
              </div>
              <div class="bar-chart">
                <div v-for="i in 36" :key="i" class="load-bar anim-bar"></div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.morphing-architecture {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  perspective: 1500px;
}

.morph-core {
  position: absolute;
  display: flex;
  overflow: hidden;
  will-change: width, height, border-radius, transform;
}

.premium-glass {
  background: linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%);
  box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.3),
      inset 0 -1px 1px rgba(255, 255, 255, 0.05),
      0 40px 80px rgba(0, 0, 0, 0.8),
      0 0 120px rgba(var(--primary-rgb, 0, 229, 255), 0.05);
  backdrop-filter: blur(40px) saturate(150%);
  -webkit-backdrop-filter: blur(40px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.primary-text { color: var(--primary, #00e5ff); }
.accent-text { color: var(--accent, #a855f7); }

.primary-glow {
  background: var(--primary, #00e5ff);
  box-shadow: 0 0 15px var(--primary, #00e5ff);
}
.primary-glow-svg {
  fill: var(--primary, #00e5ff);
  filter: drop-shadow(0 0 4px var(--primary, #00e5ff));
}

.mono-label {
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.6);
  text-transform: uppercase;
}
.panel-title { position: absolute; top: 1rem; left: 1rem; font-size: 0.65rem; opacity: 0.5; }

/* NOTE: CSS transitions are REMOVED here so GSAP scrub has 100% control */
.node-point { opacity: 0; transform: scale(0); transform-origin: center; }

/* Layers */
.ui-layer { position: absolute; inset: 0; opacity: 0; display: flex; visibility: hidden; }

/* STATE 1 */
.ui-phase-button { align-items: center; justify-content: center; gap: 1rem; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; }
.pulsing { animation: pulse 2s infinite ease-in-out; }
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

/* STATE 2 */
.ui-phase-card { flex-direction: column; padding: 2.5rem; justify-content: space-between; }
.card-header { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem; }
.mono-value { font-family: 'SFMono-Regular', Consolas, monospace; font-size: 1.5rem; font-weight: 300; }
.data-wave-svg { width: 100%; height: 65%; margin-top: 1.5rem; }

/* STATE 3 */
.ui-phase-os { display: flex; flex-direction: row; }
.os-sidebar { width: 70px; border-right: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; align-items: center; padding: 1.5rem 0; gap: 1.5rem; background: rgba(0,0,0,0.2); }
.nav-node { width: 24px; height: 24px; border-radius: 6px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; }
.nav-node.active-node { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); }
.node-dot { width: 6px; height: 6px; border-radius: 50%; }

.os-main-content { flex-grow: 1; display: flex; flex-direction: column; padding: 1.5rem; }
.os-toolbar { display: grid; grid-template-columns: 1fr 2fr 1fr; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.window-controls { display: flex; gap: 8px; }
.network-status { text-align: right; }
.os-dot { width: 12px; height: 12px; border-radius: 50%; }
.os-dot.close { background: #ff5f56; }
.os-dot.min { background: #ffbd2e; }
.os-dot.max { background: #27c93f; }

.os-grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr auto; gap: 1.5rem; height: 100%; margin-top: 1.5rem; }
.os-panel { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; position: relative; overflow: hidden; box-shadow: inset 0 0 20px rgba(0,0,0,0.5); }

.data-radial { grid-row: 1 / 3; display: flex; align-items: center; justify-content: center; }
.radial-svg { width: 85%; height: 85%; }
.radial-center-data { position: absolute; display: flex; flex-direction: column; align-items: center; }
.massive-number { font-family: 'Inter', sans-serif; font-size: 5rem; font-weight: 200; line-height: 1; }

.node-graph { grid-column: 2; grid-row: 1; padding: 2.5rem 1.5rem 1rem 1.5rem; display: flex; align-items: center; justify-content: center; }

.system-logs { grid-column: 2; grid-row: 2; padding: 2.5rem 1.5rem 1.5rem 1.5rem; font-family: 'SFMono-Regular', monospace; font-size: 0.75rem; color: rgba(255,255,255,0.4); }
.log-container { display: flex; flex-direction: column; gap: 0.5rem; }

.server-load { grid-column: 1 / -1; grid-row: 3; height: 120px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; }
.server-header { display: flex; justify-content: space-between; }
.bar-chart { display: flex; gap: 4px; height: 60px; align-items: flex-end; }
.load-bar { flex: 1; background: var(--primary, #00e5ff); opacity: 0.4; border-radius: 2px 2px 0 0; transform-origin: bottom; transform: scaleY(0); }
</style>