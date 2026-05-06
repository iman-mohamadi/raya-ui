<script setup lang="ts">
import { ref, computed } from 'vue'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Background Ripple Effect Component for Vue & Nuxt',
  description: 'A grid of interactive cells that ripple outwards when clicked, optimized for Vue and Nuxt projects.',
  ogTitle: 'Background Ripple Effect Component for Vue & Nuxt',
  ogDescription: 'A grid of interactive cells that ripple outwards when clicked, optimized for Vue and Nuxt projects.',
})

// --- Interactive Settings State ---
const fill = ref(false)
const rows = ref(7)
const cols = ref(12)
const cellSize = ref(40)
const interactive = ref(true)

const resetSettings = () => {
  fill.value = false
  rows.value = 7
  cols.value = 12
  cellSize.value = 40
  interactive.value = true
}

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add background-ripple-effect'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add background-ripple-effect'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add background-ripple-effect'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add background-ripple-effect'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install @vueuse/core clsx tailwind-merge`,
    css: `/* Natively inherits your theme colors and typography from main.css */`
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  let props = ``
  if (fill.value) props += `\n    fill`
  else {
    if (rows.value !== 8) props += `\n    :rows="${rows.value}"`
    if (cols.value !== 27) props += `\n    :cols="${cols.value}"`
  }
  if (cellSize.value !== 56) props += `\n    :cell-size="${cellSize.value}"`
  if (!interactive.value) props += `\n    :interactive="false"`

  return `<script setup lang="ts">
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
<\/script>

<template>
  <div class="relative w-full h-[500px] overflow-hidden bg-background">
    <BackgroundRippleEffect${props}
    />

    <div class="relative z-10 flex items-center justify-center h-full pointer-events-none">
      <h1 class="text-4xl font-bold tracking-tighter">Click the Grid</h1>
    </div>
  </div>
</template>`
})
</script>

<template>
  <NuxtLayout name="docs">
    <!-- Breadcrumb Title -->
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Background Ripple</span>
    </template>

    <!-- ========================================== -->
    <!-- LEFT PANE: Full Documentation              -->
    <!-- ========================================== -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Background Ripple</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        An interactive background component consisting of a grid of cells that trigger a radial ripple animation upon interaction. Perfect for landing pages and hero sections.
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
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/background-ripple-effect</code>.</p>
      </div>

      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Ready to go:</strong> This component uses CSS-based animations and inherits your theme's primary color and surface variables.
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
                  background-ripple-effect
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>BackgroundRippleEffect.vue</div>
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
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">fill</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">boolean</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">false</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">When true, the component ignores row/col props and automatically calculates the grid to fill its parent container.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">cellSize</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">56</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The width and height (in pixels) of each interactive grid cell.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">rows</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">8</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Explicit number of horizontal rows. (Ignored if <code>fill</code> is true).</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">cols</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">27</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Explicit number of vertical columns. (Ignored if <code>fill</code> is true).</p>
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Visual Preview Slot            -->
    <!-- ========================================== -->
    <template #preview>
      <div class="w-full h-full relative overflow-hidden flex items-center justify-center p-6 bg-background rounded-3xl">
        <BackgroundRippleEffect
            :fill="fill"
            :rows="rows"
            :cols="cols"
            :cell-size="cellSize"
            :interactive="interactive"
            class="absolute inset-0"
        />

        <div class="relative z-10 pointer-events-none text-center">
          <h2 class="text-4xl font-bold tracking-tighter text-foreground drop-shadow-sm">
            Ripple Grid
          </h2>
          <p class="text-muted-foreground text-sm mt-2">Click anywhere on the surface to see the effect</p>
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

      <!-- Fill Parent Toggle -->
      <div class="flex items-center justify-between mb-6 border-b border-border pb-6">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-foreground cursor-pointer select-none" @click="fill = !fill">Fill Parent</label>
          <span class="text-xs text-muted-foreground">Auto-calculate grid coverage.</span>
        </div>
        <button @click="fill = !fill" :class="['w-10 h-6 rounded-full transition-colors duration-300 relative shrink-0', fill ? 'bg-foreground' : 'bg-muted']">
          <div :class="['w-4 h-4 rounded-full absolute top-[4px] transition-transform duration-300', fill ? 'translate-x-[20px] bg-background' : 'translate-x-[4px] bg-muted-foreground shadow-sm']"></div>
        </button>
      </div>

      <!-- Grid Dimensions (Enabled only if fill is false) -->
      <div :class="{ 'opacity-50 pointer-events-none': fill }">
        <div class="flex flex-col gap-3 mb-6">
          <div class="flex justify-between items-center">
            <label class="text-sm font-medium text-foreground">Rows</label>
            <span class="text-xs font-mono text-muted-foreground">{{ rows }}</span>
          </div>
          <input type="range" v-model.number="rows" min="4" max="20" step="1" class="w-full accent-foreground" />
        </div>

        <div class="flex flex-col gap-3 mb-6">
          <div class="flex justify-between items-center">
            <label class="text-sm font-medium text-foreground">Columns</label>
            <span class="text-xs font-mono text-muted-foreground">{{ cols }}</span>
          </div>
          <input type="range" v-model.number="cols" min="4" max="40" step="1" class="w-full accent-foreground" />
        </div>
      </div>

      <!-- Cell Size Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Cell Size</label>
          <span class="text-xs font-mono text-muted-foreground">{{ cellSize }}px</span>
        </div>
        <input type="range" v-model.number="cellSize" min="20" max="100" step="4" class="w-full accent-foreground" />
      </div>

      <!-- Interactive Toggle -->
      <div class="flex items-center justify-between mb-2">
        <label class="text-sm font-medium text-foreground cursor-pointer select-none" @click="interactive = !interactive">Interactive</label>
        <button @click="interactive = !interactive" :class="['w-10 h-6 rounded-full transition-colors duration-300 relative shrink-0', interactive ? 'bg-foreground' : 'bg-muted']">
          <div :class="['w-4 h-4 rounded-full absolute top-[4px] transition-transform duration-300', interactive ? 'translate-x-[20px] bg-background' : 'translate-x-[4px] bg-muted-foreground shadow-sm']"></div>
        </button>
      </div>

    </template>
  </NuxtLayout>
</template>