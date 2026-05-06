<script setup lang="ts">
import { ref, computed } from 'vue'
import { Magnetic } from '@/components/ui/magnetic'
import { CodeBlock } from '@/components/ui/code-block'
import { Button } from '@/components/ui/button'
import { Plus, Github, Twitter, Instagram } from 'lucide-vue-next'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Magnetic Component for Vue & Nuxt',
  description: 'A magnetic effect component that attracts elements to the mouse cursor within a specific range.',
  ogTitle: 'Magnetic Component for Vue & Nuxt',
  ogDescription: 'A magnetic effect component that attracts elements to the mouse cursor within a specific range.',
})

// --- Interactive Settings State ---
const activeExample = ref('basic') // basic, social, parent
const intensity = ref(0.3)
const range = ref(150)
const actionArea = ref('self') // self, parent, global

const resetSettings = () => {
  activeExample.value = 'basic'
  intensity.value = 0.3
  range.value = 150
  actionArea.value = 'self'
}

// --- Demo Data ---
const socialLinks = [
  { icon: Github, label: 'Github' },
  { icon: Twitter, label: 'Twitter' },
  { icon: Instagram, label: 'Instagram' }
]

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add magnetic'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add magnetic'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add magnetic'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add magnetic'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install motion-v @vueuse/core`,
    css: `/* Inherits seamlessly from your main.css theme variables */`
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  let props = `:intensity="${intensity.value}"\n    :range="${range.value}"`
  if (actionArea.value !== 'self') props += `\n    action-area="${actionArea.value}"`

  if (activeExample.value === 'social') {
    return `<script setup lang="ts">
import { Magnetic } from '@/components/ui/magnetic'
import { Github, Twitter, Instagram } from 'lucide-vue-next'

const links = [
  { icon: Github, label: 'Github' },
  { icon: Twitter, label: 'Twitter' },
  { icon: Instagram, label: 'Instagram' }
]
<\/script>

<template>
  <div class="flex gap-6">
    <Magnetic
      v-for="link in links"
      :key="link.label"
      ${props.replace(/\n/g, '\n      ')}
    >
      <div class="p-4 rounded-full bg-muted border border-border hover:bg-muted/80 transition-colors cursor-pointer group">
        <component :is="link.icon" class="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
    </Magnetic>
  </div>
</template>`
  }

  if (activeExample.value === 'parent') {
    return `<script setup lang="ts">
import { Magnetic } from '@/components/ui/magnetic'
<\/script>

<template>
  <div class="w-full max-w-md h-64 border-2 border-dashed border-border rounded-xl flex items-center justify-center relative bg-muted/20">
    <p class="absolute top-4 left-4 text-xs text-muted-foreground uppercase tracking-widest">Parent Container</p>

    <Magnetic
      ${props.replace(/\n/g, '\n      ')}
    >
      <button class="px-8 py-4 bg-foreground text-background rounded-full font-bold shadow-xl hover:scale-105 transition-transform">
        Magnetic Button
      </button>
    </Magnetic>
  </div>
</template>`
  }

  return `<script setup lang="ts">
import { Magnetic } from '@/components/ui/magnetic'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
<\/script>

<template>
  <Magnetic
    ${props}
  >
    <Button variant="outline" class="rounded-full h-16 w-16 p-0 flex items-center justify-center border-2">
      <Plus class="w-6 h-6" />
    </Button>
  </Magnetic>
