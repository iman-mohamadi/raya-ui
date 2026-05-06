<script setup lang="ts">
import { ref, computed } from 'vue'
import { PixelatedButton } from '@/components/ui/pixelated-button'
import { CodeBlock } from '@/components/ui/code-block'
import { Crown, Ghost, Sword } from 'lucide-vue-next'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'Pixelated Button Component for Vue & Nuxt',
  description: 'A complex 3D pixel-art button component for Vue and Nuxt with particles, scanlines, and high customizability.',
  ogTitle: 'Pixelated Button Component for Vue & Nuxt',
  ogDescription: 'A complex 3D pixel-art button component for Vue and Nuxt with particles, scanlines, and high customizability.',
})

// --- Interactive Settings State ---
const hue = ref(350)
const label = ref('START')
const subLabel = ref('GAME')
const scale = ref(1)
const showParticles = ref(true)

const resetSettings = () => {
  hue.value = 350
  label.value = 'START'
  subLabel.value = 'GAME'
  scale.value = 1
  showParticles.value = true
}

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add pixelated-button'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add pixelated-button'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add pixelated-button'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add pixelated-button'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install clsx tailwind-merge`,
    css: `/* Inherits seamlessly from your main.css theme variables */`
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  let props = ``
  if (hue.value !== 350) props += `\n    :hue="${hue.value}"`
  if (label.value !== 'START') props += `\n    label="${label.value}"`
  if (subLabel.value !== 'GAME') props += `\n    sub-label="${subLabel.value}"`
  if (scale.value !== 1) props += `\n    :scale="${scale.value}"`
  if (!showParticles.value) props += `\n    :show-particles="false"`

  return `<script setup lang="ts">
import { PixelatedButton } from '@/components/ui/pixelated-button'
import { Crown } from 'lucide-vue-next'
<\/script>

<template>
  <PixelatedButton${props}>
    <template #icon-left>
      <Crown class="w-6 h-6 text-yellow-300" />
    </template>
  </PixelatedButton>
</template>`
})
</script>

<template>
  <DocContent>
    <!-- Breadcrumb Title -->
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Pixelated Button</span>
    </template>

    <!-- ========================================== -->
    <!-- LEFT PANE: Full Documentation              -->
    <!-- ========================================== -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Pixelated Button</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A highly customizable, complex 3D pixel-art button featuring floating particles, CRT scanlines, and programmatic hue shifts.
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
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/pixelated-button</code>.</p>
      </div>

      <!-- CSS Install -->
      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Ready to go:</strong> This component is entirely self-contained using raw CSS variables for its intricate 3D pixel shading and requires no extra configuration.
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
                  pixelated-button
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>PixelatedButton.vue</div>
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
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">hue</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">350</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Base hue color (0-360) used to dynamically calculate the complex 3D shading palette.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">label</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"START"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The large, primary text displayed in the center of the button.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">subLabel</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">"GAME"</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The smaller subtitle text displayed beneath the main label.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">scale</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">1</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">A multiplier to easily scale the entire button structure, including fonts and particle sizes.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">showParticles</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">boolean</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">true</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Toggles the rendering of the animated floating background particles.</p>
          </div>
        </div>

      </div>

      <h3 class="text-2xl mt-8 mb-3 text-foreground">Slots</h3>
      <div class="rounded-none border-t border-border mt-4 overflow-hidden">
        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">#icon-left</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Replaces the default 3D star icon on the left side of the button.</p>
          </div>
        </div>
        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">#icon-right</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">Replaces the default 3D star icon on the right side of the button.</p>
          </div>
        </div>
      </div>

      <!-- Credits -->
      <div class="mt-8 text-sm text-muted-foreground flex justify-end items-center p-4 rounded-xl border border-border bg-muted/20">
        <p>Inspired by <a href="https://uiverse.io/wolf_3808/gentle-jellyfish-74" target="_blank" rel="noopener noreferrer" class="text-foreground hover:text-primary underline underline-offset-4 transition-colors">'wolf_3808'</a>.</p>
      </div>

    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Visual Preview Slot            -->
    <!-- ========================================== -->
    <template #preview>
      <div class="w-full h-full flex flex-col gap-12 items-center justify-center p-6 min-h-[400px] overflow-hidden bg-[#0a0a0a] rounded-xl border border-border/10 shadow-inner">
        <!-- Interactive Preview -->
        <PixelatedButton
            :hue="hue"
            :label="label"
            :sub-label="subLabel"
            :scale="scale"
            :show-particles="showParticles"
        >
          <template #icon-left>
            <Crown class="w-6 h-6 text-yellow-300 drop-shadow-md" />
          </template>
        </PixelatedButton>

        <!-- Static Configured Examples to show versatility -->
        <div class="flex items-center gap-12 mt-8 scale-75 opacity-70 pointer-events-none filter saturate-50">
          <PixelatedButton :hue="120" label="SUCCESS" sub-label="SAVED" :scale="0.8" />
          <PixelatedButton :hue="240" label="CONFIG" sub-label="MENU" :scale="0.8">
            <template #icon-left><Ghost class="w-6 h-6" /></template>
            <template #icon-right><Sword class="w-5 h-5" /></template>
          </PixelatedButton>
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

      <!-- Main Label Input -->
      <div class="flex flex-col gap-2 mb-6">
        <label class="text-sm font-medium text-foreground">Main Label</label>
        <input
            type="text"
            v-model="label"
            maxlength="10"
            class="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all uppercase font-mono"
        />
      </div>

      <!-- Sub Label Input -->
      <div class="flex flex-col gap-2 mb-6">
        <label class="text-sm font-medium text-foreground">Sub Label</label>
        <input
            type="text"
            v-model="subLabel"
            maxlength="12"
            class="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all uppercase font-mono"
        />
      </div>

      <!-- Hue Slider (Full Rainbow) -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Color Hue</label>
          <span class="text-xs font-mono text-muted-foreground">{{ hue }}</span>
        </div>
        <input
            type="range"
            v-model.number="hue"
            min="0"
            max="360"
            step="5"
            class="w-full"
            style="accent-color: hsl(var(--hue, 350), 80%, 50%); background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);"
            @input="(e) => (e.target as HTMLElement).style.setProperty('--hue', hue.toString())"
        />
      </div>

      <!-- Scale Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Button Scale</label>
          <span class="text-xs font-mono text-muted-foreground">{{ scale.toFixed(1) }}x</span>
        </div>
        <input
            type="range"
            v-model.number="scale"
            min="0.5"
            max="1.5"
            step="0.1"
            class="w-full accent-foreground"
        />
      </div>

      <!-- Particles Toggle -->
      <div class="flex items-center justify-between mb-2">
        <label class="text-sm font-medium text-foreground cursor-pointer select-none" @click="showParticles = !showParticles">Show Particles</label>
        <button @click="showParticles = !showParticles" :class="['w-10 h-6 rounded-full transition-colors duration-300 relative', showParticles ? 'bg-foreground' : 'bg-muted']">
          <div :class="['w-4 h-4 rounded-full absolute top-[4px] transition-transform duration-300', showParticles ? 'translate-x-[20px] bg-background' : 'translate-x-[4px] bg-muted-foreground shadow-sm']"></div>
        </button>
      </div>

    </template>
  </DocContent>
</template>