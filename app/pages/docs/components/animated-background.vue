<script setup lang="ts">
import { ref, computed } from 'vue'
import { AnimatedBackground } from '@/components/raya/ui/animated-background'
import { Home, PhoneCall, Settings, User } from 'lucide-vue-next'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'Animated Background Component for Vue & Nuxt',
  description: 'Visually highlights selected items by sliding a background into view when hovered over or clicked.',
})

// --- Interactive Settings State ---
const activeTab = ref(1)
const enableHover = ref(false)
const bounce = ref(0.2)
const duration = ref(0.3)

const TABS = [
  { id: 1, label: 'Home', icon: Home },
  { id: 2, label: 'About', icon: User },
  { id: 3, label: 'Services', icon: Settings },
  { id: 4, label: 'Contact', icon: PhoneCall },
]

const resetSettings = () => {
  activeTab.value = 1
  enableHover.value = false
  bounce.value = 0.2
  duration.value = 0.3
}

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add animated-background'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add animated-background'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add animated-background'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add animated-background'; break;
  }
  return {
    cli: cliCmd,
    manual: `npm install motion-v clsx tailwind-merge`
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  let props = `v-model="activeTab"\n    :items="TABS"`
  if (enableHover.value) props += `\n    enable-hover`
  props += `\n    :transition="{ type: 'spring', bounce: ${bounce.value}, duration: ${duration.value} }"`

  return `<script setup lang="ts">
import { ref } from 'vue'
import { AnimatedBackground } from '@/components/ui/animated-background'

const activeTab = ref(1)
const TABS = [...] // Home, About, Services, Contact
<\/script>

<template>
  <AnimatedBackground
    ${props}
    class="rounded-lg bg-zinc-100 dark:bg-zinc-800"
  >
    <template #default="{ item, isActive }">
      <button
        type="button"
        class="p-2 transition-colors"
        :class="isActive ? 'text-foreground' : 'text-muted-foreground'"
      >
        <component :is="item.icon" class="size-5" />
      </button>
    </template>
  </AnimatedBackground>
</template>`
})
</script>

<template>
  <DocContent>
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Animated Background</span>
    </template>

    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Animated Background</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        Visually highlights selected items by sliding a background into view when hovered over or clicked.
      </p>
    </div>

    <!-- Installation -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">Installation</h2>

      <div class="flex items-center gap-2 mb-4 border-b border-border pb-2">
        <button
            v-for="tab in ['cli', 'manual']"
            :key="tab"
            @click="activeInstallTab = tab"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize"
            :class="activeInstallTab === tab ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'"
        >
          {{ tab }}
        </button>
      </div>

      <div v-if="activeInstallTab === 'cli'" class="w-full rounded-xl overflow-hidden border border-border bg-background">
        <div class="flex items-center px-3 h-10 border-b border-border">
          <div class="flex items-center gap-0.5 relative">
            <button
                v-for="tab in cliTabs"
                :key="tab"
                @click="activeCliTab = tab"
                class="px-3 h-7 rounded-md text-sm transition-colors"
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

      <div v-if="activeInstallTab === 'manual'" class="flex flex-col gap-4">
        <p class="text-sm text-muted-foreground">1. Install dependencies:</p>
        <div class="rounded-xl overflow-hidden border border-border bg-background p-1.5">
          <CodeBlock language="bash" :code="installCommands.manual" class="border-0 m-0 bg-transparent" />
        </div>
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/animated-background</code>.</p>
      </div>
    </div>

    <!-- API Reference -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">API Reference</h2>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0"><code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">v-model</code></div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2"><code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string | number</code></div>
            <p class="text-sm text-muted-foreground mt-2">The active item identifier (maps to item ID).</p>
          </div>
        </div>
        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0"><code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">items</code></div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2"><code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">any[]</code></div>
            <p class="text-sm text-muted-foreground mt-2">Array of items to render. Each must have a unique <code>id</code>.</p>
          </div>
        </div>
        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0"><code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">enable-hover</code></div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2"><code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">boolean</code></div>
            <p class="text-sm text-muted-foreground mt-2">If true, background follows mouse enter instead of click.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT PANE SLOTS -->
    <template #preview>
      <div class="flex w-fit space-x-2 rounded-xl border border-zinc-950/10 bg-white dark:bg-zinc-950 p-2">
        <AnimatedBackground
            v-model="activeTab"
            :items="TABS"
            :enable-hover="enableHover"
            class="rounded-lg bg-zinc-100 dark:bg-zinc-800"
            :transition="{ type: 'spring', bounce: bounce, duration: duration }"
        >
          <template #default="{ item, isActive }">
            <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center transition-colors duration-100"
                :class="isActive ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-500'"
            >
              <component :is="item.icon" class="size-5" />
            </button>
          </template>
        </AnimatedBackground>
      </div>
    </template>

    <template #code>
      <CodeBlock language="vue" :code="codeString" class="border-0 bg-transparent m-0 p-0" />
    </template>

    <template #settings>
      <div class="flex items-center justify-between mb-8">
        <span class="font-semibold text-base text-foreground tracking-tight">Settings</span>
        <button @click="resetSettings" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Reset</button>
      </div>

      <div class="flex items-center justify-between mb-6">
        <label class="text-sm font-medium text-foreground cursor-pointer select-none">Enable Hover</label>
        <button @click="enableHover = !enableHover" :class="['w-10 h-6 rounded-full transition-colors relative', enableHover ? 'bg-foreground' : 'bg-muted']">
          <div :class="['w-4 h-4 rounded-full absolute top-[4px] transition-transform', enableHover ? 'translate-x-[20px] bg-background' : 'translate-x-[4px] bg-muted-foreground']"></div>
        </button>
      </div>

      <div class="flex flex-col gap-4 mb-6">
        <div class="flex justify-between"><label class="text-sm font-medium">Bounce</label><span class="text-xs font-mono text-muted-foreground">{{ bounce }}</span></div>
        <input type="range" v-model.number="bounce" min="0" max="1" step="0.1" class="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground" />
      </div>

      <div class="flex flex-col gap-4 mb-6">
        <div class="flex justify-between"><label class="text-sm font-medium">Duration</label><span class="text-xs font-mono text-muted-foreground">{{ duration }}s</span></div>
        <input type="range" v-model.number="duration" min="0.1" max="2" step="0.1" class="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground" />
      </div>
    </template>
  </DocContent>
</template>