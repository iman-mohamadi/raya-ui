<script setup lang="ts">
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { Box, Lock, Search, Settings, Sparkles } from 'lucide-vue-next'
import { CodeBlock } from '@/components/ui/code-block'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

// --- Data ---
const gridItems = [
  {
    area: 'md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]',
    icon: Box,
    title: 'Raya UI Core',
    description: "The foundation of modern Vue interfaces, architected by Iman Mohammadi."
  },
  {
    area: 'md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]',
    icon: Settings,
    title: 'Battle Tested',
    description: "Powering complex production environments like Woodcoder.com."
  },
  {
    area: 'md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]',
    icon: Lock,
    title: 'Enterprise Reliability',
    description: "Trusted by industry leaders including Hotelyar.com for mission-critical UIs."
  },
  {
    area: 'md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]',
    icon: Sparkles,
    title: 'Modern Aesthetics',
    description: "Crafted with the latest design trends and OKLCH color spaces."
  },
  {
    area: 'md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]',
    icon: Search,
    title: 'Nuxt 4 Ready',
    description: "Built for the future of the Vue ecosystem with best-in-class performance."
  },
]

// --- Code Snippets ---
const installCommands = {
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/glowing-effect.json`,
  manual: `npm install motion-v clsx tailwind-merge`
}

const demoCode = `<script setup lang="ts">
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { Box, Lock, Search, Settings, Sparkles } from 'lucide-vue-next'

const gridItems = [
  {
    area: 'md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]',
    icon: Box,
    title: 'Raya UI Core',
    description: "The foundation of modern Vue interfaces, architected by Iman Mohammadi."
  },
  {
    area: 'md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]',
    icon: Settings,
    title: 'Battle Tested',
    description: "Powering complex production environments like Woodcoder.com."
  },
  {
    area: 'md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]',
    icon: Lock,
    title: 'Enterprise Reliability',
    description: "Trusted by industry leaders including Hotelyar.com for mission-critical UIs."
  },
  {
    area: 'md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]',
    icon: Sparkles,
    title: 'Modern Aesthetics',
    description: "Crafted with the latest design trends and OKLCH color spaces."
  },
  {
    area: 'md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]',
    icon: Search,
    title: 'Nuxt 4 Ready',
    description: "Built for the future of the Vue ecosystem with best-in-class performance."
  },
]
<\/script>

<template>
  <ul class="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
    <li v-for="(item, index) in gridItems" :key="index" class="min-h-[14rem] list-none" :class="item.area">
      <div class="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
            :spread="40"
            :glow="true"
            :disabled="false"
            :proximity="64"
            :inactive-zone="0.01"
        />
        <div class="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div class="relative flex flex-1 flex-col justify-between gap-3">
            <div class="w-fit rounded-lg border border-gray-600 p-2">
              <component :is="item.icon" class="h-4 w-4 text-black dark:text-neutral-400" />
            </div>
            <div class="space-y-3">
              <h3 class="pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-black md:text-2xl/[1.875rem] dark:text-white">
                {{ item.title }}
              </h3>
              <h2 class="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400">
                {{ item.description }}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>`

useSeoMeta({
  title: 'Glowing Effect Component for Vue & Nuxt',
  description: 'A glowing border effect that tracks the mouse pointer, perfect for cards and grids.',
  ogTitle: 'Glowing Effect Component for Vue & Nuxt',
  ogDescription: 'A glowing border effect that tracks the mouse pointer, perfect for cards and grids.',
})
</script>

<template>
  <div class="pb-5">
    <PageTitle
        title="Glowing Effect"
        description="A glowing border effect that tracks the mouse pointer, perfect for cards and grids."
    />
    <Divider/>

    <div class="mt-4">
      <Tabs default-value="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div class="relative rounded-xl border border-edge bg-background p-4 md:p-10 flex flex-col items-center justify-center min-h-[400px]">

            <ul class="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2 w-full max-w-7xl">
              <li
                  v-for="(item, index) in gridItems"
                  :key="index"
                  class="min-h-[14rem] list-none"
                  :class="item.area"
              >
                <div class="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
                  <GlowingEffect
                      :spread="40"
                      :glow="true"
                      :disabled="false"
                      :proximity="64"
                      :inactive-zone="0.01"
                      :borderWidth="3"
                  />
                  <div class="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                    <div class="relative flex flex-1 flex-col justify-between gap-3">
                      <div class="w-fit rounded-lg border border-gray-600 p-2">
                        <component :is="item.icon" class="h-4 w-4 text-black dark:text-neutral-400" />
                      </div>
                      <div class="space-y-3">
                        <h3 class="pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-black md:text-2xl/[1.875rem] dark:text-white">
                          {{ item.title }}
                        </h3>
                        <h2 class="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400">
                          {{ item.description }}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock :code="demoCode" lang="html"/>
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
            <td class="px-4 py-3 font-mono text-purple-400">blur</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">0</td>
            <td class="px-4 py-3">The blur radius of the glow effect in pixels.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">spread</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">20</td>
            <td class="px-4 py-3">The spread angle of the conical gradient.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">proximity</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">0</td>
            <td class="px-4 py-3">The distance from the element at which the glow becomes visible.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">inactiveZone</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">0.7</td>
            <td class="px-4 py-3">Radius ratio from the center where the glow is inactive.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">borderWidth</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">1</td>
            <td class="px-4 py-3">The width of the glowing border.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">movementDuration</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">2</td>
            <td class="px-4 py-3">Duration of the glow movement animation in seconds.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">variant</td>
            <td class="px-4 py-3 font-mono text-xs">'default' | 'white'</td>
            <td class="px-4 py-3 font-mono text-xs">'default'</td>
            <td class="px-4 py-3">The color variant of the glow.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="h-g"/>
    <Divider/>

    <div class="mt-4 text-sm">
      <p>Source content adapted from <a href="https://ui.aceternity.com/components/glowing-effect" target="_blank" class="underline hover:text-zinc-700 dark:text-zinc-300">Aceternity UI</a>.</p>
    </div>

  </div>
</template>