<script setup lang="ts">
import { RayaButton } from '@/components/ui/raya-button'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'
import { Mail, Trash2, Check, AlertTriangle, Info, ArrowRight } from 'lucide-vue-next'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

useSeoMeta({
  title: 'Raya Button Component for Vue & Nuxt',
  description: 'The ultimate button component inspired by Nuxt UI, built for Vue and Nuxt applications.',
  ogTitle: 'Raya Button Component for Vue & Nuxt',
  ogDescription: 'The ultimate button component inspired by Nuxt UI, built for Vue and Nuxt applications.',
})

const previewTabs = [
  { label: 'Preview', slot: 'preview' },
  { label: 'Code', slot: 'code' }
]

const installTabs = [
  { label: 'CLI', slot: 'cli' },
  { label: 'Manual', slot: 'manual' },
  { label: 'CSS (Required)', slot: 'css' }
]

const installCommands = {
  npm: `npx shadcn-vue@latest add ${config?.baseUrl || 'https://raya-ui.com'}/registry/raya-button.json`,
  manual: `npm install class-variance-authority reka-ui lucide-vue-next`,
  css: `:root {
    /* Feedback Colors */
    --success: oklch(0.62 0.19 145.4);
    --success-foreground: oklch(0.98 0 0);

    --warning: oklch(0.75 0.15 70);
    --warning-foreground: oklch(0.98 0 0);

    --info: oklch(0.60 0.16 255);
    --info-foreground: oklch(0.98 0 0);

    /* Map Error to Destructive */
    --error: var(--destructive);
    --error-foreground: oklch(1.00 0 0);
}

.dark {
    --success: oklch(0.55 0.18 145.4);
    --success-foreground: oklch(1 0 0);

    --warning: oklch(0.70 0.15 70);
    --warning-foreground: oklch(0.1 0 0);

    --info: oklch(0.55 0.16 255);
    --info-foreground: oklch(1 0 0);
}

@theme inline {
    /* Semantic Color Mapping */
    --color-success: var(--success);
    --color-success-content: var(--success-foreground);

    --color-warning: var(--warning);
    --color-warning-content: var(--warning-foreground);

    --color-info: var(--info);
    --color-info-content: var(--info-foreground);

    --color-error: var(--error);
    --color-error-content: var(--error-foreground);

    /* Utility Mappings used by Button */
    --color-primary-content: var(--primary-foreground);
    --color-secondary-content: var(--secondary-foreground);
    --color-inverted: var(--foreground);
    --color-default: var(--foreground);
    --color-elevated: var(--muted);
    --color-accented: var(--accent);
}`
}

const usageCode = `<script setup lang="ts">
import { RayaButton } from '@/components/ui/raya-button'
<\/script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-2">
      <RayaButton variant="solid">Solid</RayaButton>
      <RayaButton variant="outline">Outline</RayaButton>
      <RayaButton variant="soft">Soft</RayaButton>
      <RayaButton variant="subtle">Subtle</RayaButton>
      <RayaButton variant="ghost">Ghost</RayaButton>
      <RayaButton variant="link">Link</RayaButton>
    </div>

    <div class="flex gap-2">
      <RayaButton color="primary">Primary</RayaButton>
      <RayaButton color="secondary">Secondary</RayaButton>
      <RayaButton color="success">Success</RayaButton>
      <RayaButton color="warning">Warning</RayaButton>
      <RayaButton color="error">Error</RayaButton>
      <RayaButton color="info">Info</RayaButton>
      <RayaButton color="neutral">Neutral</RayaButton>
    </div>
  </div>
</template>`
</script>

