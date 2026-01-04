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

const container1 = ref<HTMLElement | null>(null)
const container2 = ref<HTMLElement | null>(null)
const container3 = ref<HTMLElement | null>(null)

// 1. Sidebar Code (Corrected: orientation="vertical")
const sidebarCode = `<script setup lang="ts">
import { ref } from 'vue'
import { ScrollSpy, ScrollSpyNav, ScrollSpyLink, ScrollSpyViewport, ScrollSpySection } from '@/components/ui/scroll-spy'

const container = ref<HTMLElement | null>(null)
<\/script>

<template>
  <ScrollSpy :container="container" orientation="vertical" class="flex w-full h-[400px] border rounded-lg bg-zinc-950 overflow-hidden">
    <div class="w-48 border-r border-zinc-800 p-4 bg-zinc-900/30">
      <h4 class="mb-4 text-xs font-semibold uppercase text-zinc-500">Docs</h4>
      <ScrollSpyNav indicator indicator-position="before">
        <ScrollSpyLink value="s1-intro" class="block py-2 text-sm text-zinc-500 hover:text-white transition-colors">Introduction</ScrollSpyLink>
        <ScrollSpyLink value="s1-install" class="block py-2 text-sm text-zinc-500 hover:text-white transition-colors">Installation</ScrollSpyLink>
        <ScrollSpyLink value="s1-config" class="block py-2 text-sm text-zinc-500 hover:text-white transition-colors">Configuration</ScrollSpyLink>
      </ScrollSpyNav>
    </div>

    <div ref="container" class="flex-1 overflow-y-auto p-8 scroll-smooth relative">
      <ScrollSpyViewport>
        <ScrollSpySection value="s1-intro" class="h-[250px] space-y-2">
          <h2 class="text-xl font-bold">Introduction</h2>
          <p class="text-zinc-400">Sidebar layout with active indicator.</p>
        </ScrollSpySection>
        <ScrollSpySection value="s1-install" class="h-[250px] space-y-2">
          <h2 class="text-xl font-bold">Installation</h2>
          <p class="text-zinc-400">Scroll down to see it move.</p>
        </ScrollSpySection>
        <ScrollSpySection value="s1-config" class="h-[250px] space-y-2">
          <h2 class="text-xl font-bold">Configuration</h2>
          <p class="text-zinc-400">Fully customizable.</p>
        </ScrollSpySection>
      </ScrollSpyViewport>
    </div>
  </ScrollSpy>
</template>`

// 2. Navbar Code (Corrected: orientation="horizontal")
const navbarCode = `<template>
  <ScrollSpy :container="container" orientation="horizontal" class="flex flex-col h-[400px] border rounded-lg bg-zinc-950 overflow-hidden">
    <div class="border-b border-zinc-800 p-4 bg-zinc-900/30 flex justify-between items-center shrink-0">
      <span class="font-bold">Logo</span>
      <ScrollSpyNav indicator indicator-position="after" class="gap-6">
        <ScrollSpyLink value="n-1" class="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Concept</ScrollSpyLink>
        <ScrollSpyLink value="n-2" class="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Design</ScrollSpyLink>
        <ScrollSpyLink value="n-3" class="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Code</ScrollSpyLink>
      </ScrollSpyNav>
    </div>

    <div ref="container" class="flex-1 overflow-y-auto p-8 scroll-smooth">
      <ScrollSpyViewport>
        </ScrollSpyViewport>
    </div>
  </ScrollSpy>
</template>`

