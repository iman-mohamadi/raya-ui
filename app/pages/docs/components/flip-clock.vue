<script setup lang="ts">
import { FlipClock } from '@/components/ui/flip-clock'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

const PREVIEW_TABS = [
  { label: 'Preview', slot: 'preview' },
  { label: 'Code', slot: 'code' }
]

const installCommands = {
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/flip-clock.json`,
  manual: `npm install clsx tailwind-merge class-variance-authority`
}

const defaultCode = `<script setup lang="ts">
import { FlipClock } from '@/components/ui/flip-clock'
<\/script>

<template>
  <div class="flex flex-col items-center gap-8">
    <FlipClock />
  </div>
</template>`

const countdownCode = `<script setup lang="ts">
import { FlipClock } from '@/components/ui/flip-clock'

// 24 hours from now
const target = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
<\/script>

<template>
  <FlipClock
    countdown
    :target-date="target"
    variant="secondary"
  />
</template>`

const sizeVariantCode = `<script setup lang="ts">
import { FlipClock } from '@/components/ui/flip-clock'
<\/script>

<template>
  <div class="space-y-8 flex flex-col items-center">
    <FlipClock size="sm" variant="outline" />
    <FlipClock size="lg" variant="destructive" />
  </div>
</template>`

useSeoMeta({
  title: 'Flip Clock Component for Vue & Nuxt',
  description: 'A retro-style flip clock component with countdown and real-time modes.',
  ogTitle: 'Flip Clock Component for Vue & Nuxt',
  ogDescription: 'A retro-style flip clock component with countdown and real-time modes.',
})
</script>

<template>
  <div class="pb-5">
    <PageTitle
        title="Flip Clock"
        description="A retro-style mechanical flip clock with real-time and countdown modes."
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
            <FlipClock />
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
      <h2 class="scroll-m-20 text-3xl font-bold tracking-tight">Examples</h2>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Countdown Mode</h3>
        <p class="text-zinc-400 dark:text-zinc-600 text-sm">
          Use the <code>countdown</code> prop with a <code>targetDate</code>.
        </p>

        <AnimatedTabs :items="PREVIEW_TABS" class="space-y-4">
          <template #preview>
            <div class="rounded-xl border border-edge bg-background flex flex-col items-center justify-center min-h-[250px] p-10">
              <FlipClock countdown :target-date="new Date(new Date().getTime() + 24 * 60 * 60 * 1000)" variant="secondary" />
            </div>
          </template>
          <template #code>
            <div class="mt-4">
              <CodeBlock :code="countdownCode" lang="html"/>
            </div>
          </template>
        </AnimatedTabs>
      </div>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Sizes & Variants</h3>
        <p class="text-zinc-400 dark:text-zinc-600 text-sm">
          Supports multiple sizes (sm, md, lg, xl) and standard theme variants.
        </p>

        <AnimatedTabs :items="PREVIEW_TABS" class="space-y-4">
          <template #preview>
            <div class="rounded-xl border border-edge bg-background flex flex-col items-center justify-center min-h-[250px] gap-8 p-10">
              <FlipClock size="sm" variant="outline" />
              <FlipClock size="lg" variant="destructive" />
            </div>
          </template>
          <template #code>
            <div class="mt-4">
              <CodeBlock :code="sizeVariantCode" lang="html"/>
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
            <td class="px-4 py-3 font-mono text-purple-400">countdown</td>
            <td class="px-4 py-3 font-mono text-xs">boolean</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">false</td>
            <td class="px-4 py-3">If true, counts down to targetDate. Otherwise shows current time.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">targetDate</td>
            <td class="px-4 py-3 font-mono text-xs">Date | string</td>
            <td class="px-4 py-3 font-mono text-xs">-</td>
            <td class="px-4 py-3">Required if countdown is true.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">size</td>
            <td class="px-4 py-3 font-mono text-xs">'sm' | 'md' | 'lg' | 'xl'</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">'md'</td>
            <td class="px-4 py-3">The size of the clock digits.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">variant</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">'default'</td>
            <td class="px-4 py-3">Color theme variant (default, secondary, destructive, outline, muted).</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">showDays</td>
            <td class="px-4 py-3 font-mono text-xs">'auto' | 'always' | 'never'</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">'auto'</td>
            <td class="px-4 py-3">Controls visibility of the days section in countdown mode.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>