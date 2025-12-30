// app/pages/docs/components/animated-background.vue
<script setup lang="ts">
import {ref} from 'vue'
import {AnimatedBackground} from '@/components/ui/animated-background'
import {AnimatedTabs} from '@/components/ui/animated-tabs'
import {CodeBlock} from '@/components/ui/code-block'
import {Home, PhoneCall, Settings, User} from 'lucide-vue-next'

definePageMeta({layout: 'docs'})
const config = useAppConfig().raya

// --- Data ---
const TABS = [
  {id: 1, label: 'Home', icon: Home},
  {id: 2, label: 'About', icon: User},
  {id: 3, label: 'Services', icon: Settings},
  {id: 4, label: 'Contact', icon: PhoneCall},
]

const CARDS = [
  {
    id: 1,
    title: 'Dialog',
    description: 'Enhances modal presentations.',
  },
  {
    id: 2,
    title: 'Popover',
    description: 'For small interactive overlays.',
  },
  {
    id: 3,
    title: 'Accordion',
    description: 'Collapsible sections for more content.',
  },
  {
    id: 4,
    title: 'Collapsible',
    description: 'Collapsible sections for more content.',
  },
  {
    id: 5,
    title: 'Drag to Reorder',
    description: 'Reorder items with drag and drop.',
  },
  {
    id: 6,
    title: 'Swipe to Delete',
    description: 'Delete items with swipe gestures.',
  },
];

const PREVIEW_TABS = [
  {label: 'Preview', slot: 'preview'},
  {label: 'Code', slot: 'code'}
]

// --- State ---
const activeTab = ref(0)

// --- Code Snippets ---
const installCommands = {
  npm: `npx shadcn-vue@latest add ${config.baseUrl}/animated-background.json`,
  manual: `npm install motion-v clsx tailwind-merge`
}

const tabsCode = `<script setup lang="ts">
import { AnimatedBackground } from '@/components/ui/animated-background'
import { Home, PhoneCall, Settings, User } from 'lucide-vue-next'

const TABS = [
  {id: 1 ,label: 'Home', icon: Home},
  {id: 2 ,label: 'About', icon: User},
  {id: 3 ,label: 'Services', icon: Settings},
  {id: 4 ,label: 'Contact', icon: PhoneCall},
]
<\/script>

<template>
  <div class="flex w-full space-x-2 rounded-xl border border-zinc-950/10 bg-white dark:bg-zinc-950 p-2">
    <AnimatedBackground
      default-value="Home"
      :items="TABS"
      class="rounded-lg bg-zinc-100 dark:bg-zinc-800"
      :transition="{
        type: 'spring',
        bounce: 0.2,
        duration: 0.3,
      }"
    >
      <template #default="{ item, isActive }">
        <button
          type="button"
          :data-id="item.label"
          class="inline-flex h-9 w-9 items-center justify-center transition-colors duration-100 focus-visible:outline-2"
          :class="isActive ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-500'"
        >
          <component :is="item.icon" class="h-5 w-5" />
        </button>
      </template>
    </AnimatedBackground>
  </div>
</template>`

const cardGridCode = `<script setup lang="ts">
import { AnimatedBackground } from '@/components/ui/animated-background'

const ITEMS = [
  {
    id: 1,
    title: 'Dialog',
    description: 'Enhances modal presentations.',
  },
  {
    id: 2,
    title: 'Popover',
    description: 'For small interactive overlays.',
  },
  {
    id: 3,
    title: 'Accordion',
    description: 'Collapsible sections for more content.',
  },
  {
    id: 4,
    title: 'Collapsible',
    description: 'Collapsible sections for more content.',
  },
  {
    id: 5,
    title: 'Drag to Reorder',
    description: 'Reorder items with drag and drop.',
  },
  {
    id: 6,
    title: 'Swipe to Delete',
    description: 'Delete items with swipe gestures.',
  },
]
<\/script>

<template>
  <AnimatedBackground
    :items="ITEMS"
    :enable-hover="true"
    class="grid grid-cols-2 md:grid-cols-3 p-10"
    :transition="{
      type: 'spring',
      bounce: 0.2,
      duration: 0.6,
    }"
  >
    <template #default="{ item }">
      <div class="flex select-none flex-col space-y-1 p-4">
        <h3 class="text-base font-medium text-zinc-800 dark:text-zinc-50">
          {{ item.title }}
        </h3>
        <p class="text-base text-zinc-600 dark:text-zinc-400">
          {{ item.description }}
        </p>
      </div>
    </template>
    <template #background>
      <div class="absolute inset-0 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
    </template>
  </AnimatedBackground>
</template>`

useSeoMeta({
  title: 'Animated Background Component for Vue & Nuxt',
  description: 'A Vue and Nuxt component that visually highlights selected items by sliding a background into view on hover or click.',
  ogTitle: 'Animated Background Component for Vue & Nuxt',
  ogDescription: 'A Vue and Nuxt component that visually highlights selected items by sliding a background into view on hover or click.',
})
</script>

