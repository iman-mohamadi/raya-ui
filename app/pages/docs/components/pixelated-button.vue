<script setup lang="ts">
import { PixelGameButton } from '@/components/ui/pixel-game-button'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'
import { Crown, Ghost, Sword } from 'lucide-vue-next'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

const previewTabs = [
  { label: 'Preview', slot: 'preview' },
  { label: 'Code', slot: 'code' }
]

const installTabs = [
  { label: 'CLI', slot: 'cli' },
  { label: 'Manual', slot: 'manual' }
]

const installCommands = {
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/pixelated-button.json`,
  manual: `npm install clsx tailwind-merge`
}

const usageCode = `<script setup lang="ts">
import { PixelatedButton } from '@/components/ui/pixelated-button'
import { Crown } from 'lucide-vue-next'
<\/script>

<template>
  <div class="flex flex-col gap-10 items-center">

    <PixelatedButton />

    <PixelatedButton
      :hue="120"
      label="SUCCESS"
      sub-label="COMPLETE"
      :scale="0.8"
    >
      <template #icon-left>
        <Crown class="w-5 h-5" />
      </template>
    </PixelatedButton>

  </div>
</template>`
</script>

<template>
  <div class="max-w-4xl space-y-10 pb-20 pt-10">

    <div class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">Pixel Game Button</h1>
      <p class="text-xl text-zinc-400">
        A complex 3D pixel-art button with particles, scanlines, and high customizability.
      </p>
    </div>

    <AnimatedTabs :items="previewTabs" class="space-y-4">
      <template #preview>
        <div class="relative rounded-xl border border-zinc-800 bg-[#050505] mt-4 h-[600px] flex flex-col gap-12 items-center justify-center overflow-hidden">

          <PixelatedButton />

          <PixelatedButton
              :hue="120"
              label="LEVEL UP"
              sub-label="READY?"
          >
            <template #icon-left>
              <Crown class="w-6 h-6 text-yellow-300" />
            </template>
          </PixelatedButton>

          <PixelatedButton
              :hue="260"
              label="SETTINGS"
              sub-label="CONFIG"
              :scale="0.7"
              :show-particles="false"
          >
            <template #icon-left>
              <Ghost class="w-6 h-6" />
            </template>
            <template #icon-right>
              <Sword class="w-5 h-5" />
            </template>
          </PixelatedButton>

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
            <td class="px-4 py-3 font-mono text-purple-400">hue</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">350</td>
            <td class="px-4 py-3">Base hue (0-360) for the button theme.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">label</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">'START'</td>
            <td class="px-4 py-3">Main text label (can also use default slot).</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">subLabel</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">'GAME'</td>
            <td class="px-4 py-3">Smaller subtitle text below the main label.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">scale</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">1</td>
            <td class="px-4 py-3">Scales the entire button and particles up or down.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">showParticles</td>
            <td class="px-4 py-3 font-mono text-xs">boolean</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">true</td>
            <td class="px-4 py-3">Whether to show the floating background particles.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="space-y-6">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Slots</h2>
      <div class="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950">
        <table class="w-full text-sm text-left">
          <thead class="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400">
          <tr>
            <th class="px-4 py-3 font-medium">Slot</th>
            <th class="px-4 py-3 font-medium">Description</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800 text-zinc-300">
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">default</td>
            <td class="px-4 py-3">Main label content (overrides `label` prop).</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">subtitle</td>
            <td class="px-4 py-3">Subtitle content (overrides `subLabel` prop).</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">icon-left</td>
            <td class="px-4 py-3">Replaces the left-side icons.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">icon-right</td>
            <td class="px-4 py-3">Replaces the right-side icons.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="border-t border-zinc-800 pt-6 text-sm text-zinc-500 flex justify-end">
      <p>
        Inspired by
        <a
            href="https://uiverse.io/wolf_3808/gentle-jellyfish-74"
            target="_blank"
            rel="noopener noreferrer"
            class="text-zinc-300 hover:text-white underline underline-offset-4 transition-colors"
        >
          'wolf_3808'
        </a>
      </p>
    </div>

  </div>
</template>