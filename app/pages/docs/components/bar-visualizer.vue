<script setup lang="ts">
import { ref } from 'vue'
import { BarVisualizer, type AgentState } from '@/components/ui/bar-visualizer'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'
import { Button } from '@/components/ui/button'

definePageMeta({ layout: 'docs' })

// --- Demo State ---
const currentState = ref<AgentState>('speaking')
const barCount = ref(20)

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
  npm: 'npx shadcn-vue@latest add https://enzo-ui.vercel.app/registry/bar-visualizer.json',
  manual: `npm install @vueuse/core`
}

const usageCode = `<script setup lang="ts">
import { BarVisualizer } from '@/components/ui/bar-visualizer'
<\/script>

<template>
  <BarVisualizer
    state="speaking"
    :bar-count="20"
    demo
    class="h-32 w-full bg-zinc-900 rounded-lg p-4"
  />
</template>`

const previewCode = `<script setup lang="ts">
import { ref } from 'vue'
import { BarVisualizer } from '@/components/ui/bar-visualizer'
import { Button } from '@/components/ui/button'

const state = ref('speaking')
<\/script>

<template>
  <div class="flex flex-col gap-8 items-center">
    <BarVisualizer
      :state="state"
      :bar-count="20"
      demo
      class="w-full max-w-md h-32 bg-zinc-900/50 rounded-xl border border-white/5"
    />

    <div class="flex flex-wrap gap-2 justify-center">
      <Button
        size="sm"
        :variant="state === 'speaking' ? 'default' : 'outline'"
        @click="state = 'speaking'"
      >
        Speaking
      </Button>
      <Button
        size="sm"
        :variant="state === 'listening' ? 'default' : 'outline'"
        @click="state = 'listening'"
      >
        Listening
      </Button>
      <Button
        size="sm"
        :variant="state === 'thinking' ? 'default' : 'outline'"
        @click="state = 'thinking'"
      >
        Thinking
      </Button>
    </div>
  </div>
</template>`
</script>

<template>
  <div class="max-w-4xl space-y-10 pb-20 pt-10">
    <div class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-bold tracking-tight text-white">Bar Visualizer</h1>
      <p class="text-xl text-zinc-400">
        A dynamic audio visualization component for voice agents and media.
      </p>
    </div>

    <AnimatedTabs :items="previewTabs" class="space-y-4">
      <template #preview>
        <div class="relative rounded-xl border border-zinc-800 bg-zinc-950/50 mt-4 p-10 flex flex-col items-center justify-center gap-8 min-h-[350px]">

          <BarVisualizer
              :state="currentState"
              :bar-count="barCount"
              demo
              class="w-full max-w-md h-32 bg-zinc-900/50 rounded-xl border border-white/5"
          />

          <div class="flex flex-wrap gap-2 justify-center">
            <Button
                size="sm"
                :variant="currentState === 'speaking' ? 'default' : 'outline'"
                @click="currentState = 'speaking'"
            >
              Speaking
            </Button>
            <Button
                size="sm"
                :variant="currentState === 'listening' ? 'default' : 'outline'"
                @click="currentState = 'listening'"
            >
              Listening
            </Button>
            <Button
                size="sm"
                :variant="currentState === 'thinking' ? 'default' : 'outline'"
                @click="currentState = 'thinking'"
            >
              Thinking
            </Button>
            <Button
                size="sm"
                :variant="currentState === 'connecting' ? 'default' : 'outline'"
                @click="currentState = 'connecting'"
            >
              Connecting
            </Button>
            <Button
                size="sm"
                :variant="currentState === 'initializing' ? 'default' : 'outline'"
                @click="currentState = 'initializing'"
            >
              Initializing
            </Button>
          </div>
        </div>
      </template>
      <template #code>
        <div class="mt-4">
          <CodeBlock :code="previewCode" lang="vue" />
        </div>
      </template>
    </AnimatedTabs>

    <div class="space-y-6">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Installation</h2>
      <AnimatedTabs :items="installTabs" class="space-y-6">
        <template #cli>
          <CodeBlock :code="installCommands.npm" lang="bash" />
        </template>
        <template #manual>
          <div class="space-y-2">
            <p class="text-sm text-zinc-400">Install dependencies:</p>
            <CodeBlock :code="installCommands.manual" lang="bash" />
            <p class="text-sm text-zinc-400 mt-4">Copy the component code into your project.</p>
          </div>
        </template>
      </AnimatedTabs>
    </div>

    <div class="space-y-6">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Usage</h2>
      <CodeBlock :code="usageCode" lang="vue" />
    </div>

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
            <td class="px-4 py-3 font-mono text-purple-400">state</td>
            <td class="px-4 py-3 font-mono text-xs">AgentState</td>
            <td class="px-4 py-3 font-mono text-xs">-</td>
            <td class="px-4 py-3">Current state ('speaking', 'listening', 'thinking', 'connecting', 'initializing').</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">barCount</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">15</td>
            <td class="px-4 py-3">Number of bars to display.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">demo</td>
            <td class="px-4 py-3 font-mono text-xs">boolean</td>
            <td class="px-4 py-3 font-mono text-xs">false</td>
            <td class="px-4 py-3">If true, simulates audio visualization without a stream.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">mediaStream</td>
            <td class="px-4 py-3 font-mono text-xs">MediaStream</td>
            <td class="px-4 py-3 font-mono text-xs">null</td>
            <td class="px-4 py-3">The audio stream to visualize (if not in demo mode).</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">minHeight</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">20</td>
            <td class="px-4 py-3">Minimum height percentage of the bars.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">maxHeight</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">100</td>
            <td class="px-4 py-3">Maximum height percentage of the bars.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>