<script lang="ts" setup>
import {computed, ref} from 'vue'
import {BackgroundBeams} from '@/components/raya/ui/background-beams'
import {CodeBlock} from '@/components/raya/ui/code-block'

definePageMeta({layout: 'docs'})

useSeoMeta({
  title: 'Background Beams Component for Vue & Nuxt',
  description: 'A background component for Vue and Nuxt featuring multiple beams that traverse the container, creating a stunning visual effect.',
  ogTitle: 'Background Beams Component for Vue & Nuxt',
  ogDescription: 'A background component for Vue and Nuxt featuring multiple beams that traverse the container, creating a stunning visual effect.',
})

// --- Interactive Settings State ---
const colorFrom = ref('#18CCFC')
const colorMid = ref('#6344F5')
const colorTo = ref('#AE48FF')
const duration = ref(10)

const resetSettings = () => {
  colorFrom.value = '#18CCFC'
  colorMid.value = '#6344F5'
  colorTo.value = '#AE48FF'
  duration.value = 10
}

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add background-beams'
  switch (activeCliTab.value) {
    case 'pnpm':
      cliCmd = 'pnpm dlx raya-ui@latest add background-beams';
      break;
    case 'yarn':
      cliCmd = 'yarn dlx raya-ui@latest add background-beams';
      break;
    case 'bun':
      cliCmd = 'bun x --bun raya-ui@latest add background-beams';
      break;
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
  if (colorFrom.value !== '#18CCFC') props += `\n    color-from="${colorFrom.value}"`
  if (colorMid.value !== '#6344F5') props += `\n    color-mid="${colorMid.value}"`
  if (colorTo.value !== '#AE48FF') props += `\n    color-to="${colorTo.value}"`
  if (duration.value !== 10) props += `\n    :duration="${duration.value}"`

  return `<script setup lang="ts">
import { BackgroundBeams } from '@/components/ui/background-beams'
<\/script>

<template>
  <div class="relative w-full h-[40rem] rounded-xl bg-background overflow-hidden flex items-center justify-center">
    <div class="relative z-10 text-center">
      <h1 class="text-7xl font-bold tracking-tighter">Traverse</h1>
    </div>
    <BackgroundBeams${props} />
  </div>
</template>`
})
</script>