<template>
  <div class="pb-5">
    <PageTitle
        title="Animated Background"
        description="Visually highlights selected items by sliding a background into view when hovered over or clicked."
    />
    <Divider/>
    <!--  First Example  -->
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
          <div
              class="relative rounded-xl border border-zinc-800 bg-zinc-950/50 flex flex-col items-center justify-center min-h-[250px]">
            <div class="flex w-fit space-x-2 rounded-xl border border-zinc-950/10 bg-white dark:bg-zinc-950 p-2">
              <AnimatedBackground
                  v-model="activeTab"
                  :items="TABS"
                  class="rounded-lg bg-zinc-100 dark:bg-zinc-800"
                  :transition="{
                    type: 'spring',
                    bounce: 0.2,
                    duration: 0.3,
                  }"
              >
                <template #default="{ item, isActive }">
                  <button
                      type="button"
                      :data-id="item.label"
                      class="inline-flex h-9 w-9 items-center justify-center transition-colors duration-100 focus-visible:outline-2"
                      :class="isActive ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-500'"
                  >
                    <component :is="item.icon" class="size-5"/>
                  </button>
                </template>
              </AnimatedBackground>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock :code="tabsCode" lang="html"/>
        </TabsContent>
      </Tabs>
    </div>

    <div class="h-g"/>

    <Divider/>

    <!--  Install  -->
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

    <!--  More Examples  -->
    <div class="space-y-12 mt-4">
      <h2 class="scroll-m-20 text-3xl font-bold tracking-tight">More Examples</h2>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold">Card Grid</h3>
        <p class="text-zinc-400 text-sm">
          A grid of cards with a spring hover effect, using a custom layout and transition.
        </p>

        <AnimatedTabs :items="PREVIEW_TABS" class="space-y-4">
          <template #preview>
            <div class="rounded-xl border border-zinc-800 bg-zinc-950/50 flex justify-center">
              <div class="w-full">
                <AnimatedBackground
                    :items="CARDS"
                    :enable-hover="true"
                    class="grid grid-cols-2 md:grid-cols-3 p-10"
                    :transition="{
                      type: 'spring',
                      bounce: 0.2,
                      duration: 0.6,
                    }"
                >
                  <template #default="{ item }">
                    <div class="flex select-none flex-col space-y-1 p-4">
                      <h3 class="text-base font-medium text-zinc-800 dark:text-zinc-50">
                        {{ item.title }}
                      </h3>
                      <p class="text-base text-zinc-600 dark:text-zinc-400">
                        {{ item.description }}
                      </p>
                    </div>
                  </template>
                  <template #background>
                    <div class="absolute inset-0 rounded-lg bg-zinc-100 dark:bg-zinc-800"/>
                  </template>
                </AnimatedBackground>
              </div>
            </div>
          </template>
          <template #code>
            <div class="mt-4">
              <CodeBlock :code="cardGridCode" lang="html"/>
            </div>
          </template>
        </AnimatedTabs>
      </div>

    </div>

    <div class="h-g"/>

    <Divider/>

    <!--  Table of Props, Emits , and ..  -->
    <div class="space-y-6 mt-4">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">Props</h2>
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
            <td class="px-4 py-3 font-mono text-purple-400">items</td>
            <td class="px-4 py-3 font-mono text-xs">any[]</td>
            <td class="px-4 py-3 font-mono text-xs">[]</td>
            <td class="px-4 py-3">Array of items to render. Each item should have a unique <code>id</code> or <code>value</code>.
            </td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">v-model</td>
            <td class="px-4 py-3 font-mono text-xs">string | number</td>
            <td class="px-4 py-3 font-mono text-xs">undefined</td>
            <td class="px-4 py-3">The active item identifier.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">enableHover</td>
            <td class="px-4 py-3 font-mono text-xs">boolean</td>
            <td class="px-4 py-3 font-mono text-xs">false</td>
            <td class="px-4 py-3">If true, changes selection on mouse enter instead of click.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">layoutId</td>
            <td class="px-4 py-3 font-mono text-xs">string</td>
            <td class="px-4 py-3 font-mono text-xs">random</td>
            <td class="px-4 py-3">Unique ID for the layout animation group.</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-mono text-purple-400">transition</td>
            <td class="px-4 py-3 font-mono text-xs">Transition</td>
            <td class="px-4 py-3 font-mono text-xs">spring</td>
            <td class="px-4 py-3">Custom motion transition settings.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!--  Copy Right if exist  -->
    <div class="h-g"/>

    <Divider/>

    <div class="mt-4 text-sm">
      <p>Source content adapted from <a
          href="https://motion-primitives.com/docs/animated-background#update-the-import-paths-to-match-your-project-setup"
          target="_blank" class="underline hover:text-zinc-300">Motion Primitives</a>.</p>
    </div>

  </div>
</template>