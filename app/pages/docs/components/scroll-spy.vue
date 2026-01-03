<script setup lang="ts">
import {
  ScrollSpy,
  ScrollSpyNav,
  ScrollSpyLink,
  ScrollSpyViewport,
  ScrollSpySection
} from '@/components/ui/scroll-spy'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'
import { ref } from 'vue'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

const PREVIEW_TABS = [
  { label: 'Preview', slot: 'preview' },
  { label: 'Code', slot: 'code' }
]

const installCommands = {
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/scroll-spy.json`,
  manual: `npm install reka-ui @vueuse/core clsx tailwind-merge`
}

// Refs for the scrollable containers in the examples
const sidebarContainer = ref<HTMLElement | null>(null)
const navbarContainer = ref<HTMLElement | null>(null)

// 1. Sidebar Layout Code
const sidebarCode = `<script setup lang="ts">
import { ref } from 'vue'
import {
  ScrollSpy,
  ScrollSpyNav,
  ScrollSpyLink,
  ScrollSpyViewport,
  ScrollSpySection
} from '@/components/ui/scroll-spy'

// 1. Create a ref for the scrollable element
const container = ref<HTMLElement | null>(null)
<\/script>

<template>
  <ScrollSpy
    :container="container"
    orientation="horizontal"
    class="h-[400px] border rounded-lg overflow-hidden bg-zinc-950"
  >

    <div class="w-48 border-r border-zinc-800 p-4 bg-zinc-900/30">
      <ScrollSpyNav>
        <ScrollSpyLink value="sidebar-1">Introduction</ScrollSpyLink>
        <ScrollSpyLink value="sidebar-2">Features</ScrollSpyLink>
        <ScrollSpyLink value="sidebar-3">Pricing</ScrollSpyLink>
      </ScrollSpyNav>
    </div>

    <div ref="container" class="flex-1 overflow-y-auto p-8 scroll-smooth relative">
      <ScrollSpyViewport>
        <ScrollSpySection value="sidebar-1" class="h-[300px] space-y-4">
          <h3 class="text-xl font-bold">Introduction</h3>
          <p class="text-zinc-400 dark:text-zinc-600">Welcome to the introduction section.</p>
        </ScrollSpySection>

        <ScrollSpySection value="sidebar-2" class="h-[300px] space-y-4">
          <h3 class="text-xl font-bold">Features</h3>
          <p class="text-zinc-400 dark:text-zinc-600">Explore our amazing features.</p>
        </ScrollSpySection>

        <ScrollSpySection value="sidebar-3" class="h-[300px] space-y-4">
          <h3 class="text-xl font-bold">Pricing</h3>
          <p class="text-zinc-400 dark:text-zinc-600">Choose the plan that fits you best.</p>
        </ScrollSpySection>
      </ScrollSpyViewport>
    </div>
  </ScrollSpy>
</template>`

// 2. Navbar Layout Code
const navbarCode = `<script setup lang="ts">
import { ref } from 'vue'
import {
  ScrollSpy,
  ScrollSpyNav,
  ScrollSpyLink,
  ScrollSpyViewport,
  ScrollSpySection
} from '@/components/ui/scroll-spy'

// 1. Create a ref
const container = ref<HTMLElement | null>(null)
<\/script>

<template>
  <ScrollSpy
    :container="container"
    orientation="vertical"
    class="h-[400px] border rounded-lg overflow-hidden bg-zinc-950"
  >

    <div class="border-b border-zinc-800 p-4 bg-zinc-900/30 flex items-center justify-between">
      <span class="font-bold">Logo</span>
      <ScrollSpyNav>
        <ScrollSpyLink value="navbar-concept">Concept</ScrollSpyLink>
        <ScrollSpyLink value="navbar-design">Design</ScrollSpyLink>
        <ScrollSpyLink value="navbar-code">Code</ScrollSpyLink>
      </ScrollSpyNav>
    </div>

    <div ref="container" class="flex-1 overflow-y-auto p-8 scroll-smooth relative">
      <ScrollSpyViewport>
        <ScrollSpySection value="navbar-concept" class="h-[300px] space-y-4">
          <h3 class="text-xl font-bold">Concept</h3>
          <p class="text-zinc-400 dark:text-zinc-600">Understanding the core concept.</p>
        </ScrollSpySection>

        <ScrollSpySection value="navbar-design" class="h-[300px] space-y-4">
          <h3 class="text-xl font-bold">Design</h3>
          <p class="text-zinc-400 dark:text-zinc-600">Crafting the visual experience.</p>
        </ScrollSpySection>

        <ScrollSpySection value="navbar-code" class="h-[300px] space-y-4">
          <h3 class="text-xl font-bold">Code</h3>
          <p class="text-zinc-400 dark:text-zinc-600">Implementing the solution.</p>
        </ScrollSpySection>
      </ScrollSpyViewport>
    </div>
  </ScrollSpy>
</template>`

useSeoMeta({
  title: 'Scroll Spy Component for Vue & Nuxt',
  description: 'Automatically highlights navigation items based on scroll position.',
  ogTitle: 'Scroll Spy Component for Vue & Nuxt',
  ogDescription: 'Automatically highlights navigation items based on scroll position.',
})
</script>

<template>
  <div class="pb-5">
    <PageTitle
        title="Scroll Spy"
        description="A utility that automatically highlights navigation items based on scroll position."
    />
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
        <h3 class="text-xl font-semibold">Sidebar Layout</h3>
        <p class="text-zinc-400 dark:text-zinc-600 text-sm">
          Nav items placed vertically next to content.
        </p>

        <AnimatedTabs :items="PREVIEW_TABS" class="space-y-4">
          <template #preview>
            <div class="relative rounded-xl border border-edge bg-background flex flex-col items-center justify-center p-10">
              <ScrollSpy
                  :container="sidebarContainer"
                  orientation="horizontal"
                  class="w-full max-w-3xl h-[400px] border border-zinc-800 rounded-lg overflow-hidden flex bg-zinc-950"
              >
                <div class="w-40 border-r border-zinc-800 p-4 bg-zinc-900/30">
                  <ScrollSpyNav>
                    <ScrollSpyLink value="sidebar-1">Introduction</ScrollSpyLink>
                    <ScrollSpyLink value="sidebar-2">Features</ScrollSpyLink>
                    <ScrollSpyLink value="sidebar-3">Pricing</ScrollSpyLink>
                  </ScrollSpyNav>
                </div>
                <div ref="sidebarContainer" class="flex-1 overflow-y-auto p-8 scroll-smooth">
                  <ScrollSpyViewport>
                    <ScrollSpySection value="sidebar-1" class="h-[300px] p-4 border border-zinc-800 border-dashed rounded bg-zinc-900/20 mb-8">
                      <h3 class="text-lg font-bold">Introduction</h3>
                    </ScrollSpySection>
                    <ScrollSpySection value="sidebar-2" class="h-[300px] p-4 border border-zinc-800 border-dashed rounded bg-zinc-900/20 mb-8">
                      <h3 class="text-lg font-bold">Features</h3>
                    </ScrollSpySection>
                    <ScrollSpySection value="sidebar-3" class="h-[300px] p-4 border border-zinc-800 border-dashed rounded bg-zinc-900/20 mb-8">
                      <h3 class="text-lg font-bold">Pricing</h3>
                    </ScrollSpySection>
                    <div class="h-20" />
                  </ScrollSpyViewport>
                </div>
              </ScrollSpy>
            </div>
          </template>
          <template #code>
            <div class="mt-4">
              <CodeBlock :code="sidebarCode" lang="html"/>
            </div>
          </template>
        </AnimatedTabs>
      </div>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Navbar Layout</h3>
        <p class="text-zinc-400 dark:text-zinc-600 text-sm">
          Nav items placed horizontally above content.
        </p>

        <AnimatedTabs :items="PREVIEW_TABS" class="space-y-4">
          <template #preview>
            <div class="relative rounded-xl border border-edge bg-background flex flex-col items-center justify-center p-10">
              <ScrollSpy
                  :container="navbarContainer"
                  orientation="vertical"
                  class="w-full max-w-3xl h-[400px] border border-zinc-800 rounded-lg overflow-hidden flex bg-zinc-950"
              >
                <div class="border-b border-zinc-800 p-4 bg-zinc-900/30 flex justify-between items-center">
                  <span class="text-sm font-bold text-zinc-700 dark:text-zinc-300">Docs</span>
                  <ScrollSpyNav>
                    <ScrollSpyLink value="navbar-concept">Concept</ScrollSpyLink>
                    <ScrollSpyLink value="navbar-design">Design</ScrollSpyLink>
                    <ScrollSpyLink value="navbar-code">Code</ScrollSpyLink>
                  </ScrollSpyNav>
                </div>
                <div ref="navbarContainer" class="flex-1 overflow-y-auto p-8 scroll-smooth">
                  <ScrollSpyViewport>
                    <ScrollSpySection value="navbar-concept" class="h-[300px] p-4 border border-zinc-800 border-dashed rounded bg-zinc-900/20 mb-8">
                      <h3 class="text-lg font-bold">Concept</h3>
                    </ScrollSpySection>
                    <ScrollSpySection value="navbar-design" class="h-[300px] p-4 border border-zinc-800 border-dashed rounded bg-zinc-900/20 mb-8">
                      <h3 class="text-lg font-bold">Design</h3>
                    </ScrollSpySection>
                    <ScrollSpySection value="navbar-code" class="h-[300px] p-4 border border-zinc-800 border-dashed rounded bg-zinc-900/20 mb-8">
                      <h3 class="text-lg font-bold">Code</h3>
                    </ScrollSpySection>
                    <div class="h-20" />
                  </ScrollSpyViewport>
                </div>
              </ScrollSpy>
            </div>
          </template>
          <template #code>
            <div class="mt-4">
              <CodeBlock :code="navbarCode" lang="html"/>
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
            <td class="px-4 py-3 font-mono text-purple-400">container</td>
            <td class="px-4 py-3 font-mono text-xs">HTMLElement | null</td>
            <td class="px-4 py-3 font-mono text-xs">window</td>
            <td class="px-4 py-3">
              <strong>Crucial:</strong> A reference to the element that has <code>overflow-y: auto</code>. If omitted, it tracks the window scroll.
            </td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">orientation</td>
            <td class="px-4 py-3 font-mono text-xs">'vertical' | 'horizontal'</td>
            <td class="px-4 py-3 font-mono text-xs">'vertical'</td>
            <td class="px-4 py-3">Controls the flex direction of the root element.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">offset</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">0</td>
            <td class="px-4 py-3">Offset from the top when scrolling/detecting.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="h-g"/>

    <Divider/>

    <div class="mt-4 text-sm">
      <p class="text-zinc-500 text-sm">
        Adapted for Vue from the original React component by <a href="https://www.diceui.com/docs/components/scroll-spy" target="_blank" class="text-zinc-700 dark:text-zinc-300 underline underline-offset-4 hover:text-white transition-colors">DiceUI</a>.
      </p>
    </div>

  </div>
</template>