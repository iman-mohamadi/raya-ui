<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Tree } from '@/components/raya/ui/tree'
import { CodeBlock } from '@/components/raya/ui/code-block'
import { Folder, File, FileCode, Image as ImageIcon, Archive } from 'lucide-vue-next'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'Tree Component for Vue & Nuxt',
  description: 'A hierarchical list component for Vue and Nuxt where folders expand and items are selectable.',
  ogTitle: 'Tree Component for Vue & Nuxt',
  ogDescription: 'A hierarchical list component for Vue and Nuxt where folders expand and items are selectable.',
})

// --- Interactive Settings State ---
const multiple = ref(false)
const selectionBehavior = ref('toggle') // toggle, replace

// --- Data State ---
const selection = ref<any>(null)
const expanded = ref<string[]>(['app', 'components'])

const resetSettings = () => {
  multiple.value = false
  selectionBehavior.value = 'toggle'
  expanded.value = ['app', 'components']
  selection.value = null
}

// Reset selection format when switching between multiple/single to satisfy reka-ui
watch(multiple, (isMultiple) => {
  selection.value = isMultiple ? [] : null
})

// --- Sample Data ---
interface FileNode {
  label: string
  icon?: any
  children?: FileNode[]
}

const items: FileNode[] = [
  {
    label: 'app',
    icon: Folder,
    children: [
      {
        label: 'components',
        icon: Folder,
        children: [
          { label: 'Button.vue', icon: FileCode },
          { label: 'Card.vue', icon: FileCode },
          { label: 'Tree.vue', icon: FileCode }
        ]
      },
      {
        label: 'pages',
        icon: Folder,
        children: [
          { label: 'index.vue', icon: FileCode },
          { label: 'docs.vue', icon: FileCode }
        ]
      }
    ]
  },
  {
    label: 'assets',
    icon: Folder,
    children: [
      { label: 'logo.png', icon: ImageIcon },
      { label: 'main.css', icon: File }
    ]
  },
  { label: 'package.json', icon: Archive },
  { label: 'README.md', icon: File }
]

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add tree'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add tree'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add tree'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add tree'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install reka-ui lucide-vue-next clsx tailwind-merge`,
    css: `/* Inherits seamlessly from your main.css theme variables */`
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  let props = ``
  if (multiple.value) props += `\n    multiple`
  if (selectionBehavior.value !== 'toggle') props += `\n    selection-behavior="${selectionBehavior.value}"`

  const selInit = multiple.value ? `ref([])` : `ref()`

  return `<script setup lang="ts">
import { ref } from 'vue'
import { Tree } from '@/components/ui/tree'
import { Folder, File, FileCode, Image as ImageIcon, Archive } from 'lucide-vue-next'

const items = [
  {
    label: 'app',
    icon: Folder,
    children: [
      {
        label: 'components',
        icon: Folder,
        children: [
          { label: 'Button.vue', icon: FileCode },
          { label: 'Card.vue', icon: FileCode }
        ]
      },
      {
        label: 'pages',
        icon: Folder,
        children: [
          { label: 'index.vue', icon: FileCode }
        ]
      }
    ]
  },
  { label: 'package.json', icon: Archive }
]

const selection = ${selInit}
const expanded = ref(['app'])
<\/script>

<template>
  <Tree
    v-model="selection"
    v-model:expanded="expanded"
    :items="items"${props}
  />
