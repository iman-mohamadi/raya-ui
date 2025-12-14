<script setup lang="ts">
import { ref } from 'vue'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'
import { Button } from '@/components/ui/button'
import {
  User, Lock, Settings, Bell, Archive, Calendar,
  Mail, MessageCircle, Star, Trash, ArrowRight, ArrowLeft
} from 'lucide-vue-next'

definePageMeta({ layout: 'docs' })

// --- Data ---
const items = [
  { label: 'Account', icon: User, content: 'Manage your account info.' },
  { label: 'Password', icon: Lock, content: 'Change your password.' },
  { label: 'Notifications', icon: Bell, content: 'Configure notifications.' },
  { label: 'Settings', icon: Settings, content: 'Advanced settings.' }
]

const manyItems = [
  { label: 'Account', icon: User },
  { label: 'Password', icon: Lock },
  { label: 'Notifications', icon: Bell },
  { label: 'Settings', icon: Settings },
  { label: 'Messages', icon: MessageCircle },
  { label: 'Inbox', icon: Mail },
  { label: 'Calendar', icon: Calendar },
  { label: 'Favorites', icon: Star },
  { label: 'Archive', icon: Archive },
  { label: 'Trash', icon: Trash }
]

// Controlled State Example
const controlledIndex = ref(0)
const nextTab = () => controlledIndex.value = (controlledIndex.value + 1) % items.length
const prevTab = () => controlledIndex.value = (controlledIndex.value - 1 + items.length) % items.length

// --- Tabs Configuration ---
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
  npm: 'npx shadcn-vue@latest add https://enzo-ui.vercel.app/registry/animated-tabs.json',
  manual: `npm install @vueuse/core`
}

const usageCode = `<script setup lang="ts">
import { AnimatedTabs } from '@/components/ui/animated-tabs'

const items = [
  { label: 'Account', content: 'Account content' },
  { label: 'Password', content: 'Password content' }
]
<\/script>

<template>
  <AnimatedTabs :items="items" />
</template>`

const verticalCode = `<template>
  <AnimatedTabs
    :items="items"
    orientation="vertical"
    class="w-64"
  />
</template>`

const controlledCode = `<script setup lang="ts">
const index = ref(0)
<\/script>

<template>
  <div class="space-y-4">
    <div class="flex gap-2">
      <Button @click="index--">Prev</Button>
      <Button @click="index++">Next</Button>
    </div>

    <AnimatedTabs v-model="index" :items="items" />
  </div>
</template>`

const linkCode = `<template>
  <AnimatedTabs
    :items="items"
    variant="link"
  />
</template>`
</script>

<template>
  <div class="max-w-4xl space-y-10 pb-20 pt-10">

    <div class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">Animated Tabs</h1>
      <p class="text-xl text-zinc-400">
        A direction-aware, draggable carousel tabs component.
      </p>
    </div>

    <AnimatedTabs :items="previewTabs" class="space-y-4">
      <template #preview>
        <div class="relative rounded-xl border border-zinc-800 bg-zinc-950/50 mt-4 p-10 flex flex-col items-center justify-center min-h-[350px]">
          <div class="w-full max-w-md">
            <AnimatedTabs :items="items" />
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
          <CodeBlock :code="installCommands.manual"  />
        </template>
      </AnimatedTabs>
    </div>

    <div class="space-y-12">
      <h2 class="scroll-m-20 text-3xl font-bold tracking-tight">Examples</h2>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Vertical Orientation</h3>
        <p class="text-zinc-400 text-sm">Stack tabs vertically using the <code>orientation</code> prop.</p>

        <div class="grid md:grid-cols-2 gap-6 items-start">
          <div class="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 flex justify-center">
            <AnimatedTabs :items="items" orientation="vertical" class="w-64" />
          </div>
          <CodeBlock :code="verticalCode" lang="html" class="my-0 h-full" />
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Link Variant</h3>
        <p class="text-zinc-400 text-sm">A minimal underline style, perfect for sub-navigation.</p>

        <div class="rounded-xl border border-zinc-800 bg-zinc-950/50 p-10 flex justify-center">
          <div class="w-full max-w-md">
            <AnimatedTabs :items="items" variant="link" />
          </div>
        </div>
        <CodeBlock :code="linkCode" lang="html" />
      </div>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Controlled State</h3>
        <p class="text-zinc-400 text-sm">Use <code>v-model</code> to control the active tab programmatically.</p>

        <div class="rounded-xl border border-zinc-800 bg-zinc-950/50 p-10 flex flex-col items-center gap-6">
          <div class="flex gap-4">
            <Button variant="outline" size="sm" @click="prevTab">
              <ArrowLeft class="w-4 h-4 mr-2" /> Prev
            </Button>
            <Button variant="outline" size="sm" @click="nextTab">
              Next <ArrowRight class="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div class="w-full max-w-md">
            <AnimatedTabs v-model="controlledIndex" :items="items" />
          </div>
          <p class="text-xs text-zinc-500 font-mono">Active Index: {{ controlledIndex }}</p>
        </div>
        <CodeBlock :code="controlledCode" lang="html" />
      </div>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Draggable Carousel</h3>
        <p class="text-zinc-400 text-sm">
          When items exceed the container width, the list becomes scrollable and draggable.
        </p>

        <div class="rounded-xl border border-zinc-800 bg-zinc-950/50 p-10 flex justify-center overflow-hidden">
          <div class="w-[350px]">
            <AnimatedTabs :items="manyItems" :content="false" />
          </div>
        </div>
      </div>

    </div>

    <div class="space-y-6 pt-10">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Props</h2>
      <div class="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950">
        <table class="w-full text-sm text-left">
          <thead class="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400">
          <tr>
            <th class="px-4 py-3 font-medium">Prop</th>
            <th class="px-4 py-3 font-medium">Default</th>
            <th class="px-4 py-3 font-medium">Description</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800 text-zinc-300">
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">items</td>
            <td class="px-4 py-3 font-mono text-xs">[]</td>
            <td class="px-4 py-3">Array of tab objects (label, icon, content).</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">variant</td>
            <td class="px-4 py-3 font-mono text-xs">'pill'</td>
            <td class="px-4 py-3">Visual style. Options: <code>'pill'</code>, <code>'link'</code>.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">orientation</td>
            <td class="px-4 py-3 font-mono text-xs">'horizontal'</td>
            <td class="px-4 py-3">Layout direction. <code>'vertical'</code> stacks items.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">v-model</td>
            <td class="px-4 py-3 font-mono text-xs">undefined</td>
            <td class="px-4 py-3">The active tab index (0-based).</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">content</td>
            <td class="px-4 py-3 font-mono text-xs">true</td>
            <td class="px-4 py-3">Whether to render the content panel below the tabs.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>