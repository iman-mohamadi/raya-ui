<script setup lang="ts">
import { RayaButton } from '@/components/ui/raya-button'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'
import { Mail, Trash2 } from 'lucide-vue-next'

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
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/raya-button.json`,
  manual: `npm install class-variance-authority reka-ui`
}

const usageCode = `<script setup lang="ts">
import { RayaButton } from '@/components/ui/raya-button'
import { Mail, Trash2 } from 'lucide-vue-next'
<\/script>

<template>
  <div class="flex flex-col gap-8">

    <div class="space-y-3">
      <h3 class="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Primary Color</h3>
      <div class="flex flex-wrap gap-3 items-center">
        <RayaButton color="primary" variant="solid">Solid</RayaButton>
        <RayaButton color="primary" variant="soft">Soft</RayaButton>
        <RayaButton color="primary" variant="subtle">Subtle</RayaButton>
        <RayaButton color="primary" variant="outline">Outline</RayaButton>
        <RayaButton color="primary" variant="ghost">Ghost</RayaButton>
        <RayaButton color="primary" variant="link">Link</RayaButton>
      </div>
    </div>

    <div class="space-y-3">
      <h3 class="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Neutral Color</h3>
      <div class="flex flex-wrap gap-3 items-center">
        <RayaButton color="neutral" variant="solid">Solid</RayaButton>
        <RayaButton color="neutral" variant="soft">Soft</RayaButton>
        <RayaButton color="neutral" variant="subtle">Subtle</RayaButton>
        <RayaButton color="neutral" variant="outline">Outline</RayaButton>
        <RayaButton color="neutral" variant="ghost">Ghost</RayaButton>
        <RayaButton color="neutral" variant="link">Link</RayaButton>
      </div>
    </div>

    <div class="space-y-3">
      <h3 class="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Destructive Color</h3>
      <div class="flex flex-wrap gap-3 items-center">
        <RayaButton color="destructive" variant="solid">
          <Trash2 class="mr-2 h-4 w-4" /> Delete
        </RayaButton>
        <RayaButton color="destructive" variant="soft">Soft</RayaButton>
        <RayaButton color="destructive" variant="outline">Outline</RayaButton>
      </div>
    </div>

    <div class="space-y-3">
      <h3 class="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Sizes & States</h3>
      <div class="flex flex-wrap items-center gap-3">
        <RayaButton size="xs" color="neutral" variant="outline">XS</RayaButton>
        <RayaButton size="sm" color="neutral" variant="outline">SM</RayaButton>
        <RayaButton size="md" color="neutral" variant="outline">MD</RayaButton>
        <RayaButton size="lg" color="neutral" variant="outline">LG</RayaButton>
        <RayaButton size="xl" color="neutral" variant="outline">XL</RayaButton>
        <div class="w-px h-8 bg-zinc-800 mx-2"></div>
        <RayaButton loading color="primary" variant="soft">Loading</RayaButton>
        <RayaButton square variant="outline"><Mail class="h-4 w-4" /></RayaButton>
      </div>
    </div>

  </div>
</template>`
</script>

<template>
  <div class="max-w-4xl space-y-10 pb-20 pt-10">

    <div class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">Raya Button</h1>
      <p class="text-xl text-zinc-400">
        The ultimate button component. Inspired by Nuxt UI, built for Vue.
      </p>
    </div>

    <AnimatedTabs :items="previewTabs" class="space-y-4">
      <template #preview>
        <div class="rounded-xl border border-zinc-800 bg-neutral-950 mt-4 p-8 flex flex-col gap-8">

          <div class="space-y-3">
            <h3 class="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Primary Color</h3>
            <div class="flex flex-wrap gap-3 items-center">
              <RayaButton color="primary" variant="solid">Solid</RayaButton>
              <RayaButton color="primary" variant="soft">Soft</RayaButton>
              <RayaButton color="primary" variant="subtle">Subtle</RayaButton>
              <RayaButton color="primary" variant="outline">Outline</RayaButton>
              <RayaButton color="primary" variant="ghost">Ghost</RayaButton>
              <RayaButton color="primary" variant="link">Link</RayaButton>
            </div>
          </div>

          <div class="space-y-3">
            <h3 class="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Secondary Color</h3>
            <div class="flex flex-wrap gap-3 items-center">
              <RayaButton color="secondary" variant="solid">Solid</RayaButton>
              <RayaButton color="secondary" variant="soft">Soft</RayaButton>
              <RayaButton color="secondary" variant="subtle">Subtle</RayaButton>
              <RayaButton color="secondary" variant="outline">Outline</RayaButton>
              <RayaButton color="secondary" variant="ghost">Ghost</RayaButton>
            </div>
          </div>

          <div class="space-y-3">
            <h3 class="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Neutral Color</h3>
            <div class="flex flex-wrap gap-3 items-center">
              <RayaButton color="neutral" variant="solid">Solid</RayaButton>
              <RayaButton color="neutral" variant="soft">Soft</RayaButton>
              <RayaButton color="neutral" variant="subtle">Subtle</RayaButton>
              <RayaButton color="neutral" variant="outline">Outline</RayaButton>
              <RayaButton color="neutral" variant="ghost">Ghost</RayaButton>
              <RayaButton color="neutral" variant="link">Link</RayaButton>
            </div>
          </div>

          <div class="space-y-3">
            <h3 class="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Destructive Color</h3>
            <div class="flex flex-wrap gap-3 items-center">
              <RayaButton color="destructive" variant="solid">
                <Trash2 class="mr-2 h-4 w-4" /> Delete
              </RayaButton>
              <RayaButton color="destructive" variant="soft">Soft</RayaButton>
              <RayaButton color="destructive" variant="outline">Outline</RayaButton>
            </div>
          </div>

          <div class="space-y-3">
            <h3 class="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Sizes & States</h3>
            <div class="flex flex-wrap items-center gap-3">
              <RayaButton size="xs" color="neutral" variant="outline">XS</RayaButton>
              <RayaButton size="sm" color="neutral" variant="outline">SM</RayaButton>
              <RayaButton size="md" color="neutral" variant="outline">MD</RayaButton>
              <RayaButton size="lg" color="neutral" variant="outline">LG</RayaButton>
              <RayaButton size="xl" color="neutral" variant="outline">XL</RayaButton>
              <div class="w-px h-8 bg-zinc-800 mx-2"></div>
              <RayaButton loading color="primary" variant="soft">Loading</RayaButton>
              <RayaButton square variant="outline"><Mail class="h-4 w-4" /></RayaButton>
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
            <th class="px-4 py-3 font-medium">Values</th>
            <th class="px-4 py-3 font-medium">Default</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800 text-zinc-300">
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">color</td>
            <td class="px-4 py-3 font-mono text-xs">primary | secondary | neutral | destructive</td>
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
            <td class="px-4 py-3 font-mono text-purple-400">loading</td>
            <td class="px-4 py-3 font-mono text-xs">boolean</td>
            <td class="px-4 py-3 font-mono text-xs text-zinc-500">false</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="border-t border-zinc-800 pt-6 text-sm text-zinc-500 flex justify-end">
      <p>
        Inspired by
        <a
            href="https://ui.nuxt.com/docs/components/button"
            target="_blank"
            rel="noopener noreferrer"
            class="text-zinc-300 hover:text-white underline underline-offset-4 transition-colors"
        >
          Nuxt UI
        </a>
      </p>
    </div>
  </div>
</template>