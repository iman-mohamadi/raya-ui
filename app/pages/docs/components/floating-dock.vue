<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Home, Terminal, CircleUser, Settings,
  LayoutGrid, FolderGit2, Ghost
} from 'lucide-vue-next'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Floating Dock Component for Vue & Nuxt',
  description: 'A Mac-OS style dock component for Vue and Nuxt that floats and scales items based on mouse proximity.',
  ogTitle: 'Floating Dock Component for Vue & Nuxt',
  ogDescription: 'A Mac-OS style dock component for Vue and Nuxt that floats and scales items based on mouse proximity.',
})

// --- Interactive Settings State ---
const alignment = ref('bottom')
const itemCount = ref(5)

const resetSettings = () => {
  alignment.value = 'bottom'
  itemCount.value = 5
}

// --- Demo Data ---
const allDockItems = [
  { title: 'Home', icon: Home, href: '#' },
  { title: 'Products', icon: Terminal, href: '#' },
  { title: 'Components', icon: LayoutGrid, href: '#' },
  { title: 'Changelog', icon: FolderGit2, href: '#' },
  { title: 'Raya UI', icon: Ghost, href: '#' },
  { title: 'Profile', icon: CircleUser, href: '#' },
  { title: 'Settings', icon: Settings, href: '#' },
]

const activeItems = computed(() => allDockItems.slice(0, itemCount.value))

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add floating-dock'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add floating-dock'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add floating-dock'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add floating-dock'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install @vueuse/core clsx tailwind-merge lucide-vue-next`,
    css: `/* Inherits seamlessly from your main.css theme variables */`
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  const desktopPosition = alignment.value === 'top' ? 'absolute top-10' : 'absolute bottom-10'
  const mobilePosition = alignment.value === 'top' ? 'absolute top-10 right-10' : 'absolute bottom-10 right-10'

  // Dynamically generate the imports based on active items
  const iconImports = activeItems.value.map(item => item.icon.__name).join(', ')
  const itemsArray = activeItems.value.map(item => `  { title: '${item.title}', icon: ${item.icon.__name}, href: '${item.href}' }`).join(',\n')

  return `<script setup lang="ts">
import { FloatingDock } from '@/components/ui/floating-dock'
import { ${iconImports} } from 'lucide-vue-next'

const items = [
${itemsArray}
]
<\/script>

<template>
  <div class="relative h-[400px] w-full flex items-center justify-center">
    <FloatingDock
      :items="items"
      desktop-class="${desktopPosition}"
      mobile-class="${mobilePosition}"
    />
  </div>
</template>`
})
</script>

<template>
  <NuxtLayout name="docs">
    <!-- Breadcrumb Title -->
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Floating Dock</span>
    </template>

    <!-- ========================================== -->
    <!-- LEFT PANE: Full Documentation              -->
    <!-- ========================================== -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Floating Dock</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A Mac-OS style dock that floats and smoothly scales its items based on mouse proximity. Includes a mobile-responsive expanding menu.
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
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/floating-dock</code>.</p>
      </div>

      <!-- CSS Install -->
      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Ready to go:</strong> This component inherits your typography and background colors seamlessly from your <code>main.css</code> theme variables.
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
                  floating-dock
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>FloatingDock.vue</div>
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>FloatingDockDesktop.vue</div>
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>FloatingDockMobile.vue</div>
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>FloatingDockIcon.vue</div>
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
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">Array&lt;{ title: string, icon: Component, href: string }&gt;</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Array of items to render in the dock. Each requires a title, a Vue component for the icon (e.g., from lucide-vue-next), and an href link.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">desktopClass</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">""</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Tailwind classes applied to the desktop container. Used primarily for absolute positioning.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">mobileClass</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">""</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Tailwind classes applied to the mobile expanding button container.</p>
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Visual Preview Slot            -->
    <!-- ========================================== -->
    <template #preview>
      <div class="w-full h-full relative overflow-hidden flex items-center justify-center p-6 bg-grid-white/[0.02]">
        <!-- Interactive Preview -->
        <FloatingDock
            :items="activeItems"
            :desktop-class="alignment === 'top' ? 'absolute top-10' : 'absolute bottom-10'"
            :mobile-class="alignment === 'top' ? 'absolute top-10 right-10' : 'absolute bottom-10 right-10'"
        />
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

      <!-- Alignment Select -->
      <div class="flex flex-col gap-2 mb-6">
        <label class="text-sm font-medium text-foreground">Alignment Position</label>
        <div class="relative">
          <select v-model="alignment" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="bottom">Bottom (Default)</option>
            <option value="top">Top</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <!-- Item Count Slider -->
      <div class="flex flex-col gap-3 mb-2">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Number of Items</label>
          <span class="text-xs font-mono text-muted-foreground">{{ itemCount }}</span>
        </div>
        <input
            type="range"
            v-model.number="itemCount"
            min="3"
            max="7"
            step="1"
            class="w-full accent-foreground"
        />
      </div>

    </template>
  </NuxtLayout>
</template>