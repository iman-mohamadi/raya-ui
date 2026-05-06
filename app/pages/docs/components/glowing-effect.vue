<script setup lang="ts">
import { ref, computed } from 'vue'
import { Box, Lock, Search, Settings, Sparkles } from 'lucide-vue-next'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Glowing Effect Component for Vue & Nuxt',
  description: 'A glowing border effect that tracks the mouse pointer, perfect for cards and grids.',
  ogTitle: 'Glowing Effect Component for Vue & Nuxt',
  ogDescription: 'A glowing border effect that tracks the mouse pointer, perfect for cards and grids.',
})

// --- Interactive Settings State ---
// Initialized to match the original demo values for maximum visibility
const blur = ref(0)
const spread = ref(40)
const proximity = ref(64)
const inactiveZone = ref(0.01)
const borderWidth = ref(3)
const movementDuration = ref(2)
const variant = ref('default')

const resetSettings = () => {
  blur.value = 0
  spread.value = 40
  proximity.value = 64
  inactiveZone.value = 0.01
  borderWidth.value = 3
  movementDuration.value = 2
  variant.value = 'default'
}

// --- Demo Data ---
const gridItems = [
  {
    area: 'md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]',
    icon: Box,
    title: 'Raya UI Core',
    description: "The foundation of modern Vue interfaces, architected by Iman Mohammadi."
  },
  {
    area: 'md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]',
    icon: Settings,
    title: 'Battle Tested',
    description: "Powering complex production environments like Woodcoder.com."
  },
  {
    area: 'md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]',
    icon: Lock,
    title: 'Enterprise Reliability',
    description: "Trusted by industry leaders including Hotelyar.com for mission-critical UIs."
  },
  {
    area: 'md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]',
    icon: Sparkles,
    title: 'Modern Aesthetics',
    description: "Crafted with the latest design trends and OKLCH color spaces."
  },
  {
    area: 'md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]',
    icon: Search,
    title: 'Nuxt 4 Ready',
    description: "Built for the future of the Vue ecosystem with best-in-class performance."
  },
]

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add glowing-effect'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add glowing-effect'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add glowing-effect'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add glowing-effect'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install motion-v clsx tailwind-merge lucide-vue-next`,
    css: `/* Inherits seamlessly from your main.css theme variables */`
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  let props = `\n    :glow="true"\n    :disabled="false"`
  if (blur.value !== 0) props += `\n    :blur="${blur.value}"`
  if (spread.value !== 20) props += `\n    :spread="${spread.value}"`
  if (proximity.value !== 0) props += `\n    :proximity="${proximity.value}"`
  if (inactiveZone.value !== 0.7) props += `\n    :inactive-zone="${inactiveZone.value}"`
  if (borderWidth.value !== 1) props += `\n    :border-width="${borderWidth.value}"`
  if (movementDuration.value !== 2) props += `\n    :movement-duration="${movementDuration.value}"`
  if (variant.value !== 'default') props += `\n    variant="${variant.value}"`

  return `<script setup lang="ts">
import { GlowingEffect } from '@/components/ui/glowing-effect'
<\/script>

<template>
  <div class="relative h-full rounded-2xl border border-border p-2">
    <GlowingEffect${props}
    />
    <div class="relative flex h-full flex-col gap-6 overflow-hidden rounded-xl bg-background border border-border p-6">
      <h3 class="text-xl font-semibold text-foreground">Hover Me</h3>
      <p class="text-sm text-muted-foreground">The glowing effect tracks your mouse.</p>
    </div>
  </div>
</template>`
})
</script>

<template>
  <NuxtLayout name="docs">
    <!-- Breadcrumb Title -->
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Glowing Effect</span>
    </template>

    <!-- ========================================== -->
    <!-- LEFT PANE: Full Documentation              -->
    <!-- ========================================== -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Glowing Effect</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A dynamic, proximity-based glowing border effect that tracks the mouse pointer. Perfect for highlighting interactive cards and bento grids.
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
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/glowing-effect</code>.</p>
      </div>

      <!-- CSS Install -->
      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Ready to go:</strong> This component inherits your layout colors seamlessly from your <code>main.css</code> theme variables.
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
                  glowing-effect
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>GlowingEffect.vue</div>
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
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">blur</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">0</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The blur radius of the glow effect in pixels.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">spread</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">20</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The spread angle of the conical gradient.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">proximity</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">0</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The distance from the element at which the glow becomes visible.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">inactiveZone</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">0.7</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Radius ratio from the center where the glow is inactive.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">borderWidth</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">1</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The width of the glowing border in pixels.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">movementDuration</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">2</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Duration of the glow movement animation in seconds.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">variant</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">enum</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"default"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The color variant of the glow. Accepts 'default' or 'white'.</p>
          </div>
        </div>

      </div>

      <div class="mt-8 text-sm border border-border p-4 rounded-xl bg-muted/30">
        <p class="text-muted-foreground">Source content adapted from <a href="https://ui.aceternity.com/components/glowing-effect" target="_blank" class="text-foreground underline hover:text-primary">Aceternity UI</a>.</p>
      </div>

    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Visual Preview Slot            -->
    <!-- ========================================== -->
    <template #preview>
      <div class="w-full h-full p-4 lg:p-8 flex items-center justify-center overflow-y-auto custom-scrollbar">
        <ul class="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-3 w-full max-w-4xl shrink-0">
          <li
              v-for="(item, index) in gridItems"
              :key="index"
              class="min-h-[14rem] list-none"
              :class="item.area"
          >
            <!-- Note: Background removed from outer div so it doesn't cover the absolute glow layer -->
            <div class="relative h-full rounded-2xl border border-border p-2 md:rounded-3xl md:p-3">
              <GlowingEffect
                  :blur="blur"
                  :spread="spread"
                  :proximity="proximity"
                  :inactive-zone="inactiveZone"
                  :border-width="borderWidth"
                  :movement-duration="movementDuration"
                  :variant="variant"
                  :glow="true"
                  :disabled="false"
              />
              <!-- Solid bg-background on inner div to mask the center and only reveal borders -->
              <div class="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border border-border bg-background p-6 shadow-sm">
                <div class="relative flex flex-1 flex-col justify-between gap-3">
                  <div class="w-fit rounded-lg border border-border bg-muted/50 p-2">
                    <component :is="item.icon" class="h-4 w-4 text-foreground" />
                  </div>
                  <div class="space-y-3">
                    <h3 class="pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-foreground md:text-2xl/[1.875rem]">
                      {{ item.title }}
                    </h3>
                    <h2 class="font-sans text-sm/[1.125rem] text-muted-foreground md:text-base/[1.375rem]">
                      {{ item.description }}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
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

      <!-- Spread Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Spread</label>
          <span class="text-xs font-mono text-muted-foreground">{{ spread }}</span>
        </div>
        <input type="range" v-model.number="spread" min="10" max="90" step="5" class="w-full accent-foreground" />
      </div>

      <!-- Proximity Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Proximity</label>
          <span class="text-xs font-mono text-muted-foreground">{{ proximity }}</span>
        </div>
        <input type="range" v-model.number="proximity" min="0" max="128" step="4" class="w-full accent-foreground" />
      </div>

      <!-- Border Width Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Border Width</label>
          <span class="text-xs font-mono text-muted-foreground">{{ borderWidth }}px</span>
        </div>
        <input type="range" v-model.number="borderWidth" min="1" max="10" step="1" class="w-full accent-foreground" />
      </div>

      <!-- Blur Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Blur Radius</label>
          <span class="text-xs font-mono text-muted-foreground">{{ blur }}px</span>
        </div>
        <input type="range" v-model.number="blur" min="0" max="20" step="1" class="w-full accent-foreground" />
      </div>

      <!-- Inactive Zone Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Inactive Zone</label>
          <span class="text-xs font-mono text-muted-foreground">{{ inactiveZone }}</span>
        </div>
        <input type="range" v-model.number="inactiveZone" min="0.01" max="0.99" step="0.05" class="w-full accent-foreground" />
      </div>

      <!-- Movement Duration Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Movement Speed (s)</label>
          <span class="text-xs font-mono text-muted-foreground">{{ movementDuration }}s</span>
        </div>
        <input type="range" v-model.number="movementDuration" min="0.5" max="5" step="0.5" class="w-full accent-foreground" />
      </div>

      <!-- Variant Select -->
      <div class="flex flex-col gap-2 mb-2">
        <label class="text-sm font-medium text-foreground">Variant</label>
        <div class="relative">
          <select v-model="variant" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="default">Default</option>
            <option value="white">White</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

    </template>
  </NuxtLayout>
</template>