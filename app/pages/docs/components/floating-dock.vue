<script setup lang="ts">
import {
  Home, Terminal, CircleUser, Settings,
  LayoutGrid, FolderGit2, Ghost
} from 'lucide-vue-next'
import { FloatingDock } from '@/components/ui/floating-dock'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

// --- Demo Data ---
const dockItems = [
  { title: 'Home', icon: Home, href: '#' },
  { title: 'Products', icon: Terminal, href: '#' },
  { title: 'Components', icon: LayoutGrid, href: '#' },
  { title: 'Changelog', icon: FolderGit2, href: '#' },
  { title: 'Aceternity UI', icon: Ghost, href: '#' }, // Just an easter egg :)
  { title: 'Profile', icon: CircleUser, href: '#' },
  { title: 'Settings', icon: Settings, href: '#' },
]

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
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/floating-dock.json`,
  manual: `npm install @vueuse/core clsx tailwind-merge`
}

const usageCode = `<script setup lang="ts">
import { FloatingDock } from '@/components/ui/floating-dock'
import {
  Home, Terminal, LayoutGrid, Settings
} from 'lucide-vue-next'

const items = [
  { title: 'Home', icon: Home, href: '#' },
  { title: 'Terminal', icon: Terminal, href: '#' },
  { title: 'Components', icon: LayoutGrid, href: '#' },
  { title: 'Settings', icon: Settings, href: '#' },
]
<\/script>

<template>
  <div class="h-[200px] flex items-center justify-center">
    <FloatingDock :items="items" />
  </div>
</template>`
</script>

<template>
  <div class="max-w-4xl space-y-10 pb-20 pt-10">

    <div class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">Floating Dock</h1>
      <p class="text-xl text-zinc-400">
        A Mac-OS style dock that floats and scales items based on mouse proximity.
      </p>
    </div>

    <AnimatedTabs :items="previewTabs" class="space-y-4">
      <template #preview>
        <div class="relative rounded-xl border border-zinc-800 bg-neutral-950 mt-4 h-[400px] flex items-center justify-center">

          <div class="absolute inset-0 bg-neutral-900/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

          <FloatingDock
              :items="dockItems"
              desktop-class="absolute bottom-10"
              mobile-class="absolute bottom-10 right-10"
          />

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

  </div>
</template>