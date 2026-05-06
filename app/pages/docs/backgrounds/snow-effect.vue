<script setup lang="ts">
import { ref, computed } from 'vue'
import { SnowEffect } from '@/components/ui/snow-effect'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Snow Effect Component for Vue & Nuxt',
  description: 'A peaceful, falling snow effect component for Vue and Nuxt rendered on an HTML5 Canvas.',
  ogTitle: 'Snow Effect Component for Vue & Nuxt',
  ogDescription: 'A peaceful, falling snow effect component for Vue and Nuxt rendered on an HTML5 Canvas.',
})

// --- Interactive Settings State ---
const color = ref('#ffffff')
const quantity = ref(150)
const speed = ref(1)
const minRadius = ref(1)
const maxRadius = ref(3)

const resetSettings = () => {
  color.value = '#ffffff'
  quantity.value = 150
  speed.value = 1
  minRadius.value = 1
  maxRadius.value = 3
}

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add snow-effect'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add snow-effect'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add snow-effect'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add snow-effect'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install @vueuse/core clsx tailwind-merge`,
    css: `/* Natively inherits your theme background colors from main.css */`
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  let props = ``
  if (color.value !== '#ffffff') props += `\n    color="${color.value}"`
  if (quantity.value !== 100) props += `\n    :quantity="${quantity.value}"`
  if (speed.value !== 1) props += `\n    :speed="${speed.value}"`
  if (minRadius.value !== 1) props += `\n    :min-radius="${minRadius.value}"`
  if (maxRadius.value !== 3) props += `\n    :max-radius="${maxRadius.value}"`

  return `<script setup lang="ts">
import { SnowEffect } from '@/components/ui/snow-effect'
<\/script>

<template>
  <div class="relative w-full h-[500px] overflow-hidden bg-background">
    <SnowEffect${props}
    />

    <div class="relative z-10 flex items-center justify-center h-full pointer-events-none">
      <h1 class="text-4xl font-bold tracking-tighter">Winter Mode</h1>
    </div>
  </div>
</template>`
})
</script>

<template>
  <NuxtLayout name="docs">
    <!-- Breadcrumb Title -->
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Snow Effect</span>
    </template>

    <!-- ========================================== -->
    <!-- LEFT PANE: Full Documentation              -->
    <!-- ========================================== -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Snow Effect</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A lightweight, peaceful snowfall animation rendered on an HTML5 Canvas. Perfect for seasonal themes or adding a sense of tranquility to hero sections.
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
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/snow-effect</code>.</p>
      </div>

      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Note:</strong> This component is entirely Canvas-driven. It uses absolute positioning to fill its closest relative parent.
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
                  snow-effect
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>SnowEffect.vue</div>
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
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">color</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"#FFF"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The Hex color code for the snowflakes.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">quantity</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">100</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Total number of snowflakes rendered on the screen.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">speed</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">1</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Vertical fall speed multiplier. Higher values create a blizzard effect.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">minRadius</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">1</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Minimum size (in pixels) for the randomly generated snowflakes.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">maxRadius</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">3</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Maximum size (in pixels) for the randomly generated snowflakes.</p>
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Visual Preview Slot            -->
    <!-- ========================================== -->
    <template #preview>
      <div class="w-full h-full relative overflow-hidden flex items-center justify-center p-6 bg-slate-950 rounded-3xl">
        <SnowEffect
            :color="color"
            :quantity="quantity"
            :speed="speed"
            :min-radius="minRadius"
            :max-radius="maxRadius"
            class="absolute inset-0"
        />

        <div class="relative z-10 pointer-events-none text-center">
          <h2 class="text-5xl font-bold tracking-tighter text-white drop-shadow-lg">
            Winter Mode
          </h2>
          <p class="text-slate-400 text-sm mt-2 font-mono">Dynamic Canvas Snowfall</p>
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

      <!-- Quantity Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Snow Density</label>
          <span class="text-xs font-mono text-muted-foreground">{{ quantity }} flakes</span>
        </div>
        <input type="range" v-model.number="quantity" min="10" max="500" step="10" class="w-full accent-foreground" />
      </div>

      <!-- Speed Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Fall Speed</label>
          <span class="text-xs font-mono text-muted-foreground">{{ speed.toFixed(1) }}x</span>
        </div>
        <input type="range" v-model.number="speed" min="0.1" max="10" step="0.1" class="w-full accent-foreground" />
      </div>

      <!-- Min/Max Radius -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="flex flex-col gap-3">
          <label class="text-xs font-medium text-muted-foreground uppercase">Min Size</label>
          <input type="range" v-model.number="minRadius" min="0.5" :max="maxRadius" step="0.5" class="w-full accent-foreground" />
        </div>
        <div class="flex flex-col gap-3">
          <label class="text-xs font-medium text-muted-foreground uppercase">Max Size</label>
          <input type="range" v-model.number="maxRadius" :min="minRadius" max="10" step="0.5" class="w-full accent-foreground" />
        </div>
      </div>

      <!-- Color Picker -->
      <div class="flex flex-col gap-2 mb-2">
        <label class="text-sm font-medium text-foreground">Snow Color</label>
        <div class="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20">
          <input type="color" v-model="color" class="size-8 rounded-full border-0 p-0 cursor-pointer bg-transparent" />
          <span class="text-xs font-mono text-muted-foreground uppercase tracking-wider">{{ color }}</span>
        </div>
      </div>

    </template>
  </NuxtLayout>
</template>