<script setup lang="ts">
import { BackgroundBeams } from '@/components/ui/background-beams'
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

// --- Code Snippets ---
const installCommands = {
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/background-beams.json`,
  manual: `npm install clsx tailwind-merge`
}

const usageCode = `<script setup lang="ts">
import { BackgroundBeams } from '@/components/ui/background-beams'
<\/script>

<template>
  <div class="relative h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
    <div class="max-w-2xl mx-auto p-4 z-10">
      <h1 class="text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-bold">
        Raya UI
      </h1>
      <p class="text-neutral-500 text-center mt-2">
        Customizable background beams with props.
      </p>
    </div>

    <BackgroundBeams
      colorFrom="#14b8a6"
      colorMid="#3b82f6"
      colorTo="#a855f7"
      :duration="15"
    />
  </div>
</template>`
</script>

<template>
  <div class="max-w-4xl space-y-10 pb-20 pt-10">

    <div class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">Background Beams</h1>
      <p class="text-xl text-zinc-400">
        Multiple background beams that traverse the container, creating a stunning visual effect.
      </p>
    </div>

    <AnimatedTabs :items="previewTabs" class="space-y-4">
      <template #preview>
        <div class="relative overflow-hidden rounded-xl border border-zinc-800 bg-neutral-950 mt-4 h-[500px] flex flex-col items-center justify-center antialiased">

          <div class="max-w-2xl mx-auto p-4 relative z-10">
            <h1 class="text-4xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold tracking-tight">
              Raya UI
            </h1>
            <p class="text-neutral-500 max-w-lg mx-auto my-4 text-sm text-center">
              <span class="text-teal-500 font-medium">Raya</span> (Persian: رایا) means
              <span class="text-neutral-300">Thought</span> and <span class="text-neutral-300">Vision</span>.
              <br/>
              A collection of UI primitives crafted with precision and intelligence for modern dashboards.
            </p>

            <div class="flex justify-center gap-2 mt-6">
              <input
                  type="text"
                  placeholder="raya-ui"
                  disabled
                  class="rounded-full border border-neutral-800 focus:ring-2 focus:ring-teal-500 w-64 bg-neutral-900/50 text-zinc-400 text-sm text-center p-2.5 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <BackgroundBeams />
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
      <div class="overflow-x-auto rounded-lg border border-border bg-card">
        <table class="w-full text-sm text-left">
          <thead class="border-b border-border bg-muted/50 text-muted-foreground">
          <tr>
            <th class="px-4 py-3 font-medium">Prop</th>
            <th class="px-4 py-3 font-medium">Type</th>
            <th class="px-4 py-3 font-medium">Default</th>
            <th class="px-4 py-3 font-medium">Description</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-border text-foreground">
          <tr>
            <td class="px-4 py-3 font-mono text-primary">colorFrom</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs">'#18CCFC'</td>
            <td class="px-4 py-3">The starting color of the beam gradient.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-primary">colorMid</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs">'#6344F5'</td>
            <td class="px-4 py-3">The middle color of the beam gradient.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-primary">colorTo</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs">'#AE48FF'</td>
            <td class="px-4 py-3">The ending color of the beam gradient.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-primary">duration</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">10</td>
            <td class="px-4 py-3">Base duration of the animation in seconds.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-primary">delay</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">0</td>
            <td class="px-4 py-3">Base delay of the animation in seconds.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>