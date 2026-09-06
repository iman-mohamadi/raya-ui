<template>
  <div
      ref="rootEl"
      class="liquid-glass"
      :class="[props.containerClass]"
      :style="rootStyle"
  >
    <div class="liquid-glass__content" :class="props.class">
      <slot />
    </div>

    <svg class="liquid-glass__defs" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter
            v-if="maps"
            :id="filterId"
            color-interpolation-filters="sRGB"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            :width="maps.width"
            :height="maps.height"
        >
          <!-- Soften the backdrop before refracting it, so the bezel doesn't smear. -->
          <feGaussianBlur in="SourceGraphic" :stdDeviation="props.blur" result="source" />

          <!-- The refraction vector field, baked from the surface profile. -->
          <feImage
              :href="maps.displacement"
              x="0"
              y="0"
              :width="maps.width"
              :height="maps.height"
              result="displacement"
          />

          <!-- No dispersion: a single displacement pass is enough. -->
          <template v-if="props.aberration === 0">
            <feDisplacementMap
                in="source"
                in2="displacement"
                :scale="channelScale(0)"
                xChannelSelector="R"
                yChannelSelector="G"
                result="refracted"
            />
          </template>

          <!-- Dispersion: refract each channel at its own index, then recombine. -->
          <template v-else>
            <feDisplacementMap
                in="source"
                in2="displacement"
                :scale="channelScale(-1)"
                xChannelSelector="R"
                yChannelSelector="G"
                result="dispR"
            />
            <feColorMatrix
                in="dispR"
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="chR"
            />
            <feDisplacementMap
                in="source"
                in2="displacement"
                :scale="channelScale(0)"
                xChannelSelector="R"
                yChannelSelector="G"
                result="dispG"
            />
            <feColorMatrix
                in="dispG"
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="chG"
            />
            <feDisplacementMap
                in="source"
                in2="displacement"
                :scale="channelScale(1)"
                xChannelSelector="R"
                yChannelSelector="G"
                result="dispB"
            />
            <feColorMatrix
                in="dispB"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="chB"
            />
            <feBlend in="chR" in2="chG" mode="screen" result="chRG" />
            <feBlend in="chRG" in2="chB" mode="screen" result="refracted" />
          </template>

          <!-- Rim light, screened over the refracted backdrop. -->
          <feImage
              :href="maps.specular"
              x="0"
              y="0"
              :width="maps.width"
              :height="maps.height"
              result="specular"
          />
          <feBlend in="refracted" in2="specular" mode="screen" />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, type HTMLAttributes, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'

/**
 * Apple-style Liquid Glass, built the way kube.io describes it:
 * trace refraction through a curved bezel with Snell's law, bake the resulting
 * vector field into an RGB image, and hand that image to <feDisplacementMap />
 * as a `backdrop-filter`.
 *
 * Chromium only — no other engine accepts an SVG filter in `backdrop-filter`.
 */

export type GlassSurface = 'convexCircle' | 'convexSquircle' | 'concave' | 'lip'

interface Props {
  /** Cross-section profile of the bezel. Apple's look is closest to a squircle. */
  surface?: GlassSurface
  /** Corner radius of the panel, in px. */
  radius?: number
  /** Width of the curved bezel measured inward from the border, in px. */
  bezelWidth?: number
  /** Height of the glass at the end of the bezel, in px. Drives how far rays travel. */
  thickness?: number
  /** Refractive index of the glass. 1 is air (no bending), 1.5 is window glass. */
  refractiveIndex?: number
  /** Artistic multiplier on the physical displacement. 1 keeps the simulation honest. */
  refraction?: number
  /** Chromatic dispersion: per-channel spread of the refraction, as a ratio. 0 disables it. */
  aberration?: number
  /** Backdrop blur applied before refraction, in px. */
  blur?: number
  /** Brightness of the specular rim, 0–1. */
  specularOpacity?: number
  /** Tightness of the rim highlight. Higher values give a shorter, sharper glint. */
  specularSharpness?: number
  /** Direction the light comes from, in degrees. */
  specularAngle?: number
  /** Opacity of the frosted tint filling the panel, 0–1. */
  frost?: number
  class?: HTMLAttributes['class']
  containerClass?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  surface: 'convexSquircle',
  radius: 24,
  bezelWidth: 24,
  thickness: 40,
  refractiveIndex: 1.5,
  refraction: 1,
  aberration: 0,
  blur: 2,
  specularOpacity: 0.4,
  specularSharpness: 6,
  specularAngle: -60,
  frost: 0.05,
})