// 3. Right Nav Code
const rightNavCode = `<template>
  <ScrollSpy :container="container" orientation="vertical" class="flex w-full h-[400px] border rounded-lg bg-zinc-950 overflow-hidden">
    <div ref="container" class="flex-1 overflow-y-auto p-8 scroll-smooth">
      <ScrollSpyViewport>
        </ScrollSpyViewport>
    </div>

    <div class="w-48 border-l border-zinc-800 p-4 bg-zinc-900/30">
      <h4 class="mb-4 text-xs font-semibold uppercase text-zinc-500 text-right">On this page</h4>
      <ScrollSpyNav indicator indicator-position="after" class="items-end">
        <ScrollSpyLink value="r-1" class="block py-2 text-right">Overview</ScrollSpyLink>
        <ScrollSpyLink value="r-2" class="block py-2 text-right">Features</ScrollSpyLink>
        <ScrollSpyLink value="r-3" class="block py-2 text-right">Pricing</ScrollSpyLink>
      </ScrollSpyNav>
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
  <div class="pb-10">
    <PageTitle
        title="Scroll Spy"
        description="A utility that automatically highlights navigation items based on scroll position."
    />
    <Divider/>

    <div class="mt-4">
      <h2 class="scroll-m-20 text-xl font-semibold tracking-tight mb-4">Sidebar Layout (Main)</h2>
      <Tabs default-value="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div class="relative rounded-xl border border-zinc-800 bg-zinc-950/50 flex flex-col items-center justify-center p-4 md:p-10">
            <ScrollSpy
                :container="container1"
                orientation="vertical"
                class="flex w-full max-w-3xl h-[400px] border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950 shadow-xl"
            >
              <div class="w-48 border-r border-zinc-800 p-6 bg-zinc-900/30 hidden sm:block">
                <h4 class="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Docs</h4>
                <ScrollSpyNav>
                  <ScrollSpyLink value="s1-intro" class="block py-2 text-sm text-zinc-500 hover:text-white transition-colors no-underline">
                    Introduction
                  </ScrollSpyLink>
                  <ScrollSpyLink value="s1-install" class="block py-2 text-sm text-zinc-500 hover:text-white transition-colors no-underline">
                    Installation
                  </ScrollSpyLink>
                  <ScrollSpyLink value="s1-config" class="block py-2 text-sm text-zinc-500 hover:text-white transition-colors no-underline">
                    Configuration
                  </ScrollSpyLink>
                </ScrollSpyNav>
              </div>
              <div ref="container1" class="flex-1 overflow-y-auto p-8 scroll-smooth relative">
                <ScrollSpyViewport class="space-y-16 pb-32">
                  <ScrollSpySection value="s1-intro" class="space-y-2">
                    <h2 class="text-2xl font-bold">Introduction</h2>
                    <p class="text-zinc-400">Sidebar layout uses <code>orientation="vertical"</code>.</p>
                    <div class="h-32 bg-zinc-900/50 border border-zinc-800 border-dashed rounded"/>
                  </ScrollSpySection>
                  <ScrollSpySection value="s1-install" class="space-y-2">
                    <h2 class="text-2xl font-bold">Installation</h2>
                    <p class="text-zinc-400">The indicator uses <code>indicator="before"</code>.</p>
                    <div class="h-32 bg-zinc-900/50 border border-zinc-800 border-dashed rounded"/>
                  </ScrollSpySection>
                  <ScrollSpySection value="s1-config" class="space-y-2">
                    <h2 class="text-2xl font-bold">Configuration</h2>
                    <p class="text-zinc-400">Customize offsets and behavior easily.</p>
                    <div class="h-32 bg-zinc-900/50 border border-zinc-800 border-dashed rounded"/>
                  </ScrollSpySection>
                </ScrollSpyViewport>
              </div>
            </ScrollSpy>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock :code="sidebarCode" lang="html"/>
        </TabsContent>
      </Tabs>
    </div>

    <div class="h-g"/>
    <Divider/>

    <div class="space-y-6 mt-4">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Installation</h2>
      <div class="space-y-4">
        <CodeBlock :code="installCommands.npm"/>
        <p class="text-sm text-zinc-400">Or manually:</p>
        <CodeBlock :code="installCommands.manual"/>
      </div>
    </div>

    <div class="h-g"/>
    <Divider/>

    <div class="mt-4 space-y-12">
      <h2 class="scroll-m-20 text-3xl font-bold tracking-tight">More Examples</h2>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Navbar Layout (Horizontal)</h3>
        <p class="text-zinc-400 text-sm">
          Nav on top, content below. Use <code>orientation="horizontal"</code> and <code>indicator-position="after"</code> for the bottom line.
        </p>

        <AnimatedTabs :items="PREVIEW_TABS" class="space-y-4">
          <template #preview>
            <div class="relative rounded-xl border border-zinc-800 bg-zinc-950/50 flex flex-col items-center justify-center p-4 md:p-10">
              <ScrollSpy
                  :container="container2"
                  orientation="horizontal"
                  class="flex flex-col w-full max-w-3xl h-[400px] border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950 shadow-xl"
              >
                <div class="border-b border-zinc-800 p-4 bg-zinc-900/30 flex justify-between items-center shrink-0">
                  <span class="text-sm font-bold text-zinc-300">Logo</span>
                  <ScrollSpyNav indicator indicator-position="after" class="gap-6">
                    <ScrollSpyLink value="n-1" class="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Concept</ScrollSpyLink>
                    <ScrollSpyLink value="n-2" class="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Design</ScrollSpyLink>
                    <ScrollSpyLink value="n-3" class="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Code</ScrollSpyLink>
                  </ScrollSpyNav>
                </div>
                <div ref="container2" class="flex-1 overflow-y-auto p-8 scroll-smooth">
                  <ScrollSpyViewport class="space-y-24 pb-20">
                    <ScrollSpySection value="n-1" class="space-y-4">
                      <h3 class="text-lg font-bold">Concept</h3>
                      <div class="h-40 bg-zinc-900/50 border border-zinc-800 border-dashed rounded"/>
                    </ScrollSpySection>
                    <ScrollSpySection value="n-2" class="space-y-4">
                      <h3 class="text-lg font-bold">Design</h3>
                      <div class="h-40 bg-zinc-900/50 border border-zinc-800 border-dashed rounded"/>
                    </ScrollSpySection>
                    <ScrollSpySection value="n-3" class="space-y-4">
                      <h3 class="text-lg font-bold">Code</h3>
                      <div class="h-40 bg-zinc-900/50 border border-zinc-800 border-dashed rounded"/>
                    </ScrollSpySection>
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

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Table of Contents (Right Side)</h3>
        <p class="text-zinc-400 text-sm">
          Nav on the right. Use <code>indicator-position="after"</code> to show the line on the right edge.
        </p>

        <AnimatedTabs :items="PREVIEW_TABS" class="space-y-4">
          <template #preview>
            <div class="relative rounded-xl border border-zinc-800 bg-zinc-950/50 flex flex-col items-center justify-center p-4 md:p-10">
              <ScrollSpy
                  :container="container3"
                  orientation="vertical"
                  class="flex w-full max-w-3xl h-[400px] border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950 shadow-xl"
              >
                <div ref="container3" class="flex-1 overflow-y-auto p-8 scroll-smooth relative">
                  <ScrollSpyViewport class="space-y-24 pb-20">
                    <ScrollSpySection value="r-1" class="space-y-4">
                      <h3 class="text-lg font-bold">Overview</h3>
                      <div class="h-32 bg-zinc-900/50 border border-zinc-800 border-dashed rounded"/>
                    </ScrollSpySection>
                    <ScrollSpySection value="r-2" class="space-y-4">
                      <h3 class="text-lg font-bold">Features</h3>
                      <div class="h-32 bg-zinc-900/50 border border-zinc-800 border-dashed rounded"/>
                    </ScrollSpySection>
                    <ScrollSpySection value="r-3" class="space-y-4">
                      <h3 class="text-lg font-bold">Pricing</h3>
                      <div class="h-32 bg-zinc-900/50 border border-zinc-800 border-dashed rounded"/>
                    </ScrollSpySection>
                  </ScrollSpyViewport>
                </div>

                <div class="w-40 border-l border-zinc-800 p-6 bg-zinc-900/30 hidden sm:block">
                  <h4 class="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 text-right">On this page</h4>
                  <ScrollSpyNav indicator indicator-position="after" class="items-end">
                    <ScrollSpyLink value="r-1" class="block py-2 text-sm text-right text-zinc-500 hover:text-white transition-colors no-underline">Overview</ScrollSpyLink>
                    <ScrollSpyLink value="r-2" class="block py-2 text-sm text-right text-zinc-500 hover:text-white transition-colors no-underline">Features</ScrollSpyLink>
                    <ScrollSpyLink value="r-3" class="block py-2 text-sm text-right text-zinc-500 hover:text-white transition-colors no-underline">Pricing</ScrollSpyLink>
                  </ScrollSpyNav>
                </div>
              </ScrollSpy>
            </div>
          </template>
          <template #code>
            <div class="mt-4">
              <CodeBlock :code="rightNavCode" lang="html"/>
            </div>
          </template>
        </AnimatedTabs>
      </div>
    </div>

    <div class="h-g"/>
    <Divider/>

    <div class="space-y-6 mt-4">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Props</h2>

      <h3 class="text-lg font-semibold mt-4">ScrollSpyNav</h3>
      <div class="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950">
        <table class="w-full text-sm text-left">
          <thead class="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400">
          <tr>
            <th class="px-4 py-3 font-medium">Prop</th>
            <th class="px-4 py-3 font-medium">Type</th>
            <th class="px-4 py-3 font-medium">Default</th>
            <th class="px-4 py-3 font-medium">Description</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800 text-zinc-300">
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">indicator</td>
            <td class="px-4 py-3 font-mono text-xs">boolean</td>
            <td class="px-4 py-3 font-mono text-xs">false</td>
            <td class="px-4 py-3">Enables the moving active line indicator.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">indicatorPosition</td>
            <td class="px-4 py-3 font-mono text-xs">'before' | 'after'</td>
            <td class="px-4 py-3 font-mono text-xs">'before'</td>
            <td class="px-4 py-3">
              Controls line position relative to the link.<br/>
              Vertical: <code>before</code> (Left), <code>after</code> (Right).<br/>
              Horizontal: <code>before</code> (Top), <code>after</code> (Bottom).
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-lg font-semibold mt-8">ScrollSpy (Root)</h3>
      <div class="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950">
        <table class="w-full text-sm text-left">
          <thead class="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400">
          <tr>
            <th class="px-4 py-3 font-medium">Prop</th>
            <th class="px-4 py-3 font-medium">Type</th>
            <th class="px-4 py-3 font-medium">Default</th>
            <th class="px-4 py-3 font-medium">Description</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800 text-zinc-300">
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
            <td class="px-4 py-3">
              Controls the flex direction.<br/>
              <code>vertical</code> = Side-by-side (flex-row).<br/>
              <code>horizontal</code> = Stacked (flex-col).
            </td>
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
  </div>
</template>