</template>`
})
</script>

<template>
  <DocContent>
    <!-- Breadcrumb Title -->
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Tree</span>
    </template>

    <!-- ========================================== -->
    <!-- LEFT PANE: Full Documentation              -->
    <!-- ========================================== -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Tree</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A recursive, hierarchical list component powered by Reka UI where folders expand and leaf items are selectable.
      </p>
    </div>

    <!-- Installation -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">Installation</h2>

      <!-- Main Install Tabs -->
      <div class="flex items-center gap-2 mb-4 border-b border-border pb-2">
        <button
            v-for="tab in ['cli', 'manual', 'css']"
            :key="tab"
            @click="activeInstallTab = tab"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize"
            :class="activeInstallTab === tab ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'"
        >
          {{ tab }}
        </button>
      </div>

      <!-- CLI Install -->
      <div v-if="activeInstallTab === 'cli'" class="w-full gap-0 rounded-xl overflow-hidden border border-border bg-background">
        <div class="flex items-center px-3 h-10 border-b border-border">
          <div class="flex items-center gap-0.5 relative">
            <button
                v-for="tab in cliTabs"
                :key="tab"
                @click="activeCliTab = tab"
                class="relative z-10 px-3 h-7 rounded-md text-sm transition-colors"
                :class="activeCliTab === tab ? 'text-foreground bg-muted' : 'text-muted-foreground hover:text-foreground'"
            >
              {{ tab }}
            </button>
          </div>
        </div>
        <div class="p-1.5">
          <CodeBlock language="bash" :code="installCommands.cli" class="border-0 m-0 bg-transparent" />
        </div>
      </div>

      <!-- Manual Install -->
      <div v-if="activeInstallTab === 'manual'" class="flex flex-col gap-4">
        <p class="text-sm text-muted-foreground">1. Install dependencies:</p>
        <div class="rounded-xl overflow-hidden border border-border bg-background p-1.5">
          <CodeBlock language="bash" :code="installCommands.manual" class="border-0 m-0 bg-transparent" />
        </div>
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/tree</code>.</p>
      </div>

      <!-- CSS Install -->
      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Ready to go:</strong> This component inherits your typography, structural layout colors, and dynamic interactive states natively from your <code>main.css</code> theme variables.
        </div>
      </div>
    </div>

    <!-- File Structure -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">File Structure</h2>
      <div class="my-4 rounded-xl border border-border overflow-hidden bg-background">
        <div class="p-4 w-full relative font-mono text-sm text-muted-foreground">
          <div class="flex items-center gap-2 text-foreground">
            <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
            your-project
          </div>
          <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
            <div class="flex items-center gap-2 py-2">
              <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              components
            </div>
            <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
              <div class="flex items-center gap-2 py-2">
                <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                ui
              </div>
              <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                <div class="flex items-center gap-2 py-2 text-pink-500">
                  <svg class="size-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  tree
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>Tree.vue</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- API Reference -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">API Reference</h2>

      <h3 class="text-2xl mt-7 mb-3 text-foreground">Props</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">items</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">Array</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">[]</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The hierarchical recursive data array to render.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">modelValue</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">any | any[]</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The currently selected item(s). Use standard <code>v-model</code> binding.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">multiple</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">boolean</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">false</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Allows multiple selections. When true, <code>modelValue</code> must be an array.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">expanded</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string[]</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">[]</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">An array of the currently expanded folder keys. Use <code>v-model:expanded</code> binding.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">selectionBehavior</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">enum</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"toggle"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Controls selection behavior. <code>replace</code> deselects others on click (unless modifier key is held). <code>toggle</code> naturally adds/removes.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">labelKey</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"label"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The object property key to use for the item's label text.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">childrenKey</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"children"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The object property key to use to identify nested children arrays.</p>
          </div>
        </div>

      </div>

      <h3 class="text-2xl mt-8 mb-3 text-foreground">Slots</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">#item</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Overrides the default rendering for each tree item. Provides <code>{ item, expanded, selected, indeterminate }</code> in the slot scope.</p>
          </div>
        </div>
      </div>

    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Visual Preview Slot            -->
    <!-- ========================================== -->
    <template #preview>
      <div class="w-full flex flex-col gap-6 items-center justify-center p-6 h-full min-h-[400px]">

        <div class="w-full max-w-sm rounded-lg border border-border bg-background shadow-sm p-4 overflow-x-auto">
          <Tree
              v-model="selection"
              v-model:expanded="expanded"
              :items="items"
              :multiple="multiple"
              :selection-behavior="selectionBehavior"
              class="w-full"
          />
        </div>

        <!-- Live Value Feedback Box -->
        <div class="w-full max-w-sm p-4 bg-muted/30 border border-border rounded-lg flex flex-col gap-3 font-mono text-sm">
          <div>
            <span class="text-xs text-muted-foreground uppercase tracking-wider font-semibold block mb-1">Expanded Folders</span>
            <code class="text-foreground break-all">{{ expanded }}</code>
          </div>
          <div class="border-t border-border/50 pt-2">
            <span class="text-xs text-muted-foreground uppercase tracking-wider font-semibold block mb-1">Active Selection</span>
            <code class="text-foreground break-all">
              <template v-if="multiple">
                {{ selection ? selection.map((s: any) => s.label) : '[]' }}
              </template>
              <template v-else>
                {{ selection ? selection.label : 'null' }}
              </template>
            </code>
          </div>
        </div>

      </div>
    </template>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Source Code Slot               -->
    <!-- ========================================== -->
    <template #code>
      <CodeBlock language="vue" :code="codeString" class="border-0 bg-transparent m-0 p-0" />
    </template>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Settings Panel Slot            -->
    <!-- ========================================== -->
    <template #settings>
      <!-- Panel Header & Reset -->
      <div class="flex items-center justify-between mb-8">
        <span class="font-semibold text-base text-foreground tracking-tight">Settings</span>
        <button @click="resetSettings" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Reset</button>
      </div>

      <!-- Multiple Selection Toggle -->
      <div class="flex items-center justify-between mb-6 border-b border-border pb-6">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-foreground cursor-pointer select-none" @click="multiple = !multiple">Multiple Selection</label>
          <span class="text-xs text-muted-foreground">Allow selecting multiple files.</span>
        </div>
        <button @click="multiple = !multiple" :class="['w-10 h-6 rounded-full transition-colors duration-300 relative shrink-0', multiple ? 'bg-foreground' : 'bg-muted']">
          <div :class="['w-4 h-4 rounded-full absolute top-[4px] transition-transform duration-300', multiple ? 'translate-x-[20px] bg-background' : 'translate-x-[4px] bg-muted-foreground shadow-sm']"></div>
        </button>
      </div>

      <!-- Selection Behavior Select -->
      <div class="flex flex-col gap-2 mb-2">
        <label class="text-sm font-medium text-foreground">Selection Behavior</label>
        <div class="relative">
          <select v-model="selectionBehavior" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="toggle">Toggle (Add/Remove on click)</option>
            <option value="replace">Replace (Deselects others)</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

    </template>
  </DocContent>
</template>