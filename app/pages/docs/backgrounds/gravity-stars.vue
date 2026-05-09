<script setup lang="ts">
import { ref, computed } from 'vue'
import { GravityStars } from '@/components/ui/gravity-stars'
import { LiquidGlass } from '@/components/ui/liquid-glass'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'Gravity Stars Component for Vue & Nuxt',
  description: 'Interactive star field component for Vue and Nuxt that reacts to mouse gravity with smooth physics.',
  ogTitle: 'Gravity Stars Component for Vue & Nuxt',
  ogDescription: 'Interactive star field component for Vue and Nuxt that reacts to mouse gravity with smooth physics.',
})

// --- Interactive Settings State ---
const starsCount = ref(100)
const mouseInfluence = ref(200)
const gravityStrength = ref(50)
const mouseGravity = ref<'attract' | 'repel'>('attract')

const resetSettings = () => {
  starsCount.value = 100
  mouseInfluence.value = 200
  gravityStrength.value = 50
  mouseGravity.value = 'attract'
}

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add gravity-stars'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add gravity-stars'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add gravity-stars'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add gravity-stars'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install clsx tailwind-merge`,
    css: `/* Inherits colors from your main.css theme variables */`
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  let props = ``
  if (starsCount.value !== 75) props += `\n    :stars-count="${starsCount.value}"`
  if (mouseInfluence.value !== 100) props += `\n    :mouse-influence="${mouseInfluence.value}"`
  if (gravityStrength.value !== 50) props += `\n    :gravity-strength="${gravityStrength.value}"`
  if (mouseGravity.value !== 'attract') props += `\n    mouse-gravity="${mouseGravity.value}"`

  return `<script setup lang="ts">
import { GravityStars } from '@/components/ui/gravity-stars'
<\/script>

<template>
  <div class="relative w-full h-[500px] overflow-hidden bg-background">
    <GravityStars${props}
      class="text-foreground"
    />

    <div class="relative z-10 flex items-center justify-center h-full pointer-events-none">
      <h1 class="text-5xl font-bold tracking-tighter">Gravity Field</h1>
    </div>
  </div>
</template>`
})
</script>

<template>
  <DocContent>
    <!-- Breadcrumb Title -->
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Gravity Stars</span>
    </template>

    <!-- ========================================== -->
    <!-- LEFT PANE: Full Documentation              -->
    <!-- ========================================== -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Gravity Stars</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        An interactive particle field that simulates gravitational pull or repulsion based on mouse proximity. Built with high-performance Canvas rendering.
      </p>
    </div>

    <!-- Installation -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">Installation</h2>

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

      <div v-if="activeInstallTab === 'manual'" class="flex flex-col gap-4">
        <p class="text-sm text-muted-foreground">1. Install dependencies:</p>
        <div class="rounded-xl overflow-hidden border border-border bg-background p-1.5">
          <CodeBlock language="bash" :code="installCommands.manual" class="border-0 m-0 bg-transparent" />
        </div>
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/gravity-stars</code>.</p>
      </div>

      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Ready to go:</strong> This component uses Canvas and naturally inherits the <code>text-foreground</code> color for the particles.
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
                  gravity-stars
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>GravityStars.vue</div>
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
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">starsCount</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">75</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The density of the star field. Higher values increase CPU usage.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">mouseInfluence</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">100</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The radius (in pixels) around the cursor where physics forces are applied.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">gravityStrength</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">50</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The intensity of the gravitational force.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">mouseGravity</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">enum</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"attract"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Determines physics behavior. <code>attract</code> pulls stars in; <code>repel</code> pushes them away.</p>
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Visual Preview Slot            -->
    <!-- ========================================== -->
    <template #preview>
      <div class="w-full h-full relative overflow-hidden flex items-center justify-center p-6 bg-background rounded-3xl">
        <GravityStars
            :stars-count="starsCount"
            :mouse-influence="mouseInfluence"
            :gravity-strength="gravityStrength"
            :mouse-gravity="mouseGravity"
            class="absolute inset-0 text-foreground"
        />

        <LiquidGlass>
          <div class="relative z-10 text-center pointer-events-none p-8 bg-background/40 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl">
            <h2 class="text-4xl font-bold tracking-tighter text-foreground">Gravity</h2>
            <p class="text-muted-foreground text-sm mt-2">Move your mouse to interact</p>
          </div>
        </LiquidGlass>
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
      <div class="flex items-center justify-between mb-8">
        <span class="font-semibold text-base text-foreground tracking-tight">Settings</span>
        <button @click="resetSettings" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Reset</button>
      </div>

      <!-- Mode Switch -->
      <div class="flex flex-col gap-2 mb-6 border-b border-border pb-6">
        <label class="text-sm font-medium text-foreground">Interaction Mode</label>
        <div class="relative">
          <select v-model="mouseGravity" class="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all">
            <option value="attract">Attract (Pull)</option>
            <option value="repel">Repel (Push)</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <!-- Stars Count Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Star Density</label>
          <span class="text-xs font-mono text-muted-foreground">{{ starsCount }}</span>
        </div>
        <input type="range" v-model.number="starsCount" min="20" max="300" step="5" class="w-full accent-foreground" />
      </div>

      <!-- Influence Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Influence Radius</label>
          <span class="text-xs font-mono text-muted-foreground">{{ mouseInfluence }}px</span>
        </div>
        <input type="range" v-model.number="mouseInfluence" min="50" max="400" step="10" class="w-full accent-foreground" />
      </div>

      <!-- Strength Slider -->
      <div class="flex flex-col gap-3 mb-2">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Gravity Strength</label>
          <span class="text-xs font-mono text-muted-foreground">{{ gravityStrength }}</span>
        </div>
        <input type="range" v-model.number="gravityStrength" min="10" max="150" step="5" class="w-full accent-foreground" />
      </div>

    </template>
  </DocContent>
</template>