</template>`
})
</script>

<template>
  <NuxtLayout name="docs">
    <!-- Breadcrumb Title -->
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Magnetic</span>
    </template>

    <!-- ========================================== -->
    <!-- LEFT PANE: Full Documentation              -->
    <!-- ========================================== -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Magnetic</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A magnetic effect that smoothly attracts elements to the mouse cursor based on configurable physics and proximity ranges.
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
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/magnetic</code>.</p>
      </div>

      <!-- CSS Install -->
      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Ready to go:</strong> This component inherits your typography and layout colors seamlessly from your <code>main.css</code> theme variables.
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
                  magnetic
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>Magnetic.vue</div>
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
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">intensity</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">0.6</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Strength of the magnetic attraction. A value between 0 and 1 is recommended.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">range</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">100</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Pixel radius around the element where the magnetic effect becomes active.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">actionArea</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">enum</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"self"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Defines the hover trigger area boundary. Accepts 'self' (default), 'parent' (container), or 'global' (always active).</p>
          </div>
        </div>

      </div>
    </div>

    <!-- Credits -->
    <div class="mt-8 text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-2 bg-muted/20 p-4 rounded-xl border border-border">
      <p>Vue component created & ported by the author of Raya UI.</p>
      <p>
        Original concept by
        <a href="https://motion-primitives.com/docs/magnetic" target="_blank" rel="noopener noreferrer" class="text-foreground hover:text-primary underline underline-offset-4 transition-colors">
          Motion Primitives
        </a>
      </p>
    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Visual Preview Slot            -->
    <!-- ========================================== -->
    <template #preview>
      <div class="w-full flex items-center justify-center p-6 min-h-[300px]">

        <!-- Basic Example -->
        <Magnetic v-if="activeExample === 'basic'" :intensity="intensity" :range="range" :action-area="actionArea">
          <Button variant="outline" class="rounded-full h-16 w-16 p-0 flex items-center justify-center border-2 border-border bg-background shadow-sm hover:bg-muted transition-colors">
            <Plus class="w-6 h-6 text-foreground" />
          </Button>
        </Magnetic>

        <!-- Social Links Example -->
        <div v-else-if="activeExample === 'social'" class="flex gap-6">
          <Magnetic
              v-for="link in socialLinks"
              :key="link.label"
              :intensity="intensity"
              :range="range"
              :action-area="actionArea"
          >
            <div class="p-4 rounded-full bg-muted border border-border hover:bg-muted/80 transition-colors cursor-pointer group shadow-sm">
              <component :is="link.icon" class="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </Magnetic>
        </div>

        <!-- Parent Area Example -->
        <div v-else-if="activeExample === 'parent'" class="w-full max-w-md h-64 border-2 border-dashed border-border rounded-xl flex items-center justify-center relative bg-muted/20">
          <p class="absolute top-4 left-4 text-xs text-muted-foreground uppercase tracking-widest font-medium">Parent Container</p>
          <Magnetic :intensity="intensity" :range="range" :action-area="actionArea">
            <button class="px-8 py-4 bg-foreground text-background rounded-full font-bold shadow-xl hover:scale-105 transition-transform">
              Magnetic Button
            </button>
          </Magnetic>
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

      <!-- Example Switcher -->
      <div class="flex flex-col gap-2 mb-6 border-b border-border pb-6">
        <label class="text-sm font-medium text-foreground">Example Variant</label>
        <div class="relative">
          <select v-model="activeExample" @change="actionArea = activeExample === 'parent' ? 'parent' : 'self'" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="basic">Basic Button</option>
            <option value="social">Social Links</option>
            <option value="parent">Parent Action Area</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <!-- Intensity Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Intensity</label>
          <span class="text-xs font-mono text-muted-foreground">{{ intensity.toFixed(2) }}</span>
        </div>
        <input type="range" v-model.number="intensity" min="0.1" max="1" step="0.1" class="w-full accent-foreground" />
      </div>

      <!-- Range Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Range (px)</label>
          <span class="text-xs font-mono text-muted-foreground">{{ range }}</span>
        </div>
        <input type="range" v-model.number="range" min="20" max="300" step="10" class="w-full accent-foreground" />
      </div>

      <!-- Action Area Select -->
      <div class="flex flex-col gap-2 mb-2">
        <label class="text-sm font-medium text-foreground">Action Area</label>
        <div class="relative">
          <select v-model="actionArea" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="self">Self (Default)</option>
            <option value="parent">Parent Container</option>
            <option value="global">Global (Window)</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

    </template>
  </NuxtLayout>
</template>