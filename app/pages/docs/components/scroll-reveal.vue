<script setup lang="ts">
import { ref, computed } from 'vue'
import { ScrollReveal } from '@/components/raya/ui/scroll-reveal'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CodeBlock } from '@/components/raya/ui/code-block'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'Scroll Reveal Component for Vue & Nuxt',
  description: 'A cinematic text component that fluidly reveals content word-by-word as users scroll down the viewport naturally.',
})

const sampleText = ref('Raya UI is a high-performance registry of UI primitives engineered to bring fluid, physics-based interactions and clean aesthetics directly into your project codebase.')

const resetSettings = () => {
  sampleText.value = 'Raya UI is a high-performance registry of UI primitives engineered to bring fluid, physics-based interactions and clean aesthetics directly into your project codebase.'
}

const activeInstallTab = ref('cli')
const activeCliTab = ref('npm')
const cliTabs = ['npm', 'pnpm', 'yarn', 'bun']

const installCommands = computed(() => {
  let cliCmd = 'npx raya-ui@latest add scroll-reveal'
  switch(activeCliTab.value) {
    case 'pnpm': cliCmd = 'pnpm dlx raya-ui@latest add scroll-reveal'; break;
    case 'yarn': cliCmd = 'yarn dlx raya-ui@latest add scroll-reveal'; break;
    case 'bun':  cliCmd = 'bun x --bun raya-ui@latest add scroll-reveal'; break;
  }

  return {
    cli: cliCmd,
    manual: `npm install clsx tailwind-merge`,
  }
})

const codeString = computed(() => {
  return `<script setup lang="ts">
import { ScrollReveal } from '@/components/ui/scroll-reveal'
<\/script>

<template>
  <ScrollReveal text="${sampleText.value}" />
</template>`
})
</script>

<template>
  <DocContent>
    <template #breadcrumb-title>
      <span class="text-foreground text-sm font-medium">Scroll Reveal</span>
    </template>

    <div class="flex flex-col gap-1.5">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-base tracking-tighter text-foreground">Scroll Reveal</h1>
      <p class="text-base md:text-lg text-muted-foreground mt-1 leading-relaxed">
        A progressive text component that scrubs word opacities naturally as it crosses viewport entry boundaries.
      </p>
    </div>

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
        <div class="rounded-xl overflow-hidden border border-border bg-background p-1.5">
          <CodeBlock language="bash" :code="installCommands.manual" class="border-0 m-0 bg-transparent" />
        </div>
      </div>
    </div>

    <template #preview>
      <div class="w-full flex items-center justify-center relative">
        <ScrollArea class="w-full h-125 rounded-xl border border-border bg-muted/10 relative">
          <div class="h-87.5 flex flex-col items-center justify-center text-muted-foreground gap-2 pointer-events-none">
            <svg class="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            <span class="text-xs font-mono uppercase tracking-wider">Scroll Down inside preview</span>
          </div>
          <div class="h-20"></div>
          <div class="px-6 pb-48">
            <ScrollReveal :text="sampleText" class="text-xl md:text-3xl max-w-2xl mx-auto" />
          </div>
          <div class="h-25"></div>
        </ScrollArea>
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

      <div class="flex flex-col gap-2 mb-6">
        <label class="text-sm font-medium text-foreground">Paragraph Payload</label>
        <textarea
            v-model="sampleText"
            rows="4"
            class="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted-foreground transition-all resize-none"
        ></textarea>
      </div>
    </template>
  </DocContent>
</template>