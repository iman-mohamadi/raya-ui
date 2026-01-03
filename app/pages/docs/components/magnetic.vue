<script setup lang="ts">
import { Magnetic } from '@/components/ui/magnetic'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { CodeBlock } from '@/components/ui/code-block'
import { Button } from '@/components/ui/button'
import { Plus, Github, Twitter, Instagram } from 'lucide-vue-next'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

useSeoMeta({
  title: 'Magnetic Component for Vue & Nuxt',
  description: 'A magnetic effect component that attracts elements to the mouse cursor within a specific range.',
  ogTitle: 'Magnetic Component for Vue & Nuxt',
  ogDescription: 'A magnetic effect component that attracts elements to the mouse cursor within a specific range.',
})

// --- Tabs ---
const previewTabs = [
  { label: 'Preview', slot: 'preview' },
  { label: 'Code', slot: 'code' }
]

const installTabs = [
  { label: 'CLI', slot: 'cli' },
  { label: 'Manual', slot: 'manual' }
]

const installCommands = {
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/magnetic.json`,
  manual: `npm install motion-v @vueuse/core`
}

const basicCode = `<script setup lang="ts">
import { Magnetic } from '@/components/ui/magnetic'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
<\/script>

<template>
  <Magnetic :intensity="0.2" :range="100">
    <Button variant="outline" class="rounded-full h-12 w-12 p-0 flex items-center justify-center">
      <Plus class="w-6 h-6" />
    </Button>
  </Magnetic>
</template>`

const navCode = `<script setup lang="ts">
import { Magnetic } from '@/components/ui/magnetic'
import { Github, Twitter, Instagram } from 'lucide-vue-next'

const links = [
  { icon: Github, label: 'Github' },
  { icon: Twitter, label: 'Twitter' },
  { icon: Instagram, label: 'Instagram' }
]
<\/script>

<template>
  <div class="flex gap-4">
    <Magnetic
      v-for="link in links"
      :key="link.label"
      :intensity="0.2"
      :range="60"
    >
      <div class="p-3 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-400 dark:text-zinc-600 hover:text-white">
        <component :is="link.icon" class="w-5 h-5" />
      </div>
    </Magnetic>
  </div>
</template>`

const parentCode = `<template>
  <div class="p-12 border border-dashed border-zinc-700 rounded-xl flex justify-center">
    <Magnetic
      :intensity="0.5"
      :range="200"
      action-area="parent"
    >
      <button class="px-6 py-3 bg-white text-black rounded-full font-bold">
        Hover Area: Parent
      </button>
    </Magnetic>
  </div>
</template>`
</script>

<template>
  <div class="pb-5">
    <PageTitle
        title="Magnetic"
        description="A magnetic effect that attracts elements to the mouse cursor."
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
            <Magnetic :intensity="0.3" :range="150">
              <Button variant="outline" class="rounded-full h-16 w-16 p-0 flex items-center justify-center border-2 border-zinc-700 bg-zinc-900/80 backdrop-blur-sm">
                <Plus class="w-6 h-6 text-white" />
              </Button>
            </Magnetic>
            <p class="mt-8 text-sm text-zinc-500">Hover nearby to see the effect</p>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock :code="basicCode" lang="html"/>
        </TabsContent>
      </Tabs>
    </div>

    <div class="h-g"/>

    <Divider/>

    <div class="space-y-6 mt-4">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Installation</h2>
      <AnimatedTabs :items="installTabs" class="space-y-6">
        <template #cli>
          <CodeBlock :code="installCommands.npm"/>
        </template>
        <template #manual>
          <div class="space-y-4 mt-4">
            <p class="text-sm text-zinc-400 dark:text-zinc-600">1. Install dependencies:</p>
            <CodeBlock :code="installCommands.manual"  />
            <p class="text-sm text-zinc-400 dark:text-zinc-600">2. Copy the component code into your project.</p>
          </div>
        </template>
      </AnimatedTabs>
    </div>

    <div class="h-g"/>

    <Divider/>

    <div class="space-y-12 mt-4">
      <h2 class="scroll-m-20 text-3xl font-bold tracking-tight">Examples</h2>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Social Links</h3>
        <p class="text-zinc-400 dark:text-zinc-600 text-sm">Common use case for magnetic buttons in footers or headers.</p>

        <Tabs default-value="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <div class="rounded-xl border border-edge bg-background p-10 flex justify-center min-h-[200px] items-center">
              <div class="flex gap-6">
                <Magnetic :intensity="0.2" :range="60">
                  <div class="p-4 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors cursor-pointer group">
                    <Github class="w-5 h-5 text-zinc-400 dark:text-zinc-600 group-hover:text-white transition-colors" />
                  </div>
                </Magnetic>
                <Magnetic :intensity="0.2" :range="60">
                  <div class="p-4 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors cursor-pointer group">
                    <Twitter class="w-5 h-5 text-zinc-400 dark:text-zinc-600 group-hover:text-white transition-colors" />
                  </div>
                </Magnetic>
                <Magnetic :intensity="0.2" :range="60">
                  <div class="p-4 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors cursor-pointer group">
                    <Instagram class="w-5 h-5 text-zinc-400 dark:text-zinc-600 group-hover:text-white transition-colors" />
                  </div>
                </Magnetic>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="code">
            <CodeBlock :code="navCode" lang="html"/>
          </TabsContent>
        </Tabs>
      </div>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Parent Action Area</h3>
        <p class="text-zinc-400 dark:text-zinc-600 text-sm">
          Set <code>action-area="parent"</code> to trigger the effect whenever the mouse is inside the parent container, not just the element itself.
        </p>

        <Tabs default-value="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <div class="rounded-xl border border-edge bg-background p-10 flex justify-center min-h-[300px] items-center">
              <div class="w-full max-w-md h-64 border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center relative overflow-hidden bg-zinc-900/20">
                <p class="absolute top-4 left-4 text-xs text-zinc-500 uppercase tracking-widest">Parent Container</p>
                <Magnetic :intensity="0.5" :range="200" action-area="parent">
                  <button class="px-8 py-4 bg-white text-black rounded-full font-bold shadow-xl hover:scale-105 transition-transform">
                    Magnetic Button
                  </button>
                </Magnetic>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="code">
            <CodeBlock :code="parentCode" lang="html"/>
          </TabsContent>
        </Tabs>
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
            <td class="px-4 py-3 font-mono text-purple-400">intensity</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">0.6</td>
            <td class="px-4 py-3">Strength of the attraction (0-1 recommended).</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">range</td>
            <td class="px-4 py-3 font-mono text-xs">number</td>
            <td class="px-4 py-3 font-mono text-xs">100</td>
            <td class="px-4 py-3">Pixel radius around the element where the effect is active.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">actionArea</td>
            <td class="px-4 py-3 font-mono text-xs">'self' | 'parent' | 'global'</td>
            <td class="px-4 py-3 font-mono text-xs">'self'</td>
            <td class="px-4 py-3">Defines the hover trigger area. 'self' (default), 'parent' (container), or 'global' (always active).</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">springOptions</td>
            <td class="px-4 py-3 font-mono text-xs">SpringOptions</td>
            <td class="px-4 py-3 font-mono text-xs">...</td>
            <td class="px-4 py-3">Physics configuration (stiffness, damping, mass).</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>


    <!--  Copy Right if exist  -->
    <div class="h-g"/>

    <Divider/>

    <div class="mt-4 text-sm text-zinc-500 flex flex-col md:flex-row justify-between items-center gap-2">
      <p>
        Vue component created & ported by the author of Raya UI.
      </p>
      <p>
        Original concept by
        <a
            href="https://motion-primitives.com/docs/magnetic"
            target="_blank"
            rel="noopener noreferrer"
            class="text-zinc-700 dark:text-zinc-300 hover:text-white underline underline-offset-4 transition-colors"
        >
          Motion Primitives
        </a>
      </p>
    </div>

  </div>
</template>