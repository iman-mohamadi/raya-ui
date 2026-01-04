<script setup lang="ts">
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

const PREVIEW_TABS = [
  { label: 'Preview', slot: 'preview' },
  { label: 'Code', slot: 'code' }
]

const installCommands = {
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/animated-theme-toggler.json`,
  manual: `npm install lucide-vue-next clsx tailwind-merge`
}

const defaultCode = `<script setup lang="ts">
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
<\/script>

<template>
  <AnimatedThemeToggler />
</template>`

const customizedCode = `<template>
  <AnimatedThemeToggler class="rounded-full bg-secondary text-secondary-foreground w-10 h-10" />

  <AnimatedThemeToggler :duration="1000" />
</template>`

useSeoMeta({
  title: 'Animated Theme Toggler Component for Vue & Nuxt',
  description: 'A theme toggle button with a circular clip-path transition effect.',
  ogTitle: 'Animated Theme Toggler Component for Vue & Nuxt',
  ogDescription: 'A theme toggle button with a circular clip-path transition effect.',
})
</script>

<template>
  <div class="pb-5">
    <PageTitle
        title="Animated Theme Toggler"
        description="A theme toggle button that transitions between light and dark modes with a circular reveal animation."
    />
    <Divider/>

    <div class="mt-4">
      <Tabs default-value="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div class="relative rounded-xl border border-edge bg-background flex flex-col items-center justify-center min-h-[350px] p-10 gap-8">
            <AnimatedThemeToggler />
            <span class="text-sm text-muted-foreground">Click to see the effect</span>
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

      <div class="p-4 border border-amber-500/20 bg-amber-500/10 rounded-lg text-amber-500 dark:text-amber-200 text-sm">
        <strong>Note:</strong> This component relies on the <a href="https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API" target="_blank" class="underline">View Transitions API</a>. It will gracefully degrade to a standard toggle on browsers that don't support it.
      </div>
    </div>

    <div class="h-g"/>
    <Divider/>

    <div class="space-y-12 mt-4">
      <h2 class="scroll-m-20 text-3xl font-bold tracking-tight">Examples</h2>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Customization</h3>
        <p class="text-zinc-400 dark:text-zinc-600 text-sm">You can customize the appearance using standard Tailwind classes.</p>

        <AnimatedTabs :items="PREVIEW_TABS" class="space-y-4">
          <template #preview>
            <div class="relative rounded-xl border border-edge bg-background flex flex-col items-center justify-center min-h-[250px] p-10 gap-8">
              <div class="flex gap-4 items-center">
                <AnimatedThemeToggler class="rounded-full bg-zinc-800 text-white w-12 h-12 hover:bg-zinc-700" />
                <AnimatedThemeToggler class="border border-zinc-700 rounded-lg" :duration="1000" />
              </div>
            </div>
          </template>
          <template #code>
            <div class="mt-4">
              <CodeBlock :code="customizedCode" lang="html"/>
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
            <td class="px-4 py-3 font-mono text-purple-400">duration</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">400</td>
            <td class="px-4 py-3">Duration of the clip-path animation in milliseconds.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">class</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs">''</td>
            <td class="px-4 py-3">Custom classes for the button element.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>