<script setup lang="ts">
import { AnimatedInput } from '@/components/ui/animated-input'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

// --- Tabs Config ---
const previewTabs = [
  { label: 'Preview', slot: 'preview' },
  { label: 'Code', slot: 'code' }
]

const installTabs = [
  { label: 'CLI', slot: 'cli' },
  { label: 'Manual', slot: 'manual' }
]

const installCommands = {
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/animated-input.json`,
  manual: `npm install @vueuse/core clsx tailwind-merge`
}

const usageCode = `<script setup lang="ts">
import { AnimatedInput } from '@/components/ui/animated-input'
<\/script>

<template>
  <div class="w-full max-w-sm space-y-4">
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium">Username</label>
      <AnimatedInput placeholder="johndoe" />
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium">Email</label>
      <AnimatedInput placeholder="john@example.com" type="email" />
    </div>
  </div>
</template>`
</script>

<template>
  <div class="max-w-4xl space-y-10 pb-20 pt-10">

    <div class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">Animated Input</h1>
      <p class="text-xl text-zinc-400">
        A text input with a mouse-following gradient border effect.
      </p>
    </div>

    <AnimatedTabs :items="previewTabs" class="space-y-4">
      <template #preview>
        <div class="relative rounded-xl border border-zinc-800 bg-neutral-950 mt-4 h-[350px] flex items-center justify-center p-10">

          <div class="w-full max-w-sm space-y-6">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-zinc-300">Username</label>
              <AnimatedInput placeholder="Enter your username" />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-zinc-300">Custom Glow (Purple)</label>
              <AnimatedInput placeholder="Purple glow..." glow-color="#a855f7" />
            </div>
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
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Installation</h2>
      <AnimatedTabs :items="installTabs" class="space-y-6">
        <template #cli>
          <CodeBlock :code="installCommands.npm"  />
        </template>
        <template #manual>
          <div class="space-y-2">
            <p class="text-sm text-zinc-400">Install dependencies:</p>
            <CodeBlock :code="installCommands.manual"  />
            <p class="text-sm text-zinc-400 mt-4">Copy the component code into your project.</p>
          </div>
        </template>
      </AnimatedTabs>
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
            <td class="px-4 py-3 font-mono text-purple-400">glowColor</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">'#14b8a6'</td>
            <td class="px-4 py-3">The color of the mouse-following gradient border.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">containerClass</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs">-</td>
            <td class="px-4 py-3">Class for the wrapper div (useful for spacing/sizing).</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">class</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs">-</td>
            <td class="px-4 py-3">Class for the input element itself.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>