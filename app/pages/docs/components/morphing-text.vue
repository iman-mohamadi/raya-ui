<script setup lang="ts">
import { ref, computed } from 'vue'
import { MorphingText } from '@/components/ui/morphing-text'
import { CodeBlock } from '@/components/ui/code-block'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'Morphing Text Component for Vue & Nuxt',
  description: 'A text animation component for Vue and Nuxt that morphs between strings using SVG filters and blur effects.',
  ogTitle: 'Morphing Text Component for Vue & Nuxt',
  ogDescription: 'A text animation component for Vue and Nuxt that morphs between strings using SVG filters and blur effects.',
})

// --- Interactive Settings State ---
const textInput = ref('Raya, UI, Is, Awesome')
const morphTime = ref(1.5)
const coolDownTime = ref(0.5)

const resetSettings = () => {
  textInput.value = 'Raya, UI, Is, Awesome'
  morphTime.value = 1.5
  coolDownTime.value = 0.5
}

// Convert comma-separated string to array, fallback to default if empty
const textsArray = computed(() => {
  const arr = textInput.value.split(',').map(s => s.trim()).filter(Boolean)
  return arr.length > 0 ? arr : ['Type', 'Something']
})

// --- Installation Tabs ---
const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add morphing-text'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add morphing-text'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add morphing-text'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add morphing-text'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install clsx tailwind-merge`,
    css: `/* Inherits seamlessly from your main.css theme variables */`
  }
})

// --- Dynamic Source Code ---
const codeString = computed(() => {
  let props = `:texts="texts"`
  if (morphTime.value !== 1.5) props += `\n    :morph-time="${morphTime.value}"`
  if (coolDownTime.value !== 0.5) props += `\n    :cool-down-time="${coolDownTime.value}"`

  const formattedTexts = textsArray.value.map(t => `  "${t}"`).join(',\n')

  return `<script setup lang="ts">
import { MorphingText } from '@/components/ui/morphing-text'

const texts = [
${formattedTexts}
]
<\/script>

<template>
  <MorphingText
    ${props}
  />
</template>`
})
</script>

<template>
  <DocContent>
    <!-- Breadcrumb Title -->
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Morphing Text</span>
    </template>

    <!-- ========================================== -->
    <!-- LEFT PANE: Full Documentation              -->
    <!-- ========================================== -->
    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Morphing Text</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A cinematic text animation that morphs fluidly between a sequence of strings using advanced SVG filters and blur blending.
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
        <p class="text-sm text-muted-foreground mt-2">2. Copy the component code into <code>components/ui/morphing-text</code>.</p>
      </div>

      <!-- CSS Install -->
      <div v-if="activeInstallTab === 'css'" class="flex flex-col gap-4">
        <div class="rounded-lg border border-info/20 bg-info/10 p-4 text-sm text-info mb-2">
          <strong class="font-semibold">Ready to go:</strong> This component handles the SVG <code>&lt;filter&gt;</code> injection automatically and seamlessly inherits your typography from <code>main.css</code>.
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
                  morphing-text
                </div>
                <div class="relative ml-6 before:absolute before:-left-2 before:inset-y-0 before:w-px before:bg-border">
                  <div class="flex items-center gap-2 py-1 text-muted-foreground"><div class="w-4 border-t border-border mr-2"></div>MorphingText.vue</div>
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
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">texts</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">string[]</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">An array of strings to cycle through endlessly.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">morphTime</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">1.5</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The duration of the actual morphing transition (blur to sharp) in seconds.</p>
          </div>
        </div>

        <div class="flex items-start gap-4 px-5 py-4 border-b border-border">
          <div class="w-44 shrink-0">
            <code class="text-sm bg-muted text-foreground py-1 px-2 rounded-lg">coolDownTime</code>
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <code class="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">number</code>
              <div class="flex-1"></div>
              <code class="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">0.5</code>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mt-2">The duration the text stays fully visible and sharp before morphing into the next string.</p>
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================== -->
    <!-- RIGHT PANE: Visual Preview Slot            -->
    <!-- ========================================== -->
    <template #preview>
      <div class="w-full flex items-center justify-center p-6 min-h-[400px]">
        <div class="relative w-full max-w-2xl rounded-2xl border border-border bg-background shadow-sm flex flex-col items-center justify-center overflow-hidden py-24">
          <MorphingText
              :texts="textsArray"
              :morph-time="morphTime"
              :cool-down-time="coolDownTime"
              class="text-foreground"
          />
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

      <!-- Word List Input -->
      <div class="flex flex-col gap-2 mb-6 border-b border-border pb-6">
        <label class="text-sm font-medium text-foreground">Word Sequence</label>
        <p class="text-xs text-muted-foreground mb-1">Comma separated list of words to morph between.</p>
        <input
            type="text"
            v-model="textInput"
            class="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all"
        />
      </div>

      <!-- Morph Time Slider -->
      <div class="flex flex-col gap-3 mb-6">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Morphing Duration</label>
          <span class="text-xs font-mono text-muted-foreground">{{ morphTime.toFixed(1) }}s</span>
        </div>
        <input
            type="range"
            v-model.number="morphTime"
            min="0.5"
            max="5"
            step="0.1"
            class="w-full accent-foreground"
        />
      </div>

      <!-- Cool Down Time Slider -->
      <div class="flex flex-col gap-3 mb-2">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-foreground">Read Time (Cooldown)</label>
          <span class="text-xs font-mono text-muted-foreground">{{ coolDownTime.toFixed(1) }}s</span>
        </div>
        <input
            type="range"
            v-model.number="coolDownTime"
            min="0.1"
            max="3"
            step="0.1"
            class="w-full accent-foreground"
        />
      </div>

    </template>
  </DocContent>
</template>