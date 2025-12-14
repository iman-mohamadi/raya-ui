<script setup lang="ts">
import { ref } from 'vue'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })

// --- Demo State ---
const config = ref({
  rows: 7,
  cols: 12,
  cellSize: 40,
  interactive: true,
  fill: false
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
  npm: 'npx shadcn-vue@latest add https://enzo-ui.vercel.app/registry/background-ripple-effect.json',
  manual: `npm install @vueuse/core clsx tailwind-merge`
}

const usageCode = `<template>
  <div class="relative min-h-screen overflow-hidden bg-background">
    <BackgroundRippleEffect
      :fill="true"
      :cell-size="50"
      :interactive="true"
    />

    <main class="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none">
      <h1 class="text-4xl font-bold">Ripple Effect</h1>
    </main>
  </div>
</template>`
</script>

<template>
  <div class="max-w-4xl space-y-10 pb-20 pt-10">

    <div class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">Background Ripple Effect</h1>
      <p class="text-xl text-zinc-400">
        A grid of interactive cells that ripple outwards when clicked.
      </p>
    </div>

    <AnimatedTabs :items="previewTabs" class="space-y-4">
      <template #preview>
        <div class="relative overflow-hidden rounded-xl border border-zinc-800 bg-background mt-4 h-[500px] flex items-center justify-center">

          <BackgroundRippleEffect
              class="absolute inset-0"
              :rows="config.rows"
              :cols="config.cols"
              :cell-size="config.cellSize"
              :interactive="config.interactive"
              :fill="config.fill"
          />

          <div class="absolute bottom-6 left-6 z-10 p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md space-y-4 w-72 shadow-2xl">
            <h3 class="font-semibold text-sm mb-2">Controls</h3>

            <div class="flex items-center justify-between">
              <label class="text-xs font-medium text-muted-foreground">Fill Parent</label>
              <input type="checkbox" v-model="config.fill" class="accent-primary" />
            </div>

            <template v-if="!config.fill">
              <div class="space-y-1">
                <label class="text-xs font-medium text-muted-foreground">Rows ({{ config.rows }})</label>
                <input type="range" v-model.number="config.rows" min="4" max="20" class="w-full" />
              </div>

              <div class="space-y-1">
                <label class="text-xs font-medium text-muted-foreground">Cols ({{ config.cols }})</label>
                <input type="range" v-model.number="config.cols" min="4" max="30" class="w-full" />
              </div>
            </template>

            <div class="space-y-1">
              <label class="text-xs font-medium text-muted-foreground">Cell Size ({{ config.cellSize }}px)</label>
              <input type="range" v-model.number="config.cellSize" min="20" max="80" class="w-full" />
            </div>

            <div class="flex items-center justify-between">
              <label class="text-xs font-medium text-muted-foreground">Interactive</label>
              <input type="checkbox" v-model="config.interactive" class="accent-primary" />
            </div>
          </div>

          <div class="relative z-0 pointer-events-none">
            <h1 class="text-4xl font-bold tracking-tighter text-foreground">
              Click the Grid
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
            <td class="px-4 py-3 font-mono text-purple-400">fill</td>
            <td class="px-4 py-3 font-mono text-xs">boolean</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">false</td>
            <td class="px-4 py-3">If true, ignores rows/cols and fills parent.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">rows</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">8</td>
            <td class="px-4 py-3">Number of rows (disabled if fill is true).</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">cols</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">27</td>
            <td class="px-4 py-3">Number of columns (disabled if fill is true).</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">cellSize</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">56</td>
            <td class="px-4 py-3">Width and height of each cell in pixels.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>