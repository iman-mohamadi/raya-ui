<script setup lang="ts">
import { ref, computed } from 'vue'
import { AmbientGrid } from '@/components/ui/ambient-grid'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'Ambient Grid Component for Vue & Nuxt',
  description: 'A playful, interactive background component for Vue and Nuxt that reacts to mouse movement.',
  ogTitle: 'Ambient Grid Component for Vue & Nuxt',
  ogDescription: 'A playful, interactive background component for Vue and Nuxt that reacts to mouse movement.',
})

// --- Interactive Settings State ---
const gridSize = ref(30)
const color1 = ref('#a855f7')
const color2 = ref('#3b82f6')
const interactive = ref(true)

const resetSettings = () => {
  gridSize.value = 30
  color1.value = '#a855f7'
  color2.value = '#3b82f6'
  interactive.value = true
}

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add ambient-grid'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add ambient-grid'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add ambient-grid'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add ambient-grid'; break;
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
  if (gridSize.value !== 24) props += `\n    :grid-size="${gridSize.value}"`
  if (color1.value !== '#a855f7') props += `\n    color1="${color1.value}"`
  if (color2.value !== '#3b82f6') props += `\n    color2="${color2.value}"`
  if (!interactive.value) props += `\n    :interactive="false"`

  return `<script setup lang="ts">
import { AmbientGrid } from '@/components/ui/ambient-grid'
<\/script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-background">
    <AmbientGrid${props}
    />

    <div class="relative z-10 p-10">
      <h1 class="text-4xl font-bold">Ambient Layout</h1>
    </div>
  </div>
</template>`
})
</script>

<template>
  <DocContent>
    <!-- Breadcrumb Title -->
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Ambient Grid</span>
    </template>

    <!-- ========================================== -->
    <!-- LEFT PANE: Full Documentation              -->
    <!-- ========================================== -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Ambient Grid</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A playful, high-performance background component that renders a subtle grid with interactive ambient glows that react to mouse movement.
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
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/ambient-grid</code>.</p>
      </div>

      <!-- CSS Install -->
      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Ready to go:</strong> This component uses Canvas for rendering and inherits your theme background variables natively.
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
                  ambient-grid
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>AmbientGrid.vue</div>
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
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">gridSize</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">24</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The size of the background grid cells in pixels.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">interactive</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">boolean</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">true</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">When true, the primary glow (color1) dynamically follows the user's mouse cursor.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">color1</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"#a855f7"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The color of the primary glow point.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">color2</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"#3b82f6"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The color of the secondary static ambient glow.</p>
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Visual Preview Slot            -->
    <!-- ========================================== -->
    <template #preview>
      <div class="w-full h-full relative overflow-hidden flex items-center justify-center p-6 bg-background rounded-3xl">
        <AmbientGrid
            :grid-size="gridSize"
            :color1="color1"
            :color2="color2"
            :interactive="interactive"
            class="absolute inset-0"
        />

        <!-- Preview UI Overlay -->
        <div class="relative z-10 p-8 rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-4 text-center max-w-xs">
          <div class="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-foreground">Interactive Grid</h3>
            <p class="text-sm text-muted-foreground">The background reacts to your movements and configuration.</p>
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

      <!-- Interactive Toggle -->
      <div class="flex items-center justify-between mb-6 border-b border-border pb-6">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-foreground cursor-pointer select-none" @click="interactive = !interactive">Interactive Mouse</label>
          <span class="text-xs text-muted-foreground">Glow follows the cursor position.</span>
        </div>
        <button @click="interactive = !interactive" :class="['w-10 h-6 rounded-full transition-colors duration-300 relative shrink-0', interactive ? 'bg-foreground' : 'bg-muted']">
          <div :class="['w-4 h-4 rounded-full absolute top-[4px] transition-transform duration-300', interactive ? 'translate-x-[20px] bg-background' : 'translate-x-[4px] bg-muted-foreground shadow-sm']"></div>
        </button>
      </div>

      <!-- Grid Size Slider -->
      <div class="flex flex-col gap-3 mb-8">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Grid Cell Size</label>
          <span class="text-xs font-mono text-muted-foreground">{{ gridSize }}px</span>
        </div>
        <input type="range" v-model.number="gridSize" min="10" max="100" step="5" class="w-full accent-foreground" />
      </div>

      <!-- Primary Color (Circle Buttons) -->
      <div class="flex flex-col gap-2 mb-6">
        <label class="text-sm font-medium text-foreground">Primary Glow (Color 1)</label>
        <div class="flex gap-2">
          <button
              v-for="c in ['#a855f7', '#ef4444', '#eab308', '#ffffff']"
              :key="c"
              @click="color1 = c"
              :style="{ backgroundColor: c }"
              class="size-6 rounded-full border border-border shadow-sm ring-2 ring-offset-2 ring-transparent transition-all"
              :class="{ 'ring-foreground scale-110': color1 === c }"
          ></button>
          <input type="color" v-model="color1" class="size-6 rounded-full border-0 p-0 cursor-pointer overflow-hidden bg-transparent" />
        </div>
      </div>

      <!-- Secondary Color (Circle Buttons) -->
      <div class="flex flex-col gap-2 mb-2">
        <label class="text-sm font-medium text-foreground">Secondary Glow (Color 2)</label>
        <div class="flex gap-2">
          <button
              v-for="c in ['#3b82f6', '#10b981', '#ec4899', '#71717a']"
              :key="c"
              @click="color2 = c"
              :style="{ backgroundColor: c }"
              class="size-6 rounded-full border border-border shadow-sm ring-2 ring-offset-2 ring-transparent transition-all"
              :class="{ 'ring-foreground scale-110': color2 === c }"
          ></button>
          <input type="color" v-model="color2" class="size-6 rounded-full border-0 p-0 cursor-pointer overflow-hidden bg-transparent" />
        </div>
      </div>

    </template>
  </DocContent>
</template>