/**
 * An 8-bit channel holds 256 values with 128 as neutral, so a displacement map
 * can express at most 127 distinct magnitudes per direction. Sampling the
 * radius any finer than that would be thrown away by the encoding.
 */
const PROFILE_SAMPLES = 128

const smootherstep = (x: number) => x * x * x * (x * (x * 6 - 15) + 10)

/**
 * Height of the glass at `x`, where 0 is the outer edge and 1 is the end of the
 * bezel. Every profile returns 0 at the edge and lands flat on the interior.
 */
const SURFACES: Record<GlassSurface, (x: number) => number> = {
  convexCircle: (x) => Math.sqrt(1 - (1 - x) ** 2),
  convexSquircle: (x) => (1 - (1 - x) ** 4) ** 0.25,
  concave: (x) => 1 - Math.sqrt(1 - (1 - x) ** 2),
  lip: (x) => {
    const convex = Math.sqrt(1 - (1 - x) ** 2)
    const concave = 1 - convex
    const t = smootherstep(x)
    return convex * (1 - t) + concave * t
  },
}

interface Profile {
  /** Signed lateral displacement in px, indexed by distance from the border. */
  magnitudes: Float64Array
  /** Surface slope at each sample, used for the rim light. */
  slopes: Float64Array
  /** Largest absolute displacement, reused as the filter's `scale`. */
  maximum: number
}

/**
 * Walk one radius of the bezel and refract a single ray per sample.
 *
 * Every incident ray is orthogonal to the background, so the angle of incidence
 * is just the surface tilt. Snell's law gives the refracted angle, and the ray
 * then crosses `height` px of glass before landing on the background — so the
 * lateral shift is `height * tan(incidence - refracted)`.
 */
function buildProfile(surface: GlassSurface, bezelWidth: number, thickness: number, index: number): Profile {
  const f = SURFACES[surface]
  const magnitudes = new Float64Array(PROFILE_SAMPLES)
  const slopes = new Float64Array(PROFILE_SAMPLES)
  const delta = 0.001
  // Aspect of the bezel in real px, so the slope is a physical gradient.
  const aspect = thickness / Math.max(bezelWidth, 0.001)
  let maximum = 0

  for (let i = 0; i < PROFILE_SAMPLES; i++) {
    const x = i / (PROFILE_SAMPLES - 1)
    const lo = Math.max(0, x - delta)
    const hi = Math.min(1, x + delta)
    const slope = ((f(hi) - f(lo)) / (hi - lo)) * aspect

    const incidence = Math.atan(Math.abs(slope))
    // sin(refracted) can't exceed 1 here because index >= 1, but clamp anyway.
    const refracted = Math.asin(Math.min(1, Math.sin(incidence) / Math.max(index, 1)))
    const height = f(x) * thickness

    // Positive slope (convex) bends the ray inward; negative slope pushes it out.
    const magnitude = Math.sign(slope) * height * Math.tan(incidence - refracted)

    magnitudes[i] = magnitude
    slopes[i] = slope
    maximum = Math.max(maximum, Math.abs(magnitude))
  }

  return { magnitudes, slopes, maximum }
}

interface Maps {
  displacement: string
  specular: string
  width: number
  height: number
  scale: number
}

/**
 * Rasterise the vector field into two PNGs: the displacement map (R = x, G = y,
 * 128 neutral) and the specular rim.
 *
 * The magnitude only depends on the distance to the border, so we rotate the
 * pre-computed radius around the shape: a rounded-rect signed distance field
 * gives both that distance and the outward normal to point the vector along.
 */
function buildMaps(width: number, height: number, profile: Profile, opts: {
  radius: number
  bezelWidth: number
  specularOpacity: number
  specularSharpness: number
  specularAngle: number
}): Maps | null {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const specCanvas = document.createElement('canvas')
  specCanvas.width = width
  specCanvas.height = height
  const specCtx = specCanvas.getContext('2d')
  if (!specCtx) return null

  const displacement = ctx.createImageData(width, height)
  const specular = specCtx.createImageData(width, height)

  const halfW = width / 2
  const halfH = height / 2
  const radius = Math.max(0, Math.min(opts.radius, Math.min(halfW, halfH)))
  const bezel = Math.max(1, Math.min(opts.bezelWidth, Math.min(halfW, halfH)))
  const maximum = profile.maximum || 1

  const light = (opts.specularAngle * Math.PI) / 180
  const lightX = Math.cos(light)
  const lightY = Math.sin(light)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const px = x + 0.5 - halfW
      const py = y + 0.5 - halfH

      // Rounded-rect SDF, plus the outward normal at that point.
      const qx = Math.abs(px) - halfW + radius
      const qy = Math.abs(py) - halfH + radius
      let signed: number
      let normalX: number
      let normalY: number

      if (qx > 0 && qy > 0) {
        const len = Math.hypot(qx, qy) || 1
        signed = len - radius
        normalX = (qx / len) * Math.sign(px)
        normalY = (qy / len) * Math.sign(py)
      } else {
        signed = Math.max(qx, qy) - radius
        if (qx > qy) {
          normalX = Math.sign(px)
          normalY = 0
        } else {
          normalX = 0
          normalY = Math.sign(py)
        }
      }

      // Distance travelled inward from the border.
      const inset = -signed
      const t = Math.min(1, Math.max(0, inset / bezel))
      const sample = Math.min(PROFILE_SAMPLES - 1, Math.round(t * (PROFILE_SAMPLES - 1)))

      const offset = (y * width + x) * 4

      if (inset < 0) {
        // Outside the shape: neutral displacement, no highlight.
        displacement.data[offset] = 128
        displacement.data[offset + 1] = 128
        displacement.data[offset + 2] = 128
        displacement.data[offset + 3] = 255
        specular.data[offset + 3] = 255
        continue
      }

      // Normalised to [-1, 1]; the filter's `scale` multiplies it back to px.
      const magnitude = profile.magnitudes[sample]! / maximum
      const dx = -normalX * magnitude
      const dy = -normalY * magnitude

      displacement.data[offset] = 128 + dx * 127
      displacement.data[offset + 1] = 128 + dy * 127
      displacement.data[offset + 2] = 128
      displacement.data[offset + 3] = 255

      // Rim light: brightest where the tilted bezel faces the light, and it
      // fades out on its own as the surface flattens toward the interior.
      const tilt = Math.sin(Math.atan(Math.abs(profile.slopes[sample]!)))
      const facing = Math.abs(normalX * lightX + normalY * lightY)
      const intensity = Math.pow(facing, opts.specularSharpness) * tilt * opts.specularOpacity
      const value = Math.min(255, Math.max(0, intensity * 255))

      specular.data[offset] = value
      specular.data[offset + 1] = value
      specular.data[offset + 2] = value
      specular.data[offset + 3] = 255
    }
  }

  ctx.putImageData(displacement, 0, 0)
  specCtx.putImageData(specular, 0, 0)

  return {
    displacement: canvas.toDataURL(),
    specular: specCanvas.toDataURL(),
    width,
    height,
    scale: profile.maximum,
  }
}

const rootEl = ref<HTMLElement | null>(null)
const maps = ref<Maps | null>(null)
const size = ref({ width: 0, height: 0 })

// Unique per instance so several panels can coexist without stealing each
// other's filter. useId() keeps the SSR and client markup in sync.
const filterId = `liquid-glass-${useId()}`

const rootStyle = computed(() => ({
  '--liquid-glass-frost': String(props.frost),
  borderRadius: `${props.radius}px`,
  backdropFilter: maps.value ? `url(#${filterId})` : undefined,
  WebkitBackdropFilter: maps.value ? `url(#${filterId})` : undefined,
}))

/**
 * Per-channel filter scale. `direction` spreads the channels apart to fake
 * dispersion: red refracts least, blue most.
 */
function channelScale(direction: number) {
  if (!maps.value) return 0
  return maps.value.scale * props.refraction * (1 + direction * props.aberration)
}

let pending = 0
let pendingIsFrame = false

function render() {
  const width = Math.round(size.value.width)
  const height = Math.round(size.value.height)
  if (!width || !height) {
    maps.value = null
    return
  }

  const profile = buildProfile(props.surface, props.bezelWidth, props.thickness, props.refractiveIndex)
  maps.value = buildMaps(width, height, profile, {
    radius: props.radius,
    bezelWidth: props.bezelWidth,
    specularOpacity: props.specularOpacity,
    specularSharpness: props.specularSharpness,
    specularAngle: props.specularAngle,
  })
}

function cancelPending() {
  if (!pending) return
  if (pendingIsFrame) cancelAnimationFrame(pending)
  else clearTimeout(pending)
  pending = 0
}

/**
 * Rebuilding the map is a full per-pixel pass, so never do it more than once
 * per frame — resize observers and prop churn both land here.
 *
 * A hidden document paints no frames, so requestAnimationFrame would never run
 * and the panel would sit unrefracted until the tab was focused. Fall back to a
 * timeout in that case.
 */
function scheduleRender() {
  cancelPending()
  const run = () => {
    pending = 0
    render()
  }

  if (typeof document !== 'undefined' && document.hidden) {
    pendingIsFrame = false
    pending = window.setTimeout(run, 0)
  } else {
    pendingIsFrame = true
    pending = requestAnimationFrame(run)
  }
}

let observer: ResizeObserver | null = null

onMounted(() => {
  if (!rootEl.value) return

  // Measure up front rather than waiting on the observer's first delivery:
  // ResizeObserver callbacks are part of the frame lifecycle, so a hidden
  // document would never deliver one and the panel would never build its map.
  const rect = rootEl.value.getBoundingClientRect()
  size.value = { width: rect.width, height: rect.height }
  scheduleRender()

  observer = new ResizeObserver((entries) => {
    const entry = entries[0]
    if (!entry) return

    const box = entry.borderBoxSize?.[0]
    const width = box ? box.inlineSize : entry.contentRect.width
    const height = box ? box.blockSize : entry.contentRect.height

    if (width === size.value.width && height === size.value.height) return
    size.value = { width, height }
    scheduleRender()
  })

  observer.observe(rootEl.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  cancelPending()
})

// `refraction` and `aberration` only touch filter attributes, so they animate
// without a rebuild. Everything else changes the baked geometry.
watch(
    () => [
      props.surface,
      props.radius,
      props.bezelWidth,
      props.thickness,
      props.refractiveIndex,
      props.specularOpacity,
      props.specularSharpness,
      props.specularAngle,
    ],
    scheduleRender,
)
</script>

<style scoped>
.liquid-glass {
  position: relative;
  display: block;
  border-radius: inherit;
  background: light-dark(
      hsl(0 0% 100% / var(--liquid-glass-frost, 0)),
      hsl(0 0% 0% / var(--liquid-glass-frost, 0))
  );
  box-shadow:
      inset 0 1px 0 0 hsl(0 0% 100% / 0.35),
      inset 0 0 8px 1px hsl(0 0% 100% / 0.18),
      0 8px 32px -8px hsl(0 0% 0% / 0.35);
}

.liquid-glass__content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
}

.liquid-glass__defs {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}
</style>
