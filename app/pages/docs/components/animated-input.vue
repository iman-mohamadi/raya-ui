<script setup lang="ts">
import { AnimatedInput } from '@/components/ui/animated-input'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

const PREVIEW_TABS = [
  { label: 'Preview', slot: 'preview' },
  { label: 'Code', slot: 'code' }
]

const installCommands = {
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/animated-input.json`,
  manual: `npm install @vueuse/core clsx tailwind-merge`
}

const defaultCode = `<script setup lang="ts">
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

const customColorCode = `<script setup lang="ts">
import { AnimatedInput } from '@/components/ui/animated-input'
<\/script>

<template>
  <div class="w-full max-w-sm flex flex-col gap-2">
    <label class="text-sm font-medium">Custom Glow (Purple)</label>
    <AnimatedInput placeholder="Purple glow..." glow-color="#a855f7" />
  </div>
</template>`

useSeoMeta({
  title: 'Animated Input Component for Vue & Nuxt',
  description: 'A Vue and Nuxt compatible text input component featuring a mouse-following gradient border effect.',
  ogTitle: 'Animated Input Component for Vue & Nuxt',
  ogDescription: 'A Vue and Nuxt compatible text input component featuring a mouse-following gradient border effect.',
})
</script>

<template>
  <div class="pb-5">
    <PageTitle
        title="Animated Input"
        description="A text input with a mouse-following gradient border effect."
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
          <div class="relative rounded-xl border border-edge bg-background flex flex-col items-center justify-center min-h-[350px] p-10">
            <div class="w-full max-w-sm space-y-4">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Username</label>
                <AnimatedInput placeholder="johndoe" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
                <AnimatedInput placeholder="john@example.com" type="email" />
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock :code="defaultCode" lang="html"/>
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
        <CodeBlock :code="installCommands.manual"/>
      </div>
    </div>

    <div class="h-g"/>

    <Divider/>

    <div class="space-y-12 mt-4">
      <h2 class="scroll-m-20 text-3xl font-bold tracking-tight">More Examples</h2>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Custom Glow Color</h3>
        <p class="text-zinc-400 dark:text-zinc-600 text-sm">
          Customize the color of the glowing border effect.
        </p>

        <AnimatedTabs :items="PREVIEW_TABS" class="space-y-4">
          <template #preview>
            <div class="rounded-xl border border-edge bg-background flex flex-col items-center justify-center min-h-[250px] p-10">
              <div class="w-full max-w-sm flex flex-col gap-2">
                <label class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Custom Glow (Purple)</label>
                <AnimatedInput placeholder="Purple glow..." glow-color="#a855f7" />
              </div>
            </div>
          </template>
          <template #code>
            <div class="mt-4">
              <CodeBlock :code="customColorCode" lang="html"/>
            </div>
          </template>
        </AnimatedTabs>
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