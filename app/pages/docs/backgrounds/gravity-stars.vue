<script setup lang="ts">
import { GravityStars } from '~/components/ui/gravity-stars'
import { AnimatedTabs } from '~/components/ui/animated-tabs'
import { CodeBlock } from '~/components/ui/code-block'

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
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/gravity-stars.json`,
  manual: `npm install clsx tailwind-merge`
}

const usageCode = `<template>
  <div class="relative h-[400px] w-full rounded-xl bg-black border border-white/10 overflow-hidden flex items-center justify-center">

    <GravityStars
      class="absolute inset-0 z-0 text-white"
      :stars-count="100"
      :mouse-influence="150"
      mouse-gravity="attract"
    />

    <div class="relative z-10 text-center pointer-events-none">
      <h1 class="text-4xl font-bold text-white tracking-tighter">Gravity</h1>
      <p class="text-zinc-400 text-sm mt-2">Move your mouse to attract stars.</p>
    </div>

  </div>
</template>`
</script>

<template>
  <div class="max-w-4xl space-y-10 pb-20 pt-10">

    <div class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">Gravity Stars</h1>
      <p class="text-xl text-zinc-400">
        Interactive star field that reacts to mouse gravity with smooth physics.
      </p>
    </div>

    <AnimatedTabs :items="previewTabs" class="space-y-4">
      <template #preview>
        <div class="relative h-[500px] w-full rounded-xl bg-black border border-zinc-800 overflow-hidden flex items-center justify-center">

          <GravityStars
              class="absolute inset-0 z-0 text-white"
              :stars-count="100"
              :mouse-influence="200"
              :gravity-strength="50"
          />
          <LiquidGlass >
            <div class="relative z-10 text-center pointer-events-none p-6 bg-black/50 backdrop-blur-sm rounded-xl border border-white/10">
              <h1 class="text-5xl font-black text-white tracking-tighter">Raya UI</h1>
              <p class="text-zinc-300 font-medium mt-2">Gravity Effect</p>
            </div>
          </LiquidGlass>


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
            <td class="px-4 py-3 font-mono text-purple-400">starsCount</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">75</td>
            <td class="px-4 py-3">Number of stars/particles.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">mouseInfluence</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">100</td>
            <td class="px-4 py-3">Radius of the mouse attraction/repulsion field.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">mouseGravity</td>
            <td class="px-4 py-3 font-mono text-xs">'attract' | 'repel'</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">'attract'</td>
            <td class="px-4 py-3">Whether particles are pulled towards or pushed away from cursor.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>