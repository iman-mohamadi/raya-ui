<script setup lang="ts">
import { MorphingText } from '@/components/ui/morphing-text'
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
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/morphing-text.json`,
  manual: `npm install clsx tailwind-merge`
}

const usageCode = `<script setup lang="ts">
import { MorphingText } from '@/components/ui/morphing-text'

const texts = [
  "Raya UI",
  "Design",
  "System",
  "Morphing",
  "Text"
]
<\/script>

<template>
  <MorphingText :texts="texts" />
</template>`
</script>

<template>
  <div class="max-w-4xl space-y-10 pb-20 pt-10">

    <div class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">Morphing Text</h1>
      <p class="text-xl text-zinc-400">
        A text animation that morphs between strings using SVG filters and blur effects.
      </p>
    </div>

    <AnimatedTabs :items="previewTabs" class="space-y-4">
      <template #preview>
        <div class="relative rounded-xl border border-zinc-800 bg-neutral-950 mt-4 h-[350px] flex items-center justify-center overflow-hidden">
          <MorphingText
              :texts="['Raya', 'UI', 'Is', 'Awesome']"
              class="text-white"
          />
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
            <p class="text-sm text-zinc-400">Copy the component code into your project.</p>
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
            <td class="px-4 py-3 font-mono text-purple-400">texts</td>
            <td class="px-4 py-3 font-mono text-xs">string[]</td>
            <td class="px-4 py-3 font-mono text-xs">-</td>
            <td class="px-4 py-3">An array of strings to cycle through.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">morphTime</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">1.5</td>
            <td class="px-4 py-3">Duration of the morphing transition in seconds.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">coolDownTime</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">0.5</td>
            <td class="px-4 py-3">Duration the text stays visible before morphing again.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>