<template>
  <DocContent>
    <!-- Breadcrumb Title -->
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Background Beams</span>
    </template>

    <!-- ========================================== -->
    <!-- LEFT PANE: Full Documentation              -->
    <!-- ========================================== -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Background Beams</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A stunning visual component featuring multiple light beams that traverse the container path, creating an
        elegant, high-tech background atmosphere.
      </p>
    </div>

    <!-- Installation -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">Installation</h2>

      <div class="flex items-center gap-2 mb-4 border-b border-border pb-2">
        <button
            v-for="tab in ['cli', 'manual', 'css']"
            :key="tab"
            :class="activeInstallTab === tab ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize"
            @click="activeInstallTab = tab"
        >
          {{ tab }}
        </button>
      </div>

      <div v-if="activeInstallTab === 'cli'"
           class="w-full gap-0 rounded-xl overflow-hidden border border-border bg-background">
        <div class="flex items-center px-3 h-10 border-b border-border">
          <div class="flex items-center gap-0.5 relative">
            <button
                v-for="tab in cliTabs"
                :key="tab"
                :class="activeCliTab === tab ? 'text-foreground bg-muted' : 'text-muted-foreground hover:text-foreground'"
                class="relative z-10 px-3 h-7 rounded-md text-sm transition-colors"
                @click="activeCliTab = tab"
            >
              {{ tab }}
            </button>
          </div>
        </div>
        <div class="p-1.5">
          <CodeBlock :code="installCommands.cli" class="border-0 m-0 bg-transparent" language="bash"/>
        </div>
      </div>

      <div v-if="activeInstallTab === 'manual'" class="flex flex-col gap-4">
        <p class="text-sm text-muted-foreground">1. Install dependencies:</p>
        <div class="rounded-xl overflow-hidden border border-border bg-background p-1.5">
          <CodeBlock :code="installCommands.manual" class="border-0 m-0 bg-transparent" language="bash"/>
        </div>
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/background-beams</code>.
        </p>
      </div>

      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Ready to go:</strong> This component uses internal SVG paths and inherits your
          surface background colors from <code>main.css</code>.
        </div>
      </div>
    </div>

    <!-- File Structure -->
    <div class="flex flex-col mt-4">
      <h2 class="text-4xl mt-8 mb-5 tracking-tight text-foreground">File Structure</h2>
      <div class="my-4 rounded-xl border border-border overflow-hidden bg-background">
        <div class="p-4 w-full relative font-mono text-sm text-muted-foreground">
          <div class="flex items-center gap-2 text-foreground">
            <svg class="size-4.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" stroke-linecap="round"
                    stroke-linejoin="round"></path>
            </svg>
            your-project
          </div>
          <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
            <div class="flex items-center gap-2 py-2">
              <svg class="size-4.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" stroke-linecap="round"
                      stroke-linejoin="round"></path>
              </svg>
              components
            </div>
            <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
              <div class="flex items-center gap-2 py-2">
                <svg class="size-4.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" stroke-linecap="round"
                        stroke-linejoin="round"></path>
                </svg>
                ui
              </div>
              <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                <div class="flex items-center gap-2 py-2 text-pink-500">
                  <svg class="size-4.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke-linecap="round"
                          stroke-linejoin="round"></path>
                  </svg>
                  background-beams
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-1 text-muted-foreground">
                    <div class="w-4 border-t border-border mr-2"></div>
                    BackgroundBeams.vue
                  </div>
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
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">colorFrom</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"#18CCFC"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The starting color hex code of the beam's
              trailing gradient.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">colorMid</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"#6344F5"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The center point color hex code of the beam
              gradient.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">colorTo</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"#AE48FF"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The end/exit color hex code of the beam
              gradient.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">duration</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">10</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The base duration in seconds for a beam to
              complete its traversal.</p>
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Visual Preview Slot            -->
    <!-- ========================================== -->
    <template #preview>
      <div
          class="w-full h-full relative overflow-hidden flex flex-col items-center justify-center p-6 bg-background rounded-3xl">

        <div class="max-w-2xl mx-auto p-4 relative z-10 text-center">
          <h1 class="text-4xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-foreground/80 to-foreground/20 font-bold tracking-tighter">
            Raya UI
          </h1>
          <p class="text-muted-foreground max-w-lg mx-auto my-4 text-sm leading-relaxed">
            <span class="text-info font-medium">Raya</span> (Persian: رایا) means Thought and Vision.
            Precision-engineered UI primitives for the modern web.
          </p>
          <div class="flex justify-center gap-2 mt-6">
            <div
                class="rounded-full border border-border px-8 py-2.5 bg-muted/30 text-muted-foreground text-sm font-mono">
              npx raya-ui@latest add
            </div>
          </div>
        </div>

        <BackgroundBeams
            :color-from="colorFrom"
            :color-mid="colorMid"
            :color-to="colorTo"
            :duration="duration"
        />
      </div>
    </template>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Source Code Slot               -->
    <!-- ========================================== -->
    <template #code>
      <CodeBlock :code="codeString" class="border-0 bg-transparent m-0 p-0" language="vue"/>
    </template>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Settings Panel Slot            -->
    <!-- ========================================== -->
    <template #settings>
      <div class="flex items-center justify-between mb-8">
        <span class="font-semibold text-base text-foreground tracking-tight">Settings</span>
        <button class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                @click="resetSettings">Reset
        </button>
      </div>

      <!-- Duration Slider -->
      <div class="flex flex-col gap-3 mb-8">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Traversal Duration</label>
          <span class="text-xs font-mono text-muted-foreground">{{ duration }}s</span>
        </div>
        <input v-model.number="duration" class="w-full accent-foreground" max="30" min="2" step="1" type="range"/>
      </div>

      <!-- Gradient Palette -->
      <div class="flex flex-col gap-4">
        <label class="text-sm font-medium text-foreground">Beam Palette</label>

        <div class="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
          <span class="text-xs font-medium text-muted-foreground uppercase">Start</span>
          <input v-model="colorFrom" class="size-6 rounded-full border-0 p-0 cursor-pointer bg-transparent"
                 type="color"/>
        </div>

        <div class="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
          <span class="text-xs font-medium text-muted-foreground uppercase">Midpoint</span>
          <input v-model="colorMid" class="size-6 rounded-full border-0 p-0 cursor-pointer bg-transparent"
                 type="color"/>
        </div>

        <div class="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
          <span class="text-xs font-medium text-muted-foreground uppercase">End</span>
          <input v-model="colorTo" class="size-6 rounded-full border-0 p-0 cursor-pointer bg-transparent" type="color"/>
        </div>
      </div>

    </template>
  </DocContent>
</template>