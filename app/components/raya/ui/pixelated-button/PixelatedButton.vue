<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  class?: string
  hue?: number
  label?: string
  subLabel?: string
  showParticles?: boolean
  scale?: number
}>(), {
  hue: 350,
  label: 'START',
  subLabel: 'GAME',
  showParticles: true,
  scale: 1
})

const emit = defineEmits(['click'])

// Dynamic style variables for the CSS
const styleVars = computed(() => {
  return {
    '--theme-hue': props.hue,
    '--theme-primary': `hsl(${props.hue}, 90%, 60%)`,
    '--theme-dark': `hsl(${props.hue}, 90%, 40%)`,
    '--theme-shadow': `hsl(${props.hue}, 50%, 30%)`,
    '--btn-scale': props.scale
  } as any
})
</script>

<template>
  <div class="pixel-button-wrapper" :style="styleVars">

    <div v-if="showParticles" class="floating-particles">
      <div v-for="n in 6" :key="n" :class="`particle particle-${n}`"></div>
    </div>

    <button
        :class="cn('pixel-game-button', props.class)"
        @click="emit('click', $event)"
    >
      <div class="bg-effect-1"></div>
      <div class="bg-effect-2"></div>
      <div class="scanlines"></div>

      <div class="button-content">

        <div class="icon-group left">
          <slot name="icon-left">
            <svg class="main-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-4-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm0-9V4H8v3.5l4 4 4-4z"></path>
            </svg>
            <svg class="accent-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          </slot>
        </div>

        <span class="button-text">
          <span class="text-main">
            <slot>{{ label }}</slot>
          </span>
          <span class="text-sub">
            <slot name="subtitle">{{ subLabel }}</slot>
          </span>
        </span>

        <div class="icon-group right">
          <slot name="icon-right">
            <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"></path>
            </svg>
            <svg class="accent-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14h6.5L8 22l10-12h-6.5L13 2z"></path>
            </svg>
          </slot>
        </div>
      </div>

      <div class="corner corner-tl"></div>
      <div class="corner corner-tr"></div>
      <div class="corner corner-bl"></div>
      <div class="corner corner-br"></div>

      <div class="edge-glow"></div>
      <div class="highlight-sweep"></div>
      <div class="shadow-3d"></div>
    </button>

    <div class="ground-reflection"></div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Press+Start+2P&display=swap');

.pixel-button-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* Allows the wrapper to size itself to the button + scaling */
  width: max-content;
  height: max-content;
  perspective: 1200px;
  overflow: visible;
  /* Apply Scale Prop */
  transform: scale(var(--btn-scale));
  /* Ensure margin for scaling if needed, or let parent handle layout */
  margin: calc(var(--btn-scale) * 10px);
}

/* --- Particles --- */
.floating-particles {
  position: absolute;
  inset: -50px; /* Extend particles area */
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--theme-primary);
  border-radius: 50px;
  box-shadow: 0 0 10px var(--theme-primary);
  animation: float-particle 8s infinite ease-in-out;
}

.particle-1 { top: 20%; left: 10%; animation-delay: 0s; }
.particle-2 { top: 60%; left: 85%; animation-delay: 1s; }
.particle-3 { top: 30%; left: 70%; animation-delay: 2s; }
.particle-4 { top: 80%; left: 20%; animation-delay: 3s; }
.particle-5 { top: 10%; left: 50%; animation-delay: 4s; }
.particle-6 { top: 70%; left: 40%; animation-delay: 5s; }

/* --- Main Button --- */
.pixel-game-button {
  position: relative;
  width: 280px;
  height: 90px;
  background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-dark) 100%);
  border: 4px solid #000;
  border-radius: 0;
  cursor: pointer;
  font-family: "Orbitron", "Press Start 2P", monospace;
  color: #fff;
  text-transform: uppercase;
  outline: none;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: all 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 10;

  box-shadow:
      0 0 0 2px var(--theme-primary),
      0 0 0 4px #000,
      0 8px 0 var(--theme-shadow),
      0 12px 0 #000,
      0 16px 20px rgba(0, 0, 0, 0.4),
      0 0 30px var(--theme-primary),
      inset 0 2px 4px rgba(255, 255, 255, 0.2),
      inset 0 -2px 4px rgba(0, 0, 0, 0.2);

  clip-path: polygon(
      0px 8px, 8px 0px, 272px 0px, 280px 8px,
      280px 82px, 272px 90px, 8px 90px, 0px 82px
  );

  animation: button-idle 4s ease-in-out infinite;
}

/* --- Content --- */
.button-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 20px;
  z-index: 5;
  transform: translateZ(20px);
}

.icon-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.main-icon, .play-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
  filter: drop-shadow(2px 2px 0 rgba(0, 0, 0, 0.5));
  transition: all 300ms ease;
}

.play-icon { width: 16px; height: 16px; }

.accent-icon {
  width: 12px;
  height: 12px;
  fill: currentColor;
  opacity: 0.7;
  animation: icon-twinkle 2s ease-in-out infinite;
}

.button-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 900;
  text-shadow: 2px 2px 0 #000, 4px 4px 0 rgba(0, 0, 0, 0.3);
  line-height: 1;
}

.text-main { font-size: 18px; letter-spacing: 3px; }
.text-sub { font-size: 12px; letter-spacing: 2px; opacity: 0.9; margin-top: 2px; }

/* --- Background Effects --- */
.bg-effect-1 {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(45deg, transparent 48%, rgba(255, 255, 255, 0.1) 50%, transparent 52%);
  background-size: 20px 20px;
  animation: bg-shift 3s linear infinite;
  z-index: 1;
}

.bg-effect-2 {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle at 84px 27px, rgba(255, 255, 255, 0.1) 0%, transparent 140px);
  animation: bg-pulse 2s ease-in-out infinite alternate;
  z-index: 1;
}

.scanlines {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 3px);
  z-index: 2;
  pointer-events: none;
}

/* --- Corners --- */
.corner {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #000;
  z-index: 6;
}
.corner-tl { top: -4px; left: -4px; }
.corner-tr { top: -4px; right: -4px; }
.corner-bl { bottom: -4px; left: -4px; }
.corner-br { bottom: -4px; right: -4px; }

/* --- Highlights & Shadows --- */
.edge-glow {
  position: absolute;
  top: -2px; left: -2px; right: -2px; bottom: -2px;
  background: linear-gradient(45deg, var(--theme-primary), #ffffff, var(--theme-primary));
  background-size: 200% 200%;
  animation: rainbow-glow 3s ease infinite;
  opacity: 0;
  transition: opacity 300ms ease;
  z-index: -1;
  clip-path: polygon(0px 8px, 8px 0px, 276px 0px, 284px 8px, 284px 86px, 276px 94px, 8px 94px, 0px 86px);
}

.highlight-sweep {
  position: absolute;
  top: 0; left: -140px; width: 140px; height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.2) 80%, transparent 100%);
  transform: skewX(-20deg);
  z-index: 4;
  transition: left 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  pointer-events: none;
}

.shadow-3d {
  position: absolute;
  bottom: -16px; left: 8px; right: 8px; height: 16px;
  background: linear-gradient(135deg, var(--theme-shadow) 0%, #000 100%);
  transform: skewX(-45deg);
  filter: blur(2px);
  z-index: -2;
  transition: all 300ms ease;
  clip-path: polygon(27px 0px, 245px 0px, 264px 16px, 0px 16px);
}

.ground-reflection {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%) scaleY(-0.3) rotateX(45deg);
  width: 300px;
  height: 90px;
  background: linear-gradient(135deg, var(--theme-primary) 0%, transparent 100%);
  filter: blur(8px);
  opacity: 0.3;
  z-index: 1;
  pointer-events: none;
}

/* --- Interactive States --- */
.pixel-game-button:hover {
  transform: translateY(-6px) rotateX(10deg) scale(1.03);
  box-shadow:
      0 0 0 2px var(--theme-primary),
      0 0 0 4px #000,
      0 12px 0 var(--theme-shadow),
      0 16px 0 #000,
      0 20px 30px rgba(0,0,0,0.5),
      0 0 50px var(--theme-primary),
      inset 0 2px 6px rgba(255,255,255,0.3),
      inset 0 -2px 6px rgba(0,0,0,0.2);
  animation: button-hover 1s ease-in-out infinite;
}

.pixel-game-button:hover .edge-glow { opacity: 1; }
.pixel-game-button:hover .highlight-sweep { left: 200%; }
.pixel-game-button:hover .main-icon { transform: scale(1.1) rotate(5deg); }
.pixel-game-button:hover .play-icon { transform: scale(1.2) translateX(2px); }
.pixel-game-button:hover .text-main { animation: text-glow 500ms ease-in-out; }
.pixel-game-button:hover .shadow-3d { bottom: -20px; filter: blur(4px); opacity: 0.8; }

.pixel-game-button:active {
  transform: translateY(2px) rotateX(5deg) scale(0.98);
  box-shadow:
      0 0 0 2px var(--theme-shadow),
      0 0 0 4px #000,
      0 4px 0 #000,
      0 6px 0 #000,
      0 8px 15px rgba(0,0,0,0.6),
      inset 0 2px 8px rgba(0,0,0,0.4),
      inset 0 -1px 4px rgba(255,255,255,0.1);
}

.pixel-game-button:active .shadow-3d { bottom: -8px; height: 8px; opacity: 0.5; }

/* --- Keyframes --- */
@keyframes button-idle {
  0%, 100% { filter: brightness(1) contrast(1); }
  50% { filter: brightness(1.05) contrast(1.1); }
}
@keyframes button-hover {
  0%, 100% { filter: brightness(1.1) saturate(1.2); }
  50% { filter: brightness(1.2) saturate(1.4); }
}
@keyframes float-particle {
  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
  50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
}
@keyframes icon-twinkle {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}
@keyframes bg-shift {
  0% { background-position: 0px 0px; }
  100% { background-position: 20px 20px; }
}
@keyframes bg-pulse {
  0% { opacity: 0.3; }
  100% { opacity: 0.7; }
}
@keyframes rainbow-glow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes text-glow {
  0%, 100% { text-shadow: 2px 2px 0 #000, 4px 4px 0 rgba(0,0,0,0.3); }
  50% { text-shadow: 2px 2px 0 #000, 0 0 20px rgba(255,255,255,0.8); }
}
</style>