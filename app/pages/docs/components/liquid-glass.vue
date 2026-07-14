<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { GripVertical } from 'lucide-vue-next'
import { useElementBounding, useDraggable } from '@vueuse/core'
import { LiquidGlass } from '@/components/raya/ui/liquid-glass'
import { AmbientGrid } from '@/components/raya/ui/ambient-grid'
import { CodeBlock } from '@/components/raya/ui/code-block'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'Liquid Glass Component for Vue & Nuxt',
  description: 'An Apple-style chromatic aberration and displacement effect component for Vue and Nuxt applications.',
  ogTitle: 'Liquid Glass Component for Vue & Nuxt',
  ogDescription: 'An Apple-style chromatic aberration and displacement effect component for Vue and Nuxt applications.',
})

// --- Interactive Settings State ---
const radius = ref(24)
const scale = ref(-40)
const blur = ref(15)
const alpha = ref(0.93)
const lightness = ref(30)
const gOffset = ref(10)
const bOffset = ref(10)

const resetSettings = () => {
  radius.value = 24
  scale.value = -40
  blur.value = 15
  alpha.value = 0.93
  lightness.value = 30
  gOffset.value = 10
  bOffset.value = 10
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
  let props = ``
  if (radius.value !== 16) props += `\n    :radius="${radius.value}"`
  if (scale.value !== -180) props += `\n    :scale="${scale.value}"`
  if (blur.value !== 11) props += `\n    :blur="${blur.value}"`
  if (alpha.value !== 0.93) props += `\n    :alpha="${alpha.value}"`
  if (lightness.value !== 30) props += `\n    :lightness="${lightness.value}"`
  if (gOffset.value !== 10) props += `\n    :gOffset="${gOffset.value}"`
  if (bOffset.value !== 10) props += `\n    :bOffset="${bOffset.value}"`

  return `<script setup lang="ts">
import { LiquidGlass } from '@/components/ui/liquid-glass'
<\/script>

<template>
  <LiquidGlass class="w-72 h-48"${props}>
    <div class="h-full w-full flex items-center justify-center p-6 bg-white/5">
      <p class="text-white font-medium">Refracted Content</p>
    </div>
  </LiquidGlass>
</template>`
})
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
        An advanced, Apple-style chromatic aberration and displacement effect using complex SVG filters for stunning refractions.
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
          <strong class="font-semibold">Ready to go:</strong> This component handles its own SVG filter definitions internally and requires no extra CSS variables.
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- API Reference -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">API Reference</h2>

      <h3 class="text-2xl mt-7 mb-3 text-foreground">Props</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">radius</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">16</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Border radius of the glass container in pixels.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">scale</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">-180</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Intensity of the SVG displacement map (refraction strength).</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">blur</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">11</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Blur amount for the internal displacement filter map.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">alpha</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">0.93</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Opacity of the internal feColorMatrix shape mask.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">lightness</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">30</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Controls the specular lighting brightness on the edges.</p>
          </div>
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
                class="w-64 h-40 lg:w-72 lg:h-48"
                :radius="radius"
                :blur="blur"
                :scale="scale"
                :alpha="alpha"
                :lightness="lightness"
                :gOffset="gOffset"
                :bOffset="bOffset"
            >
              <div class="h-full w-full flex flex-col justify-between p-6 bg-foreground/5 backdrop-blur-[2px]">
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

      <!-- Scale Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Refraction Scale</label>
          <span class="text-xs font-mono text-muted-foreground">{{ scale }}</span>
        </div>
        <input type="range" v-model.number="scale" min="-200" max="200" step="10" class="w-full accent-foreground" />
      </div>

      <!-- Blur Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Displacement Blur</label>
          <span class="text-xs font-mono text-muted-foreground">{{ blur }}px</span>
        </div>
        <input type="range" v-model.number="blur" min="0" max="50" step="1" class="w-full accent-foreground" />
      </div>

      <!-- Lightness Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Specular Lightness</label>
          <span class="text-xs font-mono text-muted-foreground">{{ lightness }}</span>
        </div>
        <input type="range" v-model.number="lightness" min="0" max="100" step="5" class="w-full accent-foreground" />
      </div>

      <!-- Alpha Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Mask Alpha</label>
          <span class="text-xs font-mono text-muted-foreground">{{ alpha.toFixed(2) }}</span>
        </div>
        <input type="range" v-model.number="alpha" min="0" max="1" step="0.05" class="w-full accent-foreground" />
      </div>

      <!-- Border Radius Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Border Radius</label>
          <span class="text-xs font-mono text-muted-foreground">{{ radius }}px</span>
        </div>
        <input type="range" v-model.number="radius" min="0" max="100" step="2" class="w-full accent-foreground" />
      </div>

      <div class="grid grid-cols-2 gap-4 mb-2">
        <!-- Green Offset -->
        <div class="flex flex-col gap-3">
          <div class="flex justify-between items-center">
            <label class="text-sm font-medium text-success">Green Shift</label>
          </div>
          <input type="range" v-model.number="gOffset" min="-50" max="50" step="2" class="w-full accent-success" />
        </div>

        <!-- Blue Offset -->
        <div class="flex flex-col gap-3">
          <div class="flex justify-between items-center">
            <label class="text-sm font-medium text-info">Blue Shift</label>
          </div>
          <input type="range" v-model.number="bOffset" min="-50" max="50" step="2" class="w-full accent-info" />
        </div>
      </div>

    </template>
  </DocContent>
</template>