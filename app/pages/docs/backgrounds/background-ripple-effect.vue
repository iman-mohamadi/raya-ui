<script setup lang="ts">
import { ref } from 'vue'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })
const appConfig = useAppConfig().raya

useSeoMeta({
  title: 'Background Ripple Effect Component for Vue & Nuxt',
  description: 'A grid of interactive cells that ripple outwards when clicked, optimized for Vue and Nuxt projects.',
  ogTitle: 'Background Ripple Effect Component for Vue & Nuxt',
  ogDescription: 'A grid of interactive cells that ripple outwards when clicked, optimized for Vue and Nuxt projects.',
})

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
  npm: `npx shadcn-vue@latest add ${appConfig.baseUrl}/background-ripple-effect.json`,
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
  <div class="pb-5">
    <PageTitle
        title="Background Ripple Effect"
        description="A grid of interactive cells that ripple outwards when clicked."
    />
    <Divider/>
    <div class="mt-4">
      <Tabs default-value="preview">
        <TabsList>
          <TabsTrigger value="preview">
            Preview
          </TabsTrigger>
          <TabsTrigger value="code">
            Code
          </TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div class="relative overflow-hidden rounded-xl border border-zinc-800 bg-background flex items-center justify-center min-h-[500px]">

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
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock :code="usageCode" lang="html"/>
        </TabsContent>
      </Tabs>
    </div>

    <div class="h-g"/>

    <Divider/>

    <div class="space-y-6 mt-4">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Installation</h2>
      <AnimatedTabs :items="installTabs" class="space-y-6">
        <template #cli>
          <CodeBlock :code="installCommands.npm"  />
        </template>
        <template #manual>
          <div class="space-y-2">
            <p class="text-sm text-zinc-400 dark:text-zinc-600">Install dependencies:</p>
            <CodeBlock :code="installCommands.manual"  />
          </div>
        </template>
      </AnimatedTabs>
    </div>

    <div class="h-g"/>

    <Divider/>

    <div class="space-y-6 mt-4">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Props</h2>
      <div class="overflow-x-auto rounded-lg border border-edge bg-background">
        <table class="w-full text-sm text-left">
          <thead class="border-b border-edge bg-background text-zinc-400 dark:text-zinc-600">
          <tr>
            <th class="px-4 py-3 font-medium">Prop</th>
            <th class="px-4 py-3 font-medium">Type</th>
            <th class="px-4 py-3 font-medium">Default</th>
            <th class="px-4 py-3 font-medium">Description</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-edge text-zinc-700 dark:text-zinc-300">
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