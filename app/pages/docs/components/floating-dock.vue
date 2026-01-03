<script setup lang="ts">
import {
  Home, Terminal, CircleUser, Settings,
  LayoutGrid, FolderGit2, Ghost
} from 'lucide-vue-next'
import { FloatingDock } from '@/components/ui/floating-dock'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })
const config = useAppConfig().raya

useSeoMeta({
  title: 'Floating Dock Component for Vue & Nuxt',
  description: 'A Mac-OS style dock component for Vue and Nuxt that floats and scales items based on mouse proximity.',
  ogTitle: 'Floating Dock Component for Vue & Nuxt',
  ogDescription: 'A Mac-OS style dock component for Vue and Nuxt that floats and scales items based on mouse proximity.',
})

// --- Demo Data ---
const dockItems = [
  { title: 'Home', icon: Home, href: '#' },
  { title: 'Products', icon: Terminal, href: '#' },
  { title: 'Components', icon: LayoutGrid, href: '#' },
  { title: 'Changelog', icon: FolderGit2, href: '#' },
  { title: 'Raya UI', icon: Ghost, href: '#' }, // Just an easter egg :)
  { title: 'Profile', icon: CircleUser, href: '#' },
  { title: 'Settings', icon: Settings, href: '#' },
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
  <div class="pb-5">
    <PageTitle
        title="Floating Dock"
        description="A Mac-OS style dock that floats and scales items based on mouse proximity."
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
          <div class="relative rounded-xl border border-zinc-800 bg-neutral-950 flex items-center justify-center min-h-[400px] p-10">
            <div class="absolute inset-0 bg-neutral-900/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <FloatingDock
                :items="dockItems"
                desktop-class="absolute bottom-10"
                mobile-class="absolute bottom-10 right-10"
            />
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
      <div class="space-y-4">
        <CodeBlock :code="installCommands.npm"/>
        <p class="text-sm text-zinc-400 dark:text-zinc-600">Or manually:</p>
        <div class="space-y-2">
          <p class="text-sm text-zinc-400 dark:text-zinc-600">Install dependencies:</p>
          <CodeBlock :code="installCommands.manual"  />
          <p class="text-sm text-zinc-400 dark:text-zinc-600 mt-4">Copy the component code into your project.</p>
        </div>
      </div>
    </div>

  </div>
</template>