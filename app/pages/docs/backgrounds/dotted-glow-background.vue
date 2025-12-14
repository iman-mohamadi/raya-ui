<script setup lang="ts">
import { ref } from 'vue'
import DottedGlowBackground from '@/components/ui/dotted-glow-background/DottedGlowBackground.vue'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })

// --- Demo State ---
const config = ref({
  gap: 15,
  radius: 2,
  opacity: 0.6,
  speedScale: 1.0,
})

// --- Tabs Config ---
const previewTabs = [
  { label: 'Preview', slot: 'preview' },
  { label: 'Code', slot: 'code' }
]

const installTabs = [
  { label: 'CLI', slot: 'cli' },
  { label: 'Manual', slot: 'manual' }
]

// --- Code Snippets ---
const installCommands = {
  npm: 'npx shadcn-vue@latest add https://enzo-ui.vercel.app/registry/dotted-glow-background.json',
  manual: `npm install @vueuse/core` // Optional but good for consistency
}

const usageCode = `<template>
  <div class="relative min-h-screen overflow-hidden bg-background">
    <DottedGlowBackground
      :gap="15"
      :radius="2"
      :opacity="0.6"
      :speed-scale="1"
      color-light-var="foreground"
      color-dark-var="foreground"
    />

    <main class="relative z-10 p-10">
      <h1 class="text-4xl font-bold">Dotted Glow</h1>
    </main>
  </div>
</template>`
</script>

<template>
  <div class="max-w-4xl space-y-10 pb-20 pt-10">

    <div class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">Dotted Glow Background</h1>
      <p class="text-xl text-zinc-400">
        A canvas-based dotted background that produces an organic shimmering effect.
      </p>
    </div>

    <AnimatedTabs :items="previewTabs" class="space-y-4">
      <template #preview>
        <div class="relative overflow-hidden rounded-xl border border-zinc-800 bg-background mt-4 h-[500px]">

          <DottedGlowBackground
              class="absolute inset-0"
              :gap="config.gap"
              :radius="config.radius"
              :opacity="config.opacity"
              :speed-scale="config.speedScale"
              color-light-var="foreground"
              color-dark-var="foreground"
              glow-color-light-var="primary"
              glow-color-dark-var="primary"
          />

          <div class="absolute bottom-6 left-6 z-10 p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md space-y-4 w-72 shadow-2xl">
            <h3 class="font-semibold text-sm mb-2">Controls</h3>

            <div class="space-y-1">
              <label class="text-xs font-medium text-muted-foreground">Gap ({{ config.gap }}px)</label>
              <input type="range" v-model.number="config.gap" min="10" max="50" class="w-full" />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-medium text-muted-foreground">Radius ({{ config.radius }}px)</label>
              <input type="range" v-model.number="config.radius" min="1" max="10" step="0.5" class="w-full" />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-medium text-muted-foreground">Opacity ({{ config.opacity }})</label>
              <input type="range" v-model.number="config.opacity" min="0.1" max="1" step="0.1" class="w-full" />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-medium text-muted-foreground">Speed ({{ config.speedScale }}x)</label>
              <input type="range" v-model.number="config.speedScale" min="0" max="5" step="0.1" class="w-full" />
            </div>
          </div>

          <div class="relative z-0 flex h-full items-center justify-center pointer-events-none">
            <h1 class="text-5xl font-bold tracking-tighter bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
              Glow.
            </h1>
          </div>
        </div>
      </template>

      <template #code>
        <div class="mt-4">
          <CodeBlock :code="usageCode" lang="html" />
        </div>
      </template>
    </AnimatedTabs>

    <div class="space-y-6">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Props</h2>
      <div class="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950">
        <table class="w-full text-sm text-left">
          <thead class="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400">
          <tr>
            <th class="px-4 py-3 font-medium">Prop</th>
            <th class="px-4 py-3 font-medium">Type</th>
            <th class="px-4 py-3 font-medium">Default</th>
            <th class="px-4 py-3 font-medium">Description</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800 text-zinc-300">
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">gap</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">12</td>
            <td class="px-4 py-3">Distance between dot centers in pixels.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">radius</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">2</td>
            <td class="px-4 py-3">Base radius of each dot in pixels.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">color*Var</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">-</td>
            <td class="px-4 py-3">CSS variable names (e.g. "foreground", "primary") to automatically adapt to theme.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="space-y-6">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Installation</h2>
      <AnimatedTabs :items="installTabs" class="space-y-6">
        <template #cli>
          <CodeBlock :code="installCommands.npm"  />
        </template>
        <template #manual>
          <div class="space-y-2">
            <p class="text-sm text-zinc-400">Copy the component code into your project.</p>
          </div>
        </template>
      </AnimatedTabs>
    </div>

  </div>
</template>