<template>
  <div class="pb-5">
    <PageTitle
        title="Raya Button"
        description="The ultimate button component. Inspired by Nuxt UI, built for Vue."
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
          <div class="rounded-xl border border-zinc-800 bg-neutral-950 flex flex-col gap-8 p-8 min-h-[350px]">
            <div class="space-y-3">
              <h3 class="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Variants (Primary)</h3>
              <div class="flex flex-wrap gap-3 items-center">
                <RayaButton color="primary" variant="solid">Solid</RayaButton>
                <RayaButton color="primary" variant="outline">Outline</RayaButton>
                <RayaButton color="primary" variant="soft">Soft</RayaButton>
                <RayaButton color="primary" variant="subtle">Subtle</RayaButton>
                <RayaButton color="primary" variant="ghost">Ghost</RayaButton>
                <RayaButton color="primary" variant="link">Link</RayaButton>
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Semantic Colors</h3>
              <div class="flex flex-wrap gap-3 items-center">
                <RayaButton color="success" variant="solid"><Check class="h-4 w-4 mr-1.5" />Success</RayaButton>
                <RayaButton color="warning" variant="solid"><AlertTriangle class="h-4 w-4 mr-1.5" />Warning</RayaButton>
                <RayaButton color="error" variant="solid"><Trash2 class="h-4 w-4 mr-1.5" />Error</RayaButton>
                <RayaButton color="info" variant="solid"><Info class="h-4 w-4 mr-1.5" />Info</RayaButton>
                <RayaButton color="neutral" variant="solid">Neutral</RayaButton>
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Soft Variants</h3>
              <div class="flex flex-wrap gap-3 items-center">
                <RayaButton color="success" variant="soft">Success</RayaButton>
                <RayaButton color="warning" variant="soft">Warning</RayaButton>
                <RayaButton color="error" variant="soft">Error</RayaButton>
                <RayaButton color="info" variant="soft">Info</RayaButton>
                <RayaButton color="neutral" variant="soft">Neutral</RayaButton>
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Sizes & States</h3>
              <div class="flex flex-wrap items-center gap-3">
                <RayaButton size="xs">XS</RayaButton>
                <RayaButton size="sm">SM</RayaButton>
                <RayaButton size="md">MD</RayaButton>
                <RayaButton size="lg">LG</RayaButton>
                <RayaButton size="xl">XL</RayaButton>
                <div class="w-px h-8 bg-zinc-800 mx-2"></div>
                <RayaButton loading color="primary" variant="subtle">Loading</RayaButton>
                <RayaButton square variant="outline"><Mail class="h-4 w-4" /></RayaButton>
              </div>
            </div>
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
      <AnimatedTabs :items="installTabs" class="space-y-6">

        <template #cli>
          <div class="space-y-4">
            <div class="mt-4">
              <CodeBlock :code="installCommands.npm" />
            </div>
            <div class="rounded-lg border border-amber-900/50 bg-amber-950/10 p-4 text-sm text-amber-200">
              <strong class="font-semibold text-amber-100">Note:</strong> You must also update your <code>main.css</code> (see the CSS tab) for colors to work.
            </div>
          </div>
        </template>

        <template #manual>
          <div class="mt-4 space-y-4">
            <p class="text-sm text-zinc-400">1. Install dependencies:</p>
            <CodeBlock :code="installCommands.manual" />

            <p class="text-sm text-zinc-400">2. Copy the component code into <code>components/ui/raya-button</code>.</p>
          </div>
        </template>

        <template #css>
          <div class="mt-4 space-y-4">
            <div>
              <h3 class="font-semibold text-white">Update main.css</h3>
              <p class="text-sm text-zinc-400 mt-1">
                Add these variables to your <code>assets/css/main.css</code> file. This is required for the semantic colors (success, warning, info) and utility classes.
              </p>
            </div>
            <div class="border border-zinc-800 rounded-md">
              <CodeBlock :code="installCommands.css" lang="css" />
            </div>
          </div>
        </template>

      </AnimatedTabs>
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
            <th class="px-4 py-3 font-medium">Values</th>
            <th class="px-4 py-3 font-medium">Default</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800 text-zinc-300">
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">color</td>
            <td class="px-4 py-3 font-mono text-xs">primary | secondary | neutral | success | info | warning | error</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">primary</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">variant</td>
            <td class="px-4 py-3 font-mono text-xs">solid | outline | soft | subtle | ghost | link</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">solid</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">size</td>
            <td class="px-4 py-3 font-mono text-xs">xs | sm | md | lg | xl</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">md</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">as</td>
            <td class="px-4 py-3 font-mono text-xs">string | Component</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">"button"</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">asChild</td>
            <td class="px-4 py-3 font-mono text-xs">boolean</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">false</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>