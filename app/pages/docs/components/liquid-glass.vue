<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { GripVertical } from 'lucide-vue-next'
import { useElementBounding, useDraggable } from '@vueuse/core'
import { LiquidGlass, type GlassSurface } from '@/components/raya/ui/liquid-glass'
import { AmbientGrid } from '@/components/raya/ui/ambient-grid'
import { CodeBlock } from '@/components/raya/ui/code-block'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'Liquid Glass Component for Vue & Nuxt',
  description: 'A physically-based Apple Liquid Glass component for Vue and Nuxt, using Snell\'s law refraction baked into an SVG displacement map.',
  ogTitle: 'Liquid Glass Component for Vue & Nuxt',
  ogDescription: 'A physically-based Apple Liquid Glass component for Vue and Nuxt, using Snell\'s law refraction baked into an SVG displacement map.',
})

// --- Defaults, kept in one place so the settings panel and the generated
// --- snippet agree on what counts as "unchanged". ---
const DEFAULTS = {
  surface: 'convexSquircle' as GlassSurface,
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
}

const surface = ref<GlassSurface>(DEFAULTS.surface)
const radius = ref(DEFAULTS.radius)
const bezelWidth = ref(DEFAULTS.bezelWidth)
const thickness = ref(DEFAULTS.thickness)
const refractiveIndex = ref(DEFAULTS.refractiveIndex)
const refraction = ref(DEFAULTS.refraction)
const aberration = ref(DEFAULTS.aberration)
const blur = ref(DEFAULTS.blur)
const specularOpacity = ref(DEFAULTS.specularOpacity)
const specularSharpness = ref(DEFAULTS.specularSharpness)
const specularAngle = ref(DEFAULTS.specularAngle)
const frost = ref(DEFAULTS.frost)

const surfaces: { value: GlassSurface; label: string }[] = [
  { value: 'convexSquircle', label: 'Squircle' },
  { value: 'convexCircle', label: 'Circle' },
  { value: 'concave', label: 'Concave' },
  { value: 'lip', label: 'Lip' },
]

const resetSettings = () => {
  surface.value = DEFAULTS.surface
  radius.value = DEFAULTS.radius
  bezelWidth.value = DEFAULTS.bezelWidth
  thickness.value = DEFAULTS.thickness
  refractiveIndex.value = DEFAULTS.refractiveIndex
  refraction.value = DEFAULTS.refraction
  aberration.value = DEFAULTS.aberration
  blur.value = DEFAULTS.blur
  specularOpacity.value = DEFAULTS.specularOpacity
  specularSharpness.value = DEFAULTS.specularSharpness
  specularAngle.value = DEFAULTS.specularAngle
  frost.value = DEFAULTS.frost
}

// --- Draggable Setup ---
const dragEl = ref<HTMLElement | null>(null)
const containerEl = ref<HTMLElement | null>(null)

const container = useElementBounding(containerEl)
const element = useElementBounding(dragEl)
const position = ref({ x: 50, y: 50 })

useDraggable(dragEl, {
  preventDefault: true,
  onMove: (e) => {
    if (!container.width.value || !element.width.value) return
    const rawX = e.x - container.left.value
    const rawY = e.y - container.top.value
    const maxX = container.width.value - element.width.value
    const maxY = container.height.value - element.height.value

    position.value.x = Math.max(0, Math.min(rawX, maxX))
    position.value.y = Math.max(0, Math.min(rawY, maxY))
  }
})

onMounted(() => {
  setTimeout(() => {
    if (container.width.value && element.width.value) {
      position.value.x = (container.width.value / 2) - (element.width.value / 2)
      position.value.y = (container.height.value / 2) - (element.height.value / 2)
    }
  }, 100)
})

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add liquid-glass'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add liquid-glass'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add liquid-glass'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add liquid-glass'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install @vueuse/core lucide-vue-next`,
    css: `/* Inherits seamlessly from your main.css theme variables */`
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  const current: Record<string, string | number> = {
    surface: surface.value,
    radius: radius.value,
    bezelWidth: bezelWidth.value,
    thickness: thickness.value,
    refractiveIndex: refractiveIndex.value,
    refraction: refraction.value,
    aberration: aberration.value,
    blur: blur.value,
    specularOpacity: specularOpacity.value,
    specularSharpness: specularSharpness.value,
    specularAngle: specularAngle.value,
    frost: frost.value,
  }

  let attrs = ''
  for (const [key, value] of Object.entries(current)) {
    if (value === DEFAULTS[key as keyof typeof DEFAULTS]) continue
    attrs += typeof value === 'string'
        ? `\n    ${key}="${value}"`
        : `\n    :${key}="${value}"`
  }

  return `<script setup lang="ts">
import { LiquidGlass } from '@/components/ui/liquid-glass'
<\/script>

<template>
  <LiquidGlass class="w-72 h-48"${attrs}>
    <div class="h-full w-full flex items-center justify-center p-6">
      <p class="text-white font-medium">Refracted Content</p>
    </div>
  </LiquidGlass>
</template>`
})

const props = [
  { name: 'surface', type: '"convexSquircle" | "convexCircle" | "concave" | "lip"', default: '"convexSquircle"', description: 'Cross-section profile of the bezel. The squircle keeps the flat-to-curve transition smooth when the shape is stretched into a rectangle, which is why Apple favours it. `concave` pushes rays outward past the panel; `lip` raises a rim and dips the centre.' },
  { name: 'radius', type: 'number', default: '24', description: 'Corner radius of the panel, in px. Also drives the rounded-rect distance field the vector field is rotated around.' },
  { name: 'bezelWidth', type: 'number', default: '24', description: 'How far the curved bezel extends inward from the border, in px. Everything past it is flat glass and refracts nothing.' },
  { name: 'thickness', type: 'number', default: '40', description: 'Height of the glass at the end of the bezel, in px. Rays cross this much material before landing on the background, so it scales the displacement directly.' },
  { name: 'refractiveIndex', type: 'number', default: '1.5', description: 'Refractive index of the material used in Snell\'s law. 1 is air and bends nothing; 1.5 is window glass.' },
  { name: 'refraction', type: 'number', default: '1', description: 'Artistic multiplier on the simulated displacement. 1 keeps the physics honest; it maps straight onto the filter\'s `scale`, so it animates without rebuilding the map.' },
  { name: 'aberration', type: 'number', default: '0', description: 'Chromatic dispersion as a ratio of the refraction. Above 0 each channel is refracted at its own scale and recombined, which costs two extra displacement passes.' },
  { name: 'blur', type: 'number', default: '2', description: 'Gaussian blur applied to the backdrop before it is refracted, in px. Blurring first keeps the bezel from smearing.' },
  { name: 'specularOpacity', type: 'number', default: '0.4', description: 'Brightness of the rim light, 0–1.' },
  { name: 'specularSharpness', type: 'number', default: '6', description: 'Exponent on the rim falloff. Higher values give a shorter, sharper glint.' },
  { name: 'specularAngle', type: 'number', default: '-60', description: 'Direction the light comes from, in degrees.' },
  { name: 'frost', type: 'number', default: '0.05', description: 'Opacity of the frosted tint filling the panel, 0–1. Adapts to light and dark via `light-dark()`.' },
  { name: 'class', type: 'string', default: '—', description: 'Classes applied to the inner content wrapper.' },
  { name: 'containerClass', type: 'string', default: '—', description: 'Classes applied to the outer glass element — use this for sizing and positioning.' },
]

const slots = [
  { name: 'default', description: 'Content rendered on top of the glass. It sits above the refracted backdrop and is not itself distorted.' },
]
</script>

<template>
  <DocContent>
    <!-- Breadcrumb Title -->
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Liquid Glass</span>
    </template>

    <!-- ========================================== -->
    <!-- LEFT PANE: Full Documentation              -->
    <!-- ========================================== -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Liquid Glass</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        Apple's Liquid Glass, rebuilt from optics: rays are refracted through a curved bezel with Snell's law, baked into
        an SVG displacement map, and applied to the backdrop.
      </p>
    </div>

    <div class="rounded-lg border border-warning/20 bg-warning/10 p-4 text-sm text-warning mt-6">
      <strong class="font-semibold">Chromium only.</strong>
      Using an SVG filter as a <code>backdrop-filter</code> is not part of the CSS spec and only Chromium implements it.
      In Safari and Firefox the panel degrades to its frost tint and rim shadow, with no refraction.
    </div>

    <!-- How it works -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">How it works</h2>
      <p class="text-sm md:text-base text-muted-foreground leading-relaxed">
        The effect is a small ray tracer that runs once per size change, following
        <a href="https://kube.io/blog/liquid-glass-css-svg/" target="_blank" rel="noopener noreferrer" class="text-foreground underline underline-offset-4">Maxime Kubryk's write-up</a>
        of the technique.
      </p>

      <h3 class="text-2xl mt-7 mb-3 text-foreground">1. The surface</h3>
      <p class="text-sm md:text-base text-muted-foreground leading-relaxed">
        The bezel is described by a height function over <code>x ∈ [0, 1]</code>, where 0 is the outer edge and 1 is where
        the glass goes flat. The <code>surface</code> prop picks between four of them — a circular arc, a squircle, the
        concave complement, and a smootherstep blend of convex and concave that produces a raised lip.
      </p>

      <h3 class="text-2xl mt-7 mb-3 text-foreground">2. The refraction</h3>
      <p class="text-sm md:text-base text-muted-foreground leading-relaxed">
        Incident rays are assumed orthogonal to the background, so the angle of incidence is just the surface tilt — the
        derivative of the height function, scaled by <code>thickness / bezelWidth</code>. Snell's law
        (<code>n₁·sin θ₁ = n₂·sin θ₂</code>) gives the refracted angle, and the ray then crosses the glass before landing
        on the background, so the lateral shift is <code>height · tan(θ₁ − θ₂)</code>. Convex profiles keep the landing
        point inside the panel; concave ones push it out past the border, where there is nothing to sample.
      </p>

      <h3 class="text-2xl mt-7 mb-3 text-foreground">3. The displacement map</h3>
      <p class="text-sm md:text-base text-muted-foreground leading-relaxed">
        Displacement magnitude only depends on distance from the border, so it is computed once along a single radius and
        then rotated around the shape — a rounded-rect signed distance field supplies both the distance and the normal to
        point the vector along. The vectors are normalised by the largest magnitude, then written into a canvas with the
        X component in red and the Y component in green, 128 being neutral. Exactly 128 samples are taken, because an
        8-bit channel cannot express any more.
      </p>
      <p class="text-sm md:text-base text-muted-foreground leading-relaxed mt-3">
        That maximum magnitude comes back as the filter's <code>scale</code>, which is what converts the normalised map
        into real pixel offsets. Because <code>scale</code> is just an attribute, <code>refraction</code> and
        <code>aberration</code> can be animated freely — everything else changes the baked geometry and forces a rebuild.
      </p>

      <h3 class="text-2xl mt-7 mb-3 text-foreground">4. The specular rim</h3>
      <p class="text-sm md:text-base text-muted-foreground leading-relaxed">
        A second image encodes a rim light: brightest where the tilted bezel faces <code>specularAngle</code>, fading out
        on its own as the surface flattens toward the interior. It is screened over the refracted backdrop.
      </p>
    </div>

    <!-- Installation -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">Installation</h2>

      <!-- Main Install Tabs -->
      <div class="flex items-center gap-2 mb-4 border-b border-border pb-2">
        <button
            v-for="tab in ['cli', 'manual', 'css']"
            :key="tab"
            @click="activeInstallTab = tab"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize"
            :class="activeInstallTab === tab ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'"
        >
          {{ tab }}
        </button>
      </div>

      <!-- CLI Install -->
      <div v-if="activeInstallTab === 'cli'" class="w-full gap-0 rounded-xl overflow-hidden border border-border bg-background">
        <div class="flex items-center px-3 h-10 border-b border-border">
          <div class="flex items-center gap-0.5 relative">
            <button
                v-for="tab in cliTabs"
                :key="tab"
                @click="activeCliTab = tab"
                class="relative z-10 px-3 h-7 rounded-md text-sm transition-colors"
                :class="activeCliTab === tab ? 'text-foreground bg-muted' : 'text-muted-foreground hover:text-foreground'"
            >
              {{ tab }}
            </button>
          </div>
        </div>
        <div class="p-1.5">
          <CodeBlock language="bash" :code="installCommands.cli" class="border-0 m-0 bg-transparent" />
        </div>
      </div>

      <!-- Manual Install -->
      <div v-if="activeInstallTab === 'manual'" class="flex flex-col gap-4">
        <p class="text-sm text-muted-foreground">1. Install dependencies:</p>
        <div class="rounded-xl overflow-hidden border border-border bg-background p-1.5">
          <CodeBlock language="bash" :code="installCommands.manual" class="border-0 m-0 bg-transparent" />
        </div>
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/liquid-glass</code>.</p>
      </div>

      <!-- CSS Install -->
      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Ready to go:</strong> The component generates its own displacement maps and SVG
          filter at runtime — no extra CSS variables, no build step, no external assets.
        </div>
      </div>
    </div>

    <!-- File Structure -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">File Structure</h2>
      <div class="my-4 rounded-xl border border-border overflow-hidden bg-background">
        <div class="p-4 w-full relative font-mono text-sm text-muted-foreground">
          <div class="flex items-center gap-2 text-foreground">
            <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
            your-project
          </div>
          <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
            <div class="flex items-center gap-2 py-2">
              <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              components
            </div>
            <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
              <div class="flex items-center gap-2 py-2">
                <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                ui
              </div>
              <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                <div class="flex items-center gap-2 py-2 text-pink-500">
                  <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  liquid-glass
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>LiquidGlass.vue</div>
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>index.ts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">Performance notes</h2>
      <ul class="list-disc pl-5 flex flex-col gap-2 text-sm md:text-base text-muted-foreground leading-relaxed">
        <li>Building the maps is a full per-pixel pass over the panel, so it is coalesced into one <code>requestAnimationFrame</code> and only runs when the size or the baked geometry changes.</li>
        <li>Moving, scaling by transform, or animating <code>refraction</code> and <code>aberration</code> costs nothing extra — none of them rebuild the map.</li>
        <li>Resizing the panel every frame does rebuild it every frame. Prefer <code>transform: scale()</code> for animated size changes.</li>
        <li><code>aberration</code> above 0 runs three displacement passes instead of one. Leave it at 0 unless you want the dispersion.</li>
      </ul>
    </div>

    <!-- API Reference -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">API Reference</h2>

      <h3 class="text-2xl mt-7 mb-3 text-foreground">Props</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div v-for="prop in props" :key="prop.name" class="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 px-5 py-4 border-b border-border">
          <div class="w-full sm:w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">{{ prop.name }}</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex flex-wrap items-center gap-2 min-w-0">
              <code class="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md break-all">{{ prop.type }}</code>
              <div class="flex-1"></div>
              <code class="text-xs font-mono text-foreground bg-muted px-2 py-0.5 rounded-md shrink-0">{{ prop.default }}</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-1">{{ prop.description }}</p>
          </div>
        </div>
      </div>

      <h3 class="text-2xl mt-8 mb-3 text-foreground">Slots</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div v-for="slot in slots" :key="slot.name" class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">{{ slot.name }}</code>
          </div>
          <p class="flex-1 text-sm text-muted-foreground leading-relaxed">{{ slot.description }}</p>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Visual Preview Slot            -->
    <!-- ========================================== -->
    <template #preview>
      <div class="w-full h-full relative overflow-hidden flex items-center justify-center bg-background rounded-3xl">
        <div ref="containerEl" class="absolute inset-0 overflow-hidden select-none">
          <!-- Background to refract -->
          <AmbientGrid :grid-size="40" color1="var(--color-primary)" color2="var(--color-info)" />

          <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 opacity-20 dark:opacity-10">
            <h1 class="text-[10rem] lg:text-[12rem] font-black text-foreground leading-none tracking-tighter">GLASS</h1>
            <h1 class="text-[10rem] lg:text-[12rem] font-black text-foreground leading-none tracking-tighter">EFFECT</h1>
          </div>

          <!-- Draggable Glass Card -->
          <div
              ref="dragEl"
              :style="{
              transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
              position: 'absolute',
              top: 0,
              left: 0,
              touchAction: 'none'
            }"
              class="absolute z-20 cursor-grab active:cursor-grabbing will-change-transform"
          >
            <LiquidGlass
                container-class="w-64 h-40 lg:w-72 lg:h-48"
                :surface="surface"
                :radius="radius"
                :bezel-width="bezelWidth"
                :thickness="thickness"
                :refractive-index="refractiveIndex"
                :refraction="refraction"
                :aberration="aberration"
                :blur="blur"
                :specular-opacity="specularOpacity"
                :specular-sharpness="specularSharpness"
                :specular-angle="specularAngle"
                :frost="frost"
            >
              <div class="h-full w-full flex flex-col justify-between p-6">
                <div class="flex justify-between items-start">
                  <div class="h-8 w-8 rounded-full bg-background/50 flex items-center justify-center shadow-sm">
                    <div class="h-4 w-4 bg-foreground rounded-full"></div>
                  </div>
                  <GripVertical class="text-foreground/50" />
                </div>
                <div>
                  <p class="text-foreground/60 text-sm font-medium uppercase tracking-wider">Balance</p>
                  <p class="text-foreground text-2xl lg:text-3xl font-bold tracking-tight">$12,450.00</p>
                </div>
              </div>
            </LiquidGlass>
          </div>

          <div class="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-30">
            <span class="text-xs text-background bg-foreground/80 px-3 py-1.5 rounded-full shadow-lg border border-border/50 backdrop-blur-sm">
              Drag the card to see the refraction
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Source Code Slot               -->
    <!-- ========================================== -->
    <template #code>
      <CodeBlock language="vue" :code="codeString" class="border-0 bg-transparent m-0 p-0" />
    </template>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Settings Panel Slot            -->
    <!-- ========================================== -->
    <template #settings>
      <!-- Panel Header & Reset -->
      <div class="flex items-center justify-between mb-8">
        <span class="font-semibold text-base text-foreground tracking-tight">Settings</span>
        <button @click="resetSettings" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Reset</button>
      </div>

      <!-- Surface -->
      <div class="flex flex-col gap-3 mb-6">
        <label class="text-sm font-medium text-foreground">Surface profile</label>
        <div class="grid grid-cols-2 gap-1.5">
          <button
              v-for="option in surfaces"
              :key="option.value"
              @click="surface = option.value"
              class="px-3 h-8 rounded-md text-sm transition-colors border"
              :class="surface === option.value ? 'bg-foreground text-background border-foreground' : 'text-muted-foreground border-border hover:text-foreground'"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <!-- Bezel Width -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Bezel Width</label>
          <span class="text-xs font-mono text-muted-foreground">{{ bezelWidth }}px</span>
        </div>
        <input type="range" v-model.number="bezelWidth" min="4" max="80" step="1" class="w-full accent-foreground" />
      </div>

      <!-- Thickness -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Glass Thickness</label>
          <span class="text-xs font-mono text-muted-foreground">{{ thickness }}px</span>
        </div>
        <input type="range" v-model.number="thickness" min="0" max="150" step="5" class="w-full accent-foreground" />
      </div>

      <!-- Refractive Index -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Refractive Index</label>
          <span class="text-xs font-mono text-muted-foreground">{{ refractiveIndex.toFixed(2) }}</span>
        </div>
        <input type="range" v-model.number="refractiveIndex" min="1" max="3" step="0.05" class="w-full accent-foreground" />
      </div>

      <!-- Refraction Level -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Refraction Level</label>
          <span class="text-xs font-mono text-muted-foreground">{{ refraction.toFixed(2) }}</span>
        </div>
        <input type="range" v-model.number="refraction" min="-2" max="2" step="0.05" class="w-full accent-foreground" />
      </div>

      <!-- Blur -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Backdrop Blur</label>
          <span class="text-xs font-mono text-muted-foreground">{{ blur }}px</span>
        </div>
        <input type="range" v-model.number="blur" min="0" max="20" step="0.5" class="w-full accent-foreground" />
      </div>

      <!-- Chromatic Aberration -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Chromatic Aberration</label>
          <span class="text-xs font-mono text-muted-foreground">{{ aberration.toFixed(2) }}</span>
        </div>
        <input type="range" v-model.number="aberration" min="0" max="0.5" step="0.01" class="w-full accent-foreground" />
      </div>

      <!-- Specular Opacity -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Specular Opacity</label>
          <span class="text-xs font-mono text-muted-foreground">{{ specularOpacity.toFixed(2) }}</span>
        </div>
        <input type="range" v-model.number="specularOpacity" min="0" max="1" step="0.05" class="w-full accent-foreground" />
      </div>

      <!-- Specular Sharpness -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Specular Sharpness</label>
          <span class="text-xs font-mono text-muted-foreground">{{ specularSharpness }}</span>
        </div>
        <input type="range" v-model.number="specularSharpness" min="1" max="20" step="1" class="w-full accent-foreground" />
      </div>

      <!-- Specular Angle -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Specular Angle</label>
          <span class="text-xs font-mono text-muted-foreground">{{ specularAngle }}°</span>
        </div>
        <input type="range" v-model.number="specularAngle" min="-180" max="180" step="5" class="w-full accent-foreground" />
      </div>

      <!-- Border Radius -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Border Radius</label>
          <span class="text-xs font-mono text-muted-foreground">{{ radius }}px</span>
        </div>
        <input type="range" v-model.number="radius" min="0" max="100" step="2" class="w-full accent-foreground" />
      </div>

      <!-- Frost -->
      <div class="flex flex-col gap-3 mb-2">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Frost Tint</label>
          <span class="text-xs font-mono text-muted-foreground">{{ frost.toFixed(2) }}</span>
        </div>
        <input type="range" v-model.number="frost" min="0" max="0.5" step="0.01" class="w-full accent-foreground" />
      </div>
    </template>
  </DocContent>
</template>
