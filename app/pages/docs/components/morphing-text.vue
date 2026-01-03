<script setup lang="ts">
import { MorphingText } from '@/components/ui/morphing-text'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

useSeoMeta({
  title: 'Morphing Text Component for Vue & Nuxt',
  description: 'A text animation component for Vue and Nuxt that morphs between strings using SVG filters and blur effects.',
  ogTitle: 'Morphing Text Component for Vue & Nuxt',
  ogDescription: 'A text animation component for Vue and Nuxt that morphs between strings using SVG filters and blur effects.',
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
  <div class="pb-5">
    <PageTitle
        title="Morphing Text"
        description="A text animation that morphs between strings using SVG filters and blur effects."
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
          <div class="relative rounded-xl border border-zinc-800 bg-neutral-950 flex items-center justify-center min-h-[350px] overflow-hidden p-10">
            <MorphingText
                :texts="['Raya', 'UI', 'Is', 'Awesome']"
                class="text-white"
            />
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
        <p class="text-sm text-zinc-400 dark:text-zinc-600">Or manually:</p>
        <div class="space-y-2">
          <p class="text-sm text-zinc-400 dark:text-zinc-600">Install dependencies:</p>
          <CodeBlock :code="installCommands.manual"  />
          <p class="text-sm text-zinc-400 dark:text-zinc-600 mt-4">Copy the component code into your project.</p>
        </div>
      </div>
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