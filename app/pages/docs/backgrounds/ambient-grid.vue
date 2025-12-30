<script setup lang="ts">
import { ref } from 'vue'
import { AmbientGrid } from '@/components/ui/ambient-grid'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'
import { Button } from '@/components/ui/button'

definePageMeta({ layout: 'docs' })
const appConfig = useAppConfig().raya

useSeoMeta({
  title: 'Ambient Grid Component for Vue & Nuxt',
  description: 'A playful, interactive background component for Vue and Nuxt that reacts to mouse movement.',
  ogTitle: 'Ambient Grid Component for Vue & Nuxt',
  ogDescription: 'A playful, interactive background component for Vue and Nuxt that reacts to mouse movement.',
})

// --- Demo State ---
const config = ref({
  gridSize: 30,
  color1: '#a855f7', // purple
  color2: '#3b82f6', // blue
  interactive: true
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
  npm: `npx shadcn-vue@latest add ${appConfig.baseUrl}/ambient-grid.json`,
  manual: `npm install @vueuse/core`
}

const usageCode = `<template>
  <div class="relative min-h-screen overflow-hidden">
    <AmbientGrid
      :grid-size="30"
      color1="#ff0000"
      color2="#00ff00"
      :interactive="true"
    />

    <main class="relative z-10">
      <h1>Your Content</h1>
    </main>
  </div>
</template>`
</script>

<template>
  <div class="pb-5">
    <PageTitle
        title="Ambient Grid"
        description="A playful, interactive background that reacts to mouse movement."
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
          <div class="relative overflow-hidden rounded-xl border border-zinc-800 bg-black flex items-center justify-center min-h-[500px]">
            <div class="absolute top-4 right-4 z-20">
              <Button
                  size="sm"
                  variant="outline"
                  class="h-7 text-xs border-zinc-800"
                  @click="config.interactive = !config.interactive"
              >
                {{ config.interactive ? 'Disable' : 'Enable' }} Mouse
              </Button>
            </div>

            <AmbientGrid
                class="absolute inset-0"
                :grid-size="config.gridSize"
                :color1="config.color1"
                :color2="config.color2"
                :interactive="config.interactive"
            />

            <div class="relative z-10 p-6 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md space-y-4 w-64 shadow-2xl">
              <div class="space-y-1">
                <label class="text-xs font-medium text-zinc-400">Grid Size ({{ config.gridSize }}px)</label>
                <input type="range" v-model.number="config.gridSize" min="10" max="100" class="w-full accent-white" />
              </div>

              <div class="space-y-1">
                <label class="text-xs font-medium text-zinc-400">Primary Color</label>
                <div class="flex gap-2">
                  <button @click="config.color1 = '#a855f7'" class="w-6 h-6 rounded-full bg-purple-500 ring-2 ring-offset-2 ring-offset-black ring-transparent focus:ring-white"></button>
                  <button @click="config.color1 = '#ef4444'" class="w-6 h-6 rounded-full bg-red-500 ring-2 ring-offset-2 ring-offset-black ring-transparent focus:ring-white"></button>
                  <button @click="config.color1 = '#eab308'" class="w-6 h-6 rounded-full bg-yellow-500 ring-2 ring-offset-2 ring-offset-black ring-transparent focus:ring-white"></button>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-xs font-medium text-zinc-400">Secondary Color</label>
                <div class="flex gap-2">
                  <button @click="config.color2 = '#3b82f6'" class="w-6 h-6 rounded-full bg-blue-500 ring-2 ring-offset-2 ring-offset-black ring-transparent focus:ring-white"></button>
                  <button @click="config.color2 = '#10b981'" class="w-6 h-6 rounded-full bg-emerald-500 ring-2 ring-offset-2 ring-offset-black ring-transparent focus:ring-white"></button>
                  <button @click="config.color2 = '#ec4899'" class="w-6 h-6 rounded-full bg-pink-500 ring-2 ring-offset-2 ring-offset-black ring-transparent focus:ring-white"></button>
                </div>
              </div>
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
      <div class="space-y-4">
        <CodeBlock :code="installCommands.npm"/>
        <p class="text-sm text-zinc-400">Or manually:</p>
        <div class="space-y-2">
          <p class="text-sm text-zinc-400">Install dependencies:</p>
          <CodeBlock :code="installCommands.manual"  />
        </div>
      </div>
    </div>

    <div class="h-g"/>

    <Divider/>

    <div class="space-y-6 mt-4">
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
            <td class="px-4 py-3 font-mono text-purple-400">interactive</td>
            <td class="px-4 py-3 font-mono text-xs">boolean</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">true</td>
            <td class="px-4 py-3">If true, the primary glow follows the mouse cursor.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">gridSize</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">24</td>
            <td class="px-4 py-3">The size of the background grid cells in pixels.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">color1</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">'#a855f7'</td>
            <td class="px-4 py-3">The color of the primary (mouse-following) glow.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">color2</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">'#3b82f6'</td>
            <td class="px-4 py-3">The color of the secondary (static) ambient glow.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>