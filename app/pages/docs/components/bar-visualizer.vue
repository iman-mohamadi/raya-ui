<script setup lang="ts">
import { ref } from 'vue'
import { BarVisualizer, type AgentState } from '@/components/ui/bar-visualizer'
import { CodeBlock } from '@/components/ui/code-block'
import { Button } from '@/components/ui/button'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

// --- Demo State ---
const currentState = ref<AgentState>('speaking')
const barCount = ref(20)

// --- Code Snippets ---
const installCommands = {
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/bar-visualizer.json`,
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

useSeoMeta({
  title: 'Bar Visualizer Component for Vue & Nuxt',
  description: 'A dynamic audio visualization component for voice agents and media, optimized for Vue and Nuxt projects.',
  ogTitle: 'Bar Visualizer Component for Vue & Nuxt',
  ogDescription: 'A dynamic audio visualization component for voice agents and media, optimized for Vue and Nuxt projects.',
})
</script>

<template>
  <div class="pb-5">
    <PageTitle
        title="Bar Visualizer"
        description="A dynamic audio visualization component for voice agents and media."
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
          <div class="relative rounded-xl border border-zinc-800 bg-zinc-950/50 flex flex-col items-center justify-center gap-8 min-h-[350px] p-10">
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
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock :code="previewCode" lang="html"/>
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
        <CodeBlock :code="installCommands.manual"/>
      </div>
    </div>

    <div class="h-g"/>

    <Divider/>

    <div class="space-y-12 mt-4">
      <h2 class="scroll-m-20 text-3xl font-bold tracking-tight">Usage</h2>

      <div class="space-y-4">
        <CodeBlock :code="usageCode" lang="html" />
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