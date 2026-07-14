<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  /** distance between dot centers in pixels */
  gap?: number
  /** base radius of each dot in CSS px */
  radius?: number
  /** dot color (will pulse by alpha) */
  color?: string
  /** optional dot color for dark mode */
  darkColor?: string
  /** shadow/glow color for bright dots */
  glowColor?: string
  /** optional glow color for dark mode */
  darkGlowColor?: string
  /** optional CSS variable name for light dot color (e.g. --color-zinc-900) */
  colorLightVar?: string
  /** optional CSS variable name for dark dot color (e.g. --color-zinc-100) */
  colorDarkVar?: string
  /** optional CSS variable name for light glow color */
  glowColorLightVar?: string
  /** optional CSS variable name for dark glow color */
  glowColorDarkVar?: string
  /** global opacity for the whole layer */
  opacity?: number
  /** background radial fade opacity (0 = transparent background) */
  backgroundOpacity?: number
  /** minimum per-dot speed in rad/s */
  speedMin?: number
  /** maximum per-dot speed in rad/s */
  speedMax?: number
  /** global speed multiplier for all dots */
  speedScale?: number
}

const props = withDefaults(defineProps<Props>(), {
  gap: 12,
  radius: 2,
  color: 'rgba(0,0,0,0.7)',
  glowColor: 'rgba(0, 170, 255, 0.85)',
  opacity: 0.6,
  backgroundOpacity: 0,
  speedMin: 0.4,
  speedMax: 1.3,
  speedScale: 1,
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const resolvedColor = ref<string>(props.color)
const resolvedGlowColor = ref<string>(props.glowColor)

// --- State ---
let dots: { x: number; y: number; phase: number; speed: number }[] = []
let rafId = 0
let stopAnimation = false
let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null

// --- Helpers ---

const resolveCssVariable = (el: Element, variableName?: string): string | null => {
  if (!variableName) return null
  const normalized = variableName.startsWith('--') ? variableName : `--${variableName}`
  const style = getComputedStyle(el)
  const fromEl = style.getPropertyValue(normalized).trim()
  if (fromEl) return fromEl
  const root = document.documentElement
  const fromRoot = getComputedStyle(root).getPropertyValue(normalized).trim()
  return fromRoot || null
}

const detectDarkMode = (): boolean => {
  if (typeof document === 'undefined') return false
  const root = document.documentElement
  if (root.classList.contains('dark')) return true
  if (root.classList.contains('light')) return false
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

const computeColors = () => {
  if (!containerRef.value) return

  const isDark = detectDarkMode()
  let nextColor = props.color
  let nextGlow = props.glowColor

  if (isDark) {
    const varDot = resolveCssVariable(containerRef.value, props.colorDarkVar)
    const varGlow = resolveCssVariable(containerRef.value, props.glowColorDarkVar)
    nextColor = varDot || props.darkColor || nextColor
    nextGlow = varGlow || props.darkGlowColor || nextGlow
  } else {
    const varDot = resolveCssVariable(containerRef.value, props.colorLightVar)
    const varGlow = resolveCssVariable(containerRef.value, props.glowColorLightVar)
    nextColor = varDot || nextColor
    nextGlow = varGlow || nextGlow
  }

  resolvedColor.value = nextColor
  resolvedGlowColor.value = nextGlow
}

// Regenerate dot positions. Called on resize or when gap/speed changes.
const regenDots = () => {
  if (!containerRef.value) return

  const { width, height } = containerRef.value.getBoundingClientRect()
  dots = []

  const cols = Math.ceil(width / props.gap) + 2
  const rows = Math.ceil(height / props.gap) + 2
  const min = Math.min(props.speedMin, props.speedMax)
  const max = Math.max(props.speedMin, props.speedMax)

  for (let i = -1; i < cols; i++) {
    for (let j = -1; j < rows; j++) {
      // offset every other row
      const x = i * props.gap + (j % 2 === 0 ? 0 : props.gap * 0.5)
      const y = j * props.gap
      const phase = Math.random() * Math.PI * 2
      const span = Math.max(max - min, 0)
      const speed = min + Math.random() * span
      dots.push({ x, y, phase, speed })
    }
  }
}

const initCanvas = () => {
  const el = canvasRef.value
  const container = containerRef.value
  if (!el || !container) return

  const ctx = el.getContext('2d')
  if (!ctx) return

  const dpr = Math.max(1, window.devicePixelRatio || 1)

  // Resize handler
  const resize = () => {
    const { width, height } = container.getBoundingClientRect()
    el.width = Math.max(1, Math.floor(width * dpr))
    el.height = Math.max(1, Math.floor(height * dpr))
    el.style.width = `${Math.floor(width)}px`
    el.style.height = `${Math.floor(height)}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    regenDots()
  }

  // Setup Observer
  resizeObserver = new ResizeObserver(() => resize())
  resizeObserver.observe(container)
  resize()

  let last = performance.now()

  const draw = (now: number) => {
    if (stopAnimation) return
    const dt = (now - last) / 1000
    last = now

    // Safety check if element is gone
    if (!el || !container) return
    const { width, height } = el

    ctx.clearRect(0, 0, width, height)
    ctx.globalAlpha = props.opacity

    // Optional background fade
    if (props.backgroundOpacity > 0) {
      // We need client rect for gradient center, or just use canvas dims
      const cw = width / dpr
      const ch = height / dpr

      const grad = ctx.createRadialGradient(
          cw * 0.5,
          ch * 0.4,
          Math.min(cw, ch) * 0.1,
          cw * 0.5,
          ch * 0.5,
          Math.max(cw, ch) * 0.7
      )
      grad.addColorStop(0, 'rgba(0,0,0,0)')
      grad.addColorStop(1, `rgba(0,0,0,${Math.min(Math.max(props.backgroundOpacity, 0), 1)})`)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, cw, ch)
    }

    // Animate dots
    ctx.save()
    ctx.fillStyle = resolvedColor.value

    const time = (now / 1000) * Math.max(props.speedScale, 0)

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i]
      const mod = (time * d.speed + d.phase) % 2
      const lin = mod < 1 ? mod : 2 - mod
      const a = 0.25 + 0.55 * lin

      if (a > 0.6) {
        const glow = (a - 0.6) / 0.4
        ctx.shadowColor = resolvedGlowColor.value
        ctx.shadowBlur = 6 * glow
      } else {
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
      }

      ctx.globalAlpha = a * props.opacity
      ctx.beginPath()
      ctx.arc(d.x, d.y, props.radius, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
    rafId = requestAnimationFrame(draw)
  }

  rafId = requestAnimationFrame(draw)
}

// --- Watchers ---

watch(
    () => [props.color, props.darkColor, props.glowColor, props.darkGlowColor, props.colorLightVar, props.colorDarkVar],
    computeColors
)

// Re-generate grid when structural props change
watch(
    () => [props.gap, props.speedMin, props.speedMax],
    () => {
      regenDots()
    }
)

// --- Lifecycle ---

onMounted(() => {
  computeColors()
  initCanvas()

  mutationObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'attributes' && (m.attributeName === 'class' || m.attributeName === 'style')) {
        computeColors()
      }
    }
  })
  mutationObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'style'],
  })
})

onBeforeUnmount(() => {
  stopAnimation = true
  cancelAnimationFrame(rafId)
  if (resizeObserver) resizeObserver.disconnect()
  if (mutationObserver) mutationObserver.disconnect()
})
</script>

<template>
  <div
      ref="containerRef"
      :class="cn('absolute inset-0 z-0', props.class)"
  >
    <canvas
        ref="canvasRef"
        class="block h-full w-full"
    />
    <slot />
  </div>
</template>