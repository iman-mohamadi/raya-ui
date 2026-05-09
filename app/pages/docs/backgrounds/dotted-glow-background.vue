<script setup lang="ts">
import { ref, computed } from 'vue'
import DottedGlowBackground from '@/components/ui/dotted-glow-background/DottedGlowBackground.vue'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'Dotted Glow Background Component for Vue & Nuxt',
  description: 'A canvas-based dotted background that produces an organic shimmering effect, compatible with Vue and Nuxt.',
  ogTitle: 'Dotted Glow Background Component for Vue & Nuxt',
  ogDescription: 'A canvas-based dotted background that produces an organic shimmering effect, compatible with Vue and Nuxt.',
})

// --- Interactive Settings State ---
const gap = ref(15)
const radius = ref(2)
const opacity = ref(0.6)
const speedScale = ref(1.0)

const resetSettings = () => {
  gap.value = 15
  radius.value = 2
  opacity.value = 0.6
  speedScale.value = 1.0
}

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add dotted-glow-background'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add dotted-glow-background'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add dotted-glow-background'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add dotted-glow-background'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install @vueuse/core clsx tailwind-merge`,
    css: `/* Natively inherits your theme colors using CSS variables */`
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  let props = ``
  if (gap.value !== 12) props += `\n    :gap="${gap.value}"`
  if (radius.value !== 2) props += `\n    :radius="${radius.value}"`
  if (opacity.value !== 0.6) props += `\n    :opacity="${opacity.value}"`
  if (speedScale.value !== 1) props += `\n    :speed-scale="${speedScale.value}"`

  return `<script setup lang="ts">
import { DottedGlowBackground } from '@/components/ui/dotted-glow-background'
<\/script>

<template>
  <div class="relative w-full h-[500px] overflow-hidden bg-background">
    <DottedGlowBackground${props}
      color-light-var="foreground"
      color-dark-var="foreground"
      glow-color-light-var="primary"
      glow-color-dark-var="primary"
    />

    <div class="relative z-10 flex items-center justify-center h-full">
      <h1 class="text-4xl font-bold tracking-tighter">Organic Shimmer</h1>
    </div>
  </div>
</template>`
})
</script>

<template>
  <DocContent>
    <!-- Breadcrumb Title -->
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Dotted Glow Background</span>
    </template>

    <!-- ========================================== -->
    <!-- LEFT PANE: Full Documentation              -->
    <!-- ========================================== -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Dotted Glow Background</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A high-performance Canvas-based background that renders a grid of dots with an organic, shimmering glow effect. It adapts automatically to theme changes using CSS variables.
      </p>
    </div>

    <!-- Installation -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">Installation</h2>

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

      <div v-if="activeInstallTab === 'manual'" class="flex flex-col gap-4">
        <p class="text-sm text-muted-foreground">1. Install dependencies:</p>
        <div class="rounded-xl overflow-hidden border border-border bg-background p-1.5">
          <CodeBlock language="bash" :code="installCommands.manual" class="border-0 m-0 bg-transparent" />
        </div>
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/dotted-glow-background</code>.</p>
      </div>

      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Ready to go:</strong> This component uses standard CSS variables like <code>foreground</code> and <code>primary</code> to ensure it matches your theme automatically.
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
                  dotted-glow-background
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>DottedGlowBackground.vue</div>
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
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">gap</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">12</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The horizontal and vertical distance between the centers of each dot in pixels.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">radius</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">2</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The base radius of each dot in pixels. Glow flares will expand beyond this.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">opacity</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">0.6</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The baseline alpha transparency for the dot grid.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">speedScale</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">1.0</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Multiplier for the shimmering animation speed.</p>
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Visual Preview Slot            -->
    <!-- ========================================== -->
    <template #preview>
      <div class="w-full h-full relative overflow-hidden flex items-center justify-center p-6 bg-background rounded-3xl">
        <DottedGlowBackground
            :gap="gap"
            :radius="radius"
            :opacity="opacity"
            :speed-scale="speedScale"
            color-light-var="foreground"
            color-dark-var="foreground"
            glow-color-light-var="primary"
            glow-color-dark-var="primary"
            class="absolute inset-0"
        />

        <div class="relative z-10 pointer-events-none text-center">
          <h2 class="text-5xl font-bold tracking-tighter text-foreground drop-shadow-sm">
            Glow.
          </h2>
          <p class="text-muted-foreground text-sm mt-2 font-mono">Organic Canvas Shimmer</p>
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
      <div class="flex items-center justify-between mb-8">
        <span class="font-semibold text-base text-foreground tracking-tight">Settings</span>
        <button @click="resetSettings" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Reset</button>
      </div>

      <!-- Gap Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Dot Spacing (Gap)</label>
          <span class="text-xs font-mono text-muted-foreground">{{ gap }}px</span>
        </div>
        <input type="range" v-model.number="gap" min="10" max="50" step="1" class="w-full accent-foreground" />
      </div>

      <!-- Radius Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Base Radius</label>
          <span class="text-xs font-mono text-muted-foreground">{{ radius }}px</span>
        </div>
        <input type="range" v-model.number="radius" min="1" max="8" step="0.5" class="w-full accent-foreground" />
      </div>

      <!-- Opacity Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Grid Opacity</label>
          <span class="text-xs font-mono text-muted-foreground">{{ opacity.toFixed(1) }}</span>
        </div>
        <input type="range" v-model.number="opacity" min="0.1" max="1" step="0.1" class="w-full accent-foreground" />
      </div>

      <!-- Speed Slider -->
      <div class="flex flex-col gap-3 mb-2">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Shimmer Speed</label>
          <span class="text-xs font-mono text-muted-foreground">{{ speedScale.toFixed(1) }}x</span>
        </div>
        <input type="range" v-model.number="speedScale" min="0" max="5" step="0.1" class="w-full accent-foreground" />
      </div>

    </template>
  </DocContent